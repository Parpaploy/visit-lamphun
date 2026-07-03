import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { sensorDb } from "../firebase";

export interface SensorReading {
  lat: number;
  lon: number;
  temp?: number;
  hum?: number;
  ts?: number;
}

export async function fetchLatestSensorReading() {
  try {
    const ref = collection(sensorDb, "sensors/2462ABF9E564/readings");
    const q = query(ref, orderBy("receivedAt", "desc"), limit(1));
    const snap = await getDocs(q);

    // console.log("[sensor] snap empty?", snap.empty);
    if (!snap.empty) console.log("[sensor] data:", snap.docs[0].data());

    if (snap.empty) return null;
    return snap.docs[0].data() as SensorReading;
  } catch (err) {
    console.error("[sensor] error:", err);
    return null;
  }
}
