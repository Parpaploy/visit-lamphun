import {
  onSnapshot,
  setDoc,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";
import type { TransportType } from "../interfaces/stat.interface";
import { db } from "../firebase";
import { getDeviceUID } from "../utils/heatmap";
import { getCurrentRound } from "../utils/stat";

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

// export const subscribeTransportStats = (
//   callback: (stats: TransportStats) => void,
// ): (() => void) => {
//   const q = query(collection(db, HEATMAP_COLLECTION));

//   return onSnapshot(q, (snapshot) => {
//     const uniqueTramUsers = new Set<string>();
//     const uniqueOtherUsers = new Set<string>();

//     snapshot.forEach((docSnap) => {
//       const data = docSnap.data();
//       const uid = data.uid;

//       if (!uid) return;

//       const transportType = (data.transportType || "").toLowerCase();

//       if (transportType === "tram") {
//         uniqueTramUsers.add(uid);
//       } else if (transportType === "other") {
//         uniqueOtherUsers.add(uid);
//       }
//     });

//     callback({
//       tram: uniqueTramUsers.size,
//       other: uniqueOtherUsers.size,
//     });
//   });
// };

export function subscribeTransportStats(
  callback: (stats: { tram: number; other: number }) => void,
) {
  const round = getCurrentRound();
  if (!round) {
    callback({ tram: 0, other: 0 });
    return () => {};
  }

  const today = new Date().toISOString().split("T")[0];

  const roundStart =
    round === "morning"
      ? new Date(`${today}T09:00:00`).getTime()
      : new Date(`${today}T13:00:00`).getTime();
  const roundEnd =
    round === "morning"
      ? new Date(`${today}T12:00:00`).getTime()
      : new Date(`${today}T18:00:00`).getTime();

  const q = query(
    collection(db, HEATMAP_COLLECTION),
    where("timestamp", ">=", roundStart),
    where("timestamp", "<=", roundEnd),
  );

  return onSnapshot(q, (snapshot) => {
    const uniqueTram = new Set<string>();
    const uniqueOther = new Set<string>();

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (!data.uid) return;
      if (data.transportType === "tram") uniqueTram.add(data.uid);
      else if (data.transportType === "other") uniqueOther.add(data.uid);
    });

    callback({ tram: uniqueTram.size, other: uniqueOther.size });
  });
}
