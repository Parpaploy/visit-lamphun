import { useState, useRef } from "react";
import { useRecommendItems } from "../../hooks/useRecommendItems";
import {
  addRecommendItem,
  updateRecommendItem,
  deleteRecommendItem,
} from "../../services/recommend.services";
import { uploadImage } from "../../services/dashboard.services";
import type { MLString } from "../../interfaces/content.interface";
import type { IRecommendMode } from "../../interfaces/navbar.interface";
import { EMPTY_RECOMMEND, useRecommendModes } from "../../constant/admin";
import type { RecommendEditState } from "../../interfaces/admin.interface";

const inputCls =
  "border border-[#C6C6C6] rounded-xl px-3 py-2 text-[13px] text-[#543A14] outline-none placeholder:text-[#C6C6C6] w-full";

export default function AdminRecommend() {
  const modes = useRecommendModes();
  const [mode, setMode] = useState<IRecommendMode>("goods");
  const { items, loading, refetch } = useRecommendItems(mode);
  const [form, setForm] = useState(EMPTY_RECOMMEND);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState<RecommendEditState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !editing) return;
    setEditing(
      (s) => s && { ...s, newFile: f, previewUrl: URL.createObjectURL(f) },
    );
  };

  const ml = (th: string, en: string, cn: string): MLString => ({ th, en, cn });

  const handleAdd = async () => {
    const { titleTh, titleEn, titleCn, descTh, descEn, descCn } = form;
    if (
      !titleTh ||
      !titleEn ||
      !titleCn ||
      !descTh ||
      !descEn ||
      !descCn ||
      !imageFile
    ) {
      setFormError("กรุณากรอกข้อมูลให้ครบและเลือกรูปภาพ");
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      const img = await uploadImage(imageFile, setUploadProgress);
      await addRecommendItem(mode, {
        title: ml(titleTh, titleEn, titleCn),
        desc: ml(descTh, descEn, descCn),
        img,
      });
      setForm(EMPTY_RECOMMEND);
      setImageFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refetch();
    } catch (e) {
      setFormError(
        `เกิดข้อผิดพลาด: ${e instanceof Error ? e.message : String(e)}`,
      );
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setEditing((s) => s && { ...s, saving: true });
    try {
      const img = editing.newFile
        ? await uploadImage(editing.newFile, setUploadProgress)
        : editing.img;
      await updateRecommendItem(mode, editing.id, {
        title: editing.title,
        desc: editing.desc,
        img,
      });
      setEditing(null);
      setUploadProgress(null);
      refetch();
    } catch (e) {
      alert(`เกิดข้อผิดพลาด: ${e instanceof Error ? e.message : String(e)}`);
      setEditing((s) => s && { ...s, saving: false });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบรายการนี้?")) return;
    try {
      await deleteRecommendItem(mode, id);
      refetch();
    } catch {
      alert("ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-x-2">
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => {
              setMode(m.value);
              setEditing(null);
            }}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${mode === m.value ? "bg-[#BF4B17] text-white border-[#BF4B17]" : "bg-white text-[#543A14] border-[#C6C6C6]"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-4">
        <h3 className="text-[14px] font-semibold text-[#543A14] mb-3">
          เพิ่มรายการใหม่
        </h3>
        <div className="flex flex-col gap-y-2">
          <input
            placeholder="ชื่อ (ไทย) *"
            value={form.titleTh}
            onChange={(e) =>
              setForm((f) => ({ ...f, titleTh: e.target.value }))
            }
            className={inputCls}
          />
          <input
            placeholder="Title (English) *"
            value={form.titleEn}
            onChange={(e) =>
              setForm((f) => ({ ...f, titleEn: e.target.value }))
            }
            className={inputCls}
          />
          <input
            placeholder="标题 (中文) *"
            value={form.titleCn}
            onChange={(e) =>
              setForm((f) => ({ ...f, titleCn: e.target.value }))
            }
            className={inputCls}
          />
          <textarea
            placeholder="คำอธิบาย (ไทย) *"
            value={form.descTh}
            onChange={(e) => setForm((f) => ({ ...f, descTh: e.target.value }))}
            rows={2}
            className={`${inputCls} resize-none`}
          />
          <textarea
            placeholder="Description (English) *"
            value={form.descEn}
            onChange={(e) => setForm((f) => ({ ...f, descEn: e.target.value }))}
            rows={2}
            className={`${inputCls} resize-none`}
          />
          <textarea
            placeholder="描述 (中文) *"
            value={form.descCn}
            onChange={(e) => setForm((f) => ({ ...f, descCn: e.target.value }))}
            rows={2}
            className={`${inputCls} resize-none`}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-[#C6C6C6] rounded-xl py-2.5 text-[13px] text-[#8B724E] hover:border-[#BF4B17] transition-colors"
          >
            {imageFile ? imageFile.name : "เลือกรูปภาพ *"}
          </button>
          {previewUrl && (
            <div className="w-full h-32 rounded-xl overflow-hidden">
              <img src={previewUrl} className="w-full h-full object-cover" />
            </div>
          )}
          {uploadProgress !== null && !editing && (
            <div className="w-full bg-[#F5F5F5] rounded-full h-1.5">
              <div
                className="bg-[#BF4B17] h-1.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
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
                value={editing.title.th}
                onChange={(e) =>
                  setEditing(
                    (s) =>
                      s && { ...s, title: { ...s.title, th: e.target.value } },
                  )
                }
                placeholder="ชื่อ (ไทย)"
                className={inputCls}
              />
              <input
                value={editing.title.en}
                onChange={(e) =>
                  setEditing(
                    (s) =>
                      s && { ...s, title: { ...s.title, en: e.target.value } },
                  )
                }
                placeholder="Title (English)"
                className={inputCls}
              />
              <input
                value={editing.title.cn}
                onChange={(e) =>
                  setEditing(
                    (s) =>
                      s && { ...s, title: { ...s.title, cn: e.target.value } },
                  )
                }
                placeholder="标题 (中文)"
                className={inputCls}
              />
              <textarea
                value={editing.desc.th}
                onChange={(e) =>
                  setEditing(
                    (s) =>
                      s && { ...s, desc: { ...s.desc, th: e.target.value } },
                  )
                }
                rows={2}
                className={`${inputCls} resize-none`}
              />
              <textarea
                value={editing.desc.en}
                onChange={(e) =>
                  setEditing(
                    (s) =>
                      s && { ...s, desc: { ...s.desc, en: e.target.value } },
                  )
                }
                rows={2}
                className={`${inputCls} resize-none`}
              />
              <textarea
                value={editing.desc.cn}
                onChange={(e) =>
                  setEditing(
                    (s) =>
                      s && { ...s, desc: { ...s.desc, cn: e.target.value } },
                  )
                }
                rows={2}
                className={`${inputCls} resize-none`}
              />
              <input
                ref={editFileRef}
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => editFileRef.current?.click()}
                className="border border-dashed border-[#C6C6C6] rounded-xl py-2 text-[12px] text-[#8B724E]"
              >
                {editing.newFile
                  ? editing.newFile.name
                  : "เปลี่ยนรูป (ไม่บังคับ)"}
              </button>
              <div className="w-full h-24 rounded-xl overflow-hidden">
                <img
                  src={editing.previewUrl ?? editing.img}
                  className="w-full h-full object-cover"
                />
              </div>
              {uploadProgress !== null && editing && (
                <div className="w-full bg-[#F5F5F5] rounded-full h-1.5">
                  <div
                    className="bg-[#BF4B17] h-1.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              <div className="flex gap-x-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={editing.saving}
                  className="flex-1 bg-[#BF4B17] text-white text-[13px] font-semibold rounded-full py-2 disabled:opacity-60"
                >
                  บันทึก
                </button>
                <button
                  onClick={() => {
                    setEditing(null);
                    setUploadProgress(null);
                  }}
                  className="flex-1 border border-[#C6C6C6] text-[#543A14] text-[13px] font-semibold rounded-full py-2"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          ) : (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-3 flex gap-x-3 items-start"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#F5F5F5]">
                <img src={item.img} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#543A14] truncate">
                  {item.title.th}
                </p>
                <p className="text-[11px] text-[#8B724E] truncate">
                  {item.title.en}
                </p>
                <p className="text-[11px] text-[#C6C6C6] line-clamp-2">
                  {item.desc.th}
                </p>
              </div>
              <div className="flex flex-col gap-y-1 shrink-0">
                <button
                  onClick={() =>
                    setEditing({
                      ...item,
                      newFile: null,
                      previewUrl: null,
                      saving: false,
                    })
                  }
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
