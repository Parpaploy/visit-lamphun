import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const p = (key: string, lang: "inTh" | "inEn" | "inCn", req = false) =>
    `${t(key)} ${t(`form.${lang}`)}${req ? " *" : ""}`;
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
      setFormError(t("dashboard.errorRequiredAll"));
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
        `${t("dashboard.errorSave")}: ${e instanceof Error ? e.message : String(e)}`,
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
      alert(
        `${t("dashboard.errorSave")}: ${e instanceof Error ? e.message : String(e)}`,
      );
      setEditing((s) => s && { ...s, saving: false });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("dashboard.confirmDelete"))) return;
    try {
      await deleteRecommendItem(mode, id);
      refetch();
    } catch {
      alert(t("dashboard.errorDelete"));
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
          {t("dashboard.addNew")}
        </h3>

        <div className="w-full flex justify-center items-center gap-x-3">
          <div>
            <div className="w-full flex justify-center items-center">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative aspect-square w-auto h-60 mx-auto rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed transition-all duration-200
        ${
          previewUrl
            ? "border-[#BF4B17]"
            : "border-[#D9C5AE] hover:border-[#BF4B17] flex flex-col items-center justify-center gap-1 bg-[#FDF8F3] hover:bg-[#FFF1E8]"
        }`}
                >
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[13px] font-medium">
                          {t("dashboard.changeImage")}
                        </span>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="inline-block bg-black/50 backdrop-blur-sm text-white text-[11px] rounded-lg px-2.5 py-1 truncate max-w-full">
                          {imageFile?.name}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#BF4B17"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="4" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>

                      <p className="text-[13px] font-semibold text-[#BF4B17]">
                        {t("dashboard.selectImage")}
                      </p>

                      <p className="text-[11px] text-[#C4A882]">
                        JPG, PNG, WEBP
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-y-3">
            <input
              placeholder={p("form.title", "inTh", true)}
              value={form.titleTh}
              onChange={(e) =>
                setForm((f) => ({ ...f, titleTh: e.target.value }))
              }
              className={inputCls}
            />
            <input
              placeholder={p("form.title", "inEn", true)}
              value={form.titleEn}
              onChange={(e) =>
                setForm((f) => ({ ...f, titleEn: e.target.value }))
              }
              className={inputCls}
            />
            <input
              placeholder={p("form.title", "inCn", true)}
              value={form.titleCn}
              onChange={(e) =>
                setForm((f) => ({ ...f, titleCn: e.target.value }))
              }
              className={inputCls}
            />
          </div>
        </div>

        <div className="w-full flex justify-center items-center gap-x-3 my-3">
          <textarea
            placeholder={p("form.descFull", "inTh", true)}
            value={form.descTh}
            onChange={(e) => setForm((f) => ({ ...f, descTh: e.target.value }))}
            rows={15}
            className={`${inputCls} resize-none`}
          />
          <textarea
            placeholder={p("form.descFull", "inEn", true)}
            value={form.descEn}
            onChange={(e) => setForm((f) => ({ ...f, descEn: e.target.value }))}
            rows={15}
            className={`${inputCls} resize-none`}
          />
          <textarea
            placeholder={p("form.descFull", "inCn", true)}
            value={form.descCn}
            onChange={(e) => setForm((f) => ({ ...f, descCn: e.target.value }))}
            rows={15}
            className={`${inputCls} resize-none`}
          />
        </div>

        {uploadProgress !== null && !editing && (
          <div className="w-full bg-[#F5F5F5] rounded-full h-1.5">
            <div
              className="bg-[#BF4B17] h-1.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        {formError && <p className="text-[#FF0000] text-[12px]">{formError}</p>}
        <button
          onClick={handleAdd}
          disabled={saving}
          className="w-full bg-[#BF4B17] text-white text-[13px] font-semibold rounded-full py-2 disabled:opacity-60"
        >
          {saving ? t("dashboard.saving") : t("dashboard.addItem")}
        </button>
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
              className="bg-white rounded-2xl border border-[#BF4B17] p-4 flex flex-col gap-y-3"
            >
              <p className="text-[12px] font-semibold text-[#BF4B17]">
                {t("dashboard.edit")}
              </p>

              <div className="w-full flex justify-center items-center gap-x-3">
                <div>
                  <input
                    ref={editFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="hidden"
                  />

                  <div
                    onClick={() => editFileRef.current?.click()}
                    className={`relative aspect-square w-auto h-60 mx-auto rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed transition-all duration-200 border-[#BF4B17]`}
                  >
                    <img
                      src={editing.previewUrl ?? editing.img}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[13px] font-medium">
                        {t("dashboard.changeImage")}
                      </span>
                    </div>

                    {editing.newFile && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="inline-block bg-black/50 backdrop-blur-sm text-white text-[11px] rounded-lg px-2.5 py-1 truncate max-w-full">
                          {editing.newFile.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full flex flex-col gap-y-3">
                  <input
                    value={editing.title.th}
                    onChange={(e) =>
                      setEditing(
                        (s) =>
                          s && {
                            ...s,
                            title: { ...s.title, th: e.target.value },
                          },
                      )
                    }
                    placeholder={p("form.title", "inTh")}
                    className={inputCls}
                  />
                  <input
                    value={editing.title.en}
                    onChange={(e) =>
                      setEditing(
                        (s) =>
                          s && {
                            ...s,
                            title: { ...s.title, en: e.target.value },
                          },
                      )
                    }
                    placeholder={p("form.title", "inEn")}
                    className={inputCls}
                  />
                  <input
                    value={editing.title.cn}
                    onChange={(e) =>
                      setEditing(
                        (s) =>
                          s && {
                            ...s,
                            title: { ...s.title, cn: e.target.value },
                          },
                      )
                    }
                    placeholder={p("form.title", "inCn")}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="w-full flex justify-center items-center gap-x-3">
                <textarea
                  value={editing.desc.th}
                  onChange={(e) =>
                    setEditing(
                      (s) =>
                        s && { ...s, desc: { ...s.desc, th: e.target.value } },
                    )
                  }
                  placeholder={p("form.descFull", "inTh")}
                  rows={15}
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
                  placeholder={p("form.descFull", "inEn")}
                  rows={15}
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
                  placeholder={p("form.descFull", "inCn")}
                  rows={15}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {uploadProgress !== null && (
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
                  {t("dashboard.save")}
                </button>
                <button
                  onClick={() => {
                    setEditing(null);
                    setUploadProgress(null);
                  }}
                  className="flex-1 border border-[#C6C6C6] text-[#543A14] text-[13px] font-semibold rounded-full py-2"
                >
                  {t("dashboard.cancel")}
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
                  {t("dashboard.edit")}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-[12px] text-[#FF0000] font-medium"
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
