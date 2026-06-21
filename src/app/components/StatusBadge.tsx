import { RequestStatus, RiskLevel } from '../data/mockData';

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
