import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { RootState } from "../../stores/stores";
import { webstateSlice } from "../../stores/slices/webstate-slice";
import { useDispatch, useSelector } from "react-redux";

export default function NavbarMenuBtn({
  title,
  desc,
  imgUrl,
  path,
  setOpenMenu,
}: {
  title: string;
  desc?: string;
  imgUrl: string;
  path: string;
  setOpenMenu: (openMenu: boolean) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const size = path.split(".")[1] ? "external" : "internal";
  const dispatch = useDispatch();
  const isNavbarLoad = useSelector(
    (state: RootState) => state.webstateSlice.isNavbarLoad,
  );
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (isNavbarLoad) {
      return;
    }
    const timer = setTimeout(() => {
      dispatch(webstateSlice.actions.setNavbarLoaded());
      setLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [dispatch, isNavbarLoad]);

  return (
    <button
      onClick={() => {
        //saveFile();
        if (size === "external") {
          window.open(path, "_blank");
          setOpenMenu(false);
          return;
        }
        navigate(path);
        setOpenMenu(false);
      }}
      className={`${location.pathname === path ? "bg-[#FEEABB] text-[#BF4B17]" : "bg-white text-[#543A14]"} w-full flex justify-start items-center gap-10 border-2 border-[#D9D9D9] rounded-full p-1`}
    >
      <div className="w-12 h-12">
        <img
          style={{ filter: loaded || isNavbarLoad ? "none" : "blur(10px)" }}
          className="w-full h-full"
          src={imgUrl}
        />
      </div>

      <div className="flex flex-col justify-center items-start">
        <p className="text-[16px] font-semibold text-start">{title}</p>
        {desc && (
          <p className="text-[12px] text-[#757575] font-normal -mt-1">{desc}</p>
        )}
      </div>
    </button>
  );
}
