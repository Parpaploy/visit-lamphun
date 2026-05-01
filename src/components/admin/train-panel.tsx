import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTrainItems } from "../../hooks/useTravelItems";
import { EMPTY_TRAIN } from "../../constant/admin";
import type { TrainEdit } from "../../interfaces/admin.interface";
import type { TrainItem } from "../../interfaces/content.interface";
import {
  addTrainItem,
  deleteTrainItem,
  updateTrainItem,
} from "../../services/travel.services";
import TrainForm from "./train-form";

type TrainFormData = Omit<TrainItem, "id">;

export default function TrainPanel() {
  const { t } = useTranslation();
  const { items, loading, refetch } = useTrainItems();
  const [form, setForm] = useState<TrainFormData>(EMPTY_TRAIN);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState<TrainEdit | null>(null);

  const handleAdd = async () => {
    if (
      !form.origin.th || !form.origin.en || !form.origin.cn ||
      !form.destination.th || !form.destination.en || !form.destination.cn ||
      !form.originTime || !form.destinationTime
    ) {
      setFormError(t("dashboard.errorRequiredTrain"));
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      await addTrainItem(form);
      setForm(EMPTY_TRAIN);
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
      await updateTrainItem(editing.id, {
        origin: editing.origin,
        destination: editing.destination,
        originTime: editing.originTime,
        destinationTime: editing.destinationTime,
        originStation: editing.originStation,
        destinationStation: editing.destinationStation,
        price: editing.price,
        desc: editing.desc,
        day: editing.day,
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
      await deleteTrainItem(id);
      refetch();
    } catch {
      alert(t("dashboard.errorDelete"));
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-4">
        <h3 className="text-[14px] font-semibold text-[#543A14] mb-3">{t("dashboard.addTrain")}</h3>
        <TrainForm
          val={form}
          onChange={(updater) => setForm(updater)}
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
              <TrainForm
                val={editing}
                onChange={(updater) =>
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
                <p className="text-[13px] font-semibold text-[#543A14]">
                  {item.origin.th} → {item.destination.th}
                </p>
                <p className="text-[11px] text-[#8B724E]">
                  {item.origin.en} → {item.destination.en}
                </p>
                <p className="text-[11px] text-[#C6C6C6]">
                  {item.originTime} – {item.destinationTime} · {item.price} บาท
                  · {item.day === "weekday" ? "วันธรรมดา" : "วันหยุด"}
                </p>
                {item.desc.th && (
                  <p className="text-[11px] text-[#C6C6C6]">{item.desc.th}</p>
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
