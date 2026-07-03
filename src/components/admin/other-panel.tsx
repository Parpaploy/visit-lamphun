import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOtherItems } from "../../hooks/useTravelItems";
import { EMPTY_OTHER, FIELD_VISIBILITY } from "../../constant/admin";
import type { OtherItem } from "../../interfaces/content.interface";
import {
  addOtherItem,
  deleteOtherItem,
  updateOtherItem,
} from "../../services/travel.services";
import type { OtherEdit } from "../../interfaces/admin.interface";
import OtherForm from "./other-form";

type OtherFormData = Omit<OtherItem, "id">;

const EMPTY_ML = { th: "", en: "", cn: "" };

function normalizeItem(item: OtherItem): OtherItem {
  return {
    ...item,
    place: item.place ?? { ...EMPTY_ML },
    boardingPoint: item.boardingPoint ?? { ...EMPTY_ML },
    route: item.route ?? { ...EMPTY_ML },
    departureTime: item.departureTime ?? { ...EMPTY_ML },
    price: item.price ?? 0,
    image: item.image ?? "",
    type: item.type ?? "van",
    day: item.day ?? "weekday",
    phone: item.phone ?? "",
    link: item.link ?? "",
    lineLink: item.lineLink ?? "",
  };
}

function validateForm(f: OtherFormData): boolean {
  const vis = FIELD_VISIBILITY[f.type];

  const hasPlace = f.place.th && f.place.en && f.place.cn;
  const hasBoarding =
    f.boardingPoint.th && f.boardingPoint.en && f.boardingPoint.cn;
  if (!hasPlace || !hasBoarding) return false;

  if (vis.price && (!f.price || f.price <= 0)) return false;
  if (vis.phone && !f.phone) return false;

  return true;
}

export default function OtherPanel() {
  const { t } = useTranslation();
  const { items: rawItems, loading, refetch } = useOtherItems();
  const items = (rawItems ?? []).map(normalizeItem);

  const [form, setForm] = useState<OtherFormData>(EMPTY_OTHER);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState<OtherEdit | null>(null);

  const handleAdd = async () => {
    if (!validateForm(form)) {
      setFormError(t("dashboard.errorRequiredPlace"));
      return;
    }
    setFormError("");
    setSaving(true);
    try {
      await addOtherItem(form);
      setForm(EMPTY_OTHER);
      refetch();
    } catch (e) {
      setFormError(
        `${t("dashboard.errorSave")}: ${e instanceof Error ? e.message : String(e)}`,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    if (!validateForm(editing)) {
      alert(t("dashboard.errorRequiredPlace"));
      return;
    }
    setEditing((s) => s && { ...s, saving: true });
    try {
      await updateOtherItem(editing.id, {
        place: editing.place,
        boardingPoint: editing.boardingPoint,
        route: editing.route,
        departureTime: editing.departureTime,
        price: editing.price,
        type: editing.type,
        phone: editing.phone,
        link: editing.link,
        day: editing.day,
        lineLink: editing.lineLink ?? "",
        image: editing.image ?? "",
      });
      setEditing(null);
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
      await deleteOtherItem(id);
      refetch();
    } catch {
      alert(t("dashboard.errorDelete"));
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-4">
        <h3 className="text-[14px] font-semibold text-[#543A14] mb-3">
          {t("dashboard.addTravel")}
        </h3>
        <OtherForm
          v={form}
          ch={(updater) => setForm(updater)}
          onSave={handleAdd}
          saveLabel={saving ? t("dashboard.saving") : t("dashboard.addItem")}
          error={formError}
        />
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
              className="bg-white rounded-2xl border border-[#BF4B17] p-4 flex flex-col gap-y-2"
            >
              <p className="text-[12px] font-semibold text-[#BF4B17]">
                {t("dashboard.edit")}
              </p>
              <OtherForm
                v={{
                  place: editing.place,
                  boardingPoint: editing.boardingPoint,
                  route: editing.route,
                  departureTime: editing.departureTime,
                  price: editing.price,
                  type: editing.type,
                  phone: editing.phone,
                  link: editing.link,
                  day: editing.day,
                  lineLink: editing.lineLink ?? "",
                  image: editing.image ?? "",
                }}
                ch={(updater) =>
                  setEditing((s) => {
                    if (!s) return null;
                    return { ...s, ...updater(s) };
                  })
                }
                onSave={handleSaveEdit}
                onCancel={() => setEditing(null)}
                saveLabel={
                  editing.saving ? t("dashboard.saving") : t("dashboard.save")
                }
              />
            </div>
          ) : (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm p-3 flex items-start gap-x-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#543A14] truncate">
                  {item.place.th || "-"}
                </p>
                {/* <p className="text-[11px] text-[#8B724E]">
                  {item.place.en || "-"} · {t(`form.${item.type}`)} ·{" "}
                  {t(`form.${item.day}`)}
                </p> */}
                {item.boardingPoint.th && (
                  <p className="text-[11px] text-[#C6C6C6] line-clamp-1">
                    {t("form.boardingPoint")}: {item.boardingPoint.th}
                  </p>
                )}
                {item.price > 0 && (
                  <p className="text-[11px] text-[#C6C6C6] line-clamp-1">
                    {t("form.price")}: {item.price} {t("form.baht")}
                  </p>
                )}
              </div>
              <div className="flex gap-x-3 shrink-0">
                <button
                  onClick={() => setEditing({ ...item, saving: false })}
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
