export default function LineLoader() {
  return (
    <div className="w-full min-h-full flex flex-col justify-start items-center gap-y-2 px-4 animate-pulse">
      <div className="h-6 w-16 rounded bg-gray-200 -mb-1" />
      <div className="w-full h-44 rounded-[18px] bg-gray-200" />
      <div className="w-full flex flex-col gap-y-2 mb-5">
        <div className="h-3.5 w-full rounded bg-gray-200" />
        <div className="h-3.5 w-3/4 rounded bg-gray-200" />
      </div>
      <div className="h-8 w-36 rounded-full bg-gray-200" />
    </div>
  );
}
