import { createContext } from "react";
import type { NavbarTitleContextType } from "../interfaces/navbar.interface";

export const NavbarTitleContext = createContext<NavbarTitleContextType>({
  overrideTitle: null,
  setOverrideTitle: () => {},
});
