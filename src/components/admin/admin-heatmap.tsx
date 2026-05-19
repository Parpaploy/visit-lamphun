import { useState, useEffect, useMemo } from "react";
import {
  type HeatmapRecord,
  STATION_COORDS,
  subscribeHeatmapRecords,
  formatHour,
  formatTime,
} from "../../utils/heatmap";
import { TIME_SLOTS } from "../../constant/admin";
import { useTranslation } from "react-i18next";

interface CellData {
  count: number;
  lastTime: string;
}

export default function AdminHeatmap() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "th" | "en" | "cn";

  const [allRecords, setAllRecords] = useState<HeatmapRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "today" | "week">("all");
  const [now, setNow] = useState(() => Date.now());
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    station: string;
    slot: string;
    count: number;
    lastTime: string;
    x: number;
    y: number;
  }>({
    visible: false,
    station: "",
    slot: "",
    count: 0,
    lastTime: "",
    x: 0,
    y: 0,
  });

  type StationId = keyof typeof STATION_COORDS;

  useEffect(() => {
    const unsub = subscribeHeatmapRecords((records) => {
      setAllRecords(records);
      setLoading(false);
    });
    return unsub;
  }, []);

  const records = useMemo(() => {
    return allRecords.filter((r) => {
      if (filter === "today") return now - r.timestamp < 86_400_000;
      if (filter === "week") return now - r.timestamp < 7 * 86_400_000;
      return true;
    });
  }, [allRecords, filter, now]);

  const total = records.length;

  const grid = useMemo(() => {
    const result: Record<string, Record<string, CellData>> = {};
    Object.keys(STATION_COORDS).forEach((id) => {
      result[id] = {};
      TIME_SLOTS.forEach((slot) => {
        result[id][slot] = { count: 0, lastTime: "" };
      });
    });
    records.forEach((r) => {
      const slot = formatHour(r.timestamp);
      if (result[r.stationId]?.[slot] !== undefined) {
        result[r.stationId][slot].count += 1;
        result[r.stationId][slot].lastTime = formatTime(r.timestamp);
      }
    });
    return result;
  }, [records]);

  const maxValue = useMemo(() => {
    const vals = Object.values(grid)
      .flatMap((s) => Object.values(s))
      .map((c) => c.count);
    return Math.max(1, ...vals);
  }, [grid]);

  const getColor = (value: number) => {
    if (value === 0) return "transparent";

    const alpha = 0.15 + 0.75 * Math.sqrt(value / maxValue);
    return `rgba(191, 75, 23, ${alpha.toFixed(2)})`;
  };

  const stationIds = Object.keys(STATION_COORDS) as StationId[];

  return (
    <div className="w-full flex flex-col gap-4 py-2 relative">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-bold text-[#543A14]">
            {t("dashboard.tabs.heatmap")}
          </h2>
          <p className="text-[11px] text-[#8B724E] mt-0.5">
            {loading ? t("heatmap.loading") : t("heatmap.summary", { total })}
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "today", "week"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setNow(Date.now());
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                filter === f
                  ? "bg-[#BF4B17] text-white border-[#BF4B17]"
                  : "bg-white text-[#543A14] border-[#C6C6C6]"
              }`}
            >
              {f === "all"
                ? t("heatmap.all")
                : f === "today"
                  ? t("heatmap.today")
                  : t("heatmap.week")}
            </button>
          ))}
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
        <div className="w-full flex flex-col gap-2 relative">
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
                      {STATION_COORDS[id].name[lang] ??
                        STATION_COORDS[id].name.th}
                    </div>
                    {TIME_SLOTS.map((slot) => {
                      const cell = grid[id][slot];
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
                            const rect = (
                              e.currentTarget.closest(
                                ".overflow-x-auto",
                              ) as HTMLElement
                            ).getBoundingClientRect();
                            setTooltip({
                              visible: true,
                              station: STATION_COORDS[id].name[lang],
                              slot,
                              count: value,
                              lastTime: cell.lastTime,
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                            });
                          }}
                          onMouseLeave={() =>
                            setTooltip((t) => ({ ...t, visible: false }))
                          }
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

          {tooltip.visible && (
            <div
              className="pointer-events-none absolute z-50 bg-[#543A14] text-white text-[11px] rounded-xl px-3 py-2 shadow-lg"
              style={{ top: tooltip.y + 12, left: tooltip.x + 8 }}
            >
              <p className="font-bold">{tooltip.station}</p>
              <p className="text-white/70">{tooltip.slot} น.</p>
              <p>{tooltip.count} คน</p>
              {tooltip.lastTime && (
                <p className="text-white/60">
                  {t("heatmap.latest")} {tooltip.lastTime}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 mt-1">
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
