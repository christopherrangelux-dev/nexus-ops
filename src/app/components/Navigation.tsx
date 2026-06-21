import { LayoutDashboard, FileText, CheckSquare, Settings } from 'lucide-react';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ activeView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'apps', label: 'Apps', icon: LayoutDashboard },
    { id: 'catalog', label: 'Catalog', icon: FileText },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex flex-row justify-around bg-gray-900 text-white py-2 md:static md:inset-auto md:z-auto md:w-16 md:h-screen md:flex-col md:items-center md:justify-start md:py-4 md:gap-2">
      <div className="hidden md:block mb-6">
        <div className="w-10 h-10 bg-[#C2752E] rounded-lg flex items-center justify-center">
          <span className="font-semibold text-sm">API</span>
        </div>
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-colors ${
              isActive
                ? 'bg-[#C2752E] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title={item.label}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
