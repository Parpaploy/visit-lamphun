import type { MLString } from "../interfaces/content.interface";

export function ml(s: MLString, lang: string): string {
  return s[lang as keyof MLString] || s.th || "";
}
