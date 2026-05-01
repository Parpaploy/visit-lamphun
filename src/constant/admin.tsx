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

const EMPTY_ML = { th: "", en: "", cn: "" };

export const EMPTY_TRAIN: Omit<TrainItem, "id"> = {
  origin: { ...EMPTY_ML },
  destination: { ...EMPTY_ML },
  originTime: "",
  destinationTime: "",
  originStation: { ...EMPTY_ML },
  destinationStation: { ...EMPTY_ML },
  price: 0,
  desc: { ...EMPTY_ML },
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

export const EMPTY_KOME = { name: { ...EMPTY_ML }, phone: "" };

export const EMPTY_CONTACT = {
  header: { ...EMPTY_ML },
  address: { ...EMPTY_ML },
  hours: { ...EMPTY_ML },
  phones: [{ label: { ...EMPTY_ML }, number: "" }],
};

export function useTabs(): { value: Tab; label: string }[] {
  const { t } = useTranslation();
  return [
    { value: "places", label: t("dashboard.tabs.places") },
    { value: "recommend", label: t("dashboard.tabs.recommend") },
    { value: "kome", label: t("dashboard.tabs.kome") },
    { value: "travel", label: t("dashboard.tabs.travel") },
    { value: "contact", label: t("dashboard.tabs.contact") },
    { value: "popup", label: t("dashboard.tabs.popup") },
  ];
}

export const EMPTY_FORM = { nameTh: "", nameEn: "", nameCn: "", link: "" };

export const STATION_IDS = Object.values(STATION_ID_MAP);

export const inputCls =
  "border border-[#C6C6C6] rounded-xl px-3 py-2 text-[13px] text-[#543A14] outline-none placeholder:text-[#C6C6C6] w-full";

export const EMPTY_TRAM: Omit<TramItem, "id"> = {
  place: { ...EMPTY_ML },
  round: "morning",
  time: "",
  price: 0,
};

export const EMPTY_OTHER: Omit<OtherItem, "id"> = {
  place: { ...EMPTY_ML },
  desc: { ...EMPTY_ML },
  desc2: { ...EMPTY_ML },
  type: "van",
  phone: "",
  link: "",
  lineLink: "",
  day: "weekday",
};
