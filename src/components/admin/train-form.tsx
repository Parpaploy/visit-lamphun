import type { TrainItem } from "../../interfaces/content.interface";

const inputCls =
  "border border-[#C6C6C6] rounded-xl px-3 py-2 text-[13px] text-[#543A14] outline-none placeholder:text-[#C6C6C6] w-full";
const selectCls = `${inputCls} bg-white`;

export default function TrainForm({
  val: v,
  onChange: ch,
  onSave,
  onCancel,
  saveLabel,
  error,
}: {
  val: Omit<TrainItem, "id">;
  onChange: (k: keyof Omit<TrainItem, "id">, v: string | number) => void;
  onSave: () => void;
  onCancel?: () => void;
  saveLabel: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input
          placeholder="ต้นทาง *"
          value={v.origin}
          onChange={(e) => ch("origin", e.target.value)}
          className={inputCls}
        />
        <input
          placeholder="ปลายทาง *"
          value={v.destination}
          onChange={(e) => ch("destination", e.target.value)}
          className={inputCls}
        />
        <input
          placeholder="เวลาออกเดินทาง *"
          value={v.originTime}
          onChange={(e) => ch("originTime", e.target.value)}
          className={inputCls}
        />
        <input
          placeholder="เวลาถึงปลายทาง *"
          value={v.destinationTime}
          onChange={(e) => ch("destinationTime", e.target.value)}
          className={inputCls}
        />
        <input
          placeholder="สถานีต้นทาง"
          value={v.originStation}
          onChange={(e) => ch("originStation", e.target.value)}
          className={inputCls}
        />
        <input
          placeholder="สถานีปลายทาง"
          value={v.destinationStation}
          onChange={(e) => ch("destinationStation", e.target.value)}
          className={inputCls}
        />
        <input
          placeholder="ราคา (บาท)"
          type="number"
          value={v.price}
          onChange={(e) => ch("price", Number(e.target.value))}
          className={inputCls}
        />
        <select
          value={v.day}
          onChange={(e) => ch("day", e.target.value as "weekday" | "weekend")}
          className={selectCls}
        >
          <option value="weekday">วันธรรมดา</option>
          <option value="weekend">วันหยุด</option>
        </select>
      </div>
      <input
        placeholder="หมายเหตุ"
        value={v.desc}
        onChange={(e) => ch("desc", e.target.value)}
        className={inputCls}
      />
      {error && <p className="text-red-500 text-[12px]">{error}</p>}
      <div className="flex gap-x-2">
        <button
          onClick={onSave}
          className="flex-1 bg-[#BF4B17] text-white text-[13px] font-semibold rounded-full py-2 disabled:opacity-60"
        >
          {saveLabel}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 border border-[#C6C6C6] text-[#543A14] text-[13px] font-semibold rounded-full py-2"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </div>
  );
}
