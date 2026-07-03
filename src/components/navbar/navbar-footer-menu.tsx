import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { RootState } from "../../stores/stores";
import { webstateSlice } from "../../stores/slices/webstate-slice";
import { useDispatch, useSelector } from "react-redux";

export default function NavbarFooterMenu({
  title,
  imgUrl,
  path,
  setOpenMenu,
}: {
  title: string;
  imgUrl: string;
  path: string;
  setOpenMenu: (openMenu: boolean) => void;
}) {
  const navigate = useNavigate();
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
      className="relative text-[#543A14] w-full flex justify-start items-center gap-5 pl-1.5 py-4"
    >
      <div className="absolute bottom-0 min-h-1 w-[85%] left-1/2 -translate-1/2 border-b border-[#D9D9D9]" />
      <div className="min-w-9 min-h-9 w-9 h-9 ">
        <img
          style={{ filter: loaded || isNavbarLoad ? "none" : "blur(10px)" }}
          className="w-full h-full"
          src={imgUrl}
        />
      </div>

      <p className="text-[16px] font-semibold">{title}</p>
    </button>
  );
}
