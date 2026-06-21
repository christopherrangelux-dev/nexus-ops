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
    <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 gap-2">
      <div className="mb-6">
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
