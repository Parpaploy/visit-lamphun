import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  Timestamp,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { sensorDb } from "../firebase";

export const SENSOR_DEVICE_ID = "2462ABF9E564";
const READINGS_PATH = `sensors/${SENSOR_DEVICE_ID}/readings`;

export interface SensorReading {
  lat: number;
  lon: number;
  temp?: number;
  hum?: number;
  ts?: number;
}

/** Full reading as stored by the weather station (all fields optional). */
export interface SensorRecord {
  id: string;
  receivedAt: number; // ms epoch
  devid?: string;
  temp?: number;
  hum?: number;
  pres?: number;
  gas_r?: number;
  lux?: number;
  voc_raw?: number;
  voc_idx?: number;
  lat?: number;
  lon?: number;
  alt?: number;
  spd?: number;
  sat?: number;
  hdg?: number;
  pm1?: number;
  pm25?: number;
  pm10?: number;
  ws?: number;
  wd?: number;
  ws_spd?: number;
  ts?: number;
  stat?: number;
}

export async function fetchLatestSensorReading() {
  try {
    const ref = collection(sensorDb, READINGS_PATH);
    const q = query(ref, orderBy("receivedAt", "desc"), limit(1));
    const snap = await getDocs(q);

    if (snap.empty) return null;
    return snap.docs[0].data() as SensorReading;
  } catch (err) {
    console.error("[sensor] error:", err);
    return null;
  }
}

export interface SensorQueryOptions {
  max: number;
  /** inclusive range on receivedAt (ms epoch) */
  start?: number;
  end?: number;
}

function toRecord(d: QueryDocumentSnapshot<DocumentData>): SensorRecord {
  const data = d.data();
  const r = data.receivedAt;
  const receivedAt =
    r instanceof Timestamp
      ? r.toMillis()
      : typeof r === "number"
        ? r
        : d.metadata.hasPendingWrites
          ? Date.now()
          : 0;
  return { ...data, id: d.id, receivedAt } as SensorRecord;
}

/** Live subscription to readings (newest first), optionally within a date range. */
export function subscribeSensorRecords(
  { max, start, end }: SensorQueryOptions,
  onData: (records: SensorRecord[]) => void,
  onError?: (err: unknown) => void,
) {
  const ref = collection(sensorDb, READINGS_PATH);
  const constraints: QueryConstraint[] = [];
  if (start !== undefined)
    constraints.push(where("receivedAt", ">=", Timestamp.fromMillis(start)));
  if (end !== undefined)
    constraints.push(where("receivedAt", "<=", Timestamp.fromMillis(end)));
  const q = query(
    ref,
    ...constraints,
    orderBy("receivedAt", "desc"),
    limit(max),
  );
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map(toRecord)),
    (err) => {
      console.error("[sensor] subscribe error:", err);
      onError?.(err);
    },
  );
}
