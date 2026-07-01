// import { useTranslation } from "react-i18next";
// import { ml } from "../../utils/ml";
// import type { MLString } from "../../interfaces/content.interface";

// export default function OtherCard({
//   place,
//   desc,
//   desc2,
//   type = "van",
//   phone,
//   link,
//   lineLink,
// }: {
//   place: MLString;
//   desc: MLString;
//   desc2?: MLString;
//   type?: "van" | "tricycle" | "songthaew";
//   phone?: string;
//   link?: string;
//   lineLink?: string;
// }) {
//   const { t, i18n } = useTranslation();
//   const lang = i18n.language;

//   return (
//     <>
//       {type === "songthaew" && (
//         <div className="flex flex-col bg-white justify-center items-center w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-2 border-[#D9D9D9] rounded-[20px]">
//           <div className="w-full pl-7 pt-5 pb-3 pr-3">
//             <div className="flex justify-start items-center gap-x-3 mb-2">
//               <div className="w-14 h-auto">
//                 <img className="w-full h-full" src="/icons/travelPage/bus.svg" />
//               </div>
//               <div className="font-medium flex flex-col justify-center items-start gap-y-1">
//                 <p className="font-bold text-[16px] text-black leading-5.5">{ml(place, lang)}</p>
//                 <p className="text-[14px] text-[#543A14]">{ml(desc, lang)}</p>
//               </div>
//             </div>
//             <div className="w-full flex justify-end items-center">
//               <div onClick={() => link && window.open(link, "_blank", "noopener,noreferrer")} className={`text-[12px] border border-[#BF4B17] rounded-full px-3 ${link ? "cursor-pointer" : ""}`}>{t("menu.more")}</div>
//             </div>
//           </div>
//         </div>
//       )}

//       {type === "tricycle" && (
//         <div className="flex flex-col bg-white justify-center items-center w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-2 border-[#D9D9D9] rounded-[20px]">
//           <div className="w-full pl-7 pt-5 pb-3 pr-3">
//             <div className="flex justify-start items-start gap-x-3 mb-2">
//               <div className="w-20 h-auto">
//                 <img className="w-full h-full" src="/icons/travelPage/tricycle.svg" />
//               </div>
//               <div className="font-medium flex flex-col justify-center items-start gap-y-1">
//                 <p className="font-bold text-[16px] text-black leading-5.5">{ml(place, lang)}</p>
//                 <p className="text-[14px] text-[#543A14]">{ml(desc, lang)}</p>
//                 {phone && (
//                   <div className="flex justify-start items-center gap-x-2">
//                     <div className="w-5.5 h-5.5">
//                       <img className="w-full h-full" src="/icons/travelPage/phone-icon.svg" />
//                     </div>
//                     <p className="text-[14px] text-[#543A14]">{phone}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="w-full flex justify-end items-center">
//               <div onClick={() => link && window.open(link, "_blank", "noopener,noreferrer")} className={`text-[12px] border border-[#BF4B17] rounded-full px-3 ${link ? "cursor-pointer" : ""}`}>{t("menu.more")}</div>
//             </div>
//           </div>
//         </div>
//       )}

//       {type === "van" && (
//         <div className="flex flex-col bg-white justify-center items-center w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-2 border-[#D9D9D9] rounded-[20px]">
//           <div className="w-full pl-7 pt-5 pb-3 pr-3">
//             <div className="flex justify-start items-center gap-x-3 mb-2">
//               <div className="w-17 h-auto">
//                 <img className="w-full h-full" src="/icons/travelPage/tram.svg" />
//               </div>
//               <div className="font-medium flex flex-col justify-center items-start gap-y-1">
//                 <p className="font-bold text-[16px] text-black leading-5.5">{ml(place, lang)}</p>
//                 <p className="text-[14px] text-[#543A14]">{ml(desc, lang)}</p>
//               </div>
//             </div>
//             <div className="flex justify-start items-center gap-x-3 mb-2">
//               <div className="w-14 h-auto">
//                 <img className="w-full h-full" src="/icons/travelPage/line-qr.svg" />
//               </div>
//               <div className="font-medium flex flex-col justify-center items-start gap-y-1">
//                 <p className="text-[14px] text-[#543A14]">{desc2 ? ml(desc2, lang) : ""}</p>
//               </div>
//             </div>
//             <div className="w-full flex justify-end items-center gap-x-2">
//               {lineLink && (
//                 <div
//                   onClick={() => window.open(lineLink, "_blank", "noopener,noreferrer")}
//                   className="text-[12px] text-white bg-[#1DCC64] border border-[#1DCC64] rounded-full px-3 cursor-pointer"
//                 >
//                   {t("menu.friend")}
//                 </div>
//               )}
//               <div onClick={() => link && window.open(link, "_blank", "noopener,noreferrer")} className={`text-[12px] bg-white border border-[#BF4B17] rounded-full px-3 ${link ? "cursor-pointer" : ""}`}>{t("menu.more")}</div>
//             </div>
//           </div>
//         </div>
//       )}

//     </>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosArrowForward,
} from "react-icons/io";
import type { CardType, MLString } from "../../interfaces/content.interface";

const CARD_CONFIG: Record<
  CardType,
  {
    showRoute: boolean;
    showDepartureTime: boolean;
  }
> = {
  van: { showRoute: true, showDepartureTime: true },
  tricycle: { showRoute: true, showDepartureTime: true },
  songthaew: { showRoute: true, showDepartureTime: true },
  motorcycle: { showRoute: false, showDepartureTime: false },
};

export default function OtherCard({
  place,
  imgUrl,
  boardingPoint,
  route,
  departureTime,
  price,
  type = "van",
  phone,
  link,
  lineLink,
  detailScrollRef,
  isLast = true,
}: {
  place?: MLString;
  imgUrl: string;
  boardingPoint?: MLString;
  route?: MLString;
  departureTime?: MLString;
  price?: number;
  type?: CardType;
  phone?: string;
  link?: string;
  lineLink?: string;
  isLast?: boolean;
  detailScrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as keyof MLString;
  const config = CARD_CONFIG[type];

  const contentRef = useRef<HTMLDivElement>(null);

  const [isClamped, setIsClamped] = useState<boolean>(false);
  const [showFullDesc, setShowFullDesc] = useState<boolean>(false);

  const safeML = (data?: MLString) => {
    if (!data) return "-";
    return data?.[lang] || data?.th || data?.en || "-";
  };

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const check = () => {
      setIsClamped(el.scrollHeight > el.clientHeight + 2);
    };

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(check);
    });

    const observer = new ResizeObserver(check);
    observer.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [boardingPoint, route, departureTime, price, phone]);

  const smoothScrollTo = (
    container: HTMLElement,
    target: number,
    duration = 400,
  ) => {
    const start = container.scrollTop;
    const change = target - start;
    const startTime = performance.now();

    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOut(progress);

      container.scrollTop = start + change * eased;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const toggleReadMore = () => {
    setShowFullDesc((prev) => {
      const next = !prev;

      if (!prev) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const container = detailScrollRef.current;
            const el = contentRef.current;

            if (container && el) {
              const containerRect = container.getBoundingClientRect();
              const elRect = el.getBoundingClientRect();

              const offset =
                elRect.top - containerRect.top + container.scrollTop;

              const maxScroll = container.scrollHeight - container.clientHeight;

              const target = Math.max(
                0,
                Math.min(
                  offset - container.clientHeight / 2 + el.clientHeight / 2,
                  maxScroll,
                ),
              );

              smoothScrollTo(container, target, 220);
            }
          });
        });
      }

      return next;
    });
  };

  const BULLET_INDENT = "pl-2";

  const renderBullets = (data?: MLString) => {
    const text = safeML(data);
    if (!text || text === "-") return null;
    const lines = text.split("\n").filter((l) => l.trim() !== "");
    if (lines.length === 0) return null;
    return (
      <ul className={`list-none ${BULLET_INDENT}`}>
        {lines.map((line, idx) => (
          <li key={idx} className="text-[16px] flex items-start gap-x-1">
            <span className="text-black shrink-0">•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderSection = (title: string, data?: MLString) => {
    const bullets = renderBullets(data);
    if (!bullets) return null;
    return (
      <div className="mb-0.5">
        <p className="font-bold text-[16px] text-black mb-0.5">{title}</p>
        {bullets}
      </div>
    );
  };

  const open = (url?: string) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`w-full ${!isLast && "border-b border-[#D9D9D9]"} flex flex-col justify-start items-center gap-y-3 pb-4`}
    >
      <p className="text-[16px] text-[#543A14] font-bold mb-1">
        {safeML(place)}
      </p>

      <div className="w-full h-35 rounded-[18px] overflow-hidden">
        <img
          className="w-full h-full object-cover object-top"
          src={imgUrl}
          loading="lazy"
        />
      </div>

      <div
        ref={contentRef}
        className={`w-full px-4 text-start pt-1 font-normal text-black text-[16px] ${
          showFullDesc ? "" : "line-clamp-2"
        }`}
      >
        {renderSection(t("travel.boardingPoint"), boardingPoint)}
        {config.showRoute && renderSection(t("travel.route"), route)}
        {config.showDepartureTime &&
          renderSection(t("travel.departureTime"), departureTime)}

        <div className="mb-2">
          <p className="font-bold text-[16px] text-black">
            {t("travel.priceTitle")}
          </p>
          <ul className={`list-none ${BULLET_INDENT}`}>
            <li className="flex items-start gap-x-1">
              <span className="text-black shrink-0">•</span>
              <span>
                {price
                  ? `${t("travel.price")} ${price} ${t("form.baht")}`
                  : t("travel.noPrice")}
              </span>
            </li>
          </ul>
        </div>

        {phone && (
          <div className="mb-2">
            <p className="font-bold text-[16px] text-black">
              {t("travel.phoneTitle")}
            </p>
            <ul className={`list-none ${BULLET_INDENT}`}>
              <li className="flex items-start gap-x-1">
                <span className="text-black shrink-0">•</span>
                <span>
                  {t("travel.phone")} {phone}
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {showFullDesc && (
        <div className="w-full flex justify-center items-center gap-x-2">
          {lineLink && (
            <button
              onClick={() => open(lineLink)}
              className="text-[14px] font-medium text-white bg-[#1DCC64] border border-[#1DCC64] rounded-full cursor-pointer h-9 w-34"
            >
              {t("menu.friend")}
            </button>
          )}
          <button
            onClick={() => open(link)}
            className={`flex justify-center items-center gap-1 text-[14px] font-medium bg-[#BF4B17] text-white rounded-full h-9 w-34 ${
              link ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!link}
          >
            {t("homepage.goToActivity")} <IoIosArrowForward size={18} />
          </button>
        </div>
      )}

      {(isClamped || showFullDesc) && (
        <button
          onClick={toggleReadMore}
          className="relative z-50 mx-auto text-[#F48B3C] font-bold text-[14px] flex justify-center items-center gap-1"
        >
          {showFullDesc ? t("homepage.readLess") : t("homepage.readMore")}
          {showFullDesc ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </button>
      )}
    </div>
  );
}
