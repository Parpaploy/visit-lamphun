export default function DayBlock({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="w-full py-2 border-2 bg-white text-[#655F68] border-[#D9D9D9] rounded-2xl flex flex-col justify-center items-center">
      <p className="text-[16px] font-semibold -mb-1">{title}</p>
      <p className="text-[12px] font-medium">{desc}</p>
    </div>
  );
}
