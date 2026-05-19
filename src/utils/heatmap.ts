import { collection, addDoc, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

export interface HeatmapRecord {
  stationId: string;
  timestamp: number;
  distance: number;
}

export const STATION_COORDS = {
  hariphunchai: {
    name: {
      th: "หริภุญชัย",
      en: "Hariphunchai",
      cn: "哈里奔猜",
    },
    lat: 18.5771055,
    lng: 99.008501,
  },
  community: {
    name: {
      th: "ชุมชนเมือง",
      en: "Community Area",
      cn: "社区",
    },
    lat: 18.5775416,
    lng: 99.0060922,
  },
  chamthewi: {
    name: {
      th: "จามเทวี",
      en: "Chamthewi",
      cn: "占特威",
    },
    lat: 18.5747234,
    lng: 99.0042447,
  },
  khuang: {
    name: {
      th: "ข่วงพันปี",
      en: "Khuang Phan Pi",
      cn: "千年广场",
    },
    lat: 18.5779793,
    lng: 99.0063329,
  },
  "wat-chamthewi": {
    name: {
      th: "วัดจามเทวี",
      en: "Wat Chamthewi",
      cn: "占特威寺",
    },
    lat: 18.5815502,
    lng: 98.9963657,
  },
  mahawan: {
    name: {
      th: "วัดมหาวัน",
      en: "Wat Mahawan",
      cn: "玛哈万寺",
    },
    lat: 18.578852,
    lng: 99.0033117,
  },
  "khong-ruesi": {
    name: {
      th: "คงฤาษี",
      en: "Khong Rue Si",
      cn: "隐士村",
    },
    lat: 18.5837282,
    lng: 99.008241,
  },
  "san-pa-yang": {
    name: {
      th: "สันป่ายางหลวง",
      en: "San Pa Yang Luang",
      cn: "三巴央",
    },
    lat: 18.5853532,
    lng: 99.0118584,
  },
  "ku-chang": {
    name: {
      th: "กู่ช้าง กู่ม้า",
      en: "Ku Chang Ku Ma",
      cn: "象墓马墓",
    },
    lat: 18.5867237,
    lng: 99.0178729,
  },
  "muan-chai": {
    name: {
      th: "ม่วนใจ๋",
      en: "Muan Jai",
      cn: "快乐",
    },
    lat: 18.5862068,
    lng: 99.0186529,
  },
  "mai-thai": {
    name: {
      th: "ไหมไทย",
      en: "Mai Thai",
      cn: "泰丝",
    },
    lat: 18.5828849,
    lng: 99.0165264,
  },
  //   test: {
  //     name: {
  //       th: "ทดสอบ",
  //       en: "Test",
  //       cn: "测试",
  //     },
  //     lat: 18.7897054,
  //     lng: 99.0180071,
  //   },
};

const HEATMAP_COLLECTION = "heatmap_records";
const RECORDED_KEY = "heatmap_recorded_session";

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function recordUserLocation(): void {
  if (sessionStorage.getItem(RECORDED_KEY)) return;
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    let closestId = "";
    let closestDist = Infinity;

    Object.entries(STATION_COORDS).forEach(([id, { lat, lng }]) => {
      const dist = haversineDistance(latitude, longitude, lat, lng);
      if (dist < closestDist) {
        closestDist = dist;
        closestId = id;
      }
    });

    if (!closestId) return;

    const record: HeatmapRecord = {
      stationId: closestId,
      timestamp: Date.now(),
      distance: Math.round(closestDist),
    };

    await addDoc(collection(db, HEATMAP_COLLECTION), record);
    sessionStorage.setItem(RECORDED_KEY, "true");
  });
}

export function subscribeHeatmapRecords(
  callback: (records: HeatmapRecord[]) => void,
): () => void {
  const q = query(collection(db, HEATMAP_COLLECTION));
  return onSnapshot(q, (snap) => {
    const records: HeatmapRecord[] = snap.docs.map(
      (d) => d.data() as HeatmapRecord,
    );
    callback(records);
  });
}

export function formatHour(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:00`;
}

export function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
