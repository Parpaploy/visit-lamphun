import { useTranslation } from "react-i18next";
import type { MLString, OtherItem } from "../../interfaces/content.interface";

const inputCls =
  "border border-[#C6C6C6] rounded-xl px-3 py-2 text-[13px] text-[#543A14] outline-none placeholder:text-[#C6C6C6] w-full";
const selectCls = `${inputCls} bg-white`;

type OtherFormData = Omit<OtherItem, "id">;

export default function OtherForm({
  v,
  ch,
  onSave,
  onCancel,
  saveLabel,
  error,
}: {
  v: OtherFormData;
  ch: (updater: (f: OtherFormData) => OtherFormData) => void;
  onSave: () => void;
  onCancel?: () => void;
  saveLabel: string;
  error?: string;
}) {
  const { t } = useTranslation();

  const setMl =
    (field: keyof Pick<OtherFormData, "place" | "desc" | "desc2">, lang: keyof MLString) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      ch((f) => ({ ...f, [field]: { ...(f[field] as MLString), [lang]: e.target.value } }));

  const p = (key: string, lang: "inTh" | "inEn" | "inCn", req = false) =>
    `${t(key)} ${t(`form.${lang}`)}${req ? " *" : ""}`;

  return (
    <div className="flex flex-col gap-y-2">
      <input placeholder={p("form.place", "inTh", true)} value={v.place.th} onChange={setMl("place", "th")} className={inputCls} />
      <input placeholder={p("form.place", "inEn", true)} value={v.place.en} onChange={setMl("place", "en")} className={inputCls} />
      <input placeholder={p("form.place", "inCn", true)} value={v.place.cn} onChange={setMl("place", "cn")} className={inputCls} />

      <textarea placeholder={p("form.descFull", "inTh")} value={v.desc.th} onChange={setMl("desc", "th")} rows={2} className={`${inputCls} resize-none`} />
      <textarea placeholder={p("form.descFull", "inEn")} value={v.desc.en} onChange={setMl("desc", "en")} rows={2} className={`${inputCls} resize-none`} />
      <textarea placeholder={p("form.descFull", "inCn")} value={v.desc.cn} onChange={setMl("desc", "cn")} rows={2} className={`${inputCls} resize-none`} />

      <textarea placeholder={p("form.desc2", "inTh")} value={v.desc2.th} onChange={setMl("desc2", "th")} rows={2} className={`${inputCls} resize-none`} />
      <textarea placeholder={p("form.desc2", "inEn")} value={v.desc2.en} onChange={setMl("desc2", "en")} rows={2} className={`${inputCls} resize-none`} />
      <textarea placeholder={p("form.desc2", "inCn")} value={v.desc2.cn} onChange={setMl("desc2", "cn")} rows={2} className={`${inputCls} resize-none`} />

      <div className="grid grid-cols-2 gap-2">
        <select
          value={v.type}
          onChange={(e) => ch((f) => ({ ...f, type: e.target.value as OtherItem["type"] }))}
          className={selectCls}
        >
          <option value="van">รถตู้</option>
          <option value="tricycle">สามล้อ</option>
          <option value="songthaew">สองแถว</option>
        </select>
        <select
          value={v.day}
          onChange={(e) => ch((f) => ({ ...f, day: e.target.value as "weekday" | "weekend" }))}
          className={selectCls}
        >
          <option value="weekday">{t("form.weekday")}</option>
          <option value="weekend">{t("form.weekend")}</option>
        </select>
        <input
          placeholder={t("form.phone")}
          value={v.phone}
          onChange={(e) => ch((f) => ({ ...f, phone: e.target.value }))}
          className={inputCls}
        />
        <input
          placeholder={t("form.link")}
          value={v.link}
          onChange={(e) => ch((f) => ({ ...f, link: e.target.value }))}
          className={inputCls}
        />
        {v.type === "van" && (
          <input
            placeholder="LINE link (เพิ่มเพื่อน)"
            value={v.lineLink ?? ""}
            onChange={(e) => ch((f) => ({ ...f, lineLink: e.target.value }))}
            className={`${inputCls} col-span-2`}
          />
        )}
      </div>

      {error && <p className="text-red-500 text-[12px]">{error}</p>}
      <div className="flex gap-x-2">
        <button onClick={onSave} className="flex-1 bg-[#BF4B17] text-white text-[13px] font-semibold rounded-full py-2">
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
