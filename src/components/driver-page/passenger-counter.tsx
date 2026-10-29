import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useTramPosition } from "../../hooks/useTramPosition";
import { updateTramPassengerCount } from "../../services/tram.services";
import { subscribeTransportStats } from "../../services/stat.services";

interface Props {
  tramId: string;
}

export default function PassengerCounter({ tramId }: Props) {
  const tram = useTramPosition(tramId);
  const count = Math.max(0, tram?.passenger_count ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [tramUsers, setTramUsers] = useState<number>(0);

  useEffect(() => {
    const unsub = subscribeTransportStats((stats) => {
      setTramUsers(stats.tram);
    });
    return () => unsub();
  }, []);

  const changeCount = async (delta: number) => {
    if (!tramId || count + delta < 0) return;
    try {
      await updateTramPassengerCount(tramId, delta);
      setError(null);
    } catch (err) {
      console.error("Passenger count update failed:", err);
      setError("บันทึกจำนวนผู้โดยสารไม่ได้ กรุณาตรวจสอบสัญญาณอินเทอร์เน็ต");
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 mb-2">
      <p className="mx-auto text-[14px] font-medium text-[#543A14]/80 mb-2">
        จำนวนผู้เข้าใช้แอปพลิเคชันขณะนี้ {tramUsers} คน
      </p>

      <div className="w-full bg-white rounded-[18px] shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] py-3 px-5">
        <p className="text-[16px] font-medium text-[#543A14] text-center">
          จำนวนผู้ซื้อตั๋ว
        </p>
        <div className="flex justify-center items-center gap-6 mt-1">
          <button
            onClick={() => changeCount(-1)}
            disabled={count <= 0}
            className={`${count <= 0 ? "bg-[#B9B9B9]" : "bg-[#FF8B2B]"} w-11 h-11 rounded-full text-white flex justify-center items-center transition-all active:scale-110 shadow-[0_4px_4px_0_rgba(0,0,0,0.125)]`}
          >
            <FaMinus size={18} />
          </button>
          <span className="min-w-16 text-center text-[32px] font-bold text-[#543A14]">
            {count}
          </span>
          <button
            onClick={() => changeCount(1)}
            className="bg-[#FF8B2B] w-11 h-11 rounded-full text-white flex justify-center items-center transition-all active:scale-110 shadow-[0_4px_4px_0_rgba(0,0,0,0.125)]"
          >
            <FaPlus size={18} />
          </button>
        </div>
        <p className="text-[12px] text-[#765932] text-center mt-1">คน</p>
        {error && (
          <p className="text-[14px] text-[#FF0000] text-center bg-red-50 rounded-xl px-3 py-2 mt-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
