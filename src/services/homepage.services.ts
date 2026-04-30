import { collection, doc, getDoc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { StationPlace } from "../interfaces/homepage.interface";
import type { StationPopupData } from "../interfaces/content.interface";

export const fetchPlaces = async (stationId: string): Promise<StationPlace[]> => {
  const q = query(
    collection(db, "stations", stationId, "places"),
    orderBy("createdAt", "asc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as StationPlace);
};

export const fetchStationPopup = async (stationId: string): Promise<StationPopupData | null> => {
  const snap = await getDoc(doc(db, "stations", stationId));
  if (!snap.exists()) return null;
  const d = snap.data();
  if (!d?.header) return null;
  return { header: d.header, desc: d.desc ?? { th: "", en: "", cn: "" }, img: d.img ?? "" };
};

export const updateStationPopup = async (stationId: string, data: StationPopupData): Promise<void> => {
  await setDoc(doc(db, "stations", stationId), data, { merge: true });
};
