import { useState } from "react";
import { useTranslation } from "react-i18next";
import DayButton from "../components/travel-page/day-btn";
import DayBlock from "../components/travel-page/day-block";
import TrainCard from "../components/travel-page/train-card";
import TramCard from "../components/travel-page/tram-card";
import OtherCard from "../components/travel-page/other-card";
import TravelLoader from "../components/skeleton-load/travel-loader";
import type { ITravelMode } from "../interfaces/navbar.interface";
import SubNavbar from "../components/navbar/sub-navbar";
import { useTrainItems, useTramItems, useOtherItems } from "../hooks/useTravelItems";

export default function TravelPage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<ITravelMode>("train");
  const [day, setDay] = useState<"weekday" | "weekend">("weekday");

  const { items: trainItems, loading: trainLoading } = useTrainItems();
  const { items: tramItems, loading: tramLoading } = useTramItems();
  const { items: otherItems, loading: otherLoading } = useOtherItems();

  const loading =
    mode === "train" ? trainLoading : mode === "tram" ? tramLoading : otherLoading;

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
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => <TravelLoader key={i} />)
        ) : (
          <>
            {mode === "train" &&
              trainItems
                .filter((item) => item.day === day)
                .map((item) => (
                  <TrainCard
                    key={item.id}
                    origin={item.origin}
                    destination={item.destination}
                    originTime={item.originTime}
                    destinationTime={item.destinationTime}
                    originStation={item.originStation}
                    destinationStation={item.destinationStation}
                    price={item.price}
                    desc={item.desc}
                  />
                ))}

            {mode === "tram" &&
              tramItems.map((item) => (
                <TramCard
                  key={item.id}
                  place={item.place}
                  time={item.time}
                  price={item.price}
                />
              ))}

            {mode === "other" &&
              otherItems
                .filter((item) => item.day === day)
                .map((item) => (
                  <OtherCard
                    key={item.id}
                    place={item.place}
                    desc={item.desc}
                    desc2={item.desc2}
                    type={item.type}
                    phone={item.phone}
                    link={item.link}
                  />
                ))}
          </>
        )}
      </section>
    </main>
  );
}
