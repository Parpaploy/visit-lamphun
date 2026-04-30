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
  day: "weekday" | "weekend";
}

export interface TramItem {
  id: string;
  place: MLString;
  time: string;
  price: number;
}

export interface OtherItem {
  id: string;
  place: MLString;
  desc: MLString;
  desc2: MLString;
  type: "bus" | "tricycle" | "songthaew";
  phone: string;
  link: string;
  day: "weekday" | "weekend";
}

export interface EmergencyItem {
  id: string;
  header: MLString;
  address: MLString;
  hours: MLString;
  phones: string[];
}

export interface StationPopupData {
  header: MLString;
  desc: MLString;
  img: string;
}
