import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { StationPlaceName } from "../interfaces/homepage.interface";

export const uploadImage = async (
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  onProgress?.(0);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );
  onProgress?.(100);
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.secure_url as string;
};

export const addPlace = async (
  stationId: string,
  place: { name: StationPlaceName; img: string; link: string },
): Promise<void> => {
  await addDoc(collection(db, "stations", stationId, "places"), {
    ...place,
    createdAt: serverTimestamp(),
  });
};

export const deletePlace = async (
  stationId: string,
  placeId: string,
): Promise<void> => {
  await deleteDoc(doc(db, "stations", stationId, "places", placeId));
};

export const updatePlace = async (
  stationId: string,
  placeId: string,
  data: { name: StationPlaceName; img: string; link: string },
): Promise<void> => {
  await updateDoc(doc(db, "stations", stationId, "places", placeId), data);
};
