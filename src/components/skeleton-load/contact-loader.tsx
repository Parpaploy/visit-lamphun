export default function ContactLoader() {
  return (
    <div className="overflow-hidden flex flex-col border-2 border-[#D9D9D9] rounded-[15px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] animate-pulse">
      <div className="py-2 w-full bg-gray-200 h-9" />
      <div className="w-full px-7 py-4 flex flex-col gap-y-3">
        <div className="w-3/4 h-3 rounded bg-gray-200 mx-auto" />
        <div className="flex items-center gap-x-3">
          <div className="w-5 h-5 rounded bg-gray-200 shrink-0" />
          <div className="w-2/3 h-3 rounded bg-gray-200" />
        </div>
        <div className="flex items-center gap-x-3">
          <div className="w-5 h-5 rounded bg-gray-200 shrink-0" />
          <div className="w-1/2 h-3 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
