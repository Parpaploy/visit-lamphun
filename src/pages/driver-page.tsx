import { useEffect, useRef, useState, useCallback } from "react";
import {
  updateTramCheckin,
  fetchTramById,
  clearTramStation,
  updateTramPosition,
} from "../services/tram.services";
import { haversineDistance } from "../utils/geo";
import type { GpsPosition, Station } from "../interfaces/tram.interface";
import {
  STATIONS,
  AUTO_CHECKIN_RADIUS,
  NEAREST_STATION_DISPLAY_RADIUS,
} from "../constant/tram";
import CheckinPopup from "../components/driver-page/checkin-popup";
import UndoCheckinPopup from "../components/driver-page/undo-checkin-popup";
import FinishRoutePopup from "../components/driver-page/finish-route-popup";
import PassengerCounter from "../components/driver-page/passenger-counter";
import { IoIosArrowBack } from "react-icons/io";
import { fetchLatestSensorReading } from "../services/sensor.services";

const PHONE_GPS_ACCURACY_LIMIT = 30;

export default function DriverPage() {
  const tramId = localStorage.getItem("driver_tram_id") ?? "";

  const [currentStationId, setCurrentStationId] = useState<string | null>(null);
  const [isNearStation, setIsNearStation] = useState(false);
  const [step, setStep] = useState<"mode" | "manual" | "gps" | "phone-gps">(
    "mode",
  );
  const [gpsPosition, setGpsPosition] = useState<GpsPosition | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [nearestDistanceMeters, setNearestDistanceMeters] = useState<
    number | null
  >(null);
  const [loadingManual, setLoadingManual] = useState(false);
  const [pendingFinish, setPendingFinish] = useState(false);

  const [checkedStationIds, setCheckedStationIds] = useState<string[]>([]);
  const [pendingStation, setPendingStation] = useState<{
    station: Station;
    index: number;
  } | null>(null);

  const [pendingUndo, setPendingUndo] = useState<{
    station: Station;
    index: number;
  } | null>(null);

  const checkedStationIdsRef = useRef<string[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const lastAutoCheckinRef = useRef<string | null>(null);
  const lastPositionWriteAtRef = useRef(0);

  const updateCheckedStationIds = (ids: string[]) => {
    checkedStationIdsRef.current = ids;
    setCheckedStationIds(ids);
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
    async (
      lat: number,
      lng: number,
      source: "sensor" | "phone" = "sensor",
      accuracy = 0,
    ) => {
      let nearest: Station | null = null;
      let minDist = Infinity;

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
        }
      }

      if (!nearest || !tramId) return;

      const radius =
        source === "phone" ? nearest.phoneGpsRadiusMeters : AUTO_CHECKIN_RADIUS;
      const accuracyIsGood =
        source !== "phone" || accuracy <= PHONE_GPS_ACCURACY_LIMIT;
      const isWithinRadius = minDist <= radius && accuracyIsGood;

      setCurrentStationId(nearest.id);
      setNearestDistanceMeters(minDist);
      setIsNearStation(isWithinRadius);

      if (source === "phone") setGpsError(null);

      const now = Date.now();
      const shouldWritePosition =
        source === "sensor" ||
        (accuracyIsGood && now - lastPositionWriteAtRef.current >= 10_000);
      if (shouldWritePosition) {
        try {
          await updateTramPosition(tramId, nearest, lat, lng);
          lastPositionWriteAtRef.current = now;
        } catch (error) {
          console.error("Tram position update failed:", error);
          if (source === "phone") {
            setGpsError("บันทึกตำแหน่งไม่ได้ กรุณาตรวจสอบสัญญาณอินเทอร์เน็ต");
          }
        }
      }

      if (isWithinRadius) {
        if (lastAutoCheckinRef.current === nearest.id) return;

        lastAutoCheckinRef.current = nearest.id;
        await writeCheckinRef.current(nearest, "gps");
        if (!checkedStationIdsRef.current.includes(nearest.id)) {
          updateCheckedStationIds([
            ...checkedStationIdsRef.current,
            nearest.id,
          ]);
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
    updateCheckedStationIds([]);
    setStep("mode");
  };

  useEffect(() => {
    stopGps();
    if (step !== "gps") return;

    const fetchAndUpdate = async () => {
      const sensor = await fetchLatestSensorReading();
      if (!sensor || sensor.lat === -999 || sensor.lon === -999) {
        setGpsError("ไม่มีสัญญาณ GPS จากอุปกรณ์บนรถราง");
        return;
      }
      setGpsError(null);
      setGpsPosition({ lat: sensor.lat, lng: sensor.lon, accuracy: 0 });
      updateNearestStationRef.current(sensor.lat, sensor.lon, "sensor");
    };

    fetchAndUpdate();

    const interval = setInterval(fetchAndUpdate, 10_000);

    return () => {
      stopGps();
      clearInterval(interval);
    };
  }, [step, stopGps]);

  useEffect(() => {
    stopGps();
    if (step !== "phone-gps") return;

    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setGpsPosition({ lat: latitude, lng: longitude, accuracy });
        updateNearestStationRef.current(latitude, longitude, "phone", accuracy);
      },
      (error) => {
        setIsNearStation(false);
        if (error.code === 1) {
          setGpsError(
            "กรุณาอนุญาตให้เบราว์เซอร์ใช้ตำแหน่ง แล้วลองเปิด GPS มือถืออีกครั้ง",
          );
        } else if (error.code === 3) {
          setGpsError("ยังรับตำแหน่งไม่ทันใจ ลองเปิด GPS และรอสัญญาณอีกครั้ง");
        } else {
          setGpsError(
            "รับตำแหน่งจาก GPS มือถือไม่ได้ กรุณาลองใหม่หรือเช็กอินด้วยตนเอง",
          );
        }
      },
      { enableHighAccuracy: true, maximumAge: 5_000, timeout: 20_000 },
    );
    watchIdRef.current = watchId;

    return stopGps;
  }, [step, stopGps]);

  const enterManual = async () => {
    setLoadingManual(true);
    try {
      const tram = await fetchTramById(tramId);
      const checkedInStationId =
        tram?.last_checkin_station_id ?? tram?.current_station_id;
      updateCheckedStationIds(
        checkedInStationId && STATIONS.some((s) => s.id === checkedInStationId)
          ? [checkedInStationId]
          : [],
      );
    } finally {
      setLoadingManual(false);
      setStep("manual");
    }
  };

  const enterGpsMode = (mode: "gps" | "phone-gps") => {
    updateCheckedStationIds([]);

    if (mode === "phone-gps" && !navigator.geolocation) {
      setGpsError("อุปกรณ์นี้ไม่รองรับ GPS มือถือ กรุณาเช็กอินด้วยตนเอง");
      setStep(mode);
      return;
    }

    lastAutoCheckinRef.current = null;
    lastPositionWriteAtRef.current = 0;
    setCurrentStationId(null);
    setIsNearStation(false);
    setNearestDistanceMeters(null);
    setGpsPosition(null);
    setGpsError(null);
    setStep(mode);
  };

  const isAccuracyLow =
    step === "phone-gps" &&
    !!gpsPosition &&
    gpsPosition.accuracy > PHONE_GPS_ACCURACY_LIMIT;

  const handleConfirmCheckin = async () => {
    if (!pendingStation) return;
    await writeCheckin(pendingStation.station, "manual");
    updateCheckedStationIds([...checkedStationIds, pendingStation.station.id]);
    setPendingStation(null);
  };

  const lastCheckedStationId = checkedStationIds[checkedStationIds.length - 1];

  const handleUndoRequest = (index: number) => {
    if (STATIONS[index].id === lastCheckedStationId) {
      setPendingUndo({ station: STATIONS[index], index });
    }
  };

  const handleUndoConfirm = async () => {
    if (!pendingUndo) return;
    const remaining = checkedStationIds.slice(0, -1);
    updateCheckedStationIds(remaining);
    const prevStation = STATIONS.find(
      (s) => s.id === remaining[remaining.length - 1],
    );
    if (prevStation) {
      await writeCheckin(prevStation, "manual");
    }
    setPendingUndo(null);
  };

  const finishRouteButton = (
    <div className="w-full justify-center items-center flex">
      <button
        onClick={() => {
          if (checkedStationIds.length > 0) setPendingFinish(true);
        }}
        className={`${checkedStationIds.length > 0 ? "bg-[#FF8B2B]" : "bg-[#B9B9B9]"} text-white rounded-full shadow-[0_4px_10px_0_rgba(0,0,0,0.125)] px-10 py-2 font-medium text-[24px] mt-2`}
      >
        จบรอบ
      </button>
    </div>
  );

  return (
    <main
      className={`h-full flex flex-col items-center ${step === "mode" ? "bg-[linear-gradient(161deg,#FFE2A5_0%,#FBFCF0_22%,#FFFFFF_62%,#E6EFD8_100%)]" : "bg-white"}`}
    >
      <div className="w-full p-4">
        {step === "mode" && (
          <div className="w-full h-[80svh] flex flex-col justify-start items-center gap-3 pt-10 px-3">
            <PassengerCounter tramId={tramId} />
            <div className="w-full bg-white rounded-[18px] shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] py-5 px-7 flex flex-col justify-center items-center">
              <h1 className="text-[20px] font-medium text-black mb-1">
                เลือกโหมดการใช้งาน
              </h1>
              <p className="text-[14px] font-normal text-[#543A14] mb-4 text-center">
                เลือกกดเช็กอินแบบเดิม หรือให้ GPS มือถือบันทึกเมื่อถึงจุด
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
                  onClick={() => enterGpsMode("phone-gps")}
                  className="bg-[#d96410] transition-all active:scale-110 w-full text-white rounded-full py-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.125)]"
                >
                  เช็คอินด้วย GPS มือถือ
                </button>
                <button
                  onClick={() => enterGpsMode("gps")}
                  className="bg-[#BF4B17] transition-all active:scale-110 w-full text-white rounded-full py-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.125)]"
                >
                  เช็คอินด้วย GPS รถราง
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
              const done = checkedStationIds.includes(s.id);
              const isLastChecked = s.id === lastCheckedStationId;

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
                      disabled={!isLastChecked}
                      className={`px-4 py-px rounded-full text-[14px] font-medium ${isLastChecked ? "bg-[#FFFFFF] text-[#B9B9B9] block" : "hidden"}`}
                    >
                      ยกเลิก
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setPendingStation({ station: s, index: i })
                      }
                      className="px-4 py-0.5 rounded-full text-[14px] font-medium text-white bg-[#FF8B2B]"
                    >
                      ยืนยัน
                    </button>
                  )}
                </div>
              );
            })}

            {finishRouteButton}
          </div>
        )}

        {(step === "gps" || step === "phone-gps") && (
          <div className="w-full h-full flex flex-col gap-3">
            <button
              onClick={() => setStep("mode")}
              className="text-[#B9B9B9] flex justify-start items-center"
            >
              <IoIosArrowBack size={28} /> <p className="mt-0.5">กลับ</p>
            </button>

            <div className="w-full bg-white rounded-[18px] shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#559200] opacity-40 animate-ping" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#559200]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-medium text-[#543A14] leading-5">
                    {step === "phone-gps"
                      ? "กำลังใช้ GPS มือถือ"
                      : "GPS รถรางกำลังทำงาน"}
                  </p>
                  <p className="text-[13px] text-[#559200]">
                    {step === "phone-gps"
                      ? gpsPosition
                        ? "รับตำแหน่งจากโทรศัพท์แล้ว"
                        : "กำลังรอตำแหน่งจากโทรศัพท์"
                      : "รับสัญญาณจากเซนเซอร์รถรางอยู่"}
                  </p>
                </div>
                {gpsPosition?.accuracy ? (
                  <span
                    className={`shrink-0 text-[13px] font-medium px-2.5 py-0.5 rounded-full ${isAccuracyLow ? "bg-[#FFF0DC] text-[#BF4B17]" : "bg-[#559200]/15 text-[#559200]"}`}
                  >
                    ±{Math.round(gpsPosition.accuracy)} ม.
                  </span>
                ) : null}
              </div>

              {gpsError ? (
                <p className="text-[13px] text-[#D00000] text-center text-balance bg-red-50 rounded-xl px-3 py-2">
                  {gpsError}
                </p>
              ) : isAccuracyLow ? (
                <p className="text-[13px] text-[#BF4B17] text-center text-balance bg-[#FFF0DC] rounded-xl px-3 py-2">
                  สัญญาณยังไม่แม่นพอ (ต้องไม่เกิน ±{PHONE_GPS_ACCURACY_LIMIT}{" "}
                  ม.) รอสักครู่ หรือเช็กอินด้วยตนเอง
                </p>
              ) : null}

              {gpsPosition && (
                <div className="bg-[#FEF8EC] border border-[#F3E2C0] rounded-xl py-2.5 px-3 text-center">
                  {currentStationId &&
                  nearestDistanceMeters !== null &&
                  nearestDistanceMeters <= NEAREST_STATION_DISPLAY_RADIUS ? (
                    <>
                      <p className="text-[12px] text-[#8B724E]">จุดใกล้สุด</p>
                      <p className="text-[16px] font-medium text-[#543A14] leading-5">
                        {STATIONS.find((s) => s.id === currentStationId)?.name}
                      </p>
                      <p className="text-[13px] font-medium text-[#FF8B2B]">
                        ห่าง {Math.round(nearestDistanceMeters)} ม.
                      </p>
                    </>
                  ) : (
                    <p className="text-[14px] font-medium text-[#543A14]">
                      ยังไม่อยู่ในเส้นทางรถราง
                    </p>
                  )}
                  <p className="text-[11px] text-[#B9A07A] mt-1 tabular-nums">
                    {gpsPosition.lat.toFixed(6)}°N ·{" "}
                    {gpsPosition.lng.toFixed(6)}°E
                  </p>
                </div>
              )}

              {step === "phone-gps" && (
                <p className="text-[12px] text-[#765932] text-center text-balance">
                  เช็กอินอัตโนมัติเมื่อเข้ารัศมีของจุด และสัญญาณแม่นพอ
                </p>
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

                const isDone = checkedStationIds.includes(s.id);

                const isHere = isNearStation && i === nearestIdx;

                const isNearest =
                  !isNearStation &&
                  i === nearestIdx &&
                  nearestDistanceMeters !== null &&
                  nearestDistanceMeters <= NEAREST_STATION_DISPLAY_RADIUS;

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
                      <div>
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
                        {step === "phone-gps" && (
                          <p className="text-[11px] leading-4 text-[#765932]">
                            รัศมี GPS {s.phoneGpsRadiusMeters} ม.
                          </p>
                        )}
                      </div>
                    </span>

                    <div className="flex items-center justify-end">
                      {isHere ? (
                        <span className="px-4 py-0.5 rounded-full text-[14px] font-medium text-white bg-[#559200] animate-pulse">
                          อยู่ที่นี่
                        </span>
                      ) : isNearest ? (
                        <span className="px-3 py-0.5 rounded-full text-[14px] font-medium text-white bg-[#FF8B2B]">
                          ใกล้สุด · {Math.round(nearestDistanceMeters)} ม.
                        </span>
                      ) : isDone ? (
                        <span className="px-4 py-px rounded-full text-[14px] font-medium bg-[#FFFFFF] text-[#B9B9B9]">
                          เช็คอินแล้ว
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

            {finishRouteButton}
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
