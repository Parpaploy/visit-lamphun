import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { recordTransportUsage } from "../services/stat.services";

export default function LandingPage() {
  const [percentage, setPercentage] = useState(0);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [c1X, setC1X] = useState(-120);
  const [c2X, setC2X] = useState(350);
  const [selectedTransport, setSelectedTransport] = useState<
    "tram" | "other" | null
  >(null);

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isLoading = percentage < 100;

  useEffect(() => {
    const timer = setTimeout(() => setContentLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("transport_recorded")) {
      navigate("/app", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!contentLoaded) return;
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 3;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [contentLoaded]);

  useEffect(() => {
    let frame: number;
    const move = () => {
      setC1X((prev) => (prev >= 450 ? -300 : prev + 0.2));
      setC2X((prev) => (prev >= 450 ? -300 : prev + 0.2));
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleStart = async () => {
    if (!selectedTransport) return;
    try {
      await recordTransportUsage(selectedTransport);
    } catch (err) {
      console.error("Firebase error:", err);
    }
    navigate("/app");
  };

  return (
    <main className="w-full max-w-107.5 h-svh mx-auto overflow-hidden">
      <div className="w-full h-full overflow-hidden relative bg-[linear-gradient(0deg,rgba(219,138,96,1)_0%,rgba(255,139,43,1)_40%,rgba(251,201,90,1)_100%)]">
        <div className="w-full h-full bg-[url('/images/landingPage/landing-bg.svg')] bg-cover bg-center flex flex-col items-center justify-between pt-[10svh] px-5 py-[3svh]">
          <div className="flex flex-col items-center z-20">
            <img
              src="/images/landingPage/main-logo.svg"
              className="w-17.75 h-17.75"
            />

            <h1
              className="text-[50px] text-center leading-11.25 mt-7.5 text-[#543A14] font-bold"
              style={{ fontFamily: '"Baloo Tammudu 2", system-ui' }}
            >
              Visit Lamphun
            </h1>

            {isLoading ? (
              <div className="w-[60%] flex flex-col items-center z-20">
                <div className="w-full h-1.75 bg-gray-400 mt-4 rounded-md relative overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="h-1.75 bg-[#BF4B17] absolute bottom-0 left-0 duration-100"
                  />
                </div>
                <p className="text-[#BF4B17] font-medium text-[16px] mt-2.5">
                  Loading . . .
                </p>
              </div>
            ) : (
              <>
                <div className="mt-4 w-full flex flex-col justify-center items-center gap-y-4">
                  {(["th", "en", "cn"] as const).map((lang) => (
                    <button
                      key={lang}
                      className={`transition-all ${i18n.language === lang ? "opacity-100 border-[#BF4B17] shadow-[0px_0px_12.3px_0px_#BF4B17]" : "border-transparent opacity-60"} border bg-white h-fit rounded-full pr-5 w-40 flex justify-between items-center`}
                      onClick={() => i18n.changeLanguage(lang)}
                    >
                      <div className="w-[45%] h-auto aspect-square">
                        <img
                          className="w-full h-full"
                          src={`/icons/${lang === "th" ? "thai" : lang === "en" ? "eng" : "china"}-icon.svg`}
                        />
                      </div>
                      <span className="w-full text-center text-[14px] font-medium">
                        {lang === "th"
                          ? "ภาษาไทย"
                          : lang === "en"
                            ? "English"
                            : "中國人"}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="w-full flex flex-col items-center justify-center mt-5 mb-3">
                  <span className="text-[14px] font-medium mb-1">
                    {t("landing.howto")}
                  </span>

                  <div className="flex justify-center items-center gap-x-3">
                    <button
                      onClick={() => setSelectedTransport("tram")}
                      className={`text-[14px] font-medium flex justify-center items-center text-center h-fit py-2.5 rounded-full w-28 transition-all border
                        ${
                          selectedTransport === "tram"
                            ? "bg-[#BF4B17] text-white border-[#BF4B17] shadow-[0px_0px_12.3px_0px_#BF4B17]"
                            : "bg-white text-black border-transparent"
                        }`}
                    >
                      {t("landing.tram")}
                    </button>

                    <button
                      onClick={() => setSelectedTransport("other")}
                      className={`text-[14px] font-medium flex justify-center items-center text-center h-fit py-2.5 rounded-full w-28 transition-all border
                        ${
                          selectedTransport === "other"
                            ? "bg-[#BF4B17] text-white border-[#BF4B17] shadow-[0px_0px_12.3px_0px_#BF4B17]"
                            : "bg-white text-black border-transparent"
                        }`}
                    >
                      {t("landing.other")}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  disabled={!selectedTransport}
                  className={`text-white flex items-center justify-center w-45 py-3 rounded-full font-semibold text-[16px] mt-3.75 transition-all
                    ${
                      selectedTransport
                        ? "bg-[#bf4b17] cursor-pointer"
                        : "bg-[#D9D9D9] cursor-not-allowed"
                    }`}
                >
                  {t("landing.start")}
                </button>
              </>
            )}
          </div>

          <img src="/images/landingPage/landing-all-logo.svg" />
        </div>

        <div style={{ top: 90, left: c1X }} className="w-50 absolute">
          <img src="/images/landingPage/Cloud1.svg" className="w-full h-full" />
        </div>
        <div style={{ top: 200, left: c2X }} className="w-43.75 absolute">
          <img src="/images/landingPage/Cloud2.svg" className="w-full h-full" />
        </div>
      </div>
    </main>
  );
}
