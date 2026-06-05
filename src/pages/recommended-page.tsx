// import { useState } from "react";
// import ItemMenu from "../components/recommend-page/item-menu";
// import ItemCard from "../components/recommend-page/item-card";
// import { useTranslation } from "react-i18next";
// import RecommendLoader from "../components/skeleton-load/recommend-loader";
// import RecommendLoader2 from "../components/skeleton-load/recommend-loader-2";
// import SubNavbar from "../components/navbar/sub-navbar";
// import type { IRecommendMode } from "../interfaces/navbar.interface";
// import { useRecommendItems } from "../hooks/useRecommendItems";

// export default function RecommendedPage() {
//   const { t, i18n } = useTranslation();
//   const lang = i18n.language as "th" | "en" | "cn";

//   const [mode, setMode] = useState<IRecommendMode>("goods");
//   const { items, loading } = useRecommendItems(mode);

//   return (
//     <main className="relative w-full h-full flex flex-col overflow-hidden">
//       <SubNavbar
//         mode={mode}
//         setMode={setMode}
//         mode1="goods"
//         mode2="places"
//         mode3="story"
//         mode1Name={t("recommend.goods")}
//         mode2Name={t("recommend.places")}
//         mode3Name={t("recommend.story")}
//       />

//       <section
//         className={`w-full flex-1 overflow-y-auto ${mode === "story" ? "px-10" : "px-5"} pt-3 pb-5`}
//       >
//         {loading ? (
//           mode === "story" ? (
//             Array.from({ length: 2 }).map((_, i) => <RecommendLoader key={i} />)
//           ) : (
//             Array.from({ length: 3 }).map((_, i) => (
//               <RecommendLoader2 key={i} />
//             ))
//           )
//         ) : items.length === 0 ? (
//           <p className="text-center text-[13px] text-[#C6C6C6] mt-10">
//             ยังไม่มีข้อมูล
//           </p>
//         ) : (
//           items.map((item, idx) => {
//             const title = item.title[lang] ?? item.title.th;
//             const desc = item.desc[lang] ?? item.desc.th;
//             return (
//               <div
//                 key={item.id}
//                 className="animate-fade-in"
//                 style={{ animationDelay: `${idx * 60}ms` }}
//               >
//                 {mode === "story" ? (
//                   <ItemCard title={title} desc={desc} imgUrl={item.img} />
//                 ) : (
//                   <ItemMenu title={title} desc={desc} imgUrl={item.img} />
//                 )}
//               </div>
//             );
//           })
//         )}
//       </section>
//     </main>
//   );
// }

import { useEffect, useState } from "react";
import ItemMenu from "../components/recommend-page/item-menu";
import ItemCard from "../components/recommend-page/item-card";
import { useTranslation } from "react-i18next";
import RecommendLoader from "../components/skeleton-load/recommend-loader";
import RecommendLoader2 from "../components/skeleton-load/recommend-loader-2";
import SubNavbar from "../components/navbar/sub-navbar";
import type { IRecommendMode } from "../interfaces/navbar.interface";
import { useRecommendItems } from "../hooks/useRecommendItems";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useNavbarTitle } from "../hooks/useNavbar";

export default function RecommendedPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "th" | "en" | "cn";

  const navigate = useNavigate();

  const [leaving, setLeaving] = useState<boolean>(false);
  const [entering, setEntering] = useState<boolean>(true);

  const [mode, setMode] = useState<IRecommendMode>("goods");

  const { items, loading } = useRecommendItems(mode);
  const { setOverrideTitle } = useNavbarTitle();

  useEffect(() => {
    const timer = setTimeout(() => setEntering(false), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setLeaving(true);

    setTimeout(() => {
      setOverrideTitle(null);
      navigate("/app");
    }, 100);
  };

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
        isTabStyle={true}
        leaving={leaving}
      />

      <section
        className={`z-5 ${i18n.language === "en" ? "max-h-[82.5svh]" : "max-h-[85.5svh]"} shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)] flex-col absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-[25px] w-[95%] h-full flex items-center justify-start overflow-hidden bg-white transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          leaving || entering ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          onClick={handleClose}
          className="w-full bg-[#BF4B17] flex justify-center items-center text-white py-1"
        >
          <IoIosArrowDown size={24} />
        </div>

        <div
          className={`w-full h-full ${mode === "story" ? "px-10" : "px-5"} pt-3 pb-5 overflow-y-auto`}
        >
          {loading ? (
            mode === "story" ? (
              Array.from({ length: 2 }).map((_, i) => (
                <RecommendLoader key={i} />
              ))
            ) : (
              Array.from({ length: 3 }).map((_, i) => (
                <RecommendLoader2 key={i} />
              ))
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
        </div>
      </section>

      <div className="min-h-[77svh] max-w-107.5 mx-auto fixed bottom-0 w-full bg-[linear-gradient(-181deg,#FFE2A5_0%,#FBFCF0_36%,#FBFCF0_62%,#E6EFD8_100%)] z-1" />
    </main>
  );
}
