import { useState } from 'react';
import { API } from '../../data/mockData';
import { LifecycleConsoleShell } from '../lifecycle/LifecycleConsoleShell';
import { DormancyEvidencePanel } from './DormancyEvidencePanel';
import { EntitlementsView } from './EntitlementsView';

interface ApiLifecycleConsoleProps {
  api: API;
  onClose: () => void;
}

export function ApiLifecycleConsole({ api, onClose }: ApiLifecycleConsoleProps) {
  const [activeSection, setActiveSection] = useState('dormancy');

  const renderSection = () => {
    switch (activeSection) {
      case 'dormancy':
        return <DormancyEvidencePanel api={api} />;
      case 'entitlements':
        return <EntitlementsView api={api} />;
      case 'validation':
      case 'status':
      case 'history':
        return <div className="text-muted-foreground">Coming in Phase 3</div>;
      default:
        return null;
    }
  };

  return (
    <LifecycleConsoleShell
      title={api.name}
      subtitle="API Lifecycle Console"
      sidebarInfo={[
        { label: 'Owner', value: api.owner },
        { label: 'Data sensitivity', value: api.dataSensitivity },
      ]}
      sections={[
        { id: 'dormancy', label: 'Dormancy & Evidence' },
        { id: 'entitlements', label: 'Entitlements' },
        { id: 'validation', label: 'Request Validation' },
        { id: 'status', label: 'Status & Retirement' },
        { id: 'history', label: 'History' },
      ]}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onClose={onClose}
    >
      {renderSection()}
    </LifecycleConsoleShell>
  );
}
