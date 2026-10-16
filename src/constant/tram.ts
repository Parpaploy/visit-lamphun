import type { Station } from "../interfaces/tram.interface";
import { STATION_COORDS } from "../utils/heatmap";

export const AUTO_CHECKIN_RADIUS = 50;

// The two northern stops are only about 100 m apart, so their mobile GPS
// geofences stay small enough to keep one stop from triggering the other.
const PHONE_GPS_RADIUS_METERS: Record<string, number> = {
  hariphunchai: 80,
  community: 70,
  chamthewi: 80,
  "wat-chamthewi": 70,
  mahawan: 70,
  "khong-ruesi": 70,
  "san-pa-yang": 70,
  "ku-chang": 35,
  "muan-chai": 35,
  "mai-thai": 70,
};

export const STATIONS: Station[] = Object.entries(STATION_COORDS)
  .map(([id, s]) => ({
    id,
    name: s.name.th,
    lat: s.lat,
    lng: s.lng,
    phoneGpsRadiusMeters: PHONE_GPS_RADIUS_METERS[id] ?? 70,
  }))
  .filter((s) => s.lat && s.lng);
