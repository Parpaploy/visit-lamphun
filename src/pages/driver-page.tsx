import { useEffect, useRef, useState, useCallback } from "react";
import {
  updateTramCheckin,
  fetchTramById,
  clearTramStation,
  updateTramPosition,
} from "../services/tram.services";
import { haversineDistance } from "../utils/geo";
import type { GpsPosition, Station } from "../interfaces/tram.interface";
import { STATIONS, AUTO_CHECKIN_RADIUS } from "../constant/tram";
import CheckinPopup from "../components/driver-page/checkin-popup";
import UndoCheckinPopup from "../components/driver-page/undo-checkin-popup";
import FinishRoutePopup from "../components/driver-page/finish-route-popup";
import { IoIosArrowBack } from "react-icons/io";
import { fetchLatestSensorReading } from "../services/sensor.services";

export default function DriverPage() {
  const tramId = localStorage.getItem("driver_tram_id") ?? "";

  const [currentStationId, setCurrentStationId] = useState<string | null>(null);
  const [isNearStation, setIsNearStation] = useState(false);
  const [step, setStep] = useState<"mode" | "manual" | "gps">("mode");
  const [gpsPosition, setGpsPosition] = useState<GpsPosition | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [loadingManual, setLoadingManual] = useState(false);
  const [pendingFinish, setPendingFinish] = useState(false);

  const [nextIndex, setNextIndex] = useState(0);
  const [pendingStation, setPendingStation] = useState<{
    station: Station;
    index: number;
  } | null>(null);

  const [pendingUndo, setPendingUndo] = useState<{
    station: Station;
    index: number;
  } | null>(null);

  const nextIndexRef = useRef(0);
  const watchIdRef = useRef<number | null>(null);
  const lastAutoCheckinRef = useRef<string | null>(null);
  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null);

  const updateNextIndex = (val: number) => {
    nextIndexRef.current = val;
    setNextIndex(val);
  };

  const stopGps = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const writeCheckin = useCallback(
    async (station: Station, mode: "manual" | "gps") => {
      if (!tramId) return;
      try {
        await updateTramCheckin(tramId, station, mode);
      } catch (err) {
        console.error("Checkin failed:", err);
      }
    },
    [tramId],
  );

  const writeCheckinRef = useRef(writeCheckin);
  useEffect(() => {
    writeCheckinRef.current = writeCheckin;
  }, [writeCheckin]);

  const updateNearestStation = useCallback(
    async (lat: number, lng: number) => {
      let nearest: Station | null = null;
      let minDist = Infinity;
      let nearestIdx = -1;

      for (let i = 0; i < STATIONS.length; i++) {
        const dist = haversineDistance(
          lat,
          lng,
          STATIONS[i].lat,
          STATIONS[i].lng,
        );
        if (dist < minDist) {
          minDist = dist;
          nearest = STATIONS[i];
          nearestIdx = i;
        }
      }

      if (!nearest || !tramId) return;

      console.log(
        "nearest:",
        nearest.id,
        "dist:",
        minDist,
        "isNear:",
        minDist <= AUTO_CHECKIN_RADIUS,
        "nearestIdx:",
        nearestIdx,
        "nextIndexRef:",
        nextIndexRef.current,
      );

      setCurrentStationId(nearest.id);
      setIsNearStation(minDist <= AUTO_CHECKIN_RADIUS);

      await updateTramPosition(tramId, nearest, lat, lng);

      if (minDist <= AUTO_CHECKIN_RADIUS) {
        if (lastAutoCheckinRef.current === nearest.id) return;

        if (nearestIdx === nextIndexRef.current) {
          lastAutoCheckinRef.current = nearest.id;
          await writeCheckinRef.current(nearest, "gps");
          updateNextIndex(nearestIdx + 1);
        }
      }
    },
    [tramId],
  );

  const updateNearestStationRef = useRef(updateNearestStation);
  useEffect(() => {
    updateNearestStationRef.current = updateNearestStation;
  }, [updateNearestStation]);

  const handleFinishConfirm = async () => {
    if (tramId) await clearTramStation(tramId);
    setPendingFinish(false);
    updateNextIndex(0);
    setStep("mode");
  };

  useEffect(() => {
    stopGps();
    if (step !== "gps") return;

    const fetchAndUpdate = async () => {
      const sensor = await fetchLatestSensorReading();
      if (!sensor || sensor.lat === -999 || sensor.lon === -999) {
        setGpsError("ไม่มีสัญญาณ GPS จาก sensor");
        return;
      }
      setGpsError(null);
      setGpsPosition({ lat: sensor.lat, lng: sensor.lon, accuracy: 0 });
      updateNearestStationRef.current(sensor.lat, sensor.lon);
    };

    fetchAndUpdate();

    const interval = setInterval(fetchAndUpdate, 10_000);

    return () => {
      stopGps();
      clearInterval(interval);
      lastPositionRef.current = null;
    };
  }, [step, stopGps]);

  const enterManual = async () => {
    setLoadingManual(true);
    try {
      const tram = await fetchTramById(tramId);
      if (tram?.current_station_id) {
        const currentIdx = STATIONS.findIndex(
          (s) => s.id === tram.current_station_id,
        );
        updateNextIndex(currentIdx >= 0 ? currentIdx + 1 : 0);
      } else {
        updateNextIndex(0);
      }
    } finally {
      setLoadingManual(false);
      setStep("manual");
    }
  };

  const enterGps = async () => {
    try {
      const tram = await fetchTramById(tramId);
      if (tram?.current_station_id) {
        const currentIdx = STATIONS.findIndex(
          (s) => s.id === tram.current_station_id,
        );
        const newIndex = currentIdx >= 0 ? currentIdx + 1 : 0;
        nextIndexRef.current = newIndex;
        setNextIndex(newIndex);
      } else {
        nextIndexRef.current = 0;
        setNextIndex(0);
      }
    } catch {
      nextIndexRef.current = 0;
      setNextIndex(0);
    }

    lastAutoCheckinRef.current = null;
    lastPositionRef.current = null;
    setCurrentStationId(null);
    setIsNearStation(false);
    setStep("gps");
  };

  const handleConfirmCheckin = async () => {
    if (!pendingStation) return;
    await writeCheckin(pendingStation.station, "manual");
    updateNextIndex(pendingStation.index + 1);
    setPendingStation(null);
  };

  const handleUndoRequest = (index: number) => {
    if (index === nextIndex - 1) {
      setPendingUndo({ station: STATIONS[index], index });
    }
  };

  const handleUndoConfirm = async () => {
    if (!pendingUndo) return;
    const prevIndex = pendingUndo.index - 1;
    updateNextIndex(pendingUndo.index);
    if (prevIndex >= 0) {
      await writeCheckin(STATIONS[prevIndex], "manual");
    }
    setPendingUndo(null);
  };

  return (
    <main
      className={`h-full flex flex-col items-center ${step === "mode" ? "bg-[linear-gradient(161deg,#FFE2A5_0%,#FBFCF0_22%,#FFFFFF_62%,#E6EFD8_100%)]" : "bg-white"}`}
    >
      <div className="w-full p-4">
        {step === "mode" && (
          <div className="w-full h-[80svh] flex justify-center items-start pt-10 px-3">
            <div className="w-full bg-white rounded-[18px] shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] py-5 px-7 flex flex-col justify-center items-center">
              <h1 className="text-[20px] font-medium text-black mb-1">
                เลือกโหมดการใช้งาน
              </h1>
              <p className="text-[14px] font-normal text-[#543A14] mb-4 text-center">
                กรุณาเลือก เช็คอินด้วยตนเอง หรือ เช็คอินด้วย GPS
              </p>
              <div className="w-full flex flex-col justify-center items-center gap-2">
                <button
                  onClick={enterManual}
                  disabled={loadingManual}
                  className="bg-[#FF8B2B] transition-all active:scale-110 w-full text-white rounded-full py-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.125)]"
                >
                  {loadingManual ? "กำลังโหลด..." : "เช็คอินด้วยตนเอง"}
                </button>
                <button
                  onClick={enterGps}
                  className="bg-[#BF4B17] transition-all active:scale-110 w-full text-white rounded-full py-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.125)]"
                >
                  เช็คอินด้วย GPS
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "manual" && (
          <div className="space-y-1.5">
            <button
              onClick={() => setStep("mode")}
              className="text-[#B9B9B9] flex justify-center items-center"
            >
              <IoIosArrowBack size={28} /> <p className="mt-0.5">กลับ</p>
            </button>

            {STATIONS.map((s, i) => {
              const done = i < nextIndex;
              const isNext = i === nextIndex;

              return (
                <div
                  key={s.id}
                  className={`shadow-[0_4px_4px_0_rgba(0,0,0,0.125)] border-2 border-[#D9D9D9] text-[#543A14] font-medium text-[20px] rounded-[20px] px-2 py-1 flex justify-between items-center ${done ? "bg-[#FEEABB]" : "bg-white"}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center font-medium text-[20px]">
                      {i + 1}
                    </span>
                    <p className="font-medium text-[16px]">
                      {s.name.includes("(") ? (
                        <>
                          {s.name.split("(")[0]}
                          <br />
                          {"(" + s.name.split("(")[1]}
                        </>
                      ) : (
                        s.name
                      )}
                    </p>
                  </span>

                  {done ? (
                    <button
                      onClick={() => handleUndoRequest(i)}
                      disabled={i !== nextIndex - 1}
                      className={`px-4 py-px rounded-full text-[14px] font-medium ${i === nextIndex - 1 ? "bg-[#FFFFFF] text-[#B9B9B9] block" : "hidden"}`}
                    >
                      ยกเลิก
                    </button>
                  ) : isNext ? (
                    <button
                      onClick={() =>
                        setPendingStation({ station: s, index: i })
                      }
                      className="px-4 py-0.5 rounded-full text-[14px] font-medium text-white bg-[#FF8B2B]"
                    >
                      ยืนยัน
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-[#B9B9B9] text-white px-4 py-0.5 rounded-full text-[14px] font-medium"
                    >
                      ยืนยัน
                    </button>
                  )}
                </div>
              );
            })}

            <div className="w-full justify-center items-center flex">
              <button
                onClick={() => {
                  if (nextIndex >= STATIONS.length) setPendingFinish(true);
                }}
                className={`${nextIndex >= STATIONS.length ? "bg-[#FF8B2B]" : "bg-[#B9B9B9]"} text-white rounded-full shadow-[0_4px_10px_0_rgba(0,0,0,0.125)] px-10 py-2 font-medium text-[24px] mt-2`}
              >
                จบรอบ
              </button>
            </div>
          </div>
        )}

        {step === "gps" && (
          <div className="w-full h-full flex flex-col gap-3">
            <button
              onClick={() => setStep("mode")}
              className="text-[#B9B9B9] flex justify-start items-center"
            >
              <IoIosArrowBack size={28} /> <p className="mt-0.5">กลับ</p>
            </button>

            <div className="relative w-full bg-white rounded-[18px] shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] py-5 px-7">
              <div className="flex items-center gap-5 mb-3">
                <div className="relative flex items-center justify-center w-7 h-7">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#559200] opacity-40 animate-ping" />
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-[#559200]" />
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-medium text-[#543A14]">
                    GPS กำลังทำงาน
                  </p>
                  <p className="text-[14px] text-[#559200]">รับสัญญาณอยู่</p>
                </div>
                {gpsPosition?.accuracy ? (
                  <span className="text-[14px] bg-[#559200]/15 text-[#559200] font-medium px-2.5 py-1 rounded-full">
                    ±{Math.round(gpsPosition.accuracy)} ม.
                  </span>
                ) : null}
              </div>

              {gpsError && (
                <p className="text-[14px] text-[#FF0000] text-center bg-red-50 rounded-xl px-3 py-2">
                  {gpsError}
                </p>
              )}

              {gpsPosition && (
                <div className="flex justify-center items-center gap-3 bg-[#FFF0DC] rounded-[9px] text-center py-3 text-[16px] font-medium text-[#543A14]">
                  <span>{gpsPosition.lat}°N</span>
                  <span>{gpsPosition.lng}°E</span>
                </div>
              )}
            </div>

            <p className="text-[16px] text-[#B9B9B9] font-medium px-1 -mb-2 mt-1">
              สถานีถัดไป
            </p>

            <div className="space-y-1.5 whitespace-nowrap">
              {STATIONS.map((s, i) => {
                const nearestIdx = currentStationId
                  ? STATIONS.findIndex((st) => st.id === currentStationId)
                  : -1;

                const isDone =
                  nearestIdx !== -1 ? i < nearestIdx : i < nextIndex;

                const isHere = isNearStation && i === nearestIdx;

                const isHeading =
                  isNearStation && nearestIdx !== -1 && i === nearestIdx + 1;

                return (
                  <div
                    key={s.id}
                    className={`shadow-[0_4px_4px_0_rgba(0,0,0,0.125)] border-2 border-[#D9D9D9] text-[#543A14] font-medium text-[20px] rounded-[20px] px-2 py-1 flex justify-between items-center ${
                      isHere
                        ? "bg-[#E8F5D0]"
                        : isDone
                          ? "bg-[#FEEABB]"
                          : "bg-white"
                    }`}
                  >
                    <span className="whitespace-normal flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full flex items-center justify-center font-medium text-[20px]">
                        {i + 1}
                      </span>
                      <p className="font-medium text-[16px]">
                        {s.name.includes("(") ? (
                          <>
                            {s.name.split("(")[0]}
                            <br />
                            {"(" + s.name.split("(")[1]}
                          </>
                        ) : (
                          s.name
                        )}
                      </p>
                    </span>

                    <div className="flex items-center justify-end">
                      {isHere ? (
                        <span className="px-4 py-0.5 rounded-full text-[14px] font-medium text-white bg-[#559200] animate-pulse">
                          อยู่ที่นี่
                        </span>
                      ) : isDone ? (
                        <span className="px-4 py-px rounded-full text-[14px] font-medium bg-[#FFFFFF] text-[#B9B9B9]">
                          เช็คอินแล้ว
                        </span>
                      ) : isHeading ? (
                        <span className="px-4 py-0.5 rounded-full text-[14px] font-medium text-white bg-[#FF8B2B] animate-pulse">
                          กำลังมุ่งหน้า
                        </span>
                      ) : (
                        <span className="bg-[#B9B9B9] text-white px-4 py-0.5 rounded-full text-[14px] font-medium">
                          รออยู่
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {pendingStation && (
        <CheckinPopup
          station={pendingStation.station}
          index={pendingStation.index}
          onConfirm={handleConfirmCheckin}
          onClose={() => setPendingStation(null)}
        />
      )}

      {pendingUndo && (
        <UndoCheckinPopup
          station={pendingUndo.station}
          index={pendingUndo.index}
          onConfirm={handleUndoConfirm}
          onClose={() => setPendingUndo(null)}
        />
      )}

      {pendingFinish && <FinishRoutePopup onConfirm={handleFinishConfirm} />}
    </main>
  );
}
