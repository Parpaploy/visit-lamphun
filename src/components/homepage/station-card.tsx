import { useTranslation } from "react-i18next";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosMore } from "react-icons/io";

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

  return (
    <div
      onClick={() => {
        window.open(link, "_blank", "noopener,noreferrer");
      }}
      className="bg-white h-full min-w-50 w-50 max-w-50 rounded-xl overflow-hidden shadow-[0_4px_10px_0_rgba(0,0,0,0.125)]"
    >
      <div className="w-full h-[60%] rounded-b-xl overflow-hidden">
        <img className="w-full h-full object-cover" src={img} />
      </div>

      <div className="w-full h-[40%] flex flex-col justify-start items-start gap-y-1 text-[12px] font-medium px-3 py-2">
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
  );
}
