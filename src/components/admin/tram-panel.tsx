import { useState } from "react";
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
  const { items, loading, refetch } = useTramItems();
  const [form, setForm] = useState(EMPTY_TRAM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState<TramEdit | null>(null);

  const handleAdd = async () => {
    if (!form.place || !form.time) {
      setFormError("กรุณากรอกข้อมูลให้ครบ");
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
      await updateTramItem(editing.id, {
        place: editing.place,
        time: editing.time,
        price: editing.price,
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
      await deleteTramItem(id);
      refetch();
    } catch {
      alert("ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-4">
        <h3 className="text-[14px] font-semibold text-[#543A14] mb-3">
          เพิ่มรถราง
        </h3>
        <div className="flex flex-col gap-y-2">
          <input
            placeholder="สถานที่ *"
            value={form.place}
            onChange={(e) => setForm((f) => ({ ...f, place: e.target.value }))}
            className={inputCls}
          />
          <input
            placeholder="เวลา *"
            value={form.time}
            onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
            className={inputCls}
          />
          <input
            placeholder="ราคา (บาท)"
            type="number"
            value={form.price}
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
            {saving ? "กำลังบันทึก..." : "+ เพิ่มรายการ"}
          </button>
        </div>
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
              <input
                value={editing.place}
                onChange={(e) =>
                  setEditing((s) => s && { ...s, place: e.target.value })
                }
                placeholder="สถานที่"
                className={inputCls}
              />
              <input
                value={editing.time}
                onChange={(e) =>
                  setEditing((s) => s && { ...s, time: e.target.value })
                }
                placeholder="เวลา"
                className={inputCls}
              />
              <input
                type="number"
                value={editing.price}
                onChange={(e) =>
                  setEditing(
                    (s) => s && { ...s, price: Number(e.target.value) },
                  )
                }
                placeholder="ราคา"
                className={inputCls}
              />
              <div className="flex gap-x-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={editing.saving}
                  className="flex-1 bg-[#BF4B17] text-white text-[13px] font-semibold rounded-full py-2 disabled:opacity-60"
                >
                  บันทึก
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 border border-[#C6C6C6] text-[#543A14] text-[13px] font-semibold rounded-full py-2"
                >
                  ยกเลิก
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
                  {item.place}
                </p>
                <p className="text-[11px] text-[#8B724E]">
                  {item.time} · {item.price} บาท
                </p>
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
