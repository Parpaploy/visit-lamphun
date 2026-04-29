import type { OtherItem } from "../../interfaces/content.interface";

const inputCls =
  "border border-[#C6C6C6] rounded-xl px-3 py-2 text-[13px] text-[#543A14] outline-none placeholder:text-[#C6C6C6] w-full";
const selectCls = `${inputCls} bg-white`;

export default function OtherForm({
  v,
  ch,
  onSave,
  onCancel,
  saveLabel,
  error,
}: {
  v: Omit<OtherItem, "id">;
  ch: (k: keyof Omit<OtherItem, "id">, val: string) => void;
  onSave: () => void;
  onCancel?: () => void;
  saveLabel: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-y-2">
      <input
        placeholder="สถานที่ *"
        value={v.place}
        onChange={(e) => ch("place", e.target.value)}
        className={inputCls}
      />
      <textarea
        placeholder="คำอธิบาย"
        value={v.desc}
        onChange={(e) => ch("desc", e.target.value)}
        rows={2}
        className={`${inputCls} resize-none`}
      />
      <textarea
        placeholder="คำอธิบายเพิ่มเติม"
        value={v.desc2}
        onChange={(e) => ch("desc2", e.target.value)}
        rows={2}
        className={`${inputCls} resize-none`}
      />
      <div className="grid grid-cols-2 gap-2">
        <select
          value={v.type}
          onChange={(e) => ch("type", e.target.value)}
          className={selectCls}
        >
          <option value="bus">รถบัส</option>
          <option value="tricycle">สามล้อ</option>
          <option value="songthaew">สองแถว</option>
        </select>
        <select
          value={v.day}
          onChange={(e) => ch("day", e.target.value)}
          className={selectCls}
        >
          <option value="weekday">วันธรรมดา</option>
          <option value="weekend">วันหยุด</option>
        </select>
        <input
          placeholder="เบอร์โทร"
          value={v.phone}
          onChange={(e) => ch("phone", e.target.value)}
          className={inputCls}
        />
        <input
          placeholder="ลิงก์"
          value={v.link}
          onChange={(e) => ch("link", e.target.value)}
          className={inputCls}
        />
      </div>
      {error && <p className="text-red-500 text-[12px]">{error}</p>}
      <div className="flex gap-x-2">
        <button
          onClick={onSave}
          className="flex-1 bg-[#BF4B17] text-white text-[13px] font-semibold rounded-full py-2"
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
