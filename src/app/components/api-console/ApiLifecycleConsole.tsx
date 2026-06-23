import { useState } from 'react';
import { API, AuditEntry, mockAuditEntries } from '../../data/mockData';
import { LifecycleConsoleShell } from '../lifecycle/LifecycleConsoleShell';
import { AuditHistoryTable } from '../lifecycle/AuditHistoryTable';
import { DormancyEvidencePanel } from './DormancyEvidencePanel';
import { EntitlementsView } from './EntitlementsView';
import { ValidationRulesView } from './ValidationRulesView';
import { StatusRetirementView } from './StatusRetirementView';

interface ApiLifecycleConsoleProps {
  api: API;
  initialSection?: string;
  onClose: () => void;
  onNavigateToApp?: (applicationId: string, section: string) => void;
}

export function ApiLifecycleConsole({ api, initialSection, onClose, onNavigateToApp }: ApiLifecycleConsoleProps) {
  const [activeSection, setActiveSection] = useState(initialSection ?? 'dormancy');
  // Consolidated feed for every audit entry generated during this session across all sections
  // of this console (dormancy deactivations, entitlement revocations, retirement) — History
  // needs one combined array rather than each section keeping its own isolated state.
  const [localAuditEntries, setLocalAuditEntries] = useState<AuditEntry[]>([]);

  const addAuditEntry = (entry: AuditEntry) =>
    setLocalAuditEntries((current) => [...current, entry]);

  const renderSection = () => {
    switch (activeSection) {
      case 'dormancy':
        return <DormancyEvidencePanel api={api} onAuditEntry={addAuditEntry} />;
      case 'entitlements':
        return (
          <EntitlementsView
            api={api}
            onAuditEntry={addAuditEntry}
            onNavigateToApp={onNavigateToApp}
          />
        );
      case 'validation':
        return <ValidationRulesView api={api} />;
      case 'status':
        return <StatusRetirementView api={api} onAuditEntry={addAuditEntry} />;
      case 'history': {
        const relevantIds = new Set([api.id, ...api.endpoints]);
        const isRelevant = (entry: AuditEntry) => relevantIds.has(entry.targetId);
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
