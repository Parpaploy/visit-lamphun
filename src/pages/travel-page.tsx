import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DayButton from "../components/travel-page/day-btn";
import DayBlock from "../components/travel-page/day-block";
import TrainCard from "../components/travel-page/train-card";
import TramCard from "../components/travel-page/tram-card";
import OtherCard from "../components/travel-page/other-card";
import TravelLoader from "../components/skeleton-load/travel-loader";
import type { ITravelMode } from "../interfaces/navbar.interface";
import SubNavbar from "../components/navbar/sub-navbar";

export default function TravelPage() {
  const { t } = useTranslation();

  const [mode, setMode] = useState<ITravelMode>("train");
  const [day, setDay] = useState<"weekday" | "weekend">("weekday");
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageReady(true), 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative w-full h-full flex flex-col overflow-hidden">
      <SubNavbar
        mode={mode}
        setMode={setMode}
        mode1="train"
        mode2="tram"
        mode3="other"
        mode1Name={t("travel.train")}
        mode2Name={t("travel.tram")}
        mode3Name={t("travel.other")}
      />

      <section className="w-[90%] mx-auto flex justify-center items-center gap-x-4 border-b border-[#D9D9D9] py-5">
        {mode !== "tram" ? (
          <>
            <DayButton
              title={t("travel.weekday")}
              desc={t("travel.weekdayDesc")}
              day={day}
              week="weekday"
              setDay={setDay}
            />

            <DayButton
              title={t("travel.weekend")}
              desc={t("travel.weekendDesc")}
              day={day}
              week="weekend"
              setDay={setDay}
            />
          </>
        ) : (
          <>
            <DayBlock title={t("travel.open")} desc={t("travel.openDesc")} />
            <DayBlock title={t("travel.close")} desc={t("travel.closeDesc")} />
          </>
        )}
      </section>

      <section className="w-full flex-1 flex flex-col gap-y-4 overflow-y-auto p-5">
        {!pageReady ? (
          <>
            {Array.from({ length: 2 }).map((_, i) => (
              <TravelLoader key={i} />
            ))}
          </>
        ) : (
          <>
            {mode === "train" && (
              <>
                {day === "weekday" ? (
                  <TrainCard
                    origin="เชียงใหม่"
                    destination="ลำพูน"
                    originTime="07.30"
                    destinationTime="08.00"
                    originStation="สถานีรถไฟเชียงใหม่"
                    destinationStation="สถานีรถไฟลำพูน"
                    price={15}
                    desc="ชั้น 1 รถนั่งพัดลม"
                  />
                ) : (
                  <TrainCard
                    origin="เชียงใหม่"
                    destination="ลำพูน"
                    originTime="10.30"
                    destinationTime="11.00"
                    originStation="สถานีรถไฟเชียงใหม่"
                    destinationStation="สถานีรถไฟลำพูน"
                    price={15}
                    desc="ชั้น 1 รถนั่งพัดลม"
                  />
                )}
              </>
            )}

            {mode === "tram" && (
              <TramCard
                place="วัดพระธาตุหริภุญชัย"
                time="รอบเช้า 09.30"
                price={50}
              />
            )}

            {mode === "other" && (
              <>
                {day === "weekday" ? (
                  <>
                    <OtherCard
                      place="กลุ่มสามล้อจังหวัดลำพูน"
                      desc="บริเวณข่วงคนเมือง ณ ศาลากลางจังหวัดลำพูน (หลังเก่า)"
                      type="tricycle"
                      phone="085-695-0729"
                    />

                    <OtherCard
                      place="รถสองแถว"
                      desc="บริเวณหน้าวัดพระธาตุหริภุญชัย"
                      type="songthaew"
                    />

                    <OtherCard
                      place="รถตู้โดยสาร"
                      desc="ผู้ประกอบการบริษัทลำพูนพัฒนาเดินรถ จำกัด"
                      desc2="บริเวณหน้าพิพิธภัณฑสถานแห่งชาติ"
                      link="https://line.me/R/ti/g/D_bPqs3Lwe"
                    />
                  </>
                ) : (
                  <>
                    <OtherCard
                      place="รถตู้โดยสาร"
                      desc="ผู้ประกอบการบริษัทลำพูนพัฒนาเดินรถ จำกัด"
                      desc2="บริเวณหน้าพิพิธภัณฑสถานแห่งชาติ"
                      link="https://line.me/R/ti/g/D_bPqs3Lwe"
                    />

                    <OtherCard
                      place="กลุ่มสามล้อจังหวัดลำพูน"
                      desc="บริเวณข่วงคนเมือง ณ ศาลากลางจังหวัดลำพูน (หลังเก่า)"
                      type="tricycle"
                      phone="085-695-0729"
                    />

                    <OtherCard
                      place="รถสองแถว"
                      desc="บริเวณหน้าวัดพระธาตุหริภุญชัย"
                      type="songthaew"
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
}
