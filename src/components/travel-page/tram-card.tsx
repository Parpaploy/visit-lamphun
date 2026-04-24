import { useTranslation } from "react-i18next";

export default function TramCard({
  place,
  time,
  price,
}: {
  place: string;
  time: string;
  price: number;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-white justify-center items-center w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-2 border-[#D9D9D9] rounded-[20px]">
      <div className="w-full pl-7 pt-5 pb-3 pr-3">
        <div className="flex justify-start items-center gap-x-3">
          <div className="w-14 h-auto">
            <img className="w-full h-full" src="/icons/travelPage/tram.svg" />
          </div>

          <div className="font-medium flex flex-col justify-center items-start">
            <p className="font-bold text-[16px] text-black leading-5.5">
              {place}
            </p>
            <p className="text-[14px] text-[#543A14]">{time}</p>
            <p className="text-[12px] text-[#ADADAD]">
              ราคา {price} บาทตลอดสาย
            </p>
          </div>
        </div>

        <div className="w-full flex justify-end items-center">
          <div className="text-[12px] border border-[#BF4B17] rounded-full px-3">
            {t("menu.more")}
          </div>
        </div>
      </div>
    </div>
  );
}
