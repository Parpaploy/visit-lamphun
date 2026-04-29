interface HitboxPoint {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Location {
  no: number;
  id: string;
  name: string;
  points: HitboxPoint[];
}

export interface IStationMode {
  mode:
    | "hariphunchai"
    | "community"
    | "chamthewi"
    | "khuang"
    | "wat-chamthewi"
    | "mahawan"
    | "mai-thai"
    | "san-pa-yang"
    | "khong-ruesi"
    | "ku-chang"
    | "muan-chai";
}

export type stationNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface StationPlaceName {
  th: string;
  en: string;
  cn: string;
}

export interface StationPlace {
  id: string;
  name: StationPlaceName;
  img: string;
  link: string;
}
