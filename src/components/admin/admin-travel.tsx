import { useState } from "react";
import type { ITravelMode } from "../../interfaces/navbar.interface";
import { useTravelModes } from "../../constant/admin";
import TrainPanel from "./train-panel";
import TramPanel from "./tram-panel";
import OtherPanel from "./other-panel";

export default function AdminTravel() {
  const modes = useTravelModes();
  const [mode, setMode] = useState<ITravelMode>("train");

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-x-2">
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${mode === m.value ? "bg-[#BF4B17] text-white border-[#BF4B17]" : "bg-white text-[#543A14] border-[#C6C6C6]"}`}
          >
            {m.label}
          </button>
        ))}
      </div>
      {mode === "train" && <TrainPanel />}
      {mode === "tram" && <TramPanel />}
      {mode === "other" && <OtherPanel />}
    </div>
  );
}
