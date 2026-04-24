export default function TravelLoader() {
  return (
    <div className="flex flex-col bg-white w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-2 border-[#D9D9D9] rounded-[20px] p-4 animate-pulse gap-y-4">
      <div className="w-full flex justify-between items-center pb-4 border-b border-dashed border-[#D9D9D9]">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
            <div className="flex flex-col gap-1.5">
              <div className="w-14 h-4 rounded bg-gray-200" />
              <div className="w-10 h-3 rounded bg-gray-200" />
            </div>
          </div>
          <div className="w-28 h-3 rounded bg-gray-200" />
        </div>
        <div className="w-12 h-3 rounded bg-gray-200 mx-2" />
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1.5 items-end">
              <div className="w-14 h-4 rounded bg-gray-200" />
              <div className="w-10 h-3 rounded bg-gray-200" />
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
          </div>
          <div className="w-28 h-3 rounded bg-gray-200" />
        </div>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="w-14 h-4 rounded bg-gray-200" />
        <div className="w-24 h-3 rounded bg-gray-200" />
        <div className="w-16 h-6 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
