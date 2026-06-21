import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { ApplicationsList } from './components/ApplicationsList';
import { APICatalog } from './components/APICatalog';
import { ApprovalsDashboard } from './components/ApprovalsDashboard';
import { Settings } from './components/Settings';

export default function App() {
  const [activeView, setActiveView] = useState('approvals');

  const renderView = () => {
    switch (activeView) {
      case 'apps':
        return <ApplicationsList />;
      case 'catalog':
        return <APICatalog />;
      case 'approvals':
        return <ApprovalsDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <ApprovalsDashboard />;
    }
  };

  return (
    <div className="size-full flex bg-[#FBF7F1]">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-10 bg-white border-b border-border px-4 sm:px-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 text-sm text-muted-foreground min-w-0">
            <span className="hidden sm:inline">Enterprise API Portal</span>
            <span className="hidden sm:inline text-border">•</span>
            <span className="capitalize truncate">{activeView}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-sm hidden sm:block">
              <span className="text-muted-foreground">Logged in as:</span>
              <span className="ml-2 font-medium">Data Product Manager</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#C2752E] text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
              DM
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto flex pb-16 md:pb-0">
          {renderView()}
        </div>
      </div>
    </div>
  );
}