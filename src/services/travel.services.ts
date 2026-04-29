import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type {
  TrainItem,
  TramItem,
  OtherItem,
} from "../interfaces/content.interface";

export const fetchTrainItems = async (): Promise<TrainItem[]> => {
  const snap = await getDocs(
    query(collection(db, "travelTrain"), orderBy("createdAt", "asc")),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TrainItem);
};
export const addTrainItem = async (
  data: Omit<TrainItem, "id">,
): Promise<void> => {
  await addDoc(collection(db, "travelTrain"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};
export const updateTrainItem = async (
  id: string,
  data: Omit<TrainItem, "id">,
): Promise<void> => {
  await updateDoc(doc(db, "travelTrain", id), data);
};
export const deleteTrainItem = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "travelTrain", id));
};

export const fetchTramItems = async (): Promise<TramItem[]> => {
  const snap = await getDocs(
    query(collection(db, "travelTram"), orderBy("createdAt", "asc")),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TramItem);
};
export const addTramItem = async (
  data: Omit<TramItem, "id">,
): Promise<void> => {
  await addDoc(collection(db, "travelTram"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};
export const updateTramItem = async (
  id: string,
  data: Omit<TramItem, "id">,
): Promise<void> => {
  await updateDoc(doc(db, "travelTram", id), data);
};
export const deleteTramItem = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "travelTram", id));
};

export const fetchOtherItems = async (): Promise<OtherItem[]> => {
  const snap = await getDocs(
    query(collection(db, "travelOther"), orderBy("createdAt", "asc")),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as OtherItem);
};
export const addOtherItem = async (
  data: Omit<OtherItem, "id">,
): Promise<void> => {
  await addDoc(collection(db, "travelOther"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};
export const updateOtherItem = async (
  id: string,
  data: Omit<OtherItem, "id">,
): Promise<void> => {
  await updateDoc(doc(db, "travelOther", id), data);
};
export const deleteOtherItem = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "travelOther", id));
};
