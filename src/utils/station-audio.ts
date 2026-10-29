// Shared by the app and scripts/generate-station-audio.ts — keep it import-free
// so Node can load it directly.

export const STATION_AUDIO_LANGS = ["th", "en", "cn"] as const;
export type StationAudioLang = (typeof STATION_AUDIO_LANGS)[number];

type MLText = Partial<Record<StationAudioLang, string>>;

export const buildStationSpeechText = (
  header: MLText | undefined,
  desc: MLText | undefined,
  lang: string,
) => {
  const key = lang as StationAudioLang;
  return [header?.[key] ?? header?.th, desc?.[key] ?? desc?.th]
    .filter(Boolean)
    .join("\n");
};

const hashText = async (text: string) => {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

// Bump a language when its narration prompt or voice changes so old recordings
// are ignored. Not "v2": Cloudinary treats v<digits> path segments as a URL
// version and skips them.
const AUDIO_VERSION: Record<StationAudioLang, string> = {
  th: "guide-4",
  en: "guide-3",
  cn: "guide-3",
};

// Bump a single recording that came out wrong (Cloudinary unsigned uploads
// can't overwrite), e.g. the model repeated or ad-libbed part of the text.
const RETAKES: Record<string, number> = {
  "community:th": 4,
  "muan-chai:cn": 2,
};

// The id changes whenever the text changes, so edited popups never play stale audio.
export const stationAudioPublicId = async (
  stationId: string,
  lang: string,
  text: string,
) => {
  const version = AUDIO_VERSION[lang as StationAudioLang] ?? AUDIO_VERSION.th;
  const retake = RETAKES[`${stationId}:${lang}`];
  return `station-audio/${version}/${stationId}_${lang}_${await hashText(text)}${retake ? `_r${retake}` : ""}`;
};

export const stationAudioUrl = (cloudName: string, publicId: string) =>
  `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}.mp3`;
