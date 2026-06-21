export type RequestStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'active' | 'suspended';
export type DataSensitivity = 'public' | 'internal' | 'confidential' | 'pii';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Application {
  id: string;
  name: string;
  description: string;
  owner: string;
  ownerEmail: string;
  department: string;
  businessPurpose: string;
  technicalContact: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export type ChangeType = 'owner' | 'department' | 'businessPurpose' | 'technicalContact' | 'deactivate';

export interface ChangeOrder {
  id: string;
  applicationId: string;
  applicationName: string;
  changeType: ChangeType;
  changeTypeLabel: string;
  newValue: string;
  reason: string;
  submittedAt: string;
}

export interface APIRequest {
  id: string;
  applicationId: string;
  applicationName: string;
  requestor: string;
  requestorEmail: string;
  apiName: string;
  apiEndpoint: string;
  scopes: string[];
  dataSensitivity: DataSensitivity;
  riskLevel: RiskLevel;
  businessJustification: string;
  status: RequestStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface API {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  owner: string;
  availableScopes: string[];
  dataSensitivity: DataSensitivity;
  policy: {
    requiresApproval: boolean;
    approvers: string[];
    maxRetentionDays?: number;
    allowedDepartments?: string[];
  };
}

export const mockApplications: Application[] = [
  {
    id: 'app-001',
    name: 'Customer Analytics Dashboard',
    description: 'Real-time analytics for customer behavior tracking',
    owner: 'Sarah Chen',
    ownerEmail: 'sarah.chen@company.com',
    department: 'Product Analytics',
    businessPurpose: 'Enable product team to track user engagement and feature adoption',
    technicalContact: 'sarah.chen@company.com',
    status: 'active',
    createdAt: '2026-03-15T10:30:00Z',
    updatedAt: '2026-03-20T14:22:00Z'
  },
  {
    id: 'app-002',
    name: 'Marketing Automation Service',
    description: 'Automated email campaigns and user segmentation',
    owner: 'Michael Rodriguez',
    ownerEmail: 'michael.rodriguez@company.com',
    department: 'Marketing',
    businessPurpose: 'Automate customer engagement campaigns based on behavior',
    technicalContact: 'dev-team@company.com',
    status: 'pending',
    createdAt: '2026-04-10T09:15:00Z',
    updatedAt: '2026-04-10T09:15:00Z'
  },
  {
    id: 'app-003',
    name: 'Finance Reporting Tool',
    description: 'Monthly revenue and transaction reporting',
    owner: 'Jennifer Kim',
    ownerEmail: 'jennifer.kim@company.com',
    department: 'Finance',
    businessPurpose: 'Generate compliance reports for SEC filings',
    technicalContact: 'jennifer.kim@company.com',
    status: 'active',
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-04-01T08:30:00Z'
  },
  {
    id: 'app-004',
    name: 'Mobile App Backend',
    description: 'API gateway for iOS and Android applications',
    owner: 'David Park',
    ownerEmail: 'david.park@company.com',
    department: 'Engineering',
    businessPurpose: 'Support mobile application authentication and data sync',
    technicalContact: 'mobile-team@company.com',
    status: 'draft',
    createdAt: '2026-04-16T16:45:00Z',
    updatedAt: '2026-04-16T16:45:00Z'
  }
];

export const mockAPIs: API[] = [
  {
    id: 'api-001',
    name: 'Customer Data API',
    description: 'Access customer profile and transaction history',
    endpoint: '/api/v2/customers',
    owner: 'Data Platform Team',
    availableScopes: ['read:profile', 'read:transactions', 'write:profile', 'delete:customer'],
    dataSensitivity: 'pii',
    policy: {
      requiresApproval: true,
      approvers: ['data-product-manager@company.com', 'privacy-officer@company.com'],
      maxRetentionDays: 90,
      allowedDepartments: ['Product', 'Analytics', 'Support']
    }
  },
  {
    id: 'api-002',
    name: 'Payment Processing API',
    description: 'Process payments and refunds',
    endpoint: '/api/v2/payments',
    owner: 'Finance Engineering',
    availableScopes: ['read:payments', 'write:payments', 'refund:payments'],
    dataSensitivity: 'confidential',
    policy: {
      requiresApproval: true,
      approvers: ['finance-manager@company.com', 'security-team@company.com'],
      maxRetentionDays: 365,
      allowedDepartments: ['Finance', 'Billing']
    }
  },
  {
    id: 'api-003',
    name: 'Product Catalog API',
    description: 'Read product information and inventory levels',
    endpoint: '/api/v2/products',
    owner: 'Catalog Team',
    availableScopes: ['read:products', 'read:inventory', 'write:products'],
    dataSensitivity: 'internal',
    policy: {
      requiresApproval: true,
      approvers: ['product-manager@company.com'],
      allowedDepartments: ['Product', 'Marketing', 'Sales']
    }
  },
  {
    id: 'api-004',
    name: 'Analytics Events API',
    description: 'Send analytics events and metrics',
    endpoint: '/api/v2/analytics',
    owner: 'Analytics Platform',
    availableScopes: ['write:events', 'read:metrics'],
    dataSensitivity: 'internal',
    policy: {
      requiresApproval: false,
      approvers: []
    }
  }
];

export const mockAPIRequests: APIRequest[] = [
  {
    id: 'req-001',
    applicationId: 'app-002',
    applicationName: 'Marketing Automation Service',
    requestor: 'Michael Rodriguez',
    requestorEmail: 'michael.rodriguez@company.com',
    apiName: 'Customer Data API',
    apiEndpoint: '/api/v2/customers',
    scopes: ['read:profile', 'read:transactions'],
    dataSensitivity: 'pii',
    riskLevel: 'high',
    businessJustification: 'Need to access customer profiles to create targeted email campaigns based on purchase history. This will increase conversion rates by 15-20% based on A/B test results.',
    status: 'pending',
    requestedAt: '2026-04-10T09:20:00Z'
  },
  {
    id: 'req-002',
    applicationId: 'app-002',
    applicationName: 'Marketing Automation Service',
    requestor: 'Michael Rodriguez',
    requestorEmail: 'michael.rodriguez@company.com',
    apiName: 'Product Catalog API',
    apiEndpoint: '/api/v2/products',
    scopes: ['read:products', 'read:inventory'],
    dataSensitivity: 'internal',
    riskLevel: 'low',
    businessJustification: 'Display personalized product recommendations in email campaigns.',
    status: 'pending',
    requestedAt: '2026-04-10T09:25:00Z'
  },
  {
    id: 'req-003',
    applicationId: 'app-001',
    applicationName: 'Customer Analytics Dashboard',
    requestor: 'Sarah Chen',
    requestorEmail: 'sarah.chen@company.com',
    apiName: 'Analytics Events API',
    apiEndpoint: '/api/v2/analytics',
    scopes: ['write:events', 'read:metrics'],
    dataSensitivity: 'internal',
    riskLevel: 'low',
    businessJustification: 'Send user interaction events to analytics platform for feature usage tracking.',
    status: 'approved',
    requestedAt: '2026-03-15T10:45:00Z',
    reviewedAt: '2026-03-15T14:30:00Z',
    reviewedBy: 'Alex Thompson (Product Manager)',
    reviewNotes: 'Approved - standard analytics use case, no PII involved.'
  },
  {
    id: 'req-004',
    applicationId: 'app-003',
    applicationName: 'Finance Reporting Tool',
    requestor: 'Jennifer Kim',
    requestorEmail: 'jennifer.kim@company.com',
    apiName: 'Payment Processing API',
    apiEndpoint: '/api/v2/payments',
    scopes: ['read:payments'],
    dataSensitivity: 'confidential',
    riskLevel: 'medium',
    businessJustification: 'Generate monthly revenue reports for SEC 10-K filing compliance.',
    status: 'approved',
    requestedAt: '2026-02-01T11:15:00Z',
    reviewedAt: '2026-02-01T16:00:00Z',
    reviewedBy: 'Lisa Chang (Finance Manager)',
    reviewNotes: 'Approved with audit logging enabled. Required for regulatory compliance.'
  },
  {
    id: 'req-005',
    applicationId: 'app-001',
    applicationName: 'Customer Analytics Dashboard',
    requestor: 'Sarah Chen',
    requestorEmail: 'sarah.chen@company.com',
    apiName: 'Customer Data API',
    apiEndpoint: '/api/v2/customers',
    scopes: ['read:profile', 'write:profile'],
    dataSensitivity: 'pii',
    riskLevel: 'critical',
    businessJustification: 'Need write access to update customer preferences from analytics dashboard.',
    status: 'rejected',
    requestedAt: '2026-04-05T13:00:00Z',
    reviewedAt: '2026-04-06T10:30:00Z',
    reviewedBy: 'Mark Stevens (Data Product Manager)',
    reviewNotes: 'Rejected - write access to PII not justified for analytics use case. Please use read-only scopes or submit separate request with detailed security review.'
  }
];
