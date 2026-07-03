export default function TravelLoader() {
  return (
    <div className="flex flex-col bg-white w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-2 border-[#D9D9D9] rounded-[20px] pt-3 pb-5 px-7 animate-pulse gap-y-4">
      <div className="flex items-center gap-3">
        <div className="w-13 h-13 rounded-full bg-gray-200 shrink-0" />
        <div className="mt-5 w-full flex flex-col gap-1.5">
          <div className="w-full h-4 rounded bg-gray-200" />
          <div className="w-full  h-3 rounded bg-gray-200" />
          <div className="w-full  h-2 rounded bg-gray-200" />
        </div>
      </div>

      <div className="w-full flex justify-end items-center">
        <div className="w-24 h-5 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
