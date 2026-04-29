import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { RecommendItem, MLString } from "../interfaces/content.interface";

const col = (cat: string) => collection(db, `recommend_${cat}`);

export const fetchRecommendItems = async (category: string): Promise<RecommendItem[]> => {
  const snap = await getDocs(query(col(category), orderBy("createdAt", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as RecommendItem);
};

export const addRecommendItem = async (
  category: string,
  data: { title: MLString; desc: MLString; img: string },
): Promise<void> => {
  await addDoc(col(category), { ...data, createdAt: serverTimestamp() });
};

export const updateRecommendItem = async (
  category: string,
  id: string,
  data: { title: MLString; desc: MLString; img: string },
): Promise<void> => {
  await updateDoc(doc(db, `recommend_${category}`, id), data);
};

export const deleteRecommendItem = async (category: string, id: string): Promise<void> => {
  await deleteDoc(doc(db, `recommend_${category}`, id));
};
