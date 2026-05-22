import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import { BG_MAP, isSaturday, STATION_ID_MAP } from "../constant/homepage";
import HomepageLoader from "../components/skeleton-load/homepage-loader";
import Hitbox from "../components/homepage/hitbox";
import type { stationNumber } from "../interfaces/homepage.interface";
import StationCard from "../components/homepage/station-card";
import MainPopup from "../components/homepage/main-popup";
import SubPopup from "../components/homepage/sub-popup";
import { useStationPlaces } from "../hooks/useStationPlaces";
import { useTramPosition } from "../hooks/useTramPosition";
import TramPin from "../components/homepage/tram-pin";
import type { Tram } from "../interfaces/tram.interface";
import { fetchAllTrams } from "../services/tram.services";
import InactivePopup from "../components/homepage/inactive-popup";
import { formatCountdown } from "../utils/countdown";

const getActiveBg = (lang: string, station: stationNumber) => {
  if (station !== 0) {
    if (station === 4) {
      if (isSaturday) {
        return `/images/homepage/${lang}/${lang}-${station}.svg`;
      } else return `/images/homepage/${lang}/${lang}-${station}-weekend.svg`;
    } else return `/images/homepage/${lang}/${lang}-${station}.svg`;
  }
  return BG_MAP[lang] || BG_MAP.th;
};

export default function Homepage() {
  const { i18n, t } = useTranslation();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [prevLang, setPrevLang] = useState(i18n.language);
  const [prevBg, setPrevBg] = useState<string | null>(null);
  const [stationExpanded, setStationExpanded] = useState<stationNumber>(0);
  const [prevStation, setPrevStation] = useState<stationNumber>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const [isSubPopup, setIsSubPopup] = useState<boolean>(false);
  const [trams, setTrams] = useState<Tram[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [isInactivePopup, setIsInactivePopup] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef<number>(600);

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

  const lang = i18n.language;
  const currentBg = getActiveBg(lang, stationExpanded);
  const activeStationId =
    stationExpanded !== 0 ? STATION_ID_MAP[stationExpanded] : null;
  const { places, loading: placesLoading } = useStationPlaces(activeStationId);

  const selectedTram = trams.find((t) => t.id === selected);
  // const translatedLabel = selectedTram?.name ?? selected;
  const isActive = selectedTram?.status === "active";
  const tram = useTramPosition(selected);
  const tramStationId = tram?.current_station_id ?? null;
  const tramUpdatedAt = tram?.last_checkin_at ?? null;

  const tramStationNumber = Object.entries(STATION_ID_MAP).find(
    ([, id]) => id === tramStationId,
  )?.[0];

  useEffect(() => {
    fetchAllTrams().then((data) => {
      setTrams(data);

      if (data.length > 0) {
        setSelected(data[0].id);

        if (data[0].status === "active") {
          setIsPopup(true);
        } else {
          setIsInactivePopup(true);
        }
      }
    });
  }, []);

  const prevTramStationIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!tramStationId || !tramUpdatedAt) return;

    if (countdownRef.current) clearInterval(countdownRef.current);

    const elapsed = Math.floor(
      (Date.now() - tramUpdatedAt.toDate().getTime()) / 1000,
    );
    const remaining = Math.max(600 - elapsed, 0);

    secondsRef.current = remaining;

    countdownRef.current = setInterval(() => {
      if (secondsRef.current <= 0) {
        setCountdown(0);
        clearInterval(countdownRef.current!);
        return;
      }
      secondsRef.current -= 1;
      setCountdown(secondsRef.current);
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [tramStationId, tramUpdatedAt]);

  useEffect(() => {
    if (!selectedTram) return;
    if (selectedTram.status !== "active" || !tramStationId) return;

    if (prevTramStationIdRef.current !== tramStationId) {
      prevTramStationIdRef.current = tramStationId;
      setIsPopup(true);
    }
  }, [tramStationId, selectedTram]);

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
            {loaded && <TramPin stationId={tramStationId} loaded={loaded} />}
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

            <div
              className={`z-20 flex justify-start items-center gap-x-3 absolute -bottom-1 left-0 w-full h-45 overflow-x-auto px-7 py-5 transition-opacity duration-500 ${isExiting ? "opacity-0" : "opacity-100"}`}
            >
              {placesLoading && (
                <p className="text-[12px] text-[#8B724E]">
                  {t("homepage.loading")}
                </p>
              )}
              {!placesLoading && places.length === 0 && (
                <p className="text-[12px] text-[#C6C6C6]">
                  {t("homepage.noPlaces")}
                </p>
              )}
              {!placesLoading &&
                places.map((place) => (
                  <StationCard
                    key={place.id}
                    name={
                      place.name[i18n.language as keyof typeof place.name] ??
                      place.name.th
                    }
                    img={place.img}
                    link={place.link}
                  />
                ))}
            </div>
          </>
        )}

        <div
          className={`absolute inset-0 z-20 pointer-events-none p-2.5 transition-opacity duration-500 ease-in-out ${
            stationExpanded === 0 && loaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute top-2 left-2.5 pointer-events-auto">
            <p className="text-[12px] text-[#8B724E] font-medium">
              {t("homepage.selectCar")}
            </p>
            <div className="relative inline-block mt-0.5">
              <select
                value={selected}
                onChange={(e) => {
                  const newSelected = e.target.value;
                  setSelected(newSelected);

                  const newTram = trams.find((t) => t.id === newSelected);

                  if (newTram?.status === "active") {
                    setIsPopup(true);
                    setIsInactivePopup(false);
                  } else {
                    setIsInactivePopup(true);
                    setIsPopup(false);
                  }
                }}
                className="outline-none appearance-none border border-[#C6C6C6] bg-white/90 backdrop-blur-sm pl-3 pr-6 py-1 rounded-full text-[12px] text-[#543A14] font-medium transition-all duration-300"
              >
                {trams.map((tram, index) => (
                  <option key={tram.id} value={tram.id}>
                    {t("homepage.car")} {index + 1}
                  </option>
                ))}
              </select>
              <div className="text-[#C6C6C6] pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                <IoIosArrowDown />
              </div>
            </div>
          </div>

          <div className="absolute top-2 right-2.5 flex flex-col items-end text-right pointer-events-auto">
            <span className="text-[12px] text-[#8B724E] font-medium">
              {countdown === 0 ? t("homepage.ready") : t("homepage.time")}
            </span>
            <div className="text-[12px] font-medium flex items-center gap-1 mt-1">
              <span className="text-[#543A14]">
                {countdown === null
                  ? `... ${t("homepage.minute")}`
                  : countdown === 0
                    ? t("homepage.wait")
                    : `${formatCountdown(countdown)} ${t("homepage.minute")}`}
              </span>
              <button onClick={() => setIsPopup(true)} className="w-4 h-4">
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
            onClick={() => setIsSubPopup(true)}
            className="z-11 shadow-[0_4px_4px_0_rgba(0,0,0,0.125)] px-[16.5px] py-[5.5px] rounded-full w-fit bg-[#BF4B17] aspect-square border border-[#75521F]"
          >
            <div className="w-1.25">
              <img className="w-full h-full" src="/icons/homepage/i-icon.svg" />
            </div>
          </button>
        </div>
      </div>

      {isActive && isPopup && tramStationNumber && (
        <MainPopup
          setIsPopup={setIsPopup}
          setIsSubPopup={setIsSubPopup}
          number={Number(tramStationNumber) as stationNumber}
          setStationExpanded={setStationExpanded}
        />
      )}

      {isSubPopup && (
        <SubPopup
          setIsPopup={setIsPopup}
          setIsSubPopup={setIsSubPopup}
          stationId={activeStationId}
        />
      )}

      {isInactivePopup && (
        <InactivePopup setIsInactivePopup={setIsInactivePopup} />
      )}
    </main>
  );
}
