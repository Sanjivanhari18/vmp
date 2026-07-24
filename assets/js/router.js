/** VMP Router — hash-based navigation and role-based nav */
const NAV_CONFIG = {
  taq: {
    label: 'TAQ / System Admin', userId: 'u1', dashboard: 'dashboard/taq',
    sections: [
      { label: 'Overview', items: [
        { path: 'dashboard/taq', label: 'Dashboard' }
      ]},
      { label: 'Hiring Orchestration', items: [
        { path: 'taq/mfr', label: 'MFR Intake' },
        { path: 'taq/candidate-routing', label: 'Route Profiles to Manager', badge: 'pendingCandidateRouting' },
        { path: 'taq/pipeline', label: 'End-to-End Pipeline View' }
      ]},
      { label: 'Invoice Management', items: [
        { path: 'invoices/register', label: 'Invoice Register' },
        { path: 'invoices/ta-approval', label: 'Invoice Approvals (TA)', badge: 'pendingTaInvoiceApproval' },
        { path: 'invoices/batches', label: 'Invoice Payment Batches' }
      ]},
      { label: 'Master Data', items: [
        { path: 'positions/list', label: 'Open Positions' },
        { path: 'vendors/list', label: 'Vendors' },
        { path: 'projects/list', label: 'Projects' },
        { path: 'import/upload', label: 'Data Import' }
      ]},
      { label: 'System Admin', items: [
        { path: 'admin/users', label: 'User Management' },
        { path: 'admin/roles', label: 'Roles & Permissions' },
        { path: 'admin/config', label: 'Configuration' },
        { path: 'admin/super', label: 'Super Admin Panel' },
        { path: 'admin/audit', label: 'Audit Log' },
        { path: 'admin/notifications', label: 'Notifications' },
        { path: 'admin/approvals', label: 'Pending Approvals', badge: 'pendingApprovals' }
      ]},
      { label: 'Reports', items: [
        { path: 'reports/operational', label: 'Operational Reports' },
        { path: 'dashboard/leadership', label: 'Leadership Dashboard' }
      ]}
    ],
    footer: [
      { path: 'profile', label: 'My Profile' }
    ]
  },
  hr: {
    label: 'HR Operations', userId: 'u2', dashboard: 'dashboard/hr',
    sections: [
      { label: 'Overview', items: [
        { path: 'dashboard/hr', label: 'Dashboard' }
      ]},
      { label: 'Vendor Management', items: [
        { path: 'vendors/list', label: 'Vendors' }
      ]},
      { label: 'Hiring Operations', items: [
        { path: 'hr/candidates', label: 'Candidate Pipeline', badge: 'pendingHrCandidates' }
      ]},
      { label: 'Contractor Lifecycle', items: [
        { path: 'contractors/list', label: 'Contractor Records' },
        { path: 'contractors/onboarding', label: 'Onboarding & Exit' },
        { path: 'hr/performance-concerns', label: 'Performance Concerns', badge: 'pendingConcerns' }
      ]},
      { label: 'Timesheets & Invoices', items: [
        { path: 'timesheets/review', label: 'Timesheets', badge: 'pendingHrTimesheets' },
        { path: 'invoices/register', label: 'Invoice Register', badge: 'pendingSowValidation' }
      ]},
      { label: 'Leave & Assignments', items: [
        { path: 'leave/management', label: 'Leave & Holidays' },
        { path: 'assignments/list', label: 'Assignments' }
      ]},
      { label: 'Compliance & Data', items: [
        { path: 'admin/approvals', label: 'Pending Approvals', badge: 'pendingApprovals' },
        { path: 'import/upload', label: 'Data Import' },
        { path: 'reports/anomalies', label: 'Anomaly Report' },
        { path: 'admin/audit', label: 'Audit Log' }
      ]}
    ],
    footer: [
      { path: 'profile', label: 'My Profile' }
    ]
  },
  finance: {
    label: 'Finance', userId: 'u3', dashboard: 'dashboard/finance',
    sections: [
      { label: 'Overview', items: [
        { path: 'dashboard/finance', label: 'Dashboard' }
      ]},
      { label: 'Rates & Billing', items: [
        { path: 'rates/register', label: 'Rate Register' },
        { path: 'finance/rate-cards', label: 'Rate Card Management' }
      ]},
      { label: 'Timesheets & Payment', items: [
        { path: 'finance/timesheet-review', label: 'Timesheet Review (Final Check)' },
        { path: 'finance/batches', label: 'Timesheet Payment Batches' }
      ]},
      { label: 'Invoice Management', items: [
        { path: 'invoices/register', label: 'Invoice Register' },
        { path: 'invoices/batches', label: 'Invoice Payment Batches' },
        { path: 'finance/invoice-approval', label: 'Invoice Processing', badge: 'pendingInvoiceApprovals' }
      ]},
      { label: 'Reports & Controls', items: [
        { path: 'finance/reports', label: 'Financial Reports' },
        { path: 'reports/anomalies', label: 'Anomaly Report' },
        { path: 'reports/operational', label: 'Operational Reports' },
        { path: 'admin/approvals', label: 'Pending Approvals', badge: 'pendingApprovals' },
        { path: 'admin/audit', label: 'Audit Log' }
      ]}
    ],
    footer: [
      { path: 'profile', label: 'My Profile' }
    ]
  },
  manager: {
    label: "Contractor's Manager", userId: 'u4', dashboard: 'dashboard/manager',
    sections: [
      { label: 'Overview', items: [
        { path: 'dashboard/manager', label: 'Dashboard' }
      ]},
      { label: 'Team Approvals', items: [
        { path: 'manager/timesheets', label: 'Timesheet Confirmation', badge: 'pendingTimesheets' },
        { path: 'manager/leave', label: 'Leave Approval', badge: 'pendingLeave' },
        { path: 'manager/candidate-review', label: 'Candidate Profile Review', badge: 'pendingCandidateReview' },
        { path: 'admin/approvals', label: 'Pending Approvals', badge: 'pendingApprovals' }
      ]},
      { label: 'Hiring & Team', items: [
        { path: 'manager/mfr', label: 'Manpower Request (MFR)' },
        { path: 'contractors/list', label: 'My Contractors' },
        { path: 'manager/performance', label: 'Performance', badge: 'myOpenConcerns' }
      ]},
      { label: 'Assignments', items: [
        { path: 'assignments/list', label: 'Assignments' }
      ]}
    ],
    footer: [
      { path: 'profile', label: 'My Profile' }
    ]
  },
  contractor: {
    label: 'Contractor', userId: 'c1', dashboard: 'dashboard/contractor',
    sections: [
      { label: 'My Portal', items: [
        { path: 'dashboard/contractor', label: 'Home' },
        { path: 'contractor/timesheet', label: 'Timesheet Confirmation' },
        { path: 'contractor/documents', label: 'Upload Documents', badge: 'pendingDocs' },
        { path: 'contractor/leave', label: 'Request Leave' }
      ]}
    ],
    footer: [
      { path: 'profile', label: 'My Profile' }
    ]
  },
  vendor: {
    label: 'Vendor Side Manager', userId: 'vm1', vendorId: 'v1', dashboard: 'dashboard/vendor',
    sections: [
      { label: 'Overview', items: [
        { path: 'dashboard/vendor', label: 'Dashboard' }
      ]},
      { label: 'Hiring & Resources', items: [
        { path: 'vendor/job-orders', label: 'Job Orders & Demands', badge: 'pendingJobOrders' }
      ]},
      { label: 'Contractor Management', items: [
        { path: 'vendor/contractors', label: 'My Contractors' },
        { path: 'vendor/onboarding', label: 'Onboarding / Offboarding' },
        { path: 'vendor/sow-compliance', label: 'SOW Compliance' }
      ]},
      { label: 'Invoicing & Payments', items: [
        { path: 'invoices/register', label: 'My Invoices' },
        { path: 'vendor/invoices', label: 'Payment Approval', badge: 'pendingVendorInvoices' }
      ]},
      { label: 'Reporting', items: [
        { path: 'vendor/performance', label: 'Performance & Deliverables' },
        { path: 'vendor/reports', label: 'Vendor Reports' }
      ]}
    ],
    footer: [
      { path: 'profile', label: 'My Profile' }
    ]
  }
};

/** Simple line icons for sidebar section headers and top-level items */
const NAV_ICONS = {
  overview: '<circle cx="12" cy="12" r="3"/><path d="M3 12h3m12 0h3M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  hiring: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
  invoice: '<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v3h3"/><path d="M9 12h6M9 16h6"/>',
  master: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  admin: '<circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4l1.4-1.4"/>',
  reports: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 15v-4M12 15V8M16 15v-6"/>',
  vendor: '<path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-6h6v6"/>',
  contractor: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/>',
  timesheet: '<circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/>',
  leave: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
  compliance: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  rates: '<path d="M12 3v18"/><path d="M16.5 7.5c-.8-1.3-2-2-4.5-2-2.8 0-4.5 1.3-4.5 3.2S9.5 12 12 12s4.5 1.2 4.5 3.3S14.2 18.5 12 18.5c-2.3 0-3.6-.8-4.4-2"/>',
  documents: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 12h5M10 16h5"/>',
  team: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 19c1.2-3 3.2-4.5 5.5-4.5S13.3 16 14.5 19"/><path d="M14 14.5c1.4-.7 2.8-.7 4.2.2 1.2.8 2 2.2 2.3 4.3"/>',
  assignment: '<path d="M8 6h11M8 12h11M8 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
  portal: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/>',
  profile: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/>',
  default: '<circle cx="12" cy="12" r="3"/>'
};

const NAV_ICON_BY_LABEL = {
  'Overview': 'overview',
  'Hiring Orchestration': 'hiring',
  'Invoice Management': 'invoice',
  'Master Data': 'master',
  'System Admin': 'admin',
  'Reports': 'reports',
  'Vendor Management': 'vendor',
  'Hiring Operations': 'hiring',
  'Contractor Lifecycle': 'contractor',
  'Timesheets & Invoices': 'timesheet',
  'Leave & Assignments': 'leave',
  'Compliance & Data': 'compliance',
  'Rates & Billing': 'rates',
  'Timesheets & Payment': 'timesheet',
  'Reports & Controls': 'reports',
  'Team Approvals': 'team',
  'Hiring & Team': 'hiring',
  'Assignments': 'assignment',
  'My Portal': 'portal',
  'Hiring & Resources': 'hiring',
  'Contractor Management': 'contractor',
  'Invoicing & Payments': 'invoice',
  'Reporting': 'reports',
  'Document Repository': 'documents',
  'Dashboard': 'overview',
  'Home': 'portal',
  'My Profile': 'profile',
  'System Diagram ↗': 'reports'
};

function navIconMarkup(label) {
  const key = NAV_ICON_BY_LABEL[label] || 'default';
  const paths = NAV_ICONS[key] || NAV_ICONS.default;
  return `<span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${paths}</svg></span>`;
}

/** Badge counts shown on sidebar items per role */
const NAV_BADGES = {
  pendingApprovals: () => VMP.getPendingApprovals(VMP.currentRole).length,
  pendingTimesheets: () => VMP_DATA.timesheets.filter(t => t.contractor_confirmation_status === 'Pending').length,
  pendingLeave: () => VMP_DATA.leaveRecords.filter(l => l.leave_status === 'Pending').length,
  pendingDocs: () => VMP_DATA.documents.filter(d => d.entity_id === 'c1' && (d.status === 'Pending Upload' || d.status === 'Rejected')).length,
  pendingJobOrders: () => {
    const vid = VMP.getCurrentVendorId();
    if (!vid) return 0;
    return VMP_DATA.jobOrders.filter(j => j.vendor_id === vid && j.response_status === 'Pending Response').length;
  },
  pendingVendorInvoices: () => {
    const vid = VMP.getCurrentVendorId();
    if (!vid) return 0;
    return VMP_DATA.invoices.filter(i => i.vendor_id === vid && i.vendor_approval_status === 'Pending' && i.reconciliation_status !== 'Blocked').length;
  },
  pendingCandidateRouting: () => VMP_DATA.candidates.filter(c => c.stage === 'Submitted').length,
  pendingCandidateReview: () => VMP_DATA.candidates.filter(c => c.stage === 'Forwarded to Manager').length,
  pendingInterviews: () => VMP_DATA.candidates.filter(c => c.stage === 'Manager Selected').length,
  pendingHrCandidates: () => VMP_DATA.candidates.filter(c => ['Manager Selected', 'Interview Scheduled', 'Interview Complete', 'Offer Sent'].includes(c.stage)).length,
  pendingConcerns: () => (VMP_DATA.performanceConcerns || []).filter(p => p.status === 'Under Investigation' || p.status === 'Flagged').length,
  myOpenConcerns: () => (VMP_DATA.performanceConcerns || []).filter(p => p.manager_id === 'u4' && (p.status === 'Under Investigation' || p.status === 'Flagged')).length,
  pendingInvoiceApprovals: () => VMP_DATA.invoices.filter(i => i.approval_stage && i.approval_stage !== 'Approved & Eligible for Payment' && i.reconciliation_status !== 'Blocked').length,
  pendingSowValidation: () => VMP_DATA.invoices.filter(i => i.sow_validation_status === 'Pending').length,
  pendingTaInvoiceApproval: () => VMP_DATA.invoices.filter(i =>
    i.ta_approval_status === 'Pending' && i.sow_validation_status === 'Validated' && i.invoice_stage !== 'Disputed'
  ).length,
  pendingHrTimesheets: () => VMP_DATA.timesheets.filter(t => t.manager_approval_status === 'Supervisor Approved' && t.hr_approval_status !== 'HR Approved').length
};

/** Screens reachable from within parent pages (buttons, row actions, sub-nav tabs)
    rather than from the sidebar. Maps child path -> parent sidebar item. */
const NAV_PARENT = {
  'vendors/register': 'vendors/list',
  'vendors/compliance': 'vendors/list',
  'vendors/detail': 'vendors/list',
  'contractors/create': 'contractors/list',
  'contractors/profile': 'contractors/list',
  'contractors/deboarding': 'contractors/onboarding',
  'bgv/tracker': 'contractors/onboarding',
  'positions/create': 'positions/list',
  'rates/create': 'rates/register',
  'rates/history': 'rates/register',
  'assignments/transfer': 'assignments/list',
  'invoices/raise': 'invoices/register',
  'invoices/validation': 'invoices/register',
  'invoices/detail': 'invoices/register',
  'timesheets/upload': 'timesheets/review',
  'leave/holidays': 'leave/management',
  'hr/interviews': 'hr/candidates',
  'manager/performance-flag': 'manager/performance',
  'finance/invoice-payment': 'finance/invoice-approval',
  'finance/invoice-reconcile': 'finance/invoice-approval',
  'import/errors': 'import/upload',
  'finance/batch-detail': 'finance/batches',
  'finance/rate-card-detail': 'finance/rate-cards',
  'vendor/candidates': 'vendor/job-orders',
  'taq/job-orders': 'taq/mfr'
};

function getRoleNavPaths(role) {
  const nav = NAV_CONFIG[role];
  if (!nav) return [];
  const paths = [];
  nav.sections.forEach(s => s.items.forEach(i => paths.push(i.path)));
  (nav.footer || []).forEach(i => paths.push(i.path));
  // Child screens stay accessible when their parent is in the role's sidebar
  Object.keys(NAV_PARENT).forEach(child => {
    if (paths.includes(NAV_PARENT[child])) paths.push(child);
  });
  // Document Repository is a top-level entry for every role
  paths.push('shared/documents');
  paths.push('profile', 'contractors/profile', 'vendors/detail', 'finance/batch-detail', 'finance/rate-card-detail', 'finance/invoice-reconcile', 'finance/invoice-approval', 'finance/invoices', 'finance/invoice-upload', 'admin/approval-detail', 'rates/history', 'invoices/detail');
  return paths;
}

function canAccessPath(path, role) {
  const clean = path.includes('?') ? path.slice(0, path.indexOf('?')) : path;
  const allowed = getRoleNavPaths(role);
  if (allowed.includes(clean)) return true;
  // TAQ super admin can access everything
  if (role === 'taq') return true;
  // Allow profile for all
  if (clean === 'profile') return true;
  return false;
}

const SCREEN_TITLES = {
  'dashboard/taq': 'TAQ Dashboard', 'dashboard/main': 'Role-Based Dashboard', 'dashboard/hr': 'HR Ops Dashboard',
  'dashboard/finance': 'Finance Dashboard', 'dashboard/manager': "Manager Dashboard", 'dashboard/contractor': 'Contractor Portal',
  'dashboard/vendor': 'Vendor Portal', 'dashboard/leadership': 'Leadership Dashboard',
  'admin/users': 'User Management', 'admin/roles': 'Roles & Permissions', 'admin/config': 'Master Configuration',
  'admin/super': 'Super Admin Panel', 'admin/approvals': 'Pending Approvals', 'admin/audit': 'Audit Log Viewer',
  'admin/notifications': 'Notification Templates & Log', 'profile': 'My Profile',
  'vendors/list': 'Vendor List', 'vendors/register': 'Vendor Registration', 'vendors/compliance': 'Compliance Documents',
  'vendors/detail': 'Vendor Detail', 'projects/list': 'Project Master List',
  'positions/list': 'Open Positions', 'positions/create': 'Create Position',
  'contractors/list': 'Contractor List', 'contractors/create': 'Create Contractor', 'contractors/profile': 'Contractor Profile',
  'contractors/onboarding': 'Onboarding Pipeline', 'contractors/deboarding': 'Deboarding / Exit',
  'assignments/list': 'Assignment List', 'assignments/transfer': 'Assignment Transfer',
  'rates/register': 'Rate Register', 'rates/create': 'Create / Revise Rate', 'rates/history': 'Rate History',
  'bgv/tracker': 'BGV Tracker', 'timesheets/upload': 'Timesheet Upload', 'timesheets/review': 'Timesheet Review',
  'leave/management': 'Leave Management', 'leave/holidays': 'Holiday Calendar',
  'finance/batches': 'Finance Batch List', 'finance/batch-detail': 'Finance Batch Detail',
  'finance/invoices': 'Invoice Management', 'finance/invoice-upload': 'Invoice Upload',
  'finance/invoice-reconcile': 'Invoice Reconciliation', 'finance/rate-cards': 'Rate Card Management',
  'finance/rate-card-detail': 'Rate Card Detail', 'finance/reports': 'Financial Reports',
  'admin/approval-detail': 'Approval Detail', 'reports/anomalies': 'Reporting Anomaly Report',
  'reports/operational': 'Operational Reports', 'import/upload': 'Data Import', 'import/errors': 'Import Error Review',
  'taq/mfr': 'MFR Intake', 'taq/job-orders': 'MFR Intake',
  'taq/candidate-routing': 'Route Profiles to Manager', 'taq/pipeline': 'Hiring Orchestration View',
  'hr/candidates': 'HR Candidate Pipeline', 'hr/interviews': 'Interview Scheduling',
  'manager/candidate-review': 'Candidate Profile Review',
  'manager/timesheets': 'Timesheet Confirmation', 'manager/leave': 'Leave Approval',
  'manager/mfr': 'Manpower Request', 'manager/performance': 'Quarterly Performance Rating',
  'manager/performance-flag': 'Flag Performance Concern', 'hr/performance-concerns': 'Performance Concern & Work Verification',
  'finance/invoice-approval': 'Invoice Finance Processing', 'finance/invoice-payment': 'Invoice Payment & Settlement',
  'finance/timesheet-review': 'Timesheet Review (Final Check)',
  'invoices/register': 'Invoice Register', 'invoices/detail': 'Invoice Detail', 'invoices/batches': 'Invoice Payment Batches',
  'invoices/validation': 'Invoices Awaiting SOW Validation', 'invoices/ta-approval': 'Invoice Approvals (TA)', 'invoices/raise': 'Raise Invoice',
  'contractor/timesheet': 'Timesheet Confirmation', 'contractor/documents': 'Document Upload', 'contractor/leave': 'Leave Request',
  'vendor/job-orders': 'Job Orders & Demands', 'vendor/candidates': 'Job Orders & Demands', 'vendor/contractors': 'My Contractors',
  'vendor/onboarding': 'Onboarding / Offboarding', 'vendor/sow-compliance': 'SOW Compliance', 'vendor/invoices': 'Payment Approval',
  'vendor/performance': 'Performance & Deliverables', 'vendor/reports': 'Vendor Reports',
  'shared/documents': 'Document Repository', 'shared/agreements': 'Digital Agreements'
};

const Router = {
  init() {
    window.addEventListener('hashchange', () => this.navigate());
    this.bindGlobalEvents();
  },

  getPath() {
    const hash = location.hash.slice(1) || NAV_CONFIG[VMP.currentRole]?.dashboard || 'dashboard/main';
    return hash.startsWith('/') ? hash.slice(1) : hash;
  },

  navigate() {
    let path = this.getPath();
    const qIdx = path.indexOf('?');
    if (qIdx !== -1) path = path.slice(0, qIdx);

    // Redirect if current role cannot access this screen
    if (!canAccessPath(path, VMP.currentRole)) {
      const fallback = NAV_CONFIG[VMP.currentRole]?.dashboard || 'dashboard/main';
      location.hash = fallback;
      return;
    }

    const screenKey = path.replace(/\//g, '-');
    let html = '';
    if (Screens[screenKey]) {
      html = Screens[screenKey]();
    } else if (Screens['not-found']) {
      html = Screens['not-found']();
    }

    const content = document.getElementById('screen-content');
    if (content) {
      content.innerHTML = `<div class="screen-wrap">${html}</div>`;
      this.updateTopbar(path);
      this.highlightNav(path);
      this.bindScreenEvents();
    }
  },

  renderNavItem(item, extraClass = '') {
    let badge = '';
    if (item.badge && NAV_BADGES[item.badge]) {
      const count = NAV_BADGES[item.badge]();
      if (count > 0) badge = `<span class="nav-badge">${count}</span>`;
    }
    const icon = extraClass.includes('nav-item-top') || item.icon
      ? navIconMarkup(item.label)
      : '';
    return `<a class="nav-item${extraClass ? ' ' + extraClass : ''}" href="#${item.path}" data-path="${item.path}">${icon}<span class="nav-item-label">${item.label}</span>${badge}</a>`;
  },

  /** Per-role set of expanded sidebar section indices (survives sidebar re-renders) */
  openSections: {},

  /** Index of the section containing the given path (follows NAV_PARENT for child screens) */
  sectionIndexForPath(role, path) {
    const nav = NAV_CONFIG[role];
    if (!nav) return -1;
    const clean = path.includes('?') ? path.slice(0, path.indexOf('?')) : path;
    const target = NAV_PARENT[clean] || clean;
    return nav.sections.findIndex(s => s.items.some(i => i.path === clean || i.path === target));
  },

  renderSidebar() {
    const role = VMP.currentRole;
    const nav = NAV_CONFIG[role];
    if (!nav) return;

    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.className = `sidebar role-${role}`;

    const roleLabel = document.getElementById('sidebar-role-label');
    if (roleLabel) roleLabel.textContent = nav.label;

    // First render for this role: expand only the section holding the current screen
    if (!this.openSections[role]) {
      const activeIdx = this.sectionIndexForPath(role, this.getPath());
      this.openSections[role] = new Set([activeIdx >= 0 ? activeIdx : 0]);
    }
    const open = this.openSections[role];

    const el = document.getElementById('sidebar-nav');
    if (el) {
      el.innerHTML = nav.sections.map((s, idx) => {
        // Single-item sections flatten to a direct top-level link (no header/dropdown)
        if (s.items.length === 1) return this.renderNavItem(s.items[0], 'nav-item-top');

        const isOpen = open.has(idx);
        // Roll pending counts up onto the collapsed header so work isn't hidden
        let headerBadge = '';
        if (!isOpen) {
          const sum = s.items.reduce((n, i) => n + (i.badge && NAV_BADGES[i.badge] ? NAV_BADGES[i.badge]() : 0), 0);
          if (sum > 0) headerBadge = `<span class="nav-badge">${sum}</span>`;
        }
        return `<div class="nav-section nav-section-toggle ${isOpen ? 'open' : ''}" data-section="${idx}" role="button" tabindex="0">
            ${navIconMarkup(s.label)}<span class="nav-section-label">${s.label}</span>${headerBadge}<span class="nav-caret">▸</span>
          </div>
          <div class="nav-section-items ${isOpen ? 'open' : ''}" data-section-items="${idx}">${s.items.map(i => this.renderNavItem(i)).join('')}</div>`;
      }).join('')
      // Document Repository is a top-level heading for every role, always last
      + this.renderNavItem({ path: 'shared/documents', label: 'Document Repository' }, 'nav-item-top');

      el.querySelectorAll('.nav-section-toggle').forEach(h => {
        const toggle = () => {
          const idx = parseInt(h.dataset.section, 10);
          if (open.has(idx)) open.delete(idx); else open.add(idx);
          this.renderSidebar();
          // Re-apply highlight without auto-expanding (user may be collapsing the active section)
          this.highlightNav(this.getPath(), { autoExpand: false });
        };
        h.addEventListener('click', toggle);
        h.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });
      });
    }

    const footer = document.getElementById('sidebar-footer');
    if (footer && nav.footer) {
      footer.innerHTML = nav.footer.map(i => this.renderNavItem(i, 'nav-item-top')).join('') +
        `<a class="nav-item nav-item-top" href="system-diagram.html" target="_blank">${navIconMarkup('System Diagram ↗')}<span class="nav-item-label">System Diagram</span></a>`;
    }
  },

  updateTopbar(path) {
    const qIdx = path.indexOf('?');
    const cleanPath = qIdx !== -1 ? path.slice(0, qIdx) : path;
    const title = SCREEN_TITLES[cleanPath] || cleanPath;
    const h2 = document.querySelector('.topbar-left h2');
    if (h2) h2.textContent = title;
    if (typeof NotifUI !== 'undefined') NotifUI.refresh();
    else VMP.updateNotifBadge();
  },

  highlightNav(path, { autoExpand = true } = {}) {
    const qIdx = path.indexOf('?');
    let cleanPath = qIdx !== -1 ? path.slice(0, qIdx) : path;

    // Auto-expand the section containing the screen we landed on
    const role = VMP.currentRole;
    if (autoExpand) {
      const secIdx = this.sectionIndexForPath(role, cleanPath);
      if (secIdx >= 0 && this.openSections[role] && !this.openSections[role].has(secIdx)) {
        this.openSections[role].add(secIdx);
        this.renderSidebar();
      }
    }

    const items = document.querySelectorAll('#sidebar-nav .nav-item, #sidebar-footer .nav-item');
    // On child screens (forms, tabs) keep the parent sidebar item highlighted
    const hasExact = Array.from(items).some(n => n.dataset.path === cleanPath);
    if (!hasExact && NAV_PARENT[cleanPath]) cleanPath = NAV_PARENT[cleanPath];
    items.forEach(n => {
      n.classList.toggle('active', n.dataset.path === cleanPath);
    });
  },

  bindGlobalEvents() {
    // Role switching handled in app.js
  },

  bindScreenEvents() {
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const target = el.dataset.nav;
        if (target.startsWith('contractor/') || target.startsWith('contractors/'))
          location.hash = 'contractors/profile?id=' + target.split('/')[1];
        else if (target.startsWith('vendor/'))
          location.hash = 'vendors/detail?id=' + target.split('/')[1];
        else
          location.hash = target;
      });
    });

    document.querySelectorAll('[data-action="approve"]').forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.id;
        const type = btn.dataset.type;
        if (MockActions.approve(id, type) !== false) {
          VMP.showToast(type ? type + ' approved' : 'Approved successfully');
          MockActions.refresh();
        }
      });
    });

    document.querySelectorAll('[data-action="reject"]').forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.id;
        const type = btn.dataset.type;
        const reason = window.prompt('Add a note explaining the rejection (optional):', '');
        if (reason === null) return; // cancelled
        MockActions.reject(id, type, reason);
        VMP.showToast((type ? type + ' rejected' : 'Rejected') + (reason ? ' — note recorded' : ''));
        MockActions.refresh();
      });
    });

    document.querySelectorAll('[data-action="resolve-concern"]').forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        MockActions.resolveConcern(btn.dataset.id, btn.dataset.outcome);
      });
    });

    document.querySelectorAll('[data-action="advance-invoice"]').forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        MockActions.advanceInvoice(btn.dataset.id);
      });
    });

    document.querySelectorAll('[data-action="advance-settlement"]').forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        MockActions.advanceSettlement(btn.dataset.id);
      });
    });

    // Generic id-based mock actions (invoice module, timesheets, leave, docs, SOW)
    const simpleActions = {
      'validate-sow': (btn) => MockActions.validateSow(btn.dataset.id),
      'dispute-invoice': (btn) => MockActions.disputeInvoice(btn.dataset.id),
      'ta-approve-invoice': (btn) => MockActions.taApproveInvoice(btn.dataset.id),
      'process-invoice': (btn) => MockActions.processInvoice(btn.dataset.id),
      'supervisor-approve-ts': (btn) => MockActions.supervisorApproveTimesheet(btn.dataset.id),
      'hr-approve-ts': (btn) => MockActions.hrApproveTimesheet(btn.dataset.id),
      'cancel-leave': (btn) => MockActions.cancelLeave(btn.dataset.id),
      'send-doc-reminder': (btn) => MockActions.sendDocReminder(btn.dataset.id),
      'reupload-doc': (btn) => MockActions.reuploadDoc(btn.dataset.id),
      'track-enddate': (btn) => MockActions.trackEndDate(btn.dataset.id),
      'renew-sow': (btn) => MockActions.renewSow(btn.dataset.id),
      'start-exit-sow': (btn) => MockActions.startExitSow(btn.dataset.id),
      'repo-add-doc': () => MockActions.addRepoDocument(),
      'open-doc': (btn) => VMP.showToast('Opening document: ' + (btn.dataset.id || 'document'), { silent: true })
    };
    Object.keys(simpleActions).forEach(action => {
      document.querySelectorAll(`[data-action="${action}"]`).forEach(btn => {
        btn.type = 'button';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          simpleActions[action](btn);
        });
      });
    });

    document.querySelectorAll('[data-action="forward-candidate"]').forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        MockActions.forwardCandidate(btn.dataset.id, btn.dataset.manager);
      });
    });

    document.querySelectorAll('[data-action="select-candidate"]').forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        MockActions.selectCandidate(btn.dataset.id);
      });
    });

    document.querySelectorAll('[data-action="reject-candidate"]').forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        MockActions.rejectCandidate(btn.dataset.id);
      });
    });

    document.querySelectorAll('[data-action="open-schedule"]').forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        location.hash = 'hr/interviews?candidate=' + btn.dataset.id;
      });
    });

    document.querySelectorAll('[data-action="confirm-schedule"]').forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const candidateId = btn.dataset.candidate || Router.getQueryParam('candidate');
        if (!candidateId) {
          VMP.showToast('Select a candidate to schedule', { silent: true });
          return;
        }
        MockActions.scheduleInterview(candidateId, MockActions.readForm(btn));
      });
    });

    document.querySelectorAll('.stat-card[data-nav]').forEach(c => {
      c.style.cursor = 'pointer';
      c.addEventListener('click', () => location.hash = c.dataset.nav);
    });

    document.querySelectorAll('.tabs-container').forEach(container => {
      container.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const idx = tab.dataset.tab;
          container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
          tab.classList.add('active');
          container.querySelector(`.tab-panel[data-panel="${idx}"]`)?.classList.add('active');
        });
      });
    });

    document.querySelectorAll('.stepper-interactive').forEach(stepper => {
      const flowId = stepper.dataset.flow;
      const panels = document.querySelector(`.process-flow-panels[data-flow="${flowId}"]`);
      if (!panels) return;

      const goToStep = (idx) => {
        stepper.querySelectorAll('.step').forEach((step, i) => {
          const locked = step.classList.contains('step-locked');
          step.classList.remove('done', 'current', 'pending');
          if (i < idx) step.classList.add('done');
          else if (i === idx) step.classList.add('current');
          else step.classList.add('pending');
          if (locked) step.classList.add('step-locked');
          const circle = step.querySelector('.step-circle');
          if (circle) circle.textContent = i < idx ? '✓' : String(i + 1);
        });
        panels.querySelectorAll('.process-flow-panel').forEach((p, i) => {
          p.classList.toggle('active', i === idx);
        });
      };

      stepper.querySelectorAll('.step[data-step]').forEach(step => {
        const idx = parseInt(step.dataset.step, 10);
        step.addEventListener('click', () => goToStep(idx));
        step.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goToStep(idx);
          }
        });
      });
    });

    document.querySelectorAll('[data-action="switch-role"]').forEach(btn => {
      btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const role = btn.dataset.role;
        if (role && typeof applyRole === 'function') applyRole(role);
      });
    });

    const openPostToVendorModal = () => {
      const overlay = document.getElementById('post-to-vendor-modal');
      const body = document.getElementById('post-to-vendor-modal-body');
      if (!overlay || !body) return;
      body.innerHTML = SH.renderPostToVendorModalBody();
      const title = overlay.querySelector('.modal-header h3');
      if (title) title.textContent = 'Post Positions to Vendors';
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';

      body.querySelectorAll('.form-actions button').forEach(btn => {
        const label = btn.textContent.trim();
        const handler = MockActions.handlers['taq/mfr']?.[label];
        if (!handler) return;
        btn.type = 'button';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handler(btn);
        });
      });
    };

    const openSubmitCandidateModal = (jobId) => {
      const overlay = document.getElementById('submit-candidate-modal');
      const body = document.getElementById('submit-candidate-modal-body');
      if (!overlay || !body || !jobId) return;
      body.innerHTML = SH.renderSubmitCandidateModalBody(jobId);
      const title = overlay.querySelector('.modal-header h3');
      const jo = VMP_DATA.jobOrders.find(j => j.id === jobId);
      const op = VMP_DATA.openPositions.find(o => o.id === jo?.open_position_id);
      if (title) title.textContent = `Submit Candidates — ${jobId}${op ? ' · ' + op.position_title : ''}`;
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';

      body.querySelectorAll('.form-actions button').forEach(btn => {
        const label = btn.textContent.trim();
        const handler = MockActions.handlers['vendor/job-orders']?.[label];
        if (!handler) return;
        btn.type = 'button';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handler(btn);
        });
      });
    };

    const closeModal = (overlay) => {
      if (!overlay) return;
      overlay.hidden = true;
      if (!document.querySelector('.modal-overlay:not([hidden])')) {
        document.body.style.overflow = '';
      }
    };

    document.querySelectorAll('[data-action="open-submit-candidate"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openSubmitCandidateModal(btn.dataset.job);
      });
    });

    document.querySelectorAll('[data-action="open-post-to-vendor"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openPostToVendorModal();
      });
    });

    document.querySelectorAll('[data-action="close-modal"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeModal(btn.closest('.modal-overlay'));
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay);
      });
    });

    const autoOpen = document.querySelector('[data-auto-open-submit]');
    if (autoOpen?.dataset.autoOpenSubmit) {
      openSubmitCandidateModal(autoOpen.dataset.autoOpenSubmit);
    }

    if (document.querySelector('[data-auto-open-post-vendor]')) {
      openPostToVendorModal();
    }

    document.querySelectorAll('.entity-link[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        location.hash = el.dataset.nav;
      });
    });

    document.querySelectorAll('tr[data-nav]').forEach(row => {
      row.style.cursor = 'pointer';
      row.addEventListener('click', (e) => {
        if (e.target.closest('button, a, .btn')) return;
        location.hash = row.dataset.nav;
      });
    });

    MockActions.bindScreen();
  },

  getQueryParam(key) {
    const hash = location.hash.slice(1);
    const q = hash.indexOf('?');
    if (q === -1) return null;
    const params = new URLSearchParams(hash.slice(q + 1));
    return params.get(key);
  },

  go(path) {
    location.hash = path;
  }
};
