import { useState } from 'react';
import { APIRequest, mockAPIs } from '../data/mockData';
import { RiskBadge } from './StatusBadge';
import { X, AlertTriangle, Shield, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

interface ApprovalDetailViewProps {
  request: APIRequest;
  onClose: () => void;
}

export function ApprovalDetailView({ request, onClose }: ApprovalDetailViewProps) {
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');

  const api = mockAPIs.find(a => a.name === request.apiName);

  const handleSubmit = () => {
    alert(`Request ${decision === 'approve' ? 'approved' : 'rejected'}\n\nNotes: ${notes}`);
    onClose();
  };

  return (
    <div className="flex-1 flex">
      {/* Request Details Panel */}
      <div className="flex-1 p-8 overflow-y-auto border-r border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2>Request Details</h2>
            <p className="text-sm text-muted-foreground mt-1">Review API access request</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-amber-900">Requires Approval</div>
              <div className="text-sm text-amber-700 mt-1">
                This API contains {request.dataSensitivity.toUpperCase()} data and requires Data Product Manager approval.
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-6 space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Application</div>
              <div className="font-medium mt-1">{request.applicationName}</div>
              <div className="text-sm text-muted-foreground mt-0.5">ID: {request.applicationId}</div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="text-sm text-muted-foreground">Requestor</div>
              <div className="font-medium mt-1">{request.requestor}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{request.requestorEmail}</div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="text-sm text-muted-foreground">Requested API</div>
              <div className="font-medium mt-1">{request.apiName}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{request.apiEndpoint}</div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="text-sm text-muted-foreground mb-2">Scopes Requested</div>
              <div className="flex flex-wrap gap-2">
                {request.scopes.map((scope) => (
                  <span
                    key={scope}
                    className="inline-flex items-center px-2.5 py-0.5 rounded bg-[#ECE9F3] text-[#382B5F] text-xs font-medium border border-[#DCD5E8]"
                  >
                    {scope}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="text-sm text-muted-foreground">Risk Assessment</div>
              <div className="mt-2">
                <RiskBadge level={request.riskLevel} />
              </div>
              <div className="mt-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Data Sensitivity: {request.dataSensitivity.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="text-sm text-muted-foreground mb-2">Business Justification</div>
              <div className="text-sm bg-muted/30 p-3 rounded border border-border">
                {request.businessJustification}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="text-sm text-muted-foreground">Request Date</div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{format(new Date(request.requestedAt), 'PPpp')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Policy Panel */}
      <div className="w-96 bg-[#FBF7F1] p-8 overflow-y-auto">
        <div className="mb-6">
          <h3>API Policy</h3>
          <p className="text-sm text-muted-foreground mt-1">Governance requirements</p>
        </div>

        {api && (
          <div className="space-y-4">
            <div className="bg-white border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">API Owner</div>
              <div className="font-medium mt-1">{api.owner}</div>
            </div>

            <div className="bg-white border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-2">Data Classification</div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-medium border border-purple-200">
                {api.dataSensitivity.toUpperCase()}
              </span>
            </div>

            <div className="bg-white border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-2">Requires Approval</div>
              <div className="text-sm font-medium">
                {api.policy.requiresApproval ? 'Yes' : 'No'}
              </div>
            </div>

            {api.policy.requiresApproval && api.policy.approvers.length > 0 && (
              <div className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Users className="w-4 h-4" />
                  <span>Approvers</span>
                </div>
                <div className="space-y-1">
                  {api.policy.approvers.map((approver) => (
                    <div key={approver} className="text-sm">{approver}</div>
                  ))}
                </div>
              </div>
            )}

            {api.policy.maxRetentionDays && (
              <div className="bg-white border border-border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Max Retention Period</div>
                <div className="font-medium mt-1">{api.policy.maxRetentionDays} days</div>
              </div>
            )}

            {api.policy.allowedDepartments && (
              <div className="bg-white border border-border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">Allowed Departments</div>
                <div className="flex flex-wrap gap-2">
                  {api.policy.allowedDepartments.map((dept) => (
                    <span
                      key={dept}
                      className="inline-flex items-center px-2.5 py-0.5 rounded bg-[#F1ECE2] text-[#221F1B] text-xs border border-[#E7E0D2]"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-2">Available Scopes</div>
              <div className="space-y-1">
                {api.availableScopes.map((scope) => (
                  <div
                    key={scope}
                    className={`text-sm p-2 rounded ${
                      request.scopes.includes(scope)
                        ? 'bg-[#ECE9F3] border border-[#DCD5E8] font-medium'
                        : 'bg-[#FBF7F1]'
                    }`}
                  >
                    {scope}
                    {request.scopes.includes(scope) && (
                      <span className="ml-2 text-[#C2752E] text-xs">(requested)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Decision</label>
            <div className="flex gap-2">
              <button
                onClick={() => setDecision('approve')}
                className={`flex-1 px-4 py-2 rounded transition-colors ${
                  decision === 'approve'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-border hover:bg-muted'
                }`}
              >
                Approve
              </button>
              <button
                onClick={() => setDecision('reject')}
                className={`flex-1 px-4 py-2 rounded transition-colors ${
                  decision === 'reject'
                    ? 'bg-red-600 text-white'
                    : 'bg-white border border-border hover:bg-muted'
                }`}
              >
                Reject
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Review Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes about your decision..."
              className="w-full px-3 py-2 border border-border rounded resize-none bg-white"
              rows={4}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!decision || !notes}
            className="w-full px-4 py-2.5 bg-[#C2752E] text-white rounded font-medium hover:bg-[#9C5E25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Decision
          </button>
        </div>
      </div>
    </div>
  );
}
