import { format } from 'date-fns';
import { AuditEntry } from '../../data/mockData';
import { AuditActionBadge } from '../StatusBadge';

interface AuditHistoryTableProps {
  entries: AuditEntry[];
}

export function AuditHistoryTable({ entries }: AuditHistoryTableProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white border border-border rounded-lg px-4 py-6 text-center text-muted-foreground text-sm">
        No history yet.
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left font-medium px-4 py-3">Action</th>
              <th className="text-left font-medium px-4 py-3">Target</th>
              <th className="text-left font-medium px-4 py-3">Actor</th>
              <th className="text-left font-medium px-4 py-3">When</th>
              <th className="text-left font-medium px-4 py-3">Detail</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3">
                  <AuditActionBadge action={entry.action} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{entry.targetName}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{entry.actor}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {format(new Date(entry.occurredAt), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-muted-foreground min-w-[240px]">{entry.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
