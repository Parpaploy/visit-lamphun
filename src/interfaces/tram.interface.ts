import type { Timestamp } from "firebase/firestore";

export type Tram = {
  id: string;
  name: string;
  pin: string;
  status: "active" | "inactive";
  current_station_id?: string;
  current_station_name?: string;
  current_lat?: number;
  current_lng?: number;
  last_checkin_at?: Timestamp;
  last_checkin_mode: "manual" | "auto" | "gps" | null;
};

export type Station = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export type GpsPosition = {
  lat: number;
  lng: number;
  accuracy: number;
};
