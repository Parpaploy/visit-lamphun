import { collection, onSnapshot, query, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import type { TransportType } from "../interfaces/stat.interface";
import type { HeatmapRecord } from "../interfaces/admin.interface";

export const STATION_COORDS = {
  hariphunchai: {
    name: {
      th: "วัดพระธาตุหริภุญชัย",
      en: "Wat Phra That Hariphunchai",
      cn: "哈里蓬猜寺",
    },
    lat: 18.5771055,
    lng: 99.008501,
  },
  community: {
    name: {
      th: "พิพิธภัณฑ์ชุมชนเมือง",
      en: "Lamphun Community Museum",
      cn: "南奔城市社区博物馆",
    },
    lat: 18.5775416,
    lng: 99.0060922,
  },
  chamthewi: {
    name: {
      th: "อนุสาวรีย์พระนางจามเทวี",
      en: "Queen Chama Thewi Monument",
      cn: "乍瑪黛維女王紀念碑",
    },
    lat: 18.5747234,
    lng: 99.0042447,
  },
  // khuang: {
  //   name: { th: "ข่วงพันปี", en: "Millennium Square", cn: "千年广场" },
  //   lat: 18.5779793,
  //   lng: 99.0063329,
  // },
  "wat-chamthewi": {
    name: { th: "วัดจามเทวี", en: "Wat Chama Thewi", cn: "乍玛黛维寺" },
    lat: 18.5815502,
    lng: 98.9963657,
  },
  mahawan: {
    name: { th: "วัดมหาวัน", en: "Wat Mahawan", cn: "玛哈湾寺" },
    lat: 18.578852,
    lng: 99.0033117,
  },
  "khong-ruesi": {
    name: { th: "วัดพระคงฤาษี", en: "Wat Phra Khong Rue Si", cn: "帕空圣人寺" },
    lat: 18.5837282,
    lng: 99.008241,
  },
  "san-pa-yang": {
    name: {
      th: "วัดสันป่ายางหลวง",
      en: "Wat San Pa Yang Luang",
      cn: "圣帕扬隆寺",
    },
    lat: 18.5853532,
    lng: 99.0118584,
  },
  "ku-chang": {
    name: {
      th: "กู่ช้าง - กู่ม้า",
      en: "Ku Chang - Ku Ma",
      cn: "古象塔 - 古马塔",
    },
    lat: 18.5867237,
    lng: 99.0178729,
  },
  "muan-chai": {
    name: {
      th: "สวนม่วนใจ๋ (ศูนย์การเรียนรู้รถไฟ)",
      en: "Suan Muan Jai (Railway Learning Center)",
      cn: "欢乐公园 (铁路学习中心)",
    },
    lat: 18.5862068,
    lng: 99.0186529,
  },
  "mai-thai": {
    name: {
      th: "ศูนย์การเรียนรู้ลำพูนไหมไทย",
      en: "Lamphun Thai Silk Learning Center",
      cn: "南奔泰国丝绸学习中心",
    },
    lat: 18.5828849,
    lng: 99.0165264,
  },
  "province-lamphun": {
    name: { th: "พื้นที่ลำพูน (อื่นๆ)", en: "Lamphun Area", cn: "南奔地区" },
    lat: 0,
    lng: 0,
  },
  "province-chiangmai": {
    name: { th: "พื้นที่เชียงใหม่", en: "Chiang Mai Area", cn: "清迈地区" },
    lat: 0,
    lng: 0,
  },
  "province-other": {
    name: { th: "พื้นที่อื่นๆ", en: "Other Areas", cn: "其他地区" },
    lat: 0,
    lng: 0,
  },
};

const HEATMAP_COLLECTION = "heatmap_records";

export const getDeviceUID = (): string => {
  let uid = localStorage.getItem("device_uid");
  if (!uid) {
    uid = crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15);
    localStorage.setItem("device_uid", uid);
  }
  return uid;
};

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

function checkProvince(
  lat: number,
  lng: number,
): "province-lamphun" | "province-chiangmai" | "province-other" {
  if (lat >= 17.6 && lat <= 18.7 && lng >= 98.7 && lng <= 99.4) {
    return "province-lamphun";
  }

  if (lat >= 17.2 && lat <= 20.1 && lng >= 98.1 && lng <= 99.5) {
    return "province-chiangmai";
  }

  return "province-other";
}

export function startLocationTracking(): () => void {
  const trackLocation = () => {
    if (!navigator.geolocation) return;

    const transportType = localStorage.getItem(
      "current_transport_type",
    ) as TransportType | null;

    if (!transportType) return;

    const uid = getDeviceUID();

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      // console.log("📍 GPS:", latitude, longitude);

      let closestId = "";
      let closestDist = Infinity;

      Object.entries(STATION_COORDS).forEach(([id, { lat, lng }]) => {
        if (lat === 0 && lng === 0) return;

        const dist = haversineDistance(latitude, longitude, lat, lng);

        if (dist < closestDist) {
          closestDist = dist;
          closestId = id;
        }
      });

      let finalStationId = closestId;
      let finalDistance = Math.round(closestDist);

      if (!closestId || closestDist > 5000) {
        finalStationId = checkProvince(latitude, longitude);
        finalDistance = 0;
      }

      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      const docId = `${dateStr}_${uid}`;

      const record: HeatmapRecord = {
        uid,
        transportType,
        stationId: finalStationId,
        timestamp: now.getTime(),
        distance: finalDistance,
      };

      try {
        await setDoc(doc(db, HEATMAP_COLLECTION, docId), record);
      } catch (error) {
        console.error("Error saving heatmap:", error);
      }

      // console.log("🏪 closestId:", closestId);
      // console.log("📏 closestDist (m):", closestDist);
      // console.log("✅ finalStationId:", finalStationId);
    });
  };

  trackLocation();

  const intervalId = setInterval(trackLocation, 300000);

  return () => clearInterval(intervalId);
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
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}`;
}
