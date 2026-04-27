import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
  const { t } = useTranslation();

  const [mode, setMode] = useState<"emergency" | "news" | "line">("emergency");

  return (
    <main className="relative w-full h-full flex flex-col overflow-hidden">
      <section className="w-full h-[8svh] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] flex justify-between items-center">
        <button
          onClick={() => {
            setMode("emergency");
          }}
          className="relative w-[40%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
        >
          <p>{t("contact.emergency")}</p>

          {mode === "emergency" && (
            <div className="z-100 absolute -bottom-4.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
          )}
        </button>
        <button
          onClick={() => {
            setMode("news");
          }}
          className="relative w-[40%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
        >
          <p>{t("contact.news")}</p>

          {mode === "news" && (
            <div className="z-100 absolute -bottom-4.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
          )}
        </button>
        <button
          onClick={() => {
            setMode("line");
          }}
          className="relative w-[20%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
        >
          <p>{t("contact.line")}</p>

          {mode === "line" && (
            <div className="z-100 absolute -bottom-4.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
          )}
        </button>
      </section>

      <section className="w-full flex-1 flex flex-col gap-y-4 overflow-y-auto p-5"></section>
    </main>
  );
}
