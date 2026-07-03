export default function EmergencyCardLoader({ mode }: { mode: number }) {
  return (
    <>
      {mode === 1 && (
        <div className="w-full overflow-hidden flex flex-col justify-start items-start rounded-[20px] bg-white shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)] animate-pulse">
          <div className="w-full h-11 bg-gray-200" />

          <div className="w-full px-7 py-4 flex flex-col gap-y-3">
            <div className="h-4 w-4/5 rounded bg-gray-200" />

            <div className="h-4 w-3/5 rounded bg-gray-200" />

            {/* <div className="flex flex-col gap-y-1.5">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-3.5 w-40 rounded bg-gray-200 ml-4" />
            </div>
    
            <div className="flex flex-col gap-y-1.5">
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-3.5 w-36 rounded bg-gray-200 ml-4" />
            </div> */}
          </div>
        </div>
      )}

      {mode === 2 && (
        <div className="w-full overflow-hidden flex flex-col justify-start items-start rounded-[20px] bg-white shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)] animate-pulse">
          <div className="w-full h-11 bg-gray-200" />

          <div className="w-full px-7 py-4 flex flex-col gap-y-3">
            {/* <div className="h-4 w-4/5 rounded bg-gray-200" /> */}

            <div className="h-4 w-3/5 rounded bg-gray-200" />

            {/* <div className="flex flex-col gap-y-1.5">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-3.5 w-40 rounded bg-gray-200 ml-4" />
            </div>
    
            <div className="flex flex-col gap-y-1.5">
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-3.5 w-36 rounded bg-gray-200 ml-4" />
            </div> */}
          </div>
        </div>
      )}

      {mode === 3 && (
        <div className="w-full overflow-hidden flex flex-col justify-start items-start rounded-[20px] bg-white shadow-[0_0px_12.3px_0_rgba(50,33,21,0.15)] animate-pulse">
          <div className="w-full h-11 bg-gray-200" />

          <div className="w-full px-7 py-4 flex flex-col gap-y-3">
            {/* <div className="h-4 w-4/5 rounded bg-gray-200" />
    
            <div className="h-4 w-3/5 rounded bg-gray-200" /> */}

            <div className="flex flex-col gap-y-1.5">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-3.5 w-40 rounded bg-gray-200 ml-4" />
            </div>

            <div className="flex flex-col gap-y-1.5">
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-3.5 w-36 rounded bg-gray-200 ml-4" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
