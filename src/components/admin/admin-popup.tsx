import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { STATION_IDS, inputCls } from "../../constant/admin";
import { STATION_NAMES_ML } from "../../constant/homepage";
import { useStationPopup } from "../../hooks/useStationPopup";
import { updateStationPopup } from "../../services/homepage.services";
import { uploadImage } from "../../services/dashboard.services";
import type { MLString } from "../../interfaces/content.interface";

const EMPTY_ML: MLString = { th: "", en: "", cn: "" };

export default function AdminPopup() {
  const { t, i18n } = useTranslation();
  const lang =
    i18n.language === "en" || i18n.language === "cn" ? i18n.language : "th";
  const stationName = (id: string) =>
    STATION_NAMES_ML[id]?.[lang] || STATION_NAMES_ML[id]?.th || "";
  const [selectedStation, setSelectedStation] = useState<string>(
    STATION_IDS[0],
  );
  const { data, loading, refetch } = useStationPopup(selectedStation);

  // null = no user edit yet; fall back to server data during render
  const [editedHeader, setHeader] = useState<MLString | null>(null);
  const [editedDesc, setDesc] = useState<MLString | null>(null);
  const [editedImgUrl, setImgUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const serverData = !loading && data ? data : null;
  const header = editedHeader ?? serverData?.header ?? EMPTY_ML;
  const desc = editedDesc ?? serverData?.desc ?? EMPTY_ML;
  const imgUrl = editedImgUrl ?? serverData?.img ?? "";

  const resetEdits = () => {
    setHeader(null);
    setDesc(null);
    setImgUrl(null);
    setImageFile(null);
    setPreviewUrl(null);
    setError("");
  };

  const p = (key: string, lang: "inTh" | "inEn" | "inCn") =>
    `${t(key)} ${t(`form.${lang}`)}`;

  const handleSave = async () => {
    if (!header.th.trim() || !header.en.trim() || !header.cn.trim()) {
      setError(t("dashboard.errorRequiredTitle"));
      return;
    }
    setError("");
    setSaving(true);
    try {
      let finalImg = imgUrl;
      if (imageFile) {
        finalImg = await uploadImage(imageFile);
      }
      await updateStationPopup(selectedStation, {
        header,
        desc,
        img: finalImg,
      });
      setImageFile(null);
      setPreviewUrl(null);
      refetch();
    } catch (e) {
      setError(
        `${t("dashboard.errorSave")}: ${e instanceof Error ? e.message : String(e)}`,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-4">
        <h3 className="text-[14px] font-semibold text-[#543A14] mb-3">
          {t("dashboard.editPopup")}
        </h3>

        <div className="mb-3">
          <select
            value={selectedStation}
            onChange={(e) => { setSelectedStation(e.target.value); resetEdits(); }}
            className={inputCls}
          >
            {STATION_IDS.map((id) => (
              <option key={id} value={id}>
                {stationName(id)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-[13px] text-[#8B724E]">{t("dashboard.loading")}</p>
        ) : (
          <div className="flex flex-col gap-y-2">
            <p className="text-[12px] text-[#8B724E] font-medium">
              {t("form.title")}
            </p>
            <input
              placeholder={p("form.title", "inTh")}
              value={header.th}
              onChange={(e) => setHeader({ ...header, th: e.target.value })}
              className={inputCls}
            />
            <input
              placeholder={p("form.title", "inEn")}
              value={header.en}
              onChange={(e) => setHeader({ ...header, en: e.target.value })}
              className={inputCls}
            />
            <input
              placeholder={p("form.title", "inCn")}
              value={header.cn}
              onChange={(e) => setHeader({ ...header, cn: e.target.value })}
              className={inputCls}
            />

            <p className="text-[12px] text-[#8B724E] font-medium mt-1">
              {t("form.descFull")}
            </p>
            <textarea
              placeholder={p("form.descFull", "inTh")}
              value={desc.th}
              onChange={(e) => setDesc({ ...desc, th: e.target.value })}
              rows={3}
              className={`${inputCls} resize-none`}
            />
            <textarea
              placeholder={p("form.descFull", "inEn")}
              value={desc.en}
              onChange={(e) => setDesc({ ...desc, en: e.target.value })}
              rows={3}
              className={`${inputCls} resize-none`}
            />
            <textarea
              placeholder={p("form.descFull", "inCn")}
              value={desc.cn}
              onChange={(e) => setDesc({ ...desc, cn: e.target.value })}
              rows={3}
              className={`${inputCls} resize-none`}
            />

            <p className="text-[12px] text-[#8B724E] font-medium mt-1">
              {t("dashboard.image")}
            </p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImageFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-[#C6C6C6] rounded-xl py-3 text-[13px] text-[#8B724E] hover:border-[#BF4B17] transition-colors"
            >
              {imageFile ? imageFile.name : t("dashboard.selectImage")}
            </button>
            {(previewUrl || imgUrl) && (
              <div className="w-full h-36 rounded-xl overflow-hidden">
                <img
                  src={previewUrl ?? imgUrl}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {error && <p className="text-red-500 text-[12px]">{error}</p>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#BF4B17] text-white text-[13px] font-semibold rounded-full py-2 disabled:opacity-60"
            >
              {saving ? t("dashboard.saving") : t("dashboard.save")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
