// import { useTranslation } from "react-i18next";
// import { ml } from "../../utils/ml";
// import type { MLString } from "../../interfaces/content.interface";

// export default function TramCard({
//   place,
//   round,
//   time,
//   price,
// }: {
//   place: MLString;
//   round: "morning" | "afternoon";
//   time: string;
//   price: number;
// }) {
//   const { t, i18n } = useTranslation();
//   const lang = i18n.language;

//   return (
//     <div className="flex flex-col bg-white justify-center items-center w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-2 border-[#D9D9D9] rounded-[20px]">
//       <div className="w-full pl-7 pt-5 pb-3 pr-3">
//         <div className="flex justify-start items-center gap-x-3">
//           <div className="w-14 h-auto">
//             <img className="w-full h-full" src="/icons/travelPage/tram.svg" />
//           </div>
//           <div className="font-medium flex flex-col justify-center items-start">
//             <p className="font-bold text-[16px] text-black leading-5.5">
//               {ml(place, lang)}
//             </p>
//             <p className="text-[14px] text-[#543A14]">
//               {t(`form.${round}`)} {i18n.language !== "th" && " : "} {time}
//             </p>
//             <p className="text-[12px] text-[#ADADAD]">
//               {i18n.language === "th" && t("travel.price")} {price}{" "}
//               {t("travel.allRoute")}
//             </p>
//           </div>
//         </div>
//         <div className="w-full flex justify-end items-center">
//           <div className="text-[12px] border border-[#BF4B17] rounded-full px-3">
//             {t("menu.more")}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useTranslation } from "react-i18next";
import { formatTime12h, formatTime12hCn, ml } from "../../utils/ml";
import type { MLString } from "../../interfaces/content.interface";

export default function TramCard({
  isPast,
  place,
  // round,
  originTime,
  destinationTime,
  price,
}: {
  isPast?: boolean;
  place: MLString;
  // round: "morning" | "afternoon";
  originTime: string;
  destinationTime: string;
  price: number;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div
      className={`relative w-full ${isPast ? "opacity-50" : "opacity-100"}`}
      style={{ aspectRatio: "365/153" }}
    >
      <svg
        className="absolute inset-0 w-full h-full drop-shadow-[0_0_4px_rgba(50,33,21,0.15)]"
        viewBox="0 0 348 134"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M266 0.488281C266 3.12087 268.135 5.25488 270.768 5.25488C273.4 5.25464 275.534 3.12072 275.534 0.488281V0H328C339.046 2.06162e-06 348 8.95431 348 20V114C348 125.046 339.046 134 328 134H275.534V133.513C275.534 130.88 273.4 128.745 270.768 128.745C268.135 128.745 266 130.88 266 133.513V134H20C8.95431 134 0 125.046 0 114V20C0 8.95431 8.95431 0 20 0H266V0.488281Z"
          fill={isPast ? "#E6E6E6" : "white"}
        />

        <path
          d="M271 123.375C270.448 123.375 270 123.823 270 124.375V126.869C270 127.421 270.448 127.869 271 127.869C271.552 127.869 272 127.421 272 126.869V124.375C272 123.823 271.552 123.375 271 123.375ZM271 113.396C270.448 113.396 270 113.844 270 114.396V119.386C270 119.938 270.448 120.386 271 120.386C271.552 120.386 272 119.938 272 119.386V114.396C272 113.844 271.552 113.396 271 113.396ZM271 103.418C270.448 103.418 270 103.866 270 104.418V109.407C270 109.959 270.448 110.407 271 110.407C271.552 110.407 272 109.959 272 109.407V104.418C272 103.866 271.552 103.418 271 103.418ZM271 93.4404C270.448 93.4404 270 93.8881 270 94.4404V99.4297C270 99.9817 270.448 100.43 271 100.43C271.552 100.43 272 99.9817 272 99.4297V94.4404C272 93.8881 271.552 93.4404 271 93.4404ZM271 83.4619C270.448 83.4619 270 83.9097 270 84.4619V89.4512C270 90.0034 270.448 90.4512 271 90.4512C271.552 90.4512 272 90.0034 272 89.4512V84.4619C272 83.9097 271.552 83.4619 271 83.4619ZM271 73.4834C270.448 73.4834 270 73.9313 270 74.4834V79.4727C270 80.0249 270.448 80.4727 271 80.4727C271.552 80.4727 272 80.0249 272 79.4727V74.4834C272 73.9313 271.552 73.4834 271 73.4834ZM271 63.5059C270.448 63.5059 270 63.9536 270 64.5059V69.4951C270 70.0471 270.448 70.4951 271 70.4951C271.552 70.4951 272 70.0471 272 69.4951V64.5059C272 63.9536 271.552 63.5059 271 63.5059ZM271 53.5273C270.448 53.5273 270 53.9751 270 54.5273V59.5166C270 60.0688 270.448 60.5166 271 60.5166C271.552 60.5166 272 60.0688 272 59.5166V54.5273C272 53.9751 271.552 53.5273 271 53.5273ZM271 43.5488C270.448 43.5488 270 43.9967 270 44.5488V49.5381C270 50.0903 270.448 50.5381 271 50.5381C271.552 50.5381 272 50.0903 272 49.5381V44.5488C272 43.9967 271.552 43.5488 271 43.5488ZM271 33.5713C270.448 33.5713 270 34.019 270 34.5713V39.5596C270 40.1118 270.448 40.5596 271 40.5596C271.552 40.5596 272 40.1118 272 39.5596V34.5713C272 34.019 271.552 33.5713 271 33.5713ZM271 23.5928C270.448 23.5928 270 24.0405 270 24.5928V29.582C270 30.1342 270.448 30.582 271 30.582C271.552 30.582 272 30.1342 272 29.582V24.5928C272 24.0405 271.552 23.5928 271 23.5928ZM271 13.6143C270.448 13.6143 270 14.0621 270 14.6143V19.6035C270 20.1557 270.448 20.6035 271 20.6035C271.552 20.6035 272 20.1557 272 19.6035V14.6143C272 14.0621 271.552 13.6143 271 13.6143ZM271 6.13086C270.448 6.13086 270 6.57857 270 7.13086V9.625C270 10.1772 270.448 10.625 271 10.625C271.552 10.625 272 10.1772 272 9.625V7.13086C272 6.57857 271.552 6.13086 271 6.13086Z"
          fill={isPast ? "#BDBDBD" : "#F1F1F1"}
        />
      </svg>

      <div className="ml-px relative w-full h-full flex justify-start items-center">
        <div className="px-3 w-[85%] flex flex-col justify-center items-center">
          <div className=" w-full h-full flex justify-between items-center gap-x-2">
            <div className="w-[40%] flex flex-col justify-center items-center gap-y-1.5">
              <div className="w-[clamp(48px,7vw,48px)] h-auto shrink-0">
                <img
                  className="w-full h-full"
                  src="/icons/travelPage/orange-tram.svg"
                />
              </div>
              <div className="text-[#543A14] flex flex-col justify-center items-center">
                <p className="font-bold text-[clamp(18px,3.2vw,20px)] whitespace-nowrap">
                  {lang === "th"
                    ? `${originTime ?? "?"} น.`
                    : lang === "en"
                      ? formatTime12h(originTime)
                      : formatTime12hCn(originTime)}
                </p>
              </div>
            </div>

            <img
              className="w-[20%] pt-10 px-1"
              src="/icons/travelPage/new-right-arrow.svg"
            />

            <div className="w-[40%] flex flex-col justify-center items-center gap-y-1.5">
              <div className="w-[clamp(48px,7vw,48px)] h-auto shrink-0">
                <img
                  className="w-full h-full"
                  src="/icons/travelPage/blue-tram.svg"
                />
              </div>
              <div className="text-[#543A14] flex flex-col justify-center items-center">
                <p className="font-bold text-[clamp(18px,3.2vw,20px)] whitespace-nowrap">
                  {lang === "th"
                    ? `${destinationTime ?? "?"} น.`
                    : lang === "en"
                      ? formatTime12h(destinationTime)
                      : formatTime12hCn(destinationTime)}
                </p>
              </div>
            </div>
          </div>

          <p className="font-normal text-[clamp(14px,3.2vw,16px)] text-[#543A14] -mt-0.5 leading-4.5 text-center">
            {t("travel.boardingPoint")}
            {ml(place, lang)}
          </p>
        </div>

        <div className="px-3 h-full w-[24%] flex flex-col justify-center items-center text-center gap-y-3">
          <p className="text-black font-bold text-[clamp(14px,3.2vw,16px)] shrink-0">
            <span className="ml-1">
              {t("travel.price")} <br /> {price} {t("travel.baht")}
            </span>
          </p>

          <p className="font-normal text-black text-[clamp(14px,3.2vw,16px)]">
            {/* {t(`form.${round}`)} */}
            {t("travel.allRoute")}
          </p>
        </div>
      </div>
    </div>
  );
}
