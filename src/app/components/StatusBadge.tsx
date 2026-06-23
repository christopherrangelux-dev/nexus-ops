import { RequestStatus, RiskLevel, DormancyStatus, EndpointMethod, AuditAction } from '../data/mockData';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const styles = {
    draft: 'bg-[#F1ECE2] text-[#221F1B] border border-[#E7E0D2]',
    pending: 'bg-amber-100 text-amber-800 border border-amber-300',
    approved: 'bg-blue-100 text-blue-800 border border-blue-300',
    rejected: 'bg-red-100 text-red-800 border border-red-300',
    active: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    suspended: 'bg-orange-100 text-orange-800 border border-orange-300'
  };

  const labels = {
    draft: 'Draft',
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    active: 'Active',
    suspended: 'Suspended'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${styles[status]} ${className}`}>
      {labels[status]}
    </span>
  );
}

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className = '' }: RiskBadgeProps) {
  const styles = {
    low: 'bg-green-100 text-green-800 border border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    high: 'bg-orange-100 text-orange-800 border border-orange-300',
    critical: 'bg-red-100 text-red-800 border border-red-300'
  };

  const labels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
    critical: 'Critical Risk'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${styles[level]} ${className}`}>
      {labels[level]}
    </span>
  );
}

interface DormancyBadgeProps {
  status: DormancyStatus;
  className?: string;
}

export function DormancyBadge({ status, className = '' }: DormancyBadgeProps) {
  const styles = {
    active: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    'low-traffic': 'bg-amber-100 text-amber-800 border border-amber-300',
    dormant: 'bg-red-100 text-red-800 border border-red-300'
  };

  const labels = {
    active: 'Active',
    'low-traffic': 'Low Traffic',
    dormant: 'Dormant'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${styles[status]} ${className}`}>
      {labels[status]}
    </span>
  );
}

interface MethodBadgeProps {
  method: EndpointMethod;
  className?: string;
}

export function MethodBadge({ method, className = '' }: MethodBadgeProps) {
  const styles = {
    GET: 'bg-blue-100 text-blue-800 border border-blue-300',
    POST: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    PUT: 'bg-amber-100 text-amber-800 border border-amber-300',
    PATCH: 'bg-amber-100 text-amber-800 border border-amber-300',
    DELETE: 'bg-red-100 text-red-800 border border-red-300'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium ${styles[method]} ${className}`}>
      {method}
    </span>
  );
}

interface AuditActionBadgeProps {
  action: AuditAction;
  className?: string;
}

export function AuditActionBadge({ action, className = '' }: AuditActionBadgeProps) {
  const styles = {
    created: 'bg-blue-100 text-blue-800 border border-blue-300',
    updated: 'bg-[#F1ECE2] text-[#221F1B] border border-[#E7E0D2]',
    activated: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    deactivated: 'bg-orange-100 text-orange-800 border border-orange-300',
    retired: 'bg-red-100 text-red-800 border border-red-300',
    approved: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    rejected: 'bg-red-100 text-red-800 border border-red-300'
  };

  const labels = {
    created: 'Created',
    updated: 'Updated',
    activated: 'Activated',
    deactivated: 'Deactivated',
    retired: 'Retired',
    approved: 'Approved',
    rejected: 'Rejected'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${styles[action]} ${className}`}>
      {labels[action]}
    </span>
  );
}
