import { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminRecommend from "../components/admin/admin-recommend";
import AdminKome from "../components/admin/admin-kome";
import AdminTravel from "../components/admin/admin-travel";
import AdminContact from "../components/admin/admin-contact";
import type { Tab } from "../interfaces/admin.interface";
import { useTabs } from "../constant/admin";
import PlacesPanel from "../components/admin/places-panel";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const tabs = useTabs();
  const [tab, setTab] = useState<Tab>("places");

  return (
    <div className="min-h-screen bg-[#FBFCF0] p-5">
      <div className="max-w-lg mx-auto">
        <h1 className="text-[20px] font-bold text-[#543A14] mb-4">
          {t("dashboard.title")}
        </h1>

        <div className="flex gap-x-2 mb-5 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium border whitespace-nowrap transition-colors ${
                tab === t.value
                  ? "bg-[#BF4B17] text-white border-[#BF4B17]"
                  : "bg-white text-[#543A14] border-[#C6C6C6]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "places" && <PlacesPanel />}
        {tab === "recommend" && <AdminRecommend />}
        {tab === "kome" && <AdminKome />}
        {tab === "travel" && <AdminTravel />}
        {tab === "contact" && <AdminContact />}
      </div>
    </div>
  );
}
