import { useState } from 'react';
import {
  API,
  AuditEntry,
  mockEndpoints,
  mockEntitlements,
} from '../../data/mockData';
import { ConfirmActionPanel } from '../lifecycle/ConfirmActionPanel';

interface StatusRetirementViewProps {
  api: API;
  onAuditEntry: (entry: AuditEntry) => void;
}

export function StatusRetirementView({ api, onAuditEntry }: StatusRetirementViewProps) {
  // Not modeled on the API interface itself — see Phase 3 build-doc note: API retirement is
  // tracked as local component state only, not a persisted `status` field, to avoid growing
  // the shared RequestStatus type with a value that only applies to APIs.
  const [retired, setRetired] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const endpoints = mockEndpoints.filter((ep) => api.endpoints.includes(ep.id));
  const entitlementCount = mockEntitlements.filter((ent) => ent.apiId === api.id).length;

  const handleRetireConfirm = async (): Promise<'success' | 'error' | 'partial'> => {
    setRetired(true);

    onAuditEntry({
      id: `audit-local-${Date.now()}`,
      targetType: 'api',
      targetId: api.id,
      targetName: api.name,
      action: 'retired',
      actor: 'Data Product Manager',
      occurredAt: new Date().toISOString(),
      detail: `${api.name} retired. All endpoints disabled and entitlements revoked.`,
    });

    return 'success';
  };

  return (
    <div>
      <div className="mb-6">
        <h2>Status & Retirement</h2>
        <p className="text-sm text-muted-foreground mt-1">
          The operational status of this API as a whole, distinct from individual endpoint
          dormancy.
        </p>
      </div>

      <div className="bg-white border border-border rounded-lg p-6 space-y-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1.5">Current status</div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${
              retired
                ? 'bg-[#F1ECE2] text-[#221F1B] border-[#E7E0D2]'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
          >
            {retired ? 'Retired' : 'Active'}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          {retired
            ? 'This API has been retired. It no longer accepts traffic, every endpoint has been disabled, and all entitlements have been revoked.'
            : 'Retiring an API stops it from accepting all traffic. Every endpoint and every entitlement attached to it is affected — this is an API-wide action, not a single-endpoint deactivation.'}
        </p>

        {!retired && (
          <button
            onClick={() => setConfirmOpen(true)}
            className="px-4 py-2 bg-[#C2752E] text-white rounded text-sm font-medium hover:bg-[#9C5E25] transition-colors"
          >
            Retire this API
          </button>
        )}
      </div>

      {confirmOpen && (
        <ConfirmActionPanel
          title="Retire API"
          description="Retiring this API immediately revokes all entitlements, disables every endpoint, and removes it from the catalog. Every application currently configured to call this API will lose access at once. This action is permanent and cannot be reversed."
          affectedItems={[
            ...endpoints.map((endpoint) => ({
              label: `${endpoint.method} ${endpoint.path}`,
            })),
            {
              label: `${entitlementCount} ${entitlementCount === 1 ? 'entitlement' : 'entitlements'}`,
              meta: 'will be revoked',
            },
          ]}
          requireExplicitConfirm
          nextSteps={[
            'Every consuming application is notified that this API has been retired',
            'All entitlements granted against this API are revoked immediately',
            'Every endpoint is disabled and stops accepting traffic',
            'The API is removed from the catalog and can no longer be requested',
            'Logged to audit history',
          ]}
          onConfirm={handleRetireConfirm}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
