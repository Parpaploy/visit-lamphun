import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { EmergencyItem, PhoneEntry } from "../interfaces/content.interface";

const COL = "emergency";

function normalizePhone(phone: unknown): PhoneEntry {
  if (typeof phone === "string") {
    return { label: { th: "", en: "", cn: "" }, number: phone };
  }
  return phone as PhoneEntry;
}

export const fetchEmergencyItems = async (): Promise<EmergencyItem[]> => {
  const snap = await getDocs(query(collection(db, COL), orderBy("createdAt", "asc")));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      phones: (data.phones ?? []).map(normalizePhone),
    } as EmergencyItem;
  });
};

export const addEmergencyItem = async (data: Omit<EmergencyItem, "id">): Promise<void> => {
  await addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp() });
};

export const updateEmergencyItem = async (
  id: string,
  data: Omit<EmergencyItem, "id">,
): Promise<void> => {
  await updateDoc(doc(db, COL, id), data);
};

export const deleteEmergencyItem = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COL, id));
};
