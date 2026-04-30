import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { stationNumber } from "../../interfaces/homepage.interface";
import PopupLoader from "../skeleton-load/popup-loader";
import { useStationPopup } from "../../hooks/useStationPopup";
import { STATION_ID_MAP } from "../../constant/homepage";
import { ml } from "../../utils/ml";

export default function MainPopup({
  setIsPopup,
  setIsSubPopup,
  number,
  setStationExpanded,
}: {
  setIsPopup: (isPopup: boolean) => void;
  setIsSubPopup: (isPopup: boolean) => void;
  number: stationNumber;
  setStationExpanded: (number: stationNumber) => void;
}) {
  const { t, i18n } = useTranslation();
  const stationId = number !== 0 ? STATION_ID_MAP[number] : null;
  const { data } = useStationPopup(stationId);

  const header = ml(data?.header ?? { th: "", en: "", cn: "" }, i18n.language);
  const desc = ml(data?.desc ?? { th: "", en: "", cn: "" }, i18n.language);
  const img = data?.img ?? "";

  const [imageLoaded, setImageLoaded] = useState(!img);

  return (
    <div className="z-998 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-2.5 flex justify-center items-center">
      <div className="relative overflow-hidden p-8 flex flex-col justify-between items-center shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border border-[#D9D9D9] bg-white w-full h-full rounded-[26px]">
        {img && (
          <img
            src={img}
            className="hidden"
            onLoad={() => setImageLoaded(true)}
            alt=""
          />
        )}

        <button
          onClick={() => {
            setStationExpanded(number);
            setIsPopup(false);
            setIsSubPopup(false);
          }}
          className="rounded-full w-9 h-9 p-1.5 absolute top-3 right-3 bg-[#BF4B17] border border-[#75521F] shadow-[0_4px_4px_0_rgba(0,0,0,0.125)]"
        >
          <img className="w-full h-full" src="/icons/homepage/store-icon.svg" />
        </button>

        {!imageLoaded ? (
          <PopupLoader />
        ) : (
          <div className="animate-fade-in w-full h-[90%] flex flex-col justify-start items-center gap-y-5">
            <div className="w-full h-fit flex flex-col justify-start items-center gap-y-5">
              {header ? (
                <h1 className="text-[#543A14] font-bold text-[16px]">{header}</h1>
              ) : (
                <div className="h-4 w-40 bg-[#E8E8E8] rounded-full" />
              )}
              <div className="w-full h-42 rounded-xl overflow-hidden">
                {img ? (
                  <img className="w-full h-full object-cover" src={img} />
                ) : (
                  <div className="w-full h-full bg-[#E8E8E8]" />
                )}
              </div>
            </div>
            {desc ? (
              <p className="h-full overflow-y-auto pt-1 text-[#543A14] text-[16px] font-normal text-center">
                {desc}
              </p>
            ) : (
              <div className="w-full flex flex-col gap-y-2 pt-1">
                <div className="h-3 w-full bg-[#E8E8E8] rounded-full" />
                <div className="h-3 w-full bg-[#E8E8E8] rounded-full" />
                <div className="h-3 w-4/5 bg-[#E8E8E8] rounded-full" />
                <div className="h-3 w-full bg-[#E8E8E8] rounded-full" />
                <div className="h-3 w-3/5 bg-[#E8E8E8] rounded-full" />
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => {
            setIsPopup(false);
            setIsSubPopup(false);
          }}
          className="text-[16px] font-semibold mt-2 text-white bg-[#BF4B17] border border-[#BF4B17] rounded-full shadow-[0_4px_10px_0_rgba(0,0,0,0.125)] px-7 py-2"
        >
          {t("homepage.back")}
        </button>
      </div>
    </div>
  );
}
