import KomeCard from "../components/komepage/kome-card";
import { useKomeItems } from "../hooks/useKomeItems";

export default function KomePage() {
  const { items, loading } = useKomeItems();

  return (
    <main className="w-full h-full flex flex-col overflow-hidden">
      <section className="w-full h-auto mt-4">
        <img className="w-full h-full" src="/images/komepage/kome-map.svg" />
      </section>

      <div className="mx-auto w-[85%] border-b border-[#D9D9D9] h-5" />

      <section className="w-full h-full overflow-y-auto px-10 space-y-3 py-5">
        {loading ? (
          <p className="text-center text-[13px] text-[#8B724E]">กำลังโหลด...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-[13px] text-[#C6C6C6]">ยังไม่มีข้อมูล</p>
        ) : (
          items.map((item) => (
            <KomeCard key={item.id} name={item.name} phone={item.phone} />
          ))
        )}
      </section>
    </main>
  );
}
