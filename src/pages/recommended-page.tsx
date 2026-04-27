import { useState, useEffect } from "react";
import ItemMenu from "../components/recommend-page/item-menu";
import ItemCard from "../components/recommend-page/item-card";
import { useTranslation } from "react-i18next";
import RecommendLoader from "../components/skeleton-load/recommend-loader";
import RecommendLoader2 from "../components/skeleton-load/recommend-loader-2";

export default function RecommendedPage() {
  const { t } = useTranslation();

  const [mode, setMode] = useState<"goods" | "places" | "story">("goods");
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageReady(true), 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative w-full h-full flex flex-col overflow-hidden">
      <section className="w-full h-[8svh] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] flex justify-between items-center">
        <button
          onClick={() => {
            setMode("goods");
          }}
          className="relative w-[33%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
        >
          <p>{t("recommend.goods")}</p>

          {mode === "goods" && (
            <div className="z-100 absolute -bottom-4.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
          )}
        </button>
        <button
          onClick={() => {
            setMode("places");
          }}
          className="relative w-[33%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
        >
          <p>{t("recommend.places")}</p>

          {mode === "places" && (
            <div className="z-100 absolute -bottom-4.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
          )}
        </button>
        <button
          onClick={() => {
            setMode("story");
          }}
          className="relative w-[33%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
        >
          <p>{t("recommend.story")}</p>

          {mode === "story" && (
            <div className="z-100 absolute -bottom-4.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
          )}
        </button>
      </section>

      <section
        className={`w-full flex-1 overflow-y-auto ${mode === "story" ? "px-10" : "px-5"} pt-3 pb-5`}
      >
        {!pageReady ? (
          mode === "story" ? (
            Array.from({ length: 2 }).map((_, i) => <RecommendLoader key={i} />)
          ) : (
            Array.from({ length: 3 }).map((_, i) => (
              <RecommendLoader2 key={i} />
            ))
          )
        ) : (
          <>
            {mode === "goods" && (
              <ItemMenu
                title="พระรอด"
                desc="กรุวัดมหาวัน วัดมหาวัน (มหาวันวนาราม)"
                imgUrl="/images/landingPage/main-logo.svg"
              />
            )}

            {mode === "places" && (
              <ItemMenu
                title="วัดพระธาตุหริภุญชัย"
                desc="วัดแห่งนี้เคยเป็นพระราชวังของพระเจ้าอาทิตยราชกษัตริย์ผู้ครองนครหริภุญชัยองค์ที่ 33"
                imgUrl="/images/landingPage/main-logo.svg"
              />
            )}

            {mode === "story" && (
              <ItemCard
                title="โคมแสนดวงที่เมืองลำพูน"
                desc="เป็นเทศกาลที่เกิดขึ้นช่วงเดือนตุลาคม ถึงเดือนพฤศจิกายน เชื่อมโยงประเพณียี่เป็งหรือลอยกระทง โดยทั่วทั้งเมืองลำพูนจะประดับประดาไปด้วยโคมล้านนาหลากสีสันสว่างไสว ตระการตา"
                imgUrl="/images/landingPage/main-logo.svg"
              />
            )}
          </>
        )}
      </section>
    </main>
  );
}
