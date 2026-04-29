import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosMore } from "react-icons/io";
import { SKELETON } from "../skeleton-load/station-card-loader";

export default function StationCard({
  name,
  link,
  img,
}: {
  name: string;
  link: string;
  img: string;
}) {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      onClick={() => {
        window.open(link, "_blank", "noopener,noreferrer");
      }}
      className="bg-white h-full min-w-50 w-50 max-w-50 rounded-xl overflow-hidden shadow-[0_4px_10px_0_rgba(0,0,0,0.125)]"
    >
      <div className="relative w-full h-[60%] overflow-hidden">
        <div
          className={`${SKELETON} absolute inset-0 transition-opacity duration-500 ${
            imageLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src={img}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          alt={name}
        />
      </div>

      <div className="relative w-full h-[40%] px-3 py-2 text-[12px] font-medium">
        <div
          className={`absolute inset-0 flex flex-col gap-y-2 px-3 py-2 transition-opacity duration-500 ${
            imageLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className={`${SKELETON} w-full h-3 rounded-full`} />
          <div className={`${SKELETON} w-16 h-3 rounded-full`} />
        </div>

        <div
          className={`flex flex-col gap-y-1 transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-full flex justify-between items-center">
            <p className="truncate min-w-0 flex-1 mr-1">{name}</p>
            <IoIosMore size={16} />
          </div>
          <div className="w-full flex justify-start items-center gap-x-1">
            <p className="text-[#F48B3C]">{t("homepage.more")}</p>
            <IoIosArrowForward className="text-[#F48B3C]" />
          </div>
        </div>
      </div>
    </div>
  );
}
