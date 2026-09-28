interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  return (
    <div className="h-20 bg-[#1A1A1A] fixed top-0 left-[280px] right-0 z-10 flex items-center justify-between px-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#F3BF3A] rounded flex items-center justify-center">
          <span className="text-[#1A1A1A] font-bold text-lg">A</span>
        </div>
        <span className="text-[#F3BF3A] font-semibold text-xl">Adnexio</span>
      </div>

      <h1 className="text-white font-medium text-lg">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
}
