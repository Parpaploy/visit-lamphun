import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { STATIONS } from "../../constant/travel";
import type { Direction } from "../../interfaces/content.interface";

export default function TrainDirectionFilter({
  value,
  onChange,
}: {
  value: Direction;
  onChange: (dir: Direction) => void;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "th" | "en" | "cn";

  const isForward = value === "CNX_LPH";
  const origin = isForward ? STATIONS.CNX : STATIONS.LPH;
  const dest = isForward ? STATIONS.LPH : STATIONS.CNX;

  const [flipped, setFlipped] = useState<boolean>(false);

  const originName = origin[lang] ?? origin.th;
  const destName = dest[lang] ?? dest.th;

  const [displayOrigin, setDisplayOrigin] = useState(originName);
  const [displayDest, setDisplayDest] = useState(destName);
  const [flash, setFlash] = useState<boolean>(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setFlash(true);
      setTimeout(() => {
        setDisplayOrigin(originName);
        setDisplayDest(destName);
        setFlash(false);
      }, 150);
    }, 0);
    return () => clearTimeout(t);
  }, [originName, destName]);

  const swap = () => {
    setFlipped((prev) => !prev);
    onChange(isForward ? "LPH_CNX" : "CNX_LPH");
  };

  return (
    <div className="relative w-full flex items-center">
      <div className="flex-1 flex flex-col items-center gap-1">
        <p className="text-[16px] font-bold text-[#543A14]">
          {t("form.originStation")}
        </p>
        <div className="drop-shadow-[0_0_12.3px_rgba(50,33,21,0.15)] text-[16px] font-normal text-black w-full rounded-l-[5px] px-3 py-1 text-center bg-white">
          <span
            style={{
              transition: flash
                ? "opacity 150ms ease-in"
                : "opacity 400ms ease-out",
            }}
            className={`inline-block ${flash ? "opacity-0" : "opacity-100"}`}
          >
            {displayOrigin}
          </span>
        </div>
      </div>

      <button
        onClick={swap}
        className="p-2.5 drop-shadow-[0_0_12.3px_rgba(50,33,21,0.15)] absolute left-1/2 -translate-x-1/2 z-10 top-5.5 shrink-0 w-11 h-11 rounded-full bg-[#BF4B17] flex items-center justify-center"
      >
        <div className="w-full h-full">
          <img
            className={`w-full h-full transition-transform duration-500 ${
              flipped ? "scale-x-[-1]" : "scale-x-100"
            }`}
            src="/icons/travelPage/swap-icon.svg"
          />
        </div>
      </button>

      <div className="flex-1 flex flex-col items-center gap-1">
        <p className="text-[16px] font-bold text-[#543A14]">
          {t("form.destinationStation")}
        </p>
        <div className="drop-shadow-[0_0_12.3px_rgba(50,33,21,0.15)] text-[16px] font-normal text-black w-full rounded-r-[5px] px-3 py-1 text-center bg-white">
          <span
            style={{
              transition: flash
                ? "opacity 150ms ease-in"
                : "opacity 400ms ease-out",
            }}
            className={`inline-block ${flash ? "opacity-0" : "opacity-100"}`}
          >
            {displayDest}
          </span>
        </div>
      </div>
    </div>
  );
}
