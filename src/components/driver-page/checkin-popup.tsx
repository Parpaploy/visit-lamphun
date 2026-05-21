import type { Station } from "../../interfaces/tram.interface";

interface Props {
  station: Station;
  index: number;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CheckinPopup({
  station,
  index,
  onConfirm,
  onClose,
}: Props) {
  return (
    <div
      className="fixed inset-0 backdrop-blur-[5px] flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="border border-black/30 bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-[42px] px-8 py-15 w-[85%] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[24px] font-bold mb-1 text-[#543A14]">
          ยืนยันการ<span className="text-[#559200]">เช็คอิน</span>
        </p>
        <p className="text-[24px] font-bold mb-4 text-[#543A14]">
          จุดที่ {index + 1}
        </p>
        <div className="bg-[#FFF0DC] rounded-[9px] text-center px-4 py-6 text-[20px] font-medium text-[#543A14] mb-5">
          {station.name}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#FF8B2B] text-white rounded-full py-2 text-[20px] font-medium"
          >
            ยืนยัน
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#B9B9B9] text-white rounded-full py-2 text-[20px] font-medium"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}
