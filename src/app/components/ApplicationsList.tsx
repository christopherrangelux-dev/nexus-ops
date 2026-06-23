import { useState } from 'react';
import { mockApplications, Application, ChangeOrder } from '../data/mockData';
import { StatusBadge } from './StatusBadge';
import { Plus, Search, FileEdit, Settings2 } from 'lucide-react';
import { format } from 'date-fns';
import { NewApplicationFlow } from './NewApplicationFlow';
import { ChangeOrderPanel } from './ChangeOrderPanel';
import { AppLifecycleConsole } from './app-console/AppLifecycleConsole';

export function ApplicationsList() {
  const [showNewAppFlow, setShowNewAppFlow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [changeOrderTarget, setChangeOrderTarget] = useState<Application | null>(null);
  const [recentChangeOrders, setRecentChangeOrders] = useState<ChangeOrder[]>([]);
  const [manageTarget, setManageTarget] = useState<Application | null>(null);

  const filteredApps = mockApplications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showNewAppFlow) {
    return <NewApplicationFlow onClose={() => setShowNewAppFlow(false)} />;
  }

  if (manageTarget) {
    return <AppLifecycleConsole application={manageTarget} onClose={() => setManageTarget(null)} />;
  }

  const handleChangeOrderSubmit = (order: Omit<ChangeOrder, 'id' | 'submittedAt'>) => {
    const newOrder: ChangeOrder = {
      ...order,
      id: `CO-${String(recentChangeOrders.length + 1).padStart(3, '0')}`,
      submittedAt: new Date().toISOString(),
    };
    setRecentChangeOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1>Applications</h1>
          <p className="text-muted-foreground mt-1">Manage your registered applications</p>
        </div>
        <button
          onClick={() => setShowNewAppFlow(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#C2752E] text-white rounded-lg hover:bg-[#9C5E25] transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          Register Application
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-white"
          />
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Application
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Owner
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Department
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Created
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="font-medium">{app.name}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{app.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{app.owner}</div>
                    <div className="text-sm text-muted-foreground">{app.ownerEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{app.department}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {format(new Date(app.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {format(new Date(app.updatedAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setChangeOrderTarget(app)}
                        className="flex items-center gap-1.5 text-sm text-[#C2752E] hover:text-[#9C5E25] transition-colors"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        Change Order
                      </button>
                      <button
                        onClick={() => setManageTarget(app)}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                        Manage
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-border">
          {filteredApps.map((app) => (
            <div key={app.id} className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-medium">{app.name}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{app.description}</div>
                </div>
                <StatusBadge status={app.status} className="flex-shrink-0" />
              </div>
              <div className="text-sm text-muted-foreground space-y-0.5 mb-3">
                <div>{app.owner} · {app.ownerEmail}</div>
                <div>{app.department}</div>
                <div>
                  Created {format(new Date(app.createdAt), 'MMM d, yyyy')} · Updated{' '}
                  {format(new Date(app.updatedAt), 'MMM d, yyyy')}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setChangeOrderTarget(app)}
                  className="flex items-center gap-1.5 text-sm text-[#C2752E] hover:text-[#9C5E25] transition-colors"
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  Change Order
                </button>
                <button
                  onClick={() => setManageTarget(app)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No applications found matching your search.</p>
        </div>
      )}

      {recentChangeOrders.length > 0 && (
        <div className="bg-white border border-border rounded-lg mt-6">
          <div className="border-b border-border px-6 py-4">
            <h3>Recent Change Orders</h3>
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Application</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Change</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Reason</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentChangeOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm font-mono">{order.id}</td>
                    <td className="px-6 py-4 text-sm">{order.applicationName}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium">{order.changeTypeLabel}</div>
                      <div className="text-muted-foreground">{order.newValue}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{order.reason}</td>
                    <td className="px-6 py-4 text-sm">
                      {format(new Date(order.submittedAt), 'MMM d, yyyy h:mm a')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-border">
            {recentChangeOrders.map((order) => (
              <div key={order.id} className="p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-mono">{order.id}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(order.submittedAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <div className="text-sm mb-1">{order.applicationName}</div>
                <div className="text-sm font-medium">{order.changeTypeLabel}</div>
                <div className="text-sm text-muted-foreground">{order.newValue}</div>
                <div className="text-sm text-muted-foreground mt-1">{order.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {changeOrderTarget && (
        <ChangeOrderPanel
          application={changeOrderTarget}
          onClose={() => setChangeOrderTarget(null)}
          onSubmit={handleChangeOrderSubmit}
        />
      )}
    </div>
  );
}
