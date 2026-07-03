import { useState } from "react";
import type { IStationMode } from "../../interfaces/navbar.interface";
import { STATION_IDS, useStationModes } from "../../constant/admin";
import PlacesPanel from "./places-panel";
import ActivitiesPanel from "./activities-panel";
import ToiletsPanel from "./toilets-panel";
import AdminPopup from "./admin-popup";
import { STATION_NAMES_ML } from "../../constant/homepage";
import { useTranslation } from "react-i18next";

export default function AdminStation() {
  const { t, i18n } = useTranslation();

  const modes = useStationModes();
  const [mode, setMode] = useState<IStationMode>("history");
  const [selectedStation, setSelectedStation] = useState<string>(
    STATION_IDS[0],
  );

  const lang =
    i18n.language === "en" || i18n.language === "cn" ? i18n.language : "th";

  const stationName = (id: string) =>
    STATION_NAMES_ML[id]?.[lang] || STATION_NAMES_ML[id]?.th || "";

  return (
    <>
      <div className="flex gap-x-2 mb-4">
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
              mode === m.value
                ? "bg-[#BF4B17] text-white border-[#BF4B17]"
                : "bg-white text-[#543A14] border-[#C6C6C6]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-[13px] text-[#8B724E] font-medium mb-1">
          {t("dashboard.selectStation")}
        </label>
        <select
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          className="w-full border border-[#C6C6C6] bg-white rounded-xl px-4 py-2.5 text-[14px] text-[#543A14] outline-none"
        >
          {STATION_IDS.map((id) => (
            <option key={id} value={id}>
              {stationName(id)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {mode === "history" && <AdminPopup selectedStation={selectedStation} />}
        {mode === "places" && <PlacesPanel selectedStation={selectedStation} />}
        {mode === "activities" && (
          <ActivitiesPanel selectedStation={selectedStation} />
        )}
        {mode === "toilets" && (
          <ToiletsPanel selectedStation={selectedStation} />
        )}
      </div>
    </>
  );
}
