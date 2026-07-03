import { useTranslation } from "react-i18next";
import type { MLString } from "../../interfaces/content.interface";

interface PhoneEntry {
  label: MLString;
  number: string;
  ext?: string;
}

export default function EmergencyPhoneCard({
  //   header,
  phones,
}: {
  //   header: MLString;
  phones: PhoneEntry[];
}) {
  const { t, i18n } = useTranslation();

  const lang = i18n.language.split("-")[0] as keyof MLString;

  const safeML = (data?: MLString) => {
    if (!data) return "-";
    return data[lang] || data.th || data.en || "-";
  };

  return (
    <div className="w-full grid grid-cols-2 gap-2">
      {/* <div className="w-full bg-[#BF4B17] py-2 px-4">
        <h1 className="text-white text-[16px] font-bold text-center">
          {safeML(header)}
        </h1>
      </div> */}

      {/* LIST */}

      {phones.map((ph, idx) => (
        <div
          key={idx}
          //   href={`tel:${ph.number}${ph.ext ? `,${ph.ext}` : ""}`}
          className="w-full flex justify-center items-center p-2.5 pb-1 rounded-[20px] shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)]"
        >
          <div className="flex flex-col items-center justify-center">
            <p className="text-[16px] font-bold text-[#543A14] text-center">
              {safeML(ph.label) !== "-" ? safeML(ph.label) : t("contact.phone")}
            </p>

            <div className="w-full flex justify-center items-center gap-2">
              <div className="w-7 h-auto">
                <img
                  className="w-full h-full"
                  src="/icons/contact-page/phone-icon.svg"
                />
              </div>
              <p className="text-[32px] font-bold text-black">{ph.number}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
