import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SENSOR_DEVICE_ID,
  subscribeSensorRecords,
  type SensorQueryOptions,
  type SensorRecord,
} from "../../services/sensor.services";
import type { FilterType } from "../../interfaces/admin.interface";

type MetricKey =
  | "temp"
  | "hum"
  | "pres"
  | "pm1"
  | "pm25"
  | "pm10"
  | "voc_idx"
  | "gas_r"
  | "lux"
  | "ws_spd"
  | "wd"
  | "spd"
  | "alt"
  | "sat"
  | "hdg";

type ViewMode = "line" | "heatmap";

interface MetricDef {
  key: MetricKey;
  unit: string;
  decimals: number;
}

const METRICS: MetricDef[] = [
  { key: "temp", unit: "°C", decimals: 1 },
  { key: "hum", unit: "%", decimals: 1 },
  { key: "pres", unit: "hPa", decimals: 1 },
  { key: "pm25", unit: "µg/m³", decimals: 0 },
  { key: "pm10", unit: "µg/m³", decimals: 0 },
  { key: "pm1", unit: "µg/m³", decimals: 0 },
  { key: "voc_idx", unit: "", decimals: 0 },
  { key: "gas_r", unit: "kΩ", decimals: 1 },
  { key: "lux", unit: "lx", decimals: 0 },
  { key: "ws_spd", unit: "m/s", decimals: 1 },
  { key: "wd", unit: "°", decimals: 0 },
];

const GPS_METRICS: MetricDef[] = [
  { key: "spd", unit: "km/h", decimals: 1 },
  { key: "alt", unit: "m", decimals: 0 },
  { key: "sat", unit: "", decimals: 0 },
  { key: "hdg", unit: "°", decimals: 0 },
];

const CHART_METRICS: MetricKey[] = [
  "temp",
  "hum",
  "pm25",
  "pm10",
  "pm1",
  "pres",
  "voc_idx",
  "gas_r",
  "lux",
  "ws_spd",
];

/** Fixed color per metric so a line keeps its color when others toggle. */
const METRIC_COLORS: Partial<Record<MetricKey, string>> = {
  temp: "#BF4B17",
  hum: "#2E7DBA",
  pm25: "#8E5BB5",
  pm10: "#D2507A",
  pm1: "#D9A21B",
  pres: "#1A9E9E",
  voc_idx: "#3F9C5A",
  gas_r: "#6B5A3E",
  lux: "#E07B00",
  ws_spd: "#5C6BC0",
};
function metricColor(k: MetricKey) {
  return METRIC_COLORS[k] ?? "#BF4B17";
}

const LIMIT_OPTIONS = [100, 300, 1000, 3000];
/** Max readings pulled for a date filter (~17 days at one reading / 5 min). */
const RANGE_CAP = 5000;
/** Rows rendered in the history table; CSV export has everything. */
const TABLE_CAP = 500;
const OFFLINE_AFTER_MS = 5 * 60 * 1000;
const HOURS = Array.from({ length: 24 }, (_, h) => h);

const CSV_FIELDS: (keyof SensorRecord)[] = [
  "temp",
  "hum",
  "pres",
  "gas_r",
  "lux",
  "voc_raw",
  "voc_idx",
  "pm1",
  "pm25",
  "pm10",
  "ws",
  "ws_spd",
  "wd",
  "lat",
  "lon",
  "alt",
  "spd",
  "sat",
  "hdg",
  "ts",
  "stat",
];

const dateInputCls =
  "border border-[#C6C6C6] rounded-lg px-2 py-1 text-[11px] font-medium text-[#543A14] bg-white outline-none focus:border-[#BF4B17]";

/** Device sends -999 (and -1 for satellites) when a sensor has no value. */
function clean(v: unknown): number | null {
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  if (v <= -999) return null;
  return v;
}

function cleanMetric(r: SensorRecord, key: MetricKey): number | null {
  const v = clean(r[key]);
  if (v === null) return null;
  if (key === "sat" && v < 0) return null;
  return v;
}

function fmt(v: number | null, decimals: number) {
  if (v === null) return "–";
  return v.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function hasGps(r: SensorRecord) {
  return clean(r.lat) !== null && clean(r.lon) !== null;
}

// Thai PCD PM2.5 bands (µg/m³, 24h).
function pm25Color(v: number | null) {
  if (v === null) return "#C6C6C6";
  if (v <= 15) return "#3BA6E0";
  if (v <= 25) return "#4CAF50";
  if (v <= 37.5) return "#F2C230";
  if (v <= 75) return "#F08A24";
  return "#D93B2B";
}

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
function compass(deg: number | null) {
  if (deg === null) return "";
  return COMPASS[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
}

function localeOf(lang: string) {
  if (lang === "th") return "th-TH";
  if (lang === "cn") return "zh-CN";
  return "en-GB";
}

/** Local-time YYYY-MM-DD (matches <input type="date">). */
function localDateKey(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function dayStart(key: string) {
  return new Date(`${key}T00:00:00`).getTime();
}

function dayEnd(key: string) {
  return new Date(`${key}T23:59:59.999`).getTime();
}

/** Readings further apart than this count as a gap and get collapsed. */
const GAP_MS = 30 * 60 * 1000;
const CHART_H = 220;
/** Width given to a single-reading segment (as if it lasted this long). */
const MIN_SEG_MS = 10 * 60 * 1000;
/** Pixel width a data gap collapses to (line stays connected across it). */
const BREAK_PX = 6;
const TICK_SPACING = 140;
const TICK_MIN_GAP = 95;

function SensorChart({
  records,
  metrics,
  locale,
}: {
  records: SensorRecord[]; // oldest -> newest
  metrics: MetricDef[];
  locale: string;
}) {
  const { t } = useTranslation();
  const [wrapEl, setWrapEl] = useState<HTMLDivElement | null>(null);
  const [W, setW] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  // Draw in real pixels so text/line sizes stay constant on wide screens.
  useEffect(() => {
    if (!wrapEl) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(wrapEl);
    return () => ro.disconnect();
  }, [wrapEl]);

  // Rows that have at least one selected value; vals[i] matches metrics[i].
  const rows = useMemo(
    () =>
      records
        .filter((r) => r.receivedAt > 0)
        .map((r) => ({
          t: r.receivedAt,
          vals: metrics.map((m) => cleanMetric(r, m.key)),
        }))
        .filter((p) => p.vals.some((v) => v !== null)),
    [records, metrics],
  );

  const single = metrics.length === 1;
  const H = CHART_H;
  const PAD = { l: single ? 48 : 14, r: 12, t: 14, b: 26 };

  if (rows.length < 2) {
    return (
      <div className="h-55 flex items-center justify-center text-[13px] text-[#8B724E]">
        {t("sensor.noDataInRange")}
      </div>
    );
  }

  // Per-series stats and y-scale (each line uses its own range).
  const series = metrics.map((m, si) => {
    const vs = rows
      .map((r) => r.vals[si])
      .filter((v): v is number => v !== null);
    const min = vs.length ? Math.min(...vs) : 0;
    const max = vs.length ? Math.max(...vs) : 0;
    const avg = vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : 0;
    const span = max - min || Math.abs(max) || 1;
    return {
      m,
      color: metricColor(m.key),
      has: vs.length > 0,
      min,
      max,
      avg,
      yMin: min - span * 0.1,
      yMax: max + span * 0.1,
    };
  });

  const plotW = Math.max(1, W - PAD.l - PAD.r);
  const baseY = H - PAD.b;
  const yOf = (si: number, v: number) => {
    const s = series[si];
    return PAD.t + (1 - (v - s.yMin) / (s.yMax - s.yMin)) * (H - PAD.t - PAD.b);
  };

  // Split into continuous segments at data gaps, then lay them out
  // side by side with a narrow break instead of the real (empty) time.
  const groups: (typeof rows)[] = [];
  rows.forEach((p, i) => {
    if (i === 0 || p.t - rows[i - 1].t > GAP_MS) groups.push([p]);
    else groups[groups.length - 1].push(p);
  });
  const durs = groups.map((g) =>
    Math.max(g[g.length - 1].t - g[0].t, MIN_SEG_MS),
  );
  const totalDur = durs.reduce((a, b) => a + b, 0);
  const gapPx =
    groups.length > 1
      ? Math.min(BREAK_PX, (plotW * 0.3) / (groups.length - 1))
      : 0;
  const scale = (plotW - gapPx * (groups.length - 1)) / totalDur;
  let cursor = PAD.l;
  const segments = groups.map((pts, i) => {
    const w = durs[i] * scale;
    const seg = { t0: pts[0].t, x0: cursor, x1: cursor + w };
    cursor += w + gapPx;
    return seg;
  });
  const segOf = (tt: number) => {
    let s = segments[0];
    for (const seg of segments) if (seg.t0 <= tt) s = seg;
    return s;
  };
  const x = (tt: number) => {
    const s = segOf(tt);
    return Math.min(s.x1, s.x0 + (tt - s.t0) * scale);
  };
  const seriesPts = (si: number) =>
    rows
      .filter((r) => r.vals[si] !== null)
      .map((r) => ({ x: x(r.t), y: yOf(si, r.vals[si] as number) }));
  const linePath = (pts: { x: number; y: number }[]) =>
    pts
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
      )
      .join(" ");

  const gridFractions = [0, 1 / 3, 2 / 3, 1];
  const tFirst = rows[0].t;
  const tLast = rows[rows.length - 1].t;
  const sameDay =
    new Date(tFirst).toDateString() === new Date(tLast).toDateString();
  const tickLabel = (tt: number) =>
    new Date(tt).toLocaleString(locale, {
      ...(sameDay ? {} : { day: "numeric", month: "short" }),
      hour: "2-digit",
      minute: "2-digit",
    });
  // A label at the start of every segment, plus evenly spaced ones inside
  // long segments; drop any that would overlap the previous one.
  const xTicks: { t: number; x: number }[] = [];
  segments.forEach((seg) => {
    const n = Math.floor((seg.x1 - seg.x0) / TICK_SPACING);
    for (let k = 0; k <= n; k++) {
      const px = seg.x0 + k * TICK_SPACING;
      const tt = seg.t0 + (px - seg.x0) / scale;
      const prev = xTicks[xTicks.length - 1];
      if (!prev || px - prev.x >= TICK_MIN_GAP) xTicks.push({ t: tt, x: px });
    }
  });

  const onMove = (clientX: number) => {
    if (!wrapEl) return;
    const sx = clientX - wrapEl.getBoundingClientRect().left;
    let best = 0;
    let bestD = Infinity;
    rows.forEach((p, i) => {
      const d = Math.abs(x(p.t) - sx);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setHover(best);
  };

  const hp = hover !== null ? rows[hover] : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-[#8B724E]">
        {series.map((s) => (
          <div key={s.m.key} className="flex items-center gap-1.5">
            {!single && (
              <span
                className="w-3 h-0.75 rounded-full"
                style={{ backgroundColor: s.color }}
              />
            )}
            {!single && (
              <span className="font-semibold text-[#543A14]">
                {t(`sensor.m.${s.m.key}`)}
              </span>
            )}
            {s.has ? (
              <>
                <span>
                  {t("sensor.min")}{" "}
                  <b className="text-[#543A14]">{fmt(s.min, s.m.decimals)}</b>
                </span>
                <span>
                  {t("sensor.avg")}{" "}
                  <b className="text-[#543A14]">{fmt(s.avg, s.m.decimals)}</b>
                </span>
                <span>
                  {t("sensor.max")}{" "}
                  <b className="text-[#543A14]">{fmt(s.max, s.m.decimals)}</b>
                </span>
                {s.m.unit && <span>{s.m.unit}</span>}
              </>
            ) : (
              <span>–</span>
            )}
          </div>
        ))}
      </div>
      {!single && (
        <p className="text-[10px] text-[#8B724E]/80">{t("sensor.ownScale")}</p>
      )}
      <div ref={setWrapEl} className="relative w-full" style={{ height: H }}>
        {W > 0 && (
          <svg
            width={W}
            height={H}
            className="block touch-none"
            onMouseMove={(e) => onMove(e.clientX)}
            onMouseLeave={() => setHover(null)}
            onTouchMove={(e) => onMove(e.touches[0].clientX)}
            onTouchEnd={() => setHover(null)}
          >
            {gridFractions.map((f, i) => {
              const gy = PAD.t + (1 - f) * (H - PAD.t - PAD.b);
              const s = series[0];
              return (
                <g key={i}>
                  <line
                    x1={PAD.l}
                    x2={W - PAD.r}
                    y1={gy}
                    y2={gy}
                    stroke="#E8E4DC"
                    strokeDasharray={i === 0 ? undefined : "3 3"}
                  />
                  {single && (
                    <text
                      x={PAD.l - 6}
                      y={gy + 3}
                      textAnchor="end"
                      fontSize="10"
                      fill="#8B724E"
                    >
                      {fmt(s.yMin + (s.yMax - s.yMin) * f, s.m.decimals)}
                    </text>
                  )}
                </g>
              );
            })}
            {xTicks.map((tk, i) => (
              <text
                key={i}
                x={tk.x}
                y={H - 8}
                fontSize="10"
                fill="#8B724E"
                textAnchor={tk.x > W - PAD.r - 50 ? "end" : "start"}
              >
                {tickLabel(tk.t)}
              </text>
            ))}
            {series.map((s, si) => {
              const pts = seriesPts(si);
              if (pts.length === 0) return null;
              return (
                <g key={s.m.key}>
                  {single && pts.length > 1 && (
                    <path
                      d={`${linePath(pts)} L${pts[pts.length - 1].x.toFixed(1)},${baseY} L${pts[0].x.toFixed(1)},${baseY} Z`}
                      fill={s.color}
                      fillOpacity={0.1}
                    />
                  )}
                  <path
                    d={linePath(pts)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
            {hp && (
              <g>
                <line
                  x1={x(hp.t)}
                  x2={x(hp.t)}
                  y1={PAD.t}
                  y2={baseY}
                  stroke="#543A14"
                  strokeOpacity="0.3"
                />
                {hp.vals.map((v, si) =>
                  v === null ? null : (
                    <circle
                      key={si}
                      cx={x(hp.t)}
                      cy={yOf(si, v)}
                      r="3.5"
                      fill={series[si].color}
                      stroke="white"
                      strokeWidth="2"
                    />
                  ),
                )}
              </g>
            )}
          </svg>
        )}
        {hp && W > 0 && (
          <div
            className="absolute top-0 z-10 pointer-events-none bg-[#543A14] text-white text-[11px] rounded-lg px-2.5 py-1.5 whitespace-nowrap -translate-x-1/2 shadow-lg"
            style={{
              left: Math.min(W - 100, Math.max(100, x(hp.t))),
            }}
          >
            <p className="text-white/70 mb-0.5">
              {new Date(hp.t).toLocaleString(locale, {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
            {series.map((s, si) => (
              <p key={s.m.key} className="flex items-center gap-1.5">
                {!single && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                )}
                {!single && <span>{t(`sensor.m.${s.m.key}`)}</span>}
                <b className="ml-auto pl-2">
                  {fmt(hp.vals[si], s.m.decimals)} {s.m.unit}
                </b>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface HourCell {
  sum: number;
  count: number;
  min: number;
  max: number;
}

function SensorHeatmap({
  records,
  metric,
  locale,
}: {
  records: SensorRecord[];
  metric: MetricDef;
  locale: string;
}) {
  const { t } = useTranslation();
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    date: string;
    hour: number;
    cell: HourCell;
  } | null>(null);

  useEffect(() => {
    const hide = () => setTooltip(null);
    window.addEventListener("scroll", hide, true);
    return () => window.removeEventListener("scroll", hide, true);
  }, []);

  const { days, grid, minAvg, maxAvg } = useMemo(() => {
    const grid: Record<string, Record<number, HourCell>> = {};
    records.forEach((r) => {
      const v = cleanMetric(r, metric.key);
      if (v === null || !r.receivedAt) return;
      const d = new Date(r.receivedAt);
      const key = localDateKey(d);
      const h = d.getHours();
      const row = (grid[key] ??= {});
      const c = row[h];
      if (c) {
        c.sum += v;
        c.count += 1;
        c.min = Math.min(c.min, v);
        c.max = Math.max(c.max, v);
      } else {
        row[h] = { sum: v, count: 1, min: v, max: v };
      }
    });
    const avgs = Object.values(grid).flatMap((row) =>
      Object.values(row).map((c) => c.sum / c.count),
    );
    return {
      days: Object.keys(grid).sort().reverse(),
      grid,
      minAvg: avgs.length ? Math.min(...avgs) : 0,
      maxAvg: avgs.length ? Math.max(...avgs) : 0,
    };
  }, [records, metric.key]);

  if (days.length === 0) {
    return (
      <div className="h-50 flex items-center justify-center text-[13px] text-[#8B724E]">
        {t("sensor.noDataInRange")}
      </div>
    );
  }

  const getColor = (avg: number) => {
    const f = maxAvg === minAvg ? 1 : (avg - minAvg) / (maxAvg - minAvg);
    return `rgba(191, 75, 23, ${(0.12 + 0.78 * f).toFixed(2)})`;
  };
  const cellDecimals = Math.min(metric.decimals, 1);
  const dayLabel = (key: string) =>
    new Date(`${key}T00:00:00`).toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] text-[#8B724E]">{t("sensor.hourAxis")}</p>
      <div className="overflow-auto max-h-120">
        <div className="min-w-200">
          <div className="flex gap-1 mb-1 sticky top-0 bg-white z-1">
            <div className="w-24 shrink-0" />
            {HOURS.map((h) => (
              <div
                key={h}
                className="flex-1 text-center text-[10px] font-semibold text-[#8B724E]"
              >
                {String(h).padStart(2, "0")}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {days.map((day) => (
              <div key={day} className="flex gap-1 items-center">
                <div className="w-24 shrink-0 text-[11px] font-medium text-[#543A14] text-right pr-2 leading-tight">
                  {dayLabel(day)}
                </div>
                {HOURS.map((h) => {
                  const cell = grid[day][h];
                  const avg = cell ? cell.sum / cell.count : null;
                  return (
                    <div
                      key={h}
                      className={`flex-1 h-9 border border-[#E8E4DC] rounded flex items-center justify-center ${
                        cell ? "cursor-pointer" : ""
                      }`}
                      style={{
                        backgroundColor:
                          avg !== null ? getColor(avg) : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!cell) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                          date: dayLabel(day),
                          hour: h,
                          cell,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      {avg !== null ? (
                        <span className="text-[9px] text-white/90 font-semibold leading-none">
                          {fmt(avg, cellDecimals)}
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

      <div className="flex items-center justify-end gap-2 mt-1">
        <span className="text-[10px] text-[#8B724E]">
          {fmt(minAvg, metric.decimals)} {metric.unit}
        </span>
        <div className="flex gap-0.5">
          {[0.12, 0.3, 0.5, 0.7, 0.9].map((a) => (
            <div
              key={a}
              className="w-5 h-3 rounded-sm"
              style={{ backgroundColor: `rgba(191,75,23,${a})` }}
            />
          ))}
        </div>
        <span className="text-[10px] text-[#8B724E]">
          {fmt(maxAvg, metric.decimals)} {metric.unit}
        </span>
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 bg-[#543A14] text-white text-[11px] rounded-xl px-3 py-2 shadow-lg -translate-x-1/2 -translate-y-full"
          style={{ top: tooltip.y - 8, left: tooltip.x }}
        >
          <p className="font-bold">
            {tooltip.date} · {String(tooltip.hour).padStart(2, "0")}:00–
            {String(tooltip.hour).padStart(2, "0")}:59
          </p>
          <p>
            {t("sensor.avg")}{" "}
            <b>
              {fmt(tooltip.cell.sum / tooltip.cell.count, metric.decimals)}{" "}
              {metric.unit}
            </b>
          </p>
          <p className="text-white/70">
            {t("sensor.min")} {fmt(tooltip.cell.min, metric.decimals)} ·{" "}
            {t("sensor.max")} {fmt(tooltip.cell.max, metric.decimals)}
          </p>
          <p className="text-white/60">
            {t("sensor.samples", { n: tooltip.cell.count })}
          </p>
        </div>
      )}
    </div>
  );
}

export default function AdminSensor() {
  const { t, i18n } = useTranslation();
  const locale = localeOf(i18n.language);

  // Latest reading (always live, independent of the filter) for status/cards.
  const [latest, setLatest] = useState<SensorRecord | null>(null);
  const [latestLoaded, setLatestLoaded] = useState(false);

  // Filter, same shape as the users-by-location heatmap.
  const [filter, setFilter] = useState<FilterType>("all");
  const [max, setMax] = useState<number>(300);
  const [singleDate, setSingleDate] = useState<string>(() =>
    localDateKey(new Date()),
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [records, setRecords] = useState<SensorRecord[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  // Selected metrics for the chart (line view can overlay several; the
  // heatmap shows one at a time).
  const [chartKeys, setChartKeys] = useState<MetricKey[]>(["temp"]);
  const [view, setView] = useState<ViewMode>("line");
  const [now, setNow] = useState(() => Date.now());

  const queryOpts: SensorQueryOptions = useMemo(() => {
    if (filter === "today" && singleDate) {
      return {
        max: RANGE_CAP,
        start: dayStart(singleDate),
        end: dayEnd(singleDate),
      };
    }
    if (filter === "custom" && (startDate || endDate)) {
      return {
        max: RANGE_CAP,
        start: startDate ? dayStart(startDate) : undefined,
        end: endDate ? dayEnd(endDate) : undefined,
      };
    }
    return { max };
  }, [filter, singleDate, startDate, endDate, max]);
  const queryKey = JSON.stringify(queryOpts);
  const loading = loadedKey !== queryKey;

  useEffect(() => {
    return subscribeSensorRecords(
      { max: 1 },
      (rs) => {
        setLatest(rs[0] ?? null);
        setLatestLoaded(true);
      },
      () => setLatestLoaded(true),
    );
  }, []);

  useEffect(() => {
    const opts: SensorQueryOptions = JSON.parse(queryKey);
    return subscribeSensorRecords(
      opts,
      (rs) => {
        setRecords(rs);
        setLoadedKey(queryKey);
      },
      () => {
        setRecords([]);
        setLoadedKey(queryKey);
      },
    );
  }, [queryKey]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const chronological = useMemo(() => [...records].reverse(), [records]);
  const isOnline = !!latest && now - latest.receivedAt < OFFLINE_AFTER_MS;
  const chartMetrics = useMemo(
    () =>
      chartKeys
        .map((k) => METRICS.find((m) => m.key === k))
        .filter((m): m is MetricDef => !!m),
    [chartKeys],
  );
  const heatmapMetric = chartMetrics[0] ?? METRICS[0];
  const isSelected = (k: MetricKey) =>
    view === "heatmap" ? heatmapMetric.key === k : chartKeys.includes(k);
  const toggleMetric = (k: MetricKey) => {
    if (view === "heatmap") {
      setChartKeys((ks) => [k, ...ks.filter((x) => x !== k)]);
      return;
    }
    setChartKeys((ks) =>
      ks.includes(k)
        ? ks.length > 1
          ? ks.filter((x) => x !== k)
          : ks
        : [...ks, k],
    );
  };
  const capped = queryOpts.max === RANGE_CAP && records.length >= RANGE_CAP;

  const fmtTime = (ms: number) =>
    ms
      ? new Date(ms).toLocaleString(locale, {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "–";

  const exportCsv = () => {
    if (records.length === 0) return;
    const header = ["receivedAt", ...CSV_FIELDS];
    const rows = chronological.map((r) =>
      [
        r.receivedAt ? new Date(r.receivedAt).toISOString() : "",
        ...CSV_FIELDS.map((f) => r[f] ?? ""),
      ].join(","),
    );
    const blob = new Blob(
      [
        new Uint8Array([0xef, 0xbb, 0xbf]),
        [header.join(","), ...rows].join("\n"),
      ],
      { type: "text/csv;charset=utf-8" },
    );
    let suffix = `latest-${records.length}`;
    if (filter === "today" && singleDate) suffix = singleDate;
    else if (filter === "custom" && (startDate || endDate))
      suffix = `${startDate || "start"}_to_${endDate || "now"}`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sensor-${SENSOR_DEVICE_ID}-${suffix}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!latestLoaded) {
    return (
      <div className="text-[13px] text-[#8B724E] py-10 text-center">
        {t("sensor.loading")}
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-8 text-center text-[13px] text-[#8B724E]">
        {t("sensor.noData")}
      </div>
    );
  }

  const lat = clean(latest.lat);
  const lon = clean(latest.lon);
  const pm25 = cleanMetric(latest, "pm25");
  const wd = cleanMetric(latest, "wd");
  const tableRows = records.slice(0, TABLE_CAP);

  return (
    <div className="flex flex-col gap-4 pb-10">
      {/* Title + filter (same pattern as users-by-location heatmap) */}
      <div className="flex flex-col gap-3 border-b border-[#E8E4DC] pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-[#543A14]">
            {t("sensor.title")}
          </h2>
          <p className="text-[11px] text-[#8B724E] mt-0.5">
            {loading
              ? t("sensor.loading")
              : t("sensor.summary", { total: records.length })}
          </p>
        </div>

        <div className="flex flex-col flex-wrap items-end justify-center gap-3">
          <div className="flex flex-wrap justify-end items-center gap-3">
            <button
              onClick={exportCsv}
              disabled={records.length === 0}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 transition-all shadow-sm ${
                records.length > 0
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
              {t("sensor.exportCsv")}
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

          {filter === "all" && (
            <div className="flex items-center gap-1.5 animate-fadeIn">
              <span className="text-[11px] text-[#8B724E]">
                {t("sensor.showing")}
              </span>
              <select
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className={dateInputCls}
              >
                {LIMIT_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n.toLocaleString()} {t("sensor.records")}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filter === "today" && (
            <div className="flex items-center gap-1.5 animate-fadeIn">
              <span className="text-[11px] text-[#8B724E]">
                {t("heatmap.date")}:
              </span>
              <input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className={dateInputCls}
              />
            </div>
          )}

          {filter === "custom" && (
            <div className="flex items-center gap-1.5 animate-fadeIn">
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                className={dateInputCls}
              />
              <span className="text-[11px] text-[#8B724E]">
                {t("heatmap.to")}
              </span>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className={dateInputCls}
              />
            </div>
          )}
        </div>
      </div>

      {capped && (
        <div className="bg-[#FFF4E5] border border-[#F2C230]/60 rounded-xl px-3 py-2 text-[12px] text-[#8B5A00]">
          {t("sensor.capped", { n: RANGE_CAP.toLocaleString() })}
        </div>
      )}

      {/* Device status */}
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isOnline ? "bg-[#4CAF50] animate-pulse" : "bg-[#C6C6C6]"
            }`}
          />
          <span className="text-[13px] font-semibold text-[#543A14]">
            {isOnline ? t("sensor.online") : t("sensor.offline")}
          </span>
        </div>
        <div className="text-[12px] text-[#8B724E]">
          {t("sensor.device")}:{" "}
          <span className="font-mono text-[#543A14]">
            {latest.devid ?? SENSOR_DEVICE_ID}
          </span>
        </div>
        <div className="text-[12px] text-[#8B724E]">
          {t("sensor.lastUpdate")}:{" "}
          <span className="text-[#543A14]">{fmtTime(latest.receivedAt)}</span>
        </div>
      </div>

      {/* Latest values */}
      <div>
        <h3 className="text-[14px] font-bold text-[#543A14] mb-2">
          {t("sensor.latest")}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {METRICS.map((m) => {
            const v = cleanMetric(latest, m.key);
            const chartable = CHART_METRICS.includes(m.key);
            const selected = chartable && isSelected(m.key);
            return (
              <button
                key={m.key}
                disabled={!chartable}
                onClick={() => chartable && toggleMetric(m.key)}
                className={`text-left bg-white border rounded-2xl p-3 shadow-sm transition-colors ${
                  selected ? "ring-2" : "border-[#E8E4DC]"
                } ${chartable ? "cursor-pointer" : "cursor-default"}`}
                style={
                  selected
                    ? {
                        borderColor: metricColor(m.key),
                        ["--tw-ring-color" as string]: `${metricColor(m.key)}33`,
                      }
                    : undefined
                }
              >
                <div className="flex items-center gap-1.5 text-[11px] text-[#8B724E]">
                  {m.key === "pm25" && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: pm25Color(pm25) }}
                    />
                  )}
                  {t(`sensor.m.${m.key}`)}
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[20px] font-bold text-[#543A14] leading-none">
                    {fmt(v, m.decimals)}
                  </span>
                  <span className="text-[11px] text-[#8B724E]">
                    {m.unit}
                    {m.key === "wd" && wd !== null ? ` ${compass(wd)}` : ""}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart / heatmap */}
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <h3 className="text-[14px] font-bold text-[#543A14]">
            {t("sensor.trend")}:{" "}
            {(view === "heatmap" ? [heatmapMetric] : chartMetrics)
              .map((m) => t(`sensor.m.${m.key}`))
              .join(", ")}
          </h3>
          <div className="flex bg-[#F2EFE8] rounded-full p-0.5">
            {(["line", "heatmap"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                  view === v
                    ? "bg-white text-[#BF4B17] shadow-sm"
                    : "text-[#8B724E]"
                }`}
              >
                {v === "line" ? t("sensor.lineChart") : t("sensor.heatmap")}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1 mb-1">
          {CHART_METRICS.map((k) => {
            const on = isSelected(k);
            return (
              <button
                key={k}
                onClick={() => toggleMetric(k)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] border whitespace-nowrap transition-colors ${
                  on ? "text-white" : "bg-white text-[#543A14] border-[#C6C6C6]"
                }`}
                style={
                  on
                    ? {
                        backgroundColor: metricColor(k),
                        borderColor: metricColor(k),
                      }
                    : undefined
                }
              >
                {t(`sensor.m.${k}`)}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-[#8B724E]/80 mb-3">
          {view === "heatmap"
            ? t("sensor.heatmapSingleHint")
            : t("sensor.multiHint")}
        </p>
        {loading ? (
          <div className="h-50 flex items-center justify-center text-[13px] text-[#8B724E]">
            {t("sensor.loading")}
          </div>
        ) : view === "line" ? (
          <SensorChart
            records={chronological}
            metrics={chartMetrics}
            locale={locale}
          />
        ) : (
          <SensorHeatmap
            records={records}
            metric={heatmapMetric}
            locale={locale}
          />
        )}
      </div>

      {/* GPS */}
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <div className="flex flex-col gap-1 md:min-w-56">
          <h3 className="text-[14px] font-bold text-[#543A14]">
            {t("sensor.m.gps")}
          </h3>
          {lat !== null && lon !== null ? (
            <>
              <span className="font-mono text-[13px] text-[#543A14]">
                {lat.toFixed(6)}, {lon.toFixed(6)}
              </span>
              <a
                href={`https://www.google.com/maps?q=${lat},${lon}`}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] text-[#BF4B17] underline w-fit"
              >
                {t("sensor.openMap")}
              </a>
            </>
          ) : (
            <span className="text-[13px] text-[#8B724E]">
              {t("sensor.noGps")}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1">
          {GPS_METRICS.map((m) => (
            <div key={m.key} className="bg-[#FBFCF0] rounded-xl p-2">
              <div className="text-[11px] text-[#8B724E]">
                {t(`sensor.m.${m.key}`)}
              </div>
              <div className="text-[15px] font-semibold text-[#543A14]">
                {fmt(cleanMetric(latest, m.key), m.decimals)}{" "}
                <span className="text-[11px] font-normal text-[#8B724E]">
                  {m.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History table */}
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-4 shadow-sm">
        <h3 className="text-[14px] font-bold text-[#543A14] mb-1">
          {t("sensor.history")}{" "}
          <span className="font-normal text-[12px] text-[#8B724E]">
            ({records.length.toLocaleString()} {t("sensor.records")})
          </span>
        </h3>
        {records.length > TABLE_CAP && (
          <p className="text-[11px] text-[#8B724E] mb-2">
            {t("sensor.tableCapped", { n: TABLE_CAP })}
          </p>
        )}
        {!loading && records.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-[#8B724E]">
            {t("sensor.noDataInRange")}
          </div>
        ) : (
          <div className="overflow-auto max-h-120 mt-2">
            <table className="w-full text-[12px] text-[#543A14] whitespace-nowrap">
              <thead className="sticky top-0 bg-white">
                <tr className="text-[#8B724E] border-b border-[#E8E4DC]">
                  <th className="text-left font-semibold py-2 pr-3">
                    {t("sensor.time")}
                  </th>
                  {METRICS.map((m) => (
                    <th
                      key={m.key}
                      className="text-right font-semibold py-2 px-2"
                    >
                      {t(`sensor.m.${m.key}`)}
                      {m.unit && (
                        <span className="font-normal"> ({m.unit})</span>
                      )}
                    </th>
                  ))}
                  <th className="text-left font-semibold py-2 pl-3">GPS</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-[#F2EFE8] hover:bg-[#FBFCF0]"
                  >
                    <td className="py-1.5 pr-3">{fmtTime(r.receivedAt)}</td>
                    {METRICS.map((m) => (
                      <td key={m.key} className="text-right py-1.5 px-2">
                        {fmt(cleanMetric(r, m.key), m.decimals)}
                      </td>
                    ))}
                    <td className="py-1.5 pl-3 font-mono text-[11px]">
                      {hasGps(r)
                        ? `${r.lat!.toFixed(5)}, ${r.lon!.toFixed(5)}`
                        : "–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
