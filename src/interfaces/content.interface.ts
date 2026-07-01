export interface MLString {
  th: string;
  en: string;
  cn: string;
}

export interface RecommendItem {
  id: string;
  title: MLString;
  desc: MLString;
  img: string;
}

export interface KomeItem {
  id: string;
  name: MLString;
  phone: string;
}

export type Direction = "CNX_LPH" | "LPH_CNX";

export interface TrainItem {
  id: string;
  origin: MLString;
  destination: MLString;
  originTime: string;
  destinationTime: string;
  originStation: MLString;
  destinationStation: MLString;
  price: number;
  desc: MLString;
  day: "weekday" | "weekend" | "everyday";
}

export interface TramItem {
  id: string;
  place: MLString;
  round: "morning" | "afternoon";
  originTime: string;
  destinationTime: string;
  price: number;
}

export interface OtherItem {
  id: string;
  image: string;
  place: MLString;
  boardingPoint: MLString;
  route: MLString;
  departureTime: MLString;
  price: number;
  type: "van" | "tricycle" | "songthaew" | "motorcycle";
  phone?: string;
  link: string;
  lineLink?: string;
  day: "weekday" | "weekend";
}

export interface PhoneEntry {
  label: MLString;
  number: string;
  ext?: string;
}

export interface EmergencyItem {
  id: string;
  header: MLString;
  address: MLString;
  openTime?: string;
  closeTime?: string;
  phones: PhoneEntry[];
}

export interface StationPopupData {
  header: MLString;
  desc: MLString;
  img: string;
  openTime?: string;
  closeTime?: string;
  phone?: string;
  location?: string;
}

export type CardType = "van" | "tricycle" | "songthaew" | "motorcycle";
