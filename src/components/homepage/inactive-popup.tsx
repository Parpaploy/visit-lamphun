import { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";

export default function InactivePopup({
  setIsInactivePopup,
}: {
  setIsInactivePopup: (val: boolean) => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="max-w-107.5 mx-auto fixed inset-0 backdrop-blur-[5px] flex items-center justify-center z-50">
      <div className="relative border border-black/30 bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-[42px] px-8 py-15 w-[85%] text-center">
        <button
          onClick={() => setIsInactivePopup(false)}
          className="rounded-full border border-[#D9D9D9] p-1 absolute top-4 right-4 text-[#543A14]"
        >
          <RxCross2 size={28} />
        </button>

        <div className="w-28 h-28 mx-auto">
          <img className="w-full h-full" src="/icons/homepage/pray.svg" />
        </div>

        <h2 className="text-[24px] font-bold text-[#543A14]">
          วันนี้รถรางหยุดให้บริการ
        </h2>

        <p className="text-[16px] font-normal text-[#543A14] mt-2 mb-3">
          ขออภัยในความไม่สะดวก
        </p>

        <div className="flex flex-col justify-center items-center">
          <p className="text-[16px] font-normal text-[#543A14] mt-3">
            สอบถามข้อมูลเพิ่มเติม
          </p>

          <div className="flex justify-center items-center gap-3">
            <div className="w-5 h-5">
              <img className="w-full h-full" src="/icons/navbar/phone.svg" />
            </div>

            <p className="mt-1 text-[16px] font-normal text-[#543A14]">
              โทรศัพท์ : 085-6950729
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
