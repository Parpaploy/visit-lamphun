import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { EMPTY_FORM, inputCls, PLACE_TAGS } from "../../constant/admin";
import { useStationPlaces } from "../../hooks/useStationPlaces";
import type { PlaceEditState } from "../../interfaces/admin.interface";
import {
  addPlace,
  deletePlace,
  updatePlace,
  uploadImage,
} from "../../services/dashboard.services";
import type { StationPlace } from "../../interfaces/homepage.interface";
import { STATION_NAMES_ML } from "../../constant/homepage";
import { formatTime12h } from "../../utils/ml";

export default function PlacesPanel({
  selectedStation,
}: {
  selectedStation: string;
}) {
  const { t, i18n } = useTranslation();
  const lang =
    i18n.language === "en" || i18n.language === "cn" ? i18n.language : "th";
  const stationName = (id: string) => STATION_NAMES_ML[id]?.[lang] ?? id;
  const p = (key: string, lang: "inTh" | "inEn" | "inCn", req = false) =>
    `${t(key)} ${t(`form.${lang}`)}${req ? " *" : ""}`;

  const { places, loading, refetch } = useStationPlaces(selectedStation);

  const [saving, setSaving] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState<PlaceEditState | null>(null);
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
      setFormError(t("dashboard.errorRequiredName"));
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
        tag: form.tag || undefined,
        openTime: form.openTime.trim() || undefined,
        closeTime: form.closeTime.trim() || undefined,
        phone: form.phone.trim() || undefined,
      });
      setForm(EMPTY_FORM);
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
    }
  };

  const handleDelete = async (placeId: string) => {
    if (!confirm(t("dashboard.confirmDeletePlace"))) return;
    try {
      await deletePlace(selectedStation, placeId);
      refetch();
    } catch {
      alert(t("dashboard.errorDelete"));
    }
  };

  const startEdit = (place: StationPlace) => {
    setEditing({
      id: place.id,
      nameTh: place.name.th,
      nameEn: place.name.en,
      nameCn: place.name.cn,
      link: place.link,
      tag: place.tag ?? "",
      img: place.img,
      openTime: place.openTime ?? "",
      closeTime: place.closeTime ?? "",
      phone: place.phone ?? "",
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
        tag: editing.tag || undefined,
        openTime: editing.openTime.trim() || undefined,
        closeTime: editing.closeTime.trim() || undefined,
        phone: editing.phone.trim() || undefined,
      });
      setEditing(null);
      setUploadProgress(null);
      refetch();
    } catch (e) {
      alert(
        `${t("dashboard.errorSave")}: ${e instanceof Error ? e.message : String(e)}`,
      );
      setEditing((prev) => prev && { ...prev, saving: false });
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-4">
        <h2 className="text-[14px] font-semibold text-[#543A14] mb-3">
          {t("dashboard.addNew")}
        </h2>
        <div className="flex flex-col gap-y-2.5">
          <div className="w-full flex justify-center items-center gap-x-3">
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
                      alt="preview"
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
                    <p className="text-[11px] text-[#C4A882]">JPG, PNG, WEBP</p>
                  </>
                )}
              </div>
            </div>

            <div className="w-full flex flex-col gap-y-3">
              <input
                placeholder={p("form.place", "inTh", true)}
                value={form.nameTh}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nameTh: e.target.value }))
                }
                className={inputCls}
              />
              <input
                placeholder={p("form.place", "inEn", true)}
                value={form.nameEn}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nameEn: e.target.value }))
                }
                className={inputCls}
              />
              <input
                placeholder={p("form.place", "inCn", true)}
                value={form.nameCn}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nameCn: e.target.value }))
                }
                className={inputCls}
              />
              <select
                value={form.tag}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tag: e.target.value }))
                }
                className={inputCls}
              >
                <option value="">{t("form.selectTag")}</option>
                {PLACE_TAGS.map((tag) => (
                  <option key={tag.value} value={tag.value}>
                    {t(tag.label)}
                  </option>
                ))}
              </select>
              <input
                placeholder={`${t("form.link")} *`}
                value={form.link}
                onChange={(e) =>
                  setForm((f) => ({ ...f, link: e.target.value }))
                }
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex gap-x-2">
            <input
              type="time"
              placeholder={t("form.openTime")}
              value={form.openTime}
              onChange={(e) =>
                setForm((f) => ({ ...f, openTime: e.target.value }))
              }
              className={`${inputCls} flex-1`}
            />
            <input
              type="time"
              placeholder={t("form.closeTime")}
              value={form.closeTime}
              onChange={(e) =>
                setForm((f) => ({ ...f, closeTime: e.target.value }))
              }
              className={`${inputCls} flex-1`}
            />
          </div>

          <input
            placeholder={t("form.phone")}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={inputCls}
          />

          {uploadProgress !== null && !editing && (
            <div className="w-full bg-[#F5F5F5] rounded-full h-2">
              <div
                className="bg-[#BF4B17] h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          {formError && (
            <p className="text-[#FF0000] text-[12px]">{formError}</p>
          )}
          <button
            onClick={handleAdd}
            disabled={saving}
            className="bg-[#BF4B17] text-white text-[14px] font-semibold rounded-full py-2.5 disabled:opacity-60"
          >
            {saving
              ? uploadProgress !== null
                ? `${t("dashboard.uploading")} ${uploadProgress}%`
                : t("dashboard.saving")
              : t("dashboard.addPlace")}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-[14px] font-semibold text-[#543A14] mb-3">
          {t("dashboard.placesIn")} {stationName(selectedStation)}
        </h2>

        {loading ? (
          <p className="text-[13px] text-[#8B724E]">{t("dashboard.loading")}</p>
        ) : places.length === 0 ? (
          <p className="text-[13px] text-[#C6C6C6]">{t("dashboard.empty")}</p>
        ) : (
          <div className="flex flex-col gap-y-3">
            {places.map((place) =>
              editing?.id === place.id ? (
                <div
                  key={place.id}
                  className="bg-white rounded-2xl border border-[#BF4B17] shadow-sm p-4 flex flex-col gap-y-2.5"
                >
                  <p className="text-[12px] font-semibold text-[#BF4B17]">
                    {t("dashboard.editPlace")}
                  </p>
                  <div className="w-full flex justify-center items-center gap-x-3">
                    <div>
                      <input
                        ref={editFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        className="hidden"
                      />
                      <div
                        onClick={() => editFileInputRef.current?.click()}
                        className="relative aspect-square w-auto h-60 mx-auto rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-[#D9C5AE] hover:border-[#BF4B17] transition-all duration-200"
                      >
                        <img
                          src={editing.previewUrl ?? editing.img}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-[13px] font-semibold">
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
                        placeholder={p("form.place", "inTh")}
                        value={editing.nameTh}
                        onChange={(e) =>
                          setEditing(
                            (s) => s && { ...s, nameTh: e.target.value },
                          )
                        }
                        className={inputCls}
                      />
                      <input
                        placeholder={p("form.place", "inEn")}
                        value={editing.nameEn}
                        onChange={(e) =>
                          setEditing(
                            (s) => s && { ...s, nameEn: e.target.value },
                          )
                        }
                        className={inputCls}
                      />
                      <input
                        placeholder={p("form.place", "inCn")}
                        value={editing.nameCn}
                        onChange={(e) =>
                          setEditing(
                            (s) => s && { ...s, nameCn: e.target.value },
                          )
                        }
                        className={inputCls}
                      />
                      <select
                        value={editing.tag}
                        onChange={(e) =>
                          setEditing((s) => s && { ...s, tag: e.target.value })
                        }
                        className={inputCls}
                      >
                        <option value="">{t("form.selectTag")}</option>
                        {PLACE_TAGS.map((tag) => (
                          <option key={tag.value} value={tag.value}>
                            {t(tag.label)}
                          </option>
                        ))}
                      </select>
                      <input
                        placeholder={t("form.link")}
                        value={editing.link}
                        onChange={(e) =>
                          setEditing((s) => s && { ...s, link: e.target.value })
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="flex gap-x-2">
                    <input
                      type="time"
                      placeholder={t("form.openTime")}
                      value={editing.openTime}
                      onChange={(e) =>
                        setEditing(
                          (s) => s && { ...s, openTime: e.target.value },
                        )
                      }
                      className={`${inputCls} flex-1`}
                    />
                    <input
                      type="time"
                      placeholder={t("form.closeTime")}
                      value={editing.closeTime}
                      onChange={(e) =>
                        setEditing(
                          (s) => s && { ...s, closeTime: e.target.value },
                        )
                      }
                      className={`${inputCls} flex-1`}
                    />
                  </div>
                  <input
                    placeholder={t("form.phone")}
                    value={editing.phone}
                    onChange={(e) =>
                      setEditing((s) => s && { ...s, phone: e.target.value })
                    }
                    className={inputCls}
                  />
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
                      {editing.saving
                        ? t("dashboard.saving")
                        : t("dashboard.save")}
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
                    <div className="flex justify-start items-center gap-1 text-[13px] font-semibold text-[#543A14] truncate">
                      {place.name.th}
                      {place.tag && (
                        <span className="inline-block text-[11px] font-medium bg-[#BF4B17] text-white rounded-full px-2">
                          {t(
                            PLACE_TAGS.find((tg) => tg.value === place.tag)
                              ?.label ?? place.tag,
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8B724E] truncate">
                      {place.name.en}
                    </p>
                    <p className="text-[11px] text-[#8B724E] truncate">
                      {place.name.cn}
                    </p>

                    {(place.openTime || place.closeTime) && (
                      <p className="text-[11px] text-[#8B724E]">
                        {formatTime12h(place.openTime)} –{" "}
                        {formatTime12h(place.closeTime)}
                      </p>
                    )}
                    {place.phone && (
                      <p className="text-[11px] text-[#8B724E]">
                        {place.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-y-1 shrink-0">
                    <button
                      onClick={() => startEdit(place)}
                      className="text-[12px] text-[#543A14] font-medium"
                    >
                      {t("dashboard.edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(place.id)}
                      className="text-[12px] text-[#FF0000] font-medium"
                    >
                      {t("dashboard.delete")}
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
