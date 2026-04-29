import type {
  EmergencyItem,
  KomeItem,
  OtherItem,
  RecommendItem,
  TrainItem,
  TramItem,
} from "./content.interface";

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

export type Tab = "places" | "recommend" | "kome" | "travel" | "contact";

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
