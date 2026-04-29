import { useTranslation } from "react-i18next";
import type { Tab } from "../interfaces/admin.interface";
import type {
  OtherItem,
  TrainItem,
  TramItem,
} from "../interfaces/content.interface";
import type {
  IRecommendMode,
  ITravelMode,
} from "../interfaces/navbar.interface";
import { STATION_ID_MAP } from "./homepage";

export function useRecommendModes(): { value: IRecommendMode; label: string }[] {
  const { t } = useTranslation();
  return [
    { value: "goods", label: t("recommend.goods") },
    { value: "places", label: t("recommend.places") },
    { value: "story", label: t("recommend.story") },
  ];
}

export function useTravelModes(): { value: ITravelMode; label: string }[] {
  const { t } = useTranslation();
  return [
    { value: "train", label: t("travel.train") },
    { value: "tram", label: t("travel.tram") },
    { value: "other", label: t("travel.other") },
  ];
}

export const EMPTY_TRAIN: Omit<TrainItem, "id"> = {
  origin: "",
  destination: "",
  originTime: "",
  destinationTime: "",
  originStation: "",
  destinationStation: "",
  price: 0,
  desc: "",
  day: "weekday",
};

export const EMPTY_RECOMMEND = {
  titleTh: "",
  titleEn: "",
  titleCn: "",
  descTh: "",
  descEn: "",
  descCn: "",
};

export const EMPTY_KOME = { name: "", phone: "" };

export const EMPTY_CONTACT = {
  header: "",
  address: "",
  hours: "",
  phones: [""],
};

export const TABS: { value: Tab; label: string }[] = [
  { value: "places", label: "สถานที่" },
  { value: "recommend", label: "แนะนำ" },
  { value: "kome", label: "โคมไฟ" },
  { value: "travel", label: "เดินทาง" },
  { value: "contact", label: "ติดต่อ" },
];

export const EMPTY_FORM = { nameTh: "", nameEn: "", nameCn: "", link: "" };

export const STATION_IDS = Object.values(STATION_ID_MAP);

export const inputCls =
  "border border-[#C6C6C6] rounded-xl px-3 py-2 text-[13px] text-[#543A14] outline-none placeholder:text-[#C6C6C6] w-full";

export const EMPTY_TRAM: Omit<TramItem, "id"> = {
  place: "",
  time: "",
  price: 0,
};

export const EMPTY_OTHER: Omit<OtherItem, "id"> = {
  place: "",
  desc: "",
  desc2: "",
  type: "bus",
  phone: "",
  link: "",
  day: "weekday",
};

export const typeLabel = (t: OtherItem["type"]) =>
  t === "bus" ? "รถบัส" : t === "tricycle" ? "สามล้อ" : "สองแถว";
