export default function NewsLoader() {
  return (
    <div className="w-full flex flex-col animate-pulse">
      <div className="flex flex-col justify-between items-center gap-y-3 px-4 pb-5 bg-white">
        <div className="h-6 w-28 rounded bg-gray-200" />
        <div className="w-full h-85 rounded-[18px] bg-gray-200" />
        <div className="h-8 w-36 rounded-full bg-gray-200" />
        <div className="w-full border-b border-[#D9D9D9] h-1" />
      </div>

      <div className="-mt-3 px-4 pt-4 pb-2 flex flex-col justify-between items-center gap-y-3">
        <div className="h-6 w-32 rounded bg-gray-200 -mb-1" />
        <div className="w-full h-40 rounded-[18px] bg-gray-200" />
        <div className="w-full flex flex-col gap-y-2 px-1">
          <div className="h-3.5 w-full rounded bg-gray-200" />
          <div className="h-3.5 w-4/5 rounded bg-gray-200" />
        </div>
        <div className="h-8 w-36 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
