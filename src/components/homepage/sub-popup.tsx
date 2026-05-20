import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PopupLoader from "../skeleton-load/popup-loader";
import { useStationPopup } from "../../hooks/useStationPopup";
import { ml } from "../../utils/ml";

export default function SubPopup({
  setIsPopup,
  setIsSubPopup,
  stationId,
}: {
  setIsPopup: (isPopup: boolean) => void;
  setIsSubPopup: (isPopup: boolean) => void;
  stationId: string | null;
}) {
  const { t, i18n } = useTranslation();
  const { data } = useStationPopup(stationId);

  const header = ml(data?.header ?? { th: "", en: "", cn: "" }, i18n.language);
  const desc = ml(data?.desc ?? { th: "", en: "", cn: "" }, i18n.language);
  const img = data?.img ?? "";

  const scrollRef = useRef<HTMLDivElement>(null);

  const [imageLoaded, setImageLoaded] = useState(!img);
  const [showTopFade, setShowTopFade] = useState<boolean>(false);
  const [showBottomFade, setShowBottomFade] = useState<boolean>(true);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowTopFade(el.scrollTop > 10);
    setShowBottomFade(el.scrollTop + el.clientHeight < el.scrollHeight - 10);
  };

  return (
    <div className="z-998 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-2.5 flex justify-center items-center">
      <div className="overflow-hidden p-8 flex flex-col justify-between items-center shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border border-[#D9D9D9] bg-white w-full h-full rounded-[26px]">
        {img && (
          <img
            src={img}
            className="hidden"
            onLoad={() => setImageLoaded(true)}
            alt=""
          />
        )}

        {!imageLoaded ? (
          <PopupLoader />
        ) : (
          <div className="animate-fade-in w-full h-[90%] flex flex-col justify-start items-center gap-y-5 min-h-0">
            <div className="w-full h-fit flex flex-col justify-start items-center gap-y-5">
              {header ? (
                <h1 className="text-[#543A14] font-bold text-[16px]">
                  {header}
                </h1>
              ) : (
                <div className="h-4 w-40 bg-[#E8E8E8] rounded-full" />
              )}
              <div className="w-full h-42 rounded-xl overflow-hidden">
                {img ? (
                  <img
                    className="w-full h-full object-cover object-top"
                    src={img}
                  />
                ) : (
                  <div className="w-full h-full bg-[#E8E8E8]" />
                )}
              </div>
            </div>

            {desc ? (
              <div className="relative w-full flex-1 min-h-0">
                <div
                  className={`z-100 pointer-events-none absolute -top-1 left-0 w-full h-10 transition-opacity duration-50 ${showTopFade ? "block opacity-100" : "hidden opacity-0"}`}
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,1) 90%, rgba(255,255,255,1) 100%)",
                  }}
                />

                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="h-full overflow-y-auto pt-1 text-[#543A14] text-[16px] font-normal text-center"
                >
                  <p>{desc}</p>

                  <div
                    className={`z-100 pointer-events-none sticky -bottom-1 left-0 h-10 w-full transition-opacity duration-50 ${showBottomFade ? "block opacity-100" : "hidden opacity-0"}`}
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,1) 90%, rgba(255,255,255,1) 100%)",
                    }}
                  />
                </div>
              </div>
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
          {t("homepage.close")}
        </button>
      </div>
    </div>
  );
}
