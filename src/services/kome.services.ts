import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { KomeItem } from "../interfaces/content.interface";

const COL = "kome";

export const fetchKomeItems = async (): Promise<KomeItem[]> => {
  const snap = await getDocs(query(collection(db, COL), orderBy("createdAt", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as KomeItem);
};

export const addKomeItem = async (data: { name: string; phone: string }): Promise<void> => {
  await addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp() });
};

export const updateKomeItem = async (
  id: string,
  data: { name: string; phone: string },
): Promise<void> => {
  await updateDoc(doc(db, COL, id), data);
};

export const deleteKomeItem = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COL, id));
};
