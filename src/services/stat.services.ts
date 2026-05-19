import { collection, onSnapshot, query, setDoc, doc } from "firebase/firestore";
import type {
  TransportStats,
  TransportType,
} from "../interfaces/stat.interface";
import { db } from "../firebase";
import { getDeviceUID } from "../utils/heatmap";

const HEATMAP_COLLECTION = "heatmap_records";

export const recordTransportUsage = async (
  type: TransportType,
): Promise<void> => {
  localStorage.setItem("current_transport_type", type);

  const uid = getDeviceUID();
  const now = new Date();

  const dateStr = now.toISOString().split("T")[0];
  const docId = `${dateStr}_${uid}`;

  try {
    await setDoc(
      doc(db, HEATMAP_COLLECTION, docId),
      {
        uid,
        transportType: type,

        stationId:
          localStorage.getItem("current_station_id") || "province-other",
        timestamp: now.getTime(),
        distance: 0,
      },
      { merge: true },
    );
    // console.log("✅ บันทึกประเภทรถลง heatmap_records สำเร็จ!:", type);
  } catch (error) {
    console.error(error);
  }
};

export const subscribeTransportStats = (
  callback: (stats: TransportStats) => void,
): (() => void) => {
  const q = query(collection(db, HEATMAP_COLLECTION));

  return onSnapshot(q, (snapshot) => {
    const uniqueTramUsers = new Set<string>();
    const uniqueOtherUsers = new Set<string>();

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const uid = data.uid;

      if (!uid) return;

      const transportType = (data.transportType || "").toLowerCase();

      if (transportType === "tram") {
        uniqueTramUsers.add(uid);
      } else if (transportType === "other") {
        uniqueOtherUsers.add(uid);
      }
    });

    callback({
      tram: uniqueTramUsers.size,
      other: uniqueOtherUsers.size,
    });
  });
};
