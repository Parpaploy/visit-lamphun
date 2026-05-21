import type { Station } from "../interfaces/tram.interface";
import { STATION_COORDS } from "../utils/heatmap";

export const AUTO_CHECKIN_RADIUS = 50;

export const STATIONS: Station[] = Object.entries(STATION_COORDS)
  .map(([id, s]) => ({
    id,
    name: s.name.th,
    lat: s.lat,
    lng: s.lng,
  }))
  .filter((s) => s.lat && s.lng);
