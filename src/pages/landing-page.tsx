import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [percentage, setPercentage] = useState<number>(0);
  const isLoading = percentage < 100;
  const [contentLoaded, setContentLoaded] = useState<boolean>(false);
  const [c1X, setC1X] = useState<number>(-120);
  const [c2X, setC2X] = useState<number>(350);
  const { t, i18n } = useTranslation();

  const cloundMove = () => {
    setInterval(() => {
      setC1X((prev: number) => {
        if (prev >= 450) {
          return -300;
        }
        return prev + 0.2;
      });
      setC2X((prev: number) => {
        if (prev >= 450) {
          return -300;
        }
        return prev + 0.2;
      });
    }, 5);
  };

  const startInterval = () => {
    const interval = setInterval(() => {
      setPercentage((prev) => prev + 4);
    }, 50);
    setTimeout(() => clearInterval(interval), 1350);
  };
  useEffect(() => {
    const fakeLoad = setTimeout(() => {
      setContentLoaded(true);
    }, 2000);

    return () => clearTimeout(fakeLoad);
  }, []);
  useEffect(() => {
    if (!contentLoaded) {
      return;
    }
    startInterval();
    cloundMove();
  }, [contentLoaded]);

  return (
    <main className="w-full max-w-107.5 h-svh mx-auto overflow-hidden">
      <div
        className={`w-full h-full overflow-hidden relative bg-[linear-gradient(0deg,rgba(219,138,96,1)_0%,rgba(255,139,43,1)_40%,rgba(251,201,90,1)_100%)] ${
          !contentLoaded ? "blur-xs" : ""
        }`}
      >
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
                  <button
                    className={`transition-all ${i18n.language === "th" ? "opacity-100 border-[#BF4B17] shadow-[0px_0px_12.3px_0px_#BF4B17]" : "border-transparent opacity-60"} border bg-white h-fit rounded-full pr-5 w-40 flex justify-between items-center`}
                    onClick={() => i18n.changeLanguage("th")}
                  >
                    <div className="w-[45%] h-auto aspect-square">
                      <img
                        className="w-full h-full"
                        src="/icons/thai-icon.svg"
                      />
                    </div>
                    <span className="w-full text-center text-[14px] font-medium">
                      ภาษาไทย
                    </span>
                  </button>

                  <button
                    className={`transition-all ${i18n.language === "en" ? "opacity-100 border-[#BF4B17] shadow-[0px_0px_12.3px_0px_#BF4B17]" : "border-transparent opacity-60"} border bg-white h-fit rounded-full pr-5 w-40 flex justify-between items-center`}
                    onClick={() => i18n.changeLanguage("en")}
                  >
                    <div className="w-[45%] h-auto aspect-square">
                      <img
                        className="w-full h-full"
                        src="/icons/eng-icon.svg"
                      />
                    </div>
                    <span className="w-full text-center text-[14px] font-medium">
                      English
                    </span>
                  </button>

                  <button
                    className={`transition-all ${i18n.language === "cn" ? "opacity-100 border-[#BF4B17] shadow-[0px_0px_12.3px_0px_#BF4B17]" : "border-transparent opacity-60"} border bg-white h-fit rounded-full pr-5 w-40 flex justify-between items-center`}
                    onClick={() => i18n.changeLanguage("cn")}
                  >
                    <div className="w-[45%] h-auto aspect-square">
                      <img
                        className="w-full h-full"
                        src="/icons/china-icon.svg"
                      />
                    </div>
                    <span className="w-full text-center text-[14px] font-medium">
                      中國人
                    </span>
                  </button>
                </div>

                <div className="w-full flex flex-col items-center justify-center mt-5 mb-3">
                  <span className="text-[14px] font-medium mb-1">
                    {t("landing.howto")}
                  </span>

                  <div className="flex justify-center items-center gap-x-3">
                    <button
                      className={`text-[14px] font-medium flex justify-center items-center text-center bg-white h-fit py-2.5 rounded-full w-28`}
                    >
                      {t("landing.tram")}
                    </button>

                    <button
                      className={`text-[14px] font-medium flex justify-center items-center text-center bg-white h-fit py-2.5 rounded-full w-28`}
                    >
                      {t("landing.other")}
                    </button>
                  </div>
                </div>

                <Link
                  to="/homepage"
                  className="flex items-center justify-center w-45 bg-[#bf4b17] text-white py-3 rounded-full font-semibold text-[16px] mt-3.75"
                >
                  {t("landing.start")}
                </Link>
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
