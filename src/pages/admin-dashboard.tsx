import { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminRecommend from "../components/admin/admin-recommend";
import AdminKome from "../components/admin/admin-kome";
import AdminTravel from "../components/admin/admin-travel";
import AdminContact from "../components/admin/admin-contact";
import AdminHeatmap from "../components/admin/admin-heatmap";
import type { Tab } from "../interfaces/admin.interface";
import { useTabs } from "../constant/admin";
import { useAuth } from "../hooks/useAuth";
import AdminLoginPage from "./admin-login-page";
import AdminStation from "../components/admin/admin-station";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const tabs = useTabs();
  const [tab, setTab] = useState<Tab>("station");
  const { user } = useAuth();

  if (!user) return <AdminLoginPage />;

  return (
    <div className="min-h-screen bg-[linear-gradient(161deg,#FFE2A5_0%,#FBFCF0_22%,#FFFFFF_62%,#E6EFD8_100%)] p-5">
      <div className="mx-auto">
        <h1 className="text-[20px] font-bold text-[#543A14] mb-5">
          {t("dashboard.title")}
        </h1>
        <div className="flex gap-x-2 mb-5 overflow-x-auto pb-1">
          {tabs.map((item) => (
            <button
              key={item.value}
              onClick={() => setTab(item.value)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium border whitespace-nowrap transition-colors ${
                tab === item.value
                  ? "bg-[#BF4B17] text-white border-[#BF4B17]"
                  : "bg-white text-[#543A14] border-[#C6C6C6]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {/* {tab === "places" && <PlacesPanel />}
        {tab === "activities" && <ActivitiesPanel />}
        {tab === "toilets" && <ToiletsPanel />} */}

        {tab === "station" && <AdminStation />}
        {tab === "recommend" && <AdminRecommend />}
        {tab === "kome" && <AdminKome />}
        {tab === "travel" && <AdminTravel />}
        {tab === "contact" && <AdminContact />}
        {/* {tab === "popup" && <AdminPopup />} */}
        {tab === "heatmap" && <AdminHeatmap />}
      </div>
    </div>
  );
}
