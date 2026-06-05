import { useContext } from "react";
import { NavbarTitleContext } from "../contexts/navbar-title.context";

export const useNavbarTitle = () => useContext(NavbarTitleContext);
