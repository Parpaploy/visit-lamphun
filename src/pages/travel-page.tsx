// import { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import DayButton from "../components/travel-page/day-btn";
// import DayBlock from "../components/travel-page/day-block";
// import TrainCard from "../components/travel-page/train-card";
// import TramCard from "../components/travel-page/tram-card";
// import OtherCard from "../components/travel-page/other-card";
// import TravelLoader from "../components/skeleton-load/travel-loader";
// import type { ITravelMode } from "../interfaces/navbar.interface";
// import SubNavbar from "../components/navbar/sub-navbar";
// import {
//   useTrainItems,
//   useTramItems,
//   useOtherItems,
// } from "../hooks/useTravelItems";

// export default function TravelPage() {
//   const { t } = useTranslation();
//   const [mode, setMode] = useState<ITravelMode>("train");
//   const [day, setDay] = useState<"weekday" | "weekend">("weekday");
//   const [prevMode, setPrevMode] = useState<ITravelMode>(mode);
//   const [modeLoading, setModeLoading] = useState(false);

//   if (mode !== prevMode) {
//     setPrevMode(mode);
//     setModeLoading(true);
//   }

//   useEffect(() => {
//     if (!modeLoading) return;
//     const t = setTimeout(() => setModeLoading(false), 350);
//     return () => clearTimeout(t);
//   }, [modeLoading]);

//   const { items: trainItems, loading: trainLoading } = useTrainItems();
//   const { items: tramItems, loading: tramLoading } = useTramItems();
//   const { items: otherItems, loading: otherLoading } = useOtherItems();

//   const loading =
//     modeLoading ||
//     (mode === "train"
//       ? trainLoading
//       : mode === "tram"
//         ? tramLoading
//         : otherLoading);

//   return (
//     <main className="relative w-full h-full flex flex-col overflow-hidden">
//       <SubNavbar
//         mode={mode}
//         setMode={setMode}
//         mode1="train"
//         mode2="tram"
//         mode3="other"
//         mode1Name={t("travel.train")}
//         mode2Name={t("travel.tram")}
//         mode3Name={t("travel.other")}
//         isTabStyle={true}
//       />

//       <section className="w-[90%] mx-auto flex justify-center items-center gap-x-4 border-b border-[#D9D9D9] py-5">
//         {mode !== "tram" ? (
//           <>
//             <DayButton
//               title={t("travel.weekday")}
//               desc={t("travel.weekdayDesc")}
//               day={day}
//               week="weekday"
//               setDay={setDay}
//             />
//             <DayButton
//               title={t("travel.weekend")}
//               desc={t("travel.weekendDesc")}
//               day={day}
//               week="weekend"
//               setDay={setDay}
//             />
//           </>
//         ) : (
//           <>
//             <DayBlock title={t("travel.open")} desc={t("travel.openDesc")} />
//             <DayBlock title={t("travel.close")} desc={t("travel.closeDesc")} />
//           </>
//         )}
//       </section>

//       <section className="w-full flex-1 flex flex-col gap-y-4 overflow-y-auto p-5">
//         {loading ? (
//           Array.from({ length: 2 }).map((_, i) => <TravelLoader key={i} />)
//         ) : (
//           <>
//             {mode === "train" &&
//               trainItems
//                 .filter((item) => item.day === day)
//                 .map((item, idx) => (
//                   <div
//                     key={item.id}
//                     className="animate-fade-in"
//                     style={{ animationDelay: `${idx * 60}ms` }}
//                   >
//                     <TrainCard
//                       origin={item.origin}
//                       destination={item.destination}
//                       originTime={item.originTime}
//                       destinationTime={item.destinationTime}
//                       originStation={item.originStation}
//                       destinationStation={item.destinationStation}
//                       price={item.price}
//                       desc={item.desc}
//                     />
//                   </div>
//                 ))}

//             {mode === "tram" &&
//               tramItems.map((item, idx) => (
//                 <div
//                   key={item.id}
//                   className="animate-fade-in"
//                   style={{ animationDelay: `${idx * 60}ms` }}
//                 >
//                   <TramCard
//                     place={item.place}
//                     round={item.round}
//                     time={item.time}
//                     price={item.price}
//                   />
//                 </div>
//               ))}

//             {mode === "other" &&
//               otherItems
//                 .filter((item) => item.day === day)
//                 .map((item, idx) => (
//                   <div
//                     key={item.id}
//                     className="animate-fade-in"
//                     style={{ animationDelay: `${idx * 60}ms` }}
//                   >
//                     <OtherCard
//                       place={item.place}
//                       desc={item.desc}
//                       desc2={item.desc2}
//                       type={item.type}
//                       phone={item.phone}
//                       link={item.link}
//                       lineLink={item.lineLink}
//                     />
//                   </div>
//                 ))}
//           </>
//         )}
//       </section>
//     </main>
//   );
// }

// import { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import DayButton from "../components/travel-page/day-btn";
// import DayBlock from "../components/travel-page/day-block";
// import TrainCard from "../components/travel-page/train-card";
// import TramCard from "../components/travel-page/tram-card";
// import OtherCard from "../components/travel-page/other-card";
// import TravelLoader from "../components/skeleton-load/travel-loader";
// import type { ITravelMode } from "../interfaces/navbar.interface";
// import SubNavbar from "../components/navbar/sub-navbar";
// import {
//   useTrainItems,
//   useTramItems,
//   useOtherItems,
// } from "../hooks/useTravelItems";
// import { IoIosArrowDown } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
// import { useNavbarTitle } from "../hooks/useNavbar";
// import TrainLoader from "../components/skeleton-load/train-loader";
// import TrainDirectionFilter from "../components/travel-page/train-direction-filter";
// import { timeToMinutes } from "../utils/countdown";

// export default function TravelPage() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const { setOverrideTitle } = useNavbarTitle();

//   const [leaving, setLeaving] = useState(false);
//   const [entering, setEntering] = useState(true);

//   const [mode, setMode] = useState<ITravelMode>("train");
//   const [day, setDay] = useState<"weekday" | "weekend">("weekday");
//   const [prevMode, setPrevMode] = useState<ITravelMode>(mode);
//   const [modeLoading, setModeLoading] = useState(false);
//   const [direction, setDirection] = useState<"CNX_LPH" | "LPH_CNX">("CNX_LPH");

//   if (mode !== prevMode) {
//     setPrevMode(mode);
//     setModeLoading(true);
//   }

//   useEffect(() => {
//     const timer = setTimeout(() => setEntering(false), 10);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (!modeLoading) return;
//     const timer = setTimeout(() => setModeLoading(false), 350);
//     return () => clearTimeout(timer);
//   }, [modeLoading]);

//   const { items: trainItems, loading: trainLoading } = useTrainItems();
//   const { items: tramItems, loading: tramLoading } = useTramItems();
//   const { items: otherItems, loading: otherLoading } = useOtherItems();

//   const filtered = trainItems.filter((item) => {
//     if (direction === "CNX_LPH") {
//       return item.originStation.th.includes("เชียงใหม่");
//     } else {
//       return item.originStation.th.includes("ลำพูน");
//     }
//   });

//   const loading =
//     modeLoading ||
//     (mode === "train"
//       ? trainLoading
//       : mode === "tram"
//         ? tramLoading
//         : otherLoading);

//   const handleClose = () => {
//     setLeaving(true);
//     setTimeout(() => {
//       setOverrideTitle(null);
//       navigate("/app");
//     }, 100);
//   };

//   const now = new Date();
//   const nowMinutes = now.getHours() * 60 + now.getMinutes();

//   const sorted = [...filtered].sort((a, b) => {
//     const aMinutes = timeToMinutes(a.destinationTime);
//     const bMinutes = timeToMinutes(b.destinationTime);
//     const aPast = aMinutes < nowMinutes;
//     const bPast = bMinutes < nowMinutes;

//     if (aPast !== bPast) return aPast ? 1 : -1;
//     return timeToMinutes(a.originTime) - timeToMinutes(b.originTime);
//   });

//   return (
//     <main className="relative w-full h-full flex flex-col overflow-hidden">
//       <SubNavbar
//         mode={mode}
//         setMode={setMode}
//         mode1="train"
//         mode2="tram"
//         mode3="other"
//         mode1Name={t("travel.train")}
//         mode2Name={t("travel.tram")}
//         mode3Name={t("travel.other")}
//         isTabStyle={true}
//         leaving={leaving}
//       />

//       <section
//         className={`z-5 max-h-[85.5svh] shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)] flex-col absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-[25px] w-[95%] h-full flex items-center justify-start overflow-hidden bg-white transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] ${
//           leaving || entering ? "translate-y-full" : "translate-y-0"
//         }`}
//       >
//         <div
//           onClick={handleClose}
//           className="w-full bg-[#BF4B17] flex justify-center items-center text-white py-1 cursor-pointer shrink-0"
//         >
//           <IoIosArrowDown size={24} />
//         </div>

//         <section
//           className={`w-[90%] mx-auto flex justify-center items-center gap-x-4 ${mode !== "train" ? "border-b border-[#D9D9D9] py-5" : "pt-5"} shrink-0`}
//         >
//           {mode !== "train" ? (
//             <>
//               {mode !== "tram" ? (
//                 <>
//                   <DayButton
//                     title={t("travel.weekday")}
//                     desc={t("travel.weekdayDesc")}
//                     day={day}
//                     week="weekday"
//                     setDay={setDay}
//                   />
//                   <DayButton
//                     title={t("travel.weekend")}
//                     desc={t("travel.weekendDesc")}
//                     day={day}
//                     week="weekend"
//                     setDay={setDay}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <DayBlock
//                     title={t("travel.open")}
//                     desc={t("travel.openDesc")}
//                   />
//                   <DayBlock
//                     title={t("travel.close")}
//                     desc={t("travel.closeDesc")}
//                   />
//                 </>
//               )}
//             </>
//           ) : (
//             <TrainDirectionFilter value={direction} onChange={setDirection} />
//           )}
//         </section>

//         {mode === "train" && (
//           <div className="w-[90%] border-b border-[#D9D9D9] pt-4 pb-1.5 text-center text-[14px] font-normal text-[#543A14]">
//             <p className="w-[80%] mx-auto">
//               ซื้อตั๋วได้ที่สถานีรถไฟต้นทาง โดยสามารถซื้อก่อนเวลารถไฟออก 2 ชม.
//             </p>
//           </div>
//         )}

//         <section
//           className={`w-full flex-1 flex flex-col ${mode === "train" && !loading ? "gap-y-1" : "gap-y-4"} overflow-y-auto p-5`}
//         >
//           {loading ? (
//             Array.from({ length: 2 }).map((_, i) =>
//               mode === "train" ? (
//                 <TrainLoader key={i} />
//               ) : (
//                 <TravelLoader key={i} />
//               ),
//             )
//           ) : (
//             <>
//               {mode === "train" &&
//                 // trainItems
//                 //   .filter((item) => item.day === day)
//                 sorted.map((item, idx) => {
//                   const isPast =
//                     timeToMinutes(item.destinationTime) < nowMinutes;
//                   return (
//                     <div
//                       key={item.id}
//                       className="animate-fade-in"
//                       style={{ animationDelay: `${idx * 60}ms` }}
//                     >
//                       <TrainCard
//                         origin={item.origin}
//                         destination={item.destination}
//                         originTime={item.originTime}
//                         destinationTime={item.destinationTime}
//                         // originStation={item.originStation}
//                         // destinationStation={item.destinationStation}
//                         price={item.price}
//                         desc={item.desc}
//                         isPast={isPast}
//                       />
//                     </div>
//                   );
//                 })}

//               {mode === "tram" &&
//                 tramItems.map((item, idx) => (
//                   <div
//                     key={item.id}
//                     className="animate-fade-in"
//                     style={{ animationDelay: `${idx * 60}ms` }}
//                   >
//                     <TramCard
//                       place={item.place}
//                       round={item.round}
//                       time={item.time}
//                       price={item.price}
//                     />
//                   </div>
//                 ))}

//               {mode === "other" &&
//                 otherItems
//                   .filter((item) => item.day === day)
//                   .map((item, idx) => (
//                     <div
//                       key={item.id}
//                       className="animate-fade-in"
//                       style={{ animationDelay: `${idx * 60}ms` }}
//                     >
//                       <OtherCard
//                         place={item.place}
//                         desc={item.desc}
//                         desc2={item.desc2}
//                         type={item.type}
//                         phone={item.phone}
//                         link={item.link}
//                         lineLink={item.lineLink}
//                       />
//                     </div>
//                   ))}
//             </>
//           )}
//         </section>
//       </section>

//       <div className="min-h-[77svh] max-w-107.5 mx-auto fixed bottom-0 w-full bg-[linear-gradient(-181deg,#FFE2A5_0%,#FBFCF0_36%,#FBFCF0_62%,#E6EFD8_100%)] z-1" />
//     </main>
//   );
// }

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DayButton from "../components/travel-page/day-btn";
import DayBlock from "../components/travel-page/day-block";
import TrainCard from "../components/travel-page/train-card";
import TramCard from "../components/travel-page/tram-card";
import OtherCard from "../components/travel-page/other-card";
import type { ITravelMode } from "../interfaces/navbar.interface";
import SubNavbar from "../components/navbar/sub-navbar";
import {
  useTrainItems,
  useTramItems,
  useOtherItems,
} from "../hooks/useTravelItems";
// import { IoIosArrowDown } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
// import { useNavbarTitle } from "../hooks/useNavbar";
import TrainLoader from "../components/skeleton-load/train-loader";
import TrainDirectionFilter from "../components/travel-page/train-direction-filter";
import { timeToMinutes } from "../utils/countdown";
import TravelLoader from "../components/skeleton-load/travel-loader";

export default function TravelPage() {
  const { t } = useTranslation();
  // const navigate = useNavigate();
  // const { setOverrideTitle } = useNavbarTitle();

  // const [leaving, setLeaving] = useState(false);
  const [entering, setEntering] = useState(true);

  const [mode, setMode] = useState<ITravelMode>("train");
  const [day, setDay] = useState<"weekday" | "weekend">("weekday");
  const [prevMode, setPrevMode] = useState<ITravelMode>(mode);
  const [modeLoading, setModeLoading] = useState(false);
  const [direction, setDirection] = useState<"CNX_LPH" | "LPH_CNX">("CNX_LPH");

  if (mode !== prevMode) {
    setPrevMode(mode);
    setModeLoading(true);
  }

  useEffect(() => {
    const timer = setTimeout(() => setEntering(false), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!modeLoading) return;
    const timer = setTimeout(() => setModeLoading(false), 350);
    return () => clearTimeout(timer);
  }, [modeLoading]);

  const { items: trainItems, loading: trainLoading } = useTrainItems();
  const { items: tramItems, loading: tramLoading } = useTramItems();
  const { items: otherItems, loading: otherLoading } = useOtherItems();

  const filtered = trainItems.filter((item) => {
    if (direction === "CNX_LPH") {
      return item.originStation.th.includes("เชียงใหม่");
    } else {
      return item.originStation.th.includes("ลำพูน");
    }
  });

  const loading =
    modeLoading ||
    (mode === "train"
      ? trainLoading
      : mode === "tram"
        ? tramLoading
        : otherLoading);

  // const handleClose = () => {
  //   setLeaving(true);
  //   setTimeout(() => {
  //     setOverrideTitle(null);
  //     navigate("/app");
  //   }, 100);
  // };

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const sorted = [...filtered].sort((a, b) => {
    const aMinutes = timeToMinutes(a.destinationTime);
    const bMinutes = timeToMinutes(b.destinationTime);
    const aPast = aMinutes < nowMinutes;
    const bPast = bMinutes < nowMinutes;

    if (aPast !== bPast) return aPast ? 1 : -1;
    return timeToMinutes(a.originTime) - timeToMinutes(b.originTime);
  });

  return (
    <main className="relative w-full h-full flex flex-col overflow-hidden">
      <SubNavbar
        mode={mode}
        setMode={setMode}
        mode1="train"
        mode2="tram"
        mode3="other"
        mode1Name={t("travel.train")}
        mode2Name={t("travel.tram")}
        mode3Name={t("travel.other")}
        isTabStyle={true}
        // leaving={leaving}
      />

      {/* <section
        className={`z-5 max-h-[85.5svh] shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)] flex-col absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-[25px] w-[95%] h-full flex items-center justify-start overflow-hidden bg-white transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          leaving || entering ? "translate-y-full" : "translate-y-0"
        }`}
      > */}
      <section
        className={`z-5 max-h-[85.5svh] shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)] flex-col absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-[25px] w-[95%] h-full flex items-center justify-start overflow-hidden bg-white transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          entering ? "translate-y-full" : "translate-y-0"
        }`}
      >
        {/* <div
          onClick={handleClose}
          className="w-full bg-[#BF4B17] flex justify-center items-center text-white py-1 cursor-pointer shrink-0"
        >
          <IoIosArrowDown size={24} />
        </div> */}

        <section
          className={`w-[90%] mx-auto flex justify-center items-center gap-x-4 ${mode !== "train" ? "border-b border-[#D9D9D9] py-5" : "pt-5"} shrink-0`}
        >
          {mode !== "train" ? (
            <>
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
                  <DayBlock
                    title={t("travel.open")}
                    desc={t("travel.openDesc")}
                  />
                  <DayBlock
                    title={t("travel.close")}
                    desc={t("travel.closeDesc")}
                  />
                </>
              )}
            </>
          ) : (
            <TrainDirectionFilter value={direction} onChange={setDirection} />
          )}
        </section>

        {mode === "train" && (
          <div className="w-[90%] border-b border-[#D9D9D9] pt-4 pb-1.5 text-center text-[14px] font-normal text-[#543A14]">
            <p className="w-[80%] mx-auto">
              ซื้อตั๋วได้ที่สถานีรถไฟต้นทาง โดยสามารถซื้อก่อนเวลารถไฟออก 2 ชม.
            </p>
          </div>
        )}

        <section
          className={`w-full flex-1 flex flex-col ${mode === "train" && !loading ? "gap-y-1" : "gap-y-4"} overflow-y-auto p-5`}
        >
          {loading ? (
            Array.from({ length: 2 }).map((_, i) =>
              mode === "train" ? (
                <TrainLoader key={i} />
              ) : (
                <TravelLoader key={i} />
              ),
            )
          ) : (
            <>
              {mode === "train" &&
                // trainItems
                //   .filter((item) => item.day === day)
                sorted.map((item, idx) => {
                  const isPast =
                    timeToMinutes(item.destinationTime) < nowMinutes;
                  return (
                    <div
                      key={item.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <TrainCard
                        origin={item.origin}
                        destination={item.destination}
                        originTime={item.originTime}
                        destinationTime={item.destinationTime}
                        // originStation={item.originStation}
                        // destinationStation={item.destinationStation}
                        price={item.price}
                        desc={item.desc}
                        isPast={isPast}
                      />
                    </div>
                  );
                })}

              {mode === "tram" &&
                tramItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <TramCard
                      place={item.place}
                      round={item.round}
                      time={item.time}
                      price={item.price}
                    />
                  </div>
                ))}

              {mode === "other" &&
                otherItems
                  .filter((item) => item.day === day)
                  .map((item, idx) => (
                    <div
                      key={item.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <OtherCard
                        place={item.place}
                        desc={item.desc}
                        desc2={item.desc2}
                        type={item.type}
                        phone={item.phone}
                        link={item.link}
                        lineLink={item.lineLink}
                      />
                    </div>
                  ))}
            </>
          )}
        </section>
      </section>

      <div className="min-h-[77svh] max-w-107.5 mx-auto fixed bottom-0 w-full bg-[linear-gradient(-181deg,#FFE2A5_0%,#FBFCF0_36%,#FBFCF0_62%,#E6EFD8_100%)] z-1" />
    </main>
  );
}
