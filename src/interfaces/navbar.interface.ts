export interface INavbarMenuList {
  img: string;
  title: string;
  path: string;
  desc?: string;
  sf?: string;
}

export interface INavbarFooterMenuList {
  img: string;
  title: string;
  path: string;
}

export type NavbarMenuRecord = Record<"th" | "en" | "cn", INavbarMenuList[]>;

export type IContactMode = "emergency" | "news" | "line";

export type ITravelMode = "train" | "tram" | "other";

export type IRecommendMode = "goods" | "places" | "story";
