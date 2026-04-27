import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../constant/language";
import { IoMenu } from "react-icons/io5";
import NavbarMenuBtn from "./navbar-menu-btn";

import type {
  INavbarFooterMenuList,
  INavbarMenuList,
} from "../../interfaces/navbar.interface";
import NavbarFooterMenu from "./navbar-footer-menu";
import {
  footerList,
  menuList,
  pageTitleMap,
  subtitleMap,
} from "../../constant/navbar-menu";

export default function Navbar() {
  const { i18n, t } = useTranslation();

  const navigation = useNavigate();

  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [menuReady, setMenuReady] = useState<boolean>(false);
  const [langReady, setLangReady] = useState<boolean>(false);

  useEffect(() => {
    if (!openMenu) return;
    const timer = setTimeout(() => setMenuReady(true), 350);
    return () => {
      clearTimeout(timer);
      setMenuReady(false);
    };
  }, [openMenu]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => setLangReady(true), 300);
    return () => {
      clearTimeout(timer);
      setLangReady(false);
    };
  }, [open]);

  const current =
    LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const lang = (i18n.language in pageTitleMap ? i18n.language : "th") as
    | "th"
    | "en"
    | "cn";

  const matched = menuList.th.find((item) => {
    if (item.path.startsWith("http")) return false;
    if (item.path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(item.path);
  });
  const sf =
    matched?.sf ??
    (location.pathname.includes("contact") ? "contact" : "homepage");

  const pageTitle = pageTitleMap[lang]?.[sf] ?? pageTitleMap.th[sf];
  const subtitle = subtitleMap[lang];

  return (
    <div className="w-full max-w-107.5 relative z-999">
      <div className="shadow-[0_4px_10px_0_rgba(0,0,0,0.12)] bg-[linear-gradient(68deg,#C07349_0%,#FC8B32_50%,#FBC859_100%)] w-full h-[15svh] px-3.75 pt-1.25 flex justify-between items-center">
        <div className="flex justify-center items-center gap-x-2">
          <div
            className="h-19 w-19"
            onClick={() => {
              navigation("/app");
            }}
          >
            <img src="/icons/logo.svg" className="h-full w-full" />
          </div>
          <div className="flex flex-col items-start justify-center">
            <h2 className="text-white text-[15px] font-medium mb-1">
              {subtitle}
            </h2>
            <h1 className="text-[#543A14] text-[20px] font-bold leading-7">
              {pageTitle}
            </h1>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2.5">
          <button
            className="bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-full w-8.5 h-8.5"
            onClick={() => setOpen((v) => !v)}
          >
            <img
              src={current.icon}
              className="w-full h-full rounded-full object-cover"
            />
          </button>

          <button
            className={`transition-all ${openMenu ? "text-white" : "text-[#75521F]"}`}
            onClick={() => setOpenMenu((v) => !v)}
          >
            <IoMenu size={42} />
          </button>
        </div>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-990" onClick={() => setOpen(false)} />
          <div className="flex min-h-[23svh] fixed left-1/2 -translate-x-1/2 top-[calc(15svh)] z-999 bg-white rounded-b-xl shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] py-2 w-full">
            <svg
              className="absolute -top-5 right-16 w-10 h-7"
              viewBox="0 0 30 20"
              fill="white"
            >
              <path
                d="M5 20 L15 5 L25 20 Z"
                stroke="white"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </svg>
            {!langReady
              ? Array.from({ length: LANGUAGES.length }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full flex flex-col items-center gap-3 px-4 py-2.5 animate-pulse"
                  >
                    <div className="w-21 h-21 rounded-full bg-gray-200 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                    <div className="h-3 w-8 rounded bg-gray-200" />
                  </div>
                ))
              : LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setOpen(false);
                    }}
                    className={`w-full flex flex-col items-center gap-3 px-4 py-2.5 transition-all ${
                      i18n.language === lang.code ? "font-medium" : "opacity-50"
                    }`}
                  >
                    <img
                      src={lang.icon}
                      className={`w-21 h-21 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-full ${
                        i18n.language === lang.code
                          ? "ring-3 ring-[#A1D6F5]/70"
                          : ""
                      }`}
                    />
                    <span className="text-[12px]">{lang.label}</span>
                  </button>
                ))}
          </div>
        </>
      )}

      {openMenu && (
        <>
          <div
            className="fixed inset-0 z-990"
            onClick={() => setOpenMenu(false)}
          />
          <div className="min-h-[68svh] max-h-[78svh] px-7 flex fixed left-1/2 -translate-x-1/2 top-[calc(15svh)] z-998 bg-white rounded-b-xl shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] w-full">
            <svg
              className="absolute -top-5 right-4 w-10 h-7"
              viewBox="0 0 30 20"
              fill="white"
            >
              <path
                d="M5 20 L15 5 L25 20 Z"
                stroke="white"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </svg>

            <div className="z-999 overflow-y-auto w-full flex flex-col justify-start items-start gap-2 pt-4 pb-1">
              {!menuReady ? (
                <>
                  <div className="flex justify-start items-start gap-1 animate-pulse">
                    <div className="w-3 h-3 rounded bg-gray-200" />
                    <div className="h-2.5 w-24 rounded bg-gray-200" />
                  </div>

                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full flex justify-start items-center gap-10 border-2 border-[#D9D9D9] rounded-full p-1 animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                      <div className="flex flex-col gap-1.5">
                        <div className="h-4 w-32 rounded bg-gray-200" />
                        <div className="h-3 w-20 rounded bg-gray-200" />
                      </div>
                    </div>
                  ))}

                  <div className="w-full mt-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-full flex justify-start items-center gap-5 border-t border-[#D9D9D9] pl-10 py-3 animate-pulse"
                      >
                        <div className="w-6.5 h-6.5 rounded-full bg-gray-200 shrink-0" />
                        <div className="h-4 w-28 rounded bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-start items-start gap-1">
                    <div className="w-3 h-auto">
                      <img src="/icons/navbar/stat-icon.svg" />
                    </div>

                    <div className="text-[#8B724E] text-[10px] font-medium">
                      {t("navbar.stat")} 0 {t("navbar.unit")}
                    </div>
                  </div>

                  {(
                    menuList[i18n.language as keyof typeof menuList] ||
                    menuList.th
                  ).map((item: INavbarMenuList) => (
                    <NavbarMenuBtn
                      key={item.sf}
                      title={item.title}
                      imgUrl={item.img}
                      path={item.path}
                      desc={item.desc}
                      setOpenMenu={setOpenMenu}
                    />
                  ))}

                  <div className="w-full mt-2">
                    {(
                      footerList[i18n.language as keyof typeof menuList] ||
                      menuList.th
                    ).map((item: INavbarFooterMenuList, index: number) => (
                      <NavbarFooterMenu
                        key={index}
                        title={item.title}
                        imgUrl={item.img}
                        path={item.path}
                        setOpenMenu={setOpenMenu}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
