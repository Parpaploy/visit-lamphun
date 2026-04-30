import { useTranslation } from "react-i18next";
import type { MLString, TrainItem } from "../../interfaces/content.interface";

const inputCls =
  "border border-[#C6C6C6] rounded-xl px-3 py-2 text-[13px] text-[#543A14] outline-none placeholder:text-[#C6C6C6] w-full";
const selectCls = `${inputCls} bg-white`;

type TrainFormData = Omit<TrainItem, "id">;

export default function TrainForm({
  val: v,
  onChange: ch,
  onSave,
  onCancel,
  saveLabel,
  error,
}: {
  val: TrainFormData;
  onChange: (updater: (f: TrainFormData) => TrainFormData) => void;
  onSave: () => void;
  onCancel?: () => void;
  saveLabel: string;
  error?: string;
}) {
  const { t } = useTranslation();

  const setMl =
    (
      field: keyof Pick<TrainFormData, "origin" | "destination" | "originStation" | "destinationStation" | "desc">,
      lang: keyof MLString,
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      ch((f) => ({ ...f, [field]: { ...(f[field] as MLString), [lang]: e.target.value } }));

  const setStr =
    (field: "originTime" | "destinationTime") =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      ch((f) => ({ ...f, [field]: e.target.value }));

  const p = (key: string, lang: "inTh" | "inEn" | "inCn", req = false) =>
    `${t(key)} ${t(`form.${lang}`)}${req ? " *" : ""}`;

  return (
    <div className="flex flex-col gap-y-2">
      <div className="w-full flex justify-center items-center gap-2">
        <div className="w-full flex flex-col justify-center items-center gap-2">
          <input placeholder={p("form.origin", "inTh", true)} value={v.origin.th} onChange={setMl("origin", "th")} className={inputCls} />
          <input placeholder={p("form.origin", "inEn", true)} value={v.origin.en} onChange={setMl("origin", "en")} className={inputCls} />
          <input placeholder={p("form.origin", "inCn", true)} value={v.origin.cn} onChange={setMl("origin", "cn")} className={inputCls} />
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-2">
          <input placeholder={p("form.destination", "inTh", true)} value={v.destination.th} onChange={setMl("destination", "th")} className={inputCls} />
          <input placeholder={p("form.destination", "inEn", true)} value={v.destination.en} onChange={setMl("destination", "en")} className={inputCls} />
          <input placeholder={p("form.destination", "inCn", true)} value={v.destination.cn} onChange={setMl("destination", "cn")} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input placeholder={`${t("form.originTime")} *`} value={v.originTime} onChange={setStr("originTime")} className={inputCls} />
        <input placeholder={`${t("form.destinationTime")} *`} value={v.destinationTime} onChange={setStr("destinationTime")} className={inputCls} />

        <input placeholder={p("form.originStation", "inTh")} value={v.originStation.th} onChange={setMl("originStation", "th")} className={inputCls} />
        <input placeholder={p("form.originStation", "inEn")} value={v.originStation.en} onChange={setMl("originStation", "en")} className={inputCls} />
        <input placeholder={p("form.originStation", "inCn")} value={v.originStation.cn} onChange={setMl("originStation", "cn")} className={inputCls} />

        <input placeholder={p("form.destinationStation", "inTh")} value={v.destinationStation.th} onChange={setMl("destinationStation", "th")} className={inputCls} />
        <input placeholder={p("form.destinationStation", "inEn")} value={v.destinationStation.en} onChange={setMl("destinationStation", "en")} className={inputCls} />
        <input placeholder={p("form.destinationStation", "inCn")} value={v.destinationStation.cn} onChange={setMl("destinationStation", "cn")} className={inputCls} />

        <input
          placeholder={t("form.price")}
          type="number"
          value={v.price}
          onChange={(e) => ch((f) => ({ ...f, price: Number(e.target.value) }))}
          className={inputCls}
        />
        <select
          value={v.day}
          onChange={(e) => ch((f) => ({ ...f, day: e.target.value as "weekday" | "weekend" }))}
          className={selectCls}
        >
          <option value="weekday">{t("form.weekday")}</option>
          <option value="weekend">{t("form.weekend")}</option>
        </select>
      </div>

      <input placeholder={p("form.desc", "inTh")} value={v.desc.th} onChange={setMl("desc", "th")} className={inputCls} />
      <input placeholder={p("form.desc", "inEn")} value={v.desc.en} onChange={setMl("desc", "en")} className={inputCls} />
      <input placeholder={p("form.desc", "inCn")} value={v.desc.cn} onChange={setMl("desc", "cn")} className={inputCls} />

      {error && <p className="text-red-500 text-[12px]">{error}</p>}
      <div className="flex gap-x-2">
        <button onClick={onSave} className="flex-1 bg-[#BF4B17] text-white text-[13px] font-semibold rounded-full py-2 disabled:opacity-60">
          {saveLabel}
        </button>
        {onCancel && (
          <button onClick={onCancel} className="flex-1 border border-[#C6C6C6] text-[#543A14] text-[13px] font-semibold rounded-full py-2">
            {t("dashboard.cancel")}
          </button>
        )}
      </div>
    </div>
  );
}
