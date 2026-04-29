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
  name: string;
  phone: string;
}

export interface TrainItem {
  id: string;
  origin: string;
  destination: string;
  originTime: string;
  destinationTime: string;
  originStation: string;
  destinationStation: string;
  price: number;
  desc: string;
  day: "weekday" | "weekend";
}

export interface TramItem {
  id: string;
  place: string;
  time: string;
  price: number;
}

export interface OtherItem {
  id: string;
  place: string;
  desc: string;
  desc2: string;
  type: "bus" | "tricycle" | "songthaew";
  phone: string;
  link: string;
  day: "weekday" | "weekend";
}

export interface EmergencyItem {
  id: string;
  header: string;
  address: string;
  hours: string;
  phones: string[];
}
