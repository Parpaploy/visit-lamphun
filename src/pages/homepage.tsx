import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import { BG_MAP } from "../constant/homepage";
import HomepageLoader from "../components/skeleton-load/homepage-loader";
import Hitbox from "../components/homepage/hitbox";
import type { stationNumber } from "../interfaces/homepage.interface";
import StationCard from "../components/homepage/station-card";
import MainPopup from "../components/homepage/main-popup";
import SubPopup from "../components/homepage/sub-popup";

const getActiveBg = (lang: string, station: stationNumber) => {
  if (station !== 0) {
    return `/images/homepage/${lang}/${lang}-${station}.svg`;
  }
  return BG_MAP[lang] || BG_MAP.th;
};

export default function Homepage() {
  const { i18n, t } = useTranslation();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [prevLang, setPrevLang] = useState(i18n.language);
  const [prevBg, setPrevBg] = useState<string | null>(null);
  const [selected, setSelected] = useState("tram1");
  const [selectWidth, setSelectWidth] = useState<number>(0);
  const [stationExpanded, setStationExpanded] = useState<stationNumber>(0);
  const [prevStation, setPrevStation] = useState<stationNumber>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isPopup, setIsPopup] = useState<boolean>(true);
  const [isSubPopup, setIsSubPopup] = useState<boolean>(false);

  const measureRef = useRef<HTMLSpanElement>(null);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      setStationExpanded(0);
      setIsExiting(false);
    }, 500);
  };

  if (i18n.language !== prevLang) {
    setPrevBg(getActiveBg(prevLang, stationExpanded));
    setPrevLang(i18n.language);
    setLoaded(false);
  }

  if (stationExpanded !== prevStation) {
    setPrevBg(getActiveBg(i18n.language, prevStation));
    setPrevStation(stationExpanded);
    setLoaded(false);
  }

  const currentBg = getActiveBg(i18n.language, stationExpanded);
  const carNumber = selected.replace("tram", "");
  const translatedLabel = `${t("homepage.car")} ${carNumber}`;

  useEffect(() => {
    if (measureRef.current) {
      setSelectWidth(measureRef.current.offsetWidth);
    }
  }, [selected, i18n.language, loaded]);

  return (
    <main
      className={`relative w-full h-full ${stationExpanded !== 0 ? "bg-[#FBFCF0]" : "bg-[linear-gradient(161deg,#FFE2A5_0%,#FBFCF0_22%,#FFFFFF_62%,#E6EFD8_100%)]"} overflow-hidden flex items-center justify-center`}
    >
      {!loaded && !prevBg && <HomepageLoader />}

      <div className="relative w-full h-full max-h-screen aspect-393/615 flex items-center justify-center">
        {stationExpanded === 0 && (
          <>
            <div
              className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-700 ease-in-out ${
                loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              style={{ backgroundImage: `url('${currentBg}')` }}
            >
              <img
                key={currentBg}
                src={currentBg}
                className="hidden"
                onLoad={() => setLoaded(true)}
                alt="background-loader"
              />
            </div>
            <Hitbox loaded={loaded} setStationExpanded={setStationExpanded} />
          </>
        )}

        {stationExpanded !== 0 && (
          <>
            <div
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out ${
                isExiting
                  ? "opacity-0 scale-95"
                  : loaded
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
              }`}
              style={{ backgroundImage: `url('${currentBg}')` }}
            >
              <img
                key={currentBg}
                src={currentBg}
                className="hidden"
                onLoad={() => setLoaded(true)}
                alt="background-loader"
              />
            </div>

            <div className="z-10 absolute -bottom-1 left-0 w-full h-45 backdrop-blur-[5px] bg-[linear-gradient(0deg,rgba(255,255,255,0.8)_0%,transparent_100%)] mask-[linear-gradient(0deg,black_20%,transparent_100%)]" />

            <div className={`z-20 flex justify-start items-center gap-x-3 absolute -bottom-1 left-0 w-full h-45 overflow-x-auto px-7 py-5 transition-opacity duration-500 ${isExiting ? "opacity-0" : "opacity-100"}`}>
              <StationCard
                name=" อนุสาวรีย์พระนางจามเทวี"
                img="/images/contact-page/tourist-care-pic.svg"
                link="https://react-icons.github.io/react-icons/search/#q=more"
              />
            </div>
          </>
        )}

        <div
          className={`absolute inset-0 z-20 pointer-events-none p-2.5 transition-opacity duration-500 ease-in-out ${
            stationExpanded === 0 && loaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <span
            ref={measureRef}
            className="absolute invisible whitespace-nowrap text-[12px] font-medium pl-3 pr-8 py-1"
          >
            {translatedLabel}
          </span>

          <div className="absolute top-2 left-2.5 pointer-events-auto">
            <p className="text-[12px] text-[#8B724E] font-medium">
              {t("homepage.selectCar")}
            </p>
            <div className="relative inline-block mt-0.5">
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                style={{ width: selectWidth > 0 ? selectWidth : "auto" }}
                className="outline-none appearance-none border border-[#C6C6C6] bg-white/90 backdrop-blur-sm pl-3 pr-6 py-1 rounded-full text-[12px] text-[#543A14] font-medium transition-all duration-300"
              >
                <option value="tram1">{t("homepage.car")} 1 </option>
                <option value="tram2">{t("homepage.car")} 2 </option>
                <option value="tram3">{t("homepage.car")} 3 </option>
                <option value="tram4">{t("homepage.car")} 4 </option>
              </select>
              <div className="text-[#C6C6C6] pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                <IoIosArrowDown />
              </div>
            </div>
          </div>

          <div className="absolute top-2 right-2.5 flex flex-col items-end text-right pointer-events-auto">
            <span className="text-[12px] text-[#8B724E] font-medium">
              {t("homepage.ready")} | {t("homepage.time")}
            </span>
            <div className="text-[12px] font-medium flex items-center gap-1 mt-1">
              <span className="text-[#543A14]">
                10.00 {t("homepage.minute")} | {t("homepage.wait")}
              </span>
              <button
                onClick={() => {
                  setIsPopup(true);
                }}
                className="w-4 h-4"
              >
                <img
                  src="/icons/homepage/info-icon.svg"
                  className="w-full h-full"
                  alt="info"
                />
              </button>
            </div>
          </div>
        </div>

        <div
          className={`absolute w-full top-0 left-0 z-20 flex justify-between items-center p-3 pb-0 transition-opacity duration-500 ease-in-out ${
            stationExpanded !== 0 && loaded && !isExiting
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="z-10 absolute top-0 left-0 w-full h-full backdrop-blur-[5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.8)_0%,transparent_100%)] mask-[linear-gradient(180deg,black_0%,transparent_100%)]" />

          <button
            onClick={handleBack}
            className="z-11 shadow-[0_4px_4px_0_rgba(0,0,0,0.125)] p-0.75 rounded-full w-fit bg-white aspect-square border border-[#D9D9D9]"
          >
            <IoIosArrowBack className="text-[#543A14]" size={32} />
          </button>

          <button
            onClick={() => {
              setIsSubPopup(true);
            }}
            className="z-11 shadow-[0_4px_4px_0_rgba(0,0,0,0.125)] px-[16.5px] py-[5.5px] rounded-full w-fit bg-[#BF4B17] aspect-square border border-[#75521F]"
          >
            <div className="w-1.25">
              <img className="w-full h-full" src="/icons/homepage/i-icon.svg" />
            </div>
          </button>
        </div>
      </div>

      {isPopup && (
        <MainPopup
          setIsPopup={setIsPopup}
          setIsSubPopup={setIsSubPopup}
          header="วัดพระธาตุหริภุญชัย"
          desc={`สถานที่ศักดิ์สิทธิ์คู่บ้านคู่เมืองชาวลำพูนโบราณสถานที่สำคัญของนครหริภุญชัย เป็นวังที่พระเจ้าอาทิตยราชกษัตริย์แห่งราชวงศ์จามเทวีวงศ์อุทิศถวายให้เป็น"วัด"พระบรมธาตุหริภุญชัยตั้งอยู่หลังวิหารหลวงประดิษฐานพระเกศาธาตุบรรจุในโกศทองคำ สร้างขึ้นในปี พ.ศ.1440`}
          img="/images/contact-page/line-pic.svg"
          number={1}
          setStationExpanded={setStationExpanded}
        />
      )}

      {isSubPopup && (
        <SubPopup
          setIsPopup={setIsPopup}
          setIsSubPopup={setIsSubPopup}
          header="วัดพระธาตุหริภุญชัย"
          desc={`สถานที่ศักดิ์สิทธิ์คู่บ้านคู่เมืองชาวลำพูนโบราณสถานที่สำคัญของนครหริภุญชัย เป็นวังที่พระเจ้าอาทิตยราชกษัตริย์แห่งราชวงศ์จามเทวีวงศ์อุทิศถวายให้เป็น"วัด"พระบรมธาตุหริภุญชัยตั้งอยู่หลังวิหารหลวงประดิษฐานพระเกศาธาตุบรรจุในโกศทองคำ สร้างขึ้นในปี พ.ศ.1440`}
          img="/images/contact-page/line-pic.svg"
        />
      )}
    </main>
  );
}
