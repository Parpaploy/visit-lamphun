import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Tram } from "../interfaces/tram.interface";

export const fetchAllTrams = async (): Promise<Tram[]> => {
  const snap = await getDocs(collection(db, "trams"));

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Tram)
    .sort((a, b) => a.name.localeCompare(b.name, "th"));
};

export const fetchActiveTrams = async (): Promise<Tram[]> => {
  const snap = await getDocs(collection(db, "trams"));

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Tram)
    .filter((t) => t.status === "active")
    .sort((a, b) => a.name.localeCompare(b.name, "th"));
};

export const verifyTramPin = async (tramId: string, inputPin: string) => {
  const tramDoc = await getDoc(doc(db, "trams", tramId));

  if (!tramDoc.exists()) return { success: false };

  const data = tramDoc.data() as Tram;

  if (String(data.pin) === String(inputPin)) {
    return { success: true, data };
  }

  return { success: false };
};

export const updateTramCheckin = async (
  tramId: string,
  station: {
    id: string;
    name: string;
    lat: number;
    lng: number;
  },
  mode: "manual" | "auto",
) => {
  await updateDoc(doc(db, "trams", tramId), {
    current_station_id: station.id,
    current_station_name: station.name,
    current_lat: station.lat,
    current_lng: station.lng,
    last_checkin_at: serverTimestamp(),
    last_checkin_mode: mode,
  });
};

export const updateTramStatus = async (
  tramId: string,
  status: "active" | "inactive",
) => {
  await updateDoc(doc(db, "trams", tramId), {
    status,
    updated_at: serverTimestamp(),
  });
};

export const fetchTramById = async (tramId: string): Promise<Tram | null> => {
  const snap = await getDoc(doc(db, "trams", tramId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Tram;
};

export const clearTramStation = async (tramId: string) => {
  await updateDoc(doc(db, "trams", tramId), {
    current_station_id: null,
    current_station_name: null,
    last_checkin_at: null,
  });
};
