import { useState } from 'react';
import { format } from 'date-fns';
import { Check } from 'lucide-react';
import { Application, AuditEntry, Policy, mockPolicies } from '../../data/mockData';

interface CustomPolicyViewProps {
  application: Application;
  onAuditEntry: (entry: AuditEntry) => void;
}

export function CustomPolicyView({ application, onAuditEntry }: CustomPolicyViewProps) {
  const [policies, setPolicies] = useState<Policy[]>(
    mockPolicies.filter((policy) => policy.applicationId === application.id)
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState('');

  const startEditing = (policy: Policy) => {
    setEditingId(policy.id);
    setDraftValue(policy.value);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraftValue('');
  };

  const saveEdit = (policy: Policy) => {
    const nextValue = draftValue.trim();
    if (!nextValue || nextValue === policy.value) {
      cancelEditing();
      return;
    }

    const updatedAt = new Date().toISOString();
    setPolicies((current) =>
      current.map((p) => (p.id === policy.id ? { ...p, value: nextValue, updatedAt } : p))
    );

    onAuditEntry({
      id: `audit-local-${Date.now()}`,
      targetType: 'application',
      targetId: application.id,
      targetName: application.name,
      action: 'updated',
      actor: application.owner,
      occurredAt: updatedAt,
      detail: `${policy.label} changed from "${policy.value}" to "${nextValue}".`,
    });

    cancelEditing();
  };

  return (
    <div>
      <div className="mb-6">
        <h2>Custom Policy</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Policy values configured for this application. Click a value to edit it.
        </p>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left font-medium px-4 py-3">Policy</th>
                <th className="text-left font-medium px-4 py-3">Value</th>
                <th className="text-left font-medium px-4 py-3">Last updated</th>
              </tr>
            </thead>
            <tbody>
              {policies.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                    No custom policies configured for this application.
                  </td>
                </tr>
              )}
              {policies.map((policy) => {
                const isEditing = editingId === policy.id;

                return (
                  <tr key={policy.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{policy.label}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            type="text"
                            value={draftValue}
                            onChange={(e) => setDraftValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(policy);
                              if (e.key === 'Escape') cancelEditing();
                            }}
                            onBlur={() => saveEdit(policy)}
                            className="px-2 py-1 border border-border rounded text-sm w-40"
                          />
                          <button
                            onClick={() => saveEdit(policy)}
                            className="p-1.5 hover:bg-muted rounded transition-colors"
                            aria-label="Save"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(policy)}
                          className="text-left hover:text-[#C2752E] hover:underline transition-colors"
                        >
                          {policy.value}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {format(new Date(policy.updatedAt), 'MMM d, yyyy')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
