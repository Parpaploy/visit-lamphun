import { useState } from "react";
import ItemMenu from "../components/recommend-page/item-menu";
import ItemCard from "../components/recommend-page/item-card";
import { useTranslation } from "react-i18next";
import DayButton from "../components/travel-page/day-btn";
import DayBlock from "../components/travel-page/day-block";

export default function TravelPage() {
  const { t } = useTranslation();

  const [mode, setMode] = useState<"train" | "tram" | "other">("train");
  const [day, setDay] = useState<"weekday" | "weekend">("weekday");

  return (
    <main className="relative w-full h-full flex flex-col overflow-hidden">
      <section className="w-full h-[7svh] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] flex justify-between items-center">
        <button
          onClick={() => {
            setMode("train");
            setDay("weekday");
          }}
          className="relative w-[33%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
        >
          <p>{t("travel.train")}</p>

          {mode === "train" && (
            <div className="z-100 absolute -bottom-3.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
          )}
        </button>
        <button
          onClick={() => {
            setMode("tram");
            setDay("weekday");
          }}
          className="relative w-[33%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
        >
          <p>{t("travel.tram")}</p>

          {mode === "tram" && (
            <div className="z-100 absolute -bottom-3.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
          )}
        </button>
        <button
          onClick={() => {
            setMode("other");
            setDay("weekday");
          }}
          className="relative w-[33%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
        >
          <p>{t("travel.other")}</p>

          {mode === "other" && (
            <div className="z-100 absolute -bottom-3.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
          )}
        </button>
      </section>

      <section className="w-[90%] mx-auto flex justify-center items-center gap-x-4 border-b border-[#D9D9D9] py-5">
        {mode !== "tram" ? (
          <>
            <DayButton
              title={t("travel.weekday")}
              desc={t("travel.weekdayDesc")}
              day={day}
              week="weekday"
              setDay={setDay}
            />

            <DayButton
              title={t("travel.weekend")}
              desc={t("travel.weekendDesc")}
              day={day}
              week="weekend"
              setDay={setDay}
            />
          </>
        ) : (
          <>
            <DayBlock title={t("travel.open")} desc={t("travel.openDesc")} />
            <DayBlock title={t("travel.close")} desc={t("travel.closeDesc")} />
          </>
        )}
      </section>

      <section className="w-full flex-1 overflow-y-auto px-5 pt-3 pb-5">
        {mode === "train" && (
          <ItemMenu
            title="พระรอด"
            desc="กรุวัดมหาวัน วัดมหาวัน (มหาวันวนาราม)"
            imgUrl="/images/landingPage/main-logo.svg"
          />
        )}

        {mode === "tram" && (
          <ItemMenu
            title="วัดพระธาตุหริภุญชัย"
            desc="วัดแห่งนี้เคยเป็นพระราชวังของพระเจ้าอาทิตยราชกษัตริย์ผู้ครองนครหริภุญชัยองค์ที่ 33"
            imgUrl="/images/landingPage/main-logo.svg"
          />
        )}

        {mode === "other" && (
          <ItemCard
            title="โคมแสนดวงที่เมืองลำพูน"
            desc="เป็นเทศกาลที่เกิดขึ้นช่วงเดือนตุลาคม ถึงเดือนพฤศจิกายน เชื่อมโยงประเพณียี่เป็งหรือลอยกระทง โดยทั่วทั้งเมืองลำพูนจะประดับประดาไปด้วยโคมล้านนาหลากสีสันสว่างไสว ตระการตา"
            imgUrl="/images/landingPage/main-logo.svg"
          />
        )}
      </section>
    </main>
  );
}
