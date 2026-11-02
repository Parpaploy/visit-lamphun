import type { Station } from "../interfaces/tram.interface";
import { STATION_COORDS } from "../utils/heatmap";

export const AUTO_CHECKIN_RADIUS = 50;
export const NEAREST_STATION_DISPLAY_RADIUS = 1000;

// Phone GPS geofence per stop. Only the nearest stop can match, so each radius
// just needs to stay under half the gap to its closest neighbour:
// hariphunchai↔community 258 m, ku-chang↔muan-chai 100 m, others 320 m+.
const PHONE_GPS_RADIUS_METERS: Record<string, number> = {
  hariphunchai: 120,
  community: 120,
  chamthewi: 150,
  "wat-chamthewi": 150,
  mahawan: 150,
  "khong-ruesi": 150,
  "san-pa-yang": 150,
  "ku-chang": 50,
  "muan-chai": 50,
  "mai-thai": 150,
};

export const STATIONS: Station[] = Object.entries(STATION_COORDS)
  .map(([id, s]) => ({
    id,
    name: s.name.th,
    lat: s.lat,
    lng: s.lng,
    phoneGpsRadiusMeters: PHONE_GPS_RADIUS_METERS[id] ?? 100,
  }))
  .filter((s) => s.lat && s.lng);
