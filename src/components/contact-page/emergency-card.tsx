import type { CardItem } from "../../interfaces/contact.interface";

function PhoneItem({ text }: { text: string }) {
  return (
    <div className="flex justify-center items-start gap-x-3">
      <div className="min-w-5 w-5">
        <img
          className="w-full h-auto"
          src="/icons/contact-page/phone-icon.svg"
        />
      </div>
      <span className="text-[12px] text-[#543A14] font-medium text-start">
        {text}
      </span>
    </div>
  );
}

function AddressItem({ text }: { text: string }) {
  return (
    <span className="text-[12px] text-[#543A14] text-center font-medium">
      {text}
    </span>
  );
}

function HoursItem({ text }: { text: string }) {
  return (
    <div className="flex justify-start items-end gap-x-3">
      <div className="w-7">
        <img
          className="w-full h-auto"
          src="/icons/contact-page/open-icon.svg"
        />
      </div>
      <span className="text-[12px] text-[#543A14] text-center font-medium">
        {text}
      </span>
    </div>
  );
}

export default function EmergencyCard({
  header,
  items,
}: {
  header: string;
  items: CardItem[];
}) {
  return (
    <div className="overflow-hidden flex flex-col justify-start items-start border-2 border-[#D9D9D9] rounded-[15px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
      <h1 className="py-2 text-center w-full bg-[#FFF0DC] text-black font-medium text-[16px]">
        {header}
      </h1>

      <div className="w-full h-full px-7 py-4 flex flex-col justify-between items-start gap-y-3">
        {items.map((item, index) => {
          if (item.type === "phone")
            return <PhoneItem key={index} text={item.text} />;
          if (item.type === "address")
            return <AddressItem key={index} text={item.text} />;
          if (item.type === "hours")
            return <HoursItem key={index} text={item.text} />;
        })}
      </div>
    </div>
  );
}
