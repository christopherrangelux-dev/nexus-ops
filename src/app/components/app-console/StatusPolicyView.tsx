import { useState } from 'react';
import { Application, AuditEntry, RequestStatus } from '../../data/mockData';
import { StatusBadge } from '../StatusBadge';
import { ConfirmActionPanel } from '../lifecycle/ConfirmActionPanel';

interface StatusPolicyViewProps {
  application: Application;
  onAuditEntry: (entry: AuditEntry) => void;
}

export function StatusPolicyView({ application, onAuditEntry }: StatusPolicyViewProps) {
  // Local copy of status — same non-mutating pattern used elsewhere in this app (e.g.
  // DormancyEvidencePanel's endpoint state). Deactivation updates this copy only, never the
  // underlying mockApplications record.
  const [status, setStatus] = useState<RequestStatus>(application.status);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isDeactivated = status === 'suspended';

  const handleDeactivateConfirm = async (): Promise<'success' | 'error' | 'partial'> => {
    setStatus('suspended');

    onAuditEntry({
      id: `audit-local-${Date.now()}`,
      targetType: 'application',
      targetId: application.id,
      targetName: application.name,
      action: 'deactivated',
      actor: application.owner,
      occurredAt: new Date().toISOString(),
      detail: `${application.name} deactivated. API access suspended and technical contact notified.`,
    });

    return 'success';
  };

  return (
    <div>
      <div className="mb-6">
        <h2>Status & Policy</h2>
        <p className="text-sm text-muted-foreground mt-1">
          The operational status of this application and its default policy.
        </p>
      </div>

      <div className="bg-white border border-border rounded-lg p-6 space-y-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1.5">Current status</div>
          <StatusBadge status={status} />
        </div>

        <p className="text-sm text-muted-foreground">
          {isDeactivated
            ? 'This application has been deactivated. It no longer has API access, and its technical contact has been notified.'
            : 'Deactivating an application immediately suspends its API access. The technical contact is notified and the action is recorded to audit history.'}
        </p>

        {!isDeactivated && (
          <button
            onClick={() => setConfirmOpen(true)}
            className="px-4 py-2 bg-[#C2752E] text-white rounded text-sm font-medium hover:bg-[#9C5E25] transition-colors"
          >
            Deactivate application
          </button>
        )}
      </div>

      {confirmOpen && (
        <ConfirmActionPanel
          title="Deactivate application"
          description={`This will deactivate ${application.name}. It will immediately lose access to every API it currently calls, and its technical contact will be notified.`}
          affectedItems={[{ label: application.name, meta: application.department }]}
          requireExplicitConfirm
          nextSteps={[
            'This application loses API access immediately',
            'The technical contact is notified by email',
            'Logged to audit history',
          ]}
          onConfirm={handleDeactivateConfirm}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
