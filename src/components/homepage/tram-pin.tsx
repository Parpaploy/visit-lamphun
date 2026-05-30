// import {
//   MAP_HEIGHT,
//   MAP_WIDTH,
//   STATION_PIN_MAP,
// } from "../../constant/homepage";

// export default function TramPin({
//   stationId,
//   //   tramNumber,
//   loaded,
// }: {
//   stationId: string | null;
//   //   tramNumber: string;
//   loaded: boolean;
// }) {
//   if (!stationId) return null;
//   const pin = STATION_PIN_MAP[stationId];
//   if (!pin) return null;
//   //   const xPct = (pin.x / MAP_WIDTH) * 100;
//   //   const yPct = (pin.y / MAP_HEIGHT) * 100;
//   const xPct = (pin.x / MAP_WIDTH) * 100 + (pin.offsetX ?? 0);
//   const yPct = (pin.y / MAP_HEIGHT) * 100 + (pin.offsetY ?? 5);

//   return (
//     // <div
//     //   className={`absolute z-30 -translate-x-1/2 -translate-y-full pointer-events-none transition-opacity duration-700 ease-in-out ${loaded ? "opacity-100" : "opacity-0"}`}
//     //   style={{ left: `${xPct}%`, top: `${yPct}%` }}
//     // >
//     //   <div className="flex flex-col items-center">
//     //     <div className="bg-[#BF4B17] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white whitespace-nowrap">
//     //       รถ {tramNumber}
//     //     </div>

//     //     <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-[#BF4B17]" />
//     //   </div>
//     // </div>

//     <div
//       className={`absolute z-30 -translate-x-1/2 -translate-y-full pointer-events-none transition-opacity duration-700 ease-in-out ${loaded ? "opacity-100" : "opacity-0"}`}
//       style={{ left: `${xPct}%`, top: `${yPct}%` }}
//     >
//       <div
//         className="w-full h-fit"
//         style={{ filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.25))" }}
//       >
//         <svg
//           width="58"
//           height="75"
//           viewBox="0 0 47 59"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M23.5 0.5C36.2025 0.5 46.5 10.7975 46.5 23.5C46.5 26.6317 45.2882 30.3909 43.3711 34.3018C41.4589 38.2026 38.868 42.2082 36.1621 45.8174C33.4565 49.4261 30.6451 52.6271 28.2988 54.9209C27.1247 56.0687 26.0756 56.981 25.2207 57.6025C24.7928 57.9137 24.423 58.1446 24.1182 58.2959C23.8019 58.4529 23.6024 58.5 23.5 58.5C23.3976 58.5 23.1981 58.4529 22.8818 58.2959C22.577 58.1446 22.2072 57.9137 21.7793 57.6025C20.9244 56.981 19.8753 56.0687 18.7012 54.9209C16.3549 52.6271 13.5435 49.4261 10.8379 45.8174C8.13202 42.2082 5.54109 38.2026 3.62891 34.3018C1.7118 30.3909 0.5 26.6317 0.5 23.5C0.5 10.7975 10.7975 0.5 23.5 0.5Z"
//             fill="white"
//             stroke="#3D240F"
//           />
//           <circle cx="23.5" cy="23.5" r="20.5" fill="#FF7300" />
//           <rect
//             x="13"
//             y="32.5"
//             width="5.2381"
//             height="6"
//             rx="2"
//             fill="#252215"
//           />
//           <rect
//             x="13.25"
//             y="32.75"
//             width="4.7381"
//             height="5.5"
//             rx="1.25"
//             stroke="#110B07"
//             stroke-width="0.5"
//           />
//           <rect x="13" y="34.5" width="5.2381" height="2" fill="#040302" />
//           <rect
//             x="29.7617"
//             y="32.5"
//             width="5.2381"
//             height="6"
//             rx="2"
//             fill="#252215"
//           />
//           <rect
//             x="30.0117"
//             y="32.75"
//             width="4.7381"
//             height="5.5"
//             rx="1.25"
//             stroke="#110B07"
//             stroke-width="0.5"
//           />
//           <rect x="29.7617" y="34.5" width="5.2381" height="2" fill="#040302" />
//           <path
//             d="M16.5 34.5H33.5C35.1569 34.5 36.5 33.1569 36.5 31.5V13C36.5 13 31.1343 21.3558 26.5 26C22.9674 29.5401 16.5 34.5 16.5 34.5Z"
//             fill="url(#paint0_linear_434_28686)"
//           />
//           <path
//             fill-rule="evenodd"
//             clip-rule="evenodd"
//             d="M11 13.5C11 11.8431 12.3431 10.5 14 10.5H18V9C18 8.44772 18.4477 8 19 8H27.5L24 10.5H29H34C35.3807 10.5 36.5 11.6193 36.5 13C36.5 13 31.1343 21.3558 26.5 26C22.9674 29.5401 16.5 34.5 16.5 34.5H14C12.3431 34.5 11 33.1569 11 31.5V13.5Z"
//             fill="#FBF1D9"
//           />
//           <path
//             d="M29 10.5V9C29 8.44772 28.5523 8 28 8H27.5L24 10.5H29Z"
//             fill="#E1D0B6"
//           />
//           <path
//             d="M28 8.25C28.6904 8.25 29.25 8.80964 29.25 9.5V10.25H34C35.5188 10.25 36.75 11.4812 36.75 13V31.5C36.75 33.2949 35.2949 34.75 33.5 34.75H14C12.2051 34.75 10.75 33.2949 10.75 31.5V13.5C10.75 11.7051 12.2051 10.25 14 10.25H17.75V9.5C17.75 8.80964 18.3096 8.25 19 8.25H28Z"
//             stroke="#261E18"
//             stroke-width="0.5"
//           />
//           <rect
//             x="10.8"
//             y="13.8"
//             width="25.9"
//             height="9.4"
//             fill="url(#paint1_linear_434_28686)"
//           />
//           <rect
//             x="10.8"
//             y="13.8"
//             width="25.9"
//             height="9.4"
//             stroke="#261E18"
//             stroke-width="0.4"
//           />
//           <path d="M11 20.5H36.5V22H11V20.5Z" fill="#090702" />
//           <path
//             fill-rule="evenodd"
//             clip-rule="evenodd"
//             d="M35 15H29.2676C28.7153 15 28.2676 15.4477 28.2676 16V21C28.2676 21.5523 28.7153 22 29.2676 22H30L35.25 15.25L35 15Z"
//             fill="#E2EEFF"
//           />
//           <path
//             d="M30 22H34.5C35.0523 22 35.5 21.5523 35.5 21V15.5L35.25 15.25L30 22Z"
//             fill="#DBE1EF"
//           />
//           <path
//             d="M26.2341 22C26.7864 22 27.2341 21.5523 27.2341 21V15.7341C27.2341 15.3287 26.9054 15 26.5 15L21.5 22H26.2341Z"
//             fill="#F4F1FF"
//           />
//           <path
//             d="M21.2021 15C20.6498 15 20.2021 15.4477 20.2021 16V21C20.2021 21.5523 20.6498 22 21.2021 22H21.5L26.5 15H21.2021Z"
//             fill="#FFFCFE"
//           />
//           <path
//             d="M18 22C18.5523 22 19 21.5523 19 21V16C19 15.4477 18.5523 15 18 15L13 22H18Z"
//             fill="#FFFCFE"
//           />
//           <path
//             d="M13 15C12.4477 15 12 15.4477 12 16V21C12 21.5523 12.4477 22 13 22L18 15H13Z"
//             fill="#FBF2FF"
//           />
//           <path
//             d="M12.9668 14.9502H18.2646C18.7065 14.9502 19.0645 15.3082 19.0645 15.75V21.25C19.0645 21.6918 18.7065 22.0498 18.2646 22.0498H12.9668C12.525 22.0498 12.167 21.6918 12.167 21.25V15.75C12.167 15.3082 12.525 14.9502 12.9668 14.9502ZM21.1689 14.9502H26.4668C26.9086 14.9502 27.2666 15.3082 27.2666 15.75V21.25C27.2666 21.6918 26.9086 22.0498 26.4668 22.0498H21.1689C20.7271 22.0498 20.3691 21.6918 20.3691 21.25V15.75C20.3691 15.3082 20.7271 14.9502 21.1689 14.9502ZM29.2344 14.9502H34.5322C34.9741 14.9502 35.332 15.3082 35.332 15.75V21.25C35.332 21.6918 34.9741 22.0498 34.5322 22.0498H29.2344C28.7925 22.0498 28.4346 21.6918 28.4346 21.25V15.75C28.4346 15.3082 28.7925 14.9502 29.2344 14.9502Z"
//             stroke="black"
//             stroke-width="0.4"
//           />
//           <path d="M18 10H29V10.5H18V10Z" fill="#755E4B" />
//           <path
//             fill-rule="evenodd"
//             clip-rule="evenodd"
//             d="M26.5 26H20.2C20.0895 26 20 26.0895 20 26.2V31.8398L26.5 26Z"
//             fill="#DCBB95"
//           />
//           <path
//             d="M26.8 32.5C26.9105 32.5 27 32.4105 27 32.3V26.2C27 26.0895 26.9105 26 26.8 26H26.5L20 31.8398L20 32.3C20 32.4105 20.0895 32.5 20.2 32.5H26.8Z"
//             fill="url(#paint2_linear_434_28686)"
//           />
//           <path
//             d="M26.7998 25.75C27.0483 25.75 27.25 25.9517 27.25 26.2002V32.2998C27.25 32.5483 27.0483 32.75 26.7998 32.75H20.2002C19.9517 32.75 19.75 32.5483 19.75 32.2998V26.2002C19.75 25.9517 19.9517 25.75 20.2002 25.75H26.7998Z"
//             stroke="#755E4B"
//             stroke-width="0.5"
//           />
//           <path d="M20 26.9286H27" stroke="#755E4B" stroke-width="0.5" />
//           <path d="M20 28.1286H27" stroke="#755E4B" stroke-width="0.5" />
//           <path d="M20 29.3286H27" stroke="#755E4B" stroke-width="0.5" />
//           <path d="M20 30.5286H27" stroke="#755E4B" stroke-width="0.5" />
//           <path d="M20 31.7286H27" stroke="#755E4B" stroke-width="0.5" />
//           <path
//             d="M23.5 24.7002C24.218 24.7002 24.7998 25.282 24.7998 26C24.7998 26.718 24.218 27.2998 23.5 27.2998C22.782 27.2998 22.2002 26.718 22.2002 26C22.2002 25.282 22.782 24.7002 23.5 24.7002Z"
//             fill="#E0D6CC"
//             stroke="#755E4B"
//             stroke-width="0.4"
//           />
//           <path
//             d="M33.25 25.7002C33.8299 25.7002 34.2998 26.1701 34.2998 26.75C34.2998 27.3299 33.8299 27.7998 33.25 27.7998C32.6701 27.7998 32.2002 27.3299 32.2002 26.75C32.2002 26.1701 32.6701 25.7002 33.25 25.7002Z"
//             fill="#E18231"
//             stroke="#43382F"
//             stroke-width="0.4"
//           />
//           <path
//             d="M14.25 25.7002C14.8299 25.7002 15.2998 26.1701 15.2998 26.75C15.2998 27.3299 14.8299 27.7998 14.25 27.7998C13.6701 27.7998 13.2002 27.3299 13.2002 26.75C13.2002 26.1701 13.6701 25.7002 14.25 25.7002Z"
//             fill="#F8B136"
//             stroke="#755E4B"
//             stroke-width="0.4"
//           />
//           <path
//             d="M33.25 28.4502C33.8299 28.4502 34.2998 28.9201 34.2998 29.5C34.2998 30.0799 33.8299 30.5498 33.25 30.5498C32.6701 30.5498 32.2002 30.0799 32.2002 29.5C32.2002 28.9201 32.6701 28.4502 33.25 28.4502Z"
//             fill="#BFAFAD"
//             stroke="#43382F"
//             stroke-width="0.4"
//           />
//           <path
//             d="M14.25 28.4502C14.8299 28.4502 15.2998 28.9201 15.2998 29.5C15.2998 30.0799 14.8299 30.5498 14.25 30.5498C13.6701 30.5498 13.2002 30.0799 13.2002 29.5C13.2002 28.9201 13.6701 28.4502 14.25 28.4502Z"
//             fill="#DED9D2"
//             stroke="#755E4B"
//             stroke-width="0.4"
//           />
//           <defs>
//             <linearGradient
//               id="paint0_linear_434_28686"
//               x1="23.75"
//               y1="8"
//               x2="23.75"
//               y2="34.5"
//               gradientUnits="userSpaceOnUse"
//             >
//               <stop offset="0.75" stop-color="#ECE0D1" />
//               <stop offset="1" stop-color="#CAADA5" />
//             </linearGradient>
//             <linearGradient
//               id="paint1_linear_434_28686"
//               x1="12"
//               y1="14.5"
//               x2="35.5"
//               y2="23"
//               gradientUnits="userSpaceOnUse"
//             >
//               <stop stop-color="#614D1E" />
//               <stop offset="0.45826" stop-color="#533E16" />
//               <stop offset="1" stop-color="#2B2B1A" />
//             </linearGradient>
//             <linearGradient
//               id="paint2_linear_434_28686"
//               x1="23.5"
//               y1="26"
//               x2="23.5"
//               y2="32.5"
//               gradientUnits="userSpaceOnUse"
//             >
//               <stop stop-color="#B69280" />
//               <stop offset="1" stop-color="#CFAE91" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>
//     </div>
//   );
// }

import {
  MAP_HEIGHT,
  MAP_WIDTH,
  STATION_PIN_MAP,
} from "../../constant/homepage";

export default function TramPin({
  stationId,
  //   tramNumber,
  loaded,
}: {
  stationId: string | null;
  //   tramNumber: string;
  loaded: boolean;
}) {
  if (!stationId) return null;
  const pin = STATION_PIN_MAP[stationId];
  if (!pin) return null;
  //   const xPct = (pin.x / MAP_WIDTH) * 100;
  //   const yPct = (pin.y / MAP_HEIGHT) * 100;
  const xPct = (pin.x / MAP_WIDTH) * 100 + (pin.offsetX ?? 0);
  const yPct = (pin.y / MAP_HEIGHT) * 100 + (pin.offsetY ?? 5);

  return (
    // <div
    //   className={`absolute z-30 -translate-x-1/2 -translate-y-full pointer-events-none transition-opacity duration-700 ease-in-out ${loaded ? "opacity-100" : "opacity-0"}`}
    //   style={{ left: `${xPct}%`, top: `${yPct}%` }}
    // >
    //   <div className="flex flex-col items-center">
    //     <div className="bg-[#BF4B17] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white whitespace-nowrap">
    //       รถ {tramNumber}
    //     </div>

    //     <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-[#BF4B17]" />
    //   </div>
    // </div>

    <div
      className={`absolute z-30 -translate-x-1/2 -translate-y-full pointer-events-none transition-opacity duration-700 ease-in-out ${loaded ? "opacity-100" : "opacity-0"}`}
      style={{ left: `${xPct}%`, top: `${yPct}%` }}
    >
      <div
        className="w-full h-fit"
        style={{ filter: "drop-shadow(0 0px 12.3px rgba(191,75,23,0.8))" }}
      >
        <img src="/icons/homepage/new-tram-pin.svg" />
      </div>
    </div>
  );
}
