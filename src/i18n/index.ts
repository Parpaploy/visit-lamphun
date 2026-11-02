import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import th from "./locales/th.json";
import en from "./locales/en.json";
import cn from "./locales/cn.json";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      th: { translation: th },
      en: { translation: en },
      cn: { translation: cn },
    },
    // Remember the chosen language across reloads; first visit defaults to Thai.
    supportedLngs: ["th", "en", "cn"],
    fallbackLng: "th",
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
