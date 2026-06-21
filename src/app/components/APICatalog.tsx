import { mockAPIs } from '../data/mockData';
import { Lock, Globe, Shield, AlertCircle } from 'lucide-react';

export function APICatalog() {
  const getSensitivityIcon = (level: string) => {
    switch (level) {
      case 'pii':
        return <Lock className="w-4 h-4 text-red-600" />;
      case 'confidential':
        return <Shield className="w-4 h-4 text-orange-600" />;
      case 'internal':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Globe className="w-4 h-4 text-green-600" />;
    }
  };

  const getSensitivityLabel = (level: string) => {
    const labels = {
      pii: 'PII',
      confidential: 'Confidential',
      internal: 'Internal',
      public: 'Public'
    };
    return labels[level as keyof typeof labels] || level;
  };

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mb-6">
        <h1>API Catalog</h1>
        <p className="text-muted-foreground mt-1">Browse available APIs and their access policies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockAPIs.map((api) => (
          <div key={api.id} className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-2 mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="mb-1">{api.name}</h3>
                <p className="text-sm text-muted-foreground">{api.description}</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F1ECE2] border border-[#E7E0D2] flex-shrink-0">
                {getSensitivityIcon(api.dataSensitivity)}
                <span className="text-xs font-medium">{getSensitivityLabel(api.dataSensitivity)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Endpoint</div>
                <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{api.endpoint}</code>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Owner</div>
                <div className="text-sm">{api.owner}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Available Scopes</div>
                <div className="flex flex-wrap gap-1.5">
                  {api.availableScopes.map((scope) => (
                    <span
                      key={scope}
                      className="inline-flex items-center px-2 py-0.5 rounded bg-[#ECE9F3] text-[#382B5F] text-xs border border-[#DCD5E8]"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Requires Approval</span>
                  <span className={`font-medium ${api.policy.requiresApproval ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {api.policy.requiresApproval ? 'Yes' : 'No'}
                  </span>
                </div>
                {api.policy.requiresApproval && api.policy.approvers.length > 0 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Approvers: {api.policy.approvers.slice(0, 2).join(', ')}
                    {api.policy.approvers.length > 2 && ` +${api.policy.approvers.length - 2} more`}
                  </div>
                )}
              </div>

              {api.policy.allowedDepartments && (
                <div className="pt-2 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-1.5">Allowed Departments</div>
                  <div className="flex flex-wrap gap-1.5">
                    {api.policy.allowedDepartments.map((dept) => (
                      <span
                        key={dept}
                        className="inline-flex items-center px-2 py-0.5 rounded bg-[#F1ECE2] text-[#221F1B] text-xs"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button className="w-full mt-4 px-4 py-2 border border-[#C2752E] text-[#C2752E] rounded hover:bg-[#ECE9F3] transition-colors">
                Request Access
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
