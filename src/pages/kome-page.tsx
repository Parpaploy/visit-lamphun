import KomeCard from "../components/komepage/kome-card";

export default function KomePage() {
  return (
    <main className="w-full h-full flex flex-col overflow-hidden">
      <section className="w-full h-auto mt-4">
        <img className="w-full h-full" src="/images/komepage/kome-map.svg" />
      </section>

      <div className="mx-auto w-[85%] border-b border-[#D9D9D9] h-5" />

      <section className="w-full h-full overflow-y-auto px-10 space-y-3 py-5">
        <KomeCard name="กลุ่มผู้สูงอายุชุมชนจามเทวี" phone="091 - 8517594" />
      </section>
    </main>
  );
}
