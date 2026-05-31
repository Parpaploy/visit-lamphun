import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { inputCls } from "../../constant/admin";
import { useStationPopup } from "../../hooks/useStationPopup";
import { updateStationPopup } from "../../services/homepage.services";
import { uploadImage } from "../../services/dashboard.services";
import type { MLString } from "../../interfaces/content.interface";

const EMPTY_ML: MLString = { th: "", en: "", cn: "" };

export default function AdminPopup({
  selectedStation,
}: {
  selectedStation: string;
}) {
  const { t } = useTranslation();
  // const lang =
  //   i18n.language === "en" || i18n.language === "cn" ? i18n.language : "th";
  // const stationName = (id: string) =>
  //   STATION_NAMES_ML[id]?.[lang] || STATION_NAMES_ML[id]?.th || "";
  // const [selectedStation, setSelectedStation] = useState<string>(
  //   STATION_IDS[0],
  // );
  const { data, loading, refetch } = useStationPopup(selectedStation);

  const [editedHeader, setHeader] = useState<MLString | null>(null);
  const [editedDesc, setDesc] = useState<MLString | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const serverData = !loading && data ? data : null;
  const header = editedHeader ?? serverData?.header ?? EMPTY_ML;
  const desc = editedDesc ?? serverData?.desc ?? EMPTY_ML;
  const imgUrl = serverData?.img ?? "";

  // const resetEdits = () => {
  //   setHeader(null);
  //   setDesc(null);
  //   setImgUrl(null);
  //   setImageFile(null);
  //   setPreviewUrl(null);
  //   setError("");
  // };

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
      {/* <div>
        <label className="block text-[13px] text-[#8B724E] font-medium mb-1">
          {t("dashboard.selectStation")}
        </label>
        <select
          value={selectedStation}
          onChange={(e) => {
            setSelectedStation(e.target.value);
            resetEdits();
          }}
          className="w-full border border-[#C6C6C6] bg-white rounded-xl px-4 py-2.5 text-[14px] text-[#543A14] outline-none"
        >
          {STATION_IDS.map((id) => (
            <option key={id} value={id}>
              {stationName(id)}
            </option>
          ))}
        </select>
      </div> */}

      <div className="bg-white min-h-[68svh] h-full rounded-2xl border border-[#D9D9D9] shadow-sm p-4">
        {loading ? (
          <p className="text-[13px] text-[#8B724E]">{t("dashboard.loading")}</p>
        ) : (
          <div className="flex flex-col gap-y-2">
            <p className="text-[12px] text-[#8B724E] font-medium">
              {t("form.title")}
            </p>
            <div className="flex justify-center items-center w-full gap-x-3">
              <div>
                <div className="w-full flex justify-center items-center">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setImageFile(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }}
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative aspect-square w-auto h-60 mx-auto rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed transition-all duration-200
        ${
          previewUrl || imgUrl
            ? "border-[#BF4B17]"
            : "border-[#D9C5AE] hover:border-[#BF4B17] flex flex-col items-center justify-center gap-1 bg-[#FDF8F3] hover:bg-[#FFF1E8]"
        }`}
                    >
                      {previewUrl || imgUrl ? (
                        <>
                          <img
                            src={previewUrl ?? imgUrl}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />

                          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[13px] font-medium">
                              {t("dashboard.changeImage")}
                            </span>
                          </div>

                          {(imageFile || previewUrl) && (
                            <div className="absolute bottom-2 left-2 right-2">
                              <span className="inline-block bg-black/50 backdrop-blur-sm text-white text-[11px] rounded-lg px-2.5 py-1 truncate max-w-full">
                                {imageFile?.name}
                              </span>
                            </div>
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

                          <p className="text-[11px] text-[#C4A882]">
                            JPG, PNG, WEBP
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center w-full gap-y-3">
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
              </div>
            </div>

            <p className="text-[12px] text-[#8B724E] font-medium mt-1">
              {t("form.descFull")}
            </p>
            <div className="w-full flex justify-center items-center gap-x-3">
              <textarea
                placeholder={p("form.descFull", "inTh")}
                value={desc.th}
                onChange={(e) => setDesc({ ...desc, th: e.target.value })}
                rows={15}
                className={`${inputCls} resize-none`}
              />
              <textarea
                placeholder={p("form.descFull", "inEn")}
                value={desc.en}
                onChange={(e) => setDesc({ ...desc, en: e.target.value })}
                rows={15}
                className={`${inputCls} resize-none`}
              />
              <textarea
                placeholder={p("form.descFull", "inCn")}
                value={desc.cn}
                onChange={(e) => setDesc({ ...desc, cn: e.target.value })}
                rows={15}
                className={`${inputCls} resize-none`}
              />
            </div>

            {error && <p className="text-[#FF0000] text-[12px]">{error}</p>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#BF4B17] text-white text-[13px] font-semibold rounded-full py-2 disabled:opacity-60 mt-1"
            >
              {saving ? t("dashboard.saving") : t("dashboard.save")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
