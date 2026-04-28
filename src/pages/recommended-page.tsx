import { useState, useEffect } from "react";
import ItemMenu from "../components/recommend-page/item-menu";
import ItemCard from "../components/recommend-page/item-card";
import { useTranslation } from "react-i18next";
import RecommendLoader from "../components/skeleton-load/recommend-loader";
import RecommendLoader2 from "../components/skeleton-load/recommend-loader-2";
import SubNavbar from "../components/navbar/sub-navbar";
import type { IRecommendMode } from "../interfaces/navbar.interface";

export default function RecommendedPage() {
  const { t } = useTranslation();

  const [mode, setMode] = useState<IRecommendMode>("goods");
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageReady(true), 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative w-full h-full flex flex-col overflow-hidden">
      <SubNavbar
        mode={mode}
        setMode={setMode}
        mode1="goods"
        mode2="places"
        mode3="story"
        mode1Name={t("recommend.goods")}
        mode2Name={t("recommend.places")}
        mode3Name={t("recommend.story")}
      />

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
