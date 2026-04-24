import type { NavbarMenuRecord } from "../interfaces/navbar.interface";

export const menuList: NavbarMenuRecord = {
  th: [
    {
      title: "หน้าหลัก",
      path: "/app",
      img: "/icons/navbar/homepage.svg",
      sf: "homepage",
    },
    {
      title: "ของดี ที่เด่น เรื่องดัง",
      path: "/app/recommend",
      img: "/icons/navbar/recommend.svg",
      sf: "goods",
    },
    {
      title: "การเดินทาง",
      path: "/app/travel",
      img: "/icons/navbar/travel.svg",
      desc: "เดินทางจากเชียงใหม่ - ลำพูน",
      sf: "travel",
    },
    {
      title: "กลุ่มผลิตโคม",
      path: "/app/komepage",
      img: "/icons/navbar/kome.svg",
      sf: "kome",
    },
    // {
    //   title: "วารสารท่องเที่ยวลำพูน",
    //   path: "https://drive.google.com/drive/mobile/folders/18mEFDvtKv33Fc6bNdzOOTjiBmdGSbcbH?usp=share_link",
    //   img: "/icons/navbar/shop.svg",
    //   sf: "tbook",
    // },
  ],
  en: [
    {
      title: "Homepage",
      path: "/app/homepage",
      img: "/icons/navbar/homepage.svg",
      sf: "homepage",
    },
    {
      title: "Best of the best, outstanding, and famous",
      path: "/app/recommend",
      img: "/icons/navbar/recommend.svg",
      sf: "goods",
    },
    {
      title: "Lamphun Travel",
      path: "/app/travel",
      img: "/icons/navbar/travel.svg",
      desc: "Travel from Chiang Mai to Lamphun",
      sf: "travel",
    },
    {
      title: "Lantern Production Groups",
      path: "/app/komepage",
      img: "/icons/navbar/kome.svg",
      sf: "kome",
    },
    // {
    //   title: "Lamphun Travel Magazine",
    //   path: "https://drive.google.com/drive/mobile/folders/18mEFDvtKv33Fc6bNdzOOTjiBmdGSbcbH?usp=share_link",
    //   img: "/icons/navbar/shop.svg",
    //   sf: "tbook",
    // },
  ],
  cn: [
    {
      title: "首页",
      path: "/app/homepage",
      img: "/icons/navbar/homepage.svg",
      sf: "homepage",
    },
    {
      title: "精品，著名景点，名人",
      path: "/app/recommend",
      img: "/icons/navbar/recommend.svg",
      sf: "goods",
    },
    {
      title: "旅行",
      path: "/app/travel",
      img: "/icons/navbar/travel.svg",
      desc: "线路",
      sf: "travel",
    },
    {
      title: "灯笼制作群体",
      path: "/app/komepage",
      img: "/icons/navbar/kome.svg",
      sf: "kome",
    },
    // {
    //   title: "南奔府旅游杂志",
    //   path: "https://drive.google.com/drive/mobile/folders/18mEFDvtKv33Fc6bNdzOOTjiBmdGSbcbH?usp=share_link",
    //   img: "/icons/navbar/shop.svg",
    //   sf: "tbook",
    // },
  ],
};

export const footerList: NavbarMenuRecord = {
  th: [
    {
      path: "https://online.anyflip.com/nnowl/awei/mobile/index.html",
      img: "/icons/navbar/download.svg",
      title: "ดาวน์โหลดเอกสารท่องเที่ยว",
    },
    {
      path: "/app/contact",
      img: "/icons/navbar/phone.svg",
      title: "ติดต่อเรา / ข้อเสนอแนะ",
    },
    {
      path: "https://ruamkhai.com/",
      img: "/icons/navbar/ruamkhai-icon.svg",
      title: "ไปยัง Platform Ruamkhai",
    },
  ],
  en: [
    {
      path: "https://online.anyflip.com/nnowl/awei/mobile/index.html",
      img: "/icons/navbar/download.svg",
      title: "4-Hour Lamphun Travel Guide",
    },
    {
      path: "/app/contact",
      img: "/icons/navbar/phone.svg",
      title: "Contact / Feedback",
    },
    {
      path: "https://ruamkhai.com/",
      img: "/icons/navbar/ruamkhai-icon.svg",
      title: "Go to Ruamkhai Platform",
    },
  ],
  cn: [
    {
      path: "https://online.anyflip.com/nnowl/awei/mobile/index.html",
      img: "/icons/navbar/download.svg",
      title: "旅游指南南奔下载",
    },
    {
      path: "/app/contact",
      img: "/icons/navbar/phone.svg",
      title: "联系方式/提出意见",
    },
    {
      path: "https://ruamkhai.com/",
      img: "/icons/navbar/ruamkhai-icon.svg",
      title: "进入 Ruankhai",
    },
  ],
};

export const pageTitleMap: Record<
  "th" | "en" | "cn",
  Record<string, string>
> = {
  th: {
    homepage: "หน้าหลัก",
    goods: "ของดี ที่เด่น เรื่องดัง",
    travel: "การเดินทาง",
    kome: "กลุ่มผลิตโคม",
    tbook: "วารสาร",
    contact: "ติดต่อเรา",
  },
  en: {
    homepage: "Homepage",
    goods: "Best of Lamphun",
    travel: "Travel",
    kome: "Lantern Groups",
    tbook: "Magazine",
    contact: "Contact",
  },
  cn: {
    homepage: "首页",
    goods: "精品景点",
    travel: "旅行",
    kome: "灯笼制作",
    tbook: "旅游杂志",
    contact: "联系方式",
  },
};

export const subtitleMap: Record<"th" | "en" | "cn", string> = {
  th: "ท่องเที่ยวลำพูน",
  en: "Visit Lamphun",
  cn: "游览南奔",
};
