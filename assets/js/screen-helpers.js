/** Role-aware screen content helpers — rich demo UI tied to workflows */
const SH = {
  /** Contractors visible to current actor */
  contractors() {
    const role = VMP.currentRole;
    if (role === 'vendor') return VMP.getVendorContractors(VMP.getCurrentVendorId());
    if (role === 'manager') return VMP.getManagerTeam(NAV_CONFIG.manager.userId);
    if (role === 'contractor') return [VMP.getContractor('c1')].filter(Boolean);
    return VMP_DATA.contractors;
  },

  /** Timesheets scoped to current actor */
  timesheets() {
    const role = VMP.currentRole;
    if (role === 'manager') {
      const teamIds = SH.contractors().map(c => c.id);
      return VMP_DATA.timesheets.filter(t => teamIds.includes(t.contractor_id));
    }
    if (role === 'contractor') return VMP_DATA.timesheets.filter(t => t.contractor_id === 'c1');
    return VMP_DATA.timesheets;
  },

  /** Rates scoped to role */
  rates() {
    const role = VMP.currentRole;
    if (role === 'manager') {
      const teamIds = SH.contractors().map(c => c.id);
      return VMP_DATA.rates.filter(r => teamIds.includes(r.contractor_id));
    }
    return VMP_DATA.rates;
  },

  /** Rate cards — finance sees all; others read-only subset */
  rateCards() {
    return VMP_DATA.rateCards;
  },

  /** Pending finance approvals for current role */
  pendingApprovals() {
    return VMP.getPendingApprovals(VMP.currentRole);
  },

  roleContext() {
    const map = {
      finance: {
        title: 'Finance Operations',
        desc: 'Manage vendor rate cards, validate contractor rates, reconcile timesheets, generate payment batches, and approve invoices. Dual approval required above $10,000 USD.',
        workflow: 'Rate Card → Contractor Rate → Timesheet → Manager Approval → Finance Batch → Invoice → Payment'
      },
      taq: {
        title: 'TAQ Orchestrator / System Admin',
        desc: 'Orchestrates hiring: intake MRFs, post job positions to vendors, route vendor-shortlisted profiles to managers, monitor pipeline status. Does not schedule interviews, onboard candidates, or run BGV.',
        workflow: 'MRF → Post to Vendor → Vendor Shortlist → Route to Manager → HR: Interview → HR: Onboarding'
      },
      hr: {
        title: 'HR Operations',
        desc: 'Operational hiring: schedule interviews after manager selection, send offers, contractor onboarding, BGV, documents, assignments, and hand approved hours to Finance.',
        workflow: 'Manager Selection → HR Schedules Interview → Offer → Onboarding → BGV → Assignment → Active'
      },
      manager: {
        title: "Contractor's Manager",
        desc: 'View team timesheet confirmations (CC\'d on email), submit MRFs, and rate performance. V1: no in-app timesheet approve/reject — contractor confirms via email.',
        workflow: 'Timesheet Confirmation (CC) → View Recorded Status → Finance Payment'
      },
      contractor: {
        title: 'Contractor Portal',
        desc: 'Upload timesheet file or enter hours, confirm via email (manager CC\'d), upload documents, request leave.',
        workflow: 'Upload Hours → Confirmation Email → Yes/No → Recorded → Finance Payment'
      },
      vendor: {
        title: 'Vendor Side Manager — Acme Staffing Solutions',
        desc: 'Respond to TA job orders, shortlist and submit candidates from your bench, coordinate onboarding/offboarding with HR, ensure SOW compliance, approve payments.',
        workflow: 'Job Order → Shortlist & Submit → (TA routes to Manager) → HR Onboarding → Active'
      }
    };
    return map[VMP.currentRole] || { title: 'VMP', desc: '', workflow: '' };
  },

  workflowBanner(name, steps, currentStep, note, panels) {
    const idx = Math.max(0, steps.indexOf(currentStep));
    const resolvedPanels = panels || steps.map(step =>
      UI.card(step, `<p style="font-size:.875rem;color:var(--muted)">${name} — <strong>${step}</strong></p>`)
    );
    return UI.processFlow(steps, idx, { note, panels: resolvedPanels });
  },

  _mrfTable() {
    return UI.table(['MRF ID','Role','Requested By','Headcount','Urgency','Status','Job Order','Date','Actions'],
      VMP_DATA.mrfs.map(m => `<tr><td>${m.id}</td><td>${m.role_title}</td><td>${VMP.getUser(m.requested_by)?.full_name}</td><td>${m.headcount}</td><td>${UI.badge(m.urgency)}</td><td>${UI.badge(m.status)}</td><td>${m.open_position_id||'—'}</td><td>${VMP.formatDate(m.created_date)}</td><td>${m.status==='Raised'?'<button class="btn btn-sm btn-primary">Convert to Job Order</button>':'—'}</td></tr>`)
    );
  },

  renderMrfManagement() {
    const steps = ['MRF Raised', 'TAQ Review', 'Post to Vendor', 'Vendor Shortlist', 'Route to Manager', 'HR Takes Over'];
    const note = 'TAQ orchestrates only — does not interview or onboard. After routing profiles to the manager, HR Ops schedules interviews and runs onboarding/BGV.';
    const panels = [
      UI.card('MRF Raised', UI.alert('info', 'Managers submit manpower requests with role, skills, and headcount.') + SH._mrfTable()),
      UI.card('TAQ Review', UI.alert('info', 'TAQ validates budget, skills match, and project alignment before posting to vendors.') + SH._mrfTable()),
      UI.card('Post to Vendor', UI.alert('info', 'TAQ creates open position and issues job orders to approved vendors.') +
        '<a href="#taq/job-orders" class="btn btn-sm btn-primary">Post Positions to Vendors</a>' +
        UI.table(['Title','Project','Skills','Status'],
          VMP_DATA.openPositions.filter(o => o.status !== 'Filled').map(o =>
            `<tr><td>${o.position_title}</td><td>${VMP.getProject(o.project_id)?.project_name}</td><td>${o.skill_set}</td><td>${UI.badge(o.status)}</td></tr>`)
        )),
      UI.card('Vendor Shortlist', UI.alert('info', 'Vendors submit shortlisted profiles from their bench. TAQ monitors submissions — does not interview.') +
        UI.table(['Candidate','Vendor','Job Order','AI Score','Status'],
          VMP_DATA.candidates.filter(c => c.stage === 'Submitted').map(c =>
            `<tr><td>${c.name}</td><td>${VMP.getVendor(c.vendor_id)?.vendor_name}</td><td>${c.job_order_id}</td><td>${c.ai_score}/100</td><td>${UI.badge(c.stage)}</td></tr>`)
        )),
      UI.card('Route to Manager', UI.alert('info', 'TAQ forwards vendor profiles to the hiring manager for review and selection.') +
        '<a href="#taq/candidate-routing" class="btn btn-sm btn-primary">Route Profiles to Manager</a>' +
        UI.table(['Candidate','Forwarded To','Status'],
          VMP_DATA.candidates.filter(c => ['Forwarded to Manager','Manager Selected'].includes(c.stage)).map(c =>
            `<tr><td>${c.name}</td><td>${VMP.getUser(c.forwarded_to_manager_id)?.full_name||'—'}</td><td>${UI.badge(c.stage)}</td></tr>`)
        )),
      UI.card('HR Takes Over', UI.alert('success', 'Once manager selects candidates, HR Ops schedules interviews, sends offers, and runs onboarding/BGV. TAQ monitors status in Pipeline View only.') +
        '<a href="#taq/pipeline" class="btn btn-sm btn-secondary">View End-to-End Pipeline</a>')
    ];
    return SH.workflowBanner('TAQ Orchestration', steps, 'TAQ Review', note, panels);
  },

  renderTaqJobOrders() {
    const orders = VMP_DATA.jobOrders;
    const openPos = VMP_DATA.openPositions.filter(o => o.status !== 'Filled');
    return SH.workflowBanner('Post Position to Vendor', ['MRF Approved', 'Create Position', 'Select Vendors', 'Issue Job Order', 'Vendor Responds'],
      'Issue Job Order', 'When MRF is approved, TAQ posts the job position to selected vendors. Vendors shortlist candidates from their own company.') +
    UI.statsGrid([
      { value: orders.length, label: 'Active Job Orders' },
      { value: orders.filter(j => j.response_status === 'Pending Response').length, label: 'Awaiting Vendor', class: 'warning' },
      { value: openPos.length, label: 'Open Positions' }
    ]) + UI.card('Issue Job Order to Vendor', UI.formGrid([
      { label: 'Open Position', type: 'select', options: openPos.map(o => ({ label: o.position_title + ' — ' + VMP.getProject(o.project_id)?.project_code, selected: o.id === 'op1' })) },
      { label: 'Vendor', type: 'select', options: VMP_DATA.vendors.filter(v => v.status === 'Active').map(v => ({ label: v.vendor_name, selected: v.id === 'v1' })) },
      { label: 'Headcount Needed', value: '1' },
      { label: 'Response Due Date', type: 'date', value: '2025-07-15' },
      { label: 'Notes to Vendor', type: 'textarea', value: 'Please shortlist qualified candidates from your bench matching the skill requirements.', full: true }
    ]) + '<div class="form-actions"><button class="btn btn-primary">Post to Vendor</button></div>') +
    UI.card('Active Job Orders', UI.table(['Job Order', 'Position', 'Vendor', 'Headcount', 'Due', 'Submitted', 'Status', 'Actions'],
      orders.map(jo => {
        const op = VMP_DATA.openPositions.find(o => o.id === jo.open_position_id);
        return `<tr><td><strong>${jo.id}</strong></td><td>${op?.position_title||'—'}</td><td>${VMP.getVendor(jo.vendor_id)?.vendor_name}</td><td>${jo.headcount_needed}</td><td>${VMP.formatDate(jo.due_date)}</td><td>${jo.candidates_submitted||0}</td><td>${UI.badge(jo.response_status)}</td><td>${jo.response_status==='Pending Response'?UI.alert('info','Waiting for vendor shortlist').replace(/<[^>]*>/g,''):'—'}</td></tr>`;
      })
    ));
  },

  renderTaqCandidateRouting() {
    const submitted = VMP_DATA.candidates.filter(c => c.stage === 'Submitted');
    const forwarded = VMP_DATA.candidates.filter(c => c.stage === 'Forwarded to Manager');
    return SH.workflowBanner('Route Profiles to Manager', ['Vendor Submits', 'TAQ Reviews Profile', 'Forward to Manager', 'Manager Selects', 'HR Schedules Interview'],
      'TAQ Reviews Profile', 'TAQ does not interview candidates. Forward vendor-shortlisted profiles to the contractor\'s manager for review.') +
    UI.statsGrid([
      { value: submitted.length, label: 'Awaiting TAQ Routing', class: 'warning' },
      { value: forwarded.length, label: 'With Manager', class: 'warning' },
      { value: VMP_DATA.candidates.filter(c => c.stage === 'Manager Selected').length, label: 'Manager Selected', class: 'success' }
    ]) + UI.card('Vendor Submissions — Route to Manager', submitted.length ? UI.table(['Candidate', 'Vendor', 'Job Order', 'Skills Match', 'AI Score', 'Assign Manager', 'Actions'],
      submitted.map(c => {
        const op = VMP_DATA.openPositions.find(o => o.id === VMP_DATA.jobOrders.find(j => j.id === c.job_order_id)?.open_position_id);
        const mrf = VMP_DATA.mrfs.find(m => m.open_position_id === op?.id);
        const managerId = mrf?.requested_by || 'u4';
        return `<tr>
          <td><strong>${c.name}</strong><br><span style="font-size:.75rem;color:var(--muted)">${c.email}</span></td>
          <td>${VMP.getVendor(c.vendor_id)?.vendor_name}</td>
          <td>${c.job_order_id}</td>
          <td style="font-size:.8rem">${op?.skill_set||'—'}</td>
          <td>${c.ai_score}/100</td>
          <td>${VMP.getUser(managerId)?.full_name}</td>
          <td><button class="btn btn-sm btn-primary" data-action="forward-candidate" data-id="${c.id}" data-manager="${managerId}">Forward to Manager</button></td>
        </tr>`;
      })
    ) : UI.alert('success', 'No vendor submissions awaiting routing.')) +
    UI.card('Already Forwarded', UI.table(['Candidate', 'Manager', 'Forwarded', 'Manager Status'],
      [...forwarded, ...VMP_DATA.candidates.filter(c => c.stage === 'Manager Selected')].map(c =>
        `<tr><td>${c.name}</td><td>${VMP.getUser(c.forwarded_to_manager_id)?.full_name}</td><td>Yes</td><td>${UI.badge(c.stage)}</td></tr>`)
    )) + UI.alert('info', 'After manager selects candidates, HR Ops will schedule interviews. TAQ does not perform interview scheduling.');
  },

  renderTaqPipeline() {
    const stages = ['Submitted', 'Forwarded to Manager', 'Manager Selected', 'Interview Scheduled', 'Offer Sent', 'Onboarded'];
    return SH.actorBanner() + SH.workflowBanner('End-to-End Orchestration View', stages, 'Forwarded to Manager',
      'Read-only monitoring for TAQ. Operational steps (interviews, onboarding, BGV) are owned by HR Ops.', [
      UI.card('Pipeline Monitor', UI.kanban(stages.map(stage => ({
        title: stage,
        cards: VMP_DATA.candidates.filter(c => c.stage === stage).map(c => ({
          name: c.name,
          meta: VMP.getVendor(c.vendor_id)?.vendor_code + ' · ' + c.job_order_id,
          badge: c.stage
        }))
      })))),
      UI.card('Role Boundaries', UI.detailRows([
        { label: 'TAQ Orchestrator', value: 'MRF intake, post to vendors, route profiles to manager, monitor pipeline' },
        { label: 'Vendor', value: 'Shortlist candidates from own company, submit profiles' },
        { label: "Contractor's Manager", value: 'Review forwarded profiles, select candidates needed' },
        { label: 'HR Operations', value: 'Schedule interviews, send offers, onboarding, BGV, assignments' },
        { label: 'Finance', value: 'Rates, timesheets, invoices, payment batches' }
      ])),
      UI.card('All Candidates — Status', UI.table(['Candidate', 'Vendor', 'Stage', 'Owner', 'Next Action'],
        VMP_DATA.candidates.map(c => {
          const owner = { 'Submitted': 'TAQ', 'Forwarded to Manager': 'Manager', 'Manager Selected': 'HR Ops', 'Interview Scheduled': 'HR Ops', 'Interview Complete': 'HR Ops', 'Offer Sent': 'HR Ops', 'Onboarded': 'Complete' }[c.stage] || '—';
          const next = { 'Submitted': 'TAQ routes to manager', 'Forwarded to Manager': 'Manager reviews profile', 'Manager Selected': 'HR schedules interview', 'Interview Scheduled': 'HR conducts interview', 'Offer Sent': 'HR onboarding', 'Onboarded': '—' }[c.stage] || '—';
          return `<tr><td>${c.name}</td><td>${VMP.getVendor(c.vendor_id)?.vendor_code}</td><td>${UI.badge(c.stage)}</td><td>${owner}</td><td>${next}</td></tr>`;
        })
      ))
    ]);
  },

  renderHrCandidates() {
    const hrStages = ['Manager Selected', 'Interview Scheduled', 'Interview Complete', 'Offer Sent'];
    return SH.workflowBanner('HR Candidate Pipeline', ['Manager Selected', 'Schedule Interview', 'Interview Complete', 'Send Offer', 'Hand to Onboarding'],
      'Schedule Interview', 'HR Ops owns interviews and offers after manager selection. TAQ only orchestrates routing.') +
    UI.card('Candidates Awaiting HR Action', UI.table(['Candidate', 'Vendor', 'Manager', 'Stage', 'Interview', 'Actions'],
      VMP_DATA.candidates.filter(c => hrStages.includes(c.stage) || c.stage === 'Onboarded').map(c => {
        const int = VMP_DATA.interviewSchedules?.find(i => i.candidate_id === c.id);
        return `<tr>
          <td>${c.name}</td><td>${VMP.getVendor(c.vendor_id)?.vendor_name}</td>
          <td>${VMP.getUser(c.forwarded_to_manager_id)?.full_name||'—'}</td>
          <td>${UI.badge(c.stage)}</td>
          <td>${int?.interview_date ? VMP.formatDate(int.interview_date) + ' ' + (int.interview_time||'') : '—'}</td>
          <td>
            ${c.stage === 'Manager Selected' ? '<a href="#hr/interviews" class="btn btn-sm btn-primary">Schedule Interview</a>' : ''}
            ${c.stage === 'Interview Complete' || c.stage === 'Interview Scheduled' ? '<button class="btn btn-sm btn-primary">Send Offer</button>' : ''}
            ${c.stage === 'Offer Sent' ? '<a href="#contractors/onboarding" class="btn btn-sm btn-secondary">Start Onboarding</a>' : ''}
          </td>
        </tr>`;
      })
    )) + UI.card('Pipeline', UI.kanban(hrStages.map(s => ({
      title: s,
      cards: VMP_DATA.candidates.filter(c => c.stage === s).map(c => ({ name: c.name, meta: VMP.getVendor(c.vendor_id)?.vendor_code, badge: c.stage }))
    }))));
  },

  renderHrInterviews() {
    const pending = VMP_DATA.candidates.filter(c => c.stage === 'Manager Selected');
    const selectedId = Router.getQueryParam('candidate') || pending[0]?.id;
    const selected = VMP_DATA.candidates.find(c => c.id === selectedId) || pending[0];
    const scheduled = VMP_DATA.interviewSchedules?.filter(i => i.status === 'Scheduled') || [];
    return SH.workflowBanner('Interview Scheduling', ['Manager Selected', 'HR Schedules', 'Interview Conducted', 'Feedback to TAQ', 'Offer Decision'],
      'HR Schedules', 'Only HR Ops schedules interviews — not TAQ. Manager must have selected the candidate first.') +
    UI.card('Schedule Interview', pending.length ? UI.table(['Candidate', 'Hiring Manager', 'Job Order', 'Actions'],
      pending.map(c => `<tr>
        <td><strong>${c.name}</strong></td>
        <td>${VMP.getUser(c.forwarded_to_manager_id)?.full_name}</td>
        <td>${c.job_order_id}</td>
        <td><button class="btn btn-sm btn-primary" data-action="open-schedule" data-id="${c.id}">Schedule Interview</button></td>
      </tr>`)
    ) : UI.alert('success', 'No candidates awaiting interview scheduling.')) +
    UI.card('Schedule Form — ' + (selected?.name || 'Select candidate'), UI.formGrid([
      { label: 'Candidate', value: selected?.name || '—', disabled: true },
      { label: 'Interview Date', type: 'date', value: '2025-06-28' },
      { label: 'Interview Time', value: '10:00 AM' },
      { label: 'Mode', type: 'select', options: ['Video', 'In-Person', 'Phone'] },
      { label: 'Interviewer (Manager)', value: selected ? VMP.getUser(selected.forwarded_to_manager_id)?.full_name : '—', disabled: true },
      { label: 'Notes', type: 'textarea', value: 'Technical + culture fit round', full: true }
    ]) + '<div class="form-actions"><button class="btn btn-primary" data-action="confirm-schedule" data-candidate="' + (selected?.id || '') + '">Confirm Schedule</button></div>') +
    UI.card('Scheduled Interviews', UI.table(['Candidate', 'Date', 'Time', 'Mode', 'Interviewer', 'Status'],
      scheduled.map(i => {
        const c = VMP_DATA.candidates.find(x => x.id === i.candidate_id);
        return `<tr><td>${c?.name}</td><td>${VMP.formatDate(i.interview_date)}</td><td>${i.interview_time}</td><td>${i.mode}</td><td>${i.interviewer}</td><td>${UI.badge(i.status)}</td></tr>`;
      })
    ));
  },

  renderManagerCandidateReview() {
    const pending = VMP_DATA.candidates.filter(c => c.stage === 'Forwarded to Manager' && c.forwarded_to_manager_id === 'u4');
    const allForwarded = VMP_DATA.candidates.filter(c => c.forwarded_to_manager_id === 'u4' && ['Forwarded to Manager','Manager Selected','Interview Scheduled','Offer Sent','Onboarded'].includes(c.stage));
    return SH.workflowBanner('Profile Review', ['TAQ Forwards Profile', 'Manager Reviews', 'Manager Selects', 'HR Schedules Interview'],
      'Manager Reviews', 'Review candidate profiles forwarded by TAQ. Select who you need — HR Ops will schedule interviews.') +
    UI.card('Profiles Awaiting Your Review', pending.length ? UI.table(['Candidate', 'Vendor', 'Job Order', 'AI Score', 'Skills', 'Actions'],
      pending.map(c => {
        const op = VMP_DATA.openPositions.find(o => o.id === VMP_DATA.jobOrders.find(j => j.id === c.job_order_id)?.open_position_id);
        return `<tr>
          <td><strong>${c.name}</strong><br><span style="font-size:.75rem;color:var(--muted)">${c.email}</span></td>
          <td>${VMP.getVendor(c.vendor_id)?.vendor_name}</td>
          <td>${op?.position_title||c.job_order_id}</td>
          <td>${c.ai_score}/100</td>
          <td style="font-size:.8rem">${op?.skill_set||'—'}</td>
          <td>
            <button class="btn btn-sm btn-success" data-action="select-candidate" data-id="${c.id}">Select Candidate</button>
            <button class="btn btn-sm btn-danger" data-action="reject-candidate" data-id="${c.id}">Not Needed</button>
          </td>
        </tr>`;
      })
    ) : UI.alert('success', 'No profiles awaiting your review.')) +
    UI.card('My Candidate Decisions', UI.table(['Candidate', 'Vendor', 'Your Decision', 'Current Stage', 'Next Step'],
      allForwarded.map(c => `<tr>
        <td>${c.name}</td><td>${VMP.getVendor(c.vendor_id)?.vendor_name}</td>
        <td>${c.manager_selected ? UI.badge('Selected') : c.stage === 'Forwarded to Manager' ? UI.badge('Pending') : '—'}</td>
        <td>${UI.badge(c.stage)}</td>
        <td>${c.stage === 'Manager Selected' ? 'HR schedules interview' : c.stage === 'Forwarded to Manager' ? 'Awaiting your review' : '—'}</td>
      </tr>`)
    )) + UI.alert('info', 'You do not schedule interviews — once you select a candidate, HR Ops will coordinate scheduling.');
  },

  actorBanner() {
    const ctx = SH.roleContext();
    if (!ctx.desc) return '';
    return UI.card(ctx.title, `<p style="font-size:.875rem;color:var(--muted);margin-bottom:.75rem">${ctx.desc}</p>
      <div style="font-size:.8rem"><strong>Key workflow:</strong> ${ctx.workflow}</div>`);
  },

  // ---- FINANCE: Rate Card Management ----
  renderRateCardManagement() {
    const cards = SH.rateCards();
    const active = cards.filter(c => c.status === 'Active');
    const pending = cards.filter(c => c.approval_status === 'Pending Finance');
    const expiring = cards.filter(c => c.status === 'Expiring Soon');

    const stats = UI.statsGrid([
      { value: active.length, label: 'Active Rate Cards' },
      { value: pending.length, label: 'Pending Approval', class: 'warning' },
      { value: expiring.length, label: 'Expiring in 30 Days', class: 'warning' },
      { value: cards.reduce((s, c) => s + (c.contractors_using || 0), 0), label: 'Contractors Mapped' }
    ]);

    const activeTable = UI.table(
      ['Vendor', 'Role / Skills', 'Region', 'Bill Rate', 'Pay Rate', 'Margin', 'OT/hr', 'Effective', 'Status', 'Using'],
      active.map(r => {
        const v = VMP.getVendor(r.vendor_id);
        return `<tr data-nav="finance/rate-card-detail?id=${r.id}">
          <td><strong>${v?.vendor_name}</strong><br><span style="font-size:.75rem;color:var(--muted)">${v?.vendor_code}</span></td>
          <td><strong>${r.role}</strong><br><span style="font-size:.75rem;color:var(--muted)">${r.skills || '—'}</span></td>
          <td>${r.region || '—'}</td>
          <td>₹${r.bill_rate.toLocaleString('en-IN')}/day</td>
          <td>₹${r.pay_rate.toLocaleString('en-IN')}/day</td>
          <td><span class="chip">${r.margin_pct || Math.round((1 - r.pay_rate / r.bill_rate) * 100)}%</span></td>
          <td>₹${r.overtime_rate}/hr</td>
          <td>${VMP.formatDate(r.effective_from)}${r.effective_to ? ' – ' + VMP.formatDate(r.effective_to) : ' → ongoing'}</td>
          <td>${UI.badge(r.status)} v${r.version || 1}</td>
          <td>${r.contractors_using || 0}</td>
        </tr>`;
      }),
      'No active rate cards'
    );

    const pendingTable = pending.length ? UI.table(
      ['Vendor', 'Role', 'Proposed Bill', 'Proposed Pay', 'Requested By', 'Submitted', 'Actions'],
      pending.map(r => `<tr>
        <td>${VMP.getVendor(r.vendor_id)?.vendor_name}</td>
        <td>${r.role}</td>
        <td>₹${r.bill_rate.toLocaleString('en-IN')}/day</td>
        <td>₹${r.pay_rate.toLocaleString('en-IN')}/day</td>
        <td>${VMP.getUser(r.requested_by)?.full_name || 'Vendor Manager'}</td>
        <td>${VMP.formatDate(r.submitted_date)}</td>
        <td>${UI.approveRejectButtons('Rate Card', r.id)}</td>
      </tr>`)
    ) : UI.alert('success', 'No rate cards pending finance approval.');

    const historyTable = UI.table(
      ['Vendor', 'Role', 'Version', 'Bill Rate', 'Effective From', 'Superseded On', 'Approved By'],
      (VMP_DATA.rateCardHistory || []).map(h => `<tr>
        <td>${VMP.getVendor(h.vendor_id)?.vendor_name}</td>
        <td>${h.role}</td>
        <td>v${h.version}</td>
        <td>₹${h.bill_rate.toLocaleString('en-IN')}/day</td>
        <td>${VMP.formatDate(h.effective_from)}</td>
        <td>${VMP.formatDate(h.superseded_on) || '—'}</td>
        <td>${VMP.getUser(h.approved_by)?.full_name || '—'}</td>
      </tr>`)
    );

    const createForm = UI.formGrid([
      { label: 'Vendor', type: 'select', options: VMP_DATA.vendors.filter(v => v.status === 'Active').map(v => ({ label: v.vendor_name, selected: v.id === 'v1' })) },
      { label: 'Role Title', value: 'Cloud Architect' },
      { label: 'Skills / Level', value: 'AWS, Terraform, 8+ years' },
      { label: 'Region', type: 'select', options: VMP_DATA.config.regions.map((r, i) => ({ label: r, selected: i === 1 })) },
      { label: 'Bill Rate (INR/day)', value: '12000' },
      { label: 'Pay Rate (INR/day)', value: '10200' },
      { label: 'Overtime Rate (INR/hr)', value: '1400' },
      { label: 'Effective From', type: 'date', value: '2025-07-01' },
      { label: 'Notes', type: 'textarea', value: 'Negotiated rate for PRJ-103 cloud migration. Margin target 15%.', full: true }
    ]) + UI.alert('warning', 'Rule: Approved rate cards are versioned. Revisions create a new version — prior versions become read-only.') +
    '<div class="form-actions"><button class="btn btn-secondary">Save Draft</button><button class="btn btn-primary">Submit for Finance Approval</button></div>';

    const mappingTable = UI.table(
      ['Contractor', 'Vendor', 'Role', 'Rate Card Bill', 'Contractor Rate', 'Match', 'Status'],
      VMP_DATA.rateCardMappings.map(m => {
        const match = m.contractor_rate === m.rate_card_bill;
        return `<tr data-nav="contractors/profile?id=${m.contractor_id}">
          <td>${VMP.getContractor(m.contractor_id)?.full_name}</td>
          <td>${VMP.getVendor(m.vendor_id)?.vendor_name}</td>
          <td>${m.role}</td>
          <td>₹${m.rate_card_bill.toLocaleString('en-IN')}/mo equiv.</td>
          <td>₹${m.contractor_rate.toLocaleString('en-IN')}/mo</td>
          <td>${match ? '<span style="color:green">✓ Aligned</span>' : '<span style="color:red">✗ Mismatch</span>'}</td>
          <td>${UI.badge(m.status)}</td>
        </tr>`;
      })
    ) + UI.alert('info', 'Invoice reconciliation flags rows where billed rate differs from approved contractor rate (see INV-2025-049).');

    const steps = ['Draft', 'Vendor Negotiation', 'Finance Approval', 'Active', 'Superseded'];
    const panels = [
      UI.card('Create Rate Card (Draft)', createForm),
      UI.card('Vendor Negotiation', UI.alert('info', 'Vendor and TAQ negotiate bill/pay rates before finance submission.') + pendingTable),
      UI.card('Finance Approval', pendingTable),
      UI.card('Active Rate Cards', stats + activeTable + mappingTable),
      UI.card('Version History', historyTable)
    ];

    return SH.workflowBanner('Rate Card Lifecycle', steps, 'Active',
      'Rate cards define vendor-level bill/pay rates by role. Individual contractor rates in the Rate Register must align with the active rate card for the same vendor + role.',
      panels);
  },

  renderRateCardDetail() {
    const id = Router.getQueryParam('id') || 'rc1';
    const rc = VMP_DATA.rateCards.find(r => r.id === id);
    if (!rc) return UI.alert('danger', 'Rate card not found');
    const v = VMP.getVendor(rc.vendor_id);
    const history = (VMP_DATA.rateCardHistory || []).filter(h => h.vendor_id === rc.vendor_id && h.role === rc.role);
    const mapped = VMP_DATA.rateCardMappings.filter(m => m.rate_card_id === id);

    const detailCard = UI.card(`${rc.role} — ${v?.vendor_name}`, UI.tabs([
      { label: 'Details', content: UI.detailRows([
        { label: 'Status', value: UI.badge(rc.status) },
        { label: 'Approval', value: UI.badge(rc.approval_status) },
        { label: 'Version', value: 'v' + (rc.version || 1) },
        { label: 'Bill Rate', value: `₹${rc.bill_rate.toLocaleString('en-IN')}/day` },
        { label: 'Pay Rate', value: `₹${rc.pay_rate.toLocaleString('en-IN')}/day` },
        { label: 'Margin', value: (rc.margin_pct || Math.round((1 - rc.pay_rate / rc.bill_rate) * 100)) + '%' },
        { label: 'Overtime', value: `₹${rc.overtime_rate}/hr` },
        { label: 'Region', value: rc.region },
        { label: 'Effective From', value: VMP.formatDate(rc.effective_from) },
        { label: 'Skills', value: rc.skills },
        { label: 'Approved By', value: VMP.getUser(rc.approved_by)?.full_name || '—' }
      ]) + (rc.approval_status === 'Pending Finance' ? '<div class="form-actions">' + UI.approveRejectButtons('Rate Card', rc.id) + '</div>' : '') },
      { label: 'Version History', content: UI.table(['Version', 'Bill Rate', 'Pay Rate', 'Effective', 'Superseded', 'Reason'],
        history.map(h => `<tr><td>v${h.version}</td><td>₹${h.bill_rate.toLocaleString('en-IN')}</td><td>₹${h.pay_rate.toLocaleString('en-IN')}</td><td>${VMP.formatDate(h.effective_from)}</td><td>${VMP.formatDate(h.superseded_on) || 'Current'}</td><td>${h.reason || '—'}</td></tr>`)
      )},
      { label: 'Linked Contractors', content: UI.table(['Contractor', 'Monthly Rate', 'Match Rate Card', 'Assignment'],
        mapped.map(m => `<tr data-nav="contractors/profile?id=${m.contractor_id}"><td>${VMP.getContractor(m.contractor_id)?.full_name}</td><td>₹${m.contractor_rate.toLocaleString('en-IN')}</td><td>${m.status === 'Aligned' ? '✓' : '✗ Mismatch'}</td><td>${VMP.getProject(VMP.getActiveAssignment(m.contractor_id)?.project_id)?.project_code || '—'}</td></tr>`)
      )}
    ]));

    const steps = ['Draft', 'Vendor Negotiation', 'Finance Approval', 'Active', 'Superseded'];
    const current = rc.status === 'Active' ? 'Active' : rc.approval_status === 'Pending Finance' ? 'Finance Approval' : 'Draft';
    const panels = [
      UI.card('Draft', UI.alert('info', 'Initial rate card draft with proposed bill/pay rates.') + detailCard),
      UI.card('Vendor Negotiation', UI.alert('info', 'Rates negotiated with vendor before finance review.') + detailCard),
      UI.card('Finance Approval', detailCard),
      UI.card('Active', detailCard),
      UI.card('Superseded', history.length ? UI.table(['Version', 'Bill Rate', 'Pay Rate', 'Effective', 'Superseded', 'Reason'],
        history.map(h => `<tr><td>v${h.version}</td><td>₹${h.bill_rate.toLocaleString('en-IN')}</td><td>₹${h.pay_rate.toLocaleString('en-IN')}</td><td>${VMP.formatDate(h.effective_from)}</td><td>${VMP.formatDate(h.superseded_on) || 'Current'}</td><td>${h.reason || '—'}</td></tr>`)
      ) : UI.alert('info', 'No superseded versions yet.'))
    ];

    return SH.workflowBanner('Rate Card Lifecycle', steps, current, null, panels) +
    UI.card('Audit Trail', UI.timeline(
      VMP_DATA.auditLogs.filter(a => a.entity_type === 'Rate Card' && (a.entity_id === id || a.entity_id.startsWith('rc'))).slice(0, 4)
        .map(a => ({ time: a.performed_at, action: a.action, detail: `${a.old_value || '—'} → ${a.new_value || '—'}` }))
    ));
  },

  // ---- Finance: Invoice detail enrichment ----
  renderInvoiceReconcile() {
    const invId = Router.getQueryParam('id') || 'inv3';
    const inv = VMP.getInvoice(invId) || VMP_DATA.invoices.find(i => i.reconciliation_status === 'Blocked') || VMP_DATA.invoices[2];
    const lines = (VMP_DATA.invoiceLineItems || []).filter(l => l.invoice_id === inv.id);
    const vendor = VMP.getVendor(inv.vendor_id);

    const invCard = UI.card(`Invoice Reconciliation — ${inv.invoice_number}`, UI.detailRows([
      { label: 'Vendor', value: vendor?.vendor_name },
      { label: 'Period', value: `${VMP.formatDate(inv.billing_period_start)} – ${VMP.formatDate(inv.billing_period_end)}` },
      { label: 'Amount', value: VMP.formatCurrency(inv.invoice_amount) },
      { label: 'Tax', value: VMP.formatCurrency(inv.tax_amount) },
      { label: 'Reconciliation', value: UI.badge(inv.reconciliation_status) },
      { label: 'Payment Status', value: UI.badge(inv.payment_status) },
      { label: 'Dual Approval', value: inv.dual_approval_required ? (inv.approver1 && inv.approver2 ? '✓ Both approved' : inv.approver1 ? '1 of 2 pending' : '⚠ Required') : 'Not required' }
    ])) +
    (inv.reconciliation_status === 'Blocked' ? UI.alert('danger', 'Blocked: Rate mismatch — billed rate differs from approved contractor rate. Resolve exception or create adjustment before payment.') : '') +
    UI.card('Line Item Reconciliation', UI.table(
      ['Contractor', 'Hours (Inv)', 'Hours (Approved)', 'Rate (Inv)', 'Rate (Approved)', 'Amount', 'Match'],
      lines.map(l => `<tr class="${l.match ? '' : 'row-blocked'}">
        <td>${VMP.getContractor(l.contractor_id)?.full_name}</td>
        <td>${l.invoice_hours}h</td>
        <td>${l.approved_hours}h</td>
        <td>${VMP.formatCurrency(l.invoice_rate)}</td>
        <td>${VMP.formatCurrency(l.approved_rate)}</td>
        <td>${VMP.formatCurrency(l.amount)}</td>
        <td>${l.match ? '<span style="color:green">✓</span>' : '<span style="color:red">✗ ' + (l.exception_reason || 'Mismatch') + '</span>'}</td>
      </tr>`)
    )) +
    UI.card('Approval Chain', UI.table(['Stage', 'Approver', 'Status', 'Date'],
      [
        ['Finance Reconciliation', VMP.getUser('u3')?.full_name, UI.badge(inv.reconciliation_status === 'Blocked' ? 'Blocked' : 'Validated'), '2025-06-16'],
        ['Finance Approver 1', inv.approver1 ? VMP.getUser(inv.approver1)?.full_name : 'Pending', inv.approver1 ? UI.badge('Approved') : UI.badge('Pending'), inv.approver1 ? '2025-06-17' : '—'],
        ['Finance Approver 2 (Dual)', inv.approver2 ? VMP.getUser(inv.approver2)?.full_name : 'Required', inv.approver2 ? UI.badge('Approved') : UI.badge('Pending'), '—'],
        ['Vendor Approval', vendor?.contact_name, UI.badge(inv.vendor_approval_status), '—']
      ].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`)
    ) + '<div class="form-actions">' + UI.approveRejectButtons('Invoice', inv.id) +
    ' <button class="btn btn-secondary btn-sm">Create Exception</button> <button class="btn btn-secondary btn-sm">Request Vendor Correction</button></div>');

    const steps = ['Upload', 'Auto-Reconcile', 'Exception Review', 'Dual Approval', 'Vendor Approval', 'Payment'];
    const current = inv.reconciliation_status === 'Blocked' ? 'Exception Review' : inv.dual_approval_required ? 'Dual Approval' : 'Auto-Reconcile';
    const note = inv.dual_approval_required ? `Dual approval required — invoice amount exceeds $${VMP_DATA.config.dual_approval_threshold_usd.toLocaleString()} USD threshold.` : null;
    const panels = [
      UI.card('Upload', UI.formGrid([
        { label: 'Invoice Number', value: inv.invoice_number, disabled: true },
        { label: 'Vendor', value: vendor?.vendor_name, disabled: true },
        { label: 'PDF', value: inv.invoice_number + '.pdf', disabled: true }
      ]) + UI.alert('info', 'Invoice uploaded and queued for reconciliation.')),
      UI.card('Auto-Reconcile', UI.alert('info', 'System matches line items against approved timesheets and contractor rates.') + invCard),
      UI.card('Exception Review', invCard),
      UI.card('Dual Approval', invCard),
      UI.card('Vendor Approval', invCard),
      UI.card('Payment', UI.detailRows([
        { label: 'Payment Status', value: UI.badge(inv.payment_status) },
        { label: 'Amount', value: VMP.formatCurrency(inv.invoice_amount) },
        { label: 'Reference', value: inv.payment_reference || 'Pending export' }
      ]))
    ];

    return SH.workflowBanner('Invoice to Payment', steps, current, note, panels);
  },

  // ---- Manager: Timesheet confirmation view (V1 — read-only, manager CC'd on email) ----
  renderManagerTimesheets() {
    const awaiting = SH.timesheets().filter(t => t.contractor_confirmation_status === 'Pending');
    const confirmed = SH.timesheets().filter(t => t.contractor_confirmation_status === 'Confirmed').slice(0, 5);
    const rejected = SH.timesheets().filter(t => t.contractor_confirmation_status === 'Rejected');

    const queue = UI.table(['Contractor', 'Week', 'Submitted', 'Leave Flag', 'Holiday Flag', 'Email Sent', 'Confirmation', 'Manager View'],
      [...awaiting, ...confirmed.slice(0, 2), ...rejected].map(t => {
        const blocked = t.leave_mismatch || t.holiday_mismatch;
        return `<tr class="${blocked ? 'row-blocked' : ''}">
          <td>${VMP.getContractor(t.contractor_id)?.full_name}</td>
          <td>${VMP.formatDate(t.work_period_start)} – ${VMP.formatDate(t.work_period_end)}</td>
          <td>${t.submitted_hours}h</td>
          <td>${t.leave_mismatch ? '⚠ Leave on file — hours submitted' : '—'}</td>
          <td>${t.holiday_mismatch ? '⚠ Holiday — non-zero hours' : '—'}</td>
          <td>${t.confirmation_email_sent_at ? VMP.formatDate(t.confirmation_email_sent_at.split(' ')[0]) : '—'}</td>
          <td>${UI.badge(t.contractor_confirmation_status || t.manager_approval_status)}</td>
          <td><span style="font-size:.75rem;color:var(--muted)">CC'd on email — read-only</span></td>
        </tr>`;
      }),
      'No timesheets in confirmation flow.'
    );

    const detail = (() => {
      const focus = awaiting.find(t => t.leave_mismatch || t.holiday_mismatch) || awaiting[0] || confirmed[0];
      if (!focus) return '';
      const c = VMP.getContractor(focus.contractor_id);
      const days = focus.daily_hours || [{ day: 'Mon', date: 'Jun 2', hours: 8 }, { day: 'Tue', date: 'Jun 3', hours: 8 }, { day: 'Wed', date: 'Jun 4', hours: 8 }, { day: 'Thu', date: 'Jun 5', hours: focus.holiday_mismatch ? 8 : 0, flag: focus.holiday_mismatch ? 'Holiday' : null }, { day: 'Fri', date: 'Jun 6', hours: 8 }];
      return UI.card(`Timesheet Detail — ${c?.full_name}`, UI.table(['Day', 'Date', 'Hours', 'Flag'],
        days.map(d => `<tr class="${d.flag ? 'row-blocked' : ''}"><td>${d.day}</td><td>${d.date}</td><td>${d.hours}h</td><td>${d.flag || '—'}</td></tr>`)
      ) + UI.alert('info', 'V1: Manager receives CC on confirmation email. Leave/holiday flags are surfaced automatically — no manual calendar check or contractor follow-up required.') +
      (focus.leave_mismatch ? UI.alert('warning', 'Leave record found — contractor submitted billable hours on a leave day. Visible in CC email; contractor may reject on confirmation.') : '') +
      (focus.holiday_mismatch ? UI.alert('warning', 'Company holiday detected with non-zero hours. Flag included in confirmation email.') : ''));
    })();

    const steps = ['Contractor Upload', 'Confirmation Email (CC Manager)', 'Contractor Yes/No', 'Recorded in System', 'Finance Batch'];
    const panels = [
      UI.card('Contractor Upload', UI.alert('info', 'Contractors upload a timesheet file or enter hours in the portal.') +
        UI.table(['Contractor', 'Week', 'Submitted', 'Status'],
          SH.timesheets().slice(0, 5).map(t => `<tr><td>${VMP.getContractor(t.contractor_id)?.full_name}</td><td>${VMP.formatDate(t.work_period_start)} – ${VMP.formatDate(t.work_period_end)}</td><td>${t.submitted_hours}h</td><td>${UI.badge(t.contractor_confirmation_status || t.manager_approval_status)}</td></tr>`)
        )),
      UI.card('Confirmation Email (CC Manager)', UI.alert('info', 'System emails contractor: "Did you work for this many hours?" Manager is CC\'d with full hour breakdown and leave/holiday flags.') + detail),
      UI.card('Contractor Yes/No', UI.statsGrid([
        { value: awaiting.length, label: 'Awaiting Confirmation', class: 'warning' },
        { value: confirmed.length, label: 'Confirmed', class: 'success' },
        { value: rejected.length, label: 'Rejected', class: 'danger' },
        { value: awaiting.filter(t => t.leave_mismatch || t.holiday_mismatch).length, label: 'Flagged in Email', class: 'warning' }
      ]) + UI.card('Team Timesheet Status', queue)),
      UI.card('Recorded in System', queue + detail),
      UI.card('Finance Batch', UI.alert('success', 'Contractor-confirmed hours flow into finance payment batches.') +
        UI.table(['Contractor', 'Week', 'Hours', 'Status'],
          confirmed.filter(t => t.approved_hours).map(t => `<tr><td>${VMP.getContractor(t.contractor_id)?.full_name}</td><td>${VMP.formatDate(t.work_period_start)} – ${VMP.formatDate(t.work_period_end)}</td><td>${t.approved_hours}h</td><td>${UI.badge('Ready for Batch')}</td></tr>`)
        ))
    ];

    return SH.workflowBanner('Timesheet Confirmation (V1)', steps, 'Contractor Yes/No',
      'V1: Manager is CC\'d on confirmation email for visibility. No in-app approve/reject — contractor confirms Yes or No.',
      panels);
  },

  // ---- HR: Onboarding with stage detail ----
  renderOnboardingPipeline() {
    const kanban = UI.card('Onboarding Pipeline', UI.kanban([
      { title: 'Applied', cards: VMP_DATA.contractors.filter(c => c.onboarding_stage === 'Applied').map(c => ({ name: c.full_name, meta: c.skill_set + ' · ' + VMP.getVendor(c.vendor_id)?.vendor_code, badge: c.bgv_status, nav: `contractors/profile?id=${c.id}` })) },
      { title: 'Docs Submitted', cards: VMP_DATA.contractors.filter(c => c.onboarding_stage === 'Docs Submitted').map(c => ({ name: c.full_name, meta: VMP.getVendor(c.vendor_id)?.vendor_name, badge: 'Pending BGV', nav: `contractors/profile?id=${c.id}` })) },
      { title: 'Offer Sent', cards: [{ name: 'Rajesh Kumar', meta: 'CON-009 · Data Engineer', badge: 'Offer Sent', nav: 'contractors/profile?id=c9' }] },
      { title: 'Signed', cards: [] },
      { title: 'Active', cards: VMP_DATA.contractors.filter(c => c.onboarding_stage === 'Active').slice(0, 4).map(c => ({ name: c.full_name, meta: c.contractor_code, badge: 'Active', nav: `contractors/profile?id=${c.id}` })) }
    ]));
    const checklist = UI.card('Onboarding Checklist — Priya Sharma (CON-004)', UI.checklist([
      { label: 'Vendor approved (Acme Staffing)', owner: 'System', done: true },
      { label: 'Documents uploaded (NDA, ID, Bank)', owner: 'Contractor', done: true },
      { label: 'BGV initiated', owner: 'HR Ops', done: true },
      { label: 'BGV cleared', owner: 'HR Ops', done: false },
      { label: 'Assignment created', owner: 'HR Ops', done: false },
      { label: 'Rate submitted to Finance', owner: 'HR Ops', done: false },
      { label: 'Contractor activated', owner: 'System', done: false }
    ]) + UI.alert('warning', 'BGV status: In Progress — contractor cannot be activated until BGV clears.'));

    const steps = ['Applied', 'Docs Submitted', 'BGV Check', 'Offer Sent', 'Signed', 'Rate Setup', 'Active'];
    const panels = [
      UI.card('Applied', kanban),
      UI.card('Docs Submitted', checklist + kanban),
      UI.card('BGV Check', UI.table(['Contractor','Vendor','Initiated','Status'],
        VMP_DATA.bgvRecords.map(b => `<tr><td>${VMP.getContractor(b.contractor_id)?.full_name}</td><td>${VMP.getVendor(b.vendor_id)?.vendor_name}</td><td>${VMP.formatDate(b.initiated_date)}</td><td>${UI.badge(b.bgv_status)}</td></tr>`)
      ) + '<a href="#bgv/tracker" class="btn btn-sm btn-secondary">Open BGV Tracker</a>'),
      UI.card('Offer Sent', kanban),
      UI.card('Signed', UI.alert('info', 'Offer letter signed — awaiting rate setup and activation.')),
      UI.card('Rate Setup', UI.alert('info', 'HR submits contractor rate to Finance for approval before activation.') +
        UI.table(['Contractor','Rate','Status'],
          VMP_DATA.rates.filter(r => r.approval_status === 'Pending Finance').slice(0, 5).map(r =>
            `<tr><td>${VMP.getContractor(r.contractor_id)?.full_name}</td><td>${VMP.formatCurrency(r.monthly_rate||0)}</td><td>${UI.badge(r.approval_status)}</td></tr>`)
        )),
      UI.card('Active', kanban + UI.alert('success', 'Contractor activated and assignment is live.'))
    ];

    return SH.workflowBanner('Contractor Onboarding', steps, 'Docs Submitted',
      'Vendor must be approved before onboarding. BGV must clear before contractor activation. Rate must be approved by Finance.',
      panels);
  },

  // ---- Approval detail ----
  renderApprovalDetail() {
    const id = Router.getQueryParam('id') || VMP_DATA.approvals.find(a => a.status === 'Pending')?.id || 'ap1';
    const ap = VMP_DATA.approvals.find(a => a.id === id);
    if (!ap) return UI.alert('danger', 'Approval not found');

    let entityDetail = '';
    if (ap.entity_type === 'Vendor') {
      const v = VMP.getVendor(ap.entity_id);
      entityDetail = UI.detailRows([
        { label: 'Vendor', value: v?.vendor_name }, { label: 'GST', value: v?.gst_number },
        { label: 'Compliance', value: UI.badge(v?.compliance_status) }, { label: 'Contact', value: v?.contact_email }
      ]);
    } else if (ap.entity_type === 'Contractor Rate') {
      const r = VMP.getRate(ap.entity_id);
      entityDetail = UI.detailRows([
        { label: 'Contractor', value: VMP.getContractor(r?.contractor_id)?.full_name },
        { label: 'New Rate', value: VMP.formatCurrency(r?.monthly_rate || 0) },
        { label: 'Effective From', value: VMP.formatDate(r?.effective_from) },
        { label: 'Reason', value: 'Annual rate revision' }
      ]);
    } else if (ap.entity_type === 'Assignment Transfer') {
      entityDetail = UI.detailRows([
        { label: 'Contractor', value: 'Amit Joshi' }, { label: 'From', value: 'PRJ-101 Platform Modernization' },
        { label: 'To', value: 'PRJ-103 Cloud Migration' }, { label: 'New Manager', value: 'Vikram Mehta' },
        { label: 'Effective', value: '01 Jul 2025' }
      ]);
    } else {
      entityDetail = UI.detailRows([{ label: 'Entity', value: ap.entity_type + ' ' + ap.entity_id }]);
    }

    const approvalCard = UI.card(`Approval Request — ${ap.entity_type} ${ap.entity_id}`, UI.detailRows([
      { label: 'Type', value: ap.entity_type }, { label: 'Requester', value: VMP.getUser(ap.requester)?.full_name },
      { label: 'Current Stage', value: ap.current_stage }, { label: 'SLA', value: ap.sla },
      { label: 'Priority', value: UI.badge(ap.priority) }, { label: 'Status', value: UI.badge(ap.status) },
      { label: 'Approver Role', value: ap.approver_role }
    ]) + entityDetail +
    (ap.status === 'Pending' ? '<div class="form-actions" style="margin-top:1rem">' + UI.approveRejectButtons(ap.entity_type, ap.entity_id) + '</div>' : UI.alert('success', 'This request has been ' + ap.status.toLowerCase() + '.')));

    const steps = ['Submitted', 'HR Review', 'Finance Review', 'Approved / Rejected'];
    const current = ap.current_stage.includes('Finance') ? 'Finance Review' : ap.current_stage.includes('HR') ? 'HR Review' : 'Submitted';
    const panels = [
      UI.card('Submitted', UI.alert('info', 'Request submitted and queued for review.') + approvalCard),
      UI.card('HR Review', approvalCard),
      UI.card('Finance Review', approvalCard),
      UI.card('Approved / Rejected', UI.table(['Entity','Type','Status','Stage'],
        VMP_DATA.approvals.filter(a => a.status !== 'Pending').slice(0, 8).map(a =>
          `<tr data-nav="admin/approval-detail?id=${a.id}"><td>${a.entity_id}</td><td>${a.entity_type}</td><td>${UI.badge(a.status)}</td><td>${a.current_stage}</td></tr>`)
      ))
    ];

    return SH.workflowBanner('Approval Workflow', steps, current, null, panels);
  },

  // ---- Finance batches enriched ----
  renderFinanceBatches() {
    const batchTable = UI.card('Finance Payment Batches', UI.table(['Batch ID', 'Vendor', 'Period', 'Lines', 'Hours', 'Amount', 'Blocked', 'Status', 'Actions'],
      VMP_DATA.financeBatches.map(b => `<tr data-nav="finance/batch-detail?id=${b.id}">
        <td><strong>${b.id}</strong></td>
        <td>${VMP.getVendor(b.vendor_id)?.vendor_name}</td>
        <td>${b.billing_period}</td>
        <td>${b.line_items.length}</td>
        <td>${b.total_hours}h</td>
        <td>${VMP.formatCurrency(b.total_amount)}</td>
        <td>${b.line_items.filter(l => l.blocked).length > 0 ? UI.badge('Blocked') + ' (' + b.line_items.filter(l => l.blocked).length + ')' : '0'}</td>
        <td>${UI.badge(b.finance_status)}</td>
        <td><a href="#finance/batch-detail?id=${b.id}" class="btn btn-sm btn-secondary">Review</a></td>
      </tr>`)
    ));

    const stats = UI.statsGrid([
      { value: VMP_DATA.financeBatches.length, label: 'Total Batches' },
      { value: VMP_DATA.financeBatches.filter(b => b.finance_status === 'Exceptions Flagged').length, label: 'With Exceptions', class: 'danger' },
      { value: VMP_DATA.financeBatches.filter(b => b.finance_status === 'Paid').length, label: 'Paid', class: 'success' },
      { value: VMP.formatCurrency(VMP_DATA.financeBatches.reduce((s, b) => s + b.total_amount, 0)), label: 'Total Value' }
    ]);

    const steps = ['Generate Batch', 'Validate Data', 'Flag Exceptions', 'Finance Review', 'Export & Pay'];
    const panels = [
      UI.card('Generate Batch', UI.toolbar(['<button class="btn btn-primary btn-sm">Generate Batch</button>', '<select><option>All Vendors</option><option>Acme Staffing</option></select>']) +
        UI.alert('info', 'Select vendor and billing period to generate a payment batch from approved timesheets.')),
      UI.card('Validate Data', UI.alert('info', 'Each line validated for active assignment, approved rate, and reporting manager.') + batchTable),
      UI.card('Flag Exceptions', stats + batchTable),
      UI.card('Finance Review', stats + batchTable),
      UI.card('Export & Pay', UI.table(['Batch ID','Vendor','Amount','Status','Payment Ref'],
        VMP_DATA.financeBatches.map(b => `<tr data-nav="finance/batch-detail?id=${b.id}"><td>${b.id}</td><td>${VMP.getVendor(b.vendor_id)?.vendor_name}</td><td>${VMP.formatCurrency(b.total_amount)}</td><td>${UI.badge(b.finance_status)}</td><td>${b.payment_reference||'—'}</td></tr>`)
      ))
    ];

    return SH.workflowBanner('Finance Payment Batch', steps, 'Flag Exceptions',
      'Line items blocked when assignment, rate, or reporting manager is inconsistent. Remove blocked items or resolve before export.',
      panels);
  },

  // ---- Rates register with finance context ----
  renderRatesRegister() {
    const rates = SH.rates();
    const pending = rates.filter(r => r.approval_status === 'Pending Finance');
    const rateTable = UI.card('Rate Register', UI.table(['Contractor', 'Vendor', 'Project', 'Rate', 'Type', 'Effective From', 'To', 'Status', 'Version', 'Actions'],
      rates.map(r => `<tr>
        <td>${VMP.getContractor(r.contractor_id)?.full_name}</td>
        <td>${VMP.getVendor(r.vendor_id)?.vendor_name}</td>
        <td>${r.assignment_id ? VMP.getProject(VMP.getAssignment(r.assignment_id)?.project_id)?.project_code : '—'}</td>
        <td>${VMP.formatCurrency(r.monthly_rate || 0)}</td>
        <td>${r.rate_type}</td>
        <td>${VMP.formatDate(r.effective_from)}</td>
        <td>${VMP.formatDate(r.effective_to) || '—'}</td>
        <td>${UI.badge(r.approval_status)} ${r.immutable ? '🔒' : ''}</td>
        <td>v${r.version}</td>
        <td>${r.approval_status === 'Pending Finance' ? UI.approveRejectButtons('Contractor Rate', r.id) : '<a href="#rates/history?id=' + r.contractor_id + '" class="btn btn-sm btn-secondary">History</a>'}</td>
      </tr>`)
    ));

    const stats = UI.statsGrid([
      { value: rates.filter(r => r.approval_status === 'Approved').length, label: 'Approved Rates' },
      { value: pending.length, label: 'Pending Finance', class: 'warning' },
      { value: rates.filter(r => r.immutable).length, label: 'Locked Versions' },
      { value: VMP_DATA.anomalies.filter(a => a.anomaly_type === 'Missing Rate').length, label: 'Missing Rate Anomalies', class: 'danger', nav: 'reports/anomalies' }
    ]);

    const createLink = UI.toolbar(['<a href="#rates/create" class="btn btn-primary btn-sm">+ Create Rate</a>', '<button class="btn btn-secondary btn-sm">Export</button>']);
    const steps = ['Create Rate', 'Validate Assignment', 'Finance Approval', 'Activate', 'Lock Version'];
    const panels = [
      UI.card('Create Rate', createLink + UI.alert('info', 'New contractor rates require an active assignment link.') + rateTable),
      UI.card('Validate Assignment', UI.alert('info', 'System checks for active assignment and rate card alignment.') + rateTable),
      UI.card('Finance Approval', stats + rateTable),
      UI.card('Activate', stats + rateTable),
      UI.card('Lock Version', UI.alert('warning', 'Approved rates become immutable. Revisions create new versions.') + rateTable)
    ];

    return SH.workflowBanner('Contractor Rate Lifecycle', steps, 'Finance Approval',
      'Approved rates are immutable. Revisions create new versions with effective dates. One active rate per contractor per effective period.',
      panels);
  },

  // ========== VENDOR SIDE MANAGER ==========
  vendorId() {
    return VMP.getCurrentVendorId() || 'v1';
  },

  renderVendorDashboard() {
    const vid = SH.vendorId();
    const vendor = VMP.getVendor(vid);
    const contractors = VMP.getVendorContractors(vid);
    const active = contractors.filter(c => c.status === 'Active');
    const onboarding = contractors.filter(c => c.status === 'Onboarding');
    const endingSoon = contractors.filter(c => c.exit_date && new Date(c.exit_date) < new Date('2025-07-30'));
    const pendingJobs = VMP.getVendorJobOrders(vid).filter(j => j.response_status === 'Pending Response');
    const pendingPayments = VMP.getVendorInvoices(vid).filter(i => i.vendor_approval_status === 'Pending' && i.reconciliation_status !== 'Blocked');

    return SH.actorBanner() + UI.statsGrid([
      { value: active.length, label: 'Active Contractors', nav: 'vendor/contractors' },
      { value: onboarding.length, label: 'Onboarding', nav: 'vendor/onboarding', class: 'warning' },
      { value: pendingJobs.length, label: 'Job Orders to Respond', nav: 'vendor/job-orders', class: 'warning' },
      { value: pendingPayments.length, label: 'Payments Pending Approval', nav: 'vendor/invoices', class: 'warning' },
      { value: endingSoon.length, label: 'Ending Soon', class: 'warning' },
      { value: VMP.getVendorSowCompliance(vid).filter(s => s.compliance_status !== 'Compliant').length, label: 'SOW Reviews Due', nav: 'vendor/sow-compliance', class: 'danger' }
    ]) + UI.card(`Welcome — ${vendor?.vendor_name}`, UI.detailRows([
      { label: 'Vendor Code', value: vendor?.vendor_code },
      { label: 'Status', value: UI.badge(vendor?.status) },
      { label: 'Compliance', value: UI.badge(vendor?.compliance_status) },
      { label: 'Contact', value: vendor?.contact_email }
    ])) + UI.card('Recent Activity', UI.table(['Type', 'Detail', 'Status', 'Date'],
      [
        ['Job Order', 'jo4 — DevOps backfill requested by TAQ', UI.badge('Pending Response'), '18 Jun 2025'],
        ['Payment', 'INV-2025-048 — awaiting your approval', UI.badge('Pending'), '15 Jun 2025'],
        ['Onboarding', 'Meera Iyer — docs submitted to HR', UI.badge('Onboarding'), '13 Jun 2025'],
        ['SOW Review', 'Lakshmi Venkat — exit & knowledge transfer', UI.badge('Review Due'), '15 May 2025']
      ].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`)
    )) + UI.card('Key Workflows (System Diagram)', `<ol style="font-size:.875rem;line-height:2;padding-left:1.25rem">
      <li><strong>Step 16 — TA Demand:</strong> Receive job order → submit qualified candidates</li>
      <li><strong>Step 13 — HR Onboarding:</strong> Coordinate contractor docs & BGV before start date</li>
      <li><strong>Step 14 — SOW Compliance:</strong> Ensure deliverables align with signed SOW</li>
      <li><strong>Step 15 — End Date Tracking:</strong> Monitor contractor tenure & offboarding</li>
      <li><strong>Step 18 — Payment Approval:</strong> Approve finance invoices against bill rates & approved hours</li>
      <li><strong>Step 24 — Performance:</strong> Review manager feedback on your contractors</li>
    </ol>`);
  },

  renderVendorJobOrders() {
    const vid = SH.vendorId();
    const orders = VMP.getVendorJobOrders(vid);
    return SH.workflowBanner('TA Demand → Vendor Response', ['TAQ Posts Position', 'Job Order Issued', 'Vendor Shortlists', 'TAQ Routes to Manager', 'HR Schedules Interview'],
      'Job Order Issued', 'TAQ posts approved MRF as job order to vendor. Vendor shortlists candidates from their bench — TAQ routes profiles to manager; HR handles interviews.') +
    UI.statsGrid([
      { value: orders.filter(j => j.response_status === 'Pending Response').length, label: 'Awaiting Response', class: 'warning' },
      { value: orders.filter(j => j.response_status === 'In Progress').length, label: 'In Progress' },
      { value: orders.filter(j => j.response_status === 'Candidates Submitted').length, label: 'Submitted', class: 'success' }
    ]) + UI.card('Job Orders & Resource Demands', UI.table(['Job Order', 'Position', 'Skills', 'Headcount', 'Due Date', 'Submitted', 'Status', 'Actions'],
      orders.map(jo => {
        const pos = VMP.getProjectPositions(VMP_DATA.openPositions.find(o => o.id === jo.open_position_id)?.project_id)[0]
          || VMP_DATA.openPositions.find(o => o.id === jo.open_position_id);
        const op = VMP_DATA.openPositions.find(o => o.id === jo.open_position_id);
        return `<tr>
          <td><strong>${jo.id}</strong></td>
          <td>${op?.position_title || '—'}</td>
          <td style="font-size:.8rem">${op?.skill_set || '—'}</td>
          <td>${jo.headcount_needed || 1}</td>
          <td>${VMP.formatDate(jo.due_date)}</td>
          <td>${jo.candidates_submitted || 0}</td>
          <td>${UI.badge(jo.response_status || 'Pending Response')}</td>
          <td>${jo.response_status === 'Pending Response' || jo.response_status === 'In Progress'
            ? `<a href="#vendor/candidates?job=${jo.id}" class="btn btn-sm btn-primary">Submit Candidates</a>`
            : '<span style="font-size:.75rem;color:var(--muted)">—</span>'}</td>
        </tr>`;
      })
    )) + (orders.find(j => j.id === 'jo4') ? UI.alert('info', 'jo4: Urgent DevOps backfill — TAQ expects candidate profiles within 7 days.') : '');
  },

  renderVendorCandidates() {
    const vid = SH.vendorId();
    const jobId = Router.getQueryParam('job') || 'jo4';
    const jo = VMP_DATA.jobOrders.find(j => j.id === jobId);
    const op = VMP_DATA.openPositions.find(o => o.id === jo?.open_position_id);
    const mine = VMP.getVendorCandidates(vid);

    const submitForm = UI.card('Submit Candidate Profile', UI.formGrid([
      { label: 'Job Order', value: jobId + ' — ' + (op?.position_title || 'Open Role'), disabled: true },
      { label: 'Candidate Name', value: '' },
      { label: 'Email', value: '' },
      { label: 'Phone', value: '' },
      { label: 'Skills Match', value: op?.skill_set || '' },
      { label: 'Experience (years)', value: '5' },
      { label: 'Available From', type: 'date', value: '2025-07-15' },
      { label: 'Notes', type: 'textarea', value: 'Strong match for role requirements. Available for interview next week.', full: true }
    ]) + '<div class="form-actions"><button class="btn btn-primary">Submit to TAQ for Routing</button></div>');

    return SH.workflowBanner('Candidate Submission', ['Shortlist from Bench', 'Submit to TAQ', 'TAQ Routes to Manager', 'Manager Selects', 'HR Schedules Interview'],
      'Shortlist from Bench', 'Submit shortlisted profiles to TAQ. TAQ routes to the hiring manager — you do not schedule interviews directly.') +
    submitForm +
    UI.card('My Submitted Candidates', UI.table(['Candidate', 'Job Order', 'AI Score', 'Stage', 'Linked Contractor'],
      mine.map(c => {
        const job = VMP_DATA.jobOrders.find(j => j.id === c.job_order_id);
        const position = VMP_DATA.openPositions.find(o => o.id === job?.open_position_id);
        return `<tr><td>${c.name}<br><span style="font-size:.75rem;color:var(--muted)">${c.email}</span></td><td>${position?.position_title || c.job_order_id}</td><td>${c.ai_score}/100</td><td>${UI.badge(c.stage)}</td><td>${c.contractor_id ? VMP.getContractor(c.contractor_id)?.contractor_code : '—'}</td></tr>`;
      })
    ));
  },

  renderVendorContractors() {
    const contractors = SH.contractors();
    return UI.card('My Contractors', UI.table(['Code', 'Name', 'Project', 'Manager', 'End Date', 'BGV', 'Status', 'Actions'],
      contractors.map(c => {
        const a = VMP.getActiveAssignment(c.id);
        return `<tr data-nav="contractors/profile?id=${c.id}">
          <td>${c.contractor_code}</td>
          <td><strong>${c.full_name}</strong></td>
          <td>${a ? VMP.getProject(a.project_id)?.project_code : '—'}</td>
          <td>${a ? VMP.getUser(a.reporting_manager_id)?.full_name || '⚠ Missing' : '—'}</td>
          <td>${VMP.formatDate(c.exit_date) || '—'}${c.exit_date ? ' <span style="font-size:.7rem;color:var(--muted)">track</span>' : ''}</td>
          <td>${UI.badge(c.bgv_status)}</td>
          <td>${UI.badge(c.status)}</td>
          <td><a href="#contractors/profile?id=${c.id}" class="btn btn-sm btn-secondary">View</a></td>
        </tr>`;
      }),
      'No contractors assigned to your vendor account'
    )) + UI.alert('info', 'All contractors listed here are employed through your vendor organization and assigned to client projects.');
  },

  renderVendorOnboarding() {
    const vid = SH.vendorId();
    const contractors = VMP.getVendorContractors(vid);
    const onboarding = contractors.filter(c => c.status === 'Onboarding' || c.onboarding_stage !== 'Active' && c.onboarding_stage !== 'Archived');
    const exiting = contractors.filter(c => c.exit_date);

    return SH.workflowBanner('Onboarding & Offboarding', ['Applied', 'Docs to HR', 'BGV', 'Offer', 'Active', 'Exit Triggered', 'Archived'],
      'Docs to HR', 'Vendor coordinates with HR Ops for onboarding. BGV must clear before activation. Offboarding triggered on end date.') +
    UI.card('Onboarding Pipeline — My Contractors', UI.kanban([
      { title: 'Applied', cards: contractors.filter(c => c.onboarding_stage === 'Applied').map(c => ({ name: c.full_name, meta: c.skill_set, badge: c.bgv_status, nav: `contractors/profile?id=${c.id}` })) },
      { title: 'Docs Submitted', cards: contractors.filter(c => c.onboarding_stage === 'Docs Submitted').map(c => ({ name: c.full_name, meta: 'Awaiting BGV', badge: 'Pending', nav: `contractors/profile?id=${c.id}` })) },
      { title: 'Offer / Signed', cards: contractors.filter(c => c.onboarding_stage === 'Offer Sent' || c.onboarding_stage === 'Signed').map(c => ({ name: c.full_name, meta: c.contractor_code, badge: c.onboarding_stage, nav: `contractors/profile?id=${c.id}` })) },
      { title: 'Active', cards: contractors.filter(c => c.onboarding_stage === 'Active' && c.status === 'Active').slice(0, 5).map(c => ({ name: c.full_name, meta: c.contractor_code, badge: 'Active', nav: `contractors/profile?id=${c.id}` })) }
    ])) + UI.card('Offboarding / End Date Tracking', UI.table(['Contractor', 'End Date', 'Project', 'Exit Status', 'Actions'],
      exiting.map(c => `<tr data-nav="contractors/profile?id=${c.id}"><td>${c.full_name}</td><td>${VMP.formatDate(c.exit_date)}</td><td>${VMP.getProject(VMP.getActiveAssignment(c.id)?.project_id)?.project_code || '—'}</td><td>${c.status === 'Exited' ? UI.badge('Exited') : UI.badge('Ending Soon')}</td><td><button class="btn btn-sm btn-secondary">Initiate Exit Coordination</button></td></tr>`)
    )) + UI.alert('warning', 'Lakshmi Venkat (CON-006) — end date 30 Jun 2025. Coordinate final timesheet and knowledge transfer with HR & manager.');
  },

  renderVendorSowCompliance() {
    const vid = SH.vendorId();
    const records = VMP.getVendorSowCompliance(vid);
    return SH.workflowBanner('SOW Compliance', ['SOW Signed', 'Active Delivery', 'Manager Review', 'Compliance Check', 'Renewal / Exit'],
      'Active Delivery', 'Vendor ensures contractor deliverables match signed SOW. Manager provides feedback; vendor tracks compliance status.') +
    UI.card('SOW Compliance & Deliverables', UI.table(['Contractor', 'Project', 'SOW Document', 'Deliverables', 'Compliance', 'End Date', 'Manager Feedback', 'Last Review'],
      records.map(sc => `<tr data-nav="contractors/profile?id=${sc.contractor_id}">
        <td>${VMP.getContractor(sc.contractor_id)?.full_name}</td>
        <td>${VMP.getProject(sc.project_id)?.project_code}</td>
        <td>${sc.sow_document}</td>
        <td>${UI.badge(sc.deliverables_status)}</td>
        <td>${UI.badge(sc.compliance_status)}</td>
        <td>${VMP.formatDate(sc.end_date) || '—'}</td>
        <td style="font-size:.8rem;max-width:200px">${sc.manager_feedback}</td>
        <td>${VMP.formatDate(sc.last_review)}</td>
      </tr>`)
    )) + UI.card('Vendor SOW Documents', UI.table(['Type', 'Document', 'Expiry', 'Status'],
      VMP.getVendorDocuments(vid).map(d => `<tr><td>${d.document_type}</td><td>${d.document_name}</td><td>${VMP.formatDate(d.expiry_date)}</td><td>${UI.badge(d.verification_status)}</td></tr>`)
    ));
  },

  renderVendorInvoices() {
    const vid = SH.vendorId();
    const invoices = VMP.getVendorInvoices(vid);
    const pending = invoices.filter(i => i.vendor_approval_status === 'Pending');
    return SH.workflowBanner('Payment Approval (Step 18)', ['Manager Approves Hours', 'Finance Reconciles', 'Invoice Raised', 'Vendor Approval', 'Payment'],
      'Vendor Approval', 'Finance sends reconciled invoice for vendor approval. Verify bill rates, SOW alignment, and approved hours before approving payment.') +
    UI.statsGrid([
      { value: pending.length, label: 'Pending Your Approval', class: 'warning' },
      { value: invoices.filter(i => i.vendor_approval_status === 'Approved').length, label: 'Approved', class: 'success' },
      { value: VMP.formatCurrency(invoices.reduce((s, i) => s + i.invoice_amount, 0)), label: 'Total Invoiced (YTD)' }
    ]) + UI.card('Payment Approval Queue', UI.table(['Invoice #', 'Period', 'Amount', 'Tax', 'Finance Status', 'Reconciliation', 'Your Approval', 'Actions'],
      invoices.map(i => `<tr class="${i.reconciliation_status === 'Blocked' ? 'row-blocked' : ''}">
        <td><strong>${i.invoice_number}</strong></td>
        <td>${VMP.formatDate(i.billing_period_start)} – ${VMP.formatDate(i.billing_period_end)}</td>
        <td>${VMP.formatCurrency(i.invoice_amount)}</td>
        <td>${VMP.formatCurrency(i.tax_amount)}</td>
        <td>${UI.badge(i.payment_status)}</td>
        <td>${UI.badge(i.reconciliation_status)}</td>
        <td>${UI.badge(i.vendor_approval_status)}</td>
        <td>${i.vendor_approval_status === 'Pending' && i.reconciliation_status !== 'Blocked'
          ? UI.approveRejectButtons('Vendor Payment', i.id)
          : i.reconciliation_status === 'Blocked' ? '<span style="font-size:.75rem;color:#dc2626">Blocked — finance exception</span>' : '—'}</td>
      </tr>`)
    )) + UI.card('Approval Checklist', UI.checklist([
      { label: 'Bill rates match active rate card', owner: 'Finance reconciled', done: true },
      { label: 'Hours match manager-approved timesheets', owner: 'System validated', done: true },
      { label: 'SOW / assignment active for billing period', owner: 'Compliance', done: true },
      { label: 'No open reconciliation exceptions', owner: 'Finance', done: false }
    ]));
  },

  renderVendorPerformance() {
    const vid = SH.vendorId();
    const contractorIds = VMP.getVendorContractors(vid).map(c => c.id);
    const ratings = VMP_DATA.performanceRatings.filter(p => contractorIds.includes(p.contractor_id));
    return SH.workflowBanner('Performance & Deliverables', ['Manager Rates', 'Feedback Shared', 'Vendor Reviews', 'Action Plan', 'Close Loop'],
      'Feedback Shared', "Contractor's Manager submits ratings (Step 24). Vendor reviews feedback and tracks deliverables against SOW.") +
    UI.card('Manager Performance Ratings — My Contractors', UI.table(['Contractor', 'Period', 'Quality', 'Communication', 'Delivery', 'Professionalism', 'Avg', 'Flag'],
      ratings.map(p => {
        const avg = ((p.quality + p.communication + p.delivery + p.professionalism) / 4).toFixed(1);
        return `<tr data-nav="contractors/profile?id=${p.contractor_id}"><td>${VMP.getContractor(p.contractor_id)?.full_name}</td><td>${p.period}</td><td>${p.quality}</td><td>${p.communication}</td><td>${p.delivery}</td><td>${p.professionalism}</td><td><strong>${avg}</strong></td><td>${p.low_performer ? UI.badge('Flagged') : '—'}</td></tr>`;
      })
    )) + UI.card('Deliverables Tracking', UI.table(['Contractor', 'Project', 'Deliverables Status', 'Manager Feedback'],
      VMP.getVendorSowCompliance(vid).map(sc => `<tr><td>${VMP.getContractor(sc.contractor_id)?.full_name}</td><td>${VMP.getProject(sc.project_id)?.project_name}</td><td>${UI.badge(sc.deliverables_status)}</td><td style="font-size:.8rem">${sc.manager_feedback}</td></tr>`)
    ));
  },

  renderVendorReports() {
    const vid = SH.vendorId();
    const contractors = VMP.getVendorContractors(vid).filter(c => c.status === 'Active');
    const monthly = contractors.reduce((s, c) => s + (VMP.getActiveRate(c.id)?.monthly_rate || 0), 0);
    return UI.card('Vendor Reports & Dashboards', UI.statsGrid([
      { value: contractors.length, label: 'Active Headcount' },
      { value: VMP.formatCurrency(monthly), label: 'Monthly Bill Value' },
      { value: '94%', label: 'Fill Rate SLA' },
      { value: '18 days', label: 'Avg Time-to-Fill' }
    ]) + UI.table(['Report', 'Description', 'Actions'],
      [
        ['Contractor Headcount Report', 'Active, onboarding, and exiting contractors by project', 'Run'],
        ['Payment History', 'Invoices approved and paid by period', 'Run'],
        ['SOW Compliance Summary', 'Deliverables and compliance status across assignments', 'Run'],
        ['Performance Summary', 'Manager ratings aggregated by contractor', 'Run'],
        ['SLA Dashboard', 'Fill rate, time-to-fill, and response time on job orders', 'Run']
      ].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td><button class="btn btn-sm btn-primary">${r[2]}</button> <button class="btn btn-sm btn-secondary">Export PDF</button></td></tr>`)
    ));
  },

  // ---- Contractor Quarterly Performance Rating (rubric + HR review + credibility) ----
  renderQuarterlyRating() {
    const cycle = VMP_DATA.ratingCycle;
    const team = VMP.currentRole === 'manager' ? VMP.getManagerTeam('u4') : VMP_DATA.contractors.filter(c => c.status === 'Active');
    const ratings = VMP_DATA.performanceRatings;
    const rubricForm = UI.formGrid([
      { label: 'Contractor', type: 'select', options: team.map(c => ({ label: c.full_name })) },
      { label: 'Rating Period', value: cycle.quarter, disabled: true },
      { label: 'Quality (1-5)', type: 'select', options: ['5','4','3','2','1'] },
      { label: 'Communication (1-5)', type: 'select', options: ['5','4','3','2','1'] },
      { label: 'Delivery (1-5)', type: 'select', options: ['5','4','3','2','1'] },
      { label: 'Professionalism (1-5)', type: 'select', options: ['5','4','3','2','1'] },
      { label: 'Reliability (1-5)', type: 'select', options: ['5','4','3','2','1'] },
      { label: 'Comments', type: 'textarea', value: 'Consistently strong delivery this quarter.', full: true }
    ]) + '<div class="form-actions"><button class="btn btn-primary">Submit Rating & Comments</button></div>';

    const historyTable = UI.table(['Contractor','Period','Quality','Comm.','Delivery','Prof.','Reliability','Avg','Review','Flag'],
      ratings.map(p => {
        const avg = ((p.quality + p.communication + p.delivery + p.professionalism + (p.reliability || p.professionalism)) / 5).toFixed(1);
        return `<tr data-nav="contractors/profile?id=${p.contractor_id}"><td>${VMP.getContractor(p.contractor_id)?.full_name}</td><td>${p.period}</td><td>${p.quality}</td><td>${p.communication}</td><td>${p.delivery}</td><td>${p.professionalism}</td><td>${p.reliability ?? '—'}</td><td><strong>${avg}</strong></td><td>${UI.badge(p.review_status || 'Recorded')}</td><td>${p.low_performer ? UI.badge('Flagged') : '—'}</td></tr>`;
      })
    );

    const credibilityTable = UI.table(['Contractor','Rating Avg','Ratings','Concerns','Sustained','Standing'],
      team.map(c => {
        const cr = VMP.getCredibility(c.id);
        return `<tr data-nav="contractors/profile?id=${c.id}"><td>${c.full_name}</td><td>${cr.avg !== null ? cr.avg.toFixed(1) : '—'}</td><td>${cr.ratingCount}</td><td>${cr.concernCount}</td><td>${cr.sustained}</td><td>${UI.badge(cr.standing)}</td></tr>`;
      })
    );

    const steps = ['Open Rating Cycle','Manager Rates on Rubric','Submit Rating','HR Reviews Completeness','Store on Credibility Record','Informs Assignment/Transfer'];
    const panels = [
      UI.card('Open Quarterly Rating Cycle', UI.detailRows([
        { label: 'Quarter', value: cycle.quarter }, { label: 'Status', value: UI.badge(cycle.status) },
        { label: 'Due Date', value: VMP.formatDate(cycle.due_date) }, { label: 'Rubric', value: cycle.rubric.join(' · ') }
      ]) + UI.alert('info', 'HR Operations opens the quarterly cycle. Every active contractor with an assignment must be rated by the reporting manager.')),
      UI.card('Rate Contractor on Rubric', rubricForm),
      UI.card('Submit Rating & Comments', rubricForm),
      UI.card('HR Reviews for Completeness', UI.alert('info', 'HR Operations checks that all rubric fields are complete, comments exist where required, and there is no conflict of interest before recording.') + historyTable),
      UI.card('Contractor Credibility Record', UI.alert('info', 'Validated ratings and concern outcomes build an immutable credibility record that travels with the contractor across projects and managers.') + credibilityTable),
      UI.card('Used for Assignment & Transfer Decisions', UI.alert('success', 'HR / TAQ use rating history and standing when reassigning contractors, approving transfers, and giving vendor feedback.') + credibilityTable)
    ];
    return SH.workflowBanner('Contractor Quarterly Performance Rating', steps, 'Manager Rates on Rubric',
      'Ratings run every quarter on a fixed rubric (Quality, Communication, Delivery, Professionalism, Reliability). HR validates before results are stored on the credibility record.',
      panels) + UI.card('Performance History', historyTable);
  },

  // ---- Manager: Flag a performance concern ----
  renderPerformanceFlag() {
    const team = VMP.getManagerTeam('u4');
    const myConcerns = (VMP_DATA.performanceConcerns || []).filter(p => p.manager_id === 'u4' || team.some(c => c.id === p.contractor_id));
    const flagForm = UI.formGrid([
      { label: 'Contractor', type: 'select', options: (team.length ? team : VMP_DATA.contractors).map(c => ({ label: c.full_name })) },
      { label: 'Concern Reason', type: 'select', options: ['Suspected non-delivery — no visible output','Not working claimed hours','Unreachable / unresponsive','Quality below expectation'] },
      { label: 'Affected Period', value: '2025-06-02 to 2025-06-13' },
      { label: 'Disputed Hours', value: '40' },
      { label: 'Evidence / Examples', type: 'textarea', value: 'No commits/submissions, missed standups, empty sprint board.', full: true }
    ]) + UI.alert('warning', 'Flagging notifies HR Operations, who will connect with the contractor and verify the work before any payment adjustment. Only sustained non-work results in unpaid hours.') +
    '<div class="form-actions"><button class="btn btn-primary">Flag Contractor for Performance Concern</button></div>';

    const myTable = UI.table(['Contractor','Reason','Period','Disputed Hrs','Status','Outcome'],
      myConcerns.map(p => `<tr data-nav="contractors/profile?id=${p.contractor_id}"><td>${VMP.getContractor(p.contractor_id)?.full_name}</td><td style="font-size:.8rem">${p.reason}</td><td>${p.period}</td><td>${p.disputed_hours}h</td><td>${UI.badge(p.status)}</td><td style="font-size:.8rem">${p.outcome || '—'}</td></tr>`),
      'You have not flagged any contractors.'
    );

    const steps = ['Manager Flags','HR Notified','HR Verifies Work','Findings Recorded','Manager Confirms','Vendor Notified (if sustained)','Hours Adjusted','Credibility Updated'];
    const panels = [
      UI.card('Flag Contractor for Performance Concern', flagForm),
      UI.card('HR Notified & Flag Recorded', UI.alert('info', 'A case is created and HR Operations is notified with contractor, project, and period.') + myTable),
      UI.card('HR Verifies Work', UI.alert('info', 'HR Operations connects with the contractor and reviews deliverables, artefacts, and online submissions.') + myTable),
      UI.card('Findings Recorded', myTable),
      UI.card('Manager Confirms Outcome', myTable),
      UI.card('Vendor Notified (if sustained)', UI.alert('warning', 'If non-work is sustained, HR notifies the vendor manager: no payment for unworked hours.') + myTable),
      UI.card('Hours Adjusted', UI.alert('info', 'Finance blocks or adjusts the disputed timesheet/payment lines.') + myTable),
      UI.card('Credibility Updated', UI.alert('success', 'The case outcome is recorded on the contractor credibility record.') + myTable)
    ];
    return SH.workflowBanner('Contractor Performance Concern & Work Verification', steps, 'Manager Flags',
      'Use when you suspect a contractor is not performing or not working the hours claimed. HR investigates before any payment adjustment.',
      panels) + UI.card('My Flagged Contractors', myTable);
  },

  // ---- HR: Performance concern investigation queue ----
  renderPerformanceConcerns() {
    const concerns = VMP_DATA.performanceConcerns || [];
    const open = concerns.filter(c => c.status === 'Under Investigation' || c.status === 'Flagged');
    const detailId = Router.getQueryParam('id');
    const focus = concerns.find(c => c.id === detailId) || open[0] || concerns[0];

    const stats = UI.statsGrid([
      { value: open.length, label: 'Open Investigations', class: 'warning' },
      { value: concerns.filter(c => c.status === 'Sustained').length, label: 'Non-Work Sustained', class: 'danger' },
      { value: concerns.filter(c => c.status === 'Cleared').length, label: 'Cleared', class: 'success' },
      { value: concerns.reduce((s, c) => s + (c.status === 'Sustained' ? c.disputed_hours : 0), 0), label: 'Hours Blocked (Sustained)' }
    ]);

    const queue = UI.table(['Contractor','Flagged By','Reason','Period','Disputed Hrs','Vendor Notified','Status','Actions'],
      concerns.map(c => `<tr data-nav="hr/performance-concerns?id=${c.id}"><td>${VMP.getContractor(c.contractor_id)?.full_name}</td><td>${VMP.getUser(c.manager_id)?.full_name}</td><td style="font-size:.8rem">${c.reason}</td><td>${c.period}</td><td>${c.disputed_hours}h</td><td>${c.vendor_notified ? '✓' : '—'}</td><td>${UI.badge(c.status)}</td><td>${(c.status === 'Under Investigation' || c.status === 'Flagged') ? '<button class="btn btn-sm btn-success" data-action="resolve-concern" data-id="' + c.id + '" data-outcome="cleared">Clear</button> <button class="btn btn-sm btn-danger" data-action="resolve-concern" data-id="' + c.id + '" data-outcome="sustained">Sustain</button>' : '—'}</td></tr>`)
    );

    const detailCard = focus ? UI.card(`Case Detail — ${VMP.getContractor(focus.contractor_id)?.full_name}`, UI.detailRows([
      { label: 'Contractor', value: VMP.getContractor(focus.contractor_id)?.full_name },
      { label: 'Flagged By', value: VMP.getUser(focus.manager_id)?.full_name },
      { label: 'Flagged Date', value: VMP.formatDate(focus.flagged_date) },
      { label: 'Reason', value: focus.reason },
      { label: 'Affected Period', value: focus.period },
      { label: 'Evidence', value: focus.evidence },
      { label: 'Disputed Hours', value: focus.disputed_hours + 'h' },
      { label: 'HR Owner', value: VMP.getUser(focus.hr_owner)?.full_name },
      { label: 'Findings', value: focus.findings || '<em>Investigation in progress</em>' },
      { label: 'Outcome', value: focus.outcome ? UI.badge(focus.status) + ' ' + focus.outcome : UI.badge(focus.status) },
      { label: 'Vendor Notified', value: focus.vendor_notified ? 'Yes — no payment for unworked hours' : 'No' }
    ]) + ((focus.status === 'Under Investigation' || focus.status === 'Flagged') ?
      UI.alert('info', 'HR Operations reviews deliverables and online submissions, then records findings. Sustained non-work is shared with the vendor manager and disputed hours are blocked in Finance.') +
      '<div class="form-actions"><button class="btn btn-success" data-action="resolve-concern" data-id="' + focus.id + '" data-outcome="cleared">Record: Cleared (No Action)</button><button class="btn btn-danger" data-action="resolve-concern" data-id="' + focus.id + '" data-outcome="sustained">Record: Non-Work Sustained</button></div>'
      : UI.alert(focus.status === 'Sustained' ? 'danger' : 'success', 'Case closed — ' + focus.outcome))) : '';

    const steps = ['Flag Received','Connect with Contractor','Review Work & Submissions','Record Findings','Manager Confirms','Notify Vendor (if sustained)','Adjust Hours','Update Credibility'];
    const panels = [
      UI.card('Flag Received', stats + queue),
      UI.card('Connect with Contractor', detailCard),
      UI.card('Review Work & Online Submissions', detailCard),
      UI.card('Record Findings', detailCard),
      UI.card('Manager Confirms Outcome', detailCard),
      UI.card('Notify Vendor Manager', detailCard),
      UI.card('Adjust / Block Disputed Hours', detailCard),
      UI.card('Update Credibility Record', queue)
    ];
    return SH.workflowBanner('Contractor Performance Concern & Work Verification', steps, 'Review Work & Submissions',
      'HR Operations investigates flagged contractors before any payment change. Only sustained non-work leads to unpaid hours and vendor notification.',
      panels);
  },

  // ---- Finance: Invoice Approval chain ----
  renderInvoiceApproval() {
    const invoices = VMP_DATA.invoices;
    const stats = UI.statsGrid([
      { value: invoices.filter(i => i.approval_stage !== 'Approved & Eligible for Payment' && i.reconciliation_status !== 'Blocked').length, label: 'Awaiting Approval', class: 'warning' },
      { value: invoices.filter(i => i.reconciliation_status === 'Blocked').length, label: 'Reconciliation Blocked', class: 'danger' },
      { value: invoices.filter(i => i.dual_approval_required).length, label: 'Dual Approval Required', class: 'warning' },
      { value: invoices.filter(i => i.approval_stage === 'Approved & Eligible for Payment').length, label: 'Approved for Payment', class: 'success' }
    ]);

    const chainCell = (status) => UI.badge(status || 'Pending');
    const table = UI.table(['Invoice #','Vendor','Amount','Completeness','Reconciliation','PM Confirm','Budget Owner','Finance','Dual','Stage','Actions'],
      invoices.map(i => `<tr class="${i.reconciliation_status === 'Blocked' ? 'row-blocked' : ''}" data-nav="finance/invoice-reconcile?id=${i.id}">
        <td><strong>${i.invoice_number}</strong></td>
        <td>${VMP.getVendor(i.vendor_id)?.vendor_name}</td>
        <td>${VMP.formatCurrency(i.invoice_amount)}</td>
        <td>${chainCell(i.completeness_status)}</td>
        <td>${chainCell(i.reconciliation_status)}</td>
        <td>${chainCell(i.pm_confirmation_status)}</td>
        <td>${chainCell(i.budget_approval_status)}</td>
        <td>${chainCell(i.finance_approval_status)}</td>
        <td>${i.dual_approval_required ? (i.approver1 && i.approver2 ? '✓ Both' : i.approver1 ? '1/2' : '⚠ Req') : '—'}</td>
        <td>${UI.badge(i.approval_stage)}</td>
        <td>${(i.approval_stage !== 'Approved & Eligible for Payment' && i.reconciliation_status !== 'Blocked') ? '<button class="btn btn-sm btn-primary" data-action="advance-invoice" data-id="' + i.id + '">Advance Stage</button>' : (i.reconciliation_status === 'Blocked' ? '<a href="#finance/invoice-reconcile?id=' + i.id + '" class="btn btn-sm btn-secondary">Resolve</a>' : '—')}</td>
      </tr>`)
    );

    const steps = ['Submit / Upload','Completeness & Compliance','Reconcile vs Batch & PO/SOW','PM Confirms Services','Budget Owner Approves','Finance Approves','Dual Approval','Approved for Payment'];
    const panels = [
      UI.card('Submit or Upload Invoice', UI.alert('info', 'Vendor submits or Finance uploads the invoice with mandatory tax fields, service period, project/SOW/PO, and supporting timesheets.') + '<a href="#finance/invoice-upload" class="btn btn-sm btn-primary">Upload Invoice</a>'),
      UI.card('Completeness & Compliance Check', stats + table),
      UI.card('Reconcile Against Approved Payment Batch & PO/SOW', table),
      UI.card('Project Manager Confirms Services & Approved Hours', UI.alert('info', 'The reporting / project manager confirms services were delivered and hours match before the charge is approved.') + table),
      UI.card('Budget Owner Approves Charge', UI.alert('info', 'Budget owner / program manager validates the charge against project budget, cost centre, and PO balance.') + table),
      UI.card('Finance Approves or Rejects', table),
      UI.card('Dual Approval (threshold / policy)', UI.alert('warning', `Invoices above the $${VMP_DATA.config.dual_approval_threshold_usd.toLocaleString()} USD threshold require a second finance approver.`) + table),
      UI.card('Approved & Eligible for Payment', UI.alert('success', 'Once all approvals clear, the invoice is marked approved and flows to Payment & Settlement.') + table)
    ];
    return SH.workflowBanner('Invoice Approval', steps, 'PM Confirms Services', null, panels) +
    UI.alert('info', 'Control: the uploader, service confirmer, budget approver, and Finance approver must be separate people where staffing permits. Any segregation-of-duties exception needs Finance Head approval.');
  },

  // ---- Finance: Invoice Payment & Settlement ----
  renderInvoicePayment() {
    const eligible = VMP_DATA.invoices.filter(i => i.approval_stage === 'Approved & Eligible for Payment');
    const stats = UI.statsGrid([
      { value: eligible.filter(i => i.settlement_status === 'Scheduled').length, label: 'Scheduled', class: 'warning' },
      { value: eligible.filter(i => i.settlement_status === 'Released').length, label: 'Released', class: 'success' },
      { value: eligible.filter(i => i.settlement_status === 'Paid').length, label: 'Paid', class: 'success' },
      { value: VMP.formatCurrency(eligible.reduce((s, i) => s + i.invoice_amount + i.tax_amount, 0)), label: 'Total Payable' }
    ]);
    const table = UI.table(['Invoice #','Vendor','Amount','Value Date','Payment File','Settlement','Remittance','Actions'],
      eligible.map(i => `<tr><td><strong>${i.invoice_number}</strong></td>
        <td>${VMP.getVendor(i.vendor_id)?.vendor_name}</td>
        <td>${VMP.formatCurrency(i.invoice_amount + i.tax_amount)}</td>
        <td>${VMP.formatDate(i.scheduled_date)}</td>
        <td>${i.payment_file_ref || '—'}</td>
        <td>${UI.badge(i.settlement_status)}</td>
        <td>${i.remittance_sent ? '✓ Sent' : '—'}</td>
        <td>${i.settlement_status === 'Paid' ? '—' : '<button class="btn btn-sm btn-primary" data-action="advance-settlement" data-id="' + i.id + '">Advance</button>'}</td>
      </tr>`),
      'No approved invoices awaiting settlement.'
    );
    const steps = ['Schedule Approved Invoice','Generate Payment File','Approve & Release Payment','Mark Invoice & Batch Paid','Send Remittance Advice'];
    const panels = [
      UI.card('Schedule Approved Invoice for Payment', UI.alert('info', 'Only approved invoices with verified vendor bank details and no payment hold are scheduled for their due date.') + stats + table),
      UI.card('Generate Payment File / Bank Instruction', table),
      UI.card('Approve & Release Payment (Maker-Checker)', UI.alert('info', 'Payment release uses maker-checker separation — an authorised approver / treasury releases the bank instruction.') + table),
      UI.card('Mark Invoice & Batch Paid', table),
      UI.card('Send Remittance Advice to Vendor', UI.alert('success', 'Remittance advice with payment reference is sent to the vendor after settlement.') + table)
    ];
    return SH.workflowBanner('Invoice Payment & Settlement', steps, 'Approve & Release Payment', null, panels);
  }
};
