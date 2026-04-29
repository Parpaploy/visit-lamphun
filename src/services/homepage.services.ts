import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import type { StationPlace } from "../interfaces/homepage.interface";

export const fetchPlaces = async (stationId: string): Promise<StationPlace[]> => {
  const q = query(
    collection(db, "stations", stationId, "places"),
    orderBy("createdAt", "asc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as StationPlace);
};
