import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const sensorFirebaseConfig = {
  apiKey: import.meta.env.VITE_SENSOR_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_SENSOR_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_SENSOR_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_SENSOR_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_SENSOR_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_SENSOR_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const sensorApp = initializeApp(sensorFirebaseConfig, "sensor");

// Optional form fields are sent as `undefined`; skip them instead of throwing.
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });
export const storage = getStorage(app);
export const auth = getAuth(app);

export const sensorDb = getFirestore(sensorApp);
