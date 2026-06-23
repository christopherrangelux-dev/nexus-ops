import { useState } from 'react';
import { Application, AuditEntry } from '../../data/mockData';
import { LifecycleConsoleShell } from '../lifecycle/LifecycleConsoleShell';
import { StatusPolicyView } from './StatusPolicyView';
import { CustomPolicyView } from './CustomPolicyView';

interface AppLifecycleConsoleProps {
  application: Application;
  onClose: () => void;
}

export function AppLifecycleConsole({ application, onClose }: AppLifecycleConsoleProps) {
  const [activeSection, setActiveSection] = useState('status');
  // Consolidated feed for every audit entry generated during this session across all sections
  // of this console (status changes, policy edits, and — once built in Phase 5 — scope requests)
  // — History needs one combined array rather than each section keeping its own isolated state.
  const [localAuditEntries, setLocalAuditEntries] = useState<AuditEntry[]>([]);

  const addAuditEntry = (entry: AuditEntry) =>
    setLocalAuditEntries((current) => [...current, entry]);

  const renderSection = () => {
    switch (activeSection) {
      case 'status':
        return <StatusPolicyView application={application} onAuditEntry={addAuditEntry} />;
      case 'policy':
        return <CustomPolicyView application={application} onAuditEntry={addAuditEntry} />;
      case 'scopes':
      case 'pending':
      case 'history':
        return <div className="text-muted-foreground">Coming in Phase 5</div>;
      default:
        return null;
    }
  };

  return (
    <LifecycleConsoleShell
      title={application.name}
      subtitle="Application Lifecycle Console"
      sidebarInfo={[
        { label: 'Owner', value: application.owner },
        { label: 'Department', value: application.department },
      ]}
      sections={[
        { id: 'status', label: 'Status & Policy' },
        { id: 'policy', label: 'Custom Policy' },
        { id: 'scopes', label: 'API Scopes' },
        { id: 'pending', label: 'Pending Requests' },
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
