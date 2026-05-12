import { doc, increment, onSnapshot, setDoc } from "firebase/firestore";
import type {
  TransportStats,
  TransportType,
} from "../interfaces/stat.interface";
import { db } from "../firebase";

const STATS_REF = () => doc(db, "app_stats", "transport_usage");

export const recordTransportUsage = async (
  type: TransportType,
): Promise<void> => {
  await setDoc(STATS_REF(), { [type]: increment(1) }, { merge: true });
};

export const subscribeTransportStats = (
  callback: (stats: TransportStats) => void,
): (() => void) => {
  return onSnapshot(STATS_REF(), (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback({
        tram: data?.tram ?? 0,
        other: data?.other ?? 0,
      });
    } else {
      callback({ tram: 0, other: 0 });
    }
  });
};
