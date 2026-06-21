import { User, Bell, Shield, Key } from 'lucide-react';

export function Settings() {
  return (
    <div className="flex-1 p-8">
      <div className="mb-6">
        <h1>Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-muted-foreground" />
            <h3>Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                defaultValue="Data Product Manager"
                className="w-full px-3 py-2 border border-border rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                defaultValue="dpm@company.com"
                className="w-full px-3 py-2 border border-border rounded bg-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <h3>Notifications</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border border-border rounded hover:bg-muted/30 cursor-pointer">
              <span className="text-sm">Email notifications for new requests</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </label>
            <label className="flex items-center justify-between p-3 border border-border rounded hover:bg-muted/30 cursor-pointer">
              <span className="text-sm">Email digest (daily summary)</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </label>
            <label className="flex items-center justify-between p-3 border border-border rounded hover:bg-muted/30 cursor-pointer">
              <span className="text-sm">Slack notifications</span>
              <input type="checkbox" className="w-4 h-4" />
            </label>
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <h3>Security</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border rounded">
              <div>
                <div className="text-sm font-medium">Two-Factor Authentication</div>
                <div className="text-xs text-muted-foreground mt-0.5">Enabled</div>
              </div>
              <span className="text-xs text-emerald-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded">
              <div>
                <div className="text-sm font-medium">SSO Integration</div>
                <div className="text-xs text-muted-foreground mt-0.5">Okta</div>
              </div>
              <span className="text-xs text-emerald-600 font-medium">Connected</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-5 h-5 text-muted-foreground" />
            <h3>API Access</h3>
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            Manage your personal API tokens for programmatic access
          </div>
          <button className="px-4 py-2 border border-border rounded hover:bg-muted transition-colors">
            Generate New Token
          </button>
        </div>
      </div>
    </div>
  );
}
