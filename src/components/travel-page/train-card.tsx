// import { useTranslation } from "react-i18next";
// import { ml } from "../../utils/ml";
// import type { MLString } from "../../interfaces/content.interface";

// export default function TrainCard({
//   origin,
//   destination,
//   originTime,
//   destinationTime,
//   originStation,
//   destinationStation,
//   price,
//   desc,
// }: {
//   origin: MLString;
//   destination: MLString;
//   originTime: string;
//   destinationTime: string;
//   originStation: MLString;
//   destinationStation: MLString;
//   price: number;
//   desc: MLString;
// }) {
//   const { t, i18n } = useTranslation();
//   const lang = i18n.language;

//   return (
//     <div className="flex flex-col bg-white justify-center items-center w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-2 border-[#D9D9D9] rounded-[20px]">
//       <div className="w-full p-4">
//         <div className="w-full flex justify-between items-center gap-x-3 pb-4 border-b border-[#D9D9D9] border-dashed">
//           <div className="flex flex-col justify-center items-center gap-y-2">
//             <div className="flex justify-center items-center gap-x-3">
//               <div className="w-12 h-auto">
//                 <img
//                   className="w-full h-full"
//                   src="/icons/travelPage/blue-train.svg"
//                 />
//               </div>
//               <div className="font-medium text-[16px] text-[#543A14] flex flex-col justify-center items-start">
//                 <p className="whitespace-nowrap">{ml(origin, lang)}</p>
//                 <p>{originTime}</p>
//               </div>
//             </div>
//             <p className="whitespace-nowrap text-start font-medium text-[12px] text-[#ADADAD]">
//               {ml(originStation, lang)}
//             </p>
//           </div>

//           <div className="w-full mb-5">
//             <img className="w-full h-full" src="/icons/travelPage/arrow.svg" />
//           </div>

//           <div className="flex flex-col justify-center items-center gap-y-2">
//             <div className="flex justify-center items-center gap-x-3">
//               <div className="font-medium text-[16px] text-[#543A14] flex flex-col justify-center items-end">
//                 <p className="whitespace-nowrap">{ml(destination, lang)}</p>
//                 <p>{destinationTime}</p>
//               </div>
//               <div className="w-12 h-auto">
//                 <img
//                   className="w-full h-full"
//                   src="/icons/travelPage/orange-train.svg"
//                 />
//               </div>
//             </div>
//             <p className="whitespace-nowrap font-medium text-end text-[12px] text-[#ADADAD]">
//               {ml(destinationStation, lang)}
//             </p>
//           </div>
//         </div>

//         <div className="w-full flex justify-between items-center pt-4">
//           <p className="font-semibold text-[14px]">
//             <span className="text-[#D37A41] mr-1">{price}</span>
//             <span className="text-black">THB</span>
//           </p>
//           <p className="font-medium text-[12px]">{ml(desc, lang)}</p>
//           <div
//             onClick={() =>
//               window.open(
//                 "https://www.dticket.railway.co.th/DTicketPublicWeb/home/Home",
//                 "_blank",
//                 "noopener,noreferrer",
//               )
//             }
//             className="text-[12px] border border-[#BF4B17] rounded-full px-3"
//           >
//             {t("menu.more")}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useTranslation } from "react-i18next";
// import { ml } from "../../utils/ml";
// import type { MLString } from "../../interfaces/content.interface";

// export default function TrainCard({
//   // origin,
//   // destination,
//   originTime,
//   destinationTime,
//   originStation,
//   destinationStation,
//   price,
//   desc,
// }: {
//   // origin: MLString;
//   // destination: MLString;
//   originTime: string;
//   destinationTime: string;
//   originStation: MLString;
//   destinationStation: MLString;
//   price: number;
//   desc: MLString;
// }) {
//   const { t, i18n } = useTranslation();
//   const lang = i18n.language;

//   return (
//     <div className="relative w-full" style={{ aspectRatio: "365/153" }}>
//       <svg
//         className="absolute inset-0 w-full h-full drop-shadow-[0_0_4px_rgba(50,33,21,0.15)]"
//         viewBox="0 0 365 153"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         preserveAspectRatio="none"
//       >
//         <path
//           d="M315 1C315 3.76142 317.239 6 320 6C322.761 6 325 3.76142 325 1V0H345C356.046 5.79832e-06 365 8.95431 365 20V133C365 144.046 356.046 153 345 153H325V152C325 149.239 322.761 147 320 147C317.239 147 315 149.239 315 152V153H20C8.95431 153 5.87924e-07 144.046 0 133V20C0 8.95431 8.95431 0 20 0H315V1ZM320 141.554C319.448 141.554 319 142.001 319 142.554V145C319 145.552 319.448 146 320 146C320.552 146 321 145.552 321 145V142.554C321 142.001 320.552 141.554 320 141.554ZM320 131.768C319.448 131.768 319 132.215 319 132.768V137.661C319 138.213 319.448 138.661 320 138.661C320.552 138.661 321 138.213 321 137.661V132.768C321 132.215 320.552 131.768 320 131.768ZM320 121.982C319.448 121.982 319 122.43 319 122.982V127.875C319 128.427 319.448 128.875 320 128.875C320.552 128.875 321 128.427 321 127.875V122.982C321 122.43 320.552 121.982 320 121.982ZM320 112.196C319.448 112.196 319 112.644 319 113.196V118.089C319 118.641 319.448 119.089 320 119.089C320.552 119.089 321 118.641 321 118.089V113.196C321 112.644 320.552 112.196 320 112.196ZM320 102.411C319.448 102.411 319 102.859 319 103.411V108.304C319 108.856 319.448 109.304 320 109.304C320.552 109.304 321 108.856 321 108.304V103.411C321 102.859 320.552 102.411 320 102.411ZM320 92.625C319.448 92.625 319 93.0727 319 93.625V98.5176C319 99.0699 319.448 99.5176 320 99.5176C320.552 99.5176 321 99.0699 321 98.5176V93.625C321 93.0727 320.552 92.625 320 92.625ZM320 82.8389C319.448 82.8389 319 83.2868 319 83.8389V88.7324C319 89.2846 319.448 89.7324 320 89.7324C320.552 89.7324 321 89.2846 321 88.7324V83.8389C321 83.2868 320.552 82.8389 320 82.8389ZM320 73.0537C319.448 73.0537 319 73.5014 319 74.0537V78.9463C319 79.4986 319.448 79.9463 320 79.9463C320.552 79.9463 321 79.4986 321 78.9463V74.0537C321 73.5014 320.552 73.0537 320 73.0537ZM320 63.2676C319.448 63.2676 319 63.7154 319 64.2676V69.1611C319 69.7132 319.448 70.1611 320 70.1611C320.552 70.1611 321 69.7132 321 69.1611V64.2676C321 63.7154 320.552 63.2676 320 63.2676ZM320 53.4824C319.448 53.4824 319 53.9301 319 54.4824V59.375C319 59.9273 319.448 60.375 320 60.375C320.552 60.375 321 59.9273 321 59.375V54.4824C321 53.9301 320.552 53.4824 320 53.4824ZM320 43.6963C319.448 43.6963 319 44.1441 319 44.6963V49.5889C319 50.1412 319.448 50.5889 320 50.5889C320.552 50.5889 321 50.1412 321 49.5889V44.6963C321 44.1441 320.552 43.6963 320 43.6963ZM320 33.9111C319.448 33.9111 319 34.3588 319 34.9111V39.8037C319 40.3559 319.448 40.8037 320 40.8037C320.552 40.8037 321 40.3559 321 39.8037V34.9111C321 34.3588 320.552 33.9111 320 33.9111ZM320 24.125C319.448 24.125 319 24.5727 319 25.125V30.0176C319 30.5699 319.448 31.0176 320 31.0176C320.552 31.0176 321 30.5699 321 30.0176V25.125C321 24.5727 320.552 24.125 320 24.125ZM320 14.3389C319.448 14.3389 319 14.7868 319 15.3389V20.2324C319 20.7846 319.448 21.2324 320 21.2324C320.552 21.2324 321 20.7846 321 20.2324V15.3389C321 14.7868 320.552 14.3389 320 14.3389ZM320 7C319.448 7 319 7.44772 319 8V10.4463C319 10.9986 319.448 11.4463 320 11.4463C320.552 11.4463 321 10.9986 321 10.4463V8C321 7.44772 320.552 7 320 7Z"
//           fill="white"
//         />
//       </svg>

//       <div className="relative w-full h-full flex flex-col justify-between items-center pl-4 py-2 pr-14">
//         <div className="w-full h-full flex justify-between items-center gap-x-2">
//           <div className="w-full h-full flex flex-col justify-between items-start gap-y-1">
//             <p className="text-start font-medium text-[14px] text-[#543A14] leading-4.5">
//               {ml(originStation, lang)}
//             </p>

//             <div className="flex justify-center items-center gap-x-2">
//               <div className="w-10 h-auto">
//                 <img
//                   className="w-full h-full"
//                   src="/icons/travelPage/blue-train.svg"
//                 />
//               </div>
//               <div className="font-medium text-[14px] text-[#543A14] flex flex-col justify-center items-start">
//                 {/* <p className="whitespace-nowrap">{ml(origin, lang)}</p> */}
//                 <p className="text-black whitespace-nowrap -mb-0.5">
//                   {t("travel.departure")}
//                 </p>
//                 <p>{originTime}</p>
//               </div>
//             </div>
//           </div>
//           <div className="absolute w-8.5 left-[calc(50%-15px)] -translate-x-1/2 top-[calc(50%-10px)] -translate-y-1/2 mb-5">
//             <img
//               className="w-full h-full"
//               src="/icons/travelPage/new-right-arrow.svg"
//             />
//           </div>
//           <div className="w-full h-full flex flex-col justify-between items-end gap-y-1">
//             <p className="font-medium text-end text-[14px] text-[#543A14] leading-4.5">
//               {ml(destinationStation, lang)}
//             </p>

//             <div className="flex justify-center items-center gap-x-2">
//               <div className="w-10 h-auto">
//                 <img
//                   className="w-full h-full"
//                   src="/icons/travelPage/orange-train.svg"
//                 />
//               </div>

//               <div className="font-medium text-[14px] text-[#543A14] flex flex-col justify-center items-start">
//                 {/* <p className="whitespace-nowrap">{ml(destination, lang)}</p> */}
//                 <p className="text-black whitespace-nowrap -mb-0.5">
//                   {t("travel.arrival")}
//                 </p>
//                 <p>{destinationTime}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* <div className="w-full border-t border-[#D9D9D9] border-dashed" /> */}

//         <div className="border-t border-[#D9D9D9] border-dashed pt-1 w-full flex justify-between items-center mt-1">
//           <p className="font-medium text-black text-[14px]">{ml(desc, lang)}</p>

//           <p className="text-[#D37A41] font-semibold text-[14px]">
//             <span>{t("travel.price")}</span>
//             <span className="ml-1">{price}</span>
//             {/* <span className="text-black">{t("travel.baht")}</span> */}
//           </p>

//           {/* <div
//             onClick={() =>
//               window.open(
//                 "https://www.dticket.railway.co.th/DTicketPublicWeb/home/Home",
//                 "_blank",
//                 "noopener,noreferrer",
//               )
//             }
//             className="text-[12px] border border-[#BF4B17] rounded-full px-3"
//           >
//             {t("menu.more")}
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useTranslation } from "react-i18next";
// import { ml } from "../../utils/ml";
// import type { MLString } from "../../interfaces/content.interface";

// export default function TrainCard({
//   origin,
//   destination,
//   originTime,
//   destinationTime,
//   // originStation,
//   // destinationStation,
//   price,
//   desc,
// }: {
//   origin: MLString;
//   destination: MLString;
//   originTime: string;
//   destinationTime: string;
//   // originStation: MLString;
//   // destinationStation: MLString;
//   price: number;
//   desc: MLString;
// }) {
//   const { t, i18n } = useTranslation();
//   const lang = i18n.language;

//   return (
//     <div className="relative w-full" style={{ aspectRatio: "365/153" }}>
//       <svg
//         className="absolute inset-0 w-full h-full drop-shadow-[0_0_4px_rgba(50,33,21,0.15)]"
//         viewBox="0 0 365 153"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         preserveAspectRatio="xMidYMid meet"
//       >
//         <path
//           d="M315 1C315 3.76142 317.239 6 320 6C322.761 6 325 3.76142 325 1V0H345C356.046 5.79832e-06 365 8.95431 365 20V133C365 144.046 356.046 153 345 153H325V152C325 149.239 322.761 147 320 147C317.239 147 315 149.239 315 152V153H20C8.95431 153 5.87924e-07 144.046 0 133V20C0 8.95431 8.95431 0 20 0H315V1ZM320 141.554C319.448 141.554 319 142.001 319 142.554V145C319 145.552 319.448 146 320 146C320.552 146 321 145.552 321 145V142.554C321 142.001 320.552 141.554 320 141.554ZM320 131.768C319.448 131.768 319 132.215 319 132.768V137.661C319 138.213 319.448 138.661 320 138.661C320.552 138.661 321 138.213 321 137.661V132.768C321 132.215 320.552 131.768 320 131.768ZM320 121.982C319.448 121.982 319 122.43 319 122.982V127.875C319 128.427 319.448 128.875 320 128.875C320.552 128.875 321 128.427 321 127.875V122.982C321 122.43 320.552 121.982 320 121.982ZM320 112.196C319.448 112.196 319 112.644 319 113.196V118.089C319 118.641 319.448 119.089 320 119.089C320.552 119.089 321 118.641 321 118.089V113.196C321 112.644 320.552 112.196 320 112.196ZM320 102.411C319.448 102.411 319 102.859 319 103.411V108.304C319 108.856 319.448 109.304 320 109.304C320.552 109.304 321 108.856 321 108.304V103.411C321 102.859 320.552 102.411 320 102.411ZM320 92.625C319.448 92.625 319 93.0727 319 93.625V98.5176C319 99.0699 319.448 99.5176 320 99.5176C320.552 99.5176 321 99.0699 321 98.5176V93.625C321 93.0727 320.552 92.625 320 92.625ZM320 82.8389C319.448 82.8389 319 83.2868 319 83.8389V88.7324C319 89.2846 319.448 89.7324 320 89.7324C320.552 89.7324 321 89.2846 321 88.7324V83.8389C321 83.2868 320.552 82.8389 320 82.8389ZM320 73.0537C319.448 73.0537 319 73.5014 319 74.0537V78.9463C319 79.4986 319.448 79.9463 320 79.9463C320.552 79.9463 321 79.4986 321 78.9463V74.0537C321 73.5014 320.552 73.0537 320 73.0537ZM320 63.2676C319.448 63.2676 319 63.7154 319 64.2676V69.1611C319 69.7132 319.448 70.1611 320 70.1611C320.552 70.1611 321 69.7132 321 69.1611V64.2676C321 63.7154 320.552 63.2676 320 63.2676ZM320 53.4824C319.448 53.4824 319 53.9301 319 54.4824V59.375C319 59.9273 319.448 60.375 320 60.375C320.552 60.375 321 59.9273 321 59.375V54.4824C321 53.9301 320.552 53.4824 320 53.4824ZM320 43.6963C319.448 43.6963 319 44.1441 319 44.6963V49.5889C319 50.1412 319.448 50.5889 320 50.5889C320.552 50.5889 321 50.1412 321 49.5889V44.6963C321 44.1441 320.552 43.6963 320 43.6963ZM320 33.9111C319.448 33.9111 319 34.3588 319 34.9111V39.8037C319 40.3559 319.448 40.8037 320 40.8037C320.552 40.8037 321 40.3559 321 39.8037V34.9111C321 34.3588 320.552 33.9111 320 33.9111ZM320 24.125C319.448 24.125 319 24.5727 319 25.125V30.0176C319 30.5699 319.448 31.0176 320 31.0176C320.552 31.0176 321 30.5699 321 30.0176V25.125C321 24.5727 320.552 24.125 320 24.125ZM320 14.3389C319.448 14.3389 319 14.7868 319 15.3389V20.2324C319 20.7846 319.448 21.2324 320 21.2324C320.552 21.2324 321 20.7846 321 20.2324V15.3389C321 14.7868 320.552 14.3389 320 14.3389ZM320 7C319.448 7 319 7.44772 319 8V10.4463C319 10.9986 319.448 11.4463 320 11.4463C320.552 11.4463 321 10.9986 321 10.4463V8C321 7.44772 320.552 7 320 7Z"
//           fill="white"
//         />
//       </svg>

//       <div className="relative w-full h-full flex flex-col justify-between items-center pl-[4%] py-[2%] pr-[15%]">
//         <div className="w-full h-full flex justify-between items-center gap-x-2">
//           <div className="flex flex-col justify-center items-start gap-y-1 min-w-0">
//             <p className="text-start font-medium text-[clamp(14px,3.2vw,16px)] text-[#543A14] leading-tight line-clamp-2">
//               {/* {ml(originStation, lang)} */}
//               {ml(origin, lang)}
//             </p>
//             <div className="flex justify-center items-center gap-x-1.5">
//               <div className="w-[clamp(40px,7vw,48px)] h-auto shrink-0">
//                 <img
//                   className="w-full h-full"
//                   src="/icons/travelPage/blue-train.svg"
//                 />
//               </div>
//               <div className="font-medium text-[clamp(14px,3.2vw,16px)] text-[#543A14] flex flex-col justify-center items-start">
//                 <p className="text-black whitespace-nowrap font-normal -mb-0.5">
//                   {t("travel.departure")}
//                 </p>
//                 <p className="text-[16px]">{originTime}</p>
//               </div>
//             </div>
//           </div>

//           <div
//             className={`absolute left-1/2 -translate-x-1/2 ${i18n.language === "en" ? "ml-[-1.5%] top-[53%]" : i18n.language === "th" ? "ml-[-3.5%] top-[45%]" : "ml-[-5%] top-[45%]"} w-[clamp(32px,6vw,36px)] -translate-y-1/2 shrink-0 pointer-events-none`}
//           >
//             <img
//               className="w-full h-full"
//               src="/icons/travelPage/new-right-arrow.svg"
//             />
//           </div>

//           <div className="flex flex-col justify-center items-end gap-y-1 min-w-0">
//             <p className="font-medium text-end text-[clamp(14px,3.2vw,16px)] text-[#543A14] leading-tight line-clamp-2">
//               {/* {ml(destinationStation, lang)} */}
//               {ml(destination, lang)}
//             </p>
//             <div className="flex justify-center items-center gap-x-1.5">
//               <div className="w-[clamp(40px,7vw,48px)] h-auto shrink-0">
//                 <img
//                   className="w-full h-full"
//                   src="/icons/travelPage/orange-train.svg"
//                 />
//               </div>
//               <div className="font-medium text-[clamp(14px,3.2vw,16px)] text-[#543A14] flex flex-col justify-center items-start">
//                 <p className="text-black whitespace-nowrap font-normal -mb-0.5">
//                   {t("travel.arrival")}
//                 </p>
//                 <p className="text-[16px]">{destinationTime}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-[#D9D9D9] border-dashed pt-1 w-full flex justify-between items-center mt-1 gap-x-2">
//           <p className="font-medium text-black text-[clamp(14px,3.2vw,16px)] truncate">
//             {ml(desc, lang)}
//           </p>
//           <p className="text-[#D37A41] font-semibold text-[clamp(14px,3.2vw,16px)] whitespace-nowrap shrink-0">
//             <span>{t("travel.price")}</span>
//             <span className="ml-1">{price}</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useTranslation } from "react-i18next";
import { formatTime12h, formatTime12hCn, ml } from "../../utils/ml";
import type { MLString } from "../../interfaces/content.interface";

export default function TrainCard({
  isPast,
  origin,
  destination,
  originTime,
  destinationTime,
  // originStation,
  // destinationStation,
  price,
  desc,
}: {
  isPast?: boolean;
  origin: MLString;
  destination: MLString;
  originTime: string;
  destinationTime: string;
  // originStation: MLString;
  // destinationStation: MLString;
  price: number;
  desc: MLString;
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
        <div className="px-3 w-[85%] h-full flex justify-between items-center gap-x-2">
          <div className="w-[40%] flex flex-col justify-center items-center gap-y-1.5">
            <div className="w-[clamp(48px,7vw,48px)] h-auto shrink-0">
              <img
                className="w-full h-full"
                src="/icons/travelPage/blue-train.svg"
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
              <p className="font-normal text-[clamp(14px,3.2vw,16px)] text-[#543A14] -mt-1.5">
                {/* {ml(originStation, lang)} */}
                {ml(origin, lang)}
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
                src="/icons/travelPage/orange-train.svg"
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
              <p className="font-normal text-[clamp(14px,3.2vw,16px)] text-[#543A14] -mt-1.5">
                {/* {ml(destinationStation, lang)} */}
                {ml(destination, lang)}
              </p>
            </div>
          </div>
        </div>

        <div className="px-3 h-full w-[24%] flex flex-col justify-center items-center text-center gap-y-3">
          <p className="text-black font-bold text-[clamp(14px,3.2vw,16px)] shrink-0">
            <span className="ml-1">
              {t("travel.price")} <br /> {price} {t("travel.baht")}
            </span>
          </p>

          <p className="font-normal text-black text-[clamp(14px,3.2vw,16px)]">
            {ml(desc, lang)}
          </p>
        </div>
      </div>
    </div>
  );
}
