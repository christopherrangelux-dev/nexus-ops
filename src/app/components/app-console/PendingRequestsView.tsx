import { format } from 'date-fns';
import { Application, APIRequest, mockAPIRequests } from '../../data/mockData';
import { StatusBadge } from '../StatusBadge';

interface PendingRequestsViewProps {
  application: Application;
  localApiRequests: APIRequest[];
}

export function PendingRequestsView({ application, localApiRequests }: PendingRequestsViewProps) {
  const pendingRequests = [...mockAPIRequests, ...localApiRequests].filter(
    (req) => req.applicationId === application.id && req.status === 'pending'
  );

  return (
    <div>
      <div className="mb-6">
        <h2>Pending Requests</h2>
        <p className="text-sm text-muted-foreground mt-1">
          API access requests submitted by this application that are still awaiting review.
        </p>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left font-medium px-4 py-3">API</th>
              <th className="text-left font-medium px-4 py-3">Scopes</th>
              <th className="text-left font-medium px-4 py-3">Requested at</th>
              <th className="text-left font-medium px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  No pending requests for this application.
                </td>
              </tr>
            )}
            {pendingRequests.map((req) => (
              <tr key={req.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 font-medium">{req.apiName}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {req.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="inline-flex items-center px-2 py-0.5 rounded bg-[#ECE9F3] text-[#382B5F] text-xs border border-[#DCD5E8]"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {format(new Date(req.requestedAt), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={req.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
