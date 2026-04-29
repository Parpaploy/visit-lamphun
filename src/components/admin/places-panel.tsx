import { useRef, useState } from "react";
import { EMPTY_FORM, inputCls, STATION_IDS } from "../../constant/admin";
import { useStationPlaces } from "../../hooks/useStationPlaces";
import type { EditState } from "../../interfaces/admin.interface";
import {
  addPlace,
  deletePlace,
  updatePlace,
  uploadImage,
} from "../../services/dashboard.services";
import type { StationPlace } from "../../interfaces/homepage.interface";
import { STATION_NAMES_TH } from "../../constant/homepage";

export default function PlacesPanel() {
  const [selectedStation, setSelectedStation] = useState<string>(
    STATION_IDS[0],
  );
  const { places, loading, refetch } = useStationPlaces(selectedStation);

  const [saving, setSaving] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState<EditState | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAdd = async () => {
    if (
      !form.nameTh.trim() ||
      !form.nameEn.trim() ||
      !form.nameCn.trim() ||
      !form.link.trim() ||
      !imageFile
    ) {
      setFormError("กรุณากรอกชื่อทั้ง 3 ภาษา, ลิงก์ และเลือกรูปภาพ");
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      const imgUrl = await uploadImage(imageFile, setUploadProgress);
      await addPlace(selectedStation, {
        name: {
          th: form.nameTh.trim(),
          en: form.nameEn.trim(),
          cn: form.nameCn.trim(),
        },
        img: imgUrl,
        link: form.link.trim(),
      });
      setForm(EMPTY_FORM);
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
    }
  };

  const handleDelete = async (placeId: string) => {
    if (!confirm("ลบสถานที่นี้?")) return;
    try {
      await deletePlace(selectedStation, placeId);
      refetch();
    } catch {
      alert("ลบไม่สำเร็จ");
    }
  };

  const startEdit = (place: StationPlace) => {
    setEditing({
      id: place.id,
      nameTh: place.name.th,
      nameEn: place.name.en,
      nameCn: place.name.cn,
      link: place.link,
      img: place.img,
      newFile: null,
      previewUrl: null,
      saving: false,
    });
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setEditing((prev) =>
      prev
        ? { ...prev, newFile: file, previewUrl: URL.createObjectURL(file) }
        : prev,
    );
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    if (
      !editing.nameTh.trim() ||
      !editing.nameEn.trim() ||
      !editing.nameCn.trim() ||
      !editing.link.trim()
    ) {
      return;
    }
    setEditing((prev) => prev && { ...prev, saving: true });
    try {
      const imgUrl = editing.newFile
        ? await uploadImage(editing.newFile, setUploadProgress)
        : editing.img;
      await updatePlace(selectedStation, editing.id, {
        name: {
          th: editing.nameTh.trim(),
          en: editing.nameEn.trim(),
          cn: editing.nameCn.trim(),
        },
        img: imgUrl,
        link: editing.link.trim(),
      });
      setEditing(null);
      setUploadProgress(null);
      refetch();
    } catch (e) {
      alert(`เกิดข้อผิดพลาด: ${e instanceof Error ? e.message : String(e)}`);
      setEditing((prev) => prev && { ...prev, saving: false });
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <label className="block text-[13px] text-[#8B724E] font-medium mb-1">
          เลือก Station
        </label>
        <select
          value={selectedStation}
          onChange={(e) => {
            setSelectedStation(e.target.value);
            setEditing(null);
          }}
          className="w-full border border-[#C6C6C6] bg-white rounded-xl px-4 py-2.5 text-[14px] text-[#543A14] outline-none"
        >
          {STATION_IDS.map((id) => (
            <option key={id} value={id}>
              {STATION_NAMES_TH[id]} ({id})
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-4">
        <h2 className="text-[14px] font-semibold text-[#543A14] mb-3">
          เพิ่มสถานที่ใหม่
        </h2>
        <div className="flex flex-col gap-y-2.5">
          <input
            placeholder="ชื่อสถานที่ (ภาษาไทย) *"
            value={form.nameTh}
            onChange={(e) => setForm((f) => ({ ...f, nameTh: e.target.value }))}
            className={inputCls}
          />
          <input
            placeholder="Place name (English) *"
            value={form.nameEn}
            onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
            className={inputCls}
          />
          <input
            placeholder="地点名称 (中文) *"
            value={form.nameCn}
            onChange={(e) => setForm((f) => ({ ...f, nameCn: e.target.value }))}
            className={inputCls}
          />
          <input
            placeholder="ลิงก์ (URL) *"
            value={form.link}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
            className={inputCls}
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
            className="border border-dashed border-[#C6C6C6] rounded-xl py-3 text-[13px] text-[#8B724E] hover:border-[#BF4B17] transition-colors"
          >
            {imageFile ? imageFile.name : "เลือกรูปภาพ *"}
          </button>

          {previewUrl && (
            <div className="w-full h-36 rounded-xl overflow-hidden">
              <img
                src={previewUrl}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {uploadProgress !== null && !editing && (
            <div className="w-full bg-[#F5F5F5] rounded-full h-2">
              <div
                className="bg-[#BF4B17] h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          {formError && <p className="text-red-500 text-[12px]">{formError}</p>}
          <button
            onClick={handleAdd}
            disabled={saving}
            className="bg-[#BF4B17] text-white text-[14px] font-semibold rounded-full py-2.5 disabled:opacity-60"
          >
            {saving
              ? uploadProgress !== null
                ? `กำลังอัพโหลด ${uploadProgress}%`
                : "กำลังบันทึก..."
              : "+ เพิ่มสถานที่"}
          </button>
        </div>
      </div>

      {/* Place list */}
      <div>
        <h2 className="text-[14px] font-semibold text-[#543A14] mb-3">
          สถานที่ใน {STATION_NAMES_TH[selectedStation]}
        </h2>

        {loading ? (
          <p className="text-[13px] text-[#8B724E]">กำลังโหลด...</p>
        ) : places.length === 0 ? (
          <p className="text-[13px] text-[#C6C6C6]">ยังไม่มีสถานที่</p>
        ) : (
          <div className="flex flex-col gap-y-3">
            {places.map((place) =>
              editing?.id === place.id ? (
                <div
                  key={place.id}
                  className="bg-white rounded-2xl border border-[#BF4B17] shadow-sm p-4 flex flex-col gap-y-2.5"
                >
                  <p className="text-[12px] font-semibold text-[#BF4B17]">
                    แก้ไขสถานที่
                  </p>
                  <input
                    placeholder="ชื่อ (ไทย) *"
                    value={editing.nameTh}
                    onChange={(e) =>
                      setEditing((s) => s && { ...s, nameTh: e.target.value })
                    }
                    className={inputCls}
                  />
                  <input
                    placeholder="Name (English) *"
                    value={editing.nameEn}
                    onChange={(e) =>
                      setEditing((s) => s && { ...s, nameEn: e.target.value })
                    }
                    className={inputCls}
                  />
                  <input
                    placeholder="名称 (中文) *"
                    value={editing.nameCn}
                    onChange={(e) =>
                      setEditing((s) => s && { ...s, nameCn: e.target.value })
                    }
                    className={inputCls}
                  />
                  <input
                    placeholder="ลิงก์ (URL) *"
                    value={editing.link}
                    onChange={(e) =>
                      setEditing((s) => s && { ...s, link: e.target.value })
                    }
                    className={inputCls}
                  />

                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="border border-dashed border-[#C6C6C6] rounded-xl py-2 text-[12px] text-[#8B724E] hover:border-[#BF4B17] transition-colors"
                  >
                    {editing.newFile
                      ? editing.newFile.name
                      : "เปลี่ยนรูปภาพ (ไม่บังคับ)"}
                  </button>

                  <div className="w-full h-28 rounded-xl overflow-hidden">
                    <img
                      src={editing.previewUrl ?? editing.img}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {uploadProgress !== null && editing && (
                    <div className="w-full bg-[#F5F5F5] rounded-full h-2">
                      <div
                        className="bg-[#BF4B17] h-2 rounded-full transition-all duration-300"
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
                      {editing.saving ? "กำลังบันทึก..." : "บันทึก"}
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
                  key={place.id}
                  className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-3 flex gap-x-3 items-start"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#F5F5F5]">
                    <img
                      src={place.img}
                      alt={place.name.th}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#543A14] truncate">
                      {place.name.th}
                    </p>
                    <p className="text-[11px] text-[#8B724E] truncate">
                      {place.name.en}
                    </p>
                    <p className="text-[11px] text-[#8B724E] truncate">
                      {place.name.cn}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1 shrink-0">
                    <button
                      onClick={() => startEdit(place)}
                      className="text-[12px] text-[#543A14] font-medium"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(place.id)}
                      className="text-[12px] text-red-400 font-medium"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
