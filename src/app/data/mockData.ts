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
  endpoints: string[];
}

export type DormancyStatus = 'active' | 'low-traffic' | 'dormant';
export type EndpointMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type AuditAction = 'created' | 'updated' | 'activated' | 'deactivated' | 'retired' | 'approved' | 'rejected';

export interface Endpoint {
  id: string;
  apiId: string;
  method: EndpointMethod;
  path: string;
  lastTrafficAt: string | null;
  dormancyStatus: DormancyStatus;
}

export interface DormancyEvidence {
  endpointId: string;
  daysSinceLastTraffic: number | null;
  consumerCount: number;
  note: string;
}

export interface Entitlement {
  id: string;
  apiId: string;
  scope: string;
  grantedToApplicationId: string;
  grantedAt: string;
  expiresAt?: string;
}

export interface ValidationRule {
  id: string;
  apiId: string;
  label: string;
  description: string;
  required: boolean;
}

export interface Policy {
  id: string;
  applicationId: string;
  label: string;
  value: string;
  updatedAt: string;
}

export interface AuditEntry {
  id: string;
  targetType: 'application' | 'api' | 'endpoint';
  targetId: string;
  targetName: string;
  action: AuditAction;
  actor: string;
  occurredAt: string;
  detail: string;
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
    },
    endpoints: ['ep-001', 'ep-002', 'ep-003', 'ep-004', 'ep-005']
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
    },
    endpoints: ['ep-006', 'ep-007', 'ep-008', 'ep-009']
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
    },
    endpoints: ['ep-010', 'ep-011', 'ep-012', 'ep-013', 'ep-014']
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
    },
    endpoints: ['ep-015', 'ep-016', 'ep-017', 'ep-018']
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

export const mockEndpoints: Endpoint[] = [
  // Customer Data API (api-001)
  {
    id: 'ep-001',
    apiId: 'api-001',
    method: 'GET',
    path: '/api/v2/customers/:id',
    lastTrafficAt: '2026-06-22T08:14:00Z',
    dormancyStatus: 'active'
  },
  {
    id: 'ep-002',
    apiId: 'api-001',
    method: 'GET',
    path: '/api/v2/customers/:id/transactions',
    lastTrafficAt: '2026-06-21T17:40:00Z',
    dormancyStatus: 'active'
  },
  {
    id: 'ep-003',
    apiId: 'api-001',
    method: 'PUT',
    path: '/api/v2/customers/:id/profile',
    lastTrafficAt: '2026-05-02T11:05:00Z',
    dormancyStatus: 'low-traffic'
  },
  {
    id: 'ep-004',
    apiId: 'api-001',
    method: 'DELETE',
    path: '/api/v2/customers/:id',
    lastTrafficAt: null,
    dormancyStatus: 'dormant'
  },
  {
    id: 'ep-005',
    apiId: 'api-001',
    method: 'GET',
    path: '/api/v2/customers/:id/preferences',
    lastTrafficAt: '2026-06-20T09:00:00Z',
    dormancyStatus: 'active'
  },

  // Payment Processing API (api-002)
  {
    id: 'ep-006',
    apiId: 'api-002',
    method: 'POST',
    path: '/api/v2/payments',
    lastTrafficAt: '2026-06-22T13:50:00Z',
    dormancyStatus: 'active'
  },
  {
    id: 'ep-007',
    apiId: 'api-002',
    method: 'GET',
    path: '/api/v2/payments/:id',
    lastTrafficAt: '2026-06-22T13:51:00Z',
    dormancyStatus: 'active'
  },
  {
    id: 'ep-008',
    apiId: 'api-002',
    method: 'POST',
    path: '/api/v2/payments/:id/refund',
    lastTrafficAt: '2026-04-18T15:30:00Z',
    dormancyStatus: 'low-traffic'
  },
  {
    id: 'ep-009',
    apiId: 'api-002',
    method: 'GET',
    path: '/api/v2/payments/disputes',
    lastTrafficAt: '2026-06-19T10:12:00Z',
    dormancyStatus: 'active'
  },

  // Product Catalog API (api-003)
  {
    id: 'ep-010',
    apiId: 'api-003',
    method: 'GET',
    path: '/api/v2/products',
    lastTrafficAt: '2026-06-22T07:00:00Z',
    dormancyStatus: 'active'
  },
  {
    id: 'ep-011',
    apiId: 'api-003',
    method: 'GET',
    path: '/api/v2/products/:id',
    lastTrafficAt: '2026-06-22T07:02:00Z',
    dormancyStatus: 'active'
  },
  {
    id: 'ep-012',
    apiId: 'api-003',
    method: 'GET',
    path: '/api/v2/products/:id/inventory',
    lastTrafficAt: '2026-06-15T12:00:00Z',
    dormancyStatus: 'active'
  },
  {
    id: 'ep-013',
    apiId: 'api-003',
    method: 'PUT',
    path: '/api/v2/products/:id',
    lastTrafficAt: '2026-05-10T09:45:00Z',
    dormancyStatus: 'low-traffic'
  },
  {
    id: 'ep-014',
    apiId: 'api-003',
    method: 'POST',
    path: '/api/v2/products/bulk-import',
    lastTrafficAt: null,
    dormancyStatus: 'dormant'
  },

  // Analytics Events API (api-004)
  {
    id: 'ep-015',
    apiId: 'api-004',
    method: 'POST',
    path: '/api/v2/analytics/events',
    lastTrafficAt: '2026-06-22T14:05:00Z',
    dormancyStatus: 'active'
  },
  {
    id: 'ep-016',
    apiId: 'api-004',
    method: 'GET',
    path: '/api/v2/analytics/metrics',
    lastTrafficAt: '2026-06-21T11:30:00Z',
    dormancyStatus: 'active'
  },
  {
    id: 'ep-017',
    apiId: 'api-004',
    method: 'GET',
    path: '/api/v2/analytics/metrics/export',
    lastTrafficAt: '2026-04-30T16:20:00Z',
    dormancyStatus: 'low-traffic'
  },
  {
    id: 'ep-018',
    apiId: 'api-004',
    method: 'PATCH',
    path: '/api/v2/analytics/events/:id/tag',
    lastTrafficAt: '2026-06-18T08:55:00Z',
    dormancyStatus: 'active'
  }
];

export const mockDormancyEvidence: DormancyEvidence[] = [
  {
    endpointId: 'ep-003',
    daysSinceLastTraffic: 52,
    consumerCount: 2,
    note: 'Traffic has dropped to a single low-volume consumer over the last 60 days. 2 applications remain configured to call this endpoint.'
  },
  {
    endpointId: 'ep-004',
    daysSinceLastTraffic: null,
    consumerCount: 0,
    note: 'No recorded traffic in 90 days across 0 active consumers. No application currently holds an entitlement for this endpoint.'
  },
  {
    endpointId: 'ep-008',
    daysSinceLastTraffic: 65,
    consumerCount: 1,
    note: 'Refund volume has been flat for over two months; only the Finance Reporting Tool still calls this endpoint, and only for reconciliation, not live refunds.'
  },
  {
    endpointId: 'ep-013',
    daysSinceLastTraffic: 44,
    consumerCount: 1,
    note: 'Catalog write traffic moved to the bulk-import path; this endpoint now sees occasional manual corrections from a single internal tool.'
  },
  {
    endpointId: 'ep-014',
    daysSinceLastTraffic: null,
    consumerCount: 0,
    note: 'No recorded traffic in 120 days across 0 active consumers. The bulk-import job that used this endpoint was migrated to a scheduled internal pipeline last quarter.'
  },
  {
    endpointId: 'ep-017',
    daysSinceLastTraffic: 53,
    consumerCount: 1,
    note: 'Export traffic dropped after the Customer Analytics Dashboard switched to the metrics endpoint directly; one legacy consumer still polls this path weekly.'
  }
];

export const mockEntitlements: Entitlement[] = [
  {
    id: 'ent-001',
    apiId: 'api-001',
    scope: 'read:profile',
    grantedToApplicationId: 'app-001',
    grantedAt: '2026-03-16T09:00:00Z'
  },
  {
    id: 'ent-002',
    apiId: 'api-001',
    scope: 'read:transactions',
    grantedToApplicationId: 'app-003',
    grantedAt: '2026-02-05T10:00:00Z',
    expiresAt: '2026-12-31T23:59:00Z'
  },
  {
    id: 'ent-003',
    apiId: 'api-002',
    scope: 'read:payments',
    grantedToApplicationId: 'app-003',
    grantedAt: '2026-02-01T16:00:00Z'
  },
  {
    id: 'ent-004',
    apiId: 'api-003',
    scope: 'read:products',
    grantedToApplicationId: 'app-002',
    grantedAt: '2026-04-10T09:30:00Z'
  },
  {
    id: 'ent-005',
    apiId: 'api-003',
    scope: 'read:inventory',
    grantedToApplicationId: 'app-002',
    grantedAt: '2026-04-10T09:30:00Z'
  },
  {
    id: 'ent-006',
    apiId: 'api-004',
    scope: 'write:events',
    grantedToApplicationId: 'app-001',
    grantedAt: '2026-03-15T14:30:00Z'
  },
  {
    id: 'ent-007',
    apiId: 'api-004',
    scope: 'read:metrics',
    grantedToApplicationId: 'app-001',
    grantedAt: '2026-03-15T14:30:00Z'
  }
];

export const mockValidationRules: ValidationRule[] = [
  {
    id: 'vr-001',
    apiId: 'api-001',
    label: 'Business justification required',
    description: 'Requestor must describe the specific business need before access can be reviewed.',
    required: true
  },
  {
    id: 'vr-002',
    apiId: 'api-001',
    label: 'Data retention plan required',
    description: 'Requestor must confirm how long customer data will be retained and where it is stored.',
    required: true
  },
  {
    id: 'vr-003',
    apiId: 'api-002',
    label: 'Business justification required',
    description: 'Requestor must describe the specific business need before access can be reviewed.',
    required: true
  },
  {
    id: 'vr-004',
    apiId: 'api-002',
    label: 'Security review sign-off',
    description: 'Security team must confirm the requesting application meets PCI-aligned handling standards.',
    required: true
  },
  {
    id: 'vr-005',
    apiId: 'api-003',
    label: 'Business justification required',
    description: 'Requestor must describe the specific business need before access can be reviewed.',
    required: true
  },
  {
    id: 'vr-006',
    apiId: 'api-003',
    label: 'Department allowlist check',
    description: 'Requesting application must belong to one of the allowed departments for this API.',
    required: false
  },
  {
    id: 'vr-007',
    apiId: 'api-004',
    label: 'Business justification required',
    description: 'Requestor must describe the specific business need before access can be reviewed.',
    required: false
  }
];

export const mockPolicies: Policy[] = [
  {
    id: 'pol-001',
    applicationId: 'app-001',
    label: 'Default rate limit',
    value: '1000 req/min',
    updatedAt: '2026-03-20T14:22:00Z'
  },
  {
    id: 'pol-002',
    applicationId: 'app-001',
    label: 'Data retention window',
    value: '90 days',
    updatedAt: '2026-03-20T14:22:00Z'
  },
  {
    id: 'pol-003',
    applicationId: 'app-002',
    label: 'Default rate limit',
    value: '500 req/min',
    updatedAt: '2026-04-10T09:15:00Z'
  },
  {
    id: 'pol-004',
    applicationId: 'app-003',
    label: 'Default rate limit',
    value: '250 req/min',
    updatedAt: '2026-04-01T08:30:00Z'
  },
  {
    id: 'pol-005',
    applicationId: 'app-003',
    label: 'Data retention window',
    value: '365 days',
    updatedAt: '2026-04-01T08:30:00Z'
  },
  {
    id: 'pol-006',
    applicationId: 'app-004',
    label: 'Default rate limit',
    value: '2000 req/min',
    updatedAt: '2026-04-16T16:45:00Z'
  }
];

export const mockAuditEntries: AuditEntry[] = [
  {
    id: 'audit-001',
    targetType: 'application',
    targetId: 'app-001',
    targetName: 'Customer Analytics Dashboard',
    action: 'created',
    actor: 'Sarah Chen',
    occurredAt: '2026-03-15T10:30:00Z',
    detail: 'Application registered.'
  },
  {
    id: 'audit-002',
    targetType: 'application',
    targetId: 'app-001',
    targetName: 'Customer Analytics Dashboard',
    action: 'approved',
    actor: 'Alex Thompson (Product Manager)',
    occurredAt: '2026-03-15T14:30:00Z',
    detail: 'Analytics Events API access approved - standard analytics use case, no PII involved.'
  },
  {
    id: 'audit-003',
    targetType: 'api',
    targetId: 'api-001',
    targetName: 'Customer Data API',
    action: 'created',
    actor: 'Data Platform Team',
    occurredAt: '2026-01-10T09:00:00Z',
    detail: 'API published to catalog.'
  },
  {
    id: 'audit-004',
    targetType: 'api',
    targetId: 'api-003',
    targetName: 'Product Catalog API',
    action: 'updated',
    actor: 'Catalog Team',
    occurredAt: '2026-05-10T09:45:00Z',
    detail: 'Bulk import workflow migrated to scheduled internal pipeline.'
  },
  {
    id: 'audit-005',
    targetType: 'application',
    targetId: 'app-003',
    targetName: 'Finance Reporting Tool',
    action: 'approved',
    actor: 'Lisa Chang (Finance Manager)',
    occurredAt: '2026-02-01T16:00:00Z',
    detail: 'Payment Processing API access approved with audit logging enabled.'
  },
  {
    id: 'audit-006',
    targetType: 'application',
    targetId: 'app-001',
    targetName: 'Customer Analytics Dashboard',
    action: 'rejected',
    actor: 'Mark Stevens (Data Product Manager)',
    occurredAt: '2026-04-06T10:30:00Z',
    detail: 'Write access to PII not justified for analytics use case.'
  }
];
