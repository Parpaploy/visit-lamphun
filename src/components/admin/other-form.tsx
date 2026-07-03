import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { MLString, OtherItem } from "../../interfaces/content.interface";
import { FIELD_VISIBILITY, resetHiddenFields } from "../../constant/admin";
import { uploadImage } from "../../services/dashboard.services";

const inputCls =
  "border border-[#C6C6C6] rounded-xl px-3 py-2 text-[13px] text-[#543A14] outline-none placeholder:text-[#C6C6C6] w-full";
const selectCls = `${inputCls} bg-white`;

type OtherFormData = Omit<OtherItem, "id">;
type MlField = "place" | "boardingPoint" | "route" | "departureTime";

function BulletListInput({
  value,
  onChange,
  placeholder,
  rows,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const { t } = useTranslation();
  const lines = value ? value.split("\n") : [""];

  const updateLine = (idx: number, text: string) => {
    const next = [...lines];
    next[idx] = text;
    onChange(next.join("\n"));
  };

  const addLine = () => {
    onChange([...lines, ""].join("\n"));
  };

  const removeLine = (idx: number) => {
    const next = lines.filter((_, i) => i !== idx);
    onChange(next.join("\n"));
  };

  return (
    <div className="flex flex-col gap-y-2 bg-[#FBF8F3] border border-[#EDE3D3] rounded-xl p-2.5">
      {lines.map((line, idx) => (
        <div key={idx} className="flex items-center gap-x-2">
          <span className="text-[#BF4B17] text-[20px] leading-none shrink-0 mt-1">
            •
          </span>
          <textarea
            value={line}
            onChange={(e) => updateLine(idx, e.target.value)}
            placeholder={placeholder}
            rows={rows ?? 1}
            className={`${inputCls} bg-white resize-none flex-1`}
          />
          {lines.length > 1 && (
            <button
              type="button"
              onClick={() => removeLine(idx)}
              className="flex items-center justify-center w-6 h-6 shrink-0 rounded-full border border-[#BF4B17] text-[#BF4B17] text-[13px] leading-none hover:bg-[#BF4B17] hover:text-white transition-colors mt-0.5"
              aria-label="ลบบรรทัดนี้"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addLine}
        className="flex items-center gap-x-1 self-end text-[12px] text-[#BF4B17] font-semibold pr-1 hover:opacity-70 transition-opacity"
      >
        <span className="flex items-center justify-center text-[13px] leading-none mb-0.5">
          +
        </span>
        {t("form.addLine")}
      </button>
    </div>
  );
}

function ImageUploadInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const { t } = useTranslation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUrl = previewUrl ?? value;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(
        `อัปโหลดรูปไม่สำเร็จ: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setUploading(false);
      setImageFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className="flex flex-col gap-y-1.5">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative aspect-square h-48 mx-auto rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed transition-all duration-200 w-full
          ${
            displayUrl
              ? "border-[#BF4B17]"
              : "border-[#D9C5AE] hover:border-[#BF4B17] flex flex-col items-center justify-center gap-1 bg-[#FDF8F3] hover:bg-[#FFF1E8]"
          }`}
      >
        {displayUrl ? (
          <>
            <img
              src={displayUrl}
              alt="preview"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-[13px] font-medium">
                {uploading ? "กำลังอัปโหลด..." : t("dashboard.changeImage")}
              </span>
            </div>

            {imageFile && (
              <div className="absolute bottom-2 left-2 right-2">
                <span className="inline-block bg-black/50 backdrop-blur-sm text-white text-[11px] rounded-lg px-2.5 py-1 truncate max-w-full">
                  {imageFile.name}
                </span>
              </div>
            )}

            {value && !uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-black/60 text-white text-[13px] leading-none hover:bg-black/80 transition-colors"
                aria-label="ลบรูปภาพ"
              >
                ×
              </button>
            )}
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
      {error && <p className="text-[#FF0000] text-[11px]">{error}</p>}
    </div>
  );
}

export default function OtherForm({
  v,
  ch,
  onSave,
  onCancel,
  saveLabel,
  error,
}: {
  v: OtherFormData;
  ch: (updater: (f: OtherFormData) => OtherFormData) => void;
  onSave: () => void;
  onCancel?: () => void;
  saveLabel: string;
  error?: string;
}) {
  const { t } = useTranslation();
  const visibility = FIELD_VISIBILITY[v.type] ?? FIELD_VISIBILITY.van;

  useEffect(() => {
    if (v.day !== "weekday") {
      ch((f) => ({ ...f, day: "weekday" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.day]);

  const setMl =
    (field: MlField, lang: keyof MLString) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      ch((f) => ({
        ...f,
        [field]: { ...(f[field] as MLString), [lang]: e.target.value },
      }));

  const setMlBullet =
    (field: MlField, lang: keyof MLString) => (newValue: string) =>
      ch((f) => ({
        ...f,
        [field]: { ...(f[field] as MLString), [lang]: newValue },
      }));

  const p = (key: string, lang: "inTh" | "inEn" | "inCn", req = false) =>
    `${t(key)} ${t(`form.${lang}`)}${req ? " *" : ""}`;

  const handleTypeChange = (newType: OtherItem["type"]) => {
    ch((f) => resetHiddenFields({ ...f, type: newType, day: "weekday" }));
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex gap-2 w-full">
        <ImageUploadInput
          value={v.image ?? ""}
          onChange={(url) => ch((f) => ({ ...f, image: url }))}
        />

        <div className="w-full flex flex-col justify-center items-center gap-y-2">
          <select
            value={v.type}
            onChange={(e) =>
              handleTypeChange(e.target.value as OtherItem["type"])
            }
            className={selectCls}
          >
            <option value="van">{t("form.van")}</option>
            <option value="tricycle">{t("form.tricycle")}</option>
            <option value="songthaew">{t("form.songthaew")}</option>
            <option value="motorcycle">{t("form.motorcycle")}</option>
          </select>

          <input
            placeholder={p("form.place", "inTh", true)}
            value={v.place.th}
            onChange={setMl("place", "th")}
            className={inputCls}
          />
          <input
            placeholder={p("form.place", "inEn", true)}
            value={v.place.en}
            onChange={setMl("place", "en")}
            className={inputCls}
          />
          <input
            placeholder={p("form.place", "inCn", true)}
            value={v.place.cn}
            onChange={setMl("place", "cn")}
            className={inputCls}
          />
        </div>
      </div>

      <p className="text-[12px] font-semibold text-[#543A14] mt-1">
        {t("form.boardingPoint")}
      </p>
      <div className="flex flex-col gap-y-2">
        <div>
          <BulletListInput
            value={v.boardingPoint.th}
            onChange={setMlBullet("boardingPoint", "th")}
            placeholder={p("form.boardingPoint", "inTh")}
          />
        </div>
        <div>
          <BulletListInput
            value={v.boardingPoint.en}
            onChange={setMlBullet("boardingPoint", "en")}
            placeholder={p("form.boardingPoint", "inEn")}
          />
        </div>
        <div>
          <BulletListInput
            value={v.boardingPoint.cn}
            onChange={setMlBullet("boardingPoint", "cn")}
            placeholder={p("form.boardingPoint", "inCn")}
          />
        </div>
      </div>

      {visibility.route && (
        <>
          <p className="text-[12px] font-semibold text-[#543A14] mt-1">
            {t("form.route")}
          </p>
          <div className="flex flex-col gap-y-2">
            <div>
              <BulletListInput
                value={v.route.th}
                onChange={setMlBullet("route", "th")}
                placeholder={p("form.route", "inTh")}
              />
            </div>
            <div>
              <BulletListInput
                value={v.route.en}
                onChange={setMlBullet("route", "en")}
                placeholder={p("form.route", "inEn")}
              />
            </div>
            <div>
              <BulletListInput
                value={v.route.cn}
                onChange={setMlBullet("route", "cn")}
                placeholder={p("form.route", "inCn")}
              />
            </div>
          </div>
        </>
      )}

      {visibility.departureTime && (
        <>
          <p className="text-[12px] font-semibold text-[#543A14] mt-1">
            {t("form.departureTime")}
          </p>
          <div className="flex flex-col gap-y-2">
            <div>
              <BulletListInput
                value={v.departureTime.th}
                onChange={setMlBullet("departureTime", "th")}
                placeholder={p("form.departureTime", "inTh")}
              />
            </div>
            <div>
              <BulletListInput
                value={v.departureTime.en}
                onChange={setMlBullet("departureTime", "en")}
                placeholder={p("form.departureTime", "inEn")}
              />
            </div>
            <div>
              <BulletListInput
                value={v.departureTime.cn}
                onChange={setMlBullet("departureTime", "cn")}
                placeholder={p("form.departureTime", "inCn")}
              />
            </div>
          </div>
        </>
      )}

      {visibility.price && (
        <>
          <p className="text-[12px] font-semibold text-[#543A14] mt-1">
            {t("form.price")}
          </p>
          <input
            type="number"
            min={0}
            placeholder={t("form.price")}
            value={v.price === 0 ? "" : v.price}
            onChange={(e) =>
              ch((f) => ({ ...f, price: Number(e.target.value) || 0 }))
            }
            className={inputCls}
          />
        </>
      )}

      {visibility.phone && (
        <>
          <p className="text-[12px] font-semibold text-[#543A14] mt-1">
            {t("form.phone")}
          </p>
          <input
            placeholder={t("form.phone")}
            value={v.phone ?? ""}
            onChange={(e) => ch((f) => ({ ...f, phone: e.target.value }))}
            className={inputCls}
          />
        </>
      )}

      <p className="text-[12px] font-semibold text-[#543A14] mt-1">
        {t("form.link")}
      </p>
      <input
        placeholder={t("form.link")}
        value={v.link}
        onChange={(e) => ch((f) => ({ ...f, link: e.target.value }))}
        className={inputCls}
      />

      {visibility.lineLink && (
        <input
          placeholder={t("form.lineLink")}
          value={v.lineLink ?? ""}
          onChange={(e) => ch((f) => ({ ...f, lineLink: e.target.value }))}
          className={inputCls}
        />
      )}

      {error && <p className="text-[#FF0000] text-[12px]">{error}</p>}
      <div className="flex gap-x-2">
        <button
          onClick={onSave}
          className="flex-1 bg-[#BF4B17] text-white text-[13px] font-semibold rounded-full py-2"
        >
          {saveLabel}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 border border-[#C6C6C6] text-[#543A14] text-[13px] font-semibold rounded-full py-2"
          >
            {t("dashboard.cancel")}
          </button>
        )}
      </div>
    </div>
  );
}
