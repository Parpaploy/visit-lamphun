import { Navigate, Outlet, useLocation } from "react-router-dom";
import DriverNavbar from "../components/navbar/driver-navbar";
import { useCallback, useRef } from "react";

export default function DriverLayout() {
  const isLoggedIn = localStorage.getItem("driver_logged_in");
  const location = useLocation();
  const isRoadmap = location.pathname === "/driver/roadmap";

  const watchIdRef = useRef<number | null>(null);

  const stopGps = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/driver/login" replace />;
  }

  return (
    <div
      className={`h-svh w-full flex flex-col items-center overflow-hidden ${
        isRoadmap ? "bg-[linear-gradient(68deg,#FC8B32_0%,#FBC859_100%)]" : ""
      }`}
    >
      {isRoadmap ? (
        <DriverNavbar stopGps={stopGps} />
      ) : (
        <div className="w-full sticky top-0 z-1000 flex justify-center">
          <DriverNavbar stopGps={stopGps} />
        </div>
      )}
      <div
        className={`w-full max-w-107.5 mx-auto flex-1 overflow-y-auto overflow-x-hidden ${
          isRoadmap ? "mt-[7svh] max-h-[93svh]" : ""
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}
