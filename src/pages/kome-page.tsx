import { useState } from "react";
import KomeCard from "../components/komepage/kome-card";
import KomeLoader from "../components/skeleton-load/kome-loader";
import { useKomeItems } from "../hooks/useKomeItems";

export default function KomePage() {
  const { items, loading } = useKomeItems();
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  return (
    <main className="w-full h-full flex flex-col overflow-hidden">
      <section className="z-50 w-full h-auto mt-8 relative">
        {!imgLoaded && (
          <div className="w-full h-40 bg-gray-200 animate-pulse rounded" />
        )}
        <img
          className={`w-full h-full transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0 absolute inset-0"}`}
          src="/images/komepage/kome-map.svg"
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />
      </section>

      <div className="z-50 mx-auto w-[85%] border-b border-[#D9D9D9] h-5" />

      <section className="z-50 w-full h-full overflow-y-auto px-10 space-y-3 py-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <KomeLoader key={i} />)
        ) : items.length === 0 ? (
          <p className="text-center text-[13px] text-[#C6C6C6]">
            ยังไม่มีข้อมูล
          </p>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              className="animate-fade-in"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <KomeCard name={item.name} phone={item.phone} />
            </div>
          ))
        )}
      </section>

      {/* <div className="min-h-[77svh] max-w-107.5 mx-auto fixed bottom-0 w-full bg-[linear-gradient(-181deg,#FFE2A5_0%,#FBFCF0_36%,#FBFCF0_62%,#E6EFD8_100%)] z-1" /> */}
    </main>
  );
}
