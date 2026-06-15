import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { sensorDb } from "../firebase";

export interface SensorReading {
  lat: number;
  lon: number;
  temp?: number;
  hum?: number;
  ts?: number;
}

export async function fetchLatestSensorReading(): Promise<SensorReading | null> {
  const ref = collection(sensorDb, "sensors/2462ABF9E564/readings");
  const q = query(ref, orderBy("receivedAt", "desc"), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as SensorReading;
}
