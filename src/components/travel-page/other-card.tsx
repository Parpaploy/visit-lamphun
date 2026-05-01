import { useTranslation } from "react-i18next";
import { ml } from "../../utils/ml";
import type { MLString } from "../../interfaces/content.interface";

export default function OtherCard({
  place,
  desc,
  desc2,
  type = "van",
  phone,
  link,
  lineLink,
}: {
  place: MLString;
  desc: MLString;
  desc2?: MLString;
  type?: "van" | "tricycle" | "songthaew";
  phone?: string;
  link?: string;
  lineLink?: string;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <>
      {type === "songthaew" && (
        <div className="flex flex-col bg-white justify-center items-center w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-2 border-[#D9D9D9] rounded-[20px]">
          <div className="w-full pl-7 pt-5 pb-3 pr-3">
            <div className="flex justify-start items-center gap-x-3 mb-2">
              <div className="w-14 h-auto">
                <img className="w-full h-full" src="/icons/travelPage/bus.svg" />
              </div>
              <div className="font-medium flex flex-col justify-center items-start gap-y-1">
                <p className="font-bold text-[16px] text-black leading-5.5">{ml(place, lang)}</p>
                <p className="text-[14px] text-[#543A14]">{ml(desc, lang)}</p>
              </div>
            </div>
            <div className="w-full flex justify-end items-center">
              <div onClick={() => link && window.open(link, "_blank", "noopener,noreferrer")} className={`text-[12px] border border-[#BF4B17] rounded-full px-3 ${link ? "cursor-pointer" : ""}`}>{t("menu.more")}</div>
            </div>
          </div>
        </div>
      )}

      {type === "tricycle" && (
        <div className="flex flex-col bg-white justify-center items-center w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-2 border-[#D9D9D9] rounded-[20px]">
          <div className="w-full pl-7 pt-5 pb-3 pr-3">
            <div className="flex justify-start items-start gap-x-3 mb-2">
              <div className="w-20 h-auto">
                <img className="w-full h-full" src="/icons/travelPage/tricycle.svg" />
              </div>
              <div className="font-medium flex flex-col justify-center items-start gap-y-1">
                <p className="font-bold text-[16px] text-black leading-5.5">{ml(place, lang)}</p>
                <p className="text-[14px] text-[#543A14]">{ml(desc, lang)}</p>
                {phone && (
                  <div className="flex justify-start items-center gap-x-2">
                    <div className="w-5.5 h-5.5">
                      <img className="w-full h-full" src="/icons/travelPage/phone-icon.svg" />
                    </div>
                    <p className="text-[14px] text-[#543A14]">{phone}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full flex justify-end items-center">
              <div onClick={() => link && window.open(link, "_blank", "noopener,noreferrer")} className={`text-[12px] border border-[#BF4B17] rounded-full px-3 ${link ? "cursor-pointer" : ""}`}>{t("menu.more")}</div>
            </div>
          </div>
        </div>
      )}

      {type === "van" && (
        <div className="flex flex-col bg-white justify-center items-center w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-2 border-[#D9D9D9] rounded-[20px]">
          <div className="w-full pl-7 pt-5 pb-3 pr-3">
            <div className="flex justify-start items-center gap-x-3 mb-2">
              <div className="w-17 h-auto">
                <img className="w-full h-full" src="/icons/travelPage/tram.svg" />
              </div>
              <div className="font-medium flex flex-col justify-center items-start gap-y-1">
                <p className="font-bold text-[16px] text-black leading-5.5">{ml(place, lang)}</p>
                <p className="text-[14px] text-[#543A14]">{ml(desc, lang)}</p>
              </div>
            </div>
            <div className="flex justify-start items-center gap-x-3 mb-2">
              <div className="w-14 h-auto">
                <img className="w-full h-full" src="/icons/travelPage/line-qr.svg" />
              </div>
              <div className="font-medium flex flex-col justify-center items-start gap-y-1">
                <p className="text-[14px] text-[#543A14]">{desc2 ? ml(desc2, lang) : ""}</p>
              </div>
            </div>
            <div className="w-full flex justify-end items-center gap-x-2">
              {lineLink && (
                <div
                  onClick={() => window.open(lineLink, "_blank", "noopener,noreferrer")}
                  className="text-[12px] text-white bg-[#1DCC64] border border-[#1DCC64] rounded-full px-3 cursor-pointer"
                >
                  {t("menu.friend")}
                </div>
              )}
              <div onClick={() => link && window.open(link, "_blank", "noopener,noreferrer")} className={`text-[12px] bg-white border border-[#BF4B17] rounded-full px-3 ${link ? "cursor-pointer" : ""}`}>{t("menu.more")}</div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
