export default function RecommendLoader2() {
  return (
    <div className="relative w-full border-b-2 border-[#D9D9D9] flex justify-start items-center gap-x-5 py-5 animate-pulse">
      <div className="w-[40%] aspect-square rounded-[18px] bg-gray-200 shrink-0" />
      <div className="w-full flex flex-col gap-2">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-3/4 rounded bg-gray-200" />
      </div>
    </div>
  );
}
