import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type {
  PlaceData,
  StationPlaceName,
} from "../interfaces/homepage.interface";

export const uploadImage = async (
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  );
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
  place: PlaceData,
): Promise<void> => {
  await addDoc(collection(db, "stations", stationId, "places"), {
    ...place,
    createdAt: serverTimestamp(),
  });
};

export const updatePlace = async (
  stationId: string,
  placeId: string,
  data: PlaceData,
): Promise<void> => {
  await updateDoc(doc(db, "stations", stationId, "places", placeId), data);
};

export const deletePlace = async (
  stationId: string,
  placeId: string,
): Promise<void> => {
  await deleteDoc(doc(db, "stations", stationId, "places", placeId));
};

export const addActivity = async (
  stationId: string,
  activity: {
    name: StationPlaceName;
    img: string;
    link: string;
    openTime?: string;
    closeTime?: string;
    phone?: string;
  },
): Promise<void> => {
  await addDoc(collection(db, "stations", stationId, "activities"), {
    ...activity,
    createdAt: serverTimestamp(),
  });
};

export const deleteActivity = async (
  stationId: string,
  activityId: string,
): Promise<void> => {
  await deleteDoc(doc(db, "stations", stationId, "activities", activityId));
};

export const updateActivity = async (
  stationId: string,
  activityId: string,
  data: {
    name: StationPlaceName;
    img: string;
    link: string;
    openTime?: string;
    closeTime?: string;
    phone?: string;
  },
): Promise<void> => {
  await updateDoc(
    doc(db, "stations", stationId, "activities", activityId),
    data,
  );
};

export const addToilet = async (
  stationId: string,
  toilet: {
    name: StationPlaceName;
    img: string;
    link: string;
    location?: string;
    phone?: string;
  },
): Promise<void> => {
  await addDoc(collection(db, "stations", stationId, "toilets"), {
    ...toilet,
    createdAt: serverTimestamp(),
  });
};

export const deleteToilet = async (
  stationId: string,
  toiletId: string,
): Promise<void> => {
  await deleteDoc(doc(db, "stations", stationId, "toilets", toiletId));
};

export const updateToilet = async (
  stationId: string,
  toiletId: string,
  data: {
    name: StationPlaceName;
    img: string;
    link: string;
    location?: string;
    phone?: string;
  },
): Promise<void> => {
  await updateDoc(doc(db, "stations", stationId, "toilets", toiletId), data);
};
