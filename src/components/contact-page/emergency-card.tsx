// import { useTranslation } from "react-i18next";
// import { ml } from "../../utils/ml";
// import type { CardItem } from "../../interfaces/contact.interface";
// import type { MLString } from "../../interfaces/content.interface";

// function PhoneItem({ text }: { text: string }) {
//   return (
//     <div className="flex justify-center items-start gap-x-3">
//       <div className="min-w-5 w-5 mr-2">
//         <img
//           className="w-full h-auto"
//           src="/icons/contact-page/phone-icon.svg"
//         />
//       </div>
//       <span className="text-[12px] text-[#543A14] font-medium text-start">
//         {text}
//       </span>
//     </div>
//   );
// }

// function AddressItem({ text }: { text: string }) {
//   return (
//     <span className="text-[12px] text-[#543A14] text-start font-medium">
//       {text}
//     </span>
//   );
// }

// function HoursItem({ text }: { text: string }) {
//   const { t } = useTranslation();

//   return (
//     <div className="flex justify-start items-start gap-x-3">
//       <div className="min-w-7 w-7">
//         <img
//           className="w-full h-auto"
//           src="/icons/contact-page/open-icon.svg"
//         />
//       </div>
//       <span className="text-[12px] text-[#543A14] text-start font-medium mt-1">
//         {t("contact.open")} : {text}
//       </span>
//     </div>
//   );
// }

// export default function EmergencyCard({
//   header,
//   items,
// }: {
//   header: MLString;
//   items: CardItem[];
// }) {
//   const { t, i18n } = useTranslation();

//   return (
//     <div className="overflow-hidden flex flex-col justify-start items-start border-2 border-[#D9D9D9] rounded-[15px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
//       <h1 className="py-2 text-center w-full bg-[#FFF0DC] text-black font-medium text-[16px]">
//         {ml(header, i18n.language)}
//       </h1>
//       <div className="w-full h-full flex flex-col justify-center items-center">
//         <div className="w-fit h-full px-7 py-4 flex flex-col justify-between items-start gap-y-3">
//           {items.map((item, index) => {
//             if (item.type === "phone") {
//               const phoneText = item.ext
//                 ? `${item.text} ${t("contact.ext")} ${item.ext}`
//                 : item.text;

//               return <PhoneItem key={index} text={phoneText} />;
//             }
//             if (item.type === "address")
//               return <AddressItem key={index} text={item.text} />;
//             if (item.type === "hours")
//               return <HoursItem key={index} text={item.text} />;
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useTranslation } from "react-i18next";
import { ml } from "../../utils/ml";
import type { CardItem } from "../../interfaces/contact.interface";
import type { MLString } from "../../interfaces/content.interface";

function PhoneItem({
  label,
  numberText,
}: {
  label?: string;
  numberText: string;
}) {
  const { t } = useTranslation();
  const hasLabel = !!label?.trim();

  if (!hasLabel) {
    return (
      <span className="text-[16px] text-black font-medium text-start">
        {t("contact.phone")} : {numberText}
      </span>
    );
  }

  return (
    <div className="w-full flex flex-col gap-y-0.5">
      <span className="text-[16px] text-black font-bold text-start">
        {label}
      </span>
      <div className="flex justify-start items-start gap-x-2 pl-2">
        <span className="text-black shrink-0">•</span>
        <span className="text-[16px] text-black font-medium text-start">
          {numberText}
        </span>
      </div>
    </div>
  );
}

function HoursItem({ text }: { text: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-start items-start gap-x-3">
      <span className="text-[16px] text-black font-medium text-start">
        {t("contact.open")} : {text}
      </span>
    </div>
  );
}

export default function EmergencyCard({
  header,
  items,
}: {
  header: MLString;
  items: CardItem[];
}) {
  const { t, i18n } = useTranslation();

  return (
    <div className="overflow-hidden flex flex-col justify-start items-start rounded-[20px] bg-white shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)]">
      <h1 className="py-2.5 text-center w-full bg-[#BF4B17] text-white font-bold text-[16px]">
        {ml(header, i18n.language)}
      </h1>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-fit h-full px-7 py-3 flex flex-col justify-between items-start gap-y-2">
          {items.map((item, index) => {
            if (item.type === "phone") {
              const numberText = item.ext
                ? `${item.text} ${t("contact.ext")} ${item.ext}`
                : item.text;

              return (
                <PhoneItem
                  key={index}
                  label={item.label}
                  numberText={numberText}
                />
              );
            }
            if (item.type === "hours")
              return <HoursItem key={index} text={item.text} />;
          })}
        </div>
      </div>
    </div>
  );
}
