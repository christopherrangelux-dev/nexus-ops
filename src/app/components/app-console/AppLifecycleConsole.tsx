import { useState } from 'react';
import { Application, APIRequest, AuditEntry, mockAuditEntries } from '../../data/mockData';
import { LifecycleConsoleShell } from '../lifecycle/LifecycleConsoleShell';
import { AuditHistoryTable } from '../lifecycle/AuditHistoryTable';
import { StatusPolicyView } from './StatusPolicyView';
import { CustomPolicyView } from './CustomPolicyView';
import { ApiScopesView } from './ApiScopesView';
import { PendingRequestsView } from './PendingRequestsView';

interface AppLifecycleConsoleProps {
  application: Application;
  initialSection?: string;
  onClose: () => void;
  onNavigateToApi?: (apiId: string, section: string) => void;
}

export function AppLifecycleConsole({ application, initialSection, onClose, onNavigateToApi }: AppLifecycleConsoleProps) {
  const [activeSection, setActiveSection] = useState(initialSection ?? 'status');
  // Consolidated feed for every audit entry generated during this session across all sections
  // of this console (status changes, policy edits, and scope requests) — History needs one
  // combined array rather than each section keeping its own isolated state.
  const [localAuditEntries, setLocalAuditEntries] = useState<AuditEntry[]>([]);
  // Consolidated feed for API requests submitted from this console's API Scopes section, so a
  // freshly-submitted request shows up in Pending Requests immediately without a real backend.
  const [localApiRequests, setLocalApiRequests] = useState<APIRequest[]>([]);

  const addAuditEntry = (entry: AuditEntry) =>
    setLocalAuditEntries((current) => [...current, entry]);

  const addApiRequest = (request: APIRequest) =>
    setLocalApiRequests((current) => [...current, request]);

  const renderSection = () => {
    switch (activeSection) {
      case 'status':
        return <StatusPolicyView application={application} onAuditEntry={addAuditEntry} />;
      case 'policy':
        return <CustomPolicyView application={application} onAuditEntry={addAuditEntry} />;
      case 'scopes':
        return (
          <ApiScopesView
            application={application}
            onSubmitRequest={addApiRequest}
            onNavigateToApi={onNavigateToApi}
          />
        );
      case 'pending':
        return (
          <PendingRequestsView application={application} localApiRequests={localApiRequests} />
        );
      case 'history': {
        const isRelevant = (entry: AuditEntry) => entry.targetId === application.id;
        const combined = [
          ...mockAuditEntries.filter(isRelevant),
          ...localAuditEntries.filter(isRelevant),
        ].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
        return <AuditHistoryTable entries={combined} />;
      }
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
