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
};

export type Tab =
  // | "places"
  // | "activities"
  // | "toilets"
  "station" | "recommend" | "kome" | "travel" | "contact" | "heatmap";

export type ContactEditState = EmergencyItem & { saving: boolean };

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
