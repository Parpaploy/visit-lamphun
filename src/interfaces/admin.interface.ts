import { STATION_COORDS } from "../utils/heatmap";
import type {
  EmergencyItem,
  KomeItem,
  OtherItem,
  RecommendItem,
  TrainItem,
  TramItem,
} from "./content.interface";
import type { TransportType } from "./stat.interface";

export type PlaceEditState = {
  id: string;
  nameTh: string;
  nameEn: string;
  nameCn: string;
  link: string;
  tag: string;
  openTime: string;
  closeTime: string;
  phone: string;
  img: string;
  newFile: File | null;
  previewUrl: string | null;
  saving: boolean;
};

export type EditState = {
  id: string;
  nameTh: string;
  nameEn: string;
  nameCn: string;
  link: string;
  img: string;
  newFile: File | null;
  previewUrl: string | null;
  saving: boolean;
  openTime: string;
  closeTime: string;
  phone: string;
  location: string;
};

export type Tab =
  // | "places"
  // | "activities"
  // | "toilets"
  "station" | "recommend" | "kome" | "travel" | "contact" | "heatmap";

export interface ContactEditState extends EmergencyItem {
  saving: boolean;
  openTime: string;
  closeTime: string;
}

export type KomeEditState = KomeItem & { saving: boolean };

export type RecommendEditState = RecommendItem & {
  newFile: File | null;
  previewUrl: string | null;
  saving: boolean;
};

export type TrainEdit = TrainItem & { saving: boolean };

export type TramEdit = TramItem & { saving: boolean };

export type OtherEdit = OtherItem & { saving: boolean };

export interface CellData {
  count: number;
  lastTime: string;
  lastTimestamp?: number;
}

export interface HeatmapRecord {
  uid: string;
  stationId: string;
  timestamp: number;
  distance: number;
  transportType: TransportType;
}

export interface CellData {
  count: number;
  lastTime: string;
}

export type StationId = keyof typeof STATION_COORDS;

export type FilterType = "all" | "today" | "custom";

export interface HeatmapTableProps {
  title: string;
  grid: Record<string, Record<string, CellData>>;
  maxValue: number;
  lang: "th" | "en" | "cn";
  stationIds: StationId[];
  onCellMouseEnter: (
    e: React.MouseEvent,
    stationName: string,
    slot: string,
    cell: CellData,
  ) => void;
  onCellMouseLeave: () => void;
}

export type OtherFieldVisibility = {
  route: boolean;
  departureTime: boolean;
  price: boolean;
  phone: boolean;
  lineLink: boolean;
};

export type OtherFormData = Omit<OtherItem, "id">;
