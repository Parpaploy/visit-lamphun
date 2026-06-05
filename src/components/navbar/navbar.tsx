// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { LANGUAGES } from "../../constant/language";
// import { IoMenu } from "react-icons/io5";
// import NavbarMenuBtn from "./navbar-menu-btn";
// import type {
//   INavbarFooterMenuList,
//   INavbarMenuList,
// } from "../../interfaces/navbar.interface";
// import NavbarFooterMenu from "./navbar-footer-menu";
// import {
//   footerList,
//   menuList,
//   pageTitleMap,
//   subtitleMap,
// } from "../../constant/navbar-menu";
// import { subscribeTransportStats } from "../../services/stat.services";

// export default function Navbar() {
//   const { i18n, t } = useTranslation();

//   const navigation = useNavigate();

//   const location = useLocation();
//   const [open, setOpen] = useState<boolean>(false);
//   const [openMenu, setOpenMenu] = useState<boolean>(false);
//   const [menuReady, setMenuReady] = useState<boolean>(false);
//   const [langReady, setLangReady] = useState<boolean>(false);
//   const [totalUsers, setTotalUsers] = useState<number>(0);

//   useEffect(() => {
//     if (!openMenu) return;
//     const timer = setTimeout(() => setMenuReady(true), 350);
//     return () => {
//       clearTimeout(timer);
//       setMenuReady(false);
//     };
//   }, [openMenu]);

//   useEffect(() => {
//     if (!open) return;
//     const timer = setTimeout(() => setLangReady(true), 300);
//     return () => {
//       clearTimeout(timer);
//       setLangReady(false);
//     };
//   }, [open]);

//   useEffect(() => {
//     if (open || openMenu) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }

//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [open, openMenu]);

//   useEffect(() => {
//     const unsub = subscribeTransportStats((stats) => {
//       setTotalUsers(stats.tram + stats.other);
//     });
//     return () => unsub();
//   }, []);

//   const current =
//     LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

//   const lang = (i18n.language in pageTitleMap ? i18n.language : "th") as
//     | "th"
//     | "en"
//     | "cn";

//   const matched = menuList.th.find((item) => {
//     if (item.path.startsWith("http")) return false;
//     if (item.path === "/app") return location.pathname === "/app";
//     return location.pathname.startsWith(item.path);
//   });
//   const sf =
//     matched?.sf ??
//     (location.pathname.includes("contact") ? "contact" : "homepage");

//   const pageTitle = pageTitleMap[lang]?.[sf] ?? pageTitleMap.th[sf];
//   const subtitle = subtitleMap[lang];

//   return (
//     <div className="w-full max-w-107.5 mx-auto relative z-999">
//       <div
//         className={`${location.pathname === "/app/contact" || location.pathname === "/app/travel" || location.pathname === "/app/recommend" ? "" : "shadow-[0_4px_10px_0_rgba(0,0,0,0.12)]"} bg-[linear-gradient(68deg,#C07349_0%,#FC8B32_50%,#FBC859_100%)] w-full h-[15svh] px-3.75 pt-1.25 flex justify-between items-center`}
//       >
//         <div className="flex justify-center items-center gap-x-2">
//           <div
//             className="h-19 w-19"
//             onClick={() => {
//               navigation("/app");
//             }}
//           >
//             <img src="/icons/logo.svg" className="h-full w-full" />
//           </div>
//           <div className="flex flex-col items-start justify-center">
//             <h2 className="text-white text-[15px] font-medium mb-1">
//               {subtitle}
//             </h2>
//             <h1 className="text-[#543A14] text-[20px] font-bold leading-7">
//               {pageTitle}
//             </h1>
//           </div>
//         </div>

//         <div className="flex justify-center items-center gap-2.5">
//           <button
//             className="bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-full w-8.5 h-8.5"
//             onClick={() => setOpen((v) => !v)}
//           >
//             <img
//               src={current.icon}
//               className="w-full h-full rounded-full object-cover"
//             />
//           </button>

//           <button
//             className={`transition-all ${openMenu ? "text-white" : "text-[#75521F]"}`}
//             onClick={() => setOpenMenu((v) => !v)}
//           >
//             <IoMenu size={42} />
//           </button>
//         </div>
//       </div>

//       {open && (
//         <>
//           <div className="fixed inset-0 z-990" onClick={() => setOpen(false)} />
//           <div className="max-w-107.5 mx-auto flex min-h-[23svh] fixed left-1/2 -translate-x-1/2 top-[calc(15svh)] z-999 bg-white rounded-b-xl shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] py-2 w-full">
//             <svg
//               className="absolute -top-5 right-16 w-10 h-7"
//               viewBox="0 0 30 20"
//               fill="white"
//             >
//               <path
//                 d="M5 20 L15 5 L25 20 Z"
//                 stroke="white"
//                 strokeWidth="4"
//                 strokeLinejoin="round"
//               />
//             </svg>
//             {!langReady
//               ? Array.from({ length: LANGUAGES.length }).map((_, i) => (
//                   <div
//                     key={i}
//                     className="w-full flex flex-col items-center gap-3 px-4 py-2.5 animate-pulse"
//                   >
//                     <div className="w-21 h-21 rounded-full bg-gray-200 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
//                     <div className="h-3 w-8 rounded bg-gray-200" />
//                   </div>
//                 ))
//               : LANGUAGES.map((lang) => (
//                   <button
//                     key={lang.code}
//                     onClick={() => {
//                       i18n.changeLanguage(lang.code);
//                       setOpen(false);
//                     }}
//                     className={`w-full flex flex-col items-center gap-3 px-4 py-2.5 aspect-square transition-all ${
//                       i18n.language === lang.code ? "font-medium" : "opacity-50"
//                     }`}
//                   >
//                     <img
//                       src={lang.icon}
//                       className={`w-21 h-21 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-full ${
//                         i18n.language === lang.code
//                           ? "ring-3 ring-[#A1D6F5]/70"
//                           : ""
//                       }`}
//                     />
//                     <span className="text-[12px]">{lang.label}</span>
//                   </button>
//                 ))}
//           </div>
//         </>
//       )}

//       {openMenu && (
//         <>
//           <div
//             className="fixed inset-0 z-990"
//             onClick={() => setOpenMenu(false)}
//           />
//           <div className="min-h-[68svh] max-w-107.5 mx-auto max-h-[78svh] px-7 flex fixed left-1/2 -translate-x-1/2 top-[calc(15svh)] z-998 bg-white rounded-b-xl shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] w-full">
//             <svg
//               className="absolute -top-5 right-4 w-10 h-7"
//               viewBox="0 0 30 20"
//               fill="white"
//             >
//               <path
//                 d="M5 20 L15 5 L25 20 Z"
//                 stroke="white"
//                 strokeWidth="4"
//                 strokeLinejoin="round"
//               />
//             </svg>

//             <div className="z-999 overflow-y-auto w-full flex flex-col justify-start items-start gap-2 pt-4 pb-1">
//               {!menuReady ? (
//                 <>
//                   <div className="flex justify-start items-start gap-1 animate-pulse">
//                     <div className="w-3 h-3 rounded bg-gray-200" />
//                     <div className="h-2.5 w-24 rounded bg-gray-200" />
//                   </div>

//                   {Array.from({ length: 4 }).map((_, i) => (
//                     <div
//                       key={i}
//                       className="w-full flex justify-start items-center gap-10 border-2 border-[#D9D9D9] rounded-full p-1 animate-pulse"
//                     >
//                       <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
//                       <div className="flex flex-col gap-1.5">
//                         <div className="h-4 w-32 rounded bg-gray-200" />
//                         <div className="h-3 w-20 rounded bg-gray-200" />
//                       </div>
//                     </div>
//                   ))}

//                   <div className="w-full mt-2">
//                     {Array.from({ length: 3 }).map((_, i) => (
//                       <div
//                         key={i}
//                         className="w-full flex justify-start items-center gap-5 border-t border-[#D9D9D9] pl-10 py-3 animate-pulse"
//                       >
//                         <div className="w-6.5 h-6.5 rounded-full bg-gray-200 shrink-0" />
//                         <div className="h-4 w-28 rounded bg-gray-200" />
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="flex justify-start items-start gap-1">
//                     <div className="w-3 h-auto">
//                       <img src="/icons/navbar/stat-icon.svg" />
//                     </div>

//                     <div className="text-[#8B724E] text-[10px] font-medium">
//                       {t("navbar.stat")} {totalUsers.toLocaleString()}{" "}
//                       {t("navbar.unit")}
//                     </div>
//                   </div>

//                   {(
//                     menuList[i18n.language as keyof typeof menuList] ||
//                     menuList.th
//                   ).map((item: INavbarMenuList) => (
//                     <NavbarMenuBtn
//                       key={item.sf}
//                       title={item.title}
//                       imgUrl={item.img}
//                       path={item.path}
//                       desc={item.desc}
//                       setOpenMenu={setOpenMenu}
//                     />
//                   ))}

//                   <div className="w-full mt-2">
//                     {(
//                       footerList[i18n.language as keyof typeof footerList] ||
//                       footerList.th
//                     ).map((item: INavbarFooterMenuList, index: number) => (
//                       <NavbarFooterMenu
//                         key={index}
//                         title={item.title}
//                         imgUrl={item.img}
//                         path={item.path}
//                         setOpenMenu={setOpenMenu}
//                       />
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { LANGUAGES } from "../../constant/language";
// import { IoMenu } from "react-icons/io5";
// import NavbarMenuBtn from "./navbar-menu-btn";
// import type {
//   INavbarFooterMenuList,
//   INavbarMenuList,
// } from "../../interfaces/navbar.interface";
// import NavbarFooterMenu from "./navbar-footer-menu";
// import { footerList, menuList, pageTitleMap } from "../../constant/navbar-menu";
// import { subscribeTransportStats } from "../../services/stat.services";
// import { useNavbarTitle } from "../../hooks/useNavbar";

// export default function Navbar() {
//   const { i18n, t } = useTranslation();

//   const location = useLocation();
//   const [open, setOpen] = useState<boolean>(false);
//   const [openMenu, setOpenMenu] = useState<boolean>(false);
//   const [menuReady, setMenuReady] = useState<boolean>(false);
//   const [langReady, setLangReady] = useState<boolean>(false);
//   const [totalUsers, setTotalUsers] = useState<number>(0);

//   useEffect(() => {
//     if (!openMenu) return;
//     const timer = setTimeout(() => setMenuReady(true), 350);
//     return () => {
//       clearTimeout(timer);
//       setMenuReady(false);
//     };
//   }, [openMenu]);

//   useEffect(() => {
//     if (!open) return;
//     const timer = setTimeout(() => setLangReady(true), 300);
//     return () => {
//       clearTimeout(timer);
//       setLangReady(false);
//     };
//   }, [open]);

//   useEffect(() => {
//     if (open || openMenu) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }

//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [open, openMenu]);

//   useEffect(() => {
//     const unsub = subscribeTransportStats((stats) => {
//       setTotalUsers(stats.tram + stats.other);
//     });
//     return () => unsub();
//   }, []);

//   const current =
//     LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

//   const lang = (i18n.language in pageTitleMap ? i18n.language : "th") as
//     | "th"
//     | "en"
//     | "cn";

//   const matched = menuList.th.find((item) => {
//     if (item.path.startsWith("http")) return false;
//     if (item.path === "/app") return location.pathname === "/app";
//     return location.pathname.startsWith(item.path);
//   });
//   const sf =
//     matched?.sf ??
//     (location.pathname.includes("contact") ? "contact" : "homepage");

//   // const pageTitle = pageTitleMap[lang]?.[sf] ?? pageTitleMap.th[sf];
//   const { overrideTitle } = useNavbarTitle();
//   const pageTitle =
//     overrideTitle ?? pageTitleMap[lang]?.[sf] ?? pageTitleMap.th[sf];

//   return (
//     <div className="w-full max-w-107.5 mx-auto fixed top-0 z-999">
//       <div
//         className={`${location.pathname !== "/app" ? "bg-[linear-gradient(68deg,#C07349_0%,#FC8B32_50%,#FBC859_100%)]" : ""} w-full h-[9svh] px-3.75 pt-1.25 flex justify-between items-center`}
//       >
//         <h1 className="text-[#543A14] text-[20px] font-bold leading-7">
//           {pageTitle}
//         </h1>

//         <div className="flex justify-center items-center gap-2.5">
//           <button
//             className="bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-full w-8.5 h-8.5"
//             onClick={() => setOpen((v) => !v)}
//           >
//             <img
//               src={current.icon}
//               className="w-full h-full rounded-full object-cover"
//             />
//           </button>

//           <button
//             className={`transition-all ${openMenu ? "text-white" : "text-[#75521F]"}`}
//             onClick={() => setOpenMenu((v) => !v)}
//           >
//             <IoMenu size={42} />
//           </button>
//         </div>
//       </div>

//       {open && (
//         <>
//           <div className="fixed inset-0 z-990" onClick={() => setOpen(false)} />
//           <div className="max-w-107.5 mx-auto flex min-h-[23svh] fixed left-1/2 -translate-x-1/2 top-[calc(10svh)] z-999 bg-white rounded-b-xl shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] py-2 w-full">
//             <svg
//               className="absolute -top-5 right-16 w-10 h-7"
//               viewBox="0 0 30 20"
//               fill="white"
//             >
//               <path
//                 d="M5 20 L15 5 L25 20 Z"
//                 stroke="white"
//                 strokeWidth="4"
//                 strokeLinejoin="round"
//               />
//             </svg>
//             {!langReady
//               ? Array.from({ length: LANGUAGES.length }).map((_, i) => (
//                   <div
//                     key={i}
//                     className="w-full flex flex-col items-center gap-3 px-4 py-2.5 animate-pulse"
//                   >
//                     <div className="w-21 h-21 rounded-full bg-gray-200 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
//                     <div className="h-3 w-8 rounded bg-gray-200" />
//                   </div>
//                 ))
//               : LANGUAGES.map((lang) => (
//                   <button
//                     key={lang.code}
//                     onClick={() => {
//                       i18n.changeLanguage(lang.code);
//                       setOpen(false);
//                     }}
//                     className={`w-full flex flex-col items-center gap-3 px-4 py-2.5 aspect-square transition-all ${
//                       i18n.language === lang.code ? "font-medium" : "opacity-50"
//                     }`}
//                   >
//                     <img
//                       src={lang.icon}
//                       className={`w-21 h-21 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-full ${
//                         i18n.language === lang.code
//                           ? "ring-3 ring-[#A1D6F5]/70"
//                           : ""
//                       }`}
//                     />
//                     <span className="text-[12px]">{lang.label}</span>
//                   </button>
//                 ))}
//           </div>
//         </>
//       )}

//       {openMenu && (
//         <>
//           <div
//             className="fixed inset-0 z-990"
//             onClick={() => setOpenMenu(false)}
//           />
//           <div className="min-h-[68svh] max-w-107.5 mx-auto max-h-[78svh] px-7 flex fixed left-1/2 -translate-x-1/2 top-[calc(10svh)] z-998 bg-white rounded-b-xl shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] w-full">
//             <svg
//               className="absolute -top-5 right-4 w-10 h-7"
//               viewBox="0 0 30 20"
//               fill="white"
//             >
//               <path
//                 d="M5 20 L15 5 L25 20 Z"
//                 stroke="white"
//                 strokeWidth="4"
//                 strokeLinejoin="round"
//               />
//             </svg>

//             <div className="z-999 overflow-y-auto w-full flex flex-col justify-start items-start gap-2 pt-4 pb-1">
//               {!menuReady ? (
//                 <>
//                   <div className="flex justify-start items-start gap-1 animate-pulse">
//                     <div className="w-3 h-3 rounded bg-gray-200" />
//                     <div className="h-2.5 w-24 rounded bg-gray-200" />
//                   </div>

//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <div
//                       key={i}
//                       className="w-full flex justify-start items-center gap-10 border-2 border-[#D9D9D9] rounded-full p-1 animate-pulse"
//                     >
//                       <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
//                       <div className="flex flex-col gap-1.5">
//                         <div className="h-4 w-32 rounded bg-gray-200" />
//                         <div className="h-3 w-20 rounded bg-gray-200" />
//                       </div>
//                     </div>
//                   ))}

//                   <div className="w-full mt-2">
//                     {Array.from({ length: 2 }).map((_, i) => (
//                       <div
//                         key={i}
//                         className="w-full flex justify-start items-center gap-5 border-t border-[#D9D9D9] pl-10 py-3 animate-pulse"
//                       >
//                         <div className="w-6.5 h-6.5 rounded-full bg-gray-200 shrink-0" />
//                         <div className="h-4 w-28 rounded bg-gray-200" />
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="flex justify-start items-start gap-1">
//                     <div className="w-3 h-auto">
//                       <img src="/icons/navbar/stat-icon.svg" />
//                     </div>

//                     <div className="text-[#8B724E] text-[10px] font-medium">
//                       {t("navbar.stat")} {totalUsers.toLocaleString()}{" "}
//                       {t("navbar.unit")}
//                     </div>
//                   </div>

//                   {(
//                     menuList[i18n.language as keyof typeof menuList] ||
//                     menuList.th
//                   ).map((item: INavbarMenuList) => (
//                     <NavbarMenuBtn
//                       key={item.sf}
//                       title={item.title}
//                       imgUrl={item.img}
//                       path={item.path}
//                       desc={item.desc}
//                       setOpenMenu={setOpenMenu}
//                     />
//                   ))}

//                   <div className="w-full mt-2">
//                     {(
//                       footerList[i18n.language as keyof typeof footerList] ||
//                       footerList.th
//                     ).map((item: INavbarFooterMenuList, index: number) => (
//                       <NavbarFooterMenu
//                         key={index}
//                         title={item.title}
//                         imgUrl={item.img}
//                         path={item.path}
//                         setOpenMenu={setOpenMenu}
//                       />
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../constant/language";
import { IoMenu } from "react-icons/io5";
import NavbarMenuBtn from "./navbar-menu-btn";
import type {
  INavbarFooterMenuList,
  INavbarMenuList,
} from "../../interfaces/navbar.interface";
import NavbarFooterMenu from "./navbar-footer-menu";
import { footerList, menuList, pageTitleMap } from "../../constant/navbar-menu";
import { subscribeTransportStats } from "../../services/stat.services";
import { useNavbarTitle } from "../../hooks/useNavbar";
import { IoIosArrowDown } from "react-icons/io";

export default function Navbar() {
  const { i18n, t } = useTranslation();

  const location = useLocation();
  // const [open, setOpen] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [menuReady, setMenuReady] = useState<boolean>(false);
  const [langReady, setLangReady] = useState<boolean>(false);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    if (!openMenu) return;
    const timer = setTimeout(() => setMenuReady(true), 350);
    return () => {
      clearTimeout(timer);
      setMenuReady(false);
    };
  }, [openMenu]);

  // useEffect(() => {
  //   if (!open) return;
  //   const timer = setTimeout(() => setLangReady(true), 300);
  //   return () => {
  //     clearTimeout(timer);
  //     setLangReady(false);
  //   };
  // }, [open]);

  useEffect(() => {
    if (!openMenu) return;
    const timer = setTimeout(() => setLangReady(true), 350);
    return () => {
      clearTimeout(timer);
      setLangReady(false);
    };
  }, [openMenu]);

  // useEffect(() => {
  //   if (open || openMenu) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "";
  //   }

  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, [open, openMenu]);

  useEffect(() => {
    if (openMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openMenu]);

  useEffect(() => {
    const unsub = subscribeTransportStats((stats) => {
      setTotalUsers(stats.tram + stats.other);
    });
    return () => unsub();
  }, []);

  // const current =
  //   LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

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

  // const pageTitle = pageTitleMap[lang]?.[sf] ?? pageTitleMap.th[sf];
  const { overrideTitle } = useNavbarTitle();
  const pageTitle =
    overrideTitle ?? pageTitleMap[lang]?.[sf] ?? pageTitleMap.th[sf];

  return (
    <div className="w-full max-w-107.5 mx-auto fixed top-0 z-999">
      <div
        className={`${location.pathname !== "/app" ? "bg-[linear-gradient(68deg,#C07349_0%,#FC8B32_50%,#FBC859_100%)]" : ""} w-full h-[9svh] px-3.75 pt-1.25 flex justify-between items-center`}
      >
        <h1 className="text-[#543A14] text-[20px] font-bold leading-7">
          {pageTitle}
        </h1>

        <button
          className="transition-all mb-1 text-[#75521F]"
          onClick={() => setOpenMenu((v) => !v)}
        >
          <IoMenu size={42} />
        </button>

        {/* <div className="flex justify-center items-center gap-2.5">
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
        </div> */}
      </div>

      {/* {open && (
        <>
          <div className="fixed inset-0 z-990" onClick={() => setOpen(false)} />
          <div className="max-w-107.5 mx-auto flex min-h-[23svh] fixed left-1/2 -translate-x-1/2 top-[calc(10svh)] z-999 bg-white rounded-b-xl shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] py-2 w-full">
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
                    className={`w-full flex flex-col items-center gap-3 px-4 py-2.5 aspect-square transition-all ${
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
      )} */}

      <>
        {openMenu && (
          <div
            className="fixed inset-0 z-990"
            onClick={() => setOpenMenu(false)}
          />
        )}
        <div
          className={`min-h-[92svh] w-[95%] max-w-107.5 mx-auto max-h-[78svh] flex flex-col fixed left-1/2 -translate-x-1/2 bottom-0 z-998 bg-white rounded-t-[25px] shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)] overflow-hidden transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            openMenu ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ pointerEvents: openMenu ? "auto" : "none" }}
        >
          <div
            className="w-full bg-[#BF4B17] flex justify-center items-center text-white py-1 shrink-0 cursor-pointer"
            onClick={() => setOpenMenu(false)}
          >
            <IoIosArrowDown size={24} />
          </div>

          <div className="min-h-[87.5svh] overflow-y-auto w-full flex flex-col justify-between items-center py-3">
            {!menuReady ? (
              <div className="mt-1 mx-auto min-h-4 w-20 mb-3 rounded bg-gray-200" />
            ) : (
              <h1 className="text-[16px] font-semibold text-[#543A14] w-full text-center mb-2">
                - {t("navbar.menu")} -
              </h1>
            )}

            <div className="w-full flex flex-col justify-start items-start gap-2">
              <div className="w-full px-15 flex flex-col justify-start items-start gap-2">
                {!menuReady ? (
                  <>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-full flex justify-start items-center gap-4 bg-gray-200 rounded-full p-1 animate-pulse"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
                        <div className="flex flex-col gap-1.5">
                          <div className="h-4 w-32 rounded bg-gray-100" />
                          {/* <div className="h-3 w-20 rounded bg-gray-200" /> */}
                        </div>
                      </div>
                    ))}

                    <div className="w-full mt-2">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-full flex justify-start items-center gap-5 relative pl-3 py-4 animate-pulse"
                        >
                          <div className="absolute bottom-0 min-h-1 w-[85%] left-1/2 -translate-1/2 border-b border-[#D9D9D9]" />

                          <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />
                          <div className="h-4 w-32 rounded bg-gray-200" />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
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

                    <div className="w-full">
                      {(
                        footerList[i18n.language as keyof typeof footerList] ||
                        footerList.th
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

              {!langReady ? (
                <div className="mt-2 mx-auto h-4 w-32 rounded bg-gray-200" />
              ) : (
                <h1 className="text-[16px] font-semibold text-[#543A14] w-full text-center mt-1">
                  {t("navbar.changeLanguage")}
                </h1>
              )}

              <div className="flex justify-center items-center gap-7 w-full mt-2">
                {!langReady
                  ? Array.from({ length: LANGUAGES.length }).map((_, i) => (
                      <div
                        key={i}
                        className="min-w-18 flex flex-col items-center gap-3 px-4 py-2.5 animate-pulse"
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-200 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                        <div className="h-3 w-12 rounded bg-gray-200" />
                      </div>
                    ))
                  : LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          // setOpenMenu(false);
                        }}
                        className={`min-w-18 flex flex-col items-center gap-3 transition-all`}
                      >
                        <img
                          src={lang.icon}
                          className={`w-10 h-auto rounded-full aspect-square transition-all ${
                            i18n.language === lang.code
                              ? "ring-2 ring-[#BF4B17] shadow-[0_0px_12.3px_0_rgba(191,75,23,1)]"
                              : "ring-2 ring-transparent shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)]"
                          }`}
                        />
                        <span
                          className={`text-[16px] font-medium ${
                            i18n.language === lang.code
                              ? "text-[#543A14]"
                              : "text-black"
                          } whitespace-nowrap`}
                        >
                          {lang.label}
                        </span>
                      </button>
                    ))}
              </div>
            </div>

            {!menuReady ? (
              <div className="flex justify-center items-center gap-1 animate-pulse mt-4">
                <div className="w-4 h-4 rounded bg-gray-200" />
                <div className="h-3.5 w-32 rounded bg-gray-200" />
              </div>
            ) : (
              <div className="flex justify-center items-center gap-1 mt-4">
                <div className="w-3.5 h-auto mb-0.5">
                  <img src="/icons/navbar/stat-icon.svg" />
                </div>
                <div className="text-[#8B724E] text-[14px] font-medium">
                  {t("navbar.stat")} {totalUsers.toLocaleString()}{" "}
                  {t("navbar.unit")}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
}
