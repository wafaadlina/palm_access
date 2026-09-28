import { Users, UserCheck, ClipboardList, DollarSign } from 'lucide-react';

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export default function Sidebar({ activeScreen, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'recruitment', label: 'Recruitment', icon: Users },
    { id: 'staff', label: 'Staff', icon: UserCheck, active: true },
    { id: 'attendance', label: 'Attendance', icon: ClipboardList },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
  ];

  return (
    <div className="w-[280px] bg-white h-screen fixed left-0 top-0 flex flex-col border-r border-[#e5e5e5]">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-5 h-5 bg-[#F3BF3A] rounded"></div>
          <span className="font-semibold text-xl">Adnexio</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-colors ${
                  isActive
                    ? 'bg-[#fdf6e2] text-[#262626]'
                    : 'text-[#636363] hover:bg-gray-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-[#F3BF3A]' : 'bg-white border border-[#e5e5e5]'
                }`}>
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-white border border-[#e5e5e5] rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <p className="text-xs text-[#8a8a8a]">Genting Plantations</p>
              <button className="text-sm text-[#2666BE] underline">Manage</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
