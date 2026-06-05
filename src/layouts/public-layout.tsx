import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/navbar/navbar";
import { startLocationTracking } from "../utils/heatmap";
import { NavbarTitleProvider } from "../contexts/navbar-title.provider";

export default function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    const isLanding = location.pathname === "/";
    let cleanupFunc: (() => void) | undefined;
    if (!isLanding) {
      cleanupFunc = startLocationTracking();
    }
    return () => {
      if (cleanupFunc) cleanupFunc();
    };
  }, [location.pathname]);

  return (
    <NavbarTitleProvider>
      <div
        className={`h-svh w-full mx-auto max-w-107.5 flex flex-col items-center overflow-hidden ${
          location.pathname === "/app"
            ? "bg-[linear-gradient(68deg,#C07349_0%,#FC8B32_50%,#FBC859_100%)]"
            : location.pathname.startsWith("/app/")
              ? "bg-white"
              : "bg-[linear-gradient(-181deg,#FFE2A5_0%,#FBFCF0_22%,#FBFCF0_62%,#E6EFD8_100%)]"
        }`}
      >
        <div className="w-full sticky top-0 z-1000 flex justify-center">
          <Navbar />
        </div>
        <div className="w-full max-h-[93svh] mt-[7svh] flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </NavbarTitleProvider>
  );
}
