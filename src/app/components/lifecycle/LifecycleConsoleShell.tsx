import { X } from 'lucide-react';

interface LifecycleConsoleShellProps {
  title: string;
  subtitle: string;
  sidebarInfo: { label: string; value: string }[];
  sections: { id: string; label: string }[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  onClose: () => void;
  children: React.ReactNode;
}

export function LifecycleConsoleShell({
  title,
  subtitle,
  sidebarInfo,
  sections,
  activeSection,
  onSectionChange,
  onClose,
  children,
}: LifecycleConsoleShellProps) {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between p-6 border-b border-border bg-white">
        <div>
          <h2>{title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="sm:hidden border-b border-border bg-white px-4 py-2 overflow-x-auto">
        <div className="flex gap-2 w-max">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#C2752E] text-white'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden sm:flex w-[212px] flex-shrink-0 flex-col border-r border-border bg-white">
          <nav className="flex flex-col gap-1 p-3">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => onSectionChange(section.id)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-[#C2752E] text-white'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {section.label}
                </button>
              );
            })}
          </nav>

          {sidebarInfo.length > 0 && (
            <div className="mt-auto p-3 border-t border-border space-y-2">
              {sidebarInfo.map((info) => (
                <div key={info.label}>
                  <div className="text-xs text-muted-foreground">{info.label}</div>
                  <div className="text-sm">{info.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
