import { useState } from 'react';
import { format } from 'date-fns';
import { API, AuditEntry, Entitlement, mockEntitlements, mockApplications } from '../../data/mockData';
import { ConfirmActionPanel } from '../lifecycle/ConfirmActionPanel';

interface EntitlementsViewProps {
  api: API;
  onAuditEntry: (entry: AuditEntry) => void;
}

export function EntitlementsView({ api, onAuditEntry }: EntitlementsViewProps) {
  const [entitlements, setEntitlements] = useState<Entitlement[]>(
    mockEntitlements.filter((ent) => ent.apiId === api.id)
  );
  const [revokeTarget, setRevokeTarget] = useState<Entitlement | null>(null);

  const getApplicationName = (applicationId: string) =>
    mockApplications.find((app) => app.id === applicationId)?.name ?? 'Unknown application';

  const handleRevokeConfirm = async (): Promise<'success' | 'error' | 'partial'> => {
    if (!revokeTarget) return 'error';

    setEntitlements((current) => current.filter((ent) => ent.id !== revokeTarget.id));

    onAuditEntry({
      id: `audit-local-${Date.now()}`,
      targetType: 'api',
      targetId: api.id,
      targetName: api.name,
      action: 'updated',
      actor: 'Data Product Manager',
      occurredAt: new Date().toISOString(),
      detail: `Revoked ${revokeTarget.scope} entitlement from ${getApplicationName(revokeTarget.grantedToApplicationId)}.`,
    });

    return 'success';
  };

  return (
    <div>
      <div className="mb-6">
        <h2>Entitlements</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Applications and scopes currently granted access to this API.
        </p>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left font-medium px-4 py-3">Scope</th>
              <th className="text-left font-medium px-4 py-3">Granted to</th>
              <th className="text-left font-medium px-4 py-3">Granted at</th>
              <th className="text-left font-medium px-4 py-3">Expires at</th>
              <th className="text-right font-medium px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {entitlements.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  No entitlements granted for this API.
                </td>
              </tr>
            )}
            {entitlements.map((entitlement) => (
              <tr key={entitlement.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#ECE9F3] text-[#382B5F] text-xs border border-[#DCD5E8]">
                    {entitlement.scope}
                  </span>
                </td>
                <td className="px-4 py-3">{getApplicationName(entitlement.grantedToApplicationId)}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {format(new Date(entitlement.grantedAt), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entitlement.expiresAt ? format(new Date(entitlement.expiresAt), 'MMM d, yyyy') : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setRevokeTarget(entitlement)}
                    className="px-3 py-1.5 border border-border rounded text-xs font-medium hover:bg-muted transition-colors"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {revokeTarget && (
        <ConfirmActionPanel
          title="Revoke entitlement"
          description={`This will revoke the ${revokeTarget.scope} scope from ${getApplicationName(revokeTarget.grantedToApplicationId)}.`}
          affectedItems={[
            {
              label: revokeTarget.scope,
              meta: getApplicationName(revokeTarget.grantedToApplicationId),
            },
          ]}
          nextSteps={[
            'The consuming application loses access immediately',
            'Logged to audit history',
            'A new entitlement request is required to restore access',
          ]}
          onConfirm={handleRevokeConfirm}
          onClose={() => setRevokeTarget(null)}
        />
      )}
    </div>
  );
}
