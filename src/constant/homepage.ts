import type {
  Lang,
  Location,
  PlaceTag,
  StationPin,
} from "../interfaces/homepage.interface";

export const isSaturday = new Date().getDay() === 6;

// export const BG_MAP: Record<string, string> = {
//   th: isSaturday
//     ? "/images/homepage/th-bg.svg"
//     : "/images/homepage/th-bg-weekend.svg",
//   en: isSaturday
//     ? "/images/homepage/en-bg.svg"
//     : "/images/homepage/en-bg-weekend.svg",
//   cn: isSaturday
//     ? "/images/homepage/cn-bg.svg"
//     : "/images/homepage/cn-bg-weekend.svg",
// };

// export const BG_MAP: Record<string, string> = {
//   th: isSaturday
//     ? "/images/homepage/th-new-bg-weekend.svg"
//     : "/images/homepage/th-new-bg.svg",
//   en: isSaturday
//     ? "/images/homepage/en-bg.svg"
//     : "/images/homepage/en-bg-weekend.svg",
//   cn: isSaturday
//     ? "/images/homepage/cn-bg.svg"
//     : "/images/homepage/cn-bg-weekend.svg",
// };

// export const BG_MAP: Record<string, string> = {
//   th: isSaturday
//     ? "/images/homepage/th-new-bg-no-kuang.svg"
//     : "/images/homepage/th-new-bg-no-kuang.svg",
//   en: isSaturday
//     ? "/images/homepage/en-bg.svg"
//     : "/images/homepage/en-bg-weekend.svg",
//   cn: isSaturday
//     ? "/images/homepage/cn-bg.svg"
//     : "/images/homepage/cn-bg-weekend.svg",
// };

export const BG_MAP: Record<string, string> = {
  th: isSaturday
    ? "/images/homepage/th-new-bg-no-kuang.svg"
    : "/images/homepage/th-new-bg-no-kuang.svg",
  en: isSaturday
    ? "/images/homepage/en-new-bg-no-kuang.svg"
    : "/images/homepage/en-new-bg-no-kuang.svg",
  cn: isSaturday
    ? "/images/homepage/cn-new-bg-no-kuang.svg"
    : "/images/homepage/cn-new-bg-no-kuang.svg",
};

// export const STATION_ID_MAP: Record<number, string> = {
//   1: "hariphunchai",
//   2: "community",
//   3: "chamthewi",
//   4: "khuang",
//   5: "wat-chamthewi",
//   6: "mahawan",
//   7: "khong-ruesi",
//   8: "san-pa-yang",
//   9: "ku-chang",
//   10: "muan-chai",
//   11: "mai-thai",
// };

export const STATION_ID_MAP: Record<number, string> = {
  1: "hariphunchai",
  2: "community",
  3: "chamthewi",
  4: "wat-chamthewi",
  5: "mahawan",
  6: "khong-ruesi",
  7: "san-pa-yang",
  8: "ku-chang",
  9: "muan-chai",
  10: "mai-thai",
};

export const STATION_NAMES_TH: Record<string, string> = {
  hariphunchai: "หริภุญชัย",
  community: "ชุมชนเมือง",
  chamthewi: "จามเทวี",
  khuang: "ข่วงพันปี",
  "wat-chamthewi": "วัดจามเทวี",
  mahawan: "วัดมหาวัน",
  "khong-ruesi": "คงฤาษี",
  "san-pa-yang": "สันป่ายางหลวง",
  "ku-chang": "กู่ช้าง กู่ม้า",
  "muan-chai": "ม่วนใจ๋",
  "mai-thai": "ไหมไทย",
};

export const STATION_NAMES_ML: Record<
  string,
  { th: string; en: string; cn: string }
> = {
  hariphunchai: { th: "หริภุญชัย", en: "Hariphunchai", cn: "哈里奔猜" },
  community: { th: "ชุมชนเมือง", en: "Community Museum", cn: "社区博物馆" },
  chamthewi: { th: "จามเทวี", en: "Chamthewi Statue", cn: "占玛เทวี" },
  khuang: { th: "ข่วงพันปี", en: "Khuang Phan Pi", cn: "千年庭院" },
  "wat-chamthewi": { th: "วัดจามเทวี", en: "Wat Chamthewi", cn: "扎玛特威寺" },
  mahawan: { th: "วัดมหาวัน", en: "Wat Mahawan", cn: "马哈湾寺" },
  "khong-ruesi": { th: "คงฤาษี", en: "Wat Phra Khong Ruesi", cn: "空鲁西寺" },
  "san-pa-yang": {
    th: "สันป่ายางหลวง",
    en: "Wat San Pa Yang Luang",
    cn: "圣巴扬寺",
  },
  "ku-chang": { th: "กู่ช้าง กู่ม้า", en: "Ku Chang Ku Ma", cn: "库常库玛" },
  "muan-chai": { th: "ม่วนใจ๋", en: "Muan Jai", cn: "沐恩猜" },
  "mai-thai": { th: "ไหมไทย", en: "Mai Thai", cn: "泰丝学习中心" },
};

// export const hitboxData: Record<string, Location[]> = {
//   th: [
//     {
//       no: 1,
//       id: "hariphunchai",
//       name: "หริภุญชัย",
//       points: [
//         { x: 156, y: 45, width: 78, height: 75 },
//         { x: 125, y: 115, width: 140, height: 30 },
//       ],
//     },
//     {
//       no: 2,
//       id: "community",
//       name: "ชุมชนเมือง",
//       points: [
//         { x: 50, y: 140, width: 85, height: 50 },
//         { x: 25, y: 190, width: 140, height: 25 },
//       ],
//     },
//     {
//       no: 3,
//       id: "chamthewi",
//       name: "จามเทวี",
//       points: [
//         { x: 275, y: 135, width: 50, height: 70 },
//         { x: 230, y: 200, width: 150, height: 25 },
//       ],
//     },
//     {
//       no: 4,
//       id: "khuang",
//       name: "ข่วงพันปี",
//       points: [
//         { x: 155, y: 220, width: 85, height: 50 },
//         { x: 135, y: 270, width: 135, height: 30 },
//       ],
//     },
//     {
//       no: 5,
//       id: "wat-chamthewi",
//       name: "วัดจามเทวี",
//       points: [
//         { x: 85, y: 295, width: 60, height: 65 },
//         { x: 65, y: 360, width: 90, height: 25 },
//       ],
//     },
//     {
//       no: 6,
//       id: "mahawan",
//       name: "วัดมหาวัน",
//       points: [
//         { x: 180, y: 340, width: 75, height: 55 },
//         { x: 175, y: 395, width: 90, height: 25 },
//       ],
//     },
//     {
//       no: 7,
//       id: "khong-ruesi",
//       name: "คงฤาษี",
//       points: [
//         { x: 220, y: 430, width: 55, height: 70 },
//         { x: 185, y: 490, width: 115, height: 30 },
//       ],
//     },
//     {
//       no: 8,
//       id: "san-pa-yang",
//       name: "สันป่ายางหลวง",
//       points: [
//         { x: 53, y: 400, width: 75, height: 65 },
//         { x: 30, y: 460, width: 120, height: 25 },
//       ],
//     },
//     {
//       no: 9,
//       id: "ku-chang",
//       name: "กู่ช้าง กู่ม้า",
//       points: [
//         { x: 70, y: 500, width: 80, height: 70 },
//         { x: 70, y: 565, width: 85, height: 25 },
//       ],
//     },
//     {
//       no: 10,
//       id: "muan-chai",
//       name: "ม่วนใจ๋",
//       points: [
//         { x: 285, y: 510, width: 80, height: 55 },
//         { x: 240, y: 560, width: 150, height: 45 },
//       ],
//     },
//     {
//       no: 11,
//       id: "mai-thai",
//       name: "ไหมไทย",
//       points: [
//         { x: 290, y: 300, width: 75, height: 55 },
//         { x: 275, y: 355, width: 115, height: 30 },
//       ],
//     },
//   ],
//   en: [
//     {
//       no: 1,
//       id: "hariphunchai",
//       name: "Hariphunchai",
//       points: [
//         { x: 156, y: 45, width: 78, height: 75 },
//         { x: 110, y: 115, width: 170, height: 25 },
//       ],
//     },
//     {
//       no: 2,
//       id: "community",
//       name: "Community Museum",
//       points: [
//         { x: 50, y: 140, width: 85, height: 50 },
//         { x: 30, y: 190, width: 140, height: 35 },
//       ],
//     },
//     {
//       no: 3,
//       id: "chamthewi",
//       name: "Chamthewi Statue",
//       points: [
//         { x: 275, y: 135, width: 50, height: 70 },
//         { x: 230, y: 200, width: 150, height: 30 },
//       ],
//     },
//     {
//       no: 4,
//       id: "khuang",
//       name: "Khuang Phan Pi",
//       points: [
//         { x: 155, y: 220, width: 85, height: 50 },
//         { x: 135, y: 270, width: 155, height: 30 },
//       ],
//     },
//     {
//       no: 5,
//       id: "wat-chamthewi",
//       name: "Wat Chamthewi",
//       points: [
//         { x: 85, y: 295, width: 60, height: 65 },
//         { x: 60, y: 360, width: 115, height: 25 },
//       ],
//     },
//     {
//       no: 6,
//       id: "mahawan",
//       name: "Wat Mahawan",
//       points: [
//         { x: 180, y: 340, width: 75, height: 55 },
//         { x: 175, y: 395, width: 90, height: 25 },
//       ],
//     },
//     {
//       no: 7,
//       id: "khong-ruesi",
//       name: "Wat Phra Khong Ruesi",
//       points: [
//         { x: 220, y: 430, width: 55, height: 70 },
//         { x: 180, y: 490, width: 110, height: 30 },
//       ],
//     },
//     {
//       no: 8,
//       id: "san-pa-yang",
//       name: "Wat San Pa Yang Luang",
//       points: [
//         { x: 53, y: 400, width: 75, height: 65 },
//         { x: 40, y: 460, width: 145, height: 25 },
//       ],
//     },
//     {
//       no: 9,
//       id: "ku-chang",
//       name: "Ku Chang Ku Ma",
//       points: [
//         { x: 70, y: 500, width: 80, height: 70 },
//         { x: 55, y: 560, width: 115, height: 30 },
//       ],
//     },
//     {
//       no: 10,
//       id: "muan-chai",
//       name: "Muan Jai",
//       points: [
//         { x: 285, y: 510, width: 80, height: 55 },
//         { x: 240, y: 560, width: 150, height: 45 },
//       ],
//     },
//     {
//       no: 11,
//       id: "mai-thai",
//       name: "Mai Thai",
//       points: [
//         { x: 290, y: 300, width: 75, height: 55 },
//         { x: 270, y: 355, width: 120, height: 30 },
//       ],
//     },
//   ],
//   cn: [
//     {
//       no: 1,
//       id: "hariphunchai",
//       name: "哈里奔猜",
//       points: [
//         { x: 156, y: 45, width: 78, height: 75 },
//         { x: 135, y: 115, width: 120, height: 25 },
//       ],
//     },
//     {
//       no: 2,
//       id: "community",
//       name: "社区博物馆",
//       points: [
//         { x: 50, y: 140, width: 85, height: 50 },
//         { x: 40, y: 190, width: 110, height: 30 },
//       ],
//     },
//     {
//       no: 3,
//       id: "chamthewi",
//       name: "占玛เทวี",
//       points: [
//         { x: 275, y: 135, width: 50, height: 70 },
//         { x: 235, y: 200, width: 140, height: 30 },
//       ],
//     },
//     {
//       no: 4,
//       id: "khuang",
//       name: "千年庭院",
//       points: [
//         { x: 155, y: 220, width: 85, height: 50 },
//         { x: 135, y: 270, width: 125, height: 30 },
//       ],
//     },
//     {
//       no: 5,
//       id: "wat-chamthewi",
//       name: "扎玛特威寺",
//       points: [
//         { x: 85, y: 295, width: 60, height: 65 },
//         { x: 70, y: 360, width: 80, height: 25 },
//       ],
//     },
//     {
//       no: 6,
//       id: "mahawan",
//       name: "马哈湾寺",
//       points: [
//         { x: 180, y: 340, width: 75, height: 55 },
//         { x: 175, y: 395, width: 90, height: 25 },
//       ],
//     },
//     {
//       no: 7,
//       id: "khong-ruesi",
//       name: "空鲁西寺",
//       points: [
//         { x: 220, y: 430, width: 55, height: 70 },
//         { x: 205, y: 495, width: 80, height: 30 },
//       ],
//     },
//     {
//       no: 8,
//       id: "san-pa-yang",
//       name: "圣巴扬寺",
//       points: [
//         { x: 53, y: 400, width: 75, height: 65 },
//         { x: 50, y: 465, width: 85, height: 25 },
//       ],
//     },
//     {
//       no: 9,
//       id: "ku-chang",
//       name: "库常库玛",
//       points: [
//         { x: 70, y: 500, width: 80, height: 70 },
//         { x: 55, y: 560, width: 110, height: 30 },
//       ],
//     },
//     {
//       no: 10,
//       id: "muan-chai",
//       name: "沐恩猜",
//       points: [
//         { x: 285, y: 510, width: 80, height: 55 },
//         { x: 240, y: 560, width: 140, height: 45 },
//       ],
//     },
//     {
//       no: 11,
//       id: "mai-thai",
//       name: "泰丝学习中心",
//       points: [
//         { x: 290, y: 300, width: 75, height: 55 },
//         { x: 260, y: 350, width: 120, height: 30 },
//       ],
//     },
//   ],
// };

// export const hitboxData: Record<string, Location[]> = {
//   th: [
//     {
//       no: 1,
//       id: "hariphunchai",
//       name: "หริภุญชัย",
//       points: [
//         { x: 85, y: -115, width: 80, height: 85 },
//         { x: 40, y: -30, width: 175, height: 30 },
//       ],
//     },
//     {
//       no: 2,
//       id: "community",
//       name: "ชุมชนเมือง",
//       points: [
//         { x: 240, y: -40, width: 110, height: 65 },
//         { x: 210, y: 22, width: 170, height: 30 },
//       ],
//     },
//     {
//       no: 3,
//       id: "chamthewi",
//       name: "จามเทวี",
//       points: [
//         { x: 80, y: 20, width: 80, height: 85 },
//         { x: 30, y: 105, width: 195, height: 30 },
//       ],
//     },
//     {
//       no: 4,
//       id: "khuang",
//       name: "ข่วงพันปี",
//       points: [
//         { x: 245, y: 125, width: 125, height: 60 },
//         { x: 262, y: 185, width: 90, height: 30 },
//       ],
//     },
//     {
//       no: 5,
//       id: "wat-chamthewi",
//       name: "วัดจามเทวี",
//       points: [
//         { x: 90, y: 170, width: 70, height: 85 },
//         { x: 80, y: 255, width: 92, height: 30 },
//       ],
//     },
//     {
//       no: 6,
//       id: "mahawan",
//       name: "วัดมหาวัน",
//       points: [
//         { x: 240, y: 260, width: 100, height: 75 },
//         { x: 245, y: 335, width: 90, height: 30 },
//       ],
//     },
//     {
//       no: 7,
//       id: "khong-ruesi",
//       name: "คงฤาษี",
//       points: [
//         { x: 95, y: 330, width: 55, height: 90 },
//         { x: 65, y: 415, width: 120, height: 35 },
//       ],
//     },
//     {
//       no: 8,
//       id: "san-pa-yang",
//       name: "สันป่ายางหลวง",
//       points: [
//         { x: 240, y: 410, width: 75, height: 75 },
//         { x: 205, y: 485, width: 145, height: 30 },
//       ],
//     },
//     {
//       no: 9,
//       id: "ku-chang",
//       name: "กู่ช้าง กู่ม้า",
//       points: [
//         { x: 85, y: 490, width: 85, height: 80 },
//         { x: 75, y: 570, width: 105, height: 30 },
//       ],
//     },
//     {
//       no: 10,
//       id: "muan-chai",
//       name: "ม่วนใจ๋",
//       points: [
//         { x: 65, y: 640, width: 95, height: 60 },
//         { x: 57, y: 700, width: 110, height: 32 },
//       ],
//     },
//     {
//       no: 11,
//       id: "mai-thai",
//       name: "ไหมไทย",
//       points: [
//         { x: 245, y: 585, width: 85, height: 60 },
//         { x: 214, y: 645, width: 145, height: 50 },
//       ],
//     },
//   ],
//   en: [
//     {
//       no: 1,
//       id: "hariphunchai",
//       name: "Hariphunchai",
//       points: [
//         { x: 85, y: -115, width: 80, height: 85 },
//         { x: 40, y: -30, width: 175, height: 30 },
//       ],
//     },
//     {
//       no: 2,
//       id: "community",
//       name: "Community Museum",
//       points: [
//         { x: 240, y: -40, width: 110, height: 65 },
//         { x: 210, y: 22, width: 170, height: 30 },
//       ],
//     },
//     {
//       no: 3,
//       id: "chamthewi",
//       name: "Chamthewi Statue",
//       points: [
//         { x: 80, y: 20, width: 80, height: 85 },
//         { x: 30, y: 105, width: 195, height: 30 },
//       ],
//     },
//     {
//       no: 4,
//       id: "khuang",
//       name: "Khuang Phan Pi",
//       points: [
//         { x: 245, y: 125, width: 125, height: 60 },
//         { x: 262, y: 185, width: 90, height: 30 },
//       ],
//     },
//     {
//       no: 5,
//       id: "wat-chamthewi",
//       name: "Wat Chamthewi",
//       points: [
//         { x: 90, y: 170, width: 70, height: 85 },
//         { x: 80, y: 255, width: 92, height: 30 },
//       ],
//     },
//     {
//       no: 6,
//       id: "mahawan",
//       name: "Wat Mahawan",
//       points: [
//         { x: 240, y: 260, width: 100, height: 75 },
//         { x: 245, y: 335, width: 90, height: 30 },
//       ],
//     },
//     {
//       no: 7,
//       id: "khong-ruesi",
//       name: "Wat Phra Khong Ruesi",
//       points: [
//         { x: 95, y: 330, width: 55, height: 90 },
//         { x: 65, y: 415, width: 120, height: 35 },
//       ],
//     },
//     {
//       no: 8,
//       id: "san-pa-yang",
//       name: "Wat San Pa Yang Luang",
//       points: [
//         { x: 240, y: 410, width: 75, height: 75 },
//         { x: 205, y: 485, width: 145, height: 30 },
//       ],
//     },
//     {
//       no: 9,
//       id: "ku-chang",
//       name: "Ku Chang Ku Ma",
//       points: [
//         { x: 85, y: 490, width: 85, height: 80 },
//         { x: 75, y: 570, width: 105, height: 30 },
//       ],
//     },
//     {
//       no: 10,
//       id: "muan-chai",
//       name: "Muan Jai",
//       points: [
//         { x: 65, y: 640, width: 95, height: 60 },
//         { x: 57, y: 700, width: 110, height: 32 },
//       ],
//     },
//     {
//       no: 11,
//       id: "mai-thai",
//       name: "Mai Thai",
//       points: [
//         { x: 245, y: 585, width: 85, height: 60 },
//         { x: 214, y: 645, width: 145, height: 50 },
//       ],
//     },
//   ],
//   cn: [
//     {
//       no: 1,
//       id: "hariphunchai",
//       name: "哈里奔猜",
//       points: [
//         { x: 85, y: -115, width: 80, height: 85 },
//         { x: 40, y: -30, width: 175, height: 30 },
//       ],
//     },
//     {
//       no: 2,
//       id: "community",
//       name: "社区博物馆",
//       points: [
//         { x: 240, y: -40, width: 110, height: 65 },
//         { x: 210, y: 22, width: 170, height: 30 },
//       ],
//     },
//     {
//       no: 3,
//       id: "chamthewi",
//       name: "占玛เทวี",
//       points: [
//         { x: 80, y: 20, width: 80, height: 85 },
//         { x: 30, y: 105, width: 195, height: 30 },
//       ],
//     },
//     {
//       no: 4,
//       id: "khuang",
//       name: "千年庭院",
//       points: [
//         { x: 245, y: 125, width: 125, height: 60 },
//         { x: 262, y: 185, width: 90, height: 30 },
//       ],
//     },
//     {
//       no: 5,
//       id: "wat-chamthewi",
//       name: "扎玛特威寺",
//       points: [
//         { x: 90, y: 170, width: 70, height: 85 },
//         { x: 80, y: 255, width: 92, height: 30 },
//       ],
//     },
//     {
//       no: 6,
//       id: "mahawan",
//       name: "马哈湾寺",
//       points: [
//         { x: 240, y: 260, width: 100, height: 75 },
//         { x: 245, y: 335, width: 90, height: 30 },
//       ],
//     },
//     {
//       no: 7,
//       id: "khong-ruesi",
//       name: "空鲁西寺",
//       points: [
//         { x: 95, y: 330, width: 55, height: 90 },
//         { x: 65, y: 415, width: 120, height: 35 },
//       ],
//     },
//     {
//       no: 8,
//       id: "san-pa-yang",
//       name: "圣巴扬寺",
//       points: [
//         { x: 240, y: 410, width: 75, height: 75 },
//         { x: 205, y: 485, width: 145, height: 30 },
//       ],
//     },
//     {
//       no: 9,
//       id: "ku-chang",
//       name: "库常库玛",
//       points: [
//         { x: 85, y: 490, width: 85, height: 80 },
//         { x: 75, y: 570, width: 105, height: 30 },
//       ],
//     },
//     {
//       no: 10,
//       id: "muan-chai",
//       name: "沐恩猜",
//       points: [
//         { x: 65, y: 640, width: 95, height: 60 },
//         { x: 57, y: 700, width: 110, height: 32 },
//       ],
//     },
//     {
//       no: 11,
//       id: "mai-thai",
//       name: "泰丝学习中心",
//       points: [
//         { x: 245, y: 585, width: 85, height: 60 },
//         { x: 214, y: 645, width: 145, height: 50 },
//       ],
//     },
//   ],
// };

// export const STATION_PIN_MAP: Record<
//   string,
//   { x: number; y: number; offsetX?: number; offsetY?: number }
// > = {
//   hariphunchai: { x: 195, y: 82, offsetX: -0.75, offsetY: 4 },
//   community: { x: 92, y: 165, offsetX: 2, offsetY: 2 },
//   chamthewi: { x: 300, y: 170, offsetX: -0.25, offsetY: 2 },
//   khuang: { x: 197, y: 245, offsetY: 2 },
//   "wat-chamthewi": { x: 115, y: 327, offsetY: 3 },
//   mahawan: { x: 217, y: 367, offsetX: 0.5, offsetY: 2.5 },
//   "khong-ruesi": { x: 247, y: 465, offsetX: -0.75, offsetY: 1 },
//   "san-pa-yang": { x: 90, y: 432, offsetX: 1, offsetY: 1.5 },
//   "ku-chang": { x: 110, y: 535, offsetX: 1, offsetY: 0 },
//   "muan-chai": { x: 325, y: 537, offsetX: -1, offsetY: 0 },
//   "mai-thai": { x: 327, y: 327, offsetX: -0.5, offsetY: 0 },
// };

// export const hitboxData: Record<string, Location[]> = {
//   th: [
//     {
//       no: 1,
//       id: "hariphunchai",
//       name: "หริภุญชัย",
//       points: [
//         { x: 85, y: -115, width: 80, height: 85 },
//         { x: 40, y: -30, width: 175, height: 30 },
//       ],
//     },
//     {
//       no: 2,
//       id: "community",
//       name: "ชุมชนเมือง",
//       points: [
//         { x: 240, y: -40, width: 110, height: 65 },
//         { x: 210, y: 22, width: 170, height: 30 },
//       ],
//     },
//     {
//       no: 3,
//       id: "chamthewi",
//       name: "จามเทวี",
//       points: [
//         { x: 80, y: 20, width: 80, height: 85 },
//         { x: 30, y: 105, width: 195, height: 30 },
//       ],
//     },
//     // {
//     //   no: 4,
//     //   id: "khuang",
//     //   name: "ข่วงพันปี",
//     //   points: [
//     //     { x: 245, y: 125, width: 125, height: 60 },
//     //     { x: 262, y: 185, width: 90, height: 30 },
//     //   ],
//     // },
//     {
//       no: 5,
//       id: "wat-chamthewi",
//       name: "วัดจามเทวี",
//       points: [
//         { x: 256, y: 108, width: 70, height: 85 },
//         { x: 247, y: 191, width: 92, height: 30 },
//       ],
//     },
//     {
//       no: 6,
//       id: "mahawan",
//       name: "วัดมหาวัน",
//       points: [
//         { x: 66, y: 190, width: 100, height: 75 },
//         { x: 71, y: 265, width: 90, height: 31 },
//       ],
//     },
//     {
//       no: 7,
//       id: "khong-ruesi",
//       name: "คงฤาษี",
//       points: [
//         { x: 265, y: 254, width: 55, height: 90 },
//         { x: 233, y: 340, width: 120, height: 35 },
//       ],
//     },
//     {
//       no: 8,
//       id: "san-pa-yang",
//       name: "สันป่ายางหลวง",
//       points: [
//         { x: 92, y: 340, width: 75, height: 75 },
//         { x: 58, y: 415, width: 145, height: 30 },
//       ],
//     },
//     {
//       no: 9,
//       id: "ku-chang",
//       name: "กู่ช้าง กู่ม้า",
//       points: [
//         { x: 240, y: 415, width: 85, height: 80 },
//         { x: 232, y: 495, width: 105, height: 30 },
//       ],
//     },
//     {
//       no: 10,
//       id: "muan-chai",
//       name: "ม่วนใจ๋",
//       points: [
//         { x: 233, y: 620, width: 95, height: 60 },
//         { x: 225, y: 680, width: 110, height: 32 },
//       ],
//     },
//     {
//       no: 11,
//       id: "mai-thai",
//       name: "ไหมไทย",
//       points: [
//         { x: 90, y: 498, width: 85, height: 60 },
//         { x: 60, y: 557, width: 145, height: 50 },
//       ],
//     },
//   ],
//   en: [
//     {
//       no: 1,
//       id: "hariphunchai",
//       name: "Hariphunchai",
//       points: [
//         { x: 85, y: -115, width: 80, height: 85 },
//         { x: 40, y: -30, width: 175, height: 30 },
//       ],
//     },
//     {
//       no: 2,
//       id: "community",
//       name: "Community Museum",
//       points: [
//         { x: 240, y: -40, width: 110, height: 65 },
//         { x: 210, y: 22, width: 170, height: 30 },
//       ],
//     },
//     {
//       no: 3,
//       id: "chamthewi",
//       name: "Chamthewi Statue",
//       points: [
//         { x: 80, y: 20, width: 80, height: 85 },
//         { x: 30, y: 105, width: 195, height: 30 },
//       ],
//     },
//     // {
//     //   no: 4,
//     //   id: "khuang",
//     //   name: "Khuang Phan Pi",
//     //   points: [
//     //     { x: 245, y: 125, width: 125, height: 60 },
//     //     { x: 262, y: 185, width: 90, height: 30 },
//     //   ],
//     // },
//     {
//       no: 5,
//       id: "wat-chamthewi",
//       name: "Wat Chamthewi",
//       points: [
//         { x: 256, y: 108, width: 70, height: 85 },
//         { x: 247, y: 191, width: 92, height: 30 },
//       ],
//     },
//     {
//       no: 6,
//       id: "mahawan",
//       name: "Wat Mahawan",
//       points: [
//         { x: 66, y: 190, width: 100, height: 75 },
//         { x: 71, y: 265, width: 90, height: 31 },
//       ],
//     },
//     {
//       no: 7,
//       id: "khong-ruesi",
//       name: "Wat Phra Khong Ruesi",
//       points: [
//         { x: 265, y: 254, width: 55, height: 90 },
//         { x: 233, y: 340, width: 120, height: 35 },
//       ],
//     },
//     {
//       no: 8,
//       id: "san-pa-yang",
//       name: "Wat San Pa Yang Luang",
//       points: [
//         { x: 92, y: 340, width: 75, height: 75 },
//         { x: 58, y: 415, width: 145, height: 30 },
//       ],
//     },
//     {
//       no: 9,
//       id: "ku-chang",
//       name: "Ku Chang Ku Ma",
//       points: [
//         { x: 240, y: 415, width: 85, height: 80 },
//         { x: 232, y: 495, width: 105, height: 30 },
//       ],
//     },
//     {
//       no: 10,
//       id: "muan-chai",
//       name: "Muan Jai",
//       points: [
//         { x: 233, y: 620, width: 95, height: 60 },
//         { x: 225, y: 680, width: 110, height: 32 },
//       ],
//     },
//     {
//       no: 11,
//       id: "mai-thai",
//       name: "Mai Thai",
//       points: [
//         { x: 90, y: 498, width: 85, height: 60 },
//         { x: 60, y: 557, width: 145, height: 50 },
//       ],
//     },
//   ],
//   cn: [
//     {
//       no: 1,
//       id: "hariphunchai",
//       name: "哈里奔猜",
//       points: [
//         { x: 85, y: -115, width: 80, height: 85 },
//         { x: 40, y: -30, width: 175, height: 30 },
//       ],
//     },
//     {
//       no: 2,
//       id: "community",
//       name: "社区博物馆",
//       points: [
//         { x: 240, y: -40, width: 110, height: 65 },
//         { x: 210, y: 22, width: 170, height: 30 },
//       ],
//     },
//     {
//       no: 3,
//       id: "chamthewi",
//       name: "占玛เทวี",
//       points: [
//         { x: 80, y: 20, width: 80, height: 85 },
//         { x: 30, y: 105, width: 195, height: 30 },
//       ],
//     },
//     // {
//     //   no: 4,
//     //   id: "khuang",
//     //   name: "千年庭院",
//     //   points: [
//     //     { x: 245, y: 125, width: 125, height: 60 },
//     //     { x: 262, y: 185, width: 90, height: 30 },
//     //   ],
//     // },
//     {
//       no: 5,
//       id: "wat-chamthewi",
//       name: "扎玛特威寺",
//       points: [
//         { x: 256, y: 108, width: 70, height: 85 },
//         { x: 247, y: 191, width: 92, height: 30 },
//       ],
//     },
//     {
//       no: 6,
//       id: "mahawan",
//       name: "马哈湾寺",
//       points: [
//         { x: 66, y: 190, width: 100, height: 75 },
//         { x: 71, y: 265, width: 90, height: 31 },
//       ],
//     },
//     {
//       no: 7,
//       id: "khong-ruesi",
//       name: "空鲁西寺",
//       points: [
//         { x: 265, y: 254, width: 55, height: 90 },
//         { x: 233, y: 340, width: 120, height: 35 },
//       ],
//     },
//     {
//       no: 8,
//       id: "san-pa-yang",
//       name: "圣巴扬寺",
//       points: [
//         { x: 92, y: 340, width: 75, height: 75 },
//         { x: 58, y: 415, width: 145, height: 30 },
//       ],
//     },
//     {
//       no: 9,
//       id: "ku-chang",
//       name: "库常库玛",
//       points: [
//         { x: 240, y: 415, width: 85, height: 80 },
//         { x: 232, y: 495, width: 105, height: 30 },
//       ],
//     },
//     {
//       no: 10,
//       id: "muan-chai",
//       name: "沐恩猜",
//       points: [
//         { x: 233, y: 620, width: 95, height: 60 },
//         { x: 225, y: 680, width: 110, height: 32 },
//       ],
//     },
//     {
//       no: 11,
//       id: "mai-thai",
//       name: "泰丝学习中心",
//       points: [
//         { x: 90, y: 498, width: 85, height: 60 },
//         { x: 60, y: 557, width: 145, height: 50 },
//       ],
//     },
//   ],
// };

export const hitboxData: Record<string, Location[]> = {
  th: [
    {
      no: 1,
      id: "hariphunchai",
      name: "หริภุญชัย",
      points: [
        { x: 85, y: -115, width: 80, height: 85 },
        { x: 40, y: -30, width: 175, height: 30 },
      ],
    },
    {
      no: 2,
      id: "community",
      name: "ชุมชนเมือง",
      points: [
        { x: 240, y: -40, width: 110, height: 65 },
        { x: 210, y: 22, width: 170, height: 30 },
      ],
    },
    {
      no: 3,
      id: "chamthewi",
      name: "จามเทวี",
      points: [
        { x: 80, y: 20, width: 80, height: 85 },
        { x: 30, y: 105, width: 195, height: 30 },
      ],
    },
    // {
    //   no: 4,
    //   id: "khuang",
    //   name: "ข่วงพันปี",
    //   points: [
    //     { x: 245, y: 125, width: 125, height: 60 },
    //     { x: 262, y: 185, width: 90, height: 30 },
    //   ],
    // },
    {
      no: 4,
      id: "wat-chamthewi",
      name: "วัดจามเทวี",
      points: [
        { x: 256, y: 108, width: 70, height: 85 },
        { x: 247, y: 191, width: 92, height: 30 },
      ],
    },
    {
      no: 5,
      id: "mahawan",
      name: "วัดมหาวัน",
      points: [
        { x: 66, y: 190, width: 100, height: 75 },
        { x: 71, y: 265, width: 90, height: 31 },
      ],
    },
    {
      no: 6,
      id: "khong-ruesi",
      name: "คงฤาษี",
      points: [
        { x: 265, y: 254, width: 55, height: 90 },
        { x: 233, y: 340, width: 120, height: 35 },
      ],
    },
    {
      no: 7,
      id: "san-pa-yang",
      name: "สันป่ายางหลวง",
      points: [
        { x: 92, y: 340, width: 75, height: 75 },
        { x: 58, y: 415, width: 145, height: 30 },
      ],
    },
    {
      no: 8,
      id: "ku-chang",
      name: "กู่ช้าง กู่ม้า",
      points: [
        { x: 240, y: 415, width: 85, height: 80 },
        { x: 232, y: 495, width: 105, height: 30 },
      ],
    },
    {
      no: 9,
      id: "muan-chai",
      name: "ม่วนใจ๋",
      points: [
        { x: 233, y: 620, width: 95, height: 60 },
        { x: 225, y: 680, width: 110, height: 32 },
      ],
    },
    {
      no: 10,
      id: "mai-thai",
      name: "ไหมไทย",
      points: [
        { x: 90, y: 498, width: 85, height: 60 },
        { x: 60, y: 557, width: 145, height: 50 },
      ],
    },
  ],
  en: [
    {
      no: 1,
      id: "hariphunchai",
      name: "Hariphunchai",
      points: [
        { x: 78, y: -90, width: 80, height: 85 },
        { x: 2, y: -5, width: 210, height: 30 },
      ],
    },
    {
      no: 2,
      id: "community",
      name: "Community Museum",
      points: [
        { x: 225, y: -15, width: 105, height: 60 },
        { x: 163, y: 42, width: 230, height: 30 },
      ],
    },
    {
      no: 3,
      id: "chamthewi",
      name: "Chamthewi Statue",
      points: [
        { x: 75, y: 40, width: 80, height: 85 },
        { x: 0, y: 120, width: 233, height: 30 },
      ],
    },
    // {
    //   no: 4,
    //   id: "khuang",
    //   name: "Khuang Phan Pi",
    //   points: [
    //     { x: 245, y: 125, width: 125, height: 60 },
    //     { x: 262, y: 185, width: 90, height: 30 },
    //   ],
    // },
    {
      no: 4,
      id: "wat-chamthewi",
      name: "Wat Chamthewi",
      points: [
        { x: 238, y: 118, width: 70, height: 85 },
        { x: 205, y: 197, width: 138, height: 30 },
      ],
    },
    {
      no: 5,
      id: "mahawan",
      name: "Wat Mahawan",
      points: [
        { x: 60, y: 193, width: 100, height: 75 },
        { x: 55, y: 268, width: 110, height: 31 },
      ],
    },
    {
      no: 6,
      id: "khong-ruesi",
      name: "Wat Phra Khong Ruesi",
      points: [
        { x: 245, y: 254, width: 55, height: 90 },
        { x: 190, y: 335, width: 168, height: 35 },
      ],
    },
    {
      no: 7,
      id: "san-pa-yang",
      name: "Wat San Pa Yang Luang",
      points: [
        { x: 86, y: 334, width: 75, height: 75 },
        { x: 18, y: 405, width: 172, height: 30 },
      ],
    },
    {
      no: 8,
      id: "ku-chang",
      name: "Ku Chang Ku Ma",
      points: [
        { x: 223, y: 400, width: 85, height: 80 },
        { x: 198, y: 477, width: 133, height: 30 },
      ],
    },
    {
      no: 9,
      id: "muan-chai",
      name: "Muan Jai",
      points: [
        { x: 215, y: 593, width: 95, height: 60 },
        { x: 205, y: 647, width: 113, height: 32 },
      ],
    },
    {
      no: 10,
      id: "mai-thai",
      name: "Mai Thai",
      points: [
        { x: 85, y: 480, width: 85, height: 60 },
        { x: 50, y: 540, width: 155, height: 43 },
      ],
    },
  ],
  cn: [
    {
      no: 1,
      id: "hariphunchai",
      name: "哈里奔猜",
      points: [
        { x: 85, y: -117, width: 82, height: 87 },
        { x: 40, y: -30, width: 155, height: 32 },
      ],
    },
    {
      no: 2,
      id: "community",
      name: "社区博物馆",
      points: [
        { x: 240, y: -40, width: 110, height: 65 },
        { x: 227, y: 22, width: 140, height: 30 },
      ],
    },
    {
      no: 3,
      id: "chamthewi",
      name: "占玛เทวี",
      points: [
        { x: 80, y: 18, width: 80, height: 87 },
        { x: 35, y: 105, width: 177, height: 30 },
      ],
    },
    // {
    //   no: 4,
    //   id: "khuang",
    //   name: "千年庭院",
    //   points: [
    //     { x: 245, y: 125, width: 125, height: 60 },
    //     { x: 262, y: 185, width: 90, height: 30 },
    //   ],
    // },
    {
      no: 4,
      id: "wat-chamthewi",
      name: "扎玛特威寺",
      points: [
        { x: 256, y: 108, width: 70, height: 85 },
        { x: 247, y: 191, width: 92, height: 30 },
      ],
    },
    {
      no: 5,
      id: "mahawan",
      name: "马哈湾寺",
      points: [
        { x: 66, y: 190, width: 100, height: 75 },
        { x: 71, y: 265, width: 90, height: 31 },
      ],
    },
    {
      no: 6,
      id: "khong-ruesi",
      name: "空鲁西寺",
      points: [
        { x: 265, y: 254, width: 55, height: 90 },
        { x: 238, y: 340, width: 107, height: 35 },
      ],
    },
    {
      no: 7,
      id: "san-pa-yang",
      name: "圣巴扬寺",
      points: [
        { x: 92, y: 338, width: 75, height: 77 },
        { x: 74, y: 415, width: 112, height: 30 },
      ],
    },
    {
      no: 8,
      id: "ku-chang",
      name: "库常库玛",
      points: [
        { x: 240, y: 415, width: 85, height: 80 },
        { x: 217, y: 492, width: 131, height: 30 },
      ],
    },
    {
      no: 9,
      id: "muan-chai",
      name: "沐恩猜",
      points: [
        { x: 233, y: 618, width: 95, height: 62 },
        { x: 240, y: 680, width: 85, height: 32 },
      ],
    },
    {
      no: 10,
      id: "mai-thai",
      name: "泰丝学习中心",
      points: [
        { x: 89, y: 498, width: 88, height: 60 },
        { x: 74, y: 557, width: 120, height: 50 },
      ],
    },
  ],
};

// export const STATION_PIN_MAP: Record<
//   string,
//   { x: number; y: number; offsetX?: number; offsetY?: number }
// > = {
//   hariphunchai: { x: 195, y: 82, offsetX: -0.75, offsetY: 4 },
//   community: { x: 92, y: 165, offsetX: 2, offsetY: 2 },
//   chamthewi: { x: 300, y: 170, offsetX: -0.25, offsetY: 2 },
//   khuang: { x: 197, y: 245, offsetY: 2 },
//   "wat-chamthewi": { x: 115, y: 327, offsetY: 3 },
//   mahawan: { x: 217, y: 367, offsetX: 0.5, offsetY: 2.5 },
//   "khong-ruesi": { x: 247, y: 465, offsetX: -0.75, offsetY: 1 },
//   "san-pa-yang": { x: 90, y: 432, offsetX: 1, offsetY: 1.5 },
//   "ku-chang": { x: 110, y: 535, offsetX: 1, offsetY: 0 },
//   "muan-chai": { x: 325, y: 537, offsetX: -1, offsetY: 0 },
//   "mai-thai": { x: 327, y: 327, offsetX: -0.5, offsetY: 0 },
// };

// export const STATION_PIN_MAP: Record<
//   string,
//   { x: number; y: number; offsetX?: number; offsetY?: number }
// > = {
//   hariphunchai: { x: 118, y: 35, offsetX: -0.75, offsetY: 4 },
//   community: { x: 290, y: 80, offsetX: 1.5, offsetY: 2 },
//   chamthewi: { x: 130, y: 120, offsetX: -1.5, offsetY: 2 },
//   khuang: { x: 300, y: 195, offsetX: -1, offsetY: 2 },
//   "wat-chamthewi": { x: 125, y: 230, offsetX: -0.25, offsetY: 3 },
//   mahawan: { x: 290, y: 290, offsetX: -0.25, offsetY: 2.5 },
//   "khong-ruesi": { x: 130, y: 355, offsetX: -1.5, offsetY: 1 },
//   "san-pa-yang": { x: 275, y: 405, offsetX: 0.5, offsetY: 1.5 },
//   "ku-chang": { x: 120, y: 465, offsetX: 1.25, offsetY: 0 },
//   "muan-chai": { x: 120, y: 560, offsetX: -1.75, offsetY: 0 },
//   "mai-thai": { x: 295, y: 525, offsetY: 0 },
// };

export const STATION_PIN_MAP: Record<Lang, Record<string, StationPin>> = {
  th: {
    hariphunchai: { x: 118, y: 35, offsetX: -0.75, offsetY: 4 },
    community: { x: 290, y: 80, offsetX: 1.5, offsetY: 2 },
    chamthewi: { x: 130, y: 120, offsetX: -1.5, offsetY: 2 },
    // khuang: { x: 300, y: 195, offsetX: -1, offsetY: 2 },
    "wat-chamthewi": { x: 295, y: 190, offsetX: -0.75, offsetY: 3 },
    mahawan: { x: 115, y: 250, offsetX: -0.25, offsetY: 1 },
    "khong-ruesi": { x: 290, y: 290, offsetX: 0.25, offsetY: 2.5 },
    "san-pa-yang": { x: 123, y: 360, offsetX: 1.5, offsetY: 0 },
    "ku-chang": { x: 280, y: 405, offsetX: 0.5, offsetY: 1.5 },
    "muan-chai": { x: 280, y: 545, offsetX: 0.25, offsetY: 0 },
    "mai-thai": { x: 138, y: 465, offsetY: 0 },
  },
  en: {
    hariphunchai: { x: 111, y: 35, offsetX: -0.75, offsetY: 4 },
    community: { x: 270, y: 80, offsetX: 1.5, offsetY: 2 },
    chamthewi: { x: 125, y: 120, offsetX: -1.5, offsetY: 2 },
    // khuang: { x: 300, y: 195, offsetX: -1, offsetY: 2 },
    "wat-chamthewi": { x: 275, y: 190, offsetX: -0.75, offsetY: 3 },
    mahawan: { x: 110, y: 250, offsetX: -0.25, offsetY: 1 },
    "khong-ruesi": { x: 272, y: 290, offsetX: 0.25, offsetY: 2.5 },
    "san-pa-yang": { x: 116, y: 360, offsetX: 1.5, offsetY: 0 },
    "ku-chang": { x: 262, y: 405, offsetX: 0.5, offsetY: 1.5 },
    "muan-chai": { x: 261, y: 545, offsetX: 0.25, offsetY: 0 },
    "mai-thai": { x: 130, y: 465, offsetY: 0 },
  },
  cn: {
    hariphunchai: { x: 117, y: 35, offsetX: -0.75, offsetY: 4 },
    community: { x: 289, y: 80, offsetX: 1.5, offsetY: 2 },
    chamthewi: { x: 130, y: 120, offsetX: -1.5, offsetY: 2 },
    // khuang: { x: 300, y: 195, offsetX: -1, offsetY: 2 },
    "wat-chamthewi": { x: 295, y: 190, offsetX: -0.75, offsetY: 3 },
    mahawan: { x: 116, y: 250, offsetX: -0.25, offsetY: 1 },
    "khong-ruesi": { x: 290, y: 290, offsetX: 0.25, offsetY: 2.5 },
    "san-pa-yang": { x: 123, y: 360, offsetX: 1.5, offsetY: 0 },
    "ku-chang": { x: 280, y: 405, offsetX: 0.5, offsetY: 1.5 },
    "muan-chai": { x: 280, y: 545, offsetX: 0.25, offsetY: 0 },
    "mai-thai": { x: 138, y: 465, offsetY: 0 },
  },
};

export const MAP_WIDTH = 393;
export const MAP_HEIGHT = 615;

export const moreKeyMap = {
  store: "homepage.goToStore",
  activity: "homepage.goToActivity",
  toilet: "homepage.goToToilet",
};

export const ALL_TAGS: PlaceTag[] = ["cafe", "restaurant", "market", "other"];
