import { useTranslation } from "react-i18next";
import { hitboxData } from "../../constant/homepage";
import type { stationNumber } from "../../interfaces/homepage.interface";

export default function Hitbox({
  loaded,
  setStationExpanded,
}: {
  loaded: boolean;
  setStationExpanded: (stationExpanded: stationNumber) => void;
}) {
  const { i18n } = useTranslation();

  const currentLangData = hitboxData[i18n.language] || hitboxData.th;

  return (
    <svg
      viewBox="0 0 393 615"
      className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <g fill="rgba(67, 56, 202, 0)">
        {currentLangData.map((loc) => (
          <g
            key={loc.id}
            onClick={() => setStationExpanded(loc.no as stationNumber)}
          >
            {loc.points.map((point, index) => (
              <rect
                key={`${loc.id}-${index}`}
                x={point.x}
                y={point.y}
                width={point.width}
                height={point.height}
              />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}
