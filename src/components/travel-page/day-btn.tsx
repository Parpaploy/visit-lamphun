export default function DayButton({
  title,
  desc,
  day,
  week,
  setDay,
}: {
  title: string;
  desc: string;
  day: string;
  week: "weekday" | "weekend";
  setDay: (day: "weekday" | "weekend") => void;
}) {
  return (
    <button
      onClick={() => {
        setDay(week);
      }}
      className={`w-full ${day === week ? "text-white bg-[linear-gradient(65deg,#FC8B32_0%,#FBC859_100%)] border-transparent py-2.5" : "py-2 border-2 bg-white text-[#655F68] border-[#D9D9D9]"} rounded-2xl flex flex-col`}
    >
      <p className="text-[16px] font-semibold -mb-1">{title}</p>
      <p className="text-[12px] font-medium">{desc}</p>
    </button>
  );
}
