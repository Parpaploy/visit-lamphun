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

      <section className="w-full flex-1 overflow-y-auto p-7">
        {mode === "line" && (
          <div className="min-h-full flex flex-col justify-between items-center gap-y-2 px-10 py-5 border-2 border-[#D9D9D9] rounded-[15px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
            <h1 className="text-[#11A04B] text-[24px] font-semibold">Line</h1>

            <div className="w-full">
              <img
                className="w-full h-auto"
                src="/images/contact-page/line-pic.svg"
              />
            </div>

            <p className="text-[12px] text-center">
              รายงานเหตุผิดปกติทั้งทางด้าน คน สัตว์
              สิ่งแวดล้อมและแจ้งเหตุงานบริการสาธารณะ
            </p>

            <div className="w-24">
              <img
                className="w-full h-auto"
                src="/images/contact-page/line-qr.svg"
              />
            </div>

            <p className="text-[12px] text-[#BF4B17] text-center">
              สามารถสแกน QR - Code หรือ เพิ่มเพื่อนได้ที่นี่
            </p>

            <div
              // onClick={() => {
              //   window.open(link, "_blank", "noopener,noreferrer");
              // }}
              className="text-[12px] text-white bg-[#1DCC64] border border-[#1DCC64] rounded-full shadow-[0_4px_10px_0_rgba(0,0,0,0.125)] px-12 py-2"
            >
              {t("menu.friend")}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
