import { useState, useEffect, useMemo } from "react";
import {
  STATION_COORDS,
  subscribeHeatmapRecords,
  formatHour,
  formatTime,
} from "../../utils/heatmap";
import { TIME_SLOTS } from "../../constant/admin";
import { useTranslation } from "react-i18next";
import type {
  CellData,
  FilterType,
  HeatmapRecord,
  HeatmapTableProps,
  StationId,
} from "../../interfaces/admin.interface";

function HeatmapTable({
  title,
  grid,
  maxValue,
  lang,
  stationIds,
  onCellMouseEnter,
  onCellMouseLeave,
}: HeatmapTableProps) {
  const getColor = (value: number) => {
    if (value === 0) return "transparent";
    const alpha = 0.15 + 0.75 * Math.sqrt(value / maxValue);
    return `rgba(191, 75, 23, ${alpha.toFixed(2)})`;
  };

  return (
    <div className="w-full flex flex-col gap-2 relative bg-white border border-[#E8E4DC] rounded-2xl p-4 shadow-sm">
      <h3 className="text-[14px] font-bold text-[#543A14] mb-1">{title}</h3>
      <div className="overflow-x-auto">
        <div className="min-w-175">
          <div className="flex gap-1 mb-1">
            <div className="w-24 shrink-0" />
            {TIME_SLOTS.map((slot) => (
              <div
                key={slot}
                className="flex-1 text-center text-[10px] font-semibold text-[#8B724E]"
              >
                {slot}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            {stationIds.map((id) => (
              <div key={id} className="flex gap-1 items-center">
                <div className="w-24 shrink-0 text-[11px] font-medium text-[#543A14] text-right pr-2 leading-tight">
                  {STATION_COORDS[id]?.name?.[lang] ??
                    STATION_COORDS[id]?.name?.th}
                </div>
                {TIME_SLOTS.map((slot) => {
                  const cell = grid[id]?.[slot] ?? { count: 0, lastTime: "" };
                  const value = cell.count;
                  return (
                    <div
                      key={slot}
                      className={`relative flex-1 h-10 border border-[#E8E4DC] rounded flex flex-col items-center justify-center text-xs transition-all ${
                        value > 0 ? "cursor-pointer" : ""
                      }`}
                      style={{ backgroundColor: getColor(value) }}
                      onMouseEnter={(e) => {
                        if (value === 0) return;
                        const stationName =
                          STATION_COORDS[id]?.name?.[lang] ??
                          STATION_COORDS[id]?.name?.th;
                        onCellMouseEnter(e, stationName, slot, cell);
                      }}
                      onMouseLeave={onCellMouseLeave}
                    >
                      {value > 0 ? (
                        <span className="text-[10px] text-white/90 font-semibold leading-none">
                          {value}
                        </span>
                      ) : (
                        <span className="text-[#E8E4DC] text-[9px]">·</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminHeatmap() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "th" | "en" | "cn";

  const [allRecords, setAllRecords] = useState<HeatmapRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  const [singleDate, setSingleDate] = useState<string>(
    () => new Date().toISOString().split("T")[0],
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    station: string;
    slot: string;
    date: string;
    count: number;
    lastTime: string;
    x: number;
    y: number;
  }>({
    visible: false,
    station: "",
    slot: "",
    date: "",
    count: 0,
    lastTime: "",
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const unsub = subscribeHeatmapRecords((records) => {
      setAllRecords(records);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleScroll = () => setTooltip((t) => ({ ...t, visible: false }));
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  const filteredRecords = useMemo(() => {
    return allRecords.filter((r) => {
      if (filter === "today") {
        if (!singleDate) return true;

        const recordDate = new Date(r.timestamp).toISOString().split("T")[0];
        return recordDate === singleDate;
      }

      if (filter === "custom") {
        const startTimestamp = startDate
          ? new Date(`${startDate}T00:00:00`).getTime()
          : 0;
        const endTimestamp = endDate
          ? new Date(`${endDate}T23:59:59`).getTime()
          : Infinity;
        return r.timestamp >= startTimestamp && r.timestamp <= endTimestamp;
      }

      return true;
    });
  }, [allRecords, filter, singleDate, startDate, endDate]);

  const tramRecords = useMemo(
    () => filteredRecords.filter((r) => r.transportType === "tram"),
    [filteredRecords],
  );

  const otherRecords = useMemo(
    () => filteredRecords.filter((r) => r.transportType !== "tram"),
    [filteredRecords],
  );

  const total = filteredRecords.length;

  const buildGrid = (records: HeatmapRecord[]) => {
    const result: Record<string, Record<string, CellData>> = {};

    Object.keys(STATION_COORDS).forEach((id) => {
      result[id] = {};
      TIME_SLOTS.forEach((slot) => {
        result[id][slot] = { count: 0, lastTime: "" };
      });
    });

    const seenUsersInSlot = new Set<string>();

    records.forEach((r) => {
      const slot = formatHour(r.timestamp);
      const uniqueKey = `${r.stationId}_${slot}_${r.uid}`;

      if (seenUsersInSlot.has(uniqueKey)) return;

      if (result[r.stationId]?.[slot] !== undefined) {
        result[r.stationId][slot].count += 1;
        result[r.stationId][slot].lastTime = formatTime(r.timestamp);
        result[r.stationId][slot].lastTimestamp = r.timestamp;
        seenUsersInSlot.add(uniqueKey);
      }
    });

    return result;
  };

  const tramGrid = useMemo(() => buildGrid(tramRecords), [tramRecords]);
  const otherGrid = useMemo(() => buildGrid(otherRecords), [otherRecords]);

  const tramMax = useMemo(() => {
    const vals = Object.values(tramGrid).flatMap((s) =>
      Object.values(s).map((c) => c.count),
    );
    return Math.max(1, ...vals);
  }, [tramGrid]);

  const otherMax = useMemo(() => {
    const vals = Object.values(otherGrid).flatMap((s) =>
      Object.values(s).map((c) => c.count),
    );
    return Math.max(1, ...vals);
  }, [otherGrid]);

  const stationIds = useMemo(() => {
    const allKeys = Object.keys(STATION_COORDS) as StationId[];
    const mainStations = allKeys.filter((id) => !id.startsWith("province-"));
    const provinceStations = allKeys.filter((id) => id.startsWith("province-"));
    return [...mainStations, ...provinceStations];
  }, []);

  const handleCellMouseEnter = (
    e: React.MouseEvent,
    stationName: string,
    slot: string,
    cell: CellData,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const localeMap = { th: "th-TH", en: "en-US", cn: "zh-CN" };
    const dateStr = cell.lastTimestamp
      ? new Date(cell.lastTimestamp).toLocaleDateString(
          localeMap[lang] || "th-TH",
        )
      : "";

    setTooltip({
      visible: true,
      station: stationName,
      slot,
      count: cell.count,
      lastTime: cell.lastTime,
      date: dateStr,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleCellMouseLeave = () => {
    setTooltip((t) => ({ ...t, visible: false }));
  };

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return;

    const headersMap = {
      th: [
        "Timestamp",
        "วัน-เวลา บันทึก",
        "รหัสผู้ใช้ (UID)",
        "ประเภทรถ",
        "รหัสสถานี",
        "ชื่อสถานี",
        "ระยะห่างจากสถานี (เมตร)",
      ],
      en: [
        "Timestamp",
        "Date Time Record",
        "User UID",
        "Transport Type",
        "Station ID",
        "Station Name",
        "Distance (Meters)",
      ],
      cn: [
        "时间戳",
        "记录日期和时间",
        "用户独特标识 (UID)",
        "出行方式",
        "车站标识",
        "车站名称",
        "到车站距离 (米)",
      ],
    };
    const headers = headersMap[lang] || headersMap.en;

    const rows = filteredRecords.map((r) => {
      const date = new Date(r.timestamp);

      const localeMap = { th: "th-TH", en: "en-US", cn: "zh-CN" };
      const currentLocale = localeMap[lang] || "en-US";
      const formattedDate = `${date.toLocaleDateString(currentLocale)} ${date.toLocaleTimeString(currentLocale)}`;

      const sId = r.stationId as StationId;

      const stationName =
        STATION_COORDS[sId]?.name?.[lang] ??
        STATION_COORDS[sId]?.name?.th ??
        (lang === "cn"
          ? "未指定主区域"
          : lang === "en"
            ? "Unspecified Main Area"
            : "ไม่ระบุตำแหน่งหลัก");

      return [
        r.timestamp,
        `"${formattedDate}"`,
        `"${r.uid}"`,
        r.transportType,
        r.stationId,
        `"${stationName}"`,
        r.distance,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);

    let filename = "heatmap_records_all.csv";
    if (filter === "today" && singleDate) {
      filename = `heatmap_records_${singleDate}.csv`;
    } else if (filter === "custom" && startDate && endDate) {
      filename = `heatmap_records_${startDate}_to_${endDate}.csv`;
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-4 py-2 relative">
      <div className="flex flex-col gap-3 border-b border-[#E8E4DC] pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-[#543A14]">
            {t("dashboard.tabs.heatmap")}
          </h2>
          <p className="text-[11px] text-[#8B724E] mt-0.5">
            {loading ? t("heatmap.loading") : t("heatmap.summary", { total })}
          </p>
        </div>

        <div className="flex flex-col flex-wrap items-end justify-center gap-3">
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={total === 0}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 transition-all shadow-sm ${
                total > 0
                  ? "bg-white text-[#BF4B17] border-[#BF4B17] hover:bg-[#BF4B17]/5 cursor-pointer"
                  : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Export CSV
            </button>

            <div className="flex gap-1 p-1 rounded-full">
              {(["all", "today", "custom"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                    filter === f
                      ? "bg-[#BF4B17] text-white shadow-sm"
                      : "text-[#543A14] bg-white border border-[#C6C6C6]"
                  }`}
                >
                  {f === "all"
                    ? t("heatmap.all")
                    : f === "today"
                      ? t("heatmap.day")
                      : t("heatmap.period")}
                </button>
              ))}
            </div>
          </div>

          {filter === "today" && (
            <div className="flex items-center gap-1.5 animate-fadeIn">
              <span className="text-[11px] text-[#8B724E]">
                {t("heatmap.date")}:
              </span>
              <input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className="border border-[#C6C6C6] rounded-lg px-2 py-1 text-[11px] font-medium text-[#543A14] bg-white outline-none focus:border-[#BF4B17]"
              />
            </div>
          )}

          {filter === "custom" && (
            <div className="flex items-center gap-1.5 animate-fadeIn">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-[#C6C6C6] rounded-lg px-2 py-1 text-[11px] font-medium text-[#543A14] bg-white outline-none focus:border-[#BF4B17]"
              />
              <span className="text-[11px] text-[#8B724E]">
                {t("heatmap.to")}
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-[#C6C6C6] rounded-lg px-2 py-1 text-[11px] font-medium text-[#543A14] bg-white outline-none focus:border-[#BF4B17]"
              />
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="bg-white border border-[#E8E4DC] rounded-2xl p-8 text-center">
          <p className="text-[13px] text-[#8B724E]"> {t("heatmap.loading")}</p>
        </div>
      )}

      {!loading && total === 0 && (
        <div className="bg-white border border-dashed border-[#C6C6C6] rounded-2xl p-8 text-center">
          <p className="text-[13px] text-[#8B724E]">{t("heatmap.noData")}</p>
          <p className="text-[11px] text-[#C6C6C6] mt-1">
            {t("heatmap.collecting")}
          </p>
        </div>
      )}

      {!loading && total > 0 && (
        <div className="w-full flex flex-col gap-6 relative">
          <HeatmapTable
            title={`${t("dashboard.tabs.heatmap")} - ${t("travel.tram")}`}
            grid={tramGrid}
            maxValue={tramMax}
            lang={lang}
            stationIds={stationIds}
            onCellMouseEnter={handleCellMouseEnter}
            onCellMouseLeave={handleCellMouseLeave}
          />

          <HeatmapTable
            title={`${t("dashboard.tabs.heatmap")} - ${t("travel.other")}`}
            grid={otherGrid}
            maxValue={otherMax}
            lang={lang}
            stationIds={stationIds}
            onCellMouseEnter={handleCellMouseEnter}
            onCellMouseLeave={handleCellMouseLeave}
          />

          {tooltip.visible && (
            <div
              className="pointer-events-none fixed z-50 bg-[#543A14] text-white text-[11px] rounded-xl px-3 py-2 shadow-lg -translate-x-1/2 -translate-y-full"
              style={{ top: tooltip.y - 8, left: tooltip.x }}
            >
              <p className="font-bold">{tooltip.station}</p>
              {tooltip.date && <p className="text-white/70">{tooltip.date}</p>}
              <p className="text-white/70">{tooltip.slot} น.</p>
              <p>{tooltip.count} คน</p>
              {tooltip.lastTime && (
                <p className="text-white/60">
                  {t("heatmap.latest")} {tooltip.lastTime}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-1">
            <span className="text-[10px] text-[#8B724E]">
              {t("heatmap.low")}
            </span>
            <div className="flex gap-0.5">
              {[0.1, 0.25, 0.45, 0.65, 0.85].map((a) => (
                <div
                  key={a}
                  className="w-5 h-3 rounded-sm"
                  style={{ backgroundColor: `rgba(191,75,23,${a})` }}
                />
              ))}
            </div>
            <span className="text-[10px] text-[#8B724E]">
              {t("heatmap.high")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
