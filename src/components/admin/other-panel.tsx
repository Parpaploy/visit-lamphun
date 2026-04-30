import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOtherItems } from "../../hooks/useTravelItems";
import { EMPTY_OTHER, typeLabel } from "../../constant/admin";
import type { OtherItem } from "../../interfaces/content.interface";
import {
  addOtherItem,
  deleteOtherItem,
  updateOtherItem,
} from "../../services/travel.services";
import type { OtherEdit } from "../../interfaces/admin.interface";
import OtherForm from "./other-form";

type OtherFormData = Omit<OtherItem, "id">;

export default function OtherPanel() {
  const { t } = useTranslation();
  const { items, loading, refetch } = useOtherItems();
  const [form, setForm] = useState<OtherFormData>(EMPTY_OTHER);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState<OtherEdit | null>(null);

  const handleAdd = async () => {
    if (!form.place.th || !form.place.en || !form.place.cn) {
      setFormError("กรุณากรอกสถานที่ครบทั้ง 3 ภาษา");
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      await addOtherItem(form);
      setForm(EMPTY_OTHER);
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
      await updateOtherItem(editing.id, {
        place: editing.place,
        desc: editing.desc,
        desc2: editing.desc2,
        type: editing.type,
        phone: editing.phone,
        link: editing.link,
        day: editing.day,
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
      await deleteOtherItem(id);
      refetch();
    } catch {
      alert("ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-4">
        <h3 className="text-[14px] font-semibold text-[#543A14] mb-3">
          เพิ่มการเดินทางอื่นๆ
        </h3>
        <OtherForm
          v={form}
          ch={(updater) => setForm(updater)}
          onSave={handleAdd}
          saveLabel={saving ? t("dashboard.saving") : t("dashboard.addItem")}
          error={formError}
        />
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
              <OtherForm
                v={{
                  place: editing.place,
                  desc: editing.desc,
                  desc2: editing.desc2,
                  type: editing.type,
                  phone: editing.phone,
                  link: editing.link,
                  day: editing.day,
                }}
                ch={(updater) =>
                  setEditing((s) => {
                    if (!s) return null;
                    return { ...s, ...updater(s) };
                  })
                }
                onSave={handleSaveEdit}
                onCancel={() => setEditing(null)}
                saveLabel={editing.saving ? t("dashboard.saving") : t("dashboard.save")}
              />
            </div>
          ) : (
            <div key={item.id} className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-3 flex items-start gap-x-3">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#543A14] truncate">
                  {item.place.th}
                </p>
                <p className="text-[11px] text-[#8B724E]">
                  {item.place.en} · {typeLabel(item.type)} · {item.day === "weekday" ? "วันธรรมดา" : "วันหยุด"}
                </p>
                {item.desc.th && (
                  <p className="text-[11px] text-[#C6C6C6] line-clamp-1">{item.desc.th}</p>
                )}
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
