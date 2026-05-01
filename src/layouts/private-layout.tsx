import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { LANGUAGES } from "../constant/language";
import { useTranslation } from "react-i18next";

export default function PrivateLayout() {
  const { i18n } = useTranslation();

  const [open, setOpen] = useState<boolean>(false);
  const [langReady, setLangReady] = useState<boolean>(false);

  const current =
    LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => setLangReady(true), 300);
    return () => {
      clearTimeout(timer);
      setLangReady(false);
    };
  }, [open]);

  return (
    <div className="relative w-full h-svh flex justify-center">
      <div className="absolute top-3 right-3 z-1000">
        <button
          className="bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-full w-8.5 h-8.5 flex items-center justify-center overflow-hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <img src={current.icon} className="w-full h-full object-cover" />
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-[-1]"
              onClick={() => setOpen(false)}
            />

            <div className="absolute top-12 right-0 bg-white rounded-xl shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] py-2 flex flex-row min-w-50">
              <svg
                className="absolute -top-3 right-1.5 w-6 h-4"
                viewBox="0 0 30 20"
                fill="white"
              >
                <path
                  d="M5 20 L15 5 L25 20 Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>

              {!langReady
                ? Array.from({ length: LANGUAGES.length }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2 px-4 py-2.5 aspect-square animate-pulse"
                    >
                      <div className="w-15 h-15 rounded-full bg-gray-200" />
                      <div className="h-3 w-8 rounded bg-gray-200" />
                    </div>
                  ))
                : LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setOpen(false);
                      }}
                      className={`w-full flex flex-col items-center gap-3 px-4 py-2.5 aspect-square transition-all ${
                        i18n.language === lang.code
                          ? "font-medium"
                          : "opacity-50"
                      }`}
                    >
                      <img
                        src={lang.icon}
                        className={`min-w-15 aspect-square shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-full ${
                          i18n.language === lang.code
                            ? "ring-3 ring-[#A1D6F5]/70"
                            : ""
                        }`}
                      />
                      <span className="text-[11px] whitespace-nowrap">
                        {lang.label}
                      </span>
                    </button>
                  ))}
            </div>
          </>
        )}
      </div>

      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
