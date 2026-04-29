import { useState } from "react";
import { useTrainItems } from "../../hooks/useTravelItems";
import { EMPTY_TRAIN } from "../../constant/admin";
import type { TrainEdit } from "../../interfaces/admin.interface";
import {
  addTrainItem,
  deleteTrainItem,
  updateTrainItem,
} from "../../services/travel.services";
import TrainForm from "./train-form";

export default function TrainPanel() {
  const { items, loading, refetch } = useTrainItems();
  const [form, setForm] = useState(EMPTY_TRAIN);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState<TrainEdit | null>(null);

  const tf = (k: keyof typeof form, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = async () => {
    if (
      !form.origin ||
      !form.destination ||
      !form.originTime ||
      !form.destinationTime
    ) {
      setFormError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      await addTrainItem(form);
      setForm(EMPTY_TRAIN);
      refetch();
    } catch (e) {
      setFormError(
        `เกิดข้อผิดพลาด: ${e instanceof Error ? e.message : String(e)}`,
      );
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
      alert(`เกิดข้อผิดพลาด: ${e instanceof Error ? e.message : String(e)}`);
      setEditing((s) => s && { ...s, saving: false });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบรายการนี้?")) return;
    try {
      await deleteTrainItem(id);
      refetch();
    } catch {
      alert("ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-4">
        <h3 className="text-[14px] font-semibold text-[#543A14] mb-3">
          เพิ่มรถไฟ
        </h3>
        <TrainForm
          val={form}
          onChange={tf}
          onSave={handleAdd}
          saveLabel={saving ? "กำลังบันทึก..." : "+ เพิ่มรายการ"}
          error={formError}
        />
      </div>
      {loading ? (
        <p className="text-[13px] text-[#8B724E]">กำลังโหลด...</p>
      ) : items.length === 0 ? (
        <p className="text-[13px] text-[#C6C6C6]">ยังไม่มีรายการ</p>
      ) : (
        items.map((item) =>
          editing?.id === item.id ? (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#BF4B17] p-4 flex flex-col gap-y-2"
            >
              <p className="text-[12px] font-semibold text-[#BF4B17]">แก้ไข</p>
              <TrainForm
                val={{
                  origin: editing.origin,
                  destination: editing.destination,
                  originTime: editing.originTime,
                  destinationTime: editing.destinationTime,
                  originStation: editing.originStation,
                  destinationStation: editing.destinationStation,
                  price: editing.price,
                  desc: editing.desc,
                  day: editing.day,
                }}
                onChange={(k, v) => setEditing((s) => s && { ...s, [k]: v })}
                onSave={handleSaveEdit}
                onCancel={() => setEditing(null)}
                saveLabel={editing.saving ? "กำลังบันทึก..." : "บันทึก"}
              />
            </div>
          ) : (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-3 flex items-start gap-x-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#543A14]">
                  {item.origin} → {item.destination}
                </p>
                <p className="text-[11px] text-[#8B724E]">
                  {item.originTime} – {item.destinationTime} · {item.price} บาท
                  · {item.day === "weekday" ? "วันธรรมดา" : "วันหยุด"}
                </p>
                {item.desc && (
                  <p className="text-[11px] text-[#C6C6C6]">{item.desc}</p>
                )}
              </div>
              <div className="flex gap-x-3 shrink-0">
                <button
                  onClick={() => setEditing({ ...item, saving: false })}
                  className="text-[12px] text-[#543A14] font-medium"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-[12px] text-red-400 font-medium"
                >
                  ลบ
                </button>
              </div>
            </div>
          ),
        )
      )}
    </div>
  );
}
