import { useState } from "react";
import { useTranslation } from "react-i18next";
import SubNavbar from "../components/navbar/sub-navbar";
import type { IContactMode } from "../interfaces/navbar.interface";
import EmergencyCard from "../components/contact-page/emergency-card";
import { useEmergencyItems } from "../hooks/useEmergencyItems";

export default function ContactPage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<IContactMode>("emergency");
  const { items, loading } = useEmergencyItems();

  return (
    <main className="relative w-full h-full flex flex-col overflow-hidden">
      <SubNavbar
        mode={mode}
        setMode={setMode}
        mode1="emergency"
        mode2="news"
        mode3="line"
        mode1Name={t("contact.emergency")}
        mode2Name={t("contact.news")}
        mode3Name={t("contact.line")}
        isSmallOne={true}
      />

      <section className="w-full flex-1 overflow-y-auto space-y-4 p-7">
        {mode === "emergency" && (
          loading ? (
            <p className="text-center text-[13px] text-[#8B724E]">กำลังโหลด...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-[13px] text-[#C6C6C6]">ยังไม่มีข้อมูล</p>
          ) : (
            items.map((item) => (
              <EmergencyCard
                key={item.id}
                header={item.header}
                items={[
                  ...(item.address ? [{ type: "address" as const, text: item.address }] : []),
                  ...(item.hours ? [{ type: "hours" as const, text: item.hours }] : []),
                  ...item.phones.map((p) => ({ type: "phone" as const, text: p })),
                ]}
              />
            ))
          )
        )}

        {mode === "news" && (
          <>
            <div className="flex flex-col justify-between items-center gap-y-2 px-5 py-5 border-2 border-[#D9D9D9] rounded-[15px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
              <h1 className="text-[#104DB6] text-[24px] font-semibold">
                Facebook
              </h1>

              <div className="w-full">
                <img
                  className="w-full h-auto"
                  src="/images/contact-page/fb-pic.svg"
                />
              </div>

              <button
                onClick={() => {
                  window.open(
                    "https://www.facebook.com/TourismLamphunMunicipality/?locale=th_TH",
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
                className="text-[14px] font-medium mt-2 text-white bg-[#105DE2] border border-[#105DE2] rounded-full shadow-[0_4px_10px_0_rgba(0,0,0,0.125)] px-12 py-2"
              >
                {t("contact.page")}
              </button>
            </div>

            <div className="overflow-hidden border-2 border-[#D9D9D9] rounded-[15px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
              <h1 className="py-2 text-center w-full bg-[#FFF0DC] text-black font-bold text-[16px]">
                Tourist Care
              </h1>

              <div className="w-full h-full px-7 py-4 flex flex-col justify-between items-center gap-y-2">
                <div className="w-[95%] mb-2">
                  <img
                    className="w-full h-auto"
                    src="/images/contact-page/tourist-care-pic.svg"
                  />
                </div>

                <p className="text-[12px] text-center font-normal mb-1">
                  <span className="font-bold">Public Service</span>{" "}
                  ใส่ใจนักท่องเที่ยว เว็บไซต์สำหรับนักท่องเที่ยว ในการแจ้งเรื่อง
                  อุบัติเหตุ ความเจ็บป่วย อาหารปลอดภัย/คุ้มครองผู้บริโภค
                  เหตุเดือดร้อนจากสัตว์ และเรียกบริการฉุกเฉินจาก อปท.
                </p>

                <div className="w-32">
                  <img
                    className="w-full h-auto"
                    src="/images/contact-page/tourist-care-qr.svg"
                  />
                </div>

                <button
                  onClick={() => {
                    window.open(
                      "https://travel.cmonehealth.org/travel-app/#/?admin_area_id=13164&authorityId=4921",
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  className="text-[14px] font-medium mt-2 text-white bg-[#BF4B17] border border-[#BF4B17] rounded-full shadow-[0_4px_10px_0_rgba(0,0,0,0.125)] px-12 py-2"
                >
                  {t("contact.web")}
                </button>
              </div>
            </div>
          </>
        )}

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

            <button
              onClick={() => {
                window.open(
                  "https://line.me/ti/p/Xwfq5YWEKd",
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
              className="text-[14px] font-medium text-white bg-[#1DCC64] border border-[#1DCC64] rounded-full shadow-[0_4px_10px_0_rgba(0,0,0,0.125)] px-12 py-2"
            >
              {t("menu.friend")}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
