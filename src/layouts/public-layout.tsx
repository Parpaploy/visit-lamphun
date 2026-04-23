import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/navbar";

export default function PublicLayout() {
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
