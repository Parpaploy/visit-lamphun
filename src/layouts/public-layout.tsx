import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/navbar/navbar";
import { recordUserLocation } from "../utils/heatmap";

export default function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    const isLanding = location.pathname === "/";
    if (!isLanding) {
      recordUserLocation();
    }
  }, [location.pathname]);

  return (
    <div className="h-svh w-full flex flex-col items-center overflow-hidden">
      <div className="w-full sticky top-0 z-1000 flex justify-center">
        <Navbar />
      </div>
      <div className="w-full max-w-107.5 flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
