import { useEffect, useRef, useState, useCallback } from "react";
import {
  updateTramCheckin,
  fetchTramById,
  clearTramStation,
} from "../services/tram.services";
import { haversineDistance } from "../utils/geo";
import type { GpsPosition, Station } from "../interfaces/tram.interface";
import { AUTO_CHECKIN_RADIUS, STATIONS } from "../constant/tram";
import CheckinPopup from "../components/driver-page/checkin-popup";
import UndoCheckinPopup from "../components/driver-page/undo-checkin-popup";
import FinishRoutePopup from "../components/driver-page/finish-route-popup";

export default function DriverPage() {
  const tramId = localStorage.getItem("driver_tram_id") ?? "";

  const [step, setStep] = useState<"mode" | "manual" | "gps">("mode");
  const [gpsPosition, setGpsPosition] = useState<GpsPosition | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [loadingManual, setLoadingManual] = useState<boolean>(false);
  const [pendingFinish, setPendingFinish] = useState<boolean>(false);

  const [nextIndex, setNextIndex] = useState(0);
  const [pendingStation, setPendingStation] = useState<{
    station: Station;
    index: number;
  } | null>(null);
  const [pendingUndo, setPendingUndo] = useState<{
    station: Station;
    index: number;
  } | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const lastAutoCheckinRef = useRef<string | null>(null);

  const stopGps = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const writeCheckin = useCallback(
    async (station: Station, mode: "manual" | "auto") => {
      if (!tramId) return;
      await updateTramCheckin(tramId, station, mode);
    },
    [tramId],
  );

  const tryAutoCheckin = useCallback(
    async (lat: number, lng: number) => {
      let nearest: Station | null = null;
      let minDist = Infinity;
      for (const s of STATIONS) {
        const dist = haversineDistance(lat, lng, s.lat, s.lng);
        if (dist < minDist) {
          minDist = dist;
          nearest = s;
        }
      }
      if (!nearest || minDist > AUTO_CHECKIN_RADIUS) return;
      if (lastAutoCheckinRef.current === nearest.id) return;
      lastAutoCheckinRef.current = nearest.id;
      await writeCheckin(nearest, "auto");
    },
    [writeCheckin],
  );

  const handleFinishConfirm = async () => {
    if (tramId) await clearTramStation(tramId);
    setPendingFinish(false);
    setNextIndex(0);
    setStep("mode");
  };

  useEffect(() => {
    stopGps();
    if (step !== "gps") return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        if (step !== "gps") return;
        const { latitude, longitude, accuracy } = pos.coords;
        setGpsPosition({ lat: latitude, lng: longitude, accuracy });
        tryAutoCheckin(latitude, longitude);
      },
      (err) => setGpsError(err.message),
      { enableHighAccuracy: true },
    );
    return () => stopGps();
  }, [step, tryAutoCheckin, stopGps]);

  const enterManual = async () => {
    setLoadingManual(true);
    try {
      const tram = await fetchTramById(tramId);
      if (tram?.current_station_id) {
        const currentIdx = STATIONS.findIndex(
          (s) => s.id === tram.current_station_id,
        );
        setNextIndex(currentIdx >= 0 ? currentIdx + 1 : 0);
      } else {
        setNextIndex(0);
      }
    } catch {
      setNextIndex(0);
    } finally {
      setLoadingManual(false);
      setStep("manual");
    }
  };

  const handleConfirmCheckin = async () => {
    if (!pendingStation) return;
    await writeCheckin(pendingStation.station, "manual");
    setNextIndex(pendingStation.index + 1);
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
    setNextIndex(pendingUndo.index);
    if (prevIndex >= 0) {
      await writeCheckin(STATIONS[prevIndex], "manual");
    }
    setPendingUndo(null);
  };

  return (
    <main className="h-full flex flex-col items-center">
      <div className="w-full p-4">
        {/* Mode Selection */}
        {step === "mode" && (
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={enterManual}
              disabled={loadingManual}
              className="bg-white rounded-full py-3 shadow disabled:opacity-50"
            >
              {loadingManual ? "กำลังโหลด..." : "Manual"}
            </button>
            <button
              onClick={() => setStep("gps")}
              className="bg-orange-500 text-white rounded-full py-3 shadow"
            >
              GPS
            </button>
          </div>
        )}

        {/* Manual */}
        {step === "manual" && (
          <div className="space-y-1.5">
            <button
              onClick={() => setStep("mode")}
              className="text-sm text-gray-400"
            >
              ← กลับ
            </button>

            {STATIONS.map((s, i) => {
              const done = i < nextIndex;
              const isNext = i === nextIndex;

              return (
                <div
                  key={s.id}
                  className={`shadow-[0_4px_4px_0_rgba(0,0,0,0.125)] border-2 border-[#D9D9D9] text-[#543A14] font-medium text-[20px] rounded-[20px] px-2 py-1 flex justify-between items-center
                    ${done ? "bg-[#FEEABB]" : "bg-white"}`}
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
                      className={`px-4 py-px rounded-full text-[14px] font-medium
                        ${
                          i === nextIndex - 1
                            ? "bg-[#FFFFFF] text-[#B9B9B9] block"
                            : "hidden"
                        }`}
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
                  if (nextIndex >= STATIONS.length) {
                    setPendingFinish(true);
                  }
                }}
                className={`${nextIndex >= STATIONS.length ? "bg-[#FF8B2B]" : "bg-[#B9B9B9]"} text-white rounded-full shadow-[0_4px_10px_0_rgba(0,0,0,0.125)] px-10 py-2 font-medium text-[24px] mt-2`}
              >
                จบรอบ
              </button>
            </div>
          </div>
        )}

        {/* GPS */}
        {step === "gps" && (
          <div className="mt-6 bg-white rounded-2xl shadow p-4 text-center">
            <p className="font-semibold mb-2">GPS Mode</p>
            {gpsError && <p className="text-red-500">{gpsError}</p>}
            {gpsPosition && (
              <p className="text-sm text-gray-600">
                {gpsPosition.lat}, {gpsPosition.lng}
              </p>
            )}
            <button
              onClick={() => setStep("mode")}
              className="text-sm text-gray-400 mt-4"
            >
              ← กลับ
            </button>
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
          // prevStation={
          //   pendingUndo.index > 0 ? STATIONS[pendingUndo.index - 1] : null
          // }
          onConfirm={handleUndoConfirm}
          onClose={() => setPendingUndo(null)}
        />
      )}

      {pendingFinish && <FinishRoutePopup onConfirm={handleFinishConfirm} />}
    </main>
  );
}
