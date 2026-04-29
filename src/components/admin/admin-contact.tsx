import { useState } from "react";
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
  const { items, loading, refetch } = useEmergencyItems();
  const [form, setForm] = useState(EMPTY_CONTACT);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState<ContactEditState | null>(null);

  const addPhone = () => setForm((f) => ({ ...f, phones: [...f.phones, ""] }));
  const removePhone = (i: number) =>
    setForm((f) => ({ ...f, phones: f.phones.filter((_, idx) => idx !== i) }));
  const setPhone = (i: number, val: string) =>
    setForm((f) => ({
      ...f,
      phones: f.phones.map((p, idx) => (idx === i ? val : p)),
    }));

  const addEditPhone = () =>
    setEditing((s) => s && { ...s, phones: [...s.phones, ""] });
  const removeEditPhone = (i: number) =>
    setEditing(
      (s) => s && { ...s, phones: s.phones.filter((_, idx) => idx !== i) },
    );
  const setEditPhone = (i: number, val: string) =>
    setEditing(
      (s) =>
        s && { ...s, phones: s.phones.map((p, idx) => (idx === i ? val : p)) },
    );

  const handleAdd = async () => {
    if (!form.header.trim() || !form.address.trim()) {
      setFormError("กรุณากรอกชื่อหน่วยงานและที่อยู่");
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      await addEmergencyItem({
        header: form.header.trim(),
        address: form.address.trim(),
        hours: form.hours.trim(),
        phones: form.phones.filter(Boolean),
      });
      setForm(EMPTY_CONTACT);
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
      await updateEmergencyItem(editing.id, {
        header: editing.header.trim(),
        address: editing.address.trim(),
        hours: editing.hours.trim(),
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
          เพิ่มหน่วยงานฉุกเฉิน
        </h3>
        <div className="flex flex-col gap-y-2">
          <input
            placeholder="ชื่อหน่วยงาน *"
            value={form.header}
            onChange={(e) => setForm((f) => ({ ...f, header: e.target.value }))}
            className={inputCls}
          />
          <input
            placeholder="ที่อยู่ *"
            value={form.address}
            onChange={(e) =>
              setForm((f) => ({ ...f, address: e.target.value }))
            }
            className={inputCls}
          />
          <input
            placeholder="เวลาทำการ"
            value={form.hours}
            onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
            className={inputCls}
          />
          <p className="text-[12px] text-[#8B724E] font-medium">
            เบอร์โทรศัพท์
          </p>
          {form.phones.map((ph, i) => (
            <div key={i} className="flex gap-x-2">
              <input
                placeholder={`เบอร์ ${i + 1}`}
                value={ph}
                onChange={(e) => setPhone(i, e.target.value)}
                className={inputCls}
              />
              {form.phones.length > 1 && (
                <button
                  onClick={() => removePhone(i)}
                  className="text-red-400 text-[13px] shrink-0 px-2"
                >
                  ลบ
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addPhone}
            className="text-[12px] text-[#BF4B17] font-medium text-left"
          >
            + เพิ่มเบอร์
          </button>
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
                value={editing.header}
                onChange={(e) =>
                  setEditing((s) => s && { ...s, header: e.target.value })
                }
                placeholder="ชื่อหน่วยงาน"
                className={inputCls}
              />
              <input
                value={editing.address}
                onChange={(e) =>
                  setEditing((s) => s && { ...s, address: e.target.value })
                }
                placeholder="ที่อยู่"
                className={inputCls}
              />
              <input
                value={editing.hours}
                onChange={(e) =>
                  setEditing((s) => s && { ...s, hours: e.target.value })
                }
                placeholder="เวลาทำการ"
                className={inputCls}
              />
              <p className="text-[12px] text-[#8B724E] font-medium">
                เบอร์โทรศัพท์
              </p>
              {editing.phones.map((ph, i) => (
                <div key={i} className="flex gap-x-2">
                  <input
                    value={ph}
                    onChange={(e) => setEditPhone(i, e.target.value)}
                    placeholder={`เบอร์ ${i + 1}`}
                    className={inputCls}
                  />
                  {editing.phones.length > 1 && (
                    <button
                      onClick={() => removeEditPhone(i)}
                      className="text-red-400 text-[13px] shrink-0 px-2"
                    >
                      ลบ
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addEditPhone}
                className="text-[12px] text-[#BF4B17] font-medium text-left"
              >
                + เพิ่มเบอร์
              </button>
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
              className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-3 flex items-start gap-x-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#543A14]">
                  {item.header}
                </p>
                <p className="text-[11px] text-[#8B724E] truncate">
                  {item.address}
                </p>
                {item.hours && (
                  <p className="text-[11px] text-[#8B724E]">{item.hours}</p>
                )}
                {item.phones.length > 0 && (
                  <p className="text-[11px] text-[#C6C6C6]">
                    {item.phones.join(", ")}
                  </p>
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
