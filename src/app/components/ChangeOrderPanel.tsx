import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Application, ChangeType, ChangeOrder } from '../data/mockData';

interface ChangeOrderPanelProps {
  application: Application;
  onClose: () => void;
  onSubmit: (order: Omit<ChangeOrder, 'id' | 'submittedAt'>) => void;
}

const changeTypes: { id: ChangeType; label: string }[] = [
  { id: 'owner', label: 'Update Owner' },
  { id: 'department', label: 'Update Department' },
  { id: 'businessPurpose', label: 'Update Business Purpose' },
  { id: 'technicalContact', label: 'Update Technical Contact' },
  { id: 'deactivate', label: 'Deactivate Application' },
];

const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'Finance', 'Analytics', 'Support'];

export function ChangeOrderPanel({ application, onClose, onSubmit }: ChangeOrderPanelProps) {
  const [changeType, setChangeType] = useState<ChangeType | ''>('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [businessPurpose, setBusinessPurpose] = useState('');
  const [technicalContact, setTechnicalContact] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const buildNewValue = (): string => {
    switch (changeType) {
      case 'owner':
        return `${ownerName} (${ownerEmail})`;
      case 'department':
        return department;
      case 'businessPurpose':
        return businessPurpose;
      case 'technicalContact':
        return technicalContact;
      case 'deactivate':
        return 'Deactivated';
      default:
        return '';
    }
  };

  const isValid = (): boolean => {
    if (!changeType || !reason.trim()) return false;
    switch (changeType) {
      case 'owner':
        return !!(ownerName.trim() && ownerEmail.trim());
      case 'department':
        return !!department;
      case 'businessPurpose':
        return !!businessPurpose.trim();
      case 'technicalContact':
        return !!technicalContact.trim();
      case 'deactivate':
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!changeType || !isValid()) return;
    onSubmit({
      applicationId: application.id,
      applicationName: application.name,
      changeType,
      changeTypeLabel: changeTypes.find((c) => c.id === changeType)!.label,
      newValue: buildNewValue(),
      reason,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-[420px] bg-white border-l border-border shadow-2xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2>Change Order</h2>
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
              Change order submitted — you'll be notified once it's processed.
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
              <label className="block text-sm font-medium mb-2">Change Type *</label>
              <select
                value={changeType}
                onChange={(e) => setChangeType(e.target.value as ChangeType)}
                className="w-full px-3 py-2 border border-border rounded bg-white"
              >
                <option value="">Select a change type...</option>
                {changeTypes.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {changeType === 'owner' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">New Owner Name *</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded bg-white"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Owner Email *</label>
                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded bg-white"
                    placeholder="owner@company.com"
                  />
                </div>
              </>
            )}

            {changeType === 'department' && (
              <div>
                <label className="block text-sm font-medium mb-2">New Department *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded bg-white"
                >
                  <option value="">Select department...</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}

            {changeType === 'businessPurpose' && (
              <div>
                <label className="block text-sm font-medium mb-2">New Business Purpose *</label>
                <textarea
                  value={businessPurpose}
                  onChange={(e) => setBusinessPurpose(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded resize-none bg-white"
                  rows={4}
                  placeholder="Updated business purpose"
                />
              </div>
            )}

            {changeType === 'technicalContact' && (
              <div>
                <label className="block text-sm font-medium mb-2">New Technical Contact *</label>
                <input
                  type="email"
                  value={technicalContact}
                  onChange={(e) => setTechnicalContact(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded bg-white"
                  placeholder="tech-contact@company.com"
                />
              </div>
            )}

            {changeType === 'deactivate' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="text-sm text-amber-800">
                  This will mark the application as suspended. It can be reactivated later via a new change order.
                </div>
              </div>
            )}

            {changeType && (
              <div>
                <label className="block text-sm font-medium mb-2">Reason for Change *</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded resize-none bg-white"
                  rows={3}
                  placeholder="Why is this change needed?"
                />
              </div>
            )}
          </div>

          <div className="p-6 border-t border-border">
            <button
              onClick={handleSubmit}
              disabled={!isValid()}
              className="w-full px-4 py-2.5 bg-[#C2752E] text-white rounded font-medium hover:bg-[#9C5E25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Change Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
