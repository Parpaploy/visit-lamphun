export default function EmergencyPhoneCardLoader() {
  return (
    <div className="w-full grid grid-cols-2 gap-2 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="min-h-23 w-full flex justify-center items-center p-2.5 pb-3 rounded-[20px] shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)]"
        >
          <div className="flex flex-col items-center justify-center gap-y-2 w-full">
            <div className="h-4 w-30 rounded bg-gray-200" />

            <div className="w-full flex justify-center items-center gap-2">
              <div className="w-7 h-7 rounded bg-gray-200 shrink-0" />
              <div className="h-7 w-24 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
