import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useKomeItems } from "../../hooks/useKomeItems";
import {
  addKomeItem,
  updateKomeItem,
  deleteKomeItem,
} from "../../services/kome.services";
import { EMPTY_KOME } from "../../constant/admin";
import type { KomeEditState } from "../../interfaces/admin.interface";

const inputCls =
  "border border-[#C6C6C6] rounded-xl px-3 py-2 text-[13px] text-[#543A14] outline-none placeholder:text-[#C6C6C6] w-full";

export default function AdminKome() {
  const { t } = useTranslation();
  const { items, loading, refetch } = useKomeItems();
  const [form, setForm] = useState(EMPTY_KOME);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState<KomeEditState | null>(null);

  const p = (key: string, lang: "inTh" | "inEn" | "inCn", req = false) =>
    `${t(key)} ${t(`form.${lang}`)}${req ? " *" : ""}`;

  const setName = (lang: "th" | "en" | "cn") => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, name: { ...f.name, [lang]: e.target.value } }));

  const setEditName = (lang: "th" | "en" | "cn") => (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditing((s) => s && { ...s, name: { ...s.name, [lang]: e.target.value } });

  const handleAdd = async () => {
    if (!form.name.th.trim() || !form.name.en.trim() || !form.name.cn.trim() || !form.phone.trim()) {
      setFormError(t("dashboard.errorRequiredGroup"));
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      await addKomeItem({ name: form.name, phone: form.phone.trim() });
      setForm(EMPTY_KOME);
      refetch();
    } catch (e) {
      setFormError(`${t("dashboard.errorSave")}: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setEditing((s) => s && { ...s, saving: true });
    try {
      await updateKomeItem(editing.id, {
        name: editing.name,
        phone: editing.phone.trim(),
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
      await deleteKomeItem(id);
      refetch();
    } catch {
      alert(t("dashboard.errorDelete"));
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-4">
        <h3 className="text-[14px] font-semibold text-[#543A14] mb-3">
          {t("dashboard.addGroup")}
        </h3>
        <div className="flex flex-col gap-y-2">
          <input placeholder={p("form.groupName", "inTh", true)} value={form.name.th} onChange={setName("th")} className={inputCls} />
          <input placeholder={p("form.groupName", "inEn", true)} value={form.name.en} onChange={setName("en")} className={inputCls} />
          <input placeholder={p("form.groupName", "inCn", true)} value={form.name.cn} onChange={setName("cn")} className={inputCls} />
          <input
            placeholder={`${t("form.phone")} *`}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={inputCls}
          />
          {formError && <p className="text-red-500 text-[12px]">{formError}</p>}
          <button
            onClick={handleAdd}
            disabled={saving}
            className="bg-[#BF4B17] text-white text-[13px] font-semibold rounded-full py-2 disabled:opacity-60"
          >
            {saving ? t("dashboard.saving") : t("dashboard.addGroupBtn")}
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
            <div key={item.id} className="bg-white rounded-2xl border border-[#BF4B17] p-4 flex flex-col gap-y-2">
              <p className="text-[12px] font-semibold text-[#BF4B17]">{t("dashboard.edit")}</p>
              <input placeholder={p("form.groupName", "inTh")} value={editing.name.th} onChange={setEditName("th")} className={inputCls} />
              <input placeholder={p("form.groupName", "inEn")} value={editing.name.en} onChange={setEditName("en")} className={inputCls} />
              <input placeholder={p("form.groupName", "inCn")} value={editing.name.cn} onChange={setEditName("cn")} className={inputCls} />
              <input
                value={editing.phone}
                onChange={(e) => setEditing((s) => s && { ...s, phone: e.target.value })}
                placeholder={t("form.phone")}
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
            <div key={item.id} className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-3 flex items-center gap-x-3">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#543A14] truncate">{item.name.th}</p>
                <p className="text-[11px] text-[#8B724E] truncate">{item.name.en}</p>
                <p className="text-[11px] text-[#8B724E]">{item.phone}</p>
              </div>
              <div className="flex gap-x-3 shrink-0">
                <button onClick={() => setEditing({ ...item, saving: false })} className="text-[12px] text-[#543A14] font-medium">
                  {t("dashboard.edit")}
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-[12px] text-red-400 font-medium">
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
