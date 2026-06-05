// export default function SubNavbar<T extends string>({
//   mode,
//   setMode,
//   mode1,
//   mode2,
//   mode3,
//   mode1Name,
//   mode2Name,
//   mode3Name,
//   isSmallOne = false,
// }: {
//   mode: T;
//   setMode: (value: T) => void;
//   mode1: T;
//   mode2: T;
//   mode3: T;
//   mode1Name: string;
//   mode2Name: string;
//   mode3Name: string;
//   isSmallOne?: boolean;
// }) {
//   return (
//     <>
//       {isSmallOne ? (
//         <section className="z-900 pt-3 w-full h-[9svh] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] flex justify-between items-center">
//           <button
//             onClick={() => {
//               setMode(mode1);
//             }}
//             className="relative h-full w-[40%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
//           >
//             <p>{mode1Name}</p>

import { useEffect, useState } from "react";
import i18n from "../../i18n";

//             {mode === mode1 && (
//               <div className="z-100 absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
//             )}
//           </button>
//           <button
//             onClick={() => {
//               setMode(mode2);
//             }}
//             className="relative h-full w-[40%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
//           >
//             <p>{mode2Name}</p>

//             {mode === mode2 && (
//               <div className="z-100 absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
//             )}
//           </button>
//           <button
//             onClick={() => {
//               setMode(mode3);
//             }}
//             className="relative h-full w-[20%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
//           >
//             <p>{mode3Name}</p>

//             {mode === mode3 && (
//               <div className="z-100 absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
//             )}
//           </button>
//         </section>
//       ) : (
//         <section className="w-full pt-3 h-[9svh] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] flex justify-between items-center">
//           <button
//             onClick={() => {
//               setMode(mode1);
//             }}
//             className="relative h-full w-[33%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
//           >
//             <p>{mode1Name}</p>

//             {mode === mode1 && (
//               <div className="z-100 absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
//             )}
//           </button>
//           <button
//             onClick={() => {
//               setMode(mode2);
//             }}
//             className="relative h-full w-[33%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
//           >
//             <p>{mode2Name}</p>

//             {mode === mode2 && (
//               <div className="z-100 absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
//             )}
//           </button>
//           <button
//             onClick={() => {
//               setMode(mode3);
//             }}
//             className="relative h-full w-[33%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
//           >
//             <p>{mode3Name}</p>

//             {mode === mode3 && (
//               <div className="z-100 absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
//             )}
//           </button>
//         </section>
//       )}
//     </>
//   );
// }

export default function SubNavbar<T extends string | null>({
  mode,
  setMode,
  mode1,
  mode2,
  mode3,
  mode1Name,
  mode2Name,
  mode3Name,
  isSmallOne = false,
  isTabStyle = false,
  leaving,
  entering: enteringProp,
}: {
  mode: T;
  setMode: (value: T) => void;
  mode1: T;
  mode2: T;
  mode3: T;
  mode1Name: string;
  mode2Name: string;
  mode3Name: string;
  isSmallOne?: boolean;
  isTabStyle?: boolean;
  leaving?: boolean;
  entering?: boolean;
}) {
  const [localEntering, setLocalEntering] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setLocalEntering(false), 10);
    return () => clearTimeout(timer);
  }, []);

  const hidden = (enteringProp ?? localEntering) || leaving;

  if (isTabStyle) {
    return (
      <div
        className={`z-0 w-[90%] mx-auto -mb-2 items-end flex justify-center gap-1 pt-3 transition-all duration-500 ease-out ${
          hidden ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        {[
          { m: mode1, name: mode1Name },
          { m: mode2, name: mode2Name },
          { m: mode3, name: mode3Name },
        ].map(({ m, name }) => (
          <div
            key={m}
            onClick={() => setMode(m)}
            className={`transition-all duration-200 ${i18n.language !== "en" ? "whitespace-nowrap" : ""} ${
              mode === m
                ? "min-h-27 shadow-[0_0px_12.3px_0_rgba(191,75,23)] py-3 text-white font-bold bg-[#BF4B17]"
                : "min-h-25 py-2 bg-white/80 text-black font-normal"
            } w-full text-[16px] rounded-t-[15px] text-center px-1`}
          >
            {name}
          </div>
        ))}
      </div>
    );
  }

  if (isSmallOne) {
    return (
      <section className="z-900 pt-3 w-full h-[9svh] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] flex justify-between items-center">
        {[
          { m: mode1, name: mode1Name, w: "w-[40%]" },
          { m: mode2, name: mode2Name, w: "w-[40%]" },
          { m: mode3, name: mode3Name, w: "w-[20%]" },
        ].map(({ m, name, w }) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`relative h-full ${w} flex justify-center items-center font-semibold text-[#543A14] text-[15px]`}
          >
            <p>{name}</p>
            {mode === m && (
              <div className="z-100 absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
            )}
          </button>
        ))}
      </section>
    );
  }

  return (
    <section className="w-full pt-3 h-[9svh] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] flex justify-between items-center">
      {[
        { m: mode1, name: mode1Name },
        { m: mode2, name: mode2Name },
        { m: mode3, name: mode3Name },
      ].map(({ m, name }) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className="relative h-full w-[33%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
        >
          <p>{name}</p>
          {mode === m && (
            <div className="z-100 absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
          )}
        </button>
      ))}
    </section>
  );
}
