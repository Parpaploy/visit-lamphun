import { useState } from "react";
import type { ReactNode } from "react";
import { NavbarTitleContext } from "./navbar-title.context";

export function NavbarTitleProvider({ children }: { children: ReactNode }) {
  const [overrideTitle, setOverrideTitle] = useState<string | null>(null);
  return (
    <NavbarTitleContext.Provider value={{ overrideTitle, setOverrideTitle }}>
      {children}
    </NavbarTitleContext.Provider>
  );
}
