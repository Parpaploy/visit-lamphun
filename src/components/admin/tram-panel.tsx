import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTramItems } from "../../hooks/useTravelItems";
import { EMPTY_TRAM } from "../../constant/admin";
import type { TramEdit } from "../../interfaces/admin.interface";
import {
  addTramItem,
  deleteTramItem,
  updateTramItem,
} from "../../services/travel.services";

const inputCls =
  "border border-[#C6C6C6] rounded-xl px-3 py-2 text-[13px] text-[#543A14] outline-none placeholder:text-[#C6C6C6] w-full";

export default function TramPanel() {
  const { t } = useTranslation();
  const { items, loading, refetch } = useTramItems();
  const [form, setForm] = useState(EMPTY_TRAM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState<TramEdit | null>(null);

  const p = (key: string, lang: "inTh" | "inEn" | "inCn", req = false) =>
    `${t(key)} ${t(`form.${lang}`)}${req ? " *" : ""}`;

  const setPlace =
    (lang: "th" | "en" | "cn") => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, place: { ...f.place, [lang]: e.target.value } }));

  const setEditPlace =
    (lang: "th" | "en" | "cn") => (e: React.ChangeEvent<HTMLInputElement>) =>
      setEditing(
        (s) => s && { ...s, place: { ...s.place, [lang]: e.target.value } },
      );

  const handleAdd = async () => {
    if (!form.place.th || !form.place.en || !form.place.cn) {
      setFormError(t("dashboard.errorRequiredTram"));
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      await addTramItem(form);
      setForm(EMPTY_TRAM);
      refetch();
    } catch (e) {
      setFormError(
        `${t("dashboard.errorSave")}: ${e instanceof Error ? e.message : String(e)}`,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setEditing((s) => s && { ...s, saving: true });
    try {
      await updateTramItem(editing.id, {
        place: editing.place,
        round: editing.round,
        time: editing.time,
        price: editing.price,
      });
      setEditing(null);
      refetch();
    } catch (e) {
      alert(`${t("dashboard.errorSave")}: ${e instanceof Error ? e.message : String(e)}`);
      setEditing((s) => s && { ...s, saving: false });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("dashboard.confirmDelete"))) return;
    try {
      await deleteTramItem(id);
      refetch();
    } catch {
      alert(t("dashboard.errorDelete"));
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-4">
        <h3 className="text-[14px] font-semibold text-[#543A14] mb-3">
          {t("dashboard.addTram")}
        </h3>
        <div className="flex flex-col gap-y-2">
          <input
            placeholder={p("form.place", "inTh", true)}
            value={form.place.th}
            onChange={setPlace("th")}
            className={inputCls}
          />
          <input
            placeholder={p("form.place", "inEn", true)}
            value={form.place.en}
            onChange={setPlace("en")}
            className={inputCls}
          />
          <input
            placeholder={p("form.place", "inCn", true)}
            value={form.place.cn}
            onChange={setPlace("cn")}
            className={inputCls}
          />
          <div className="flex justify-center items-center gap-2">
            <select
              value={form.round}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  round: e.target.value as "morning" | "afternoon",
                }))
              }
              className={`${inputCls} bg-white`}
            >
              <option value="morning">{t("form.morning")}</option>
              <option value="afternoon">{t("form.afternoon")}</option>
            </select>
            <input
              placeholder={`${t("form.time")} *`}
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              className={inputCls}
            />
          </div>
          <input
            placeholder={t("form.price")}
            type="number"
            value={form.price === 0 ? "" : form.price}
            onChange={(e) =>
              setForm((f) => ({ ...f, price: Number(e.target.value) }))
            }
            className={inputCls}
          />
          {formError && <p className="text-red-500 text-[12px]">{formError}</p>}
          <button
            onClick={handleAdd}
            disabled={saving}
            className="bg-[#BF4B17] text-white text-[13px] font-semibold rounded-full py-2 disabled:opacity-60"
          >
            {saving ? t("dashboard.saving") : t("dashboard.addItem")}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-[13px] text-[#8B724E]">{t("dashboard.loading")}</p>
      ) : items.length === 0 ? (
        <p className="text-[13px] text-[#C6C6C6]">{t("dashboard.empty")}</p>
      ) : (
        items.map((item) =>
          editing?.id === item.id ? (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#BF4B17] p-4 flex flex-col gap-y-2"
            >
              <p className="text-[12px] font-semibold text-[#BF4B17]">
                {t("dashboard.edit")}
              </p>
              <input
                placeholder={p("form.place", "inTh")}
                value={editing.place.th}
                onChange={setEditPlace("th")}
                className={inputCls}
              />
              <input
                placeholder={p("form.place", "inEn")}
                value={editing.place.en}
                onChange={setEditPlace("en")}
                className={inputCls}
              />
              <input
                placeholder={p("form.place", "inCn")}
                value={editing.place.cn}
                onChange={setEditPlace("cn")}
                className={inputCls}
              />
              <select
                value={editing.round}
                onChange={(e) =>
                  setEditing(
                    (s) =>
                      s && {
                        ...s,
                        round: e.target.value as "morning" | "afternoon",
                      },
                  )
                }
                className={`${inputCls} bg-white`}
              >
                <option value="morning">{t("form.morning")}</option>
                <option value="afternoon">{t("form.afternoon")}</option>
              </select>
              <input
                placeholder={t("form.time")}
                value={editing.time}
                onChange={(e) =>
                  setEditing((s) => s && { ...s, time: e.target.value })
                }
                className={inputCls}
              />
              <input
                type="number"
                value={editing.price === 0 ? "" : editing.price}
                onChange={(e) =>
                  setEditing(
                    (s) => s && { ...s, price: Number(e.target.value) },
                  )
                }
                placeholder={t("form.price")}
                className={inputCls}
              />
              <div className="flex gap-x-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={editing.saving}
                  className="flex-1 bg-[#BF4B17] text-white text-[13px] font-semibold rounded-full py-2 disabled:opacity-60"
                >
                  {t("dashboard.save")}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 border border-[#C6C6C6] text-[#543A14] text-[13px] font-semibold rounded-full py-2"
                >
                  {t("dashboard.cancel")}
                </button>
              </div>
            </div>
          ) : (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-3 flex items-center gap-x-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#543A14] truncate">
                  {item.place.th}
                </p>
                <p className="text-[11px] text-[#8B724E] truncate">
                  {item.place.en}
                </p>
                <p className="text-[11px] text-[#C6C6C6]">
                  {t(`form.${item.round}`)} · {item.time} · {item.price} บาท
                </p>
              </div>
              <div className="flex gap-x-3 shrink-0">
                <button
                  onClick={() => setEditing({ ...item, saving: false })}
                  className="text-[12px] text-[#543A14] font-medium"
                >
                  {t("dashboard.edit")}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-[12px] text-red-400 font-medium"
                >
                  {t("dashboard.delete")}
                </button>
              </div>
            </div>
          ),
        )
      )}
    </div>
  );
}
