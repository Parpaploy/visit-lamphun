import { useTranslation } from "react-i18next";

export default function ItemMenu({
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
    <div className="relative w-full border-b-2 border-[#D9D9D9] flex justify-start items-center gap-x-5 py-5">
      <div className="w-[40%] h-auto aspect-square rounded-[18px] overflow-hidden">
        <img className="w-full h-full" src={imgUrl} loading="lazy" />
      </div>

      <div className="w-full text-start">
        <p className="text-[16px] font-medium">{title}</p>
        <p className="text-[13px] font-medium text-[#87745A]">{desc}</p>
      </div>

      <div className="absolute bottom-3 right-0 text-[12px] border border-[#BF4B17] rounded-full px-3">
        {t("menu.more")}
      </div>
    </div>
  );
}
