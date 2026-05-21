import { useEffect, useState } from "react";
import { verifyTramPin, fetchActiveTrams } from "../services/tram.services";
import type { Tram } from "../interfaces/tram.interface";
import { useNavigate } from "react-router-dom";
import { FaDeleteLeft } from "react-icons/fa6";

export default function DriverLoginPage() {
  const navigate = useNavigate();
  const [trams, setTrams] = useState<Tram[]>([]);
  const [selectedTram, setSelectedTram] = useState<Tram | null>(null);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchActiveTrams();
        setTrams(data);
      } catch (err) {
        console.error(err);
        setError("โหลดข้อมูลรถรางไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const checkPin = async (inputPin?: string) => {
    if (!selectedTram) {
      setError("กรุณาเลือกรถรางก่อน");
      return;
    }

    const finalPin = inputPin ?? pin;
    const res = await verifyTramPin(selectedTram.id, finalPin);

    if (res.success && res.data) {
      localStorage.setItem("driver_logged_in", "true");
      localStorage.setItem("driver_tram_id", selectedTram.id);
      navigate("/driver/checkin");
    } else {
      setError("PIN ไม่ถูกต้อง");
      setPin("");
    }
  };

  const handleInput = (value: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + value;
    setPin(newPin);

    if (newPin.length === 4) {
      setTimeout(() => checkPin(newPin), 150);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <main className="w-full max-w-107.5 h-svh mx-auto overflow-hidden">
      <div className="w-full h-full relative bg-[linear-gradient(0deg,rgba(219,138,96,1)_0%,rgba(255,139,43,1)_40%,rgba(251,201,90,1)_100%)]">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-[url('/images/landingPage/landing-bg.svg')] bg-cover bg-center" />
          <img
            src="/images/landingPage/landing-all-logo.svg"
            className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[60%]"
          />
        </div>

        <div className="absolute inset-0 backdrop-blur-[5px] bg-white/10" />

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-5">
          <div className="relative w-full bg-white rounded-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-5">
            <div className="rounded-full overflow-hidden w-20 h-20 absolute -top-10 left-1/2 -translate-x-1/2">
              <img
                className="w-full h-full"
                src="/icons/login-page/profile-pic-icon.svg"
              />
            </div>

            <h2 className="text-start text-[16px] text-[#797979] font-bold mb-2">
              เลือกรถราง
            </h2>
            <div className="flex justify-center items-center gap-3">
              {trams.map((t, index) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTram(t);
                    setError("");
                    setPin("");
                  }}
                  className={`transition-all rounded-[9px] py-1 border text-center px-3 text-[16px] font-medium ${
                    selectedTram?.id === t.id
                      ? "bg-[#FF8B2B] text-white border-transparent"
                      : "text-[#797979] bg-[#E8E8E8] border-[#D9D9D9]"
                  }`}
                >
                  คันที่ <br /> {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex gap-4 mt-8 mb-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-white/60 flex items-center justify-center"
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    pin[i] ? "bg-white scale-100" : "scale-0"
                  }`}
                />
              </div>
            ))}

            {error && (
              <p className="absolute left-1/2 -translate-x-1/2 -bottom-11 whitespace-nowrap text-red-500 text-center mb-3">
                {error}
              </p>
            )}
          </div>

          <div className="w-full grid grid-cols-3 items-start px-15 pt-5 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => handleInput(n.toString())}
                className="transition-all duration-150 active:scale-110 active:bg-[#FF8B2B] active:text-white active:border-transparent bg-white border-[#D9D9D9] text-[#655F68] rounded-full py-1 aspect-square text-[20px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]"
              >
                {n}
              </button>
            ))}
            <div />
            <button
              onClick={() => handleInput("0")}
              className="transition-all duration-150 active:scale-110 active:bg-[#FF8B2B] active:text-white active:border-transparent bg-white border-[#D9D9D9] text-[#655F68] rounded-full py-1 aspect-square text-[20px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]"
            >
              0
            </button>
            <button
              onClick={() => setPin((p) => p.slice(0, -1))}
              className="flex justify-center duration-150 items-center transition-all active:scale-110 active:bg-[#FF8B2B] active:text-white active:border-transparent bg-white border-[#D9D9D9] text-[#655F68] rounded-full py-1 aspect-square text-[24px] text-center shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]"
            >
              <FaDeleteLeft />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
