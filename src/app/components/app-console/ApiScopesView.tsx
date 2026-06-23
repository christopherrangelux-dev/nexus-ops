import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Application, APIRequest, mockEntitlements, mockAPIs } from '../../data/mockData';

interface ApiScopesViewProps {
  application: Application;
  onSubmitRequest: (request: APIRequest) => void;
  onNavigateToApi?: (apiId: string, section: string) => void;
}

export function ApiScopesView({ application, onSubmitRequest, onNavigateToApi }: ApiScopesViewProps) {
  const [requestOpen, setRequestOpen] = useState(false);

  const grantedEntitlements = mockEntitlements.filter(
    (ent) => ent.grantedToApplicationId === application.id
  );

  const getApiName = (apiId: string) =>
    mockAPIs.find((api) => api.id === apiId)?.name ?? 'Unknown API';

  return (
    <div>
      <div className="mb-6">
        <h2>API Scopes</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Scopes currently granted to this application, and a way to request more.
        </p>
      </div>

      <div className="bg-white border border-border rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium mb-3">Currently granted</h3>
        {grantedEntitlements.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            This application has not been granted any API scopes yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {grantedEntitlements.map((ent) => (
              <span
                key={ent.id}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ECE9F3] text-[#382B5F] text-xs border border-[#DCD5E8]"
              >
                <span className="font-medium">{ent.scope}</span>
                <span className="text-[#382B5F]/70">· {getApiName(ent.apiId)}</span>
                {onNavigateToApi && (
                  <button
                    onClick={() => onNavigateToApi(ent.apiId, 'entitlements')}
                    className="text-[#C2752E] hover:underline transition-colors"
                  >
                    View entitlement →
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setRequestOpen(true)}
        className="px-4 py-2 bg-[#C2752E] text-white rounded font-medium hover:bg-[#9C5E25] transition-colors"
      >
        Request a Scope
      </button>

      {requestOpen && (
        <RequestScopePanel
          application={application}
          onClose={() => setRequestOpen(false)}
          onSubmit={onSubmitRequest}
        />
      )}
    </div>
  );
}

interface RequestScopePanelProps {
  application: Application;
  onClose: () => void;
  onSubmit: (request: APIRequest) => void;
}

function RequestScopePanel({ application, onClose, onSubmit }: RequestScopePanelProps) {
  const [apiId, setApiId] = useState('');
  const [scope, setScope] = useState('');
  const [businessJustification, setBusinessJustification] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedApi = mockAPIs.find((api) => api.id === apiId);

  const isValid = (): boolean =>
    !!(selectedApi && scope && businessJustification.trim());

  const handleApiChange = (nextApiId: string) => {
    setApiId(nextApiId);
    setScope('');
  };

  const handleSubmit = () => {
    if (!selectedApi || !isValid()) return;

    onSubmit({
      id: `req-local-${Date.now()}`,
      applicationId: application.id,
      applicationName: application.name,
      requestor: application.owner,
      requestorEmail: application.ownerEmail,
      apiName: selectedApi.name,
      apiEndpoint: selectedApi.endpoint,
      scopes: [scope],
      dataSensitivity: selectedApi.dataSensitivity,
      riskLevel: 'medium',
      businessJustification,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-full sm:w-[420px] bg-white border-l border-border shadow-2xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2>Request a Scope</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{application.name}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {submitted ? (
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">
              Scope request submitted — you'll see it under Pending Requests once it's recorded.
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-2 border border-border rounded hover:bg-muted transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 p-6 overflow-y-auto space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">API *</label>
              <select
                value={apiId}
                onChange={(e) => handleApiChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded bg-white"
              >
                <option value="">Select an API...</option>
                {mockAPIs.map((api) => (
                  <option key={api.id} value={api.id}>{api.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Scope *</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                disabled={!selectedApi}
                className="w-full px-3 py-2 border border-border rounded bg-white disabled:opacity-50"
              >
                <option value="">Select a scope...</option>
                {selectedApi?.availableScopes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Business Justification *</label>
              <textarea
                value={businessJustification}
                onChange={(e) => setBusinessJustification(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded resize-none bg-white"
                rows={4}
                placeholder="Why does this application need this scope?"
              />
            </div>
          </div>

          <div className="p-6 border-t border-border">
            <button
              onClick={handleSubmit}
              disabled={!isValid()}
              className="w-full px-4 py-2.5 bg-[#C2752E] text-white rounded font-medium hover:bg-[#9C5E25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Request
            </button>
          </div>
        </>
      )}
    </div>
  );
}
