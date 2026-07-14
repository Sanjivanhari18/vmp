/** VMP Router — hash-based navigation and role-based nav */
const NAV_CONFIG = {
  taq: {
    label: 'TAQ Orchestrator / System Admin', userId: 'u1', dashboard: 'dashboard/taq',
    sections: [
      { label: 'Overview', items: [
        { path: 'dashboard/taq', label: 'Orchestration Dashboard' }
      ]},
      { label: 'Hiring Orchestration', items: [
        { path: 'taq/mfr', label: 'MFR Intake' },
        { path: 'taq/job-orders', label: 'Post Positions to Vendors' },
        { path: 'taq/candidate-routing', label: 'Route Profiles to Manager', badge: 'pendingCandidateRouting' },
        { path: 'taq/pipeline', label: 'End-to-End Pipeline View' }
      ]},
      { label: 'Invoice Management', items: [
        { path: 'invoices/register', label: 'Invoice Register' },
        { path: 'invoices/ta-approval', label: 'Invoice Approvals (TA)', badge: 'pendingTaInvoiceApproval' },
        { path: 'invoices/batches', label: 'Payment Batches' }
      ]},
      { label: 'Master Data', items: [
        { path: 'positions/list', label: 'Open Positions' },
        { path: 'positions/create', label: 'Create Position' },
        { path: 'vendors/list', label: 'Vendors' },
        { path: 'projects/list', label: 'Projects' },
        { path: 'import/upload', label: 'Data Import' }
      ]},
      { label: 'Documents', items: [
        { path: 'shared/documents', label: 'Document Repository' }
      ]},
      { label: 'System Admin', items: [
        { path: 'admin/users', label: 'User Management' },
        { path: 'admin/roles', label: 'Roles & Permissions' },
        { path: 'admin/config', label: 'Configuration' },
        { path: 'admin/super', label: 'Super Admin Panel' },
        { path: 'admin/audit', label: 'Audit Log' },
        { path: 'admin/notifications', label: 'Notifications' },
        { path: 'admin/approvals', label: 'Pending Approvals', badge: 'pendingApprovals' },
        { path: 'reports/operational', label: 'Operational Reports' },
        { path: 'dashboard/leadership', label: 'Leadership Dashboard' }
      ]}
    ],
    footer: [
      { path: 'profile', label: 'My Profile' },
      { path: 'system-diagram', label: 'System Diagram' }
    ]
  },
  hr: {
    label: 'HR Operations', userId: 'u2', dashboard: 'dashboard/hr',
    sections: [
      { label: 'Overview', items: [
        { path: 'dashboard/hr', label: 'HR Dashboard' }
      ]},
      { label: 'Vendor Management', items: [
        { path: 'vendors/list', label: 'Vendor List' },
        { path: 'vendors/register', label: 'Vendor Registration' },
        { path: 'vendors/compliance', label: 'Compliance Documents' }
      ]},
      { label: 'Hiring Operations', items: [
        { path: 'hr/candidates', label: 'Candidate Pipeline', badge: 'pendingHrCandidates' },
        { path: 'hr/interviews', label: 'Interview Scheduling', badge: 'pendingInterviews' }
      ]},
      { label: 'Contractor Lifecycle', items: [
        { path: 'contractors/list', label: 'Contractor Records' },
        { path: 'contractors/create', label: 'New Contractor' },
        { path: 'contractors/onboarding', label: 'Onboarding Pipeline' },
        { path: 'contractors/deboarding', label: 'Deboarding / Exit' },
        { path: 'bgv/tracker', label: 'BGV Tracker' },
        { path: 'hr/performance-concerns', label: 'Performance Concerns', badge: 'pendingConcerns' }
      ]},
      { label: 'Timesheets & Invoices', items: [
        { path: 'timesheets/upload', label: 'Timesheet Upload' },
        { path: 'timesheets/review', label: 'Timesheet Review & Approval', badge: 'pendingHrTimesheets' },
        { path: 'invoices/validation', label: 'Invoices Awaiting SOW Validation', badge: 'pendingSowValidation' },
        { path: 'invoices/register', label: 'Invoice Register' }
      ]},
      { label: 'Leave & Assignments', items: [
        { path: 'leave/management', label: 'Leave Management' },
        { path: 'leave/holidays', label: 'Holiday Calendar' },
        { path: 'assignments/list', label: 'Assignments' },
        { path: 'assignments/transfer', label: 'Assignment Transfer' }
      ]},
      { label: 'Compliance & Data', items: [
        { path: 'admin/approvals', label: 'Pending Approvals', badge: 'pendingApprovals' },
        { path: 'import/upload', label: 'Data Import' },
        { path: 'reports/anomalies', label: 'Anomaly Report' },
        { path: 'admin/audit', label: 'Audit Log' },
        { path: 'shared/documents', label: 'Document Repository' }
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
        { path: 'dashboard/finance', label: 'Finance Dashboard' }
      ]},
      { label: 'Rates & Billing', items: [
        { path: 'rates/register', label: 'Rate Register' },
        { path: 'rates/create', label: 'Create / Revise Rate' },
        { path: 'finance/rate-cards', label: 'Rate Card Management' }
      ]},
      { label: 'Timesheets & Payment', items: [
        { path: 'finance/timesheet-review', label: 'Timesheet Review (Final Check)' },
        { path: 'finance/batches', label: 'Finance Payment Batches' }
      ]},
      { label: 'Invoice Management', items: [
        { path: 'invoices/register', label: 'Invoice Register' },
        { path: 'invoices/batches', label: 'Payment Batches' },
        { path: 'finance/invoice-reconcile', label: 'Reconciliation Review' },
        { path: 'finance/invoice-approval', label: 'Finance Processing', badge: 'pendingInvoiceApprovals' },
        { path: 'finance/invoice-payment', label: 'Payment & Settlement' }
      ]},
      { label: 'Reports & Controls', items: [
        { path: 'finance/reports', label: 'Financial Reports' },
        { path: 'reports/anomalies', label: 'Anomaly Report' },
        { path: 'reports/operational', label: 'Operational Reports' },
        { path: 'admin/approvals', label: 'Pending Approvals', badge: 'pendingApprovals' },
        { path: 'admin/audit', label: 'Audit Log' },
        { path: 'shared/documents', label: 'Document Repository' }
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
        { path: 'dashboard/manager', label: 'Manager Dashboard' }
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
        { path: 'manager/performance', label: 'Quarterly Performance Ratings' },
        { path: 'manager/performance-flag', label: 'Flag Performance Concern', badge: 'myOpenConcerns' }
      ]},
      { label: 'Assignments', items: [
        { path: 'assignments/list', label: 'View Assignments' },
        { path: 'assignments/transfer', label: 'Assignment Transfer' }
      ]},
      { label: 'Documents', items: [
        { path: 'shared/documents', label: 'Document Repository' }
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
        { path: 'shared/documents', label: 'Document Repository' },
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
        { path: 'dashboard/vendor', label: 'Vendor Dashboard' }
      ]},
      { label: 'Hiring & Resources', items: [
        { path: 'vendor/job-orders', label: 'Job Orders & Demands', badge: 'pendingJobOrders' },
        { path: 'vendor/candidates', label: 'Submit Candidates' }
      ]},
      { label: 'Contractor Management', items: [
        { path: 'vendor/contractors', label: 'My Contractors' },
        { path: 'vendor/onboarding', label: 'Onboarding / Offboarding' },
        { path: 'vendor/sow-compliance', label: 'SOW Compliance' }
      ]},
      { label: 'Invoicing & Payments', items: [
        { path: 'invoices/raise', label: 'Raise Invoice' },
        { path: 'invoices/register', label: 'My Invoices' },
        { path: 'vendor/invoices', label: 'Payment Approval', badge: 'pendingVendorInvoices' }
      ]},
      { label: 'Documents & Reporting', items: [
        { path: 'shared/documents', label: 'Document Repository' },
        { path: 'vendor/performance', label: 'Performance & Deliverables' },
        { path: 'vendor/reports', label: 'Vendor Reports' }
      ]}
    ],
    footer: [
      { path: 'profile', label: 'My Profile' }
    ]
  }
};

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

function getRoleNavPaths(role) {
  const nav = NAV_CONFIG[role];
  if (!nav) return [];
  const paths = [];
  nav.sections.forEach(s => s.items.forEach(i => paths.push(i.path)));
  (nav.footer || []).forEach(i => paths.push(i.path));
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
  'taq/mfr': 'MFR Intake', 'taq/job-orders': 'Post Positions to Vendors',
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
  'vendor/job-orders': 'Job Orders & Demands', 'vendor/candidates': 'Submit Candidates', 'vendor/contractors': 'My Contractors',
  'vendor/onboarding': 'Onboarding / Offboarding', 'vendor/sow-compliance': 'SOW Compliance', 'vendor/invoices': 'Payment Approval',
  'vendor/performance': 'Performance & Deliverables', 'vendor/reports': 'Vendor Reports',
  'shared/documents': 'Document Repository', 'shared/agreements': 'Digital Agreements', 'system-diagram': 'System Diagram'
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

  renderNavItem(item) {
    let badge = '';
    if (item.badge && NAV_BADGES[item.badge]) {
      const count = NAV_BADGES[item.badge]();
      if (count > 0) badge = `<span class="nav-badge">${count}</span>`;
    }
    return `<a class="nav-item" href="#${item.path}" data-path="${item.path}">${item.label}${badge}</a>`;
  },

  renderSidebar() {
    const role = VMP.currentRole;
    const nav = NAV_CONFIG[role];
    if (!nav) return;

    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.className = `sidebar role-${role}`;

    const roleLabel = document.getElementById('sidebar-role-label');
    if (roleLabel) roleLabel.textContent = nav.label;

    const subtitle = document.getElementById('sidebar-subtitle');
    if (subtitle) subtitle.textContent = `${nav.label} Portal`;

    const el = document.getElementById('sidebar-nav');
    if (el) {
      el.innerHTML = nav.sections.map(s =>
        `<div class="nav-section">${s.label}</div>` +
        s.items.map(i => this.renderNavItem(i)).join('')
      ).join('');
    }

    const footer = document.getElementById('sidebar-footer');
    if (footer && nav.footer) {
      footer.innerHTML = nav.footer.map(i => this.renderNavItem(i)).join('') +
        `<a class="nav-item" href="system-diagram.html" target="_blank" style="opacity:.7">System Diagram ↗</a>`;
    }
  },

  updateTopbar(path) {
    const qIdx = path.indexOf('?');
    const cleanPath = qIdx !== -1 ? path.slice(0, qIdx) : path;
    const title = SCREEN_TITLES[cleanPath] || cleanPath;
    const h2 = document.querySelector('.topbar-left h2');
    const bc = document.querySelector('.topbar-left .breadcrumb');
    if (h2) h2.textContent = title;
    if (bc) bc.textContent = `VMP › ${NAV_CONFIG[VMP.currentRole]?.label || ''} › ${title}`;
    const badge = document.querySelector('.role-badge');
    if (badge) { badge.className = `role-badge ${VMP.currentRole}`; badge.textContent = NAV_CONFIG[VMP.currentRole]?.label; }
    if (typeof NotifUI !== 'undefined') NotifUI.refresh();
    else VMP.updateNotifBadge();
  },

  highlightNav(path) {
    const qIdx = path.indexOf('?');
    const cleanPath = qIdx !== -1 ? path.slice(0, qIdx) : path;
    document.querySelectorAll('#sidebar-nav .nav-item, #sidebar-footer .nav-item').forEach(n => {
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
          step.classList.remove('done', 'current', 'pending');
          if (i < idx) step.classList.add('done');
          else if (i === idx) step.classList.add('current');
          else step.classList.add('pending');
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
