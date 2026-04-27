import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";
import { BG_MAP } from "../constant/homepage";
import HomepageLoader from "../components/skeleton-load/homepage-loader";
import Hitbox from "../components/homepage/hitbox";

export default function Homepage() {
  const { i18n, t } = useTranslation();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [prevLang, setPrevLang] = useState(i18n.language);
  const [prevBg, setPrevBg] = useState<string | null>(null);
  const [selected, setSelected] = useState("tram1");
  const [selectWidth, setSelectWidth] = useState<number>(0);
  const measureRef = useRef<HTMLSpanElement>(null);

  if (i18n.language !== prevLang) {
    setPrevBg(BG_MAP[prevLang] || BG_MAP.th);
    setPrevLang(i18n.language);
    setLoaded(false);
  }

  const currentBg = BG_MAP[i18n.language] || BG_MAP.th;
  const carNumber = selected.replace("tram", "");
  const translatedLabel = `${t("homepage.car")} ${carNumber}`;

  useEffect(() => {
    if (measureRef.current) {
      setSelectWidth(measureRef.current.offsetWidth);
    }
  }, [selected, i18n.language, loaded]);

  return (
    <main className="relative w-full h-full bg-[linear-gradient(161deg,#FFE2A5_0%,#FBFCF0_22%,#FFFFFF_62%,#E6EFD8_100%)] overflow-hidden flex items-center justify-center">
      {!loaded && !prevBg && <HomepageLoader />}

      <div className="relative w-full h-full max-h-screen aspect-393/615 flex items-center justify-center">
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

        <Hitbox loaded={loaded} />

        <div className="absolute inset-0 z-20 pointer-events-none p-2.5">
          <span
            ref={measureRef}
            className="absolute invisible whitespace-nowrap text-[12px] font-medium pl-3 pr-8 py-1"
          >
            {translatedLabel}
          </span>

          {/* Top Left UI */}
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
              <img
                src="/icons/homepage/info-icon.svg"
                className="w-4 h-4"
                alt="info"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
