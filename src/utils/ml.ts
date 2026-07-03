import type { MLString } from "../interfaces/content.interface";

export function ml(s: MLString, lang: string): string {
  return s[lang as keyof MLString] || s.th || "";
}

export function ml2(s?: MLString, lang?: string): string {
  if (!s) return "-";

  // normalize lang เช่น en-US → en
  const shortLang = lang?.split("-")[0] as keyof MLString;

  return s[shortLang] || s[lang as keyof MLString] || s.th || s.en || "-";
}

export const formatTime12h = (time?: string) => {
  if (!time) return "?";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

export const formatTime12hCn = (time?: string) => {
  if (!time) return "?";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "下午" : "上午";
  const hour = h % 12 || 12;
  return `${period} ${hour}:${String(m).padStart(2, "0")}`;
};
