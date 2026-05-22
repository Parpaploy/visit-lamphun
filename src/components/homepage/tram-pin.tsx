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
      <div className="w-18 h-auto">
        <img className="w-full h-full" src="/icons/homepage/tram-pin.svg" />
      </div>
    </div>
  );
}
