// import { useState, useEffect, useRef } from "react";
// import { useTranslation } from "react-i18next";
// import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
// import { BG_MAP, isSaturday, STATION_ID_MAP } from "../constant/homepage";
// import HomepageLoader from "../components/skeleton-load/homepage-loader";
// import Hitbox from "../components/homepage/hitbox";
// import type { stationNumber } from "../interfaces/homepage.interface";
// import StationCard from "../components/homepage/station-card";
// import MainPopup from "../components/homepage/main-popup";
// import SubPopup from "../components/homepage/sub-popup";
// import { useStationPlaces } from "../hooks/useStationPlaces";
// import { useTramPosition } from "../hooks/useTramPosition";
// import TramPin from "../components/homepage/tram-pin";
// import type { Tram } from "../interfaces/tram.interface";
// import { fetchAllTrams } from "../services/tram.services";
// import InactivePopup from "../components/homepage/inactive-popup";
// import { formatCountdown } from "../utils/countdown";

// const getActiveBg = (lang: string, station: stationNumber) => {
//   if (station !== 0) {
//     if (station === 4) {
//       if (isSaturday) {
//         return `/images/homepage/${lang}/${lang}-${station}.svg`;
//       } else return `/images/homepage/${lang}/${lang}-${station}-weekend.svg`;
//     } else return `/images/homepage/${lang}/${lang}-${station}.svg`;
//   }
//   return BG_MAP[lang] || BG_MAP.th;
// };

// export default function Homepage() {
//   const { i18n, t } = useTranslation();
//   const [loaded, setLoaded] = useState<boolean>(false);
//   const [prevLang, setPrevLang] = useState(i18n.language);
//   const [prevBg, setPrevBg] = useState<string | null>(null);
//   const [stationExpanded, setStationExpanded] = useState<stationNumber>(0);
//   const [prevStation, setPrevStation] = useState<stationNumber>(0);
//   const [isExiting, setIsExiting] = useState<boolean>(false);
//   const [isPopup, setIsPopup] = useState<boolean>(false);
//   const [isSubPopup, setIsSubPopup] = useState<boolean>(false);
//   const [trams, setTrams] = useState<Tram[]>([]);
//   const [selected, setSelected] = useState<string>("");
//   const [isInactivePopup, setIsInactivePopup] = useState<boolean>(false);
//   const [countdown, setCountdown] = useState<number | null>(null);
//   const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const secondsRef = useRef<number>(600);

//   const handleBack = () => {
//     setIsExiting(true);
//     setTimeout(() => {
//       setStationExpanded(0);
//       setIsExiting(false);
//     }, 500);
//   };

//   if (i18n.language !== prevLang) {
//     setPrevBg(getActiveBg(prevLang, stationExpanded));
//     setPrevLang(i18n.language);
//     setLoaded(false);
//   }

//   if (stationExpanded !== prevStation) {
//     setPrevBg(getActiveBg(i18n.language, prevStation));
//     setPrevStation(stationExpanded);
//     setLoaded(false);
//   }

//   const lang = i18n.language;
//   const currentBg = getActiveBg(lang, stationExpanded);
//   const activeStationId =
//     stationExpanded !== 0 ? STATION_ID_MAP[stationExpanded] : null;
//   const { places, loading: placesLoading } = useStationPlaces(activeStationId);

//   const selectedTram = trams.find((t) => t.id === selected);
//   // const translatedLabel = selectedTram?.name ?? selected;
//   const isActive = selectedTram?.status === "active";
//   const tram = useTramPosition(selected);
//   const tramStationId = tram?.current_station_id ?? null;
//   const tramUpdatedAt = tram?.last_checkin_at ?? null;

//   const tramStationNumber = Object.entries(STATION_ID_MAP).find(
//     ([, id]) => id === tramStationId,
//   )?.[0];

//   useEffect(() => {
//     fetchAllTrams().then((data) => {
//       setTrams(data);

//       if (data.length > 0) {
//         setSelected(data[0].id);

//         if (data[0].status === "active") {
//           setIsPopup(true);
//         } else {
//           setIsInactivePopup(true);
//         }
//       }
//     });
//   }, []);

//   const prevTramStationIdRef = useRef<string | null>(null);

//   useEffect(() => {
//     if (!tramStationId || !tramUpdatedAt) return;

//     if (countdownRef.current) clearInterval(countdownRef.current);

//     const elapsed = Math.floor(
//       (Date.now() - tramUpdatedAt.toDate().getTime()) / 1000,
//     );
//     const remaining = Math.max(600 - elapsed, 0);

//     secondsRef.current = remaining;

//     countdownRef.current = setInterval(() => {
//       if (secondsRef.current <= 0) {
//         setCountdown(0);
//         clearInterval(countdownRef.current!);
//         return;
//       }
//       secondsRef.current -= 1;
//       setCountdown(secondsRef.current);
//     }, 1000);

//     return () => {
//       if (countdownRef.current) clearInterval(countdownRef.current);
//     };
//   }, [tramStationId, tramUpdatedAt]);

//   useEffect(() => {
//     if (!selectedTram) return;
//     if (selectedTram.status !== "active" || !tramStationId) return;

//     if (prevTramStationIdRef.current !== tramStationId) {
//       prevTramStationIdRef.current = tramStationId;
//       setIsPopup(true);
//     }
//   }, [tramStationId, selectedTram]);

//   return (
//     <main
//       className={`relative w-full h-full ${stationExpanded !== 0 ? "bg-[#FBFCF0]" : "bg-[linear-gradient(161deg,#FFE2A5_0%,#FBFCF0_22%,#FFFFFF_62%,#E6EFD8_100%)]"} overflow-hidden flex items-center justify-center`}
//     >
//       {!loaded && !prevBg && <HomepageLoader />}

//       <div className="relative w-full h-full max-h-screen aspect-393/615 flex items-center justify-center">
//         {stationExpanded === 0 && (
//           <>
//             <div
//               className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-700 ease-in-out ${
//                 loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
//               }`}
//               style={{ backgroundImage: `url('${currentBg}')` }}
//             >
//               <img
//                 key={currentBg}
//                 src={currentBg}
//                 className="hidden"
//                 onLoad={() => setLoaded(true)}
//                 alt="background-loader"
//               />
//             </div>
//             <Hitbox loaded={loaded} setStationExpanded={setStationExpanded} />
//             {loaded && <TramPin stationId={tramStationId} loaded={loaded} />}
//           </>
//         )}

//         {stationExpanded !== 0 && (
//           <>
//             <div
//               className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out ${
//                 isExiting
//                   ? "opacity-0 scale-95"
//                   : loaded
//                     ? "opacity-100 scale-100"
//                     : "opacity-0 scale-105"
//               }`}
//               style={{ backgroundImage: `url('${currentBg}')` }}
//             >
//               <img
//                 key={currentBg}
//                 src={currentBg}
//                 className="hidden"
//                 onLoad={() => setLoaded(true)}
//                 alt="background-loader"
//               />
//             </div>

//             <div className="z-10 absolute -bottom-1 left-0 w-full h-45 backdrop-blur-[5px] bg-[linear-gradient(0deg,rgba(255,255,255,0.8)_0%,transparent_100%)] mask-[linear-gradient(0deg,black_20%,transparent_100%)]" />

//             <div
//               className={`z-20 flex justify-start items-center gap-x-3 absolute -bottom-1 left-0 w-full h-45 overflow-x-auto px-7 py-5 transition-opacity duration-500 ${isExiting ? "opacity-0" : "opacity-100"}`}
//             >
//               {placesLoading && (
//                 <p className="text-[12px] text-[#8B724E]">
//                   {t("homepage.loading")}
//                 </p>
//               )}
//               {!placesLoading && places.length === 0 && (
//                 <p className="text-[12px] text-[#C6C6C6]">
//                   {t("homepage.noPlaces")}
//                 </p>
//               )}
//               {!placesLoading &&
//                 places.map((place) => (
//                   <StationCard
//                     key={place.id}
//                     name={
//                       place.name[i18n.language as keyof typeof place.name] ??
//                       place.name.th
//                     }
//                     img={place.img}
//                     link={place.link}
//                   />
//                 ))}
//             </div>
//           </>
//         )}

//         <div
//           className={`absolute inset-0 z-20 pointer-events-none p-2.5 transition-opacity duration-500 ease-in-out ${
//             stationExpanded === 0 && loaded ? "opacity-100" : "opacity-0"
//           }`}
//         >
//           <div className="absolute top-2 left-2.5 pointer-events-auto">
//             <p className="text-[12px] text-[#8B724E] font-medium">
//               {t("homepage.selectCar")}
//             </p>
//             <div className="relative inline-block mt-0.5">
//               <select
//                 value={selected}
//                 onChange={(e) => {
//                   const newSelected = e.target.value;
//                   setSelected(newSelected);

//                   const newTram = trams.find((t) => t.id === newSelected);

//                   if (newTram?.status === "active") {
//                     setIsPopup(true);
//                     setIsInactivePopup(false);
//                   } else {
//                     setIsInactivePopup(true);
//                     setIsPopup(false);
//                   }
//                 }}
//                 className="outline-none appearance-none border border-[#C6C6C6] bg-white/90 backdrop-blur-sm pl-3 pr-6 py-1 rounded-full text-[12px] text-[#543A14] font-medium transition-all duration-300"
//               >
//                 {trams.map((tram, index) => (
//                   <option key={tram.id} value={tram.id}>
//                     {t("homepage.car")} {index + 1}
//                   </option>
//                 ))}
//               </select>
//               <div className="text-[#C6C6C6] pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
//                 <IoIosArrowDown />
//               </div>
//             </div>
//           </div>

//           <div className="absolute top-2 right-2.5 flex flex-col items-end text-right pointer-events-auto">
//             <span className="text-[12px] text-[#8B724E] font-medium">
//               {countdown === 0 ? t("homepage.ready") : t("homepage.time")}
//             </span>
//             <div className="text-[12px] font-medium flex items-center gap-1 mt-1">
//               <span className="text-[#543A14]">
//                 {countdown === null
//                   ? `... ${t("homepage.minute")}`
//                   : countdown === 0
//                     ? t("homepage.wait")
//                     : `${formatCountdown(countdown)} ${t("homepage.minute")}`}
//               </span>
//               <button onClick={() => setIsPopup(true)} className="w-4 h-4">
//                 <img
//                   src="/icons/homepage/info-icon.svg"
//                   className="w-full h-full"
//                   alt="info"
//                 />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div
//           className={`absolute w-full top-0 left-0 z-20 flex justify-between items-center p-3 pb-0 transition-opacity duration-500 ease-in-out ${
//             stationExpanded !== 0 && loaded && !isExiting
//               ? "opacity-100"
//               : "opacity-0 pointer-events-none"
//           }`}
//         >
//           <div className="z-10 absolute top-0 left-0 w-full h-full backdrop-blur-[5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.8)_0%,transparent_100%)] mask-[linear-gradient(180deg,black_0%,transparent_100%)]" />

//           <button
//             onClick={handleBack}
//             className="z-11 shadow-[0_4px_4px_0_rgba(0,0,0,0.125)] p-0.75 rounded-full w-fit bg-white aspect-square border border-[#D9D9D9]"
//           >
//             <IoIosArrowBack className="text-[#543A14]" size={32} />
//           </button>

//           <button
//             onClick={() => setIsSubPopup(true)}
//             className="z-11 shadow-[0_4px_4px_0_rgba(0,0,0,0.125)] px-[16.5px] py-[5.5px] rounded-full w-fit bg-[#BF4B17] aspect-square border border-[#75521F]"
//           >
//             <div className="w-1.25">
//               <img className="w-full h-full" src="/icons/homepage/i-icon.svg" />
//             </div>
//           </button>
//         </div>
//       </div>

//       {isActive && isPopup && tramStationNumber && (
//         <MainPopup
//           setIsPopup={setIsPopup}
//           setIsSubPopup={setIsSubPopup}
//           number={Number(tramStationNumber) as stationNumber}
//           setStationExpanded={setStationExpanded}
//         />
//       )}

//       {isSubPopup && (
//         <SubPopup
//           setIsPopup={setIsPopup}
//           setIsSubPopup={setIsSubPopup}
//           stationId={activeStationId}
//         />
//       )}

//       {isInactivePopup && (
//         <InactivePopup setIsInactivePopup={setIsInactivePopup} />
//       )}
//     </main>
//   );
// }

// import { useState, useEffect, useRef } from "react";
// import { useTranslation } from "react-i18next";
// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
// import { BG_MAP, isSaturday, STATION_ID_MAP } from "../constant/homepage";
// import HomepageLoader from "../components/skeleton-load/homepage-loader";
// import Hitbox from "../components/homepage/hitbox";
// import type { stationNumber } from "../interfaces/homepage.interface";
// import StationCard from "../components/homepage/station-card";
// import { useStationPlaces } from "../hooks/useStationPlaces";
// import { useTramPosition } from "../hooks/useTramPosition";
// import TramPin from "../components/homepage/tram-pin";
// import type { Tram } from "../interfaces/tram.interface";
// import { fetchAllTrams } from "../services/tram.services";
// import InactivePopup from "../components/homepage/inactive-popup";
// import { useStationPopup } from "../hooks/useStationPopup";
// import type { MLString } from "../interfaces/content.interface";
// import { subscribeTransportStats } from "../services/stat.services";

// const getActiveBg = (lang: string, station: stationNumber) => {
//   if (station !== 0) {
//     if (station === 4) {
//       if (isSaturday) {
//         return `/images/homepage/${lang}/${lang}-${station}.svg`;
//       } else return `/images/homepage/${lang}/${lang}-${station}-weekend.svg`;
//     } else return `/images/homepage/${lang}/${lang}-${station}.svg`;
//   }
//   return BG_MAP[lang] || BG_MAP.th;
// };

// export default function Homepage() {
//   const { i18n, t } = useTranslation();
//   const [loaded, setLoaded] = useState<boolean>(false);
//   const [prevLang, setPrevLang] = useState(i18n.language);
//   const [prevBg, setPrevBg] = useState<string | null>(null);
//   const [stationExpanded, setStationExpanded] = useState<stationNumber>(0);
//   const [prevStation, setPrevStation] = useState<stationNumber>(0);
//   // const [isPopup, setIsPopup] = useState<boolean>(false);
//   // const [isSubPopup, setIsSubPopup] = useState<boolean>(false);
//   const [trams, setTrams] = useState<Tram[]>([]);
//   const [selected, setSelected] = useState<string>("");
//   const [isInactivePopup, setIsInactivePopup] = useState<boolean>(false);
//   // const [countdown, setCountdown] = useState<number | null>(null);
//   const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const secondsRef = useRef<number>(600);
//   const [mode, setMode] = useState<"store" | "activity" | "toilet" | null>(
//     null,
//   );
//   const [showFullDesc, setShowFullDesc] = useState<boolean>(false);
//   const [tramUsers, setTramUsers] = useState<number>(0);
//   const [visible, setVisible] = useState<boolean>(false);

//   // const handleBack = () => {
//   //   setIsExiting(true);
//   //   setTimeout(() => {
//   //     setStationExpanded(0);
//   //     setIsExiting(false);
//   //   }, 500);
//   // };

//   if (i18n.language !== prevLang) {
//     setPrevBg(getActiveBg(prevLang, stationExpanded));
//     setPrevLang(i18n.language);
//     setLoaded(false);
//   }

//   if (stationExpanded !== prevStation) {
//     setPrevBg(getActiveBg(i18n.language, prevStation));
//     setPrevStation(stationExpanded);
//     setLoaded(false);
//   }

//   const lang = i18n.language;
//   const currentBg = getActiveBg(lang, stationExpanded);
//   const activeStationId =
//     stationExpanded !== 0 ? STATION_ID_MAP[stationExpanded] : null;
//   const { places, loading: placesLoading } = useStationPlaces(activeStationId);

//   const selectedTram = trams.find((t) => t.id === selected);
//   // const translatedLabel = selectedTram?.name ?? selected;
//   // const isActive = selectedTram?.status === "active";
//   const tram = useTramPosition(selected);
//   const tramStationId = tram?.current_station_id ?? null;
//   const tramUpdatedAt = tram?.last_checkin_at ?? null;

//   const tramStationNumber = Object.entries(STATION_ID_MAP).find(
//     ([, id]) => id === tramStationId,
//   )?.[0];

//   // useEffect(() => {
//   //   fetchAllTrams().then((data) => {
//   //     setTrams(data);

//   //     if (data.length > 0) {
//   //       setSelected(data[0].id);

//   //       if (data[0].status === "active") {
//   //         setIsPopup(true);
//   //       } else {
//   //         setIsInactivePopup(true);
//   //       }
//   //     }
//   //   });
//   // }, []);

//   const { data } = useStationPopup(activeStationId);

//   useEffect(() => {
//     const unsub = subscribeTransportStats((stats) => {
//       setTramUsers(stats.tram);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => setVisible(true), 300);
//     return () => {
//       clearTimeout(timer);
//       setVisible(false);
//     };
//   }, [stationExpanded]);

//   useEffect(() => {
//     if (!tramStationNumber) return;

//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setStationExpanded(Number(tramStationNumber) as stationNumber);
//     setMode("store");
//   }, [tramStationNumber]);

//   useEffect(() => {
//     fetchAllTrams().then((data) => {
//       setTrams(data);

//       if (data.length > 0) {
//         setSelected(data[0].id);

//         if (data[0].status === "active") {
//           setIsInactivePopup(false);
//         } else {
//           setIsInactivePopup(true);
//         }
//       }
//     });

//     return () => {
//       setSelected("");
//       setTrams([]);
//     };
//   }, []);

//   const prevTramStationIdRef = useRef<string | null>(null);

//   useEffect(() => {
//     if (!tramStationId || !tramUpdatedAt) return;

//     if (countdownRef.current) clearInterval(countdownRef.current);

//     const elapsed = Math.floor(
//       (Date.now() - tramUpdatedAt.toDate().getTime()) / 1000,
//     );
//     const remaining = Math.max(600 - elapsed, 0);

//     secondsRef.current = remaining;

//     countdownRef.current = setInterval(() => {
//       if (secondsRef.current <= 0) {
//         // setCountdown(0);
//         clearInterval(countdownRef.current!);
//         return;
//       }
//       secondsRef.current -= 1;
//       // setCountdown(secondsRef.current);
//     }, 1000);

//     return () => {
//       if (countdownRef.current) clearInterval(countdownRef.current);
//     };
//   }, [tramStationId, tramUpdatedAt]);

//   useEffect(() => {
//     if (!selectedTram) return;
//     if (selectedTram.status !== "active" || !tramStationId) return;

//     if (prevTramStationIdRef.current !== tramStationId) {
//       prevTramStationIdRef.current = tramStationId;
//     }
//   }, [tramStationId, selectedTram]);

//   return (
//     <main className="relative w-full h-full overflow-hidden flex flex-col items-center justify-start">
//       {!loaded && !prevBg && <HomepageLoader />}

//       <div className="absolute top-0 left-0">
//         <div className="w-full min-h-[10svh] bg-[linear-gradient(68deg,#C07349_0%,#FC8B32_50%,#FBC859_100%)]" />
//       </div>

//       <div className="w-[90%] -mb-2 items-end flex justify-center gap-1 pt-3">
//         <div
//           onClick={() => {
//             setMode("store");
//             if (tramStationId && stationExpanded === 0) {
//               const stationNum = Object.entries(STATION_ID_MAP).find(
//                 ([, id]) => id === tramStationId,
//               )?.[0];
//               if (stationNum) {
//                 setStationExpanded(Number(stationNum) as stationNumber);
//               }
//             }
//           }}
//           className={`transition-all duration-200 ${i18n.language === "th" ? "whitespace-nowrap" : "whitespace-normal wrap-break-word"} ${
//             mode === "store"
//               ? "shadow-[0_0px_12.3px_0_rgba(191,75,23)] py-3 text-white font-bold bg-[#BF4B17]"
//               : "py-2 bg-white/80 text-black font-normal"
//           } w-full text-[16px] rounded-t-[15px] text-center px-1`}
//         >
//           {t("homepage.storeNearMe")}
//         </div>

//         <div
//           onClick={() => {
//             setMode("activity");
//             if (tramStationId && stationExpanded === 0) {
//               const stationNum = Object.entries(STATION_ID_MAP).find(
//                 ([, id]) => id === tramStationId,
//               )?.[0];
//               if (stationNum) {
//                 setStationExpanded(Number(stationNum) as stationNumber);
//               }
//             }
//           }}
//           className={`transition-all duration-200 ${i18n.language === "th" ? "whitespace-nowrap" : "whitespace-normal wrap-break-word"} ${
//             mode === "activity"
//               ? "shadow-[0_0px_12.3px_0_rgba(191,75,23)] py-3 text-white font-bold bg-[#BF4B17]"
//               : "py-2 bg-white/80 text-black font-normal"
//           } w-full text-[16px] rounded-t-[15px] text-center px-1`}
//         >
//           {t("homepage.activityNearMe")}
//         </div>

//         <div
//           onClick={() => {
//             setMode("toilet");
//             if (tramStationId && stationExpanded === 0) {
//               const stationNum = Object.entries(STATION_ID_MAP).find(
//                 ([, id]) => id === tramStationId,
//               )?.[0];
//               if (stationNum) {
//                 setStationExpanded(Number(stationNum) as stationNumber);
//               }
//             }
//           }}
//           className={`transition-all duration-200 ${i18n.language === "th" ? "whitespace-nowrap" : "whitespace-normal wrap-break-word"} ${
//             mode === "toilet"
//               ? "shadow-[0_0px_12.3px_0_rgba(191,75,23)] py-3 text-white font-bold bg-[#BF4B17]"
//               : "py-2 bg-white/80 text-black font-normal"
//           } w-full text-[16px] rounded-t-[15px] text-center px-1`}
//         >
//           {t("homepage.toiletNearMe")}
//         </div>
//       </div>

//       <div
//         className={`mt-1 overflow-y-auto rounded-t-[15px] relative w-full h-full flex flex-col items-center justify-start bg-[linear-gradient(-181deg,#FFE2A5_0%,#FBFCF0_22%,#FBFCF0_62%,#E6EFD8_100%)] transition-opacity duration-350 ease-in-out ${
//           mode === null
//             ? "opacity-100 pointer-events-auto"
//             : "opacity-0 pointer-events-none"
//         }`}
//       >
//         <div className="w-full relative pt-4 bg-[linear-gradient(-181deg,#FFE2A5_0%,#FBFCF0_36%,#FBFCF0_62%,#E6EFD8_100%)]">
//           {stationExpanded === 0 && (
//             <>
//               <div className="z-20 relative flex flex-col justify-center items-center text-[16px] font-medium">
//                 <p className="text-[#8B724E]">
//                   {t("homepage.tramUsers", { count: tramUsers })}
//                 </p>
//                 <p className="text-[#543A14]">รถรางจะออกเวลา 09.00น.</p>
//               </div>

//               <div
//                 className="pointer-events-none absolute -top-1 left-0 w-full h-20 z-10"
//                 style={{
//                   background:
//                     "linear-gradient(180deg, rgba(255,254,248,1) 32%, rgba(255,254,248,0) 100%",
//                 }}
//               />

//               <div className="relative w-full mt-1">
//                 <img
//                   key={currentBg}
//                   src={currentBg}
//                   className={`w-full h-auto block transition-all duration-700 ease-in-out ${
//                     loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
//                   }`}
//                   onLoad={() => setLoaded(true)}
//                   alt="background"
//                 />

//                 <div className="absolute inset-0">
//                   <Hitbox
//                     loaded={loaded}
//                     setStationExpanded={setStationExpanded}
//                     setMode={setMode}
//                   />
//                   {loaded && (
//                     <TramPin stationId={tramStationId} loaded={loaded} />
//                   )}
//                 </div>
//               </div>
//             </>
//           )}

//           {/* <div
//               className={`absolute inset-0 z-20 pointer-events-none p-2.5 transition-opacity duration-500 ease-in-out ${
//                 stationExpanded === 0 && loaded ? "opacity-100" : "opacity-0"
//               }`}
//             >
//               <div className="absolute top-2 left-2.5 pointer-events-auto">
//                 <p className="text-[12px] text-[#8B724E] font-medium">
//                   {t("homepage.selectCar")}
//                 </p>
//                 <div className="relative inline-block mt-0.5">
//                   <select
//                     value={selected}
//                     onChange={(e) => {
//                       const newSelected = e.target.value;
//                       setSelected(newSelected);

//                       const newTram = trams.find((t) => t.id === newSelected);

//                       if (newTram?.status === "active") {
//                         setIsPopup(true);
//                         setIsInactivePopup(false);
//                       } else {
//                         setIsInactivePopup(true);
//                         setIsPopup(false);
//                       }
//                     }}
//                     className="outline-none appearance-none border border-[#C6C6C6] bg-white/90 backdrop-blur-sm pl-3 pr-6 py-1 rounded-full text-[12px] text-[#543A14] font-medium transition-all duration-300"
//                   >
//                     {trams.map((tram, index) => (
//                       <option key={tram.id} value={tram.id}>
//                         {t("homepage.car")} {index + 1}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="text-[#C6C6C6] pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
//                     <IoIosArrowDown />
//                   </div>
//                 </div>
//               </div>

//               <div className="absolute top-2 right-2.5 flex flex-col items-end text-right pointer-events-auto">
//                 <span className="text-[12px] text-[#8B724E] font-medium">
//                   {countdown === 0 ? t("homepage.ready") : t("homepage.time")}
//                 </span>
//                 <div className="text-[12px] font-medium flex items-center gap-1 mt-1">
//                   <span className="text-[#543A14]">
//                     {countdown === null
//                       ? `... ${t("homepage.minute")}`
//                       : countdown === 0
//                         ? t("homepage.wait")
//                         : `${formatCountdown(countdown)} ${t("homepage.minute")}`}
//                   </span>
//                   <button onClick={() => setIsPopup(true)} className="w-4 h-4">
//                     <img
//                       src="/icons/homepage/info-icon.svg"
//                       className="w-full h-full"
//                       alt="info"
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div> */}
//         </div>
//       </div>

//       <div
//         className={`max-h-[86svh] shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)] flex-col absolute bottom-0 rounded-t-[15px] w-[95%] h-full flex items-center justify-start overflow-hidden bg-white transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] ${
//           mode !== null ? "translate-y-0" : "translate-y-full"
//         }`}
//         style={{ pointerEvents: mode !== null ? "auto" : "none" }}
//       >
//         <div
//           onClick={() => {
//             setMode(null);
//             setStationExpanded(0);
//           }}
//           className="w-full bg-[#BF4B17] flex justify-center items-center text-white py-1"
//         >
//           <IoIosArrowDown size={24} />
//         </div>
//         <div className="w-full overflow-y-auto h-full py-7">
//           {stationExpanded !== 0 && (
//             <>
//               {!visible ? (
//                 <div className="flex flex-col items-center gap-4 w-full px-5">
//                   <div className="h-5 w-3/4 bg-[#E5D5C0] rounded-full animate-pulse mb-5" />
//                   <div className="w-full min-h-42 aspect-video bg-[#E5D5C0] rounded-xl animate-pulse" />
//                   <div className="w-full flex flex-col gap-2 mt-4">
//                     <div className="h-4 w-full bg-[#E5D5C0] rounded-full animate-pulse" />
//                     <div className="h-4 w-5/6 bg-[#E5D5C0] rounded-full animate-pulse" />
//                     <div className="h-4 w-4/6 bg-[#E5D5C0] rounded-full animate-pulse" />
//                     <div className="h-4 mx-auto w-2/6 bg-[#E5D5C0] rounded-full animate-pulse" />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center gap-4 transition-all duration-300 ease-in-out opacity-100 translate-y-0">
//                   <div className="px-5 flex flex-col justify-center items-center text-center">
//                     <h1 className="text-[#543A14] text-[16px] font-bold mb-7">
//                       {data?.header[i18n.language as keyof MLString] ??
//                         data?.header.th}
//                     </h1>
//                     <img
//                       className="min-w-full w-full min-h-42 aspect-video object-cover rounded-xl"
//                       src={data?.img}
//                     />
//                     <div className="text-[#543A14] text-[16px] font-normal mt-4">
//                       <p className={`${showFullDesc ? "" : "line-clamp-3"}`}>
//                         {data?.desc[i18n.language as keyof MLString] ??
//                           data?.desc.th}
//                       </p>
//                       <button
//                         onClick={() => setShowFullDesc(!showFullDesc)}
//                         className="mx-auto text-[#F48B3C] text-[14px] mt-1 flex justify-center items-center gap-1"
//                       >
//                         {showFullDesc
//                           ? t("homepage.readLess")
//                           : t("homepage.readMore")}
//                         {showFullDesc ? <IoIosArrowUp /> : <IoIosArrowDown />}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {mode === "store" && (
//                 <div className="pl-5 flex justify-start items-center gap-x-3 w-full overflow-x-auto px-2 py-2">
//                   {placesLoading && (
//                     <p className="text-[12px] text-[#8B724E]">
//                       {t("homepage.loading")}
//                     </p>
//                   )}
//                   {!placesLoading && places.length === 0 && (
//                     <p className="text-[12px] text-[#C6C6C6]">
//                       {t("homepage.noPlaces")}
//                     </p>
//                   )}
//                   {!placesLoading &&
//                     places.map((place) => (
//                       <StationCard
//                         key={place.id}
//                         name={
//                           place.name[
//                             i18n.language as keyof typeof place.name
//                           ] ?? place.name.th
//                         }
//                         img={place.img}
//                         link={place.link}
//                       />
//                     ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* {isActive && isPopup && tramStationNumber && (
//         <MainPopup
//           setIsPopup={setIsPopup}
//           setIsSubPopup={setIsSubPopup}
//           number={Number(tramStationNumber) as stationNumber}
//           setStationExpanded={setStationExpanded}
//         />
//       )}

//       {isSubPopup && (
//         <SubPopup
//           setIsPopup={setIsPopup}
//           setIsSubPopup={setIsSubPopup}
//           stationId={activeStationId}
//         />
//       )} */}

//       {isInactivePopup && (
//         <InactivePopup setIsInactivePopup={setIsInactivePopup} />
//       )}
//     </main>
//   );
// }

// import { useState, useEffect, useRef, startTransition } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   IoIosArrowDown,
//   IoIosArrowUp,
//   IoIosArrowForward,
// } from "react-icons/io";
// import { BG_MAP, moreKeyMap, STATION_ID_MAP } from "../constant/homepage";
// import HomepageLoader from "../components/skeleton-load/homepage-loader";
// import Hitbox from "../components/homepage/hitbox";
// import type {
//   SelectedCard,
//   stationNumber,
// } from "../interfaces/homepage.interface";
// import StationCard from "../components/homepage/station-card";
// import { useStationPlaces } from "../hooks/useStationPlaces";
// import { useTramPosition } from "../hooks/useTramPosition";
// import TramPin from "../components/homepage/tram-pin";
// import type { Tram } from "../interfaces/tram.interface";
// import { fetchAllTrams } from "../services/tram.services";
// import InactivePopup from "../components/homepage/inactive-popup";
// import { useStationPopup } from "../hooks/useStationPopup";
// import type { MLString } from "../interfaces/content.interface";
// import { subscribeTransportStats } from "../services/stat.services";
// import NewHomepageSkeletonLoader from "../components/skeleton-load/new-homepage-skeleton-loader";
// import { useStationActivities } from "../hooks/useStationActivities";
// import { useStationToilets } from "../hooks/useStationToilets";
// import { formatTime12h, formatTime12hCn } from "../utils/ml";

// const getActiveBg = (lang: string) => {
//   // if (station !== 0) {
//   //   if (station === 4) {
//   //     if (isSaturday) {
//   //       return `/images/homepage/${lang}/${lang}-${station}.svg`;
//   //     } else return `/images/homepage/${lang}/${lang}-${station}-weekend.svg`;
//   //   } else return `/images/homepage/${lang}/${lang}-${station}.svg`;
//   // }
//   return BG_MAP[lang] || BG_MAP.th;
// };

// export default function Homepage() {
//   const { i18n, t } = useTranslation();

//   const loadedRef = useRef<string>("");
//   const [loadedBg, setLoadedBg] = useState<string>("");
//   const [prevBg, setPrevBg] = useState<string>("");
//   const [stationExpanded, setStationExpanded] = useState<stationNumber>(0);
//   const [trams, setTrams] = useState<Tram[]>([]);
//   const [selected, setSelected] = useState<string>("");
//   const [isInactivePopup, setIsInactivePopup] = useState<boolean>(false);
//   const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const secondsRef = useRef<number>(600);
//   const [mode, setMode] = useState<"store" | "activity" | "toilet" | null>(
//     null,
//   );
//   const [showFullDesc, setShowFullDesc] = useState<boolean>(false);
//   const [tramUsers, setTramUsers] = useState<number>(0);
//   const [visible, setVisible] = useState<boolean>(false);

//   const [showScrollBtn, setShowScrollBtn] = useState(true);
//   const [selectedCard, setSelectedCard] = useState<SelectedCard>(null);

//   const descRef = useRef<HTMLDivElement>(null);
//   const detailScrollRef = useRef<HTMLDivElement>(null);

//   const handleScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
//     setShowScrollBtn(!isAtBottom);
//   };

//   const scrollRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     scrollRef.current?.scrollTo({
//       top: scrollRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   };

//   const smoothScrollTo = (
//     container: HTMLElement,
//     target: number,
//     duration = 400,
//   ) => {
//     const start = container.scrollTop;
//     const change = target - start;
//     const startTime = performance.now();

//     const easeInOut = (t: number) =>
//       t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

//     const animate = (currentTime: number) => {
//       const elapsed = currentTime - startTime;
//       const progress = Math.min(elapsed / duration, 1);
//       const eased = easeInOut(progress);

//       container.scrollTop = start + change * eased;

//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       }
//     };

//     requestAnimationFrame(animate);
//   };

//   const lang = i18n.language;
//   const currentBg = getActiveBg(lang);
//   const loaded = loadedBg === currentBg;
//   const activeStationId =
//     stationExpanded !== 0 ? STATION_ID_MAP[stationExpanded] : null;
//   const { places, loading: placesLoading } = useStationPlaces(activeStationId);
//   const { activities, loading: activitiesLoading } =
//     useStationActivities(activeStationId);
//   const { toilets, loading: toiletsLoading } =
//     useStationToilets(activeStationId);

//   const selectedTram = trams.find((t) => t.id === selected);
//   const tram = useTramPosition(selected);
//   const tramStationId = tram?.current_station_id ?? null;
//   const tramUpdatedAt = tram?.last_checkin_at ?? null;

//   const tramStationNumber = Object.entries(STATION_ID_MAP).find(
//     ([, id]) => id === tramStationId,
//   )?.[0];

//   const { data } = useStationPopup(activeStationId);

//   useEffect(() => {
//     if (loadedRef.current === currentBg) return;

//     setPrevBg(loadedRef.current);
//     setLoadedBg("");

//     const img = new Image();
//     img.src = currentBg;

//     const onDone = () => {
//       loadedRef.current = currentBg;

//       requestAnimationFrame(() => {
//         requestAnimationFrame(() => {
//           setLoadedBg(currentBg);
//         });
//       });
//     };

//     if (img.complete) {
//       onDone();
//     } else {
//       img.onload = onDone;
//       img.onerror = onDone;
//     }

//     return () => {
//       img.onload = null;
//       img.onerror = null;
//     };
//   }, [currentBg]);

//   useEffect(() => {
//     const unsub = subscribeTransportStats((stats) => {
//       setTramUsers(stats.tram);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => setVisible(true), 300);
//     return () => {
//       clearTimeout(timer);
//       setVisible(false);
//     };
//   }, [stationExpanded]);

//   useEffect(() => {
//     if (!tramStationNumber) return;

//     startTransition(() => {
//       setStationExpanded(Number(tramStationNumber) as stationNumber);
//       setMode("store");
//     });
//   }, [tramStationNumber]);

//   useEffect(() => {
//     fetchAllTrams().then((data) => {
//       setTrams(data);

//       if (data.length > 0) {
//         setSelected(data[0].id);

//         if (data[0].status === "active") {
//           setIsInactivePopup(false);
//         } else {
//           setIsInactivePopup(true);
//         }
//       }
//     });

//     return () => {
//       setSelected("");
//       setTrams([]);
//     };
//   }, []);

//   const prevTramStationIdRef = useRef<string | null>(null);

//   useEffect(() => {
//     if (!tramStationId || !tramUpdatedAt) return;

//     if (countdownRef.current) clearInterval(countdownRef.current);

//     const elapsed = Math.floor(
//       (Date.now() - tramUpdatedAt.toDate().getTime()) / 1000,
//     );
//     const remaining = Math.max(600 - elapsed, 0);

//     secondsRef.current = remaining;

//     countdownRef.current = setInterval(() => {
//       if (secondsRef.current <= 0) {
//         clearInterval(countdownRef.current!);
//         return;
//       }
//       secondsRef.current -= 1;
//     }, 1000);

//     return () => {
//       if (countdownRef.current) clearInterval(countdownRef.current);
//     };
//   }, [tramStationId, tramUpdatedAt]);

//   useEffect(() => {
//     if (!selectedTram) return;
//     if (selectedTram.status !== "active" || !tramStationId) return;

//     if (prevTramStationIdRef.current !== tramStationId) {
//       prevTramStationIdRef.current = tramStationId;
//     }
//   }, [tramStationId, selectedTram]);

//   return (
//     <main className="relative w-full h-full overflow-hidden flex flex-col items-center justify-start">
//       {!loaded && !prevBg && <HomepageLoader />}

//       <div className="absolute top-0 left-0">
//         <div className="w-full min-h-[10svh] bg-[linear-gradient(68deg,#C07349_0%,#FC8B32_50%,#FBC859_100%)]" />
//       </div>

//       <div className="z-0 w-[90%] -mb-2 items-end flex justify-center gap-1 pt-3">
//         <div
//           onClick={() => {
//             setMode("store");
//             setSelectedCard(null);
//             if (tramStationId && stationExpanded === 0) {
//               const stationNum = Object.entries(STATION_ID_MAP).find(
//                 ([, id]) => id === tramStationId,
//               )?.[0];
//               if (stationNum) {
//                 setStationExpanded(Number(stationNum) as stationNumber);
//               }
//             }
//           }}
//           className={`transition-all min-h-27 duration-200 ${i18n.language === "th" ? "whitespace-nowrap" : "whitespace-normal wrap-break-word"} ${
//             mode === "store"
//               ? "shadow-[0_0px_12.3px_0_rgba(191,75,23)] py-3 text-white font-bold bg-[#BF4B17]"
//               : "py-2 bg-white/80 text-black font-normal"
//           } w-full text-[16px] rounded-t-[15px] text-center px-1`}
//         >
//           {t("homepage.storeNearMe")}
//         </div>

//         <div
//           onClick={() => {
//             setMode("activity");
//             setSelectedCard(null);
//             if (tramStationId && stationExpanded === 0) {
//               const stationNum = Object.entries(STATION_ID_MAP).find(
//                 ([, id]) => id === tramStationId,
//               )?.[0];
//               if (stationNum) {
//                 setStationExpanded(Number(stationNum) as stationNumber);
//               }
//             }
//           }}
//           className={`transition-all min-h-27 duration-200 ${i18n.language === "th" ? "whitespace-nowrap" : "whitespace-normal wrap-break-word"} ${
//             mode === "activity"
//               ? "shadow-[0_0px_12.3px_0_rgba(191,75,23)] py-3 text-white font-bold bg-[#BF4B17]"
//               : "py-2 bg-white/80 text-black font-normal"
//           } w-full text-[16px] rounded-t-[15px] text-center px-1`}
//         >
//           {t("homepage.activityNearMe")}
//         </div>

//         <div
//           onClick={() => {
//             setMode("toilet");
//             setSelectedCard(null);
//             if (tramStationId && stationExpanded === 0) {
//               const stationNum = Object.entries(STATION_ID_MAP).find(
//                 ([, id]) => id === tramStationId,
//               )?.[0];
//               if (stationNum) {
//                 setStationExpanded(Number(stationNum) as stationNumber);
//               }
//             }
//           }}
//           className={`transition-all min-h-27 duration-200 ${i18n.language === "th" ? "whitespace-nowrap" : "whitespace-normal wrap-break-word"} ${
//             mode === "toilet"
//               ? "shadow-[0_0px_12.3px_0_rgba(191,75,23)] py-3 text-white font-bold bg-[#BF4B17]"
//               : "py-2 bg-white/80 text-black font-normal"
//           } w-full text-[16px] rounded-t-[15px] text-center px-1`}
//         >
//           {t("homepage.toiletNearMe")}
//         </div>
//       </div>

//       <div
//         ref={scrollRef}
//         onScroll={handleScroll}
//         className={`max-h-[86svh] transition-all absolute top-12.5 z-5 mt-1 overflow-y-auto rounded-t-[25px] w-full h-full flex flex-col items-center justify-start bg-[linear-gradient(-181deg,#FFE2A5_0%,#FBFCF0_22%,#FBFCF0_62%,#E6EFD8_100%)] duration-350 ease-in-out ${
//           mode === null
//             ? "opacity-100 translate-y-0 pointer-events-auto"
//             : "opacity-100 translate-y-10 pointer-events-auto"
//         }`}
//       >
//         <div
//           className={`z-5 w-full relative pt-4 transition-all duration-300 ${mode === null ? "bg-[linear-gradient(-181deg,#FFE2A5_0%,#FBFCF0_36%,#FBFCF0_62%,#E6EFD8_100%)]" : "bg-transparent"}`}
//         >
//           {stationExpanded === 0 && (
//             <>
//               <div className="z-20 relative flex flex-col justify-center items-center text-[16px] font-medium">
//                 <p className="text-[#8B724E]">
//                   {t("homepage.tramUsers", { count: tramUsers })}
//                 </p>
//                 <p className="text-[#543A14]">รถรางจะออกเวลา 09.00น.</p>
//               </div>

//               <div
//                 className="pointer-events-none absolute -top-1 left-0 w-full h-20 z-10"
//                 style={{
//                   background:
//                     "linear-gradient(180deg, rgba(255,254,248,1) 32%, rgba(255,254,248,0) 100%",
//                 }}
//               />

//               <div className="relative w-full mt-1">
//                 {prevBg && (
//                   <img
//                     src={prevBg}
//                     className={`w-full h-auto block transition-opacity duration-700 ease-in-out ${
//                       loaded ? "opacity-0" : "opacity-100"
//                     }`}
//                     onTransitionEnd={() => setPrevBg("")}
//                     alt="background-prev"
//                     aria-hidden
//                   />
//                 )}

//                 <img
//                   key={currentBg}
//                   src={currentBg}
//                   className={`w-full h-auto block transition-opacity duration-700 ease-in-out ${
//                     prevBg ? "absolute inset-0" : ""
//                   } ${loaded ? "opacity-100" : "opacity-0"}`}
//                   alt="background"
//                 />

//                 <div className="absolute inset-0">
//                   <Hitbox
//                     loaded={loaded || !!prevBg}
//                     setStationExpanded={setStationExpanded}
//                     setMode={setMode}
//                   />
//                   {(loaded || prevBg) && (
//                     <TramPin
//                       stationId={tramStationId}
//                       loaded={loaded || !!prevBg}
//                     />
//                   )}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       <div
//         className={`z-5 max-h-[85.5svh] shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)] flex-col absolute bottom-0 rounded-t-[25px] w-[95%] h-full flex items-center justify-start overflow-hidden bg-white transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] ${
//           mode !== null ? "translate-y-0" : "translate-y-full"
//         }`}
//         style={{ pointerEvents: mode !== null ? "auto" : "none" }}
//       >
//         <div
//           onClick={() => {
//             setMode(null);
//             setStationExpanded(0);
//             setSelectedCard(null);
//             setShowFullDesc(false);
//           }}
//           className="w-full bg-[#BF4B17] flex justify-center items-center text-white py-1"
//         >
//           <IoIosArrowDown size={24} />
//         </div>

//         <div
//           ref={detailScrollRef}
//           className="w-full overflow-y-auto flex flex-col flex-1 justify-between items-start pt-4"
//         >
//           {stationExpanded !== 0 && (
//             <div
//               className={`${showFullDesc ? "" : "h-full"} w-full flex flex-col`}
//             >
//               {!visible ? (
//                 <NewHomepageSkeletonLoader />
//               ) : (
//                 <div className="mb-3 h-[60%] flex flex-col items-center gap-4 transition-all duration-300 ease-in-out opacity-100">
//                   <div
//                     className={`px-5 h-full flex flex-col ${selectedCard ? "justify-between" : "justify-start"} items-center text-center`}
//                   >
//                     <div className="flex flex-col justify-center items-center text-center">
//                       <h1 className="text-[#543A14] text-[16px] font-bold mb-3 text-center">
//                         {selectedCard?.name ??
//                           data?.header[i18n.language as keyof MLString] ??
//                           data?.header.th}
//                       </h1>
//                       <img
//                         className="min-w-full w-full min-h-42 aspect-video object-cover rounded-xl"
//                         src={selectedCard?.img ?? data?.img}
//                       />

//                       <div className="text-start w-full px-5 mt-4 flex flex-col justify-center items-start gap-y-1">
//                         {selectedCard?.location && (
//                           <p className="text-[16px] text-[#543A14]">
//                             สถานที่ตั้ง:
//                             {selectedCard?.location}
//                           </p>
//                         )}

//                         {selectedCard &&
//                           (selectedCard.openTime || selectedCard.closeTime) && (
//                             <p className="text-[16px] text-[#543A14]">
//                               {i18n.language === "th"
//                                 ? `เปิด ${selectedCard.openTime ?? "?"} – ${selectedCard.closeTime ?? "?"} น.`
//                                 : i18n.language === "en"
//                                   ? `Open ${formatTime12h(selectedCard.openTime)} – ${formatTime12h(selectedCard.closeTime)}`
//                                   : `开放 ${formatTime12hCn(selectedCard.openTime)} – ${formatTime12hCn(selectedCard.closeTime)}`}
//                             </p>
//                           )}
//                         {selectedCard?.phone && (
//                           <p className="text-[16px] text-[#543A14]">
//                             {t("contact.phone")} {selectedCard.phone}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {selectedCard?.link ? (
//                       <button
//                         onClick={() =>
//                           window.open(
//                             selectedCard.link,
//                             "_blank",
//                             "noopener,noreferrer",
//                           )
//                         }
//                         className="mt-3 bg-[#BF4B17] text-white flex items-center p-1 px-5 rounded-full gap-1"
//                       >
//                         {t(moreKeyMap[mode as keyof typeof moreKeyMap])}
//                         <IoIosArrowForward />
//                       </button>
//                     ) : (
//                       <div
//                         ref={descRef}
//                         className="text-[#543A14] text-[16px] font-normal mt-1"
//                       >
//                         <p className={`${showFullDesc ? "" : "line-clamp-3"}`}>
//                           {data?.desc[i18n.language as keyof MLString] ??
//                             data?.desc.th}
//                         </p>
//                         <button
//                           onClick={() => {
//                             setShowFullDesc((prev) => {
//                               const next = !prev;

//                               // if (!prev) {
//                               //   setTimeout(() => {
//                               //     const container = detailScrollRef.current;
//                               //     const el = descRef.current;

//                               //     if (container && el) {
//                               //       const containerRect =
//                               //         container.getBoundingClientRect();
//                               //       const elRect = el.getBoundingClientRect();

//                               //       const offset =
//                               //         elRect.top -
//                               //         containerRect.top +
//                               //         container.scrollTop;

//                               //       const target =
//                               //         offset -
//                               //         container.clientHeight / 2 +
//                               //         el.clientHeight / 2;

//                               //       smoothScrollTo(container, target, 250);
//                               //     }
//                               //   }, 50);
//                               // }

//                               if (!prev) {
//                                 requestAnimationFrame(() => {
//                                   requestAnimationFrame(() => {
//                                     const container = detailScrollRef.current;
//                                     const el = descRef.current;

//                                     if (container && el) {
//                                       const containerRect =
//                                         container.getBoundingClientRect();
//                                       const elRect = el.getBoundingClientRect();

//                                       const offset =
//                                         elRect.top -
//                                         containerRect.top +
//                                         container.scrollTop;

//                                       const maxScroll =
//                                         container.scrollHeight -
//                                         container.clientHeight;

//                                       const OFFSET = 20;

//                                       const target = Math.max(
//                                         0,
//                                         Math.min(offset - OFFSET, maxScroll),
//                                       );

//                                       smoothScrollTo(container, target, 220);
//                                     }
//                                   });
//                                 });
//                               }

//                               return next;
//                             });
//                           }}
//                           className="mx-auto text-[#F48B3C] text-[14px] mt-1 flex justify-center items-center gap-1"
//                         >
//                           {showFullDesc
//                             ? t("homepage.readLess")
//                             : t("homepage.readMore")}
//                           {showFullDesc ? <IoIosArrowUp /> : <IoIosArrowDown />}
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="h-[40%] mt-auto flex flex-col justify-end items-start w-full overflow-x-auto overflow-y-hidden">
//                 <h1 className="px-5 pt-3 -mb-1 text-[#543A14] font-bold text-[16px]">
//                   {mode === "store"
//                     ? t("homepage.recommendStore")
//                     : mode === "activity"
//                       ? t("homepage.recommendActivity")
//                       : mode === "toilet"
//                         ? t("homepage.recommendToilet")
//                         : ""}
//                 </h1>

//                 {mode === "store" && (
//                   <div className="px-5 flex justify-start items-center gap-x-3 w-full overflow-x-auto pt-2 pb-4">
//                     {placesLoading && (
//                       <p className="text-[12px] text-[#8B724E]">
//                         {t("homepage.loading")}
//                       </p>
//                     )}
//                     {!placesLoading && places.length === 0 && (
//                       <p className="text-[12px] text-[#C6C6C6]">
//                         {t("homepage.noPlaces")}
//                       </p>
//                     )}
//                     {!placesLoading &&
//                       places.map((place) => (
//                         <StationCard
//                           key={place.id}
//                           name={
//                             place.name[
//                               i18n.language as keyof typeof place.name
//                             ] ?? place.name.th
//                           }
//                           img={place.img}
//                           link={place.link}
//                           tag={place.tag}
//                           onSelect={() =>
//                             setSelectedCard({
//                               name:
//                                 place.name[
//                                   i18n.language as keyof typeof place.name
//                                 ] ?? place.name.th,
//                               img: place.img,
//                               link: place.link,
//                               openTime: place.openTime,
//                               closeTime: place.closeTime,
//                               phone: place.phone,
//                             })
//                           }
//                           setShowFullDesc={setShowFullDesc}
//                         />
//                       ))}
//                   </div>
//                 )}

//                 {mode === "activity" && (
//                   <div className="px-5 flex justify-start items-center gap-x-3 w-full overflow-x-auto pt-2 pb-4">
//                     {activitiesLoading && (
//                       <p className="text-[12px] text-[#8B724E]">
//                         {t("homepage.loading")}
//                       </p>
//                     )}
//                     {!activitiesLoading && activities.length === 0 && (
//                       <p className="text-[12px] text-[#C6C6C6]">
//                         {t("homepage.noActivities")}
//                       </p>
//                     )}
//                     {!activitiesLoading &&
//                       activities.map((act) => (
//                         <StationCard
//                           key={act.id}
//                           name={
//                             act.name[i18n.language as keyof typeof act.name] ??
//                             act.name.th
//                           }
//                           img={act.img}
//                           link={act.link}
//                           onSelect={() =>
//                             setSelectedCard({
//                               name:
//                                 act.name[
//                                   i18n.language as keyof typeof act.name
//                                 ] ?? act.name.th,
//                               img: act.img,
//                               link: act.link,
//                               openTime: act.openTime,
//                               closeTime: act.closeTime,
//                               phone: act.phone,
//                             })
//                           }
//                           setShowFullDesc={setShowFullDesc}
//                         />
//                       ))}
//                   </div>
//                 )}

//                 {mode === "toilet" && (
//                   <div className="px-5 flex justify-start items-center gap-x-3 w-full overflow-x-auto pt-2 pb-4">
//                     {toiletsLoading && (
//                       <p className="text-[12px] text-[#8B724E]">
//                         {t("homepage.loading")}
//                       </p>
//                     )}
//                     {!toiletsLoading && toilets.length === 0 && (
//                       <p className="text-[12px] text-[#C6C6C6]">
//                         {t("homepage.noToilets")}
//                       </p>
//                     )}
//                     {!toiletsLoading &&
//                       toilets.map((toilet) => (
//                         <StationCard
//                           key={toilet.id}
//                           name={
//                             toilet.name[
//                               i18n.language as keyof typeof toilet.name
//                             ] ?? toilet.name.th
//                           }
//                           img={toilet.img}
//                           link={toilet.link}
//                           onSelect={() =>
//                             setSelectedCard({
//                               name:
//                                 toilet.name[
//                                   i18n.language as keyof typeof toilet.name
//                                 ] ?? toilet.name.th,
//                               img: toilet.img,
//                               link: toilet.link,
//                               openTime: toilet.openTime,
//                               closeTime: toilet.closeTime,
//                               phone: toilet.phone,
//                               location: toilet.location,
//                             })
//                           }
//                           setShowFullDesc={setShowFullDesc}
//                         />
//                       ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {isInactivePopup && (
//         <InactivePopup setIsInactivePopup={setIsInactivePopup} />
//       )}

//       <button
//         onClick={scrollToBottom}
//         className={`${mode === null && showScrollBtn ? "opacity-100" : "opacity-0"} transition-all duration-200 fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white border-2 border-[#BF4B17] text-[#543A14] rounded-full p-1 flex items-center gap-2 active:scale-95 animate-bounce`}
//       >
//         <IoIosArrowDown size={24} />
//       </button>

//       {/* <div className="min-h-[77svh] max-w-107.5 mx-auto fixed bottom-0 w-full bg-[linear-gradient(-181deg,#FFE2A5_0%,#FBFCF0_36%,#FBFCF0_62%,#E6EFD8_100%)] z-1" /> */}
//     </main>
//   );
// }

import { useState, useEffect, useRef, startTransition } from "react";
import { useTranslation } from "react-i18next";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosArrowForward,
} from "react-icons/io";
import {
  ALL_TAGS,
  BG_MAP,
  moreKeyMap,
  STATION_ID_MAP,
} from "../constant/homepage";
import Hitbox from "../components/homepage/hitbox";
import type {
  PlaceTag,
  SelectedCard,
  stationNumber,
} from "../interfaces/homepage.interface";
import StationCard from "../components/homepage/station-card";
import { useStationPlaces } from "../hooks/useStationPlaces";
import { useTramPosition } from "../hooks/useTramPosition";
import TramPin from "../components/homepage/tram-pin";
import type { Tram } from "../interfaces/tram.interface";
import { fetchAllTrams } from "../services/tram.services";
import InactivePopup from "../components/homepage/inactive-popup";
import { useStationPopup } from "../hooks/useStationPopup";
import type { MLString } from "../interfaces/content.interface";
import { subscribeTransportStats } from "../services/stat.services";
import NewHomepageSkeletonLoader from "../components/skeleton-load/new-homepage-skeleton-loader";
import { useStationActivities } from "../hooks/useStationActivities";
import { useStationToilets } from "../hooks/useStationToilets";
import { formatTime12h, formatTime12hCn } from "../utils/ml";
import { useNavbarTitle } from "../hooks/useNavbar";
import SubNavbar from "../components/navbar/sub-navbar";
import { getNextTramTime } from "../utils/stat";

const getActiveBg = (lang: string) => {
  // if (station !== 0) {
  //   if (station === 4) {
  //     if (isSaturday) {
  //       return `/images/homepage/${lang}/${lang}-${station}.svg`;
  //     } else return `/images/homepage/${lang}/${lang}-${station}-weekend.svg`;
  //   } else return `/images/homepage/${lang}/${lang}-${station}.svg`;
  // }
  return BG_MAP[lang] || BG_MAP.th;
};

export default function Homepage() {
  const { i18n, t } = useTranslation();

  const { setOverrideTitle } = useNavbarTitle();

  const loadedRef = useRef<string>("");
  const [loadedBg, setLoadedBg] = useState<string>("");
  const [prevBg, setPrevBg] = useState<string>("");
  const [stationExpanded, setStationExpanded] = useState<stationNumber>(0);
  const [trams, setTrams] = useState<Tram[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [isInactivePopup, setIsInactivePopup] = useState<boolean>(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef<number>(600);
  const [mode, setMode] = useState<"store" | "activity" | "toilet" | null>(
    null,
  );
  const [showFullDesc, setShowFullDesc] = useState<boolean>(false);
  const [tramUsers, setTramUsers] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  const [selectedTag, setSelectedTag] = useState<string | null>("");

  const [showScrollBtn, setShowScrollBtn] = useState(true);
  const [selectedCard, setSelectedCard] = useState<SelectedCard>(null);

  const [isCardTransitioning, setIsCardTransitioning] =
    useState<boolean>(false);

  const spanRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);

  const [entering, setEntering] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setEntering(false), 10);
    return () => clearTimeout(timer);
  }, []);

  const getLabel = (value: string | null) => {
    if (!value) return t("heatmap.all") || t("heatmap.all");
    return t(`dashboard.placeCategory.${value}`) || value;
  };

  useEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.offsetWidth + 24);
    }
  }, [selectedTag, i18n.language]);

  const descRef = useRef<HTMLDivElement>(null);
  const detailScrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
    setShowScrollBtn(!isAtBottom);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

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

  const lang = i18n.language;
  const currentBg = getActiveBg(lang);
  const loaded = loadedBg === currentBg;
  const activeStationId =
    stationExpanded !== 0 ? STATION_ID_MAP[stationExpanded] : null;
  const { places, loading: placesLoading } = useStationPlaces(activeStationId);
  const { activities, loading: activitiesLoading } =
    useStationActivities(activeStationId);
  const { toilets, loading: toiletsLoading } =
    useStationToilets(activeStationId);

  const selectedTram = trams.find((t) => t.id === selected);
  const tram = useTramPosition(selected);
  const tramStationId = tram?.current_station_id ?? null;
  const tramUpdatedAt = tram?.last_checkin_at ?? null;

  const tramStationNumber = Object.entries(STATION_ID_MAP).find(
    ([, id]) => id === tramStationId,
  )?.[0];

  const filteredPlaces = selectedTag
    ? places.filter((p) => p.tag === selectedTag)
    : places;

  const nextTime = getNextTramTime();

  let formattedTime = nextTime;

  if (i18n.language === "en") {
    formattedTime = formatTime12h(nextTime);
  } else if (i18n.language === "zh") {
    formattedTime = formatTime12hCn(nextTime);
  }

  const { data } = useStationPopup(activeStationId);

  useEffect(() => {
    if (loadedRef.current === currentBg) return;

    setPrevBg(loadedRef.current);
    setLoadedBg("");

    const img = new Image();
    img.src = currentBg;

    const onDone = () => {
      loadedRef.current = currentBg;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLoadedBg(currentBg);
        });
      });
    };

    if (img.complete) {
      onDone();
    } else {
      img.onload = onDone;
      img.onerror = onDone;
    }

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentBg]);

  const handleSetMode = (newMode: typeof mode) => {
    setMode(newMode);
    setSelectedCard(null);
    setSelectedTag(null);
    setOverrideTitle(
      newMode === "store"
        ? t("homepage.storeNearMe")
        : newMode === "activity"
          ? t("homepage.activityNearMe")
          : t("homepage.toiletNearMe"),
    );
    if (tramStationId && stationExpanded === 0) {
      const stationNum = Object.entries(STATION_ID_MAP).find(
        ([, id]) => id === tramStationId,
      )?.[0];
      if (stationNum) {
        setStationExpanded(Number(stationNum) as stationNumber);
      }
    }
  };

  useEffect(() => {
    const unsub = subscribeTransportStats((stats) => {
      setTramUsers(stats.tram);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => {
      clearTimeout(timer);
      setVisible(false);
    };
  }, [stationExpanded]);

  useEffect(() => {
    if (!tramStationNumber) return;
    startTransition(() => {
      setStationExpanded(Number(tramStationNumber) as stationNumber);
      setMode("store");
      setSelectedTag(null);
      setOverrideTitle(t("homepage.storeNearMe"));
    });
  }, [tramStationNumber, t, setOverrideTitle]);

  useEffect(() => {
    fetchAllTrams().then((data) => {
      setTrams(data);

      if (data.length > 0) {
        setSelected(data[0].id);

        if (data[0].status === "active") {
          setIsInactivePopup(false);
        } else {
          setIsInactivePopup(true);
        }
      }
    });

    return () => {
      setSelected("");
      setTrams([]);
    };
  }, []);

  const prevTramStationIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!tramStationId || !tramUpdatedAt) return;

    if (countdownRef.current) clearInterval(countdownRef.current);

    const elapsed = Math.floor(
      (Date.now() - tramUpdatedAt.toDate().getTime()) / 1000,
    );
    const remaining = Math.max(600 - elapsed, 0);

    secondsRef.current = remaining;

    countdownRef.current = setInterval(() => {
      if (secondsRef.current <= 0) {
        clearInterval(countdownRef.current!);
        return;
      }
      secondsRef.current -= 1;
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [tramStationId, tramUpdatedAt]);

  useEffect(() => {
    if (!selectedTram) return;
    if (selectedTram.status !== "active" || !tramStationId) return;

    if (prevTramStationIdRef.current !== tramStationId) {
      prevTramStationIdRef.current = tramStationId;
    }
  }, [tramStationId, selectedTram]);

  return (
    <main className="relative w-full h-full overflow-hidden flex flex-col items-center justify-start">
      <div className="absolute top-0 left-0">
        <div className="w-full min-h-[10svh] bg-[linear-gradient(68deg,#C07349_0%,#FC8B32_50%,#FBC859_100%)]" />
      </div>

      <SubNavbar
        mode={mode}
        setMode={handleSetMode}
        mode1="store"
        mode2="activity"
        mode3="toilet"
        mode1Name={t("homepage.storeNearMe")}
        mode2Name={t("homepage.activityNearMe")}
        mode3Name={t("homepage.toiletNearMe")}
        isTabStyle={true}
        leaving={false}
        entering={entering}
      />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`${i18n.language === "en" ? "max-h-[83svh]" : "max-h-[86svh]"} transition-all absolute bottom-0 z-5 mt-1 overflow-y-auto rounded-t-[25px] w-full h-full flex flex-col items-center justify-start bg-[linear-gradient(-181deg,#FFE2A5_0%,#FBFCF0_22%,#FBFCF0_62%,#E6EFD8_100%)] duration-350 ease-in-out ${
          entering
            ? "translate-y-full"
            : mode === null
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-100 translate-y-10 pointer-events-auto"
        }`}
      >
        <div
          className={`z-5 w-full relative pt-4 transition-all duration-300 ${mode === null ? "bg-[linear-gradient(-181deg,#FFE2A5_0%,#FBFCF0_36%,#FBFCF0_62%,#E6EFD8_100%)]" : "bg-transparent"}`}
        >
          {stationExpanded === 0 && (
            <>
              <div className="z-20 relative flex flex-col justify-center items-center text-[16px] font-medium">
                <p className="text-[#8B724E]">
                  {t("homepage.tramUsers", { count: tramUsers })}
                </p>
                <p className="text-[#543A14]">
                  {t("homepage.tramTime", { time: formattedTime })}
                </p>
              </div>

              <div
                className="pointer-events-none absolute -top-1 left-0 w-full h-20 z-10"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,254,248,1) 32%, rgba(255,254,248,0) 100%",
                }}
              />

              <div className="relative w-full mt-1">
                {prevBg && (
                  <img
                    src={prevBg}
                    className={`w-full h-auto block transition-opacity duration-700 ease-in-out ${
                      loaded ? "opacity-0" : "opacity-100"
                    }`}
                    onTransitionEnd={() => setPrevBg("")}
                    alt="background-prev"
                    aria-hidden
                  />
                )}

                <img
                  key={currentBg}
                  src={currentBg}
                  className={`w-full h-auto block transition-opacity duration-700 ease-in-out ${
                    prevBg ? "absolute inset-0" : ""
                  } ${loaded ? "opacity-100" : "opacity-0"}`}
                  alt="background"
                />

                <div className="absolute inset-0">
                  <Hitbox
                    loaded={loaded || !!prevBg}
                    setStationExpanded={setStationExpanded}
                    setMode={setMode}
                  />
                  {(loaded || prevBg) && (
                    <TramPin
                      stationId={tramStationId}
                      loaded={loaded || !!prevBg}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className={`z-5 ${i18n.language === "en" ? "max-h-[82.5svh]" : "max-h-[85.5svh]"} shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)] flex-col absolute bottom-0 rounded-t-[25px] w-[95%] h-full flex items-center justify-start overflow-hidden bg-white transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          mode !== null ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ pointerEvents: mode !== null ? "auto" : "none" }}
      >
        <div
          onClick={() => {
            setMode(null);
            setStationExpanded(0);
            setSelectedCard(null);
            setOverrideTitle(null);
            setShowFullDesc(false);
            setSelectedTag(null);
          }}
          className="w-full bg-[#BF4B17] flex justify-center items-center text-white py-1"
        >
          <IoIosArrowDown size={24} />
        </div>

        <div
          ref={detailScrollRef}
          className="w-full overflow-y-auto flex flex-col flex-1 justify-between items-start pt-4"
        >
          {stationExpanded !== 0 && (
            <div
              className={`${showFullDesc ? "" : "h-full"} w-full flex flex-col gap-2`}
            >
              {!visible ? (
                <NewHomepageSkeletonLoader />
              ) : (
                <div
                  className={`mb-3 h-[60%] flex flex-col items-center gap-4 transition-opacity duration-150 ease-in-out ${
                    isCardTransitioning ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <div
                    className={`px-5 h-full flex flex-col ${selectedCard ? "justify-between" : "justify-start"} items-center text-center`}
                  >
                    <div className="flex flex-col justify-center items-center text-center">
                      <h1 className="text-[#543A14] text-[16px] font-bold mb-3 text-center">
                        {selectedCard?.name ??
                          data?.header[i18n.language as keyof MLString] ??
                          data?.header.th}
                      </h1>
                      <img
                        className="min-w-full w-full min-h-42 aspect-video object-cover rounded-xl"
                        src={selectedCard?.img ?? data?.img}
                      />

                      <div className="text-start w-full px-5 mt-3 flex flex-col justify-center items-start gap-y-1">
                        {selectedCard?.location && (
                          <p className="text-[16px] text-[#543A14]">
                            สถานที่ตั้ง:
                            {selectedCard?.location}
                          </p>
                        )}

                        {selectedCard &&
                          (selectedCard.openTime || selectedCard.closeTime) && (
                            <p className="text-[16px] text-[#543A14]">
                              {i18n.language === "th"
                                ? `เปิด ${selectedCard.openTime ?? "?"} – ${selectedCard.closeTime ?? "?"} น.`
                                : i18n.language === "en"
                                  ? `Open ${formatTime12h(selectedCard.openTime)} – ${formatTime12h(selectedCard.closeTime)}`
                                  : `开放 ${formatTime12hCn(selectedCard.openTime)} – ${formatTime12hCn(selectedCard.closeTime)}`}
                            </p>
                          )}
                        {selectedCard?.phone && (
                          <p className="text-[16px] text-[#543A14]">
                            {t("contact.phone")} {selectedCard.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {selectedCard?.link ? (
                      <button
                        onClick={() =>
                          window.open(
                            selectedCard.link,
                            "_blank",
                            "noopener,noreferrer",
                          )
                        }
                        className="mt-3 bg-[#BF4B17] text-white flex items-center p-1 px-5 rounded-full gap-1"
                      >
                        {t(moreKeyMap[mode as keyof typeof moreKeyMap])}
                        <IoIosArrowForward />
                      </button>
                    ) : (
                      <div
                        ref={descRef}
                        className="text-[#543A14] text-[16px] font-normal mt-1"
                      >
                        <p className={`${showFullDesc ? "" : "line-clamp-3"}`}>
                          {data?.desc[i18n.language as keyof MLString] ??
                            data?.desc.th}
                        </p>
                        <button
                          onClick={() => {
                            setShowFullDesc((prev) => {
                              const next = !prev;

                              // if (!prev) {
                              //   setTimeout(() => {
                              //     const container = detailScrollRef.current;
                              //     const el = descRef.current;

                              //     if (container && el) {
                              //       const containerRect =
                              //         container.getBoundingClientRect();
                              //       const elRect = el.getBoundingClientRect();

                              //       const offset =
                              //         elRect.top -
                              //         containerRect.top +
                              //         container.scrollTop;

                              //       const target =
                              //         offset -
                              //         container.clientHeight / 2 +
                              //         el.clientHeight / 2;

                              //       smoothScrollTo(container, target, 250);
                              //     }
                              //   }, 50);
                              // }

                              if (!prev) {
                                requestAnimationFrame(() => {
                                  requestAnimationFrame(() => {
                                    const container = detailScrollRef.current;
                                    const el = descRef.current;

                                    if (container && el) {
                                      const containerRect =
                                        container.getBoundingClientRect();
                                      const elRect = el.getBoundingClientRect();

                                      const offset =
                                        elRect.top -
                                        containerRect.top +
                                        container.scrollTop;

                                      const maxScroll =
                                        container.scrollHeight -
                                        container.clientHeight;

                                      const OFFSET = 15;

                                      const target = Math.max(
                                        0,
                                        Math.min(offset - OFFSET, maxScroll),
                                      );

                                      smoothScrollTo(container, target, 220);
                                    }
                                  });
                                });
                              }

                              return next;
                            });
                          }}
                          className="relative z-50 mx-auto text-[#F48B3C] text-[14px] mt-1 flex justify-center items-center gap-1"
                        >
                          {showFullDesc
                            ? t("homepage.readLess")
                            : t("homepage.readMore")}
                          {showFullDesc ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="h-[40%] mt-auto flex flex-col justify-end items-start w-full overflow-x-auto overflow-y-hidden">
                <div className="w-full pl-5 pt-2 -mb-1 flex justify-between items-center">
                  <h1 className="text-[#543A14] font-bold text-[16px]">
                    {mode === "store"
                      ? t("homepage.recommendStore")
                      : mode === "activity"
                        ? t("homepage.recommendActivity")
                        : mode === "toilet"
                          ? t("homepage.recommendToilet")
                          : ""}
                  </h1>

                  {mode === "store" && (
                    <div className="relative">
                      <span
                        ref={spanRef}
                        className="absolute invisible whitespace-nowrap text-[12px] px-2 py-px"
                      >
                        {getLabel(selectedTag)}
                      </span>

                      <select
                        value={selectedTag ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedTag(
                            value === "" ? null : (value as PlaceTag),
                          );
                        }}
                        style={{ width }}
                        className="mx-5 text-[12px] px-2 py-px rounded-full border-2 border-[#543A14] bg-white text-[#543A14] outline-none"
                      >
                        <option value="">{t("heatmap.all")}</option>
                        {ALL_TAGS.map((tag) => (
                          <option key={tag} value={tag}>
                            {t(`dashboard.placeCategory.${tag}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {mode === "store" && (
                  <div className="px-5 flex justify-start items-center gap-x-3 w-full overflow-x-auto pt-2 pb-4">
                    {placesLoading && (
                      <p className="text-[12px] text-[#8B724E]">
                        {t("homepage.loading")}
                      </p>
                    )}
                    {!placesLoading && places.length === 0 && (
                      <p className="text-[12px] text-[#C6C6C6]">
                        {t("homepage.noPlaces")}
                      </p>
                    )}
                    {!placesLoading &&
                      places.length > 0 &&
                      filteredPlaces.length === 0 && (
                        <p className="text-[12px] min-h-35 pt-3 text-[#C6C6C6]">
                          {t("homepage.noPlaces")}
                        </p>
                      )}
                    {!placesLoading &&
                      filteredPlaces.map((place) => (
                        <StationCard
                          key={place.id}
                          name={
                            place.name[
                              i18n.language as keyof typeof place.name
                            ] ?? place.name.th
                          }
                          img={place.img}
                          link={place.link}
                          tag={place.tag}
                          onSelect={() => {
                            setIsCardTransitioning(true);
                            setTimeout(() => {
                              setSelectedCard({
                                name:
                                  place.name[
                                    i18n.language as keyof typeof place.name
                                  ] ?? place.name.th,
                                img: place.img,
                                link: place.link,
                                openTime: place.openTime,
                                closeTime: place.closeTime,
                                phone: place.phone,
                              });
                              setOverrideTitle(t("homepage.storeNearMe"));
                              setIsCardTransitioning(false);
                            }, 150);
                          }}
                          setShowFullDesc={setShowFullDesc}
                        />
                      ))}
                  </div>
                )}

                {mode === "activity" && (
                  <div className="px-5 flex justify-start items-center gap-x-3 w-full overflow-x-auto pt-2 pb-4">
                    {activitiesLoading && (
                      <p className="text-[12px] text-[#8B724E]">
                        {t("homepage.loading")}
                      </p>
                    )}
                    {!activitiesLoading && activities.length === 0 && (
                      <p className="text-[12px] text-[#C6C6C6]">
                        {t("homepage.noActivities")}
                      </p>
                    )}
                    {!activitiesLoading &&
                      activities.map((act) => (
                        <StationCard
                          key={act.id}
                          name={
                            act.name[i18n.language as keyof typeof act.name] ??
                            act.name.th
                          }
                          img={act.img}
                          link={act.link}
                          onSelect={() => {
                            setIsCardTransitioning(true);
                            setTimeout(() => {
                              setSelectedCard({
                                name:
                                  act.name[
                                    i18n.language as keyof typeof act.name
                                  ] ?? act.name.th,
                                img: act.img,
                                link: act.link,
                                openTime: act.openTime,
                                closeTime: act.closeTime,
                                phone: act.phone,
                              });
                              setOverrideTitle(t("homepage.activityNearMe"));
                              setIsCardTransitioning(false);
                            }, 150);
                          }}
                          setShowFullDesc={setShowFullDesc}
                        />
                      ))}
                  </div>
                )}

                {mode === "toilet" && (
                  <div className="px-5 flex justify-start items-center gap-x-3 w-full overflow-x-auto pt-2 pb-4">
                    {toiletsLoading && (
                      <p className="text-[12px] text-[#8B724E]">
                        {t("homepage.loading")}
                      </p>
                    )}
                    {!toiletsLoading && toilets.length === 0 && (
                      <p className="text-[12px] text-[#C6C6C6]">
                        {t("homepage.noToilets")}
                      </p>
                    )}
                    {!toiletsLoading &&
                      toilets.map((toilet) => (
                        <StationCard
                          key={toilet.id}
                          name={
                            toilet.name[
                              i18n.language as keyof typeof toilet.name
                            ] ?? toilet.name.th
                          }
                          img={toilet.img}
                          link={toilet.link}
                          onSelect={() => {
                            setIsCardTransitioning(true);
                            setTimeout(() => {
                              setSelectedCard({
                                name:
                                  toilet.name[
                                    i18n.language as keyof typeof toilet.name
                                  ] ?? toilet.name.th,
                                img: toilet.img,
                                link: toilet.link,
                                openTime: toilet.openTime,
                                closeTime: toilet.closeTime,
                                phone: toilet.phone,
                                location: toilet.location,
                              });
                              setOverrideTitle(t("homepage.toiletNearMe"));
                              setIsCardTransitioning(false);
                            }, 150);
                          }}
                          setShowFullDesc={setShowFullDesc}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isInactivePopup && (
        <InactivePopup setIsInactivePopup={setIsInactivePopup} />
      )}

      <button
        onClick={scrollToBottom}
        className={`${mode === null && showScrollBtn ? "opacity-100" : "opacity-0"} transition-all duration-200 fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white border-2 border-[#BF4B17] text-[#543A14] rounded-full p-1 flex items-center gap-2 active:scale-95 animate-bounce`}
      >
        <IoIosArrowDown size={24} />
      </button>

      {/* <div className="min-h-[77svh] max-w-107.5 mx-auto fixed bottom-0 w-full bg-[linear-gradient(-181deg,#FFE2A5_0%,#FBFCF0_36%,#FBFCF0_62%,#E6EFD8_100%)] z-1" /> */}
    </main>
  );
}
