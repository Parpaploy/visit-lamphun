import { useLocation, useNavigate } from "react-router-dom";

export default function NavbarMenuBtn({
  title,
  desc,
  imgUrl,
  path,
}: {
  title: string;
  desc?: string;
  imgUrl: string;
  path: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <button
      onClick={() => {
        navigate(path);
      }}
      className={`${location.pathname === path ? "bg-[#FEEABB] text-[#BF4B17]" : "bg-white text-[#543A14]"} w-full flex justify-start items-center gap-10 border-2 border-[#D9D9D9] rounded-full p-1`}
    >
      <div className="w-12 h-12">
        <img className="w-full h-full" src={imgUrl} />
      </div>

      <div className="flex flex-col justify-center items-start">
        <p className="text-[16px] font-semibold text-start">{title}</p>
        {desc && (
          <p className="text-[12px] text-[#757575] font-normal -mt-1">{desc}</p>
        )}
      </div>
    </button>
  );
}
