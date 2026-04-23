import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

const TRAM_OPTIONS = [
  { value: "tram1", label: "รถคันที่ 1" },
  { value: "tram2", label: "รถคันที่ 2" },
  { value: "tram3", label: "รถคันที่ 3" },
  { value: "tram4", label: "รถคันที่ 4" },
];

export default function Homepage() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [selected, setSelected] = useState("tram1");
  const [selectWidth, setSelectWidth] = useState<number>(0);
  const measureRef = useRef<HTMLSpanElement>(null);

  const selectedLabel =
    TRAM_OPTIONS.find((o) => o.value === selected)?.label ?? "";

  useEffect(() => {
    if (measureRef.current) {
      setSelectWidth(measureRef.current.offsetWidth);
    }
  }, [selected, loaded]);

  return (
    <main className="relative bg-[linear-gradient(161deg,#FFE2A5_0%,#FBFCF0_22%,#FFFFFF_62%,#E6EFD8_100%)] w-full h-full overflow-hidden">
      {!loaded && <div className="w-full h-full animate-pulse bg-gray-200" />}

      <div
        className="w-full h-full bg-[url('/images/homepage/th-bg.svg')] bg-contain bg-center"
        style={{ display: loaded ? "block" : "none" }}
      >
        <img
          src="/images/homepage/th-bg.svg"
          className="hidden"
          onLoad={() => setLoaded(true)}
        />

        <span
          ref={measureRef}
          className="absolute invisible pointer-events-none whitespace-nowrap text-[12px] font-medium pl-3 pr-8 py-1"
        >
          {selectedLabel}
        </span>

        <div className="inline-block absolute top-1 left-2.5 z-50">
          <p className="text-[12px] text-[#8B724E] font-medium">
            เลือกรถรางที่ใช้งาน
          </p>
          <div className="relative inline-block">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              style={{ width: selectWidth > 0 ? selectWidth : undefined }}
              className="outline-none focus:outline-none focus:ring-0 appearance-none border border-[#C6C6C6] bg-white pl-3 pr-8 py-1 rounded-full text-[12px] text-[#543A14] font-medium"
            >
              {TRAM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <div className="text-[#C6C6C6] pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
              <IoIosArrowDown />
            </div>
          </div>
        </div>
        <div className="absolute top-1 text-[12px] text-[#8B724E] font-medium right-2.5 z-50 flex flex-col items-end">
          พร้อมออกเดินทางสู่จุดหมายต่อไป | ท่านมีเวลาเที่ยวชมสถานที่นี้
          <p className="text-[12px] text-[#8B724E] font-medium leading-1.5"></p>
          <div className="text-[12px] font-medium flex items-center gap-0.75">
            <>
              <span className="pt-0.5 text-[#543A14]">
                10.00 นาที | รถรางกำลังรอคุณอยู่
              </span>
              <img src="/icons/info-icon.svg" />
            </>
          </div>
        </div>
      </div>
    </main>
  );
}
