import { useEffect, useRef, useState } from "react";
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

  const [header, setHeader] = useState<MLString>({ ...EMPTY_ML });
  const [desc, setDesc] = useState<MLString>({ ...EMPTY_ML });
  const [imgUrl, setImgUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHeader({ ...EMPTY_ML });
    setDesc({ ...EMPTY_ML });
    setImgUrl("");
    setImageFile(null);
    setPreviewUrl(null);
    setError("");
  }, [selectedStation]);

  useEffect(() => {
    if (!loading && data) {
      setHeader({ ...data.header });
      setDesc({ ...data.desc });
      setImgUrl(data.img);
    }
  }, [data, loading]);

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
            onChange={(e) => setSelectedStation(e.target.value)}
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
              onChange={(e) => setHeader((h) => ({ ...h, th: e.target.value }))}
              className={inputCls}
            />
            <input
              placeholder={p("form.title", "inEn")}
              value={header.en}
              onChange={(e) => setHeader((h) => ({ ...h, en: e.target.value }))}
              className={inputCls}
            />
            <input
              placeholder={p("form.title", "inCn")}
              value={header.cn}
              onChange={(e) => setHeader((h) => ({ ...h, cn: e.target.value }))}
              className={inputCls}
            />

            <p className="text-[12px] text-[#8B724E] font-medium mt-1">
              {t("form.descFull")}
            </p>
            <textarea
              placeholder={p("form.descFull", "inTh")}
              value={desc.th}
              onChange={(e) => setDesc((d) => ({ ...d, th: e.target.value }))}
              rows={3}
              className={`${inputCls} resize-none`}
            />
            <textarea
              placeholder={p("form.descFull", "inEn")}
              value={desc.en}
              onChange={(e) => setDesc((d) => ({ ...d, en: e.target.value }))}
              rows={3}
              className={`${inputCls} resize-none`}
            />
            <textarea
              placeholder={p("form.descFull", "inCn")}
              value={desc.cn}
              onChange={(e) => setDesc((d) => ({ ...d, cn: e.target.value }))}
              rows={3}
              className={`${inputCls} resize-none`}
            />

            <p className="text-[12px] text-[#8B724E] font-medium mt-1">
              {t("dashboard.image")}
            </p>
            {(previewUrl || imgUrl) && (
              <img
                src={previewUrl ?? imgUrl}
                alt="preview"
                className="w-full h-36 object-cover rounded-xl border border-[#D9D9D9]"
              />
            )}
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
              onClick={() => fileInputRef.current?.click()}
              className="text-[13px] text-[#BF4B17] font-medium text-left"
            >
              {imgUrl || previewUrl
                ? t("dashboard.changeImage")
                : t("dashboard.selectImage")}
            </button>

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
