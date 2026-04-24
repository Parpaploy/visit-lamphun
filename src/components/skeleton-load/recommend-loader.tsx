export default function RecommendLoader() {
  return (
    <div className="w-full border-b-2 border-[#D9D9D9] flex flex-col gap-y-4 pt-7 pb-4 animate-pulse">
      <div className="w-full h-35 rounded-[18px] bg-gray-200" />
      <div className="flex flex-col gap-2">
        <div className="h-5 w-40 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-3/4 rounded bg-gray-200" />
      </div>
      <div className="flex justify-end">
        <div className="h-6 w-16 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
