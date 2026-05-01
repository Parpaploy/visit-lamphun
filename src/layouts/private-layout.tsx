import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/navbar";

export default function PrivateLayout() {
  return (
    <div className="relative w-full h-svh flex justify-center">
      <div className="w-full sticky top-0 z-1000 flex justify-center">
        <Navbar />
      </div>

      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
