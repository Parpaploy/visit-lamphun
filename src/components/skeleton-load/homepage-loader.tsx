export default function HomepageLoader() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col p-2 animate-pulse bg-gray-50">
      <div className="flex justify-between w-full">
        <div className="space-y-1">
          <div className="w-24 h-3 bg-gray-200 rounded" />
          <div className="w-24 h-7 bg-gray-200 rounded-full" />
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="w-48 h-3 bg-gray-200 rounded" />
          <div className="w-32 h-3 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="mt-10 w-full h-3/4 bg-gray-100 rounded-3xl" />
    </div>
  );
}
