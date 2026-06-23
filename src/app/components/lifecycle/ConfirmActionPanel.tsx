import { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ConfirmActionPanelProps {
  title: string;
  description: string;
  affectedItems: { label: string; meta?: string }[];
  requireExplicitConfirm?: boolean;
  nextSteps: string[];
  onConfirm: () => Promise<'success' | 'error' | 'partial'>;
  onClose: () => void;
}

export function ConfirmActionPanel({
  title,
  description,
  affectedItems,
  requireExplicitConfirm = false,
  nextSteps,
  onConfirm,
  onClose,
}: ConfirmActionPanelProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | 'partial' | null>(null);

  const canConfirm = requireExplicitConfirm ? confirmed : true;

  const handleConfirm = async () => {
    if (!canConfirm || submitting) return;
    setSubmitting(true);
    const outcome = await onConfirm();
    setResult(outcome);
    setSubmitting(false);
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-full sm:w-[420px] bg-white border-l border-border shadow-2xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2>{title}</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {result ? (
        <div className="flex-1 p-6">
          {result === 'success' && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Action completed successfully.</span>
            </div>
          )}
          {result === 'error' && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Something went wrong and this action could not be completed. No changes were made.</span>
            </div>
          )}
          {result === 'partial' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Some actions could not be completed. Review the affected items below.</span>
              </div>
              <div className="space-y-2">
                {affectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#ECE9F3] text-[#382B5F] text-xs border border-[#DCD5E8] mr-2"
                  >
                    {item.label}
                    {item.meta && <span className="text-[#382B5F]/70">{item.meta}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
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
            <p className="text-sm text-muted-foreground">{description}</p>

            {affectedItems.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Affected items</div>
                <div className="flex flex-wrap gap-1.5">
                  {affectedItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ECE9F3] text-[#382B5F] text-xs border border-[#DCD5E8]"
                    >
                      {item.label}
                      {item.meta && <span className="text-[#382B5F]/70">· {item.meta}</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {nextSteps.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">What happens next</div>
                <ul className="space-y-1.5">
                  {nextSteps.map((step, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {requireExplicitConfirm && (
              <label className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5"
                />
                <span className="text-sm text-amber-800">I understand this cannot be undone</span>
              </label>
            )}
          </div>

          <div className="p-6 border-t border-border flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border rounded font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm || submitting}
              className="flex-1 px-4 py-2.5 bg-[#C2752E] text-white rounded font-medium hover:bg-[#9C5E25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Confirming…' : 'Confirm'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
