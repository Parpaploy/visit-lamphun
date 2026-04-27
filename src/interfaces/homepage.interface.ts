interface HitboxPoint {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Location {
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
