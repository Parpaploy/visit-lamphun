import { useEffect } from "react";

interface Props {
  onConfirm: () => void;
}

export default function FinishRoutePopup({ onConfirm }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="max-w-107.5 mx-auto fixed inset-0 backdrop-blur-[5px] flex items-center justify-center z-50">
      <div className="border border-black/30 bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-[42px] px-12 pt-12 pb-8 w-[85%] text-center">
        <div className="flex justify-center mb-5">
          <div className="w-28 h-28 rounded-full flex items-center justify-center">
            <img
              className="w-full h-full"
              src="/icons/driver-page/finish-icon.svg"
            />
          </div>
        </div>
        <p className="text-[24px] font-bold text-[#543A14] mb-1">
          รอบรถรางเสร็จสิ้น
        </p>
        <p className="text-[16px] font-normal text-[#543A14] mb-7">
          ขอบคุณที่ขับขี่อย่างปลอดภัย
        </p>
        <button
          onClick={onConfirm}
          className="bg-[#FF8B2B] text-[20px] font-medium text-white rounded-full py-2 px-8"
        >
          เริ่มรอบใหม่
        </button>
      </div>
    </div>
  );
}
