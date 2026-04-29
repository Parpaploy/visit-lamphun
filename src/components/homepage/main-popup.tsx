import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { stationNumber } from "../../interfaces/homepage.interface";
import PopupLoader from "../skeleton-load/popup-loader";

export default function MainPopup({
  setIsPopup,
  setIsSubPopup,
  header,
  desc,
  img,
  number,
  setStationExpanded,
}: {
  setIsPopup: (isPopup: boolean) => void;
  setIsSubPopup: (isPopup: boolean) => void;
  header: string;
  desc: string;
  img: string;
  number: stationNumber;
  setStationExpanded: (number: stationNumber) => void;
}) {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="z-998 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-2.5 flex justify-center items-center">
      <div className="relative overflow-hidden p-8 flex flex-col justify-between items-center shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border border-[#D9D9D9] bg-white w-full h-full rounded-[26px]">
        <img
          src={img}
          className="hidden"
          onLoad={() => setImageLoaded(true)}
          alt=""
        />

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
              <h1 className="text-[#543A14] font-bold text-[16px]">{header}</h1>
              <div className="w-full h-42 rounded-xl overflow-hidden">
                <img className="w-full h-full object-cover" src={img} />
              </div>
            </div>
            <p className="h-full overflow-y-auto pt-1 text-[#543A14] text-[16px] font-normal text-center">
              {desc}
            </p>
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
