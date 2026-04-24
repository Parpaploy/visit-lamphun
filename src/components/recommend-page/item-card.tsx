import { useTranslation } from "react-i18next";

export default function ItemCard({
  title,
  desc,
  imgUrl,
}: {
  title: string;
  desc: string;
  imgUrl: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="w-full border-b-2 border-[#D9D9D9] flex flex-col justify-start items-center gap-y-4 pt-7 pb-4">
      <div className="w-full h-35 rounded-[18px] overflow-hidden">
        <img className="w-full h-full" src={imgUrl} />
      </div>

      <div className="w-full text-start">
        <p className="text-[18px] font-medium mb-3">{title}</p>
        <p className="text-[13px] font-medium text-[#87745A]">{desc}</p>
      </div>

      <div className="w-full flex justify-end items-center">
        <div className="text-[12px] border border-[#BF4B17] rounded-full px-3">
          {t("menu.more")}
        </div>
      </div>
    </div>
  );
}
