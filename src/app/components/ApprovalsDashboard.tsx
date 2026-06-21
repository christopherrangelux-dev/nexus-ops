import { useState } from 'react';
import { mockAPIRequests, APIRequest } from '../data/mockData';
import { StatusBadge, RiskBadge } from './StatusBadge';
import { ApprovalDetailView } from './ApprovalDetailView';
import { format } from 'date-fns';

export function ApprovalsDashboard() {
  const [selectedRequest, setSelectedRequest] = useState<APIRequest | null>(null);

  const pendingRequests = mockAPIRequests.filter(req => req.status === 'pending');
  const allRequests = mockAPIRequests;

  return (
    <div className="flex-1 flex">
      {selectedRequest ? (
        <ApprovalDetailView
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      ) : (
        <div className="flex-1 p-8">
          <div className="mb-6">
            <h1>Approvals</h1>
            <p className="text-muted-foreground mt-1">Review and manage API access requests</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Pending Review</div>
              <div className="text-3xl font-semibold mt-1">{pendingRequests.length}</div>
            </div>
            <div className="bg-white border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Approved (7 days)</div>
              <div className="text-3xl font-semibold mt-1">1</div>
            </div>
            <div className="bg-white border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Rejected (7 days)</div>
              <div className="text-3xl font-semibold mt-1">1</div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg">
            <div className="border-b border-border px-6 py-4">
              <h3>Pending Approvals</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Requestor
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Application
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      API Requested
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pendingRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="font-medium">{request.requestor}</div>
                        <div className="text-sm text-muted-foreground">{request.requestorEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{request.applicationName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{request.apiName}</div>
                        <div className="text-sm text-muted-foreground">{request.scopes.join(', ')}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {format(new Date(request.requestedAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <RiskBadge level={request.riskLevel} />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="px-3 py-1.5 bg-[#C2752E] text-white rounded text-sm hover:bg-[#9C5E25] transition-colors"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg mt-6">
            <div className="border-b border-border px-6 py-4">
              <h3>Recent Decisions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Requestor
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Application
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      API
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Reviewed By
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allRequests
                    .filter(req => req.status === 'approved' || req.status === 'rejected')
                    .map((request) => (
                      <tr key={request.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4">
                          <div className="font-medium">{request.requestor}</div>
                        </td>
                        <td className="px-6 py-4">{request.applicationName}</td>
                        <td className="px-6 py-4">{request.apiName}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="px-6 py-4 text-sm">{request.reviewedBy}</td>
                        <td className="px-6 py-4 text-sm">
                          {request.reviewedAt && format(new Date(request.reviewedAt), 'MMM d, yyyy')}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
