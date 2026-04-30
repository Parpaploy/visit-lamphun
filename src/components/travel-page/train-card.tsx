import { useTranslation } from "react-i18next";
import { ml } from "../../utils/ml";
import type { MLString } from "../../interfaces/content.interface";

export default function TrainCard({
  origin,
  destination,
  originTime,
  destinationTime,
  originStation,
  destinationStation,
  price,
  desc,
}: {
  origin: MLString;
  destination: MLString;
  originTime: string;
  destinationTime: string;
  originStation: MLString;
  destinationStation: MLString;
  price: number;
  desc: MLString;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div className="flex flex-col bg-white justify-center items-center w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-2 border-[#D9D9D9] rounded-[20px]">
      <div className="w-full p-4">
        <div className="w-full flex justify-between items-center gap-x-3 pb-4 border-b border-[#D9D9D9] border-dashed">
          <div className="flex flex-col justify-center items-center gap-y-2">
            <div className="flex justify-center items-center gap-x-3">
              <div className="w-12 h-auto">
                <img className="w-full h-full" src="/icons/travelPage/blue-train.svg" />
              </div>
              <div className="font-medium text-[16px] text-[#543A14] flex flex-col justify-center items-start">
                <p>{ml(origin, lang)}</p>
                <p>{originTime}</p>
              </div>
            </div>
            <p className="font-medium text-[12px] text-[#ADADAD]">{ml(originStation, lang)}</p>
          </div>

          <div className="w-full mb-5">
            <img className="w-full h-full" src="/icons/travelPage/arrow.svg" alt="" />
          </div>

          <div className="flex flex-col justify-center items-center gap-y-2">
            <div className="flex justify-center items-center gap-x-3">
              <div className="font-medium text-[16px] text-[#543A14] flex flex-col justify-center items-end">
                <p>{ml(destination, lang)}</p>
                <p>{destinationTime}</p>
              </div>
              <div className="w-12 h-auto">
                <img className="w-full h-full" src="/icons/travelPage/orange-train.svg" />
              </div>
            </div>
            <p className="font-medium text-[12px] text-[#ADADAD]">{ml(destinationStation, lang)}</p>
          </div>
        </div>

        <div className="w-full flex justify-between items-center pt-4">
          <p className="font-semibold text-[14px]">
            <span className="text-[#D37A41] mr-1">{price}</span>
            <span className="text-black">THB</span>
          </p>
          <p className="font-medium text-[12px]">{ml(desc, lang)}</p>
          <div className="text-[12px] border border-[#BF4B17] rounded-full px-3">
            {t("menu.more")}
          </div>
        </div>
      </div>
    </div>
  );
}
