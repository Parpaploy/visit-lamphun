// Generates tour-guide narration for each station popup with Gemini TTS and
// uploads it to Cloudinary. Run: npm run audio:stations
// Re-running only generates audio for popups whose text changed.
// Pass station ids to limit the run, e.g. npm run audio:stations -- hariphunchai

import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import {
  STATION_AUDIO_LANGS,
  buildStationSpeechText,
  stationAudioPublicId,
  stationAudioUrl,
  type StationAudioLang,
} from "../src/utils/station-audio.ts";
import { pcmToWav, trimTrailingArtifact } from "./audio-utils.ts";

const env = process.env;
const GEMINI_API_KEY = env.GEMINI_API_KEY;
const MODEL = env.GEMINI_TTS_MODEL ?? "gemini-3.8-flash-tts";
const VOICE = env.GEMINI_TTS_VOICE ?? "Sulafat";
const CLOUD_NAME = env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!GEMINI_API_KEY || !CLOUD_NAME || !UPLOAD_PRESET) {
  console.error(
    "Missing GEMINI_API_KEY / VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET in .env",
  );
  process.exit(1);
}

const LANGUAGE_NAME: Record<StationAudioLang, string> = {
  th: "Thai",
  en: "English",
  cn: "Mandarin Chinese",
};

// Lamphun place names (e.g. สวนม่วนใจ๋) otherwise pull the voice into a Northern accent.
const ACCENT_NOTE: Record<StationAudioLang, string> = {
  th: "Use standard Central Thai pronunciation and accent throughout. Do not use Northern Thai (Kham Mueang / Lanna) dialect or accent, even for local place names; read every word exactly as it is spelled in standard Thai.",
  en: "",
  cn: "",
};

// TTS models reject system instructions, so direction goes in the prompt.
// Only the TRANSCRIPT section is meant to be spoken.
const buildPrompt = (text: string, lang: StationAudioLang) => `# AUDIO PROFILE
A warm, friendly narrator with the tone of a tour guide, reading a written description of a place in Lamphun, Thailand.

## DIRECTOR'S NOTES
Speak in ${LANGUAGE_NAME[lang]} with a relaxed, inviting pace.
${ACCENT_NOTE[lang]}
Speak ONLY the transcript below, word for word, exactly once. Do not add greetings, introductions, commentary or any words that are not in the transcript, and do not read these notes or any headings aloud.

## TRANSCRIPT
${text}`;

const SAMPLE_RATE = 24000;

class RateLimitError extends Error {}

// Rough speaking speed from earlier good recordings, used to catch takes where
// the model ad-libs well beyond the transcript.
const CHARS_PER_SECOND: Record<StationAudioLang, number> = {
  th: 11,
  en: 15,
  cn: 4.3,
};
const MAX_LENGTH_RATIO = 1.4;
const MAX_ATTEMPTS = 3;

const wavSeconds = (wav: Buffer) => (wav.length - 44) / 2 / SAMPLE_RATE;

const TRANSCRIBE_MODEL = env.GEMINI_TRANSCRIBE_MODEL ?? "gemini-3.8-flash";

const transcribe = async (wav: Buffer) => {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${TRANSCRIBE_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "audio/wav",
                  data: wav.toString("base64"),
                },
              },
              {
                text: "Transcribe this entire audio verbatim. Output only the transcript.",
              },
            ],
          },
        ],
      }),
    },
  );
  if (res.status === 429) throw new RateLimitError(await res.text());
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return (
    json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ??
    ""
  );
};

// Letters and digits only, so punctuation and spacing differences don't count.
const spokenLength = (s: string) => s.replace(/[^\p{L}\p{N}]/gu, "").length;
const MIN_TRANSCRIPT_RATIO = 0.75;
const MAX_TRANSCRIPT_RATIO = 1.25;

// Rejects takes where the model ad-libbed, repeated or dropped part of the text:
// first a cheap duration check, then a transcript-length comparison.
const generateChecked = async (text: string, lang: StationAudioLang) => {
  const expected = text.length / CHARS_PER_SECOND[lang];
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    // Some texts make the model ad-lib under direction; the last take sends
    // the plain text, which reads faithfully but with a less guided tone.
    const directed = attempt < MAX_ATTEMPTS;
    const wav = await generateSpeech(text, lang, directed);
    const seconds = wavSeconds(wav);
    if (seconds > expected * MAX_LENGTH_RATIO) {
      console.warn(
        `  ! take ${attempt} is ${seconds.toFixed(0)}s, expected ~${expected.toFixed(0)}s — retrying`,
      );
      continue;
    }
    const ratio = spokenLength(await transcribe(wav)) / spokenLength(text);
    if (ratio >= MIN_TRANSCRIPT_RATIO && ratio <= MAX_TRANSCRIPT_RATIO) {
      return wav;
    }
    console.warn(
      `  ! take ${attempt} transcript is ${ratio.toFixed(2)}× the text — retrying`,
    );
  }
  throw new Error("could not get a take that matches the text");
};

const generateSpeech = async (
  text: string,
  lang: StationAudioLang,
  directed = true,
) => {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: directed ? buildPrompt(text, lang) : text }] },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } },
          },
        },
      }),
    },
  );

  if (res.status === 429) throw new RateLimitError(await res.text());
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);

  const json = (await res.json()) as {
    candidates?: {
      content?: { parts?: { inlineData?: { data: string } }[] };
    }[];
  };
  const data = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
    ?.inlineData?.data;
  if (!data) throw new Error("Gemini returned no audio");
  return pcmToWav(
    trimTrailingArtifact(Buffer.from(data, "base64"), SAMPLE_RATE),
    SAMPLE_RATE,
  );
};

const uploadAudio = async (wav: Buffer, publicId: string) => {
  const form = new FormData();
  form.append("file", new Blob([wav], { type: "audio/wav" }), "audio.wav");
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("public_id", publicId);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
    { method: "POST", body: form },
  );
  if (!res.ok) throw new Error(`Cloudinary ${res.status}: ${await res.text()}`);
};

const audioExists = async (publicId: string) => {
  const res = await fetch(stationAudioUrl(CLOUD_NAME, publicId), {
    method: "HEAD",
  });
  return res.ok;
};

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});
const db = getFirestore(app);

const onlyStations = process.argv.slice(2);
const snap = await getDocs(collection(db, "stations"));
let created = 0;
let skipped = 0;

// Language-first so a limited daily quota covers every station in Thai first.
outer: for (const lang of STATION_AUDIO_LANGS) {
  for (const stationDoc of snap.docs) {
    if (onlyStations.length && !onlyStations.includes(stationDoc.id)) continue;
    const d = stationDoc.data();
    if (!d.header) continue;

    const text = buildStationSpeechText(d.header, d.desc, lang);
    if (!text) continue;

    const publicId = await stationAudioPublicId(stationDoc.id, lang, text);
    const label = `${stationDoc.id} [${lang}]`;

    if (await audioExists(publicId)) {
      skipped++;
      continue;
    }

    try {
      console.log(`Generating ${label} (${text.length} chars)…`);
      const wav = await generateChecked(text, lang);
      await uploadAudio(wav, publicId);
      created++;
      console.log(`  ✓ ${stationAudioUrl(CLOUD_NAME, publicId)}`);
    } catch (err) {
      if (err instanceof RateLimitError) {
        console.warn(
          "Gemini free-tier limit reached. Run again later to continue.",
        );
        break outer;
      }
      console.error(`  ✗ ${label}:`, err instanceof Error ? err.message : err);
    }
  }
}

console.log(`Done: ${created} generated, ${skipped} already up to date.`);
process.exit(0);
