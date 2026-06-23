import { useState } from 'react';
import { API, mockValidationRules } from '../../data/mockData';

interface ValidationRulesViewProps {
  api: API;
}

export function ValidationRulesView({ api }: ValidationRulesViewProps) {
  const rules = mockValidationRules.filter((rule) => rule.apiId === api.id);
  // Visual-only — toggling does not gate anything in this demo, see Section 6 of the build doc.
  const [requiredState, setRequiredState] = useState<Record<string, boolean>>(
    Object.fromEntries(rules.map((rule) => [rule.id, rule.required]))
  );

  return (
    <div>
      <div className="mb-6">
        <h2>Request Validation</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Rules a new access request against this API must satisfy before it can be approved.
        </p>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        {rules.length === 0 && (
          <div className="px-4 py-6 text-center text-muted-foreground text-sm">
            No validation rules configured for this API.
          </div>
        )}
        {rules.map((rule, idx) => {
          const isRequired = requiredState[rule.id];
          return (
            <div
              key={rule.id}
              className={`flex items-start justify-between gap-4 px-4 py-4 ${
                idx !== rules.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div>
                <div className="text-sm font-medium">{rule.label}</div>
                <p className="text-sm text-muted-foreground mt-0.5">{rule.description}</p>
              </div>
              <button
                onClick={() =>
                  setRequiredState((current) => ({ ...current, [rule.id]: !current[rule.id] }))
                }
                aria-pressed={isRequired}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                  isRequired ? 'bg-[#C2752E]' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isRequired ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
