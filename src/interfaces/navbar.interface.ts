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
