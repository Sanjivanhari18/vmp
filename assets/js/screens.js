/** VMP Screen Renderers — all ~55 screens */
const Screens = {
  'not-found': () => UI.card('Screen Not Found', '<p>Use the sidebar to navigate to available screens.</p>'),

  // ========== DASHBOARDS ==========
  'dashboard-taq': () => {
    const awaitingRouting = VMP_DATA.candidates.filter(c => c.stage === 'Submitted').length;
    const pendingJobOrders = VMP_DATA.jobOrders.filter(j => j.response_status === 'Pending Response').length;
    const activePipeline = VMP_DATA.candidates.filter(c => !['Onboarded', 'Rejected'].includes(c.stage)).length;
    return SH.actorBanner() + UI.statsGrid([
      { value: VMP_DATA.mfrs.filter(m => m.status === 'Raised').length, label: 'MFRs Awaiting Intake', nav: 'taq/mfr', class: 'warning' },
      { value: pendingJobOrders, label: 'Job Orders Awaiting Vendor', nav: 'taq/job-orders', class: 'warning' },
      { value: awaitingRouting, label: 'Profiles to Route', nav: 'taq/candidate-routing', class: 'warning' },
      { value: activePipeline, label: 'Pipeline (Monitor Only)', nav: 'taq/pipeline' }
    ]) + UI.card('Orchestration Queue', UI.table(['Candidate','Vendor','Stage','Owner','Action'],
      VMP_DATA.candidates.filter(c => ['Submitted','Forwarded to Manager','Manager Selected'].includes(c.stage)).map(c => {
        const owner = { 'Submitted': 'TAQ', 'Forwarded to Manager': 'Manager', 'Manager Selected': 'HR Ops' }[c.stage];
        const action = { 'Submitted': 'Route to manager', 'Forwarded to Manager': 'Manager reviews', 'Manager Selected': 'HR schedules interview' }[c.stage];
        return `<tr data-nav="${c.stage === 'Submitted' ? 'taq/candidate-routing' : c.stage === 'Forwarded to Manager' ? 'manager/candidate-review' : 'hr/interviews'}"><td>${c.name}</td><td>${VMP.getVendor(c.vendor_id)?.vendor_name}</td><td>${UI.badge(c.stage)}</td><td>${owner}</td><td>${action}</td></tr>`;
      })
    )) + SH.expiringSoonWidget() + UI.alert('info', 'TAQ orchestrates hiring flow and system admin — does not schedule interviews, onboard candidates, or run BGV. Those are HR Ops responsibilities.');
  },

  'dashboard-main': () => {
    const role = VMP.currentRole;
    return UI.statsGrid([
      { value: VMP_DATA.approvals.filter(a => a.status === 'Pending').length, label: 'Pending Approvals', nav: 'admin/approvals', class: 'warning' },
      { value: VMP_DATA.contractors.filter(c => c.status === 'Active').length, label: 'Active Contractors', nav: 'contractors/list' },
      { value: VMP_DATA.anomalies.filter(a => a.status !== 'Resolved').length, label: 'Reporting Anomalies', nav: 'reports/anomalies', class: 'danger' },
      { value: VMP_DATA.financeBatches.filter(b => b.finance_status !== 'Paid').length, label: 'Finance Batches', nav: 'finance/batches' }
    ]) + UI.card('Quick Actions', `<div style="display:flex;gap:.5rem;flex-wrap:wrap">
      <a href="#admin/approvals" class="btn btn-primary btn-sm">View Approvals</a>
      <a href="#reports/anomalies" class="btn btn-secondary btn-sm">Anomaly Report</a>
      <a href="#admin/audit" class="btn btn-secondary btn-sm">Audit Log</a>
      <a href="#import/upload" class="btn btn-secondary btn-sm">Data Import</a>
    </div>`);
  },

  'dashboard-hr': () => SH.actorBanner() + UI.statsGrid([
    { value: VMP_DATA.candidates.filter(c => c.stage === 'Manager Selected').length, label: 'Awaiting Interview Schedule', nav: 'hr/interviews', class: 'warning' },
    { value: VMP_DATA.candidates.filter(c => ['Interview Scheduled','Interview Complete','Offer Sent'].includes(c.stage)).length, label: 'In HR Hiring Pipeline', nav: 'hr/candidates', class: 'warning' },
    { value: VMP_DATA.contractors.filter(c => c.status === 'Onboarding').length, label: 'Onboarding In Progress', nav: 'contractors/onboarding', class: 'warning' },
    { value: VMP_DATA.contractors.filter(c => c.status === 'Active').length, label: 'Active Contractors', nav: 'contractors/list' }
  ]) + UI.card('HR Action Queue', UI.table(['Candidate','Vendor','Stage','Interview','Next Step'],
    VMP_DATA.candidates.filter(c => ['Manager Selected','Interview Scheduled','Offer Sent'].includes(c.stage)).map(c => {
      const int = VMP_DATA.interviewSchedules?.find(i => i.candidate_id === c.id);
      const next = c.stage === 'Manager Selected' ? 'Schedule interview' : c.stage === 'Interview Scheduled' ? 'Conduct interview' : 'Start onboarding';
      return `<tr data-nav="${c.stage === 'Manager Selected' ? 'hr/interviews' : 'hr/candidates'}"><td>${c.name}</td><td>${VMP.getVendor(c.vendor_id)?.vendor_name}</td><td>${UI.badge(c.stage)}</td><td>${int?.interview_date ? VMP.formatDate(int.interview_date) : '—'}</td><td>${next}</td></tr>`;
    }), 'No candidates awaiting HR action'
  )) + UI.card('Onboarding In Progress', UI.table(['Contractor','Vendor','Stage','BGV','Start Date'],
    VMP_DATA.contractors.filter(c => c.status === 'Onboarding').map(c =>
      `<tr data-nav="contractors/profile?id=${c.id}"><td>${c.full_name}</td><td>${VMP.getVendor(c.vendor_id)?.vendor_name}</td><td>${UI.badge(c.onboarding_stage)}</td><td>${UI.badge(c.bgv_status)}</td><td>${VMP.formatDate(c.joining_date)}</td></tr>`
    ), 'No contractors in onboarding'
  )) + SH.expiringSoonWidget(),

  'dashboard-finance': () => SH.actorBanner() + UI.statsGrid([
    { value: VMP_DATA.invoices.filter(i => i.payment_status === 'Pending').length, label: 'Pending Invoices', nav: 'finance/invoices', class: 'warning' },
    { value: VMP_DATA.financeBatches.filter(b => b.finance_status === 'Exceptions Flagged').length, label: 'Batches with Exceptions', nav: 'finance/batches', class: 'danger' },
    { value: VMP_DATA.rates.filter(r => r.approval_status === 'Pending Finance').length, label: 'Rates Pending Approval', nav: 'rates/register', class: 'warning' },
    { value: VMP.formatCurrency(501500), label: 'Total Pending Payment', class: 'warning' }
  ]) + UI.card('Recent Invoices', UI.table(['Invoice #','Vendor','Amount','Status','Dual Approval'],
    VMP_DATA.invoices.map(i => `<tr data-nav="finance/invoices"><td>${i.invoice_number}</td><td>${VMP.getVendor(i.vendor_id)?.vendor_name}</td><td>${VMP.formatCurrency(i.invoice_amount)}</td><td>${UI.badge(i.payment_status)}</td><td>${i.dual_approval_required ? '⚠ Required' : '—'}</td></tr>`)
  )),

  'dashboard-manager': () => {
    const team = VMP.getManagerTeam('u4');
    const pending = VMP_DATA.timesheets.filter(t => t.contractor_confirmation_status === 'Pending' && team.some(c => c.id === t.contractor_id));
    const cost = team.reduce((s, c) => { const r = VMP.getActiveRate(c.id); return s + (r?.monthly_rate || 0) / 4; }, 0);
    return SH.actorBanner() + UI.statsGrid([
      { value: team.length, label: 'My Active Contractors', nav: 'contractors/list' },
      { value: VMP.formatCurrency(Math.round(cost)), label: 'Running Cost This Month' },
      { value: pending.length, label: 'Awaiting Confirmation', nav: 'manager/timesheets', class: 'warning' },
      { value: VMP_DATA.candidates.filter(c => c.stage === 'Forwarded to Manager' && c.forwarded_to_manager_id === 'u4').length, label: 'Profiles to Review', nav: 'manager/candidate-review', class: 'warning' }
    ]) + UI.card('My Team', UI.table(['Contractor','Role','Vendor','End Date','Rate Status'],
      team.map(c => { const r = VMP.getActiveRate(c.id); return `<tr data-nav="contractors/profile?id=${c.id}"><td>${c.full_name}</td><td>${c.skill_set}</td><td>${VMP.getVendor(c.vendor_id)?.vendor_name}</td><td>${VMP.formatDate(c.exit_date) || '—'}</td><td>${r ? UI.badge('Approved') : UI.badge('Missing')}</td></tr>`; })
    ));
  },

  'dashboard-contractor': () => {
    const c = VMP.getContractor('c1');
    const a = VMP.getActiveAssignment('c1');
    const bal = VMP.getContractorLeaveBalance('c1');
    const pendingTs = VMP_DATA.timesheets.filter(t => t.contractor_id === 'c1' && t.contractor_confirmation_status === 'Pending');
    const myAssignment = UI.card('My Assignment', UI.detailRows([
      { label: 'Project', value: c.project_name || VMP.getProject(a?.project_id)?.project_name || '—' },
      { label: 'Reporting Manager', value: VMP.getUser(a?.reporting_manager_id)?.full_name || '—' },
      { label: 'Vendor', value: VMP.getVendor(c.vendor_id)?.vendor_name },
      { label: 'Pay Rate', value: c.pay_rate ? VMP.formatCurrency(c.pay_rate) + '/mo' : '—' },
      { label: 'Contract End Date', value: VMP.formatDate(c.contract_end_date) + (VMP.daysUntil(c.contract_end_date) !== null && VMP.daysUntil(c.contract_end_date) <= 90 ? ' ' + UI.badge('Ending Soon') : '') },
      { label: 'Leave Balance', value: `Annual ${bal.annual} · Sick ${bal.sick} · Personal ${bal.personal}` }
    ]));
    return SH.actorBanner() + UI.alert('info', 'Welcome, Amit Joshi — Contractor Portal') +
    UI.statsGrid([
      { value: pendingTs.length, label: 'Pending Confirmation', nav: 'contractor/timesheet' },
      { value: VMP_DATA.leaveRecords.filter(l => l.contractor_id === 'c1' && l.leave_status === 'Pending').length, label: 'Leave Requests', nav: 'contractor/leave' },
      { value: '2', label: 'Documents Due', nav: 'contractor/documents', class: 'warning' },
      { value: UI.badge('Active'), label: 'Status' }
    ]) + myAssignment + UI.card('Announcements', '<ul><li>Company Foundation Day — June 5 (Holiday)</li><li>Please submit timesheets by Friday 5 PM</li></ul>');
  },

  'dashboard-leadership': () => UI.statsGrid([
    { value: VMP_DATA.contractors.filter(c => c.status === 'Active').length, label: 'Active Headcount' },
    { value: VMP.formatCurrency(2450000), label: 'Monthly Contingent Cost' },
    { value: VMP_DATA.vendors.filter(v => v.status === 'Active').length, label: 'Active Vendors' },
    { value: '88%', label: 'Avg Vendor SLA Score', class: 'success' }
  ]) + UI.card('Headcount by Department', UI.table(['Department','Active','Onboarding','Cost/Month'],
    [['Engineering', 4, 1, '₹3,42,000'], ['Product', 2, 1, '₹1,50,000'], ['IT', 0, 0, '—']].map(r =>
      `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`
    )
  )),

  // ========== ADMIN / PLATFORM ==========
  'profile': () => {
    const u = VMP.currentUser || VMP.getUser(NAV_CONFIG[VMP.currentRole]?.userId);
    return UI.card('My Profile', UI.detailRows([
      { label: 'Name', value: u?.full_name || u?.full_name },
      { label: 'Email', value: u?.email || '—' },
      { label: 'Employee ID', value: u?.employee_id || '—' },
      { label: 'Department', value: u?.department || '—' },
      { label: 'Role', value: NAV_CONFIG[VMP.currentRole]?.label },
      { label: 'Status', value: UI.badge(u?.status || 'Active') },
      { label: 'Permissions', value: VMP_DATA.permissions.filter(p => p.role_id === VMP.getUser(u?.id)?.role_id || p.role_id === 'role-' + VMP.currentRole).map(p => `<span class="chip">${p.module}</span>`).join('') || 'Full Access' }
    ]));
  },

  'admin-users': () => UI.toolbar([
    '<input type="search" class="search-input" placeholder="Search users...">',
    '<a href="#" class="btn btn-primary btn-sm">+ Create User</a>',
    '<button class="btn btn-secondary btn-sm">Export</button>'
  ]) + UI.card('Users', UI.table(['Employee ID','Name','Email','Department','Role','Status','Last Login'],
    VMP_DATA.users.map(u => `<tr><td>${u.employee_id}</td><td>${u.full_name}</td><td>${u.email}</td><td>${u.department}</td><td>${VMP.getRole(u.role_id)?.name}</td><td>${UI.badge(u.status)}</td><td>Today</td></tr>`)
  )),

  'admin-roles': () => UI.tabs([
    { label: 'Roles', content: UI.table(['Role','Description','Users','Status','Actions'],
      VMP_DATA.roles.map(r => `<tr><td>${r.name}</td><td>${r.code} portal access</td><td>${VMP_DATA.users.filter(u => u.role_id === r.id).length}</td><td>${UI.badge('Active')}</td><td><button class="btn btn-sm btn-secondary">Edit</button></td></tr>`)
    )},
    { label: 'Permission Matrix', content: UI.table(['Module','View','Create','Update','Approve','Export'],
      VMP_DATA.permissions.map(p => `<tr><td>${p.module}</td><td>${p.can_view?'✓':'—'}</td><td>${p.can_create?'✓':'—'}</td><td>${p.can_update?'✓':'—'}</td><td>${p.can_approve?'✓':'—'}</td><td>${p.can_export?'✓':'—'}</td></tr>`)
    )}
  ]),

  'admin-config': () => UI.card('Master Configuration', UI.tabs([
    { label: 'Rate Types', content: VMP_DATA.config.rate_types.map(t => `<span class="chip">${t}</span>`).join('') },
    { label: 'Document Types', content: VMP_DATA.config.document_types.map(t => `<span class="chip">${t}</span>`).join('') },
    { label: 'Regions', content: VMP_DATA.config.regions.map(t => `<span class="chip">${t}</span>`).join('') },
    { label: 'SLA Settings', content: UI.detailRows(Object.entries(VMP_DATA.config.sla_settings).map(([k,v]) => ({ label: k.replace(/_/g,' '), value: v }))) },
    { label: 'Approval Threshold', content: UI.alert('info', `Dual approval required for invoices above $${VMP_DATA.config.dual_approval_threshold_usd.toLocaleString()} USD`) }
  ].map((t,i) => ({ ...t, label: t.label })))),

  'admin-super': () => UI.card('Super Admin Panel', UI.tabs([
    { label: 'Onboarding Templates', content: '<p>Contractor onboarding checklist template, Vendor onboarding template, Document requirements by contract type.</p><button class="btn btn-primary btn-sm">Configure Templates</button>' },
    { label: 'Workflow Config', content: UI.detailRows(VMP_DATA.config.approval_stages.map((s,i) => ({ label: `Stage ${i+1}`, value: s }))) },
    { label: 'Analytics', content: UI.statsGrid([
      { value: '12 days', label: 'Avg Onboarding Time' }, { value: '94%', label: 'On-time Start Rate' },
      { value: '3.2 days', label: 'Avg Approval Cycle' }, { value: '87%', label: 'First-pass Timesheet Rate' }
    ])}
  ])),

  'admin-approvals': () => {
    const approvalTable = UI.table(['Entity','Type','Requester','Owner','Stage','SLA','Priority','Status','Actions'],
      VMP_DATA.approvals.map(a => `<tr data-nav="admin/approval-detail?id=${a.id}"><td>${a.entity_id}</td><td>${a.entity_type}</td><td>${VMP.getUser(a.requester)?.full_name || a.requester}</td><td><span class="badge ${a.approver_role==='HR Ops'?'badge-active':'badge-draft'}">${a.approver_role||'—'}</span></td><td>${a.current_stage}</td><td>${a.sla}</td><td>${a.priority}</td><td>${UI.badge(a.status)}</td><td>${a.status==='Pending'?UI.approveRejectButtons(a.entity_type,a.entity_id):'—'}</td></tr>`)
    );
    const ownershipNote = VMP.currentRole === 'taq' ? UI.alert('info', 'Ownership: Background Verification (BGV) and contractor activation are owned by <strong>HR Ops</strong>, not TAQ. TAQ sees the full queue for oversight but does not action HR-owned steps. The "Owner" column shows the responsible role for each item.') : '';
    const steps = ['Submitted', 'Role Review', 'Finance Review', 'Approved / Rejected'];
    const panels = [
      UI.card('Submitted', UI.alert('info', 'New requests enter the queue after submission.') + approvalTable),
      UI.card('Role Review', approvalTable),
      UI.card('Finance Review', approvalTable),
      UI.card('Approved / Rejected', UI.table(['Entity','Type','Status'],
        VMP_DATA.approvals.filter(a => a.status !== 'Pending').map(a =>
          `<tr data-nav="admin/approval-detail?id=${a.id}"><td>${a.entity_id}</td><td>${a.entity_type}</td><td>${UI.badge(a.status)}</td></tr>`)
      ))
    ];
    return ownershipNote + SH.workflowBanner('Central Approval Queue', steps, 'Role Review',
      'Approvals route to the correct actor by type: Vendor → Finance, Rate → Finance, Transfer → HR + Manager, MFR → TAQ, BGV / Activation → HR Ops.',
      panels);
  },

  'admin-approval-detail': () => SH.renderApprovalDetail(),

  'admin-audit': () => UI.toolbar([
      '<input type="search" placeholder="Search entity or user..." class="search-input">',
      '<label style="font-size:.8rem;color:var(--muted);display:flex;align-items:center;gap:.35rem">From <input type="date" value="2025-06-01"></label>',
      '<label style="font-size:.8rem;color:var(--muted);display:flex;align-items:center;gap:.35rem">To <input type="date" value="2025-06-30"></label>',
      '<button class="btn btn-secondary btn-sm">Apply Filter</button>',
      '<button class="btn btn-secondary btn-sm">Export</button>'
    ]) +
    UI.card('Audit Log', UI.table(['Entity','Action','Old Value','New Value','By','At'],
      VMP_DATA.auditLogs.map(a => `<tr><td>${a.entity_type} ${a.entity_id}</td><td>${a.action}</td><td>${a.old_value||'—'}</td><td>${a.new_value||'—'}</td><td>${VMP.getUser(a.performed_by)?.full_name||a.performed_by}</td><td>${a.performed_at}</td></tr>`)
    )),

  'admin-notifications': () => UI.tabs([
    { label: 'Templates', content: UI.table(['Code','Channel','Subject','Status','Actions'],
      VMP_DATA.notificationTemplates.map(t => `<tr><td>${t.template_code}</td><td>${t.channel}</td><td>${t.subject}</td><td>${UI.badge(t.status)}</td><td><button class="btn btn-sm btn-secondary">Edit</button></td></tr>`)
    )},
    { label: 'Notification Log', content: UI.table(['Recipient','Event','Entity','Channel','Read','Sent','Open'],
      VMP_DATA.notifications.map(n => `<tr class="${n.read ? '' : 'row-blocked'}"><td>${VMP.getUser(n.recipient_user_id)?.full_name||n.recipient_user_id||'—'}</td><td>${n.event}</td><td>${n.entity_type} ${n.entity_id}</td><td>${n.channel}</td><td>${n.read ? 'Read' : UI.badge('Pending')}</td><td>${n.sent_at}</td><td>${n.nav ? `<a href="#${n.nav}" class="btn btn-sm btn-secondary">Open</a>` : '—'}</td></tr>`)
    )}
  ]),

  // ========== VENDORS & PROJECTS ==========
  'vendors-list': () => UI.toolbar(['<input type="search" placeholder="Search vendors..." class="search-input">','<a href="#vendors/register" class="btn btn-primary btn-sm">+ New Vendor</a>']) +
    UI.card('Vendors', UI.table(['Code','Name','Contact','Contract Start','Contract End','Compliance','Status','Contract Doc','Contractors'],
      VMP_DATA.vendors.map(v => {
        const days = VMP.daysUntil(v.contract_end_date);
        const expiryFlag = days !== null && days <= 90 ? ` <span class="badge ${days < 0 ? 'badge-rejected' : 'badge-pending'}">${days < 0 ? 'Expired' : days + 'd left'}</span>` : '';
        const docCell = v.contract_document ? `<button class="btn btn-sm btn-secondary">Open</button>` : '<span style="color:var(--muted);font-size:.75rem">Not uploaded</span>';
        return `<tr data-nav="vendors/detail?id=${v.id}"><td>${v.vendor_code}</td><td>${v.vendor_name}</td><td>${v.contact_name}</td><td>${VMP.formatDate(v.contract_start_date)}</td><td>${VMP.formatDate(v.contract_end_date)}${expiryFlag}</td><td>${UI.badge(v.compliance_status)}</td><td>${UI.badge(v.status)}</td><td>${docCell}</td><td>${VMP.getVendorContractors(v.id).length}</td></tr>`;
      })
    )),

  'vendors-register': () => {
    const companyForm = UI.formGrid([
      { label: 'Vendor Name', value: 'TechTalent Partners' }, { label: 'Registered Name', value: 'TechTalent Partners LLP' },
      { label: 'GST Number', value: '29AABCT5678G1Z2' }, { label: 'PAN Number', value: 'AABCT5678G' },
      { label: 'Address', value: 'Bangalore, KA', full: true },
      { label: 'Contact Name', value: 'Kavitha Rao' }, { label: 'Contact Email', value: 'kavitha@techtalent.com' }
    ]);
    const slaForm = UI.formGrid([
      { label: 'Fill Rate SLA (%)', value: '85' }, { label: 'Time-to-Fill (days)', value: '21' },
      { label: 'Payment Terms', value: 'Net 30' }, { label: 'Penalty Clause', type: 'textarea', value: 'Standard SLA penalties apply', full: true }
    ]);
    const kanban = UI.kanban([
      { title: 'Initiated', cards: [{ name: 'TechTalent Partners', meta: 'VND-002', badge: 'Draft' }] },
      { title: 'Docs Received', cards: [] },
      { title: 'Compliance Check', cards: [] },
      { title: 'Finance Approval', cards: [] },
      { title: 'Activated', cards: [{ name: 'Acme Staffing Solutions', meta: 'VND-001', badge: 'Active' }] }
    ]);
    const docusignPanel = UI.alert('info', 'Agreements are sent to the vendor\'s authorized signatory as a single DocuSign envelope. All four documents (SLA, SOW, NDA, MSA) must be e-signed before the vendor can be verified and activated.') +
      UI.table(['Agreement','Signatory','DocuSign Status','Envelope'],
        [['SLA — Service Levels','Ravi Menon (Authorized Signatory)','Sent for Signature','DS-ENV-1004'],
         ['SOW — Statement of Work','Ravi Menon (Authorized Signatory)','Sent for Signature','DS-ENV-1004'],
         ['NDA — Non-Disclosure','Ravi Menon (Authorized Signatory)','Sent for Signature','DS-ENV-1004'],
         ['MSA — Master Service Agreement','Ravi Menon (Authorized Signatory)','Sent for Signature','DS-ENV-1004']]
          .map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${UI.badge(r[2])}</td><td>${r[3]}</td></tr>`)
      ) + '<div class="form-actions"><button class="btn btn-secondary">Back</button><button class="btn btn-primary">Send Bundle via DocuSign</button><button class="btn btn-secondary">Record Signed Copies</button></div>';
    const steps = ['Company Details','Documents','SLA Terms','Sign Agreements (DocuSign)','Review & Activate'];
    const panels = [
      UI.card('Company Details', companyForm + UI.alert('warning', '⚠ AI Duplicate Detection: Similar vendor "TechTalent Inc" found (78% match). Review before saving.') +
        '<div class="form-actions"><button class="btn btn-secondary">Save Draft</button><button class="btn btn-primary">Next</button></div>'),
      UI.card('Documents', UI.table(['Document','Status','Actions'],
        [['GST Certificate','Uploaded','Review'],['PAN Card','Uploaded','Review'],['MSA Template','Pending','Upload'],['Insurance','Pending','Upload']]
          .map(r => `<tr><td>${r[0]}</td><td>${UI.badge(r[1])}</td><td><button class="btn btn-sm btn-secondary">${r[2]}</button></td></tr>`)
      ) + '<div class="form-actions"><button class="btn btn-secondary">Back</button><button class="btn btn-primary">Next</button></div>'),
      UI.card('SLA Terms', slaForm + '<div class="form-actions"><button class="btn btn-secondary">Back</button><button class="btn btn-primary">Next</button></div>'),
      UI.card('Sign Agreements via DocuSign (SLA · SOW · NDA · MSA)', docusignPanel),
      UI.card('Review & Activate', UI.detailRows([
        { label: 'Vendor', value: 'TechTalent Partners' }, { label: 'GST', value: '29AABCT5678G1Z2' },
        { label: 'Fill Rate SLA', value: '85%' }, { label: 'Time-to-Fill', value: '21 days' },
        { label: 'Agreements (DocuSign)', value: UI.badge('Sent for Signature') + ' SLA · SOW · NDA · MSA' }
      ]) + UI.alert('info', 'HR / Finance verify documents including signed agreements before Finance approves and the system activates the vendor.') +
        UI.card('Vendor Onboarding Pipeline', kanban) +
        '<div class="form-actions"><button class="btn btn-secondary">Back</button><button class="btn btn-primary">Submit for Approval</button></div>')
    ];
    return UI.processFlow(steps, 3, { panels });
  },

  'vendors-compliance': () => {
    const expiringDocs = VMP_DATA.vendorDocuments.filter(d => { const dd = VMP.daysUntil(d.expiry_date); return dd !== null && dd <= 90; });
    const banner = expiringDocs.length ? UI.alert('warning', `⚠ ${expiringDocs.length} document(s) expiring within 90 days — renew before they lapse.`) : '';
    return banner + UI.card('Compliance Documents', UI.table(['Vendor','Type','Document','Expiry','Renewal Due','Expiry Window','Status','Actions'],
      VMP_DATA.vendorDocuments.map(d => {
        const days = VMP.daysUntil(d.expiry_date);
        const windowBadge = days === null ? '—' : UI.badge(VMP.expiryBucket(days));
        return `<tr><td>${VMP.getVendor(d.vendor_id)?.vendor_name}</td><td>${d.document_type}</td><td>${d.document_name}</td><td>${VMP.formatDate(d.expiry_date)}</td><td>${VMP.formatDate(d.renewal_date)}</td><td>${windowBadge}</td><td>${UI.badge(d.verification_status)}</td><td><button class="btn btn-sm btn-secondary">Download</button> ${days !== null && days <= 90 ? '<button class="btn btn-sm btn-primary">Renew</button>' : ''}</td></tr>`;
      })
    ));
  },

  'vendors-detail': () => {
    const id = Router.getQueryParam('id') || 'v1';
    const v = VMP.getVendor(id);
    if (!v) return UI.alert('danger', 'Vendor not found');
    const docs = VMP.getVendorDocuments(id);
    const contractors = VMP.getVendorContractors(id);
    const stepIdx = v.status === 'Active' ? 3 : v.approval_status === 'Pending Finance Approval' ? 2 : 0;
    const vendorTabs = UI.tabs([
      { label: 'Details', content: UI.detailRows([
        { label: 'Status', value: UI.badge(v.status) }, { label: 'Approval', value: UI.badge(v.approval_status) },
        { label: 'GST', value: v.gst_number }, { label: 'PAN', value: v.pan_number },
        { label: 'Contact', value: `${v.contact_name} — ${v.contact_email}` }, { label: 'Compliance', value: UI.badge(v.compliance_status) },
        { label: 'Contract Start', value: VMP.formatDate(v.contract_start_date) },
        { label: 'Contract End', value: VMP.formatDate(v.contract_end_date) + (VMP.daysUntil(v.contract_end_date) !== null && VMP.daysUntil(v.contract_end_date) <= 90 ? ' ' + UI.badge(VMP.daysUntil(v.contract_end_date) < 0 ? 'Expired' : 'Renewal Due') : '') },
        { label: 'Signed Contract', value: v.contract_document ? `<span class="entity-link">${v.contract_document}</span> <button class="btn btn-sm btn-secondary">Open Document</button>` : '<span style="color:var(--muted)">Not uploaded</span>' }
      ])},
      { label: 'Compliance Docs', content: UI.table(['Type','Document','Expiry','Status'],
        docs.map(d => `<tr><td>${d.document_type}</td><td>${d.document_name}</td><td>${VMP.formatDate(d.expiry_date)}</td><td>${UI.badge(d.verification_status)}</td></tr>`)
      ) + `<a href="#vendors/compliance" class="btn btn-sm btn-secondary">Manage Documents</a>` },
      { label: 'Contractors', content: UI.table(['Code','Name','Project','Status'],
        contractors.map(c => `<tr data-nav="contractors/profile?id=${c.id}"><td>${c.contractor_code}</td><td>${c.full_name}</td><td>${VMP.getProject(VMP.getActiveAssignment(c.id)?.project_id)?.project_code||'—'}</td><td>${UI.badge(c.status)}</td></tr>`)
      )},
      { label: 'Invoices', content: UI.table(['Invoice #','Amount','Status','Vendor Approval'],
        VMP_DATA.invoices.filter(i=>i.vendor_id===id).map(i => `<tr><td>${i.invoice_number}</td><td>${VMP.formatCurrency(i.invoice_amount)}</td><td>${UI.badge(i.payment_status)}</td><td>${UI.badge(i.vendor_approval_status)}</td></tr>`)
      )},
      { label: 'Agreements (DocuSign)', content: (() => {
        const env = VMP.getVendorEnvelope(id);
        if (!env) return UI.alert('info', 'No DocuSign envelope on record for this vendor.');
        return UI.detailRows([
          { label: 'Provider', value: env.provider },
          { label: 'Bundle', value: env.bundle.join(' · ') },
          { label: 'Signatory', value: env.signatory },
          { label: 'Envelope', value: env.envelope_ref },
          { label: 'Sent', value: VMP.formatDate(env.sent_at) },
          { label: 'Signed', value: VMP.formatDate(env.signed_at) },
          { label: 'Status', value: UI.badge(env.status) }
        ]) + UI.table(['Agreement','Status'], env.bundle.map(b => `<tr><td>${b}</td><td>${UI.badge(env.status)}</td></tr>`));
      })() }
    ]);
    const steps = ['Create Vendor','Upload Docs','Finance Approval','Activated'];
    const panels = [
      UI.card('Create Vendor', vendorTabs),
      UI.card('Upload Docs', UI.table(['Type','Document','Expiry','Status'],
        docs.map(d => `<tr><td>${d.document_type}</td><td>${d.document_name}</td><td>${VMP.formatDate(d.expiry_date)}</td><td>${UI.badge(d.verification_status)}</td></tr>`)
      )),
      UI.card('Finance Approval', vendorTabs + (v.approval_status === 'Pending Finance Approval' ? UI.card('Actions', UI.approveRejectButtons('Vendor', v.id)) : '')),
      UI.card('Activated', vendorTabs)
    ];
    return UI.processFlow(steps, stepIdx, { panels });
  },

  'projects-list': () => UI.toolbar(['<input type="search" placeholder="Search projects..." class="search-input">','<button class="btn btn-primary btn-sm">Sync Projects</button>']) +
    UI.card('Project Master', UI.table(['Code','Name','Client','Department','PM','Start','End','Status','Contractors'],
      VMP_DATA.projects.map(p => `<tr><td>${p.project_code}</td><td>${p.project_name}</td><td>${p.client_name}</td><td>${p.department}</td><td>${VMP.getUser(p.project_manager_id)?.full_name}</td><td>${VMP.formatDate(p.start_date)}</td><td>${VMP.formatDate(p.end_date)}</td><td>${UI.badge(p.status)}</td><td>${VMP_DATA.assignments.filter(a=>a.project_id===p.id&&a.assignment_status==='Active').length}</td></tr>`)
    )),

  'positions-list': () => UI.toolbar(['<a href="#positions/create" class="btn btn-primary btn-sm">+ Create Position</a>']) +
    UI.card('Open Positions', UI.table(['Title','Project','Skills','Count','Budget Rate','Status','Requested By','Vendors'],
      VMP_DATA.openPositions.map(o => `<tr><td>${o.position_title}</td><td>${VMP.getProject(o.project_id)?.project_name}</td><td>${o.skill_set}</td><td>${o.no_of_positions}</td><td>₹${o.budget_rate}/day</td><td>${UI.badge(o.status)}</td><td>${VMP.getUser(o.requested_by)?.full_name}</td><td>${o.vendor_ids.map(v=>VMP.getVendor(v)?.vendor_code).join(', ')}</td></tr>`)
    )),

  'positions-create': () => UI.card('Create Open Position', UI.formGrid([
      { label: 'Project', type: 'select', options: VMP_DATA.projects.filter(p=>p.status==='Active').map(p=>({label:p.project_name,selected:p.id==='p1'})) },
      { label: 'Position Title', value: 'DevOps Engineer' }, { label: 'Skill Set', value: 'Kubernetes, CI/CD, AWS' },
      { label: 'Experience Required', value: '5+ years' }, { label: 'No. of Positions', value: '1' },
      { label: 'Budget Rate (daily)', value: '9500' }, { label: 'Location', value: 'Remote' },
      { label: 'Start Date', value: '2025-07-01', type: 'date' }, { label: 'End Date', value: '2026-06-30', type: 'date' }
    ]) + '<div class="form-actions"><button class="btn btn-secondary">Cancel</button><button class="btn btn-primary">Submit for Approval</button></div>'),

  'import-upload': () => UI.card('Import Batch Upload', UI.formGrid([
      { label: 'Import Type', type: 'select', options: ['Contractor Rates','Assignments','Contractors','Vendors','Projects','Reporting Managers'] },
      { label: 'Source File', value: 'contractor_rates_may2025.xlsx', type: 'file' }
    ]) + UI.alert('info', 'Upload Excel file. System validates all rows before import. Failed rows can be downloaded for correction.') +
    '<div class="form-actions"><button class="btn btn-primary">Upload & Validate</button></div>') +
    UI.card('Recent Imports', UI.table(['File','Type','Total','Success','Failed','By','Date','Status','Actions'],
      VMP_DATA.importBatches.map(b => `<tr data-nav="import/errors"><td>${b.source_file_name}</td><td>${b.import_type}</td><td>${b.total_rows}</td><td>${b.success_rows}</td><td>${b.failed_rows}</td><td>${VMP.getUser(b.uploaded_by)?.full_name}</td><td>${VMP.formatDate(b.uploaded_at)}</td><td>${UI.badge(b.status)}</td><td><a href="#import/errors" class="btn btn-sm btn-secondary">View Errors</a></td></tr>`)
    )),

  'import-errors': () => UI.card('Import Error Review — contractor_rates_may2025.xlsx', UI.table(['Row','Field','Rejected Value','Message','Status'],
    VMP_DATA.importBatches[0].errors.map(e => `<tr><td>${e.row}</td><td>${e.field}</td><td>${e.rejected_value}</td><td>${e.message}</td><td>${UI.badge('Failed')}</td></tr>`)
  ) + '<div class="form-actions"><button class="btn btn-secondary">Download Errors</button><button class="btn btn-primary">Re-upload Corrected File</button></div>'),

  // ========== CONTRACTORS ==========
  'contractors-list': () => {
    const list = SH.contractors();
    const title = VMP.currentRole === 'manager' ? 'My Contractors' : 'Contractors';
    return UI.toolbar([
      '<input type="search" placeholder="Search contractors..." class="search-input">',
      '<select><option>All Status</option><option>Active</option><option>Onboarding</option></select>',
      ...(VMP.currentRole !== 'manager' ? ['<a href="#contractors/create" class="btn btn-primary btn-sm">+ New Contractor</a>'] : [])
    ]) + UI.card(title, UI.table(['Code','Name','Vendor','Project','Manager','Rate','BGV','Status','Quick Actions'],
      list.map(c => {
        const a = VMP.getActiveAssignment(c.id);
        const r = VMP.getActiveRate(c.id);
        const fixes = [];
        if (!r) fixes.push(`<a href="#rates/create" class="btn btn-sm btn-primary">Fix Rate</a>`);
        if (c.bgv_status !== 'Cleared') fixes.push(`<a href="#bgv/tracker" class="btn btn-sm btn-secondary">Resolve BGV</a>`);
        if (a && !a.reporting_manager_id) fixes.push(`<a href="#assignments/transfer" class="btn btn-sm btn-secondary">Set Manager</a>`);
        const actions = fixes.length ? fixes.join(' ') : `<a href="#contractors/profile?id=${c.id}" class="btn btn-sm btn-secondary">View</a>`;
        return `<tr data-nav="contractors/profile?id=${c.id}"><td>${c.contractor_code}</td><td>${c.full_name}</td><td><span class="entity-link" data-nav="vendor/${c.vendor_id}">${VMP.getVendor(c.vendor_id)?.vendor_name}</span></td><td>${a?VMP.getProject(a.project_id)?.project_code:'—'}</td><td>${a?VMP.getUser(a.reporting_manager_id)?.full_name||'⚠ Missing':'—'}</td><td>${r?UI.badge('Approved'):UI.badge('Missing')}</td><td>${UI.badge(c.bgv_status)}</td><td>${UI.badge(c.status)}</td><td>${actions}</td></tr>`;
      }),
      VMP.currentRole === 'manager' ? 'No contractors assigned to your team' : 'No contractors found'
    ));
  },

  'contractors-create': () => {
    const v2pending = VMP.getVendor('v2')?.approval_status !== 'Approved';
    const basicForm = UI.formGrid([
      { label: 'Full Name', value: '' }, { label: 'Email', value: '' }, { label: 'Phone', value: '' },
      { label: 'Skill Set', value: '' }, { label: 'Experience (years)', value: '' },
      { label: 'Location', value: 'Mumbai' }, { label: 'Joining Date', type: 'date', value: '2025-07-01' }
    ]);
    const vendorForm = UI.formGrid([
      { label: 'Vendor', type: 'select', options: VMP_DATA.vendors.filter(v=>v.status==='Active').map(v=>({label:v.vendor_name})) },
      { label: 'Project', type: 'select', options: VMP_DATA.projects.filter(p=>p.status==='Active').map(p=>({label:p.project_name})) },
      { label: 'Reporting Manager', type: 'select', options: VMP_DATA.users.filter(u=>u.role_id==='role-manager').map(u=>({label:u.full_name})) }
    ]);
    const engagementForm = UI.formGrid([
      { label: 'Project Name', type: 'select', options: VMP_DATA.projects.filter(p=>p.status==='Active').map(p=>({label:p.project_name})) },
      { label: 'Contractor Pay Rate (INR/mo)', value: '68000' },
      { label: 'Bill Rate (INR/mo)', value: '80000' },
      { label: 'Assignment Start Date', type: 'date', value: '2025-07-01' },
      { label: 'Assignment End Date', type: 'date', value: '2026-06-30' },
      { label: 'FTE Conversion Eligibility', type: 'select', options: ['To be reviewed at tenure end','Yes — eligible at tenure end','No — contract only'] }
    ]);
    const steps = ['Basic Info','Vendor & Project','Engagement Terms','BGV','Rate Setup','Approval'];
    const panels = [
      UI.card('Basic Info', basicForm + '<div class="form-actions"><button class="btn btn-primary">Next</button></div>'),
      UI.card('Vendor & Project', vendorForm + '<div class="form-actions"><button class="btn btn-secondary">Back</button><button class="btn btn-primary">Next</button></div>'),
      UI.card('Capture Engagement Terms', engagementForm + UI.alert('info', 'Required before onboarding proceeds: project name, pay rate (and bill rate), assignment start & end dates, and whether conversion to FTE is possible at the end of tenure. These terms flow into the offer.') +
        '<div class="form-actions"><button class="btn btn-secondary">Back</button><button class="btn btn-primary">Next</button></div>'),
      UI.card('BGV', UI.alert('info', 'BGV will be initiated after vendor and project assignment.') +
        UI.formGrid([{ label: 'BGV Provider', type: 'select', options: ['Default Provider'] }, { label: 'Consent Received', type: 'select', options: ['Yes','No'] }]) +
        '<div class="form-actions"><button class="btn btn-secondary">Back</button><button class="btn btn-primary">Next</button></div>'),
      UI.card('Rate Setup', UI.formGrid([
        { label: 'Rate Type', type: 'select', options: ['Monthly','Daily','Hourly'] },
        { label: 'Monthly Rate (INR)', value: '' }, { label: 'Effective From', type: 'date', value: '2025-07-01' }
      ]) + '<div class="form-actions"><button class="btn btn-secondary">Back</button><button class="btn btn-primary">Next</button></div>'),
      UI.card('Approval', UI.alert('info', 'Duplicate check: email, phone, and vendor combination validated on submit.') +
        UI.detailRows([{ label: 'Workflow', value: 'HR → Finance rate approval → Activation' }]) +
        '<div class="form-actions"><button class="btn btn-secondary">Cancel</button><button class="btn btn-primary">Create & Start Onboarding</button></div>')
    ];
    return (v2pending ? UI.alert('warning', 'Vendor TechTalent Partners is not approved. Contractor onboarding is disabled for unapproved vendors.') : '') +
      UI.processFlow(steps, 0, { panels });
  },

  'contractors-profile': () => {
    const id = Router.getQueryParam('id') || 'c1';
    const c = VMP.getContractor(id);
    if (!c) return UI.alert('danger', 'Contractor not found');
    const a = VMP.getActiveAssignment(c.id);
    const rates = VMP.getContractorRates(c.id);
    const bgv = VMP_DATA.bgvRecords.find(b => b.contractor_id === c.id);
    return UI.card(`${c.full_name} (${c.contractor_code})`, UI.tabs([
      { label: 'Overview', content: UI.detailRows([
        { label: 'Status', value: UI.badge(c.status) }, { label: 'Vendor', value: `<span class="entity-link" data-nav="vendor/${c.vendor_id}">${VMP.getVendor(c.vendor_id)?.vendor_name}</span>` },
        { label: 'Email', value: c.email }, { label: 'Phone', value: c.phone },
        { label: 'Skills', value: c.skill_set }, { label: 'Location', value: c.location },
        { label: 'Joining Date', value: VMP.formatDate(c.joining_date) }, { label: 'BGV', value: UI.badge(c.bgv_status) },
        { label: 'Bank Account', value: c.bank_account || 'Not verified' }, { label: 'IFSC', value: c.ifsc || 'Not verified' }
      ])},
      { label: 'Engagement Terms', content: UI.detailRows([
        { label: 'Project', value: c.project_name || VMP.getProject(VMP.getActiveAssignment(c.id)?.project_id)?.project_name || '—' },
        { label: 'Pay Rate', value: c.pay_rate ? VMP.formatCurrency(c.pay_rate) + '/mo' : (VMP.getActiveRate(c.id) ? VMP.formatCurrency(VMP.getActiveRate(c.id).monthly_rate) + '/mo' : '—') },
        { label: 'Assignment Start', value: VMP.formatDate(VMP.getActiveAssignment(c.id)?.start_date || c.joining_date) },
        { label: 'Contract End Date', value: c.contract_end_date ? VMP.formatDate(c.contract_end_date) : (c.exit_date ? VMP.formatDate(c.exit_date) : '—') },
        { label: 'FTE Conversion Eligibility', value: c.fte_conversion_eligible || 'To be reviewed at tenure end' }
      ]) },
      { label: 'Assignment', content: a ? UI.detailRows([
        { label: 'Project', value: VMP.getProject(a.project_id)?.project_name }, { label: 'Reporting Manager', value: VMP.getUser(a.reporting_manager_id)?.full_name || '⚠ Not mapped' },
        { label: 'Start Date', value: VMP.formatDate(a.start_date) }, { label: 'Status', value: UI.badge(a.assignment_status) },
        { label: 'Allocation', value: a.allocation_percentage + '%' }
      ]) + `<a href="#assignments/transfer" class="btn btn-sm btn-secondary">Initiate Transfer</a>` : UI.alert('warning', 'No active assignment') },
      { label: 'Rate History', content: UI.table(['Version','Rate','Type','Effective From','To','Status','Approved By'],
        rates.map(r => `<tr><td>v${r.version}</td><td>${VMP.formatCurrency(r.monthly_rate||r.hourly_rate||0)}</td><td>${r.rate_type}</td><td>${VMP.formatDate(r.effective_from)}</td><td>${VMP.formatDate(r.effective_to)}</td><td>${UI.badge(r.approval_status)} ${r.immutable?'🔒':''}</td><td>${VMP.getUser(r.approved_by)?.full_name||'—'}</td></tr>`)
      )},
      { label: 'Timesheets', content: UI.table(['Period','Submitted','Approved','Status','Flags'],
        VMP.getContractorTimesheets(c.id).map(t => `<tr><td>${VMP.formatDate(t.work_period_start)} – ${VMP.formatDate(t.work_period_end)}</td><td>${t.submitted_hours}h</td><td>${t.approved_hours}h</td><td>${UI.badge(t.reconciliation_status)}</td><td>${t.leave_mismatch?'⚠ Leave':''}${t.holiday_mismatch?' ⚠ Holiday':''}</td></tr>`)
      )},
      { label: 'Documents', content: UI.table(['Type','Document','Status'],
        VMP_DATA.documents.filter(d=>d.entity_id===c.id).map(d => `<tr><td>${d.document_type}</td><td>${d.document_name||'—'}</td><td>${UI.badge(d.status)}</td></tr>`)
      )},
      { label: 'Audit Trail', content: UI.timeline(VMP_DATA.auditLogs.filter(a=>a.entity_id===c.id||a.entity_id.startsWith('c')).slice(0,5).map(a=>({time:a.performed_at,action:a.action,detail:a.new_value}))) }
    ]));
  },

  'contractors-onboarding': () => SH.renderOnboardingPipeline(),

  'contractors-deboarding': () => {
    const finalInvoice = VMP_DATA.invoices.find(i => i.project_id === 'p1') || VMP_DATA.invoices[0];
    const steps = [
      { label: 'Access revocation', owner: 'IT Admin', status: 'In Progress', detail: 'AD, VPN, email deprovision', link: '' },
      { label: 'Final timesheet closure', owner: 'HR Ops', status: 'HR Approved', detail: 'Last period Jun 23–27 approved', link: '' },
      { label: 'Final invoice raised', owner: 'Finance', status: finalInvoice ? finalInvoice.invoice_stage : 'Pending', detail: finalInvoice ? `${finalInvoice.invoice_number} · ${VMP.formatCurrency(finalInvoice.invoice_amount)} · ${VMP.formatDate(finalInvoice.billing_period_start)}–${VMP.formatDate(finalInvoice.billing_period_end)}` : 'No invoice linked', link: finalInvoice ? `invoices/detail?id=${finalInvoice.id}` : '' },
      { label: 'Document archive', owner: 'HR Ops', status: 'Pending', detail: 'Contracts, IDs, tax forms', link: '' },
      { label: 'Equipment return', owner: 'Facilities', status: 'Completed', detail: 'Laptop + access card returned', link: '' },
      { label: 'Exit notification to stakeholders', owner: 'System', status: 'Pending', detail: 'Finance, IT, Manager, Vendor', link: '' }
    ];
    return UI.card('Exit Checklist — Lakshmi Venkat (CON-006)', UI.table(['Step', 'Owner', 'Live Status', 'Detail', 'Action'],
      steps.map(s => `<tr ${s.link ? `data-nav="${s.link}"` : ''}><td>${s.label}</td><td>${s.owner}</td><td>${UI.badge(s.status)}</td><td style="font-size:.8rem;color:var(--muted)">${s.detail}</td><td>${s.link ? `<a href="#${s.link}" class="btn btn-sm btn-secondary">Open Invoice</a>` : (s.status === 'Pending' || s.status === 'In Progress' ? '<button class="btn btn-sm btn-secondary">Nudge Owner</button>' : '—')}</td></tr>`)
    ) + UI.alert('info', 'Live status is tied to each owning team (IT, Finance, HR Ops) — not a shared checkbox. The final invoice line links to the actual invoice record.') +
    UI.alert('warning', 'Exit triggered for end date June 30, 2025. Notifications sent to Finance, IT, Manager, and Vendor Side Manager.') +
    '<div class="form-actions"><button class="btn btn-danger btn-sm">Revoke Access</button><button class="btn btn-primary btn-sm">Complete Exit & Archive</button></div>');
  },

  'bgv-tracker': () => UI.card('BGV Tracker', UI.table(['Contractor','Vendor','Initiated','Completed','Status','Verified By','Actions'],
    VMP_DATA.bgvRecords.map(b => `<tr data-nav="contractors/profile?id=${b.contractor_id}"><td>${VMP.getContractor(b.contractor_id)?.full_name}</td><td>${VMP.getVendor(b.vendor_id)?.vendor_name}</td><td>${VMP.formatDate(b.initiated_date)}</td><td>${VMP.formatDate(b.completed_date)}</td><td>${UI.badge(b.bgv_status)}</td><td>${VMP.getUser(b.verified_by)?.full_name||'—'}</td><td><button class="btn btn-sm btn-secondary">Upload Report</button></td></tr>`)
  )),

  // ========== ASSIGNMENTS & RATES ==========
  'assignments-list': () => UI.toolbar(['<button class="btn btn-secondary btn-sm">Export</button>']) +
    UI.alert('info', 'To transfer someone, pick their row below and click <strong>Transfer</strong> — the transfer flow opens pre-filled for that contractor. (No more standalone button without context.)') +
    UI.card('Assignments', UI.table(['Contractor','Project','Reporting Manager','Vendor','Start','End','Allocation','Status','Action'],
      VMP_DATA.assignments.filter(a => a.assignment_status === 'Active').map(a => `<tr data-nav="contractors/profile?id=${a.contractor_id}"><td><strong>${VMP.getContractor(a.contractor_id)?.full_name}</strong><br><span style="font-size:.72rem;color:var(--muted)">${VMP.getContractor(a.contractor_id)?.contractor_code}</span></td><td>${VMP.getProject(a.project_id)?.project_name} ${VMP.getProject(a.project_id)?.status==='Inactive'?'⚠':''}</td><td>${VMP.getUser(a.reporting_manager_id)?.full_name||'⚠ Missing'}</td><td>${VMP.getVendor(a.vendor_id)?.vendor_name}</td><td>${VMP.formatDate(a.start_date)}</td><td>${VMP.formatDate(a.end_date)}</td><td>${a.allocation_percentage}%</td><td>${UI.badge(a.assignment_status)}</td><td><a href="#assignments/transfer?contractor=${a.contractor_id}" class="btn btn-sm btn-primary">Transfer</a></td></tr>`)
    )),

  'assignments-transfer': () => {
    const selId = Router.getQueryParam('contractor');
    const selContractor = selId ? VMP.getContractor(selId) : null;
    const selBanner = selContractor
      ? UI.alert('info', `Transferring: <strong>${selContractor.full_name} (${selContractor.contractor_code})</strong> — selected from the assignments list.`)
      : UI.alert('warning', 'No contractor selected. Go to Assignments and click <strong>Transfer</strong> on a contractor row to start with context.');
    const contractorOptions = selContractor
      ? [{ label: `${selContractor.full_name} (${selContractor.contractor_code})`, selected: true }]
      : [{ label: 'Amit Joshi (CON-001)', selected: true }];
    const transferForm = UI.formGrid([
      { label: 'Contractor', type: 'select', options: contractorOptions },
      { label: 'Current Project', value: 'PRJ-101 Platform Modernization', disabled: true },
      { label: 'Current Manager', value: 'Vikram Mehta', disabled: true },
      { label: 'New Project', type: 'select', options: VMP_DATA.projects.filter(p=>p.status==='Active').map(p=>({label:p.project_name,selected:p.id==='p3'})) },
      { label: 'New Reporting Manager', type: 'select', options: VMP_DATA.users.filter(u=>u.role_id==='role-manager').map(u=>({label:u.full_name,selected:u.id==='u4'})) },
      { label: 'Effective Date', type: 'date', value: '2025-07-01' },
      { label: 'Reason', type: 'textarea', value: 'Project reallocation per business need', full: true }
    ]);
    const steps = ['Initiate Transfer','Select New Project/Manager','Approval','Close Old / Open New','Notify Stakeholders'];
    const panels = [
      UI.card('Initiate Transfer', selBanner + UI.formGrid([
        { label: 'Contractor', type: 'select', options: contractorOptions },
        { label: 'Reason', type: 'textarea', value: 'Project reallocation per business need', full: true }
      ]) + '<div class="form-actions"><button class="btn btn-primary">Next</button></div>'),
      UI.card('Select New Project/Manager', transferForm + '<div class="form-actions"><button class="btn btn-secondary">Back</button><button class="btn btn-primary">Submit for Approval</button></div>'),
      UI.card('Approval', UI.alert('info', 'Transfer pending HR and manager approval.') + UI.detailRows([
        { label: 'Contractor', value: 'Amit Joshi' }, { label: 'From', value: 'PRJ-101' }, { label: 'To', value: 'PRJ-103' }
      ])),
      UI.card('Close Old / Open New', UI.alert('success', 'On approval: old assignment closed, new assignment created with effective date.') +
        transferForm),
      UI.card('Notify Stakeholders', UI.timeline([
        { time: 'Pending', action: 'Notify old manager', detail: 'Vikram Mehta' },
        { time: 'Pending', action: 'Notify new manager', detail: 'Vikram Mehta' },
        { time: 'Pending', action: 'Notify Finance', detail: 'Rate/assignment validation' },
        { time: 'Pending', action: 'Notify Vendor', detail: 'Acme Staffing Solutions' }
      ]))
    ];
    return selBanner + UI.processFlow(steps, selContractor ? 0 : 1, { panels });
  },

  'rates-register': () => SH.renderRatesRegister(),

  'rates-create': () => {
    const rateForm = UI.formGrid([
      { label: 'Contractor', type: 'select', options: [{label:'Meera Iyer (CON-004)',selected:true}] },
      { label: 'Assignment', type: 'select', options: [{label:'— Not yet assigned'}] },
      { label: 'Rate Type', type: 'select', options: ['Monthly','Daily','Hourly'] },
      { label: 'Monthly Rate (INR)', value: '68000' }, { label: 'Currency', value: 'INR', disabled: true },
      { label: 'Effective From', type: 'date', value: '2025-04-01' }, { label: 'Effective To', value: '' },
      { label: 'Reason', type: 'textarea', value: 'Initial rate for new onboarding', full: true }
    ]) + UI.alert('warning', 'Overlap validation: no conflicting rate versions for same effective period.') +
    '<div class="form-actions"><button class="btn btn-secondary">Cancel</button><button class="btn btn-primary">Submit for Finance Approval</button></div>';
    const steps = ['Create Rate', 'Validate Assignment', 'Finance Approval', 'Activate', 'Lock Version'];
    const panels = [
      UI.card('Create Rate', rateForm),
      UI.card('Validate Assignment', UI.alert('info', 'System verifies active assignment and rate card alignment.') + rateForm),
      UI.card('Finance Approval', UI.alert('info', 'Finance reviews rate against active rate card and assignment.') + rateForm),
      UI.card('Activate', UI.alert('success', 'On approval, rate becomes active for billing period.') + rateForm),
      UI.card('Lock Version', UI.alert('warning', 'Approved rates are immutable — revisions create new versions.') + rateForm)
    ];
    return SH.workflowBanner('Contractor Rate Lifecycle', steps, 'Create Rate',
      'Rate must link to an active assignment. Finance approval required before activation. Approved rates become immutable.',
      panels);
  },

  'rates-history': () => {
    const id = Router.getQueryParam('id') || 'c1';
    const c = VMP.getContractor(id);
    const rates = VMP.getContractorRates(id);
    return UI.card(`Rate History — ${c?.full_name || id}`, UI.table(['Version','Old Rate','New Rate','Effective From','To','Approved By','Reason','Immutable'],
      rates.map((r, i) => {
        const prev = rates[i + 1];
        return `<tr><td>v${r.version}</td><td>${prev ? VMP.formatCurrency(prev.monthly_rate) : '—'}</td><td>${VMP.formatCurrency(r.monthly_rate)}</td><td>${VMP.formatDate(r.effective_from)}</td><td>${VMP.formatDate(r.effective_to)}</td><td>${VMP.getUser(r.approved_by)?.full_name||'—'}</td><td>Rate revision</td><td>${r.immutable ? '🔒 Yes' : 'No'}</td></tr>`;
      })
    ));
  },

  'reports-anomalies': () => UI.card('Reporting Anomaly Report', UI.table(['Contractor','Project','Expected Manager','Actual Manager','Type','Owner','Status','Actions'],
    VMP_DATA.anomalies.map(an => `<tr data-nav="contractors/profile?id=${an.contractor_id}"><td>${VMP.getContractor(an.contractor_id)?.full_name}</td><td>${an.current_project||'—'}</td><td>${an.expected_manager||'—'}</td><td>${an.actual_manager||'—'}</td><td>${an.anomaly_type}</td><td>${VMP.getUser(an.owner)?.full_name}</td><td>${UI.badge(an.status)}</td><td><button class="btn btn-sm btn-success" data-action="approve" data-id="${an.id}">Resolve</button></td></tr>`)
  )),

  'reports-operational': () => UI.card('Operational Reports', UI.table(['Report','Description','Actions'],
    [
      ['Contractor Rate Register', 'Current and historical rates by contractor, vendor, project', 'Run'],
      ['Assignment Movement Report', 'Contractors moved between projects and managers', 'Run'],
      ['Reporting Anomaly Report', 'Stale managers, missing rates, inactive projects', 'Run'],
      ['Finance Handoff Report', 'Approved rates and payable hours ready for finance', 'Run'],
      ['Audit Report', 'Complete change history for rates, assignments, approvals', 'Run']
    ].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td><a href="#reports/anomalies" class="btn btn-sm btn-primary">${r[2]}</a> <button class="btn btn-sm btn-secondary">Export PDF</button></td></tr>`)
  )),

  // ========== TIMESHEETS & LEAVE ==========
  'timesheets-upload': () => {
    const uploadForm = UI.formGrid([
      { label: 'Upload File (CSV/Excel)', value: 'timesheets_week24.xlsx' },
      { label: 'Period', value: 'Jun 2 – Jun 6, 2025' }, { label: 'Vendor / Project', type: 'select', options: ['Acme Staffing / All'] }
    ]) + UI.alert('info', 'System parses hours, cross-checks leave/holidays, and sends confirmation email to each contractor (manager CC\'d).') +
    '<div class="form-actions"><button class="btn btn-primary">Upload & Validate</button></div>';
    const resultsTable = UI.table(['Row','Contractor','Period','Hours','Leave Check','Holiday Check','Status'],
      [
        ['2', 'Amit Joshi', 'Jun 2–6', '40h', '✓', '✓', 'Success'],
        ['3', 'Meera Iyer', 'Jun 2–6', '40h', '✓', '✓', 'Success'],
        ['4', 'Raj Patel', 'Jun 2–6', '32h', '✗ Leave mismatch', '✓', 'Failed'],
        ['5', 'Sneha Nair', 'Jun 2–6', '40h', '✓', '✗ Holiday conflict', 'Failed']
      ].map(r => `<tr class="${r[6]==='Failed'?'row-blocked':''}"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>${UI.badge(r[6])}</td></tr>`)
    );
    const steps = ['HR Bulk Upload', 'Parse & Validate', 'Supervisor Approves', 'HR Ops Approves', 'Finance Batch'];
    const panels = [
      UI.card('HR Bulk Upload (backfill)', UI.alert('info', 'Normal flow: contractors submit their own hours. HR Ops uses bulk upload only to backfill / correct on behalf of contractors.') + uploadForm),
      UI.card('Parse & Validate', resultsTable + UI.detailRows([{ label: 'Total Rows', value: '24' }, { label: 'Parsed', value: '24' }, { label: 'Failed', value: '0' }])),
      UI.card('Supervisor Approves', resultsTable + UI.alert('info', 'Each contractor\'s reporting manager approves the hours first.')),
      UI.card('HR Ops Approves', resultsTable + UI.alert('warning', '2 rows have leave/holiday flags — resolve before HR approval.')),
      UI.card('Finance Batch', UI.alert('success', 'HR-approved hours will flow into finance payment batches.'))
    ];
    return SH.workflowBanner('Timesheet Upload (HR Ops)', steps, 'HR Bulk Upload',
      'HR Ops owns the timesheet process. Flow: Contractor Submits → Supervisor Approves → HR Ops Approves → Finance Reviews → Batch.',
      panels);
  },

  'timesheets-review': () => {
    const all = VMP_DATA.timesheets;
    const awaitingHr = all.filter(t => t.manager_approval_status === 'Supervisor Approved' && t.hr_approval_status !== 'HR Approved');
    const hrApproved = all.filter(t => t.hr_approval_status === 'HR Approved' || ['Confirmed', 'In Finance Batch', 'Paid'].includes(t.reconciliation_status));
    const queueTable = UI.table(['Contractor','Period','Hours','Supervisor','Leave Flag','Holiday Flag','Actions'],
      awaitingHr.map(t => `<tr class="${t.leave_mismatch || t.holiday_mismatch ? 'row-blocked' : ''}"><td>${VMP.getContractor(t.contractor_id)?.full_name}</td><td>${VMP.formatDate(t.work_period_start)} – ${VMP.formatDate(t.work_period_end)}</td><td>${t.submitted_hours}h</td><td>${UI.badge('Supervisor Approved')}</td><td>${t.leave_mismatch?'⚠ Yes':'—'}</td><td>${t.holiday_mismatch?'⚠ Yes':'—'}</td><td><button class="btn btn-sm btn-success" data-action="hr-approve-ts" data-id="${t.id}">HR Approve</button> <button class="btn btn-sm btn-danger" data-action="reject" data-type="Timesheet" data-id="${t.id}">Reject</button></td></tr>`),
      'No supervisor-approved timesheets awaiting HR approval.'
    );
    const doneTable = UI.table(['Contractor','Period','Hours','Supervisor','HR Ops','Status'],
      hrApproved.map(t => `<tr><td>${VMP.getContractor(t.contractor_id)?.full_name}</td><td>${VMP.formatDate(t.work_period_start)} – ${VMP.formatDate(t.work_period_end)}</td><td>${t.approved_hours || t.submitted_hours}h</td><td>${UI.badge('Supervisor Approved')}</td><td>${UI.badge('HR Approved')}</td><td>${UI.badge(t.reconciliation_status)}</td></tr>`),
      'None HR-approved yet.'
    );
    const steps = ['Contractor Submits', 'Supervisor Approves', 'HR Ops Approves', 'Finance Reviews', 'Finance Batch'];
    const stats = UI.statsGrid([
      { value: awaitingHr.length, label: 'Awaiting HR Approval', class: 'warning' },
      { value: hrApproved.length, label: 'HR Approved', class: 'success' },
      { value: awaitingHr.filter(t => t.leave_mismatch || t.holiday_mismatch).length, label: 'Flagged (resolve first)', class: 'danger' }
    ]);
    const panels = [
      UI.card('Contractor Submits', UI.alert('info', 'Contractors submit their own hours in the portal — HR Ops no longer uploads on their behalf by default.')),
      UI.card('Supervisor Approves', UI.alert('info', 'Reporting manager approves first, then it reaches HR Ops.')),
      UI.card('HR Ops Approves (You own this)', UI.alert('info', 'HR Ops is the process owner and approver for timesheets. You have edit/approve rights here.') + stats + queueTable),
      UI.card('Finance Reviews', UI.alert('info', 'Finance only does a read-only final check.') + doneTable),
      UI.card('Finance Batch', UI.alert('success', 'HR-approved hours flow into finance payment batches.') + doneTable)
    ];
    return SH.workflowBanner('Timesheet Review & Approval (HR Ops)', steps, 'HR Ops Approves',
      'HR Ops owns the timesheet process. Flow: Contractor Submits → Supervisor Approves → HR Ops Approves → Finance Reviews → Batch.',
      panels);
  },

  'leave-management': () => UI.tabs([
    { label: 'Leave Records', content: UI.table(['Contractor','Date','Type','Status','Approved By'],
      VMP_DATA.leaveRecords.map(l => `<tr><td>${VMP.getContractor(l.contractor_id)?.full_name}</td><td>${VMP.formatDate(l.leave_date)}</td><td>${l.leave_type}</td><td>${UI.badge(l.leave_status)}</td><td>${VMP.getUser(l.approved_by)?.full_name||'—'}</td></tr>`)
    )},
    { label: 'Runn Sync', content: UI.alert('success', 'Last sync: Today 06:00 AM — Success') + '<button class="btn btn-secondary btn-sm">Trigger Manual Sync</button>' }
  ]),

  'leave-holidays': () => UI.card('Holiday Calendar', UI.table(['Region','Date','Holiday','Year','Status','Actions'],
    VMP_DATA.holidays.map(h => `<tr><td>${h.region}</td><td>${VMP.formatDate(h.holiday_date)}</td><td>${h.holiday_name}</td><td>${h.calendar_year}</td><td>${UI.badge(h.status)}</td><td><button class="btn btn-sm btn-secondary">Edit</button></td></tr>`)
  ) + '<div class="form-actions"><button class="btn btn-primary btn-sm">+ Add Holiday</button><button class="btn btn-secondary btn-sm">Import Calendar</button></div>'),

  // ========== FINANCE ==========
  'finance-batches': () => SH.renderFinanceBatches(),

  'finance-batch-detail': () => {
    const id = Router.getQueryParam('id') || 'fb1';
    const b = VMP.getBatch(id);
    if (!b) return UI.alert('danger', 'Batch not found');
    const blocked = b.line_items.filter(l => l.blocked);
    const stepIdx = b.finance_status==='Paid'?4: blocked.length ? 2 : 3;
    const stats = UI.statsGrid([
      { value: b.line_items.length, label: 'Line Items' },
      { value: b.line_items.filter(l => !l.blocked).length, label: 'Ready to Pay', class: 'success' },
      { value: blocked.length, label: 'Blocked', class: 'danger' },
      { value: VMP.formatCurrency(b.total_amount), label: 'Batch Total' }
    ]);
    const batchDetail = (blocked.length ? UI.alert('danger', `${blocked.length} line item(s) blocked — resolve assignment/rate/manager inconsistencies before export.`) : UI.alert('success', 'All line items validated. Ready for finance review and export.')) +
    UI.card(`Batch ${b.id} — ${VMP.getVendor(b.vendor_id)?.vendor_name}`, UI.tabs([
      { label: `All Lines (${b.line_items.length})`, content: UI.table(['Contractor','Timesheet','Hours','Rate','Amount','Validation','Status'],
        b.line_items.map(li => {
          const c = VMP.getContractor(li.contractor_id);
          const r = VMP.getRate(li.rate_id);
          return `<tr class="${li.blocked ? 'row-blocked' : ''}"><td><span class="entity-link" data-nav="contractors/profile?id=${li.contractor_id}">${c?.full_name}</span><br><span style="font-size:.75rem;color:var(--muted)">${c?.contractor_code}</span></td><td>${li.timesheet_id}</td><td>${li.approved_hours}h</td><td>${VMP.formatCurrency(r?.monthly_rate||0)}/mo</td><td>${VMP.formatCurrency(li.amount)}</td><td>${li.exception_reason ? '<span style="color:#dc2626">' + li.exception_reason + '</span>' : 'Assignment ✓ Rate ✓ Manager ✓'}</td><td>${li.blocked?UI.badge('Blocked'):UI.badge('Ready')}</td></tr>`;
        })
      )},
      { label: 'Validation Rules', content: UI.detailRows([
        { label: 'Active Assignment', value: 'Each line must have active assignment on billing date' },
        { label: 'Approved Rate', value: 'Rate must be finance-approved and effective for period' },
        { label: 'Reporting Manager', value: 'Manager must be mapped and active in HR system' },
        { label: 'Timesheet Status', value: 'Only manager-approved hours included' }
      ])}
    ]) + UI.detailRows([
      { label: 'Billing Period', value: b.billing_period },
      { label: 'Total Hours', value: b.total_hours + 'h' }, { label: 'Total Amount', value: VMP.formatCurrency(b.total_amount) },
      { label: 'Status', value: UI.badge(b.finance_status) }, { label: 'Payment Ref', value: b.payment_reference || '—' }
    ]) + '<div class="form-actions"><button class="btn btn-secondary btn-sm">Remove Blocked Lines</button><button class="btn btn-primary btn-sm">Approve Batch</button><button class="btn btn-secondary btn-sm">Export Payment File</button></div>');

    const steps = ['Generate Batch','Validate Data','Flag Exceptions','Finance Review','Export & Pay'];
    const panels = [
      UI.card('Generate Batch', UI.alert('info', `Batch ${b.id} generated for ${b.billing_period}.`) + stats),
      UI.card('Validate Data', stats + batchDetail),
      UI.card('Flag Exceptions', stats + batchDetail),
      UI.card('Finance Review', stats + batchDetail),
      UI.card('Export & Pay', UI.detailRows([
        { label: 'Payment Status', value: UI.badge(b.finance_status) },
        { label: 'Payment Ref', value: b.payment_reference || 'Pending export' },
        { label: 'Total', value: VMP.formatCurrency(b.total_amount) }
      ]) + batchDetail)
    ];
    return UI.processFlow(steps, stepIdx, { panels });
  },

  'finance-invoices': () => {
    const invStats = UI.statsGrid([
      { value: VMP_DATA.invoices.filter(i => i.payment_status === 'Pending').length, label: 'Pending Payment', class: 'warning' },
      { value: VMP_DATA.invoices.filter(i => i.reconciliation_status === 'Blocked').length, label: 'Blocked', class: 'danger' },
      { value: VMP_DATA.invoices.filter(i => i.dual_approval_required).length, label: 'Dual Approval Required', class: 'warning' },
      { value: VMP.formatCurrency(VMP_DATA.invoices.reduce((s, i) => s + i.invoice_amount, 0)), label: 'Total Invoiced' }
    ]);
    const invTable = UI.table(['Invoice #','Vendor','Period','Amount','Tax','Reconciliation','Payment','Dual Approval','Vendor Approval','Actions'],
      VMP_DATA.invoices.map(i => `<tr data-nav="finance/invoice-reconcile?id=${i.id}"><td>${i.invoice_number}</td><td>${VMP.getVendor(i.vendor_id)?.vendor_name}</td><td>${VMP.formatDate(i.billing_period_start)} – ${VMP.formatDate(i.billing_period_end)}</td><td>${VMP.formatCurrency(i.invoice_amount)}</td><td>${VMP.formatCurrency(i.tax_amount)}</td><td>${UI.badge(i.reconciliation_status)}</td><td>${UI.badge(i.payment_status)}</td><td>${i.dual_approval_required?(i.approver1&&i.approver2?'✓ Both':i.approver1?'1/2 Pending':'⚠ Required'):'—'}</td><td>${UI.badge(i.vendor_approval_status)}</td><td><a href="#finance/invoice-reconcile?id=${i.id}" class="btn btn-sm btn-secondary">Review</a></td></tr>`)
    );
    const steps = ['Upload', 'Reconcile', 'Dual Approval', 'Vendor Approval', 'Payment'];
    const panels = [
      UI.card('Upload', UI.alert('info', 'Vendors upload invoices or finance uploads on their behalf.') + '<a href="#finance/invoice-upload" class="btn btn-sm btn-primary">Upload Invoice</a>'),
      UI.card('Reconcile', invStats + UI.card('Invoice Management', invTable)),
      UI.card('Dual Approval', invStats + invTable),
      UI.card('Vendor Approval', invTable),
      UI.card('Payment', invTable)
    ];
    return SH.workflowBanner('Invoice to Payment', steps, 'Reconcile',
      'Invoices above $10,000 USD require dual finance approval. Rate/hour mismatches block reconciliation.',
      panels);
  },

  'finance-invoice-upload': () => UI.card('Invoice Upload', UI.formGrid([
    { label: 'Vendor', type: 'select', options: [{label:'Acme Staffing Solutions',selected:true}] },
    { label: 'Invoice Number', value: 'INV-2025-051' }, { label: 'Invoice Date', type: 'date', value: '2025-06-18' },
    { label: 'Billing Period Start', type: 'date', value: '2025-06-01' }, { label: 'Billing Period End', type: 'date', value: '2025-06-15' },
    { label: 'Amount (INR)', value: '185000' }, { label: 'Tax Amount', value: '33300' },
    { label: 'PDF Upload', value: 'invoice_051.pdf' }
  ]) + '<div class="form-actions"><button class="btn btn-primary">Upload & Start Reconciliation</button></div>'),

  'finance-invoice-reconcile': () => SH.renderInvoiceReconcile(),

  'finance-invoice-approval': () => SH.renderInvoiceApproval(),
  'finance-invoice-payment': () => SH.renderInvoicePayment(),
  'finance-timesheet-review': () => SH.renderFinanceTimesheetReview(),

  // ========== INVOICE MANAGEMENT MODULE ==========
  'invoices-register': () => SH.renderInvoiceRegister(),
  'invoices-detail': () => SH.renderInvoiceDetail(),
  'invoices-batches': () => SH.renderInvoiceBatches(),
  'invoices-validation': () => SH.renderInvoiceSowValidation(),
  'invoices-ta-approval': () => SH.renderInvoiceTaApproval(),
  'invoices-raise': () => SH.renderRaiseInvoice(),

  'finance-rate-cards': () => SH.renderRateCardManagement(),

  'finance-rate-card-detail': () => SH.renderRateCardDetail(),

  'finance-reports': () => UI.card('Financial Reports — Q2 2025',
    UI.statsGrid([
      { value: VMP.formatCurrency(2450000), label: 'Total Spend' }, { value: VMP.formatCurrency(441000), label: 'Total Tax' },
      { value: VMP_DATA.vendors.filter(v => v.status === 'Active').length, label: 'Active Vendors' }, { value: VMP.formatCurrency(408333), label: 'Avg Monthly Cost' }
    ]) + UI.table(['Vendor','Contractors','Hours','Amount','Tax','% of Total','Status'],
      [
        ['Acme Staffing Solutions', 6, 960, 2145000, 386100, '87.6%', 'Paid'],
        ['TechTalent Partners', 1, 80, 185000, 33300, '7.6%', 'Pending'],
        ['Global IT Services', 0, 0, 0, 0, '0%', '—']
      ].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${VMP.formatCurrency(r[3])}</td><td>${VMP.formatCurrency(r[4])}</td><td>${r[5]}</td><td>${UI.badge(r[6] === 'Paid' ? 'Paid' : r[6] === 'Pending' ? 'Pending' : 'Draft')}</td></tr>`)
    ) + UI.alert('info', 'Export available: Vendor Spend Summary, Tax Report, Rate Card vs Actual Cost Variance.')),

  // ========== TAQ ORCHESTRATION ==========
  'taq-mfr': () => SH.renderMfrManagement(),
  'taq-job-orders': () => SH.renderTaqJobOrders(),
  'taq-candidate-routing': () => SH.renderTaqCandidateRouting(),
  'taq-pipeline': () => SH.renderTaqPipeline(),

  // ========== HR HIRING OPERATIONS ==========
  'hr-candidates': () => SH.renderHrCandidates(),
  'hr-interviews': () => SH.renderHrInterviews(),

  // ========== MANAGER ==========
  'manager-candidate-review': () => SH.renderManagerCandidateReview(),
  'manager-timesheets': () => SH.renderManagerTimesheets(),

  'manager-leave': () => {
    const pending = VMP_DATA.leaveRecords.filter(l => l.leave_status === 'Pending');
    return UI.card('Leave Approval Queue', pending.length ? UI.table(['Contractor','Dates','Type','Note','Actions'],
      pending.map(l =>
        `<tr><td>${VMP.getContractor(l.contractor_id)?.full_name}</td><td>${VMP.formatDate(l.leave_date)}</td><td>${l.leave_type}</td><td>—</td><td>${UI.approveRejectButtons('Leave',l.id)}</td></tr>`
      )
    ) : UI.alert('info', 'No pending leave requests'));
  },

  'manager-mfr': () => UI.card('New Manpower Request (MFR)', UI.formGrid([
    { label: 'Role Title', value: 'DevOps Engineer' }, { label: 'Skills Required', value: 'Kubernetes, CI/CD, Terraform' },
    { label: 'Headcount', value: '1' }, { label: 'Contract Duration', value: '12 months' },
    { label: 'Start Date Needed', type: 'date', value: '2025-08-01' }, { label: 'Urgency', type: 'select', options: ['Low','Medium','High'] },
    { label: 'Special Requirements', type: 'textarea', value: 'Must have AWS experience', full: true }
  ]) + '<div class="form-actions"><button class="btn btn-primary">Submit to TAQ</button></div>') +
  UI.card('My MFR Status', UI.table(['Role','Status','Submitted'],
    VMP_DATA.mfrs.filter(m => m.requested_by === 'u4').map(m => `<tr><td>${m.role_title}</td><td>${UI.badge(m.status)}</td><td>${VMP.formatDate(m.created_date)}</td></tr>`)
  )),

  'manager-performance': () => SH.renderQuarterlyRating(),
  'manager-performance-flag': () => SH.renderPerformanceFlag(),
  'hr-performance-concerns': () => SH.renderPerformanceConcerns(),

  // ========== CONTRACTOR PORTAL ==========
  'contractor-timesheet': () => {
    const uploadSection = UI.formGrid([
      { label: 'Upload Timesheet File (CSV/Excel)', value: 'timesheet_week_jun2.xlsx' },
      { label: 'Work Period', value: 'Jun 2 – Jun 6, 2025' },
      { label: 'Or enter hours manually', value: '(optional if file uploaded)' }
    ]) + UI.formGrid([
      { label: 'Mon (Jun 2)', value: '8' }, { label: 'Tue (Jun 3)', value: '8' },
      { label: 'Wed (Jun 4)', value: '8' }, { label: 'Thu (Jun 5)', value: '0', disabled: true },
      { label: 'Fri (Jun 6)', value: '8' }
    ]) + UI.alert('warning', 'Thu Jun 5 is Company Foundation Day (Holiday) — 0 hours expected.') +
    '<div class="form-actions"><button class="btn btn-primary">Upload & Submit Hours</button></div>';

    const payStatus = (t) => {
      if (t.reconciliation_status === 'Paid') return UI.badge('Paid');
      if (t.reconciliation_status === 'In Finance Batch') return UI.badge('In Payment Batch');
      if (t.reconciliation_status === 'Confirmed' || t.hr_approval_status === 'HR Approved') return UI.badge('Ready for Batch');
      return '<span style="color:var(--muted);font-size:.8rem">Not yet</span>';
    };
    const history = UI.card('My Timesheet History', UI.table(['Period','Hours','Supervisor','HR Ops','Payment Status'],
      VMP.getContractorTimesheets('c1').map(t => `<tr><td>${VMP.formatDate(t.work_period_start)} – ${VMP.formatDate(t.work_period_end)}</td><td>${t.submitted_hours}h</td><td>${UI.badge(t.manager_approval_status === 'Supervisor Approved' || t.manager_approval_status === 'Confirmed' ? 'Supervisor Approved' : t.manager_approval_status || 'Pending')}</td><td>${UI.badge(t.hr_approval_status || (t.reconciliation_status === 'Paid' || t.reconciliation_status === 'In Finance Batch' || t.reconciliation_status === 'Confirmed' ? 'HR Approved' : 'Pending'))}</td><td>${payStatus(t)}</td></tr>`),
      'No past timesheets yet.'
    ));

    const steps = ['Submit Hours', 'Supervisor Approves', 'HR Ops Approves', 'Finance Reviews', 'Payment'];
    const panels = [
      UI.card('Submit Timesheet — Week of Jun 2, 2025', uploadSection),
      UI.card('Supervisor Approves', UI.alert('info', 'Your reporting manager reviews and approves your hours — a real approval step, not just a CC. You will see the status update here.') + history),
      UI.card('HR Ops Approves', UI.alert('info', 'After your manager approves, HR Ops (process owner) approves before the hours are payable.') + history),
      UI.card('Finance Reviews', UI.alert('info', 'Finance does a read-only final check before payment.') + history),
      UI.card('Payment', history + UI.alert('success', 'Payment status for each submitted period is shown above.'))
    ];
    return SH.workflowBanner('Timesheet Submission', steps, 'Submit Hours',
      'You submit your own hours. Approval chain: Supervisor → HR Ops → Finance. Track approval and payment status per period below.',
      panels);
  },

  'contractor-documents': () => {
    const checklist = [
      { type: 'NDA', status: 'Verified', action: 'Download' },
      { type: 'ID Proof', status: 'Verified', action: 'Download' },
      { type: 'Bank Details', status: 'Verified', action: 'Download' },
      { type: 'Tax Forms', status: 'Pending Upload', action: 'Upload' },
      { type: 'BGV Consent', status: 'Verified', action: 'Download' }
    ].map(item => {
      const doc = VMP_DATA.documents.find(d => d.entity_id === 'c1' && d.document_type === item.type);
      if (doc) return { type: item.type, status: doc.status, action: doc.status === 'Pending Upload' || doc.status === 'Rejected' ? 'Upload' : 'Download' };
      return item;
    });
    return UI.card('Document Checklist', UI.table(['Document','Status','Actions'],
      checklist.map(d => {
        const verified = d.status === 'Verified';
        const primary = `<button class="btn btn-sm btn-secondary">${d.action}</button>`;
        const update = verified ? ` <button class="btn btn-sm btn-primary" data-action="reupload-doc" data-id="${d.type}">Update / Re-upload</button>` : '';
        return `<tr><td>${d.type}</td><td>${UI.badge(d.status)}</td><td>${primary}${update}</td></tr>`;
      })
    ) + UI.alert('info', 'Verified documents can be updated — e.g. if your bank account changes, use Update / Re-upload. The new copy goes back for re-verification.'));
  },

  'contractor-leave': () => {
    const bal = VMP.getContractorLeaveBalance('c1');
    const balCard = UI.card('My Leave Balance', UI.statsGrid([
      { value: bal.annual, label: 'Annual Days Left', class: 'success' },
      { value: bal.sick, label: 'Sick Days Left' },
      { value: bal.personal, label: 'Personal Days Left' }
    ]));
    return balCard + UI.card('Request Leave', UI.formGrid([
      { label: 'Leave Type', type: 'select', options: ['Personal','Sick','Annual'] },
      { label: 'Start Date', type: 'date', value: '2025-07-01' }, { label: 'End Date', type: 'date', value: '2025-07-02' },
      { label: 'Note', type: 'textarea', value: 'Personal commitment', full: true }
    ]) + '<div class="form-actions"><button class="btn btn-primary">Submit Request</button></div>') +
    UI.card('Leave History', UI.table(['Date','Type','Status','Action'],
      VMP_DATA.leaveRecords.filter(l=>l.contractor_id==='c1').map(l => `<tr><td>${VMP.formatDate(l.leave_date)}</td><td>${l.leave_type}</td><td>${UI.badge(l.leave_status)}</td><td>${l.leave_status === 'Pending' ? `<button class="btn btn-sm btn-danger" data-action="cancel-leave" data-id="${l.id}">Cancel / Withdraw</button>` : '—'}</td></tr>`),
      'No leave requests yet.'
    ));
  },

  // ========== VENDOR SIDE MANAGER ==========
  'dashboard-vendor': () => SH.renderVendorDashboard(),
  'vendor-job-orders': () => SH.renderVendorJobOrders(),
  'vendor-candidates': () => SH.renderVendorCandidates(),
  'vendor-contractors': () => SH.renderVendorContractors(),
  'vendor-onboarding': () => SH.renderVendorOnboarding(),
  'vendor-sow-compliance': () => SH.renderVendorSowCompliance(),
  'vendor-invoices': () => SH.renderVendorInvoices(),
  'vendor-performance': () => SH.renderVendorPerformance(),
  'vendor-reports': () => SH.renderVendorReports(),

  // ========== SHARED ==========
  'shared-documents': () => SH.renderDocumentRepository(),

  'shared-agreements': () => UI.card('Digital Agreements', UI.table(['Entity','Title','Version','Status','Signed Date','Signed By','Actions'],
    VMP_DATA.agreements.map(a => `<tr><td>${a.entity_type} ${a.entity_id}</td><td>${a.title}</td><td>v${a.version}</td><td>${UI.badge(a.status)}</td><td>${VMP.formatDate(a.signed_date)}</td><td>${a.signed_by.join(', ')||'—'}</td><td><button class="btn btn-sm btn-secondary">View</button></td></tr>`)
  ) + '<div class="form-actions"><button class="btn btn-primary btn-sm">+ Create Agreement</button></div>'),

  'system-diagram': () => `<div style="padding:1rem">${UI.alert('info', 'TAQ is the orchestrator and system admin — not the operational hiring owner. HR Ops schedules interviews, sends offers, and runs onboarding/BGV.')}<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:1rem">
    ${['TAQ Orchestrator / System Admin','HR Operations','Finance',"Contractor's Manager",'Vendor Side Manager','Contractor'].map((a,i) =>
      `<div class="card" style="border-top:4px solid ${['#7c3aed','#2563eb','#dc2626','#ea580c','#0891b2','#16a34a'][i]}"><div class="card-body"><strong>${a}</strong><ul style="font-size:.8rem;margin-top:.5rem;padding-left:1.2rem">${{
        'TAQ Orchestrator / System Admin': ['MFR intake & post job orders to vendors','Route vendor profiles to managers','Monitor end-to-end pipeline','System admin: users, roles, config','Does NOT interview, onboard, or run BGV'],
        'HR Operations': ['Schedule interviews after manager selection','Send offers & contractor onboarding','BGV, documents, assignments','Vendor registration & compliance','Approved hours → Finance'],
        'Finance': ['Rate history','Invoice generation','Payment batches','Dual approval >$10K'],
        "Contractor's Manager": ['Raise MFR to TAQ','Review forwarded candidate profiles','Select candidates needed','Timesheet approval','Performance ratings'],
        'Vendor Side Manager': ['Respond to job orders','Shortlist & submit candidates','Onboarding/offboarding coordination','SOW compliance','Approve payments'],
        'Contractor': ['Document submission','Timesheet entry','Leave requests','Portal access']
      }[a].map(x=>`<li>${x}</li>`).join('')}</ul></div></div>`
    ).join('')}
  </div><div class="card" style="margin-top:1rem"><div class="card-header"><h3>Key Flows</h3></div><div class="card-body"><ol style="font-size:.875rem;line-height:2">
    <li><strong>Hiring Orchestration:</strong> Manager MFR → TAQ posts to vendor → Vendor shortlists → TAQ routes to manager → Manager selects → <strong>HR schedules interview</strong> → HR offer & onboarding</li>
    <li><strong>Hire to Pay:</strong> Active contractor → Rate → Timesheet Confirmation → Finance Batch → Invoice → <strong>Vendor Payment Approval</strong></li>
    <li><strong>Transfer:</strong> Assignment Transfer → Approval → Close Old / Open New → Update Reporting Manager → Clear Anomaly</li>
    <li><strong>Exit:</strong> End Date Trigger → Vendor & HR Exit Checklist → Access Revoke → Final Timesheet → Archive</li>
  </ol></div></div></div>`
};

// Handle profile route
Screens['admin-profile'] = Screens['profile'];
