import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="relative w-full h-svh flex justify-center">
      <div className="w-full max-w-107.5">
        <Outlet />
      </div>
    </div>
  );
}
