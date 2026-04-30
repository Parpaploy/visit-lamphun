import { useState } from "react";
import ItemMenu from "../components/recommend-page/item-menu";
import ItemCard from "../components/recommend-page/item-card";
import { useTranslation } from "react-i18next";
import RecommendLoader from "../components/skeleton-load/recommend-loader";
import RecommendLoader2 from "../components/skeleton-load/recommend-loader-2";
import SubNavbar from "../components/navbar/sub-navbar";
import type { IRecommendMode } from "../interfaces/navbar.interface";
import { useRecommendItems } from "../hooks/useRecommendItems";

export default function RecommendedPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "th" | "en" | "cn";

  const [mode, setMode] = useState<IRecommendMode>("goods");
  const { items, loading } = useRecommendItems(mode);

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
        {loading ? (
          mode === "story" ? (
            Array.from({ length: 2 }).map((_, i) => <RecommendLoader key={i} />)
          ) : (
            Array.from({ length: 3 }).map((_, i) => <RecommendLoader2 key={i} />)
          )
        ) : items.length === 0 ? (
          <p className="text-center text-[13px] text-[#C6C6C6] mt-10">
            ยังไม่มีข้อมูล
          </p>
        ) : (
          items.map((item, idx) => {
            const title = item.title[lang] ?? item.title.th;
            const desc = item.desc[lang] ?? item.desc.th;
            return (
              <div
                key={item.id}
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {mode === "story" ? (
                  <ItemCard title={title} desc={desc} imgUrl={item.img} />
                ) : (
                  <ItemMenu title={title} desc={desc} imgUrl={item.img} />
                )}
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}
