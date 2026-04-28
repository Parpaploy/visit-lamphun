import type { Location } from "../interfaces/homepage.interface";

export const BG_MAP: Record<string, string> = {
  th: "/images/homepage/th-bg.svg",
  en: "/images/homepage/en-bg.svg",
  cn: "/images/homepage/cn-bg.svg",
};

export const hitboxData: Record<string, Location[]> = {
  th: [
    {
      no: 1,
      id: "hariphunchai",
      name: "หริภุญชัย",
      points: [
        { x: 156, y: 45, width: 78, height: 75 },
        { x: 125, y: 115, width: 140, height: 30 },
      ],
    },
    {
      no: 2,
      id: "community",
      name: "ชุมชนเมือง",
      points: [
        { x: 50, y: 140, width: 85, height: 50 },
        { x: 25, y: 190, width: 140, height: 25 },
      ],
    },
    {
      no: 3,
      id: "chamthewi",
      name: "จามเทวี",
      points: [
        { x: 275, y: 135, width: 50, height: 70 },
        { x: 230, y: 200, width: 150, height: 25 },
      ],
    },
    {
      no: 4,
      id: "khuang",
      name: "ข่วงพันปี",
      points: [
        { x: 155, y: 220, width: 85, height: 50 },
        { x: 135, y: 270, width: 135, height: 30 },
      ],
    },
    {
      no: 5,
      id: "wat-chamthewi",
      name: "วัดจามเทวี",
      points: [
        { x: 85, y: 295, width: 60, height: 65 },
        { x: 65, y: 360, width: 90, height: 25 },
      ],
    },
    {
      no: 6,
      id: "mahawan",
      name: "วัดมหาวัน",
      points: [
        { x: 180, y: 340, width: 75, height: 55 },
        { x: 175, y: 395, width: 90, height: 25 },
      ],
    },
    {
      no: 7,
      id: "khong-ruesi",
      name: "คงฤาษี",
      points: [
        { x: 220, y: 430, width: 55, height: 70 },
        { x: 185, y: 490, width: 115, height: 30 },
      ],
    },
    {
      no: 8,
      id: "san-pa-yang",
      name: "สันป่ายางหลวง",
      points: [
        { x: 53, y: 400, width: 75, height: 65 },
        { x: 30, y: 460, width: 120, height: 25 },
      ],
    },
    {
      no: 9,
      id: "ku-chang",
      name: "กู่ช้าง กู่ม้า",
      points: [
        { x: 70, y: 500, width: 80, height: 70 },
        { x: 70, y: 565, width: 85, height: 25 },
      ],
    },
    {
      no: 10,
      id: "muan-chai",
      name: "ม่วนใจ๋",
      points: [
        { x: 285, y: 510, width: 80, height: 55 },
        { x: 240, y: 560, width: 150, height: 45 },
      ],
    },
    {
      no: 11,
      id: "mai-thai",
      name: "ไหมไทย",
      points: [
        { x: 290, y: 300, width: 75, height: 55 },
        { x: 275, y: 355, width: 115, height: 30 },
      ],
    },
  ],
  en: [
    {
      no: 1,
      id: "hariphunchai",
      name: "Hariphunchai",
      points: [
        { x: 156, y: 45, width: 78, height: 75 },
        { x: 110, y: 115, width: 170, height: 25 },
      ],
    },
    {
      no: 2,
      id: "community",
      name: "Community Museum",
      points: [
        { x: 50, y: 140, width: 85, height: 50 },
        { x: 30, y: 190, width: 140, height: 35 },
      ],
    },
    {
      no: 3,
      id: "chamthewi",
      name: "Chamthewi Statue",
      points: [
        { x: 275, y: 135, width: 50, height: 70 },
        { x: 230, y: 200, width: 150, height: 30 },
      ],
    },
    {
      no: 4,
      id: "khuang",
      name: "Khuang Phan Pi",
      points: [
        { x: 155, y: 220, width: 85, height: 50 },
        { x: 135, y: 270, width: 155, height: 30 },
      ],
    },
    {
      no: 5,
      id: "wat-chamthewi",
      name: "Wat Chamthewi",
      points: [
        { x: 85, y: 295, width: 60, height: 65 },
        { x: 60, y: 360, width: 115, height: 25 },
      ],
    },
    {
      no: 6,
      id: "mahawan",
      name: "Wat Mahawan",
      points: [
        { x: 180, y: 340, width: 75, height: 55 },
        { x: 175, y: 395, width: 90, height: 25 },
      ],
    },
    {
      no: 7,
      id: "khong-ruesi",
      name: "Wat Phra Khong Ruesi",
      points: [
        { x: 220, y: 430, width: 55, height: 70 },
        { x: 180, y: 490, width: 110, height: 30 },
      ],
    },
    {
      no: 8,
      id: "san-pa-yang",
      name: "Wat San Pa Yang Luang",
      points: [
        { x: 53, y: 400, width: 75, height: 65 },
        { x: 40, y: 460, width: 145, height: 25 },
      ],
    },
    {
      no: 9,
      id: "ku-chang",
      name: "Ku Chang Ku Ma",
      points: [
        { x: 70, y: 500, width: 80, height: 70 },
        { x: 55, y: 560, width: 115, height: 30 },
      ],
    },
    {
      no: 10,
      id: "muan-chai",
      name: "Muan Jai",
      points: [
        { x: 285, y: 510, width: 80, height: 55 },
        { x: 240, y: 560, width: 150, height: 45 },
      ],
    },
    {
      no: 11,
      id: "mai-thai",
      name: "Mai Thai",
      points: [
        { x: 290, y: 300, width: 75, height: 55 },
        { x: 270, y: 355, width: 120, height: 30 },
      ],
    },
  ],
  cn: [
    {
      no: 1,
      id: "hariphunchai",
      name: "哈里奔猜",
      points: [
        { x: 156, y: 45, width: 78, height: 75 },
        { x: 135, y: 115, width: 120, height: 25 },
      ],
    },
    {
      no: 2,
      id: "community",
      name: "社区博物馆",
      points: [
        { x: 50, y: 140, width: 85, height: 50 },
        { x: 40, y: 190, width: 110, height: 30 },
      ],
    },
    {
      no: 3,
      id: "chamthewi",
      name: "占玛เทวี",
      points: [
        { x: 275, y: 135, width: 50, height: 70 },
        { x: 235, y: 200, width: 140, height: 30 },
      ],
    },
    {
      no: 4,
      id: "khuang",
      name: "千年庭院",
      points: [
        { x: 155, y: 220, width: 85, height: 50 },
        { x: 135, y: 270, width: 125, height: 30 },
      ],
    },
    {
      no: 5,
      id: "wat-chamthewi",
      name: "扎玛特威寺",
      points: [
        { x: 85, y: 295, width: 60, height: 65 },
        { x: 70, y: 360, width: 80, height: 25 },
      ],
    },
    {
      no: 6,
      id: "mahawan",
      name: "马哈湾寺",
      points: [
        { x: 180, y: 340, width: 75, height: 55 },
        { x: 175, y: 395, width: 90, height: 25 },
      ],
    },
    {
      no: 7,
      id: "khong-ruesi",
      name: "空鲁西寺",
      points: [
        { x: 220, y: 430, width: 55, height: 70 },
        { x: 205, y: 495, width: 80, height: 30 },
      ],
    },
    {
      no: 8,
      id: "san-pa-yang",
      name: "圣巴扬寺",
      points: [
        { x: 53, y: 400, width: 75, height: 65 },
        { x: 50, y: 465, width: 85, height: 25 },
      ],
    },
    {
      no: 9,
      id: "ku-chang",
      name: "库常库玛",
      points: [
        { x: 70, y: 500, width: 80, height: 70 },
        { x: 55, y: 560, width: 110, height: 30 },
      ],
    },
    {
      no: 10,
      id: "muan-chai",
      name: "沐恩猜",
      points: [
        { x: 285, y: 510, width: 80, height: 55 },
        { x: 240, y: 560, width: 140, height: 45 },
      ],
    },
    {
      no: 11,
      id: "mai-thai",
      name: "泰丝学习中心",
      points: [
        { x: 290, y: 300, width: 75, height: 55 },
        { x: 260, y: 350, width: 120, height: 30 },
      ],
    },
  ],
};
