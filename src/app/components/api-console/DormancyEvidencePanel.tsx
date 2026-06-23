import { Fragment, useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  API,
  AuditEntry,
  Endpoint,
  mockEndpoints,
  mockDormancyEvidence,
} from '../../data/mockData';
import { MethodBadge, DormancyBadge } from '../StatusBadge';
import { ConfirmActionPanel } from '../lifecycle/ConfirmActionPanel';

interface DormancyEvidencePanelProps {
  api: API;
  onAuditEntry: (entry: AuditEntry) => void;
}

export function DormancyEvidencePanel({ api, onAuditEntry }: DormancyEvidencePanelProps) {
  const [endpoints] = useState<Endpoint[]>(
    mockEndpoints.filter((ep) => api.endpoints.includes(ep.id))
  );
  // Deactivation is tracked separately from dormancyStatus — dormancy describes traffic
  // patterns, deactivated describes whether the endpoint has been turned off. Conflating
  // the two (e.g. flipping dormancyStatus to something else on deactivate) would misrepresent
  // what the field means.
  const [deactivatedIds, setDeactivatedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Endpoint | null>(null);

  const toggleExpanded = (endpointId: string) => {
    setExpandedId((current) => (current === endpointId ? null : endpointId));
  };

  const handleDeactivateConfirm = async (): Promise<'success' | 'error' | 'partial'> => {
    if (!deactivateTarget) return 'error';

    setDeactivatedIds((current) => new Set(current).add(deactivateTarget.id));

    onAuditEntry({
      id: `audit-local-${Date.now()}`,
      targetType: 'endpoint',
      targetId: deactivateTarget.id,
      targetName: `${deactivateTarget.method} ${deactivateTarget.path}`,
      action: 'deactivated',
      actor: 'Data Product Manager',
      occurredAt: new Date().toISOString(),
      detail: `Endpoint ${deactivateTarget.method} ${deactivateTarget.path} deactivated based on dormancy evidence.`,
    });

    return 'success';
  };

  return (
    <div>
      <div className="mb-6">
        <h2>Dormancy & Evidence</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Traffic-backed evidence for each endpoint's dormancy status, so a deactivation decision
          can be trusted before it's made.
        </p>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left font-medium px-4 py-3">Method</th>
              <th className="text-left font-medium px-4 py-3">Path</th>
              <th className="text-left font-medium px-4 py-3">Last traffic</th>
              <th className="text-left font-medium px-4 py-3">Dormancy status</th>
              <th className="text-right font-medium px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((endpoint) => {
              const isDeactivated = deactivatedIds.has(endpoint.id);
              const isExpandable = endpoint.dormancyStatus !== 'active';
              const isExpanded = expandedId === endpoint.id;
              const evidence = mockDormancyEvidence.find((e) => e.endpointId === endpoint.id);

              return (
                <Fragment key={endpoint.id}>
                  <tr
                    onClick={() => isExpandable && toggleExpanded(endpoint.id)}
                    className={`border-b border-border last:border-b-0 ${
                      isExpandable ? 'cursor-pointer hover:bg-muted/30' : ''
                    } ${isDeactivated ? 'opacity-60' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isExpandable ? (
                          isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          )
                        ) : (
                          <span className="w-3.5 h-3.5 flex-shrink-0" />
                        )}
                        <MethodBadge method={endpoint.method} />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{endpoint.path}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {endpoint.lastTrafficAt
                        ? format(new Date(endpoint.lastTrafficAt), 'MMM d, yyyy')
                        : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <DormancyBadge status={endpoint.dormancyStatus} />
                        {isDeactivated && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-[#F1ECE2] text-[#221F1B] border border-[#E7E0D2]">
                            Deactivated
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {endpoint.dormancyStatus === 'dormant' && !isDeactivated && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeactivateTarget(endpoint);
                          }}
                          className="px-3 py-1.5 border border-border rounded text-xs font-medium hover:bg-muted transition-colors"
                        >
                          Deactivate endpoint
                        </button>
                      )}
                    </td>
                  </tr>
                  {isExpandable && isExpanded && (
                    <tr className="border-b border-border last:border-b-0 bg-muted/20">
                      <td colSpan={5} className="px-4 py-4">
                        {evidence ? (
                          <div className="pl-6 space-y-3">
                            <p className="text-sm">{evidence.note}</p>
                            <div className="flex gap-6">
                              <div>
                                <div className="text-xs text-muted-foreground">Days since last traffic</div>
                                <div className="text-sm font-medium">
                                  {evidence.daysSinceLastTraffic ?? 'No traffic recorded'}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Active consumers</div>
                                <div className="text-sm font-medium">{evidence.consumerCount}</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="pl-6 text-sm text-muted-foreground">No evidence recorded.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {deactivateTarget && (
        <ConfirmActionPanel
          title="Deactivate endpoint"
          description={`This will deactivate ${deactivateTarget.method} ${deactivateTarget.path}. Consumers will no longer be able to call this endpoint.`}
          affectedItems={[
            { label: `${deactivateTarget.method} ${deactivateTarget.path}` },
          ]}
          nextSteps={[
            'Affected consumers are notified by email',
            'Logged to audit history',
            'Takes effect immediately',
          ]}
          onConfirm={handleDeactivateConfirm}
          onClose={() => setDeactivateTarget(null)}
        />
      )}
    </div>
  );
}
