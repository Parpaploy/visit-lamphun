export default function KomeCard({
  name,
  phone,
}: {
  name: string;
  phone: string;
}) {
  return (
    <div className="py-2 rounded-full flex flex-col gap-y-1 justify-center items-center border-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.125)] border-[#D9D9D9] text-[#543A14] text-[16px] font-medium w-full">
      <p>{name}</p>

      <div className="flex justify-center items-center gap-x-3">
        <div className="w-6 h-6">
          <img className="w-full h-full" src="/icons/komepage/phone-icon.svg" />
        </div>

        <p>{phone}</p>
      </div>
    </div>
  );
}
