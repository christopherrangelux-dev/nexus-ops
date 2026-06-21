import { useState } from 'react';
import { X, CheckCircle2, Circle } from 'lucide-react';

interface NewApplicationFlowProps {
  onClose: () => void;
}

type StepId = 'business' | 'technical' | 'compliance';

interface FormData {
  name: string;
  description: string;
  businessPurpose: string;
  owner: string;
  ownerEmail: string;
  department: string;
  technicalContact: string;
  dataSensitivity: string;
  dataRetention: string;
  complianceRequirements: string[];
}

export function NewApplicationFlow({ onClose }: NewApplicationFlowProps) {
  const [activeStep, setActiveStep] = useState<StepId>('business');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    businessPurpose: '',
    owner: '',
    ownerEmail: '',
    department: '',
    technicalContact: '',
    dataSensitivity: '',
    dataRetention: '',
    complianceRequirements: []
  });

  const steps = [
    { id: 'business' as StepId, label: 'Business Context', description: 'Application details and purpose' },
    { id: 'technical' as StepId, label: 'Technical Specs', description: 'Owner and technical contact' },
    { id: 'compliance' as StepId, label: 'Compliance', description: 'Data sensitivity and requirements' }
  ];

  const isStepValid = (stepId: StepId): boolean => {
    switch (stepId) {
      case 'business':
        return !!(formData.name && formData.description && formData.businessPurpose);
      case 'technical':
        return !!(formData.owner && formData.ownerEmail && formData.department && formData.technicalContact);
      case 'compliance':
        return !!(formData.dataSensitivity && formData.dataRetention);
      default:
        return false;
    }
  };

  const canSubmit = steps.every(step => isStepValid(step.id));

  const handleSubmit = () => {
    if (canSubmit) {
      alert('Application registered successfully!\n\nIn a real system, this would create the application and provision credentials.');
      onClose();
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData({ ...formData, ...updates });
  };

  const toggleCompliance = (requirement: string) => {
    const current = formData.complianceRequirements;
    if (current.includes(requirement)) {
      updateFormData({ complianceRequirements: current.filter(r => r !== requirement) });
    } else {
      updateFormData({ complianceRequirements: [...current, requirement] });
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-border px-8 py-4 flex items-center justify-between bg-white">
        <div>
          <h2>Register New Application</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete all sections to submit your request</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Stepper Navigation */}
        <div className="w-80 border-r border-border p-8 bg-[#FBF7F1]">
          <div className="space-y-2">
            {steps.map((step, index) => {
              const isValid = isStepValid(step.id);
              const isActive = activeStep === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#ECE9F3] border-2 border-[#C2752E]'
                      : 'bg-white border-2 border-transparent hover:border-[#E7E0D2]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {isValid ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{step.label}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">{step.description}</div>
                      {isValid && (
                        <div className="text-xs text-emerald-600 mt-1 font-medium">Complete</div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-white rounded-lg border border-border">
            <div className="text-sm font-medium mb-2">Progress</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{steps.filter(s => isStepValid(s.id)).length} of {steps.length} complete</span>
            </div>
            <div className="w-full bg-[#E7E0D2] rounded-full h-2 mt-2">
              <div
                className="bg-[#C2752E] h-2 rounded-full transition-all"
                style={{ width: `${(steps.filter(s => isStepValid(s.id)).length / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeStep === 'business' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3>Business Context</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Provide information about your application and its purpose
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Application Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="e.g., Customer Analytics Dashboard"
                  className="w-full px-3 py-2 border border-border rounded bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  placeholder="Brief description of what this application does"
                  className="w-full px-3 py-2 border border-border rounded resize-none bg-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Business Purpose *</label>
                <textarea
                  value={formData.businessPurpose}
                  onChange={(e) => updateFormData({ businessPurpose: e.target.value })}
                  placeholder="Explain the business value and why this application is needed"
                  className="w-full px-3 py-2 border border-border rounded resize-none bg-white"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be reviewed by approvers when you request API access
                </p>
              </div>
            </div>
          )}

          {activeStep === 'technical' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3>Technical Specifications</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Identify the owner and technical contacts
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Application Owner *</label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => updateFormData({ owner: e.target.value })}
                  placeholder="Full name"
                  className="w-full px-3 py-2 border border-border rounded bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Owner Email *</label>
                <input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => updateFormData({ ownerEmail: e.target.value })}
                  placeholder="owner@company.com"
                  className="w-full px-3 py-2 border border-border rounded bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => updateFormData({ department: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded bg-white"
                >
                  <option value="">Select department...</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Technical Contact *</label>
                <input
                  type="email"
                  value={formData.technicalContact}
                  onChange={(e) => updateFormData({ technicalContact: e.target.value })}
                  placeholder="tech-contact@company.com"
                  className="w-full px-3 py-2 border border-border rounded bg-white"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Who should receive technical notifications and alerts?
                </p>
              </div>
            </div>
          )}

          {activeStep === 'compliance' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3>Compliance Requirements</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Define data sensitivity and compliance needs
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data Sensitivity Level *</label>
                <select
                  value={formData.dataSensitivity}
                  onChange={(e) => updateFormData({ dataSensitivity: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded bg-white"
                >
                  <option value="">Select sensitivity level...</option>
                  <option value="public">Public - No sensitive data</option>
                  <option value="internal">Internal - Internal use only</option>
                  <option value="confidential">Confidential - Business sensitive</option>
                  <option value="pii">PII - Personal Identifiable Information</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data Retention Period *</label>
                <select
                  value={formData.dataRetention}
                  onChange={(e) => updateFormData({ dataRetention: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded bg-white"
                >
                  <option value="">Select retention period...</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                  <option value="730">2 years</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Compliance Requirements</label>
                <div className="space-y-2">
                  {['SOC 2', 'GDPR', 'HIPAA', 'PCI DSS', 'SOX'].map((req) => (
                    <label key={req} className="flex items-center gap-2 p-3 border border-border rounded hover:bg-muted/30 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.complianceRequirements.includes(req)}
                        onChange={() => toggleCompliance(req)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{req}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.dataSensitivity === 'pii' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="font-medium text-amber-900 mb-1">Additional Review Required</div>
                  <div className="text-sm text-amber-700">
                    Applications handling PII require Privacy Officer approval before API access can be granted.
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="max-w-2xl mt-8 pt-6 border-t border-border flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border rounded hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-1 px-4 py-2 bg-[#C2752E] text-white rounded hover:bg-[#9C5E25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {canSubmit ? 'Submit Application' : 'Complete all sections to submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
