import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEmergencyItems } from "../../hooks/useEmergencyItems";
import {
  addEmergencyItem,
  updateEmergencyItem,
  deleteEmergencyItem,
} from "../../services/contact.services";
import { EMPTY_CONTACT } from "../../constant/admin";
import type { ContactEditState } from "../../interfaces/admin.interface";

const inputCls =
  "border border-[#C6C6C6] rounded-xl px-3 py-2 text-[13px] text-[#543A14] outline-none placeholder:text-[#C6C6C6] w-full";

export default function AdminContact() {
  const { t } = useTranslation();
  const { items, loading, refetch } = useEmergencyItems();
  const [form, setForm] = useState(EMPTY_CONTACT);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState<ContactEditState | null>(null);

  const p = (key: string, lang: "inTh" | "inEn" | "inCn", req = false) =>
    `${t(key)} ${t(`form.${lang}`)}${req ? " *" : ""}`;

  const setML = (field: "header" | "address" | "hours", lang: "th" | "en" | "cn") =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: { ...f[field], [lang]: e.target.value } }));

  const setEditML = (field: "header" | "address" | "hours", lang: "th" | "en" | "cn") =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setEditing((s) => s && { ...s, [field]: { ...s[field], [lang]: e.target.value } });

  const addPhone = () => setForm((f) => ({ ...f, phones: [...f.phones, ""] }));
  const removePhone = (i: number) =>
    setForm((f) => ({ ...f, phones: f.phones.filter((_, idx) => idx !== i) }));
  const setPhone = (i: number, val: string) =>
    setForm((f) => ({ ...f, phones: f.phones.map((p, idx) => (idx === i ? val : p)) }));

  const addEditPhone = () =>
    setEditing((s) => s && { ...s, phones: [...s.phones, ""] });
  const removeEditPhone = (i: number) =>
    setEditing((s) => s && { ...s, phones: s.phones.filter((_, idx) => idx !== i) });
  const setEditPhone = (i: number, val: string) =>
    setEditing((s) => s && { ...s, phones: s.phones.map((p, idx) => (idx === i ? val : p)) });

  const handleAdd = async () => {
    if (!form.header.th.trim() || !form.header.en.trim() || !form.header.cn.trim() || !form.address.th.trim()) {
      setFormError("กรุณากรอกชื่อหน่วยงานครบทั้ง 3 ภาษา และที่อยู่");
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      await addEmergencyItem({
        header: form.header,
        address: form.address,
        hours: form.hours,
        phones: form.phones.filter(Boolean),
      });
      setForm(EMPTY_CONTACT);
      refetch();
    } catch (e) {
      setFormError(`เกิดข้อผิดพลาด: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setEditing((s) => s && { ...s, saving: true });
    try {
      await updateEmergencyItem(editing.id, {
        header: editing.header,
        address: editing.address,
        hours: editing.hours,
        phones: editing.phones.filter(Boolean),
      });
      setEditing(null);
      refetch();
    } catch (e) {
      alert(`เกิดข้อผิดพลาด: ${e instanceof Error ? e.message : String(e)}`);
      setEditing((s) => s && { ...s, saving: false });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบรายการนี้?")) return;
    try {
      await deleteEmergencyItem(id);
      refetch();
    } catch {
      alert("ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-4">
        <h3 className="text-[14px] font-semibold text-[#543A14] mb-3">
          {t("dashboard.addAgency")}
        </h3>
        <div className="flex flex-col gap-y-2">
          <input placeholder={p("form.agencyName", "inTh", true)} value={form.header.th} onChange={setML("header", "th")} className={inputCls} />
          <input placeholder={p("form.agencyName", "inEn", true)} value={form.header.en} onChange={setML("header", "en")} className={inputCls} />
          <input placeholder={p("form.agencyName", "inCn", true)} value={form.header.cn} onChange={setML("header", "cn")} className={inputCls} />

          <input placeholder={p("form.address", "inTh", true)} value={form.address.th} onChange={setML("address", "th")} className={inputCls} />
          <input placeholder={p("form.address", "inEn")} value={form.address.en} onChange={setML("address", "en")} className={inputCls} />
          <input placeholder={p("form.address", "inCn")} value={form.address.cn} onChange={setML("address", "cn")} className={inputCls} />

          <input placeholder={p("form.hours", "inTh")} value={form.hours.th} onChange={setML("hours", "th")} className={inputCls} />
          <input placeholder={p("form.hours", "inEn")} value={form.hours.en} onChange={setML("hours", "en")} className={inputCls} />
          <input placeholder={p("form.hours", "inCn")} value={form.hours.cn} onChange={setML("hours", "cn")} className={inputCls} />

          <p className="text-[12px] text-[#8B724E] font-medium">{t("dashboard.phone")}</p>
          {form.phones.map((ph, i) => (
            <div key={i} className="flex gap-x-2">
              <input placeholder={`เบอร์ ${i + 1}`} value={ph} onChange={(e) => setPhone(i, e.target.value)} className={inputCls} />
              {form.phones.length > 1 && (
                <button onClick={() => removePhone(i)} className="text-red-400 text-[13px] shrink-0 px-2">
                  {t("dashboard.delete")}
                </button>
              )}
            </div>
          ))}
          <button onClick={addPhone} className="text-[12px] text-[#BF4B17] font-medium text-left">
            {t("dashboard.addPhone")}
          </button>
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
            <div key={item.id} className="bg-white rounded-2xl border border-[#BF4B17] p-4 flex flex-col gap-y-2">
              <p className="text-[12px] font-semibold text-[#BF4B17]">{t("dashboard.edit")}</p>

              <input placeholder={p("form.agencyName", "inTh")} value={editing.header.th} onChange={setEditML("header", "th")} className={inputCls} />
              <input placeholder={p("form.agencyName", "inEn")} value={editing.header.en} onChange={setEditML("header", "en")} className={inputCls} />
              <input placeholder={p("form.agencyName", "inCn")} value={editing.header.cn} onChange={setEditML("header", "cn")} className={inputCls} />

              <input placeholder={p("form.address", "inTh")} value={editing.address.th} onChange={setEditML("address", "th")} className={inputCls} />
              <input placeholder={p("form.address", "inEn")} value={editing.address.en} onChange={setEditML("address", "en")} className={inputCls} />
              <input placeholder={p("form.address", "inCn")} value={editing.address.cn} onChange={setEditML("address", "cn")} className={inputCls} />

              <input placeholder={p("form.hours", "inTh")} value={editing.hours.th} onChange={setEditML("hours", "th")} className={inputCls} />
              <input placeholder={p("form.hours", "inEn")} value={editing.hours.en} onChange={setEditML("hours", "en")} className={inputCls} />
              <input placeholder={p("form.hours", "inCn")} value={editing.hours.cn} onChange={setEditML("hours", "cn")} className={inputCls} />

              <p className="text-[12px] text-[#8B724E] font-medium">{t("dashboard.phone")}</p>
              {editing.phones.map((ph, i) => (
                <div key={i} className="flex gap-x-2">
                  <input value={ph} onChange={(e) => setEditPhone(i, e.target.value)} placeholder={`เบอร์ ${i + 1}`} className={inputCls} />
                  {editing.phones.length > 1 && (
                    <button onClick={() => removeEditPhone(i)} className="text-red-400 text-[13px] shrink-0 px-2">
                      {t("dashboard.delete")}
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addEditPhone} className="text-[12px] text-[#BF4B17] font-medium text-left">
                {t("dashboard.addPhone")}
              </button>
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
            <div key={item.id} className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-3 flex items-start gap-x-3">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#543A14]">{item.header.th}</p>
                <p className="text-[11px] text-[#8B724E] truncate">{item.header.en}</p>
                {item.address.th && <p className="text-[11px] text-[#8B724E] truncate">{item.address.th}</p>}
                {item.hours.th && <p className="text-[11px] text-[#8B724E]">{item.hours.th}</p>}
                {item.phones.length > 0 && (
                  <p className="text-[11px] text-[#C6C6C6]">{item.phones.join(", ")}</p>
                )}
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
