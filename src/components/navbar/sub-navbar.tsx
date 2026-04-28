export default function SubNavbar<T extends string>({
  mode,
  setMode,
  mode1,
  mode2,
  mode3,
  mode1Name,
  mode2Name,
  mode3Name,
  isSmallOne = false,
}: {
  mode: T;
  setMode: (value: T) => void;
  mode1: T;
  mode2: T;
  mode3: T;
  mode1Name: string;
  mode2Name: string;
  mode3Name: string;
  isSmallOne?: boolean;
}) {
  return (
    <>
      {isSmallOne ? (
        <section className="z-900 w-full h-[8svh] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] flex justify-between items-center">
          <button
            onClick={() => {
              setMode(mode1);
            }}
            className="relative h-full w-[40%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
          >
            <p>{mode1Name}</p>

            {mode === mode1 && (
              <div className="z-100 absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
            )}
          </button>
          <button
            onClick={() => {
              setMode(mode2);
            }}
            className="relative h-full w-[40%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
          >
            <p>{mode2Name}</p>

            {mode === mode2 && (
              <div className="z-100 absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
            )}
          </button>
          <button
            onClick={() => {
              setMode(mode3);
            }}
            className="relative h-full w-[20%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
          >
            <p>{mode3Name}</p>

            {mode === mode3 && (
              <div className="z-100 absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
            )}
          </button>
        </section>
      ) : (
        <section className="w-full h-[8svh] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] flex justify-between items-center">
          <button
            onClick={() => {
              setMode(mode1);
            }}
            className="relative h-full w-[33%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
          >
            <p>{mode1Name}</p>

            {mode === mode1 && (
              <div className="z-100 absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
            )}
          </button>
          <button
            onClick={() => {
              setMode(mode2);
            }}
            className="relative h-full w-[33%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
          >
            <p>{mode2Name}</p>

            {mode === mode2 && (
              <div className="z-100 absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
            )}
          </button>
          <button
            onClick={() => {
              setMode(mode3);
            }}
            className="relative h-full w-[33%] flex justify-center items-center font-semibold text-[#543A14] text-[15px]"
          >
            <p>{mode3Name}</p>

            {mode === mode3 && (
              <div className="z-100 absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full w-[90%] border-2 border-[#BF4B17]" />
            )}
          </button>
        </section>
      )}
    </>
  );
}
