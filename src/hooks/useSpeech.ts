import { useCallback, useEffect, useRef, useState } from "react";

const SPEECH_LANG_MAP: Record<string, string> = {
  th: "th-TH",
  en: "en-US",
  cn: "zh-CN",
};

const isSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

const pickVoice = (speechLang: string) => {
  const voices = window.speechSynthesis.getVoices();
  const prefix = speechLang.split("-")[0];
  return (
    voices.find((v) => v.lang.replace("_", "-") === speechLang) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ??
    null
  );
};

const MAX_CHUNK_LENGTH = 180;

// Chrome stops long utterances after ~15s, so speak the text in short pieces.
const splitIntoChunks = (text: string) => {
  const pieces = text.split(/(?<=[.!?。！？\n])\s*|\s+/).filter(Boolean);
  const chunks: string[] = [];
  let current = "";
  for (const piece of pieces) {
    const next = current ? `${current} ${piece}` : piece;
    if (next.length > MAX_CHUNK_LENGTH && current) {
      chunks.push(current);
      current = piece;
    } else {
      current = next;
    }
  }
  if (current) chunks.push(current);
  return chunks;
};

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const supported = isSupported();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.onended = null;
    audio.onerror = null;
    audio.pause();
    audioRef.current = null;
  };

  const stop = useCallback(() => {
    stopAudio();
    if (isSupported()) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speakWithBrowser = useCallback((text: string, lang: string) => {
    if (!isSupported() || !text.trim()) {
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const speechLang = SPEECH_LANG_MAP[lang] ?? SPEECH_LANG_MAP.th;
    const voice = pickVoice(speechLang);
    const chunks = splitIntoChunks(text);

    setSpeaking(true);
    chunks.forEach((chunk, i) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = speechLang;
      if (voice) utterance.voice = voice;
      utterance.rate = 0.95;
      utterance.onerror = (e) => {
        // cancel() fires these on the previous queue; don't let them flip state.
        if (e.error !== "interrupted" && e.error !== "canceled") {
          setSpeaking(false);
        }
      };
      if (i === chunks.length - 1) utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  // Plays pre-generated narration when available, otherwise the device voice.
  const speak = useCallback(
    (text: string, lang: string, audioUrl?: string | null) => {
      stopAudio();
      if (isSupported()) window.speechSynthesis.cancel();

      if (!audioUrl) {
        speakWithBrowser(text, lang);
        return;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      const fallback = () => {
        if (audioRef.current !== audio) return;
        audioRef.current = null;
        speakWithBrowser(text, lang);
      };
      audio.onended = () => {
        if (audioRef.current === audio) audioRef.current = null;
        setSpeaking(false);
      };
      audio.onerror = fallback;
      setSpeaking(true);
      audio.play().catch(fallback);
    },
    [speakWithBrowser],
  );

  useEffect(() => {
    if (!supported) return;
    // Voices load asynchronously on some browsers; touching the list warms it up.
    window.speechSynthesis.getVoices();
    return () => {
      stopAudio();
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  return { speak, stop, speaking, supported };
}
