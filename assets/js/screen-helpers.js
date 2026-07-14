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
        desc: 'Orchestrates hiring: intake MFRs, post job positions to vendors, route vendor-shortlisted profiles to managers, monitor pipeline status. Does not schedule interviews, onboard candidates, or run BGV.',
        workflow: 'MFR → Post to Vendor → Vendor Shortlist → Route to Manager → HR: Interview → HR: Onboarding'
      },
      hr: {
        title: 'HR Operations',
        desc: 'Operational hiring: schedule interviews after manager selection, send offers, contractor onboarding, BGV, documents, assignments, and hand approved hours to Finance.',
        workflow: 'Manager Selection → HR Schedules Interview → Offer → Onboarding → BGV → Assignment → Active'
      },
      manager: {
        title: "Contractor's Manager (Supervisor)",
        desc: 'Approve your team\'s submitted timesheets (first approval step), submit MFRs, and rate performance. Timesheets you approve move to HR Ops, then Finance.',
        workflow: 'Contractor Submits → Supervisor Approves → HR Ops Approves → Finance Reviews → Batch'
      },
      contractor: {
        title: 'Contractor Portal',
        desc: 'Submit your own hours, track approval and payment status per period, upload/update documents, and request leave (with balance shown).',
        workflow: 'Submit Hours → Supervisor Approves → HR Ops Approves → Finance Reviews → Payment'
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

  _mfrTable() {
    return UI.table(['MFR ID','Role','Requested By','Headcount','Urgency','Status','Job Order','Date','Actions'],
      VMP_DATA.mfrs.map(m => `<tr><td>${m.id}</td><td>${m.role_title}</td><td>${VMP.getUser(m.requested_by)?.full_name}</td><td>${m.headcount}</td><td>${UI.badge(m.urgency)}</td><td>${UI.badge(m.status)}</td><td>${m.open_position_id||'—'}</td><td>${VMP.formatDate(m.created_date)}</td><td>${m.status==='Raised'?'<button class="btn btn-sm btn-primary">Convert to Job Order</button>':'—'}</td></tr>`)
    );
  },

  renderMfrManagement() {
    const steps = ['MFR Raised', 'TAQ Review', 'Post to Vendor', 'Vendor Shortlist', 'Route to Manager', 'HR Takes Over'];
    const note = 'TAQ orchestrates only — does not interview or onboard. After routing profiles to the manager, HR Ops schedules interviews and runs onboarding/BGV.';
    const panels = [
      UI.card('MFR Raised', UI.alert('info', 'Managers submit manpower requests with role, skills, and headcount.') + SH._mfrTable()),
      UI.card('TAQ Review', UI.alert('info', 'TAQ validates budget, skills match, and project alignment before posting to vendors.') + SH._mfrTable()),
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
    return SH.workflowBanner('Post Position to Vendor', ['MFR Approved', 'Create Position', 'Select Vendors', 'Issue Job Order', 'Vendor Responds'],
      'Issue Job Order', 'When MFR is approved, TAQ posts the job position to selected vendors. Vendors shortlist candidates from their own company.') +
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
        const mfr = VMP_DATA.mfrs.find(m => m.open_position_id === op?.id);
        const managerId = mfr?.requested_by || 'u4';
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
        { label: 'TAQ Orchestrator', value: 'MFR intake, post to vendors, route profiles to manager, monitor pipeline' },
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
            ${c.stage !== 'Onboarded' ? `<button class="btn btn-sm btn-danger" data-action="reject-candidate" data-id="${c.id}">Reject / Withdraw</button>` : ''}
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

  /** Dashboard widget: contracts & documents expiring in 30 / 60 / 90 days */
  expiringSoonWidget() {
    const items = VMP.getExpiringItems(90);
    const in30 = items.filter(i => i.days <= 30).length;
    const in60 = items.filter(i => i.days > 30 && i.days <= 60).length;
    const in90 = items.filter(i => i.days > 60 && i.days <= 90).length;
    const summary = `<div style="display:flex;gap:1rem;margin-bottom:.75rem;flex-wrap:wrap">
      <span class="chip" style="background:#fee2e2">Next 30 days: <strong>${in30}</strong></span>
      <span class="chip" style="background:#fef3c7">31–60 days: <strong>${in60}</strong></span>
      <span class="chip" style="background:#eff6ff">61–90 days: <strong>${in90}</strong></span>
    </div>`;
    const table = items.length ? UI.table(['Item', 'Type', 'Reference', 'Expiry', 'Window'],
      items.map(i => `<tr data-nav="${i.nav}"><td>${i.name}</td><td>${i.type}</td><td>${i.ref || '—'}</td><td>${VMP.formatDate(i.expiry)}</td><td>${UI.badge(i.days < 0 ? 'Expired' : VMP.expiryBucket(i.days))}</td></tr>`)
    ) : UI.alert('success', 'Nothing expiring in the next 90 days.');
    return UI.card('Expiring Soon — Contracts & Documents', summary + table);
  },

  /** Document Repository — every actor has this page. Grouped by category, then by date. */
  renderDocumentRepository() {
    const role = VMP.currentRole;
    const roleLabel = NAV_CONFIG[role]?.label || role;
    const all = VMP.getRepositoryDocuments(role);
    const categories = VMP.DOC_CATEGORIES;
    const today = new Date().toISOString().slice(0, 10);

    const addForm = UI.card('Add Document', UI.alert('info', 'Documents submitted anywhere in the system land in this repository. You can also add one here at any time.') + UI.formGrid([
      { label: 'Category', type: 'select', options: categories.map(c => ({ label: c })) },
      { label: 'Document Type', type: 'select', options: ['MSA', 'SOW', 'SLA', 'NDA', 'Insurance', 'Company Registration', 'ID Proof', 'Bank Details', 'Tax Forms', 'BGV Consent', 'Other'] },
      { label: 'Document Name', value: 'New-Document.pdf' },
      { label: 'Related To', type: 'select', options: role === 'contractor'
        ? [{ label: 'Me (Contractor)' }]
        : role === 'vendor'
          ? [{ label: 'My Vendor Account' }]
          : [{ label: 'Acme Staffing (Vendor)' }, { label: 'Amit Joshi (Contractor)' }, { label: 'TechTalent (Vendor)' }] }
    ]) + '<div class="form-actions"><button class="btn btn-primary" data-action="repo-add-doc">Add to Repository</button></div>');

    const stats = UI.statsGrid(categories.map(cat => {
      const count = all.filter(d => (d.category || VMP.docCategory(d.document_type)) === cat).length;
      return { value: count, label: cat, class: count ? '' : 'muted' };
    }));

    const tabDefs = categories.map(cat => {
      const docs = all
        .filter(d => (d.category || VMP.docCategory(d.document_type)) === cat)
        .sort((a, b) => String(b.updated_at || b.created_at).localeCompare(String(a.updated_at || a.created_at)));
      const byDate = {};
      docs.forEach(d => {
        const key = d.updated_at || d.created_at || 'Unknown';
        if (!byDate[key]) byDate[key] = [];
        byDate[key].push(d);
      });
      const dateKeys = Object.keys(byDate).sort((a, b) => b.localeCompare(a));
      let body;
      if (!docs.length) {
        body = UI.alert('info', `No ${cat} documents in your repository yet. Add one above — at least one sample will appear for the mock.`);
      } else {
        body = dateKeys.map(date => {
          const rows = byDate[date];
          return `<div style="margin-bottom:1.25rem">
            <div style="font-size:.8rem;font-weight:600;color:var(--muted);margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.04em">
              ${date === today ? 'Updated today' : 'Updated / created · ' + VMP.formatDate(date)}
              <span style="font-weight:500;margin-left:.35rem">(${rows.length})</span>
            </div>
            ${UI.table(['Document', 'Type', 'Entity', 'Created', 'Updated', 'Status', 'Actions'],
              rows.map(d => {
                const needsFollowUp = d.status === 'Pending Upload' || d.status === 'Rejected';
                const actions = needsFollowUp
                  ? `<button class="btn btn-sm btn-primary" data-action="send-doc-reminder" data-id="${d.id}">Send Reminder</button>`
                  : `<button class="btn btn-sm btn-secondary" data-action="open-doc" data-id="${d.document_name || d.id}">Open</button>
                     <button class="btn btn-sm btn-secondary">Download</button>`;
                return `<tr>
                  <td><strong>${d.document_name || '— (not uploaded)'}</strong></td>
                  <td>${d.document_type}</td>
                  <td>${VMP.entityLabelForDoc(d)}</td>
                  <td>${VMP.formatDate(d.created_at)}</td>
                  <td>${VMP.formatDate(d.updated_at)}</td>
                  <td>${UI.badge(d.status)}</td>
                  <td>${actions}</td>
                </tr>`;
              })
            )}
          </div>`;
        }).join('');
      }
      return { label: `${cat} (${docs.length})`, content: body };
    });

    return UI.alert('info', `<strong>${roleLabel} — Document Repository.</strong> Every submitted document is filed here, segregated by type (Compliance, SOW, SLA, NDA, MSA) and then by the date it was created or last updated.`) +
      stats + addForm + UI.tabs(tabDefs);
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

  // ---- Supervisor (Manager): first approval step in the timesheet flow ----
  renderManagerTimesheets() {
    const all = SH.timesheets();
    const awaiting = all.filter(t => !['Supervisor Approved', 'Confirmed', 'In Finance Batch', 'Paid', 'Rejected'].includes(t.manager_approval_status) && t.reconciliation_status !== 'Paid' && t.reconciliation_status !== 'In Finance Batch');
    const approved = all.filter(t => t.manager_approval_status === 'Supervisor Approved' || t.manager_approval_status === 'Confirmed' || ['In Finance Batch', 'Paid', 'Confirmed'].includes(t.reconciliation_status));

    const queueTable = UI.table(['Contractor', 'Week', 'Submitted', 'Leave Flag', 'Holiday Flag', 'Downstream', 'Actions'],
      awaiting.map(t => {
        const blocked = t.leave_mismatch || t.holiday_mismatch;
        return `<tr class="${blocked ? 'row-blocked' : ''}">
          <td>${VMP.getContractor(t.contractor_id)?.full_name}</td>
          <td>${VMP.formatDate(t.work_period_start)} – ${VMP.formatDate(t.work_period_end)}</td>
          <td>${t.submitted_hours}h</td>
          <td>${t.leave_mismatch ? '⚠ Leave on file' : '—'}</td>
          <td>${t.holiday_mismatch ? '⚠ Holiday' : '—'}</td>
          <td><span style="font-size:.75rem;color:var(--muted)">Then HR Ops → Finance</span></td>
          <td><button class="btn btn-sm btn-success" data-action="supervisor-approve-ts" data-id="${t.id}">Approve</button> <button class="btn btn-sm btn-danger" data-action="reject" data-type="Timesheet" data-id="${t.id}">Reject</button></td>
        </tr>`;
      }),
      'No timesheets awaiting your approval.'
    );

    const approvedTable = UI.table(['Contractor', 'Week', 'Hours', 'Your Approval', 'HR Ops', 'Status'],
      approved.map(t => `<tr><td>${VMP.getContractor(t.contractor_id)?.full_name}</td><td>${VMP.formatDate(t.work_period_start)} – ${VMP.formatDate(t.work_period_end)}</td><td>${t.approved_hours || t.submitted_hours}h</td><td>${UI.badge('Supervisor Approved')}</td><td>${UI.badge(t.hr_approval_status || (['In Finance Batch', 'Paid', 'Confirmed'].includes(t.reconciliation_status) ? 'HR Approved' : 'Pending'))}</td><td>${UI.badge(t.reconciliation_status)}</td></tr>`),
      'None approved yet.'
    );

    const steps = ['Contractor Submits', 'Supervisor Approves', 'HR Ops Approves', 'Finance Reviews', 'Finance Batch'];
    const panels = [
      UI.card('Contractor Submits', UI.alert('info', 'Contractors submit their own hours in the portal.') +
        UI.table(['Contractor', 'Week', 'Submitted', 'Status'], all.slice(0, 5).map(t => `<tr><td>${VMP.getContractor(t.contractor_id)?.full_name}</td><td>${VMP.formatDate(t.work_period_start)} – ${VMP.formatDate(t.work_period_end)}</td><td>${t.submitted_hours}h</td><td>${UI.badge(t.manager_approval_status)}</td></tr>`))),
      UI.card('Supervisor Approves (You)', UI.statsGrid([
        { value: awaiting.length, label: 'Awaiting Your Approval', class: 'warning' },
        { value: approved.length, label: 'Approved', class: 'success' },
        { value: awaiting.filter(t => t.leave_mismatch || t.holiday_mismatch).length, label: 'Flagged (resolve first)', class: 'danger' }
      ]) + UI.alert('info', 'As reporting manager you confirm the hours are correct before they move to HR Ops. This is a real approval step — not just a CC.') + queueTable),
      UI.card('HR Ops Approves', UI.alert('info', 'After your approval, HR Ops (the process owner) approves before Finance.') + approvedTable),
      UI.card('Finance Reviews', UI.alert('info', 'Finance performs a read-only final check.') + approvedTable),
      UI.card('Finance Batch', UI.alert('success', 'Approved hours flow into finance payment batches.') + approvedTable)
    ];

    return SH.workflowBanner('Timesheet Approval', steps, 'Supervisor Approves',
      'New flow: Contractor Submits → Supervisor Approves → HR Ops Approves → Finance Reviews → Finance Batch. You are the first approver.',
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

    const activeOnboarding = VMP_DATA.contractors.filter(c => c.status === 'Onboarding' || (c.onboarding_stage !== 'Active' && c.onboarding_stage !== 'Archived'));
    const listView = UI.card('All Active Onboardings — List View', UI.table(['Contractor', 'Vendor', 'Current Step', 'BGV', 'Blocked On', 'Action'],
      activeOnboarding.map(c => {
        const blocked = c.bgv_status !== 'Cleared' ? 'BGV ' + c.bgv_status : (!VMP.getActiveRate(c.id) ? 'Rate not approved' : 'Awaiting activation');
        return `<tr data-nav="contractors/profile?id=${c.id}"><td>${c.full_name}</td><td>${VMP.getVendor(c.vendor_id)?.vendor_name}</td><td>${UI.badge(c.onboarding_stage)}</td><td>${UI.badge(c.bgv_status)}</td><td><span style="color:#dc2626">${blocked}</span></td><td><a href="#contractors/profile?id=${c.id}" class="btn btn-sm btn-secondary">Open</a></td></tr>`;
      }),
      'No active onboardings.'
    ));
    return SH.workflowBanner('Contractor Onboarding', steps, 'Docs Submitted',
      'Vendor must be approved before onboarding. BGV must clear before contractor activation. Rate must be approved by Finance.',
      panels) + listView;
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
    (ap.status === 'Pending'
      ? '<div class="form-group full" style="margin-top:1rem"><label>Decision note (required on reject, optional on approve)</label><textarea rows="2" placeholder="Add a note explaining your decision..."></textarea></div><div class="form-actions">' + UI.approveRejectButtons(ap.entity_type, ap.entity_id) + '</div>'
      : UI.alert(ap.status === 'Rejected' ? 'danger' : 'success', 'This request has been ' + ap.status.toLowerCase() + '.' + (ap.rejection_note ? ' Note: "' + ap.rejection_note + '"' : ''))));

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
      'Job Order Issued', 'TAQ posts approved MFR as job order to vendor. Vendor shortlists candidates from their bench — TAQ routes profiles to manager; HR handles interviews.') +
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

    const requested = op?.no_of_positions || 0;
    const submittedForJob = mine.filter(c => c.job_order_id === jobId).length;
    const overHeadcount = requested > 0 && submittedForJob >= requested;
    const headcountWarning = overHeadcount
      ? UI.alert('warning', `⚠ You have already submitted ${submittedForJob} candidate(s) for this job order, which requested only ${requested}. Submitting more exceeds the requested headcount — confirm with TAQ before proceeding.`)
      : UI.alert('info', `This job order requested ${requested} position(s). You have submitted ${submittedForJob} so far.`);

    const submitForm = UI.card('Submit Candidate Profile', headcountWarning + UI.formGrid([
      { label: 'Job Order', value: jobId + ' — ' + (op?.position_title || 'Open Role'), disabled: true },
      { label: 'Candidate Name', value: '' },
      { label: 'Email', value: '' },
      { label: 'Phone', value: '' },
      { label: 'Skills Match', value: op?.skill_set || '' },
      { label: 'Experience (years)', value: '5' },
      { label: 'Available From', type: 'date', value: '2025-07-15' },
      { label: 'Resume / CV (PDF/DOCX)', type: 'file', value: 'Attach resume', full: true },
      { label: 'Notes', type: 'textarea', value: 'Strong match for role requirements. Available for interview next week.', full: true }
    ]) + `<div class="form-actions"><button class="btn btn-primary">Submit to TAQ for Routing</button></div>`);

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
          <td>${VMP.formatDate(c.exit_date || c.contract_end_date) || '—'}${(c.exit_date || c.contract_end_date) ? ' <button class="btn btn-sm btn-secondary" data-action="track-enddate" data-id="' + c.id + '">Track</button>' : ''}</td>
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
      'Renewal / Exit', 'Vendor ensures contractor deliverables match signed SOW. Start a renewal or exit directly from the Actions column when a SOW is nearing its end date.') +
    UI.alert('info', 'End dates below are pulled from each contractor\'s signed contract record — the same source as the SOW documents table, so both always agree.') +
    UI.card('SOW Compliance & Deliverables', UI.table(['Contractor', 'Project', 'SOW Document', 'Deliverables', 'Compliance', 'End Date', 'Manager Feedback', 'Actions'],
      records.map(sc => {
        const c = VMP.getContractor(sc.contractor_id);
        const endDate = c?.contract_end_date || sc.end_date;
        const days = VMP.daysUntil(endDate);
        const bucket = (days !== null && days <= 90) ? VMP.expiryBucket(days) : null;
        return `<tr>
        <td>${c?.full_name}</td>
        <td>${VMP.getProject(sc.project_id)?.project_code}</td>
        <td><span class="entity-link" data-action="open-doc" data-id="${sc.sow_document}">${sc.sow_document}</span></td>
        <td>${UI.badge(sc.deliverables_status)}</td>
        <td>${UI.badge(sc.compliance_status)}</td>
        <td>${VMP.formatDate(endDate) || '—'}${bucket ? ' ' + UI.badge(bucket) : ''}</td>
        <td style="font-size:.8rem;max-width:180px">${sc.manager_feedback}</td>
        <td><button class="btn btn-sm btn-primary" data-action="renew-sow" data-id="${sc.contractor_id}">Renew</button> <button class="btn btn-sm btn-secondary" data-action="start-exit-sow" data-id="${sc.contractor_id}">Start Exit</button></td>
      </tr>`;
      })
    )) + UI.card('Vendor SOW Documents', UI.table(['Type', 'Document', 'Expiry', 'Renewal Due', 'Status', 'Actions'],
      VMP.getVendorDocuments(vid).map(d => {
        const days = VMP.daysUntil(d.expiry_date);
        const bucket = (days !== null && days <= 90) ? VMP.expiryBucket(days) : null;
        return `<tr><td>${d.document_type}</td><td><span class="entity-link" data-action="open-doc" data-id="${d.document_name}">${d.document_name}</span></td><td>${VMP.formatDate(d.expiry_date)}${bucket ? ' ' + UI.badge(bucket) : ''}</td><td>${VMP.formatDate(d.renewal_date) || '—'}</td><td>${UI.badge(d.verification_status)}</td><td><button class="btn btn-sm btn-primary" data-action="renew-sow" data-id="${d.id}">Renew</button></td></tr>`;
      })
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
    const dateRange = `<div class="form-grid" style="margin-bottom:1rem">
      <div class="form-group"><label>Period — From</label><input type="date" value="2025-05-01"></div>
      <div class="form-group"><label>Period — To</label><input type="date" value="2025-05-31"></div>
      <div class="form-group"><label>Quick Range</label><select><option>Custom</option><option selected>This Month</option><option>Last Month</option><option>This Quarter</option><option>YTD</option></select></div>
    </div>`;
    return UI.card('Vendor Reports & Dashboards', UI.statsGrid([
      { value: contractors.length, label: 'Active Headcount' },
      { value: VMP.formatCurrency(monthly), label: 'Monthly Bill Value' },
      { value: '94%', label: 'Fill Rate SLA' },
      { value: '18 days', label: 'Avg Time-to-Fill' }
    ]) + UI.alert('info', 'Pick a period below before running any period-based report (marked with a date icon).') + dateRange + UI.table(['Report', 'Description', 'Period-based', 'Actions'],
      [
        ['Contractor Headcount Report', 'Active, onboarding, and exiting contractors by project', false],
        ['Payment History', 'Invoices approved and paid by period', true],
        ['SOW Compliance Summary', 'Deliverables and compliance status across assignments', false],
        ['Performance Summary', 'Manager ratings aggregated by contractor', true],
        ['SLA Dashboard', 'Fill rate, time-to-fill, and response time on job orders', true]
      ].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2] ? '📅 Yes — uses date range above' : '—'}</td><td><button class="btn btn-sm btn-primary">Run</button> <button class="btn btn-sm btn-secondary">Export PDF</button></td></tr>`)
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
  },

  // ========== INVOICE MANAGEMENT MODULE ==========
  /** Invoices scoped to the current actor (vendor sees only its own) */
  invoicesForRole() {
    if (VMP.currentRole === 'vendor') {
      const vid = VMP.getCurrentVendorId();
      return VMP_DATA.invoices.filter(i => i.vendor_id === vid);
    }
    return VMP_DATA.invoices;
  },

  invoiceStageSteps: ['Vendor Raises', 'HR Ops SOW Validation', 'TA Approval', 'Finance Processing', 'Paid'],

  invoiceStageIndex(inv) {
    const map = {
      'Submitted': 0, 'SOW Validation': 1, 'TA Approval': 2,
      'Finance Processing': 3, 'Paid': 4, 'Disputed': 1
    };
    return map[inv.invoice_stage] ?? 0;
  },

  /** Access matrix note shown at the top of the invoice module */
  invoiceAccessNote() {
    return UI.card('Who Does What — Invoice Lifecycle', UI.table(['Role', 'Responsibility', 'Access'],
      [
        ['Vendor', 'Raises / submits invoices against a completed billing period', 'Own invoices + status only'],
        ['HR Ops', 'Validates invoice against SOW terms (headcount, rate, billing period)', 'First checkpoint — validate / dispute'],
        ['TA (Orchestrator)', 'Approves the SOW-validated invoice', 'Approve / reject'],
        ['Finance', 'Processes approved invoices — batching, disbursement, mark paid', 'Payment processing'],
        ['TAQ Orchestrator', 'Read-only across the flow — "has this vendor been paid?"', 'Read-only']
      ].map(r => `<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td><td>${r[2]}</td></tr>`)
    ));
  },

  renderInvoiceRegister() {
    const role = VMP.currentRole;
    const invoices = SH.invoicesForRole();
    const isVendor = role === 'vendor';

    const stats = UI.statsGrid([
      { value: invoices.filter(i => i.invoice_stage === 'SOW Validation').length, label: 'In SOW Validation', class: 'warning' },
      { value: invoices.filter(i => i.invoice_stage === 'TA Approval').length, label: 'Awaiting TA Approval', class: 'warning' },
      { value: invoices.filter(i => i.invoice_stage === 'Disputed').length, label: 'Disputed', class: 'danger' },
      { value: invoices.filter(i => i.invoice_stage === 'Paid').length, label: 'Paid', class: 'success' }
    ]);

    const toolbar = isVendor
      ? UI.toolbar(['<a href="#invoices/raise" class="btn btn-primary btn-sm">+ Raise Invoice</a>', '<input type="search" class="search-input" placeholder="Search my invoices...">'])
      : UI.toolbar(['<input type="search" class="search-input" placeholder="Search invoices...">', '<select><option>All Stages</option><option>SOW Validation</option><option>TA Approval</option><option>Finance Processing</option><option>Paid</option><option>Disputed</option></select>']);

    const table = UI.table(['Invoice #', 'Vendor', 'Project / SOW', 'Billing Period', 'Amount', 'GST', 'Stage', 'Due Date'],
      invoices.map(i => `<tr data-nav="invoices/detail?id=${i.id}">
        <td><strong>${i.invoice_number}</strong></td>
        <td>${VMP.getVendor(i.vendor_id)?.vendor_name}</td>
        <td>${VMP.getProject(i.project_id)?.project_code || '—'}<br><span style="font-size:.72rem;color:var(--muted)">${i.sow_document || '—'}</span></td>
        <td>${VMP.formatDate(i.billing_period_start)} – ${VMP.formatDate(i.billing_period_end)}</td>
        <td>${VMP.formatCurrency(i.invoice_amount, i.currency)} <span style="font-size:.7rem;color:var(--muted)">${i.currency}</span></td>
        <td>${VMP.formatCurrency(i.tax_amount, i.currency)}</td>
        <td>${UI.badge(i.invoice_stage)}</td>
        <td>${VMP.formatDate(i.due_date)}</td>
      </tr>`),
      isVendor ? 'You have not raised any invoices yet.' : 'No invoices in the register.'
    );

    const steps = SH.invoiceStageSteps;
    const note = 'Invoicing runs on its own recurring cycle — separate from the one-time-per-hire tool. Flow: Vendor raises → HR Ops validates against SOW → TA approves → Finance processes.';
    const panels = [
      UI.card('Vendor Raises Invoice', UI.alert('info', 'Vendor submits an invoice against a completed billing period.') + (isVendor ? '<a href="#invoices/raise" class="btn btn-sm btn-primary">Raise Invoice</a>' : '') + stats + table),
      UI.card('HR Ops Validates Against SOW', UI.alert('info', 'HR Ops checks headcount, rate, and billing period against the SOW before it moves forward.') + table),
      UI.card('TA Approves', table),
      UI.card('Finance Processes', table),
      UI.card('Paid', UI.table(['Invoice #', 'Vendor', 'Amount', 'Payment Batch', 'Stage'],
        invoices.filter(i => i.invoice_stage === 'Paid' || i.invoice_stage === 'Finance Processing').map(i => `<tr data-nav="invoices/detail?id=${i.id}"><td>${i.invoice_number}</td><td>${VMP.getVendor(i.vendor_id)?.vendor_name}</td><td>${VMP.formatCurrency(i.invoice_amount, i.currency)}</td><td>${i.invoice_batch_id ? VMP.getInvoiceBatch(i.invoice_batch_id)?.batch_ref : '—'}</td><td>${UI.badge(i.invoice_stage)}</td></tr>`), 'None yet.'))
    ];

    return SH.workflowBanner('Invoice Management (Separate Module)', steps, isVendor ? 'Vendor Raises' : 'HR Ops SOW Validation', note, panels) +
      (isVendor ? UI.alert('info', 'You can raise invoices and track the status of your own invoices only.') : SH.invoiceAccessNote());
  },

  renderInvoiceDetail() {
    const id = Router.getQueryParam('id') || VMP_DATA.invoices[1].id;
    const inv = VMP.getInvoice(id);
    if (!inv) return UI.alert('danger', 'Invoice not found');
    const vendor = VMP.getVendor(inv.vendor_id);
    const role = VMP.currentRole;
    const lines = (VMP_DATA.invoiceLineItems || []).filter(l => l.invoice_id === inv.id);
    const periodTs = VMP_DATA.timesheets.filter(t => t.work_period_start >= inv.billing_period_start && t.work_period_end <= inv.billing_period_end);

    // Side-by-side: Invoice vs SOW terms
    const sowCompare = `<div class="grid-2">
      ${UI.card('Invoice (as billed)', UI.detailRows([
        { label: 'Invoice #', value: inv.invoice_number },
        { label: 'Billing Period', value: `${VMP.formatDate(inv.billing_period_start)} – ${VMP.formatDate(inv.billing_period_end)}` },
        { label: 'Headcount Billed', value: lines.length || inv.sow_headcount },
        { label: 'Rate Billed', value: VMP.formatCurrency(inv.sow_rate, inv.currency) + '/mo' },
        { label: 'Amount', value: VMP.formatCurrency(inv.invoice_amount, inv.currency) },
        { label: 'GST', value: VMP.formatCurrency(inv.tax_amount, inv.currency) }
      ]))}
      ${UI.card('SOW Terms (' + (inv.sow_document || 'SOW') + ')', UI.detailRows([
        { label: 'Project', value: VMP.getProject(inv.project_id)?.project_name || '—' },
        { label: 'SOW Document', value: `<span class="entity-link">${inv.sow_document || '—'}</span>` },
        { label: 'Approved Headcount', value: inv.sow_headcount },
        { label: 'Approved Rate', value: VMP.formatCurrency(inv.sow_rate, inv.currency) + '/mo' },
        { label: 'Billing Period Allowed', value: `${VMP.formatDate(inv.billing_period_start)} – ${VMP.formatDate(inv.billing_period_end)}` },
        { label: 'Match', value: inv.sow_validation_status === 'Disputed' ? '<span style="color:#dc2626">✗ ' + (inv.dispute_reason || 'Mismatch') + '</span>' : '<span style="color:green">✓ Rate, headcount & period align</span>' }
      ]))}
    </div>`;

    const lineTable = UI.card('Line Items (Invoice vs Timesheet vs Rate)', UI.table(
      ['Contractor', 'Hours (Inv)', 'Hours (Approved TS)', 'Rate (Inv)', 'Rate (Approved)', 'Amount', 'Match'],
      lines.length ? lines.map(l => `<tr class="${l.match ? '' : 'row-blocked'}">
        <td>${VMP.getContractor(l.contractor_id)?.full_name || '—'}</td>
        <td>${l.invoice_hours}h</td>
        <td>${l.approved_hours}h</td>
        <td>${VMP.formatCurrency(l.invoice_rate, inv.currency)}</td>
        <td>${VMP.formatCurrency(l.approved_rate, inv.currency)}</td>
        <td>${VMP.formatCurrency(l.amount, inv.currency)}</td>
        <td>${l.match ? '<span style="color:green">✓</span>' : '<span style="color:red">✗ ' + (l.exception_reason || 'Mismatch') + '</span>'}</td>
      </tr>`) : [`<tr><td colspan="7" style="color:var(--muted)">No line items recorded — validated against period timesheets (${periodTs.length} found).</td></tr>`]
    ));

    // Stage tracking so HR Ops can see where it sits after their step
    const statusTrack = UI.card('Status Tracking', UI.table(['Stage', 'Owner', 'Status', 'By'],
      [
        ['Raised by Vendor', vendor?.contact_name, UI.badge('Submitted'), vendor?.vendor_name],
        ['SOW Validation', 'HR Ops', UI.badge(inv.sow_validation_status), VMP.getUser(inv.sow_validated_by)?.full_name || '—'],
        ['TA Approval', 'TA / Orchestrator', UI.badge(inv.ta_approval_status), VMP.getUser(inv.ta_approved_by)?.full_name || '—'],
        ['Finance Processing', 'Finance', UI.badge(inv.finance_processing_status), inv.invoice_batch_id ? VMP.getInvoiceBatch(inv.invoice_batch_id)?.batch_ref : '—']
      ].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`)
    ));

    // Role-specific action bar
    let actions = '';
    if (role === 'hr' && inv.sow_validation_status === 'Pending') {
      actions = '<div class="form-actions"><button class="btn btn-success" data-action="validate-sow" data-id="' + inv.id + '">Validate Against SOW</button><button class="btn btn-danger" data-action="dispute-invoice" data-id="' + inv.id + '">Dispute (SOW Mismatch)</button></div>';
    } else if ((role === 'taq') && inv.sow_validation_status === 'Validated' && inv.ta_approval_status === 'Pending') {
      actions = '<div class="form-actions"><button class="btn btn-success" data-action="ta-approve-invoice" data-id="' + inv.id + '">Approve Invoice (TA)</button><button class="btn btn-danger" data-action="reject" data-type="Invoice" data-id="' + inv.id + '">Reject</button></div>';
    } else if (role === 'finance' && inv.ta_approval_status === 'Approved' && inv.finance_processing_status !== 'Paid') {
      actions = '<div class="form-actions"><button class="btn btn-primary" data-action="process-invoice" data-id="' + inv.id + '">Process for Payment</button><a href="#invoices/batches" class="btn btn-secondary">Add to Payment Batch</a></div>';
    } else if (role === 'vendor') {
      actions = UI.alert('info', 'Read-only — you can track your invoice status here.');
    }

    const headerCard = UI.card(`Invoice ${inv.invoice_number} — ${vendor?.vendor_name}`, UI.detailRows([
      { label: 'Stage', value: UI.badge(inv.invoice_stage) },
      { label: 'Amount', value: VMP.formatCurrency(inv.invoice_amount, inv.currency) + ' + ' + VMP.formatCurrency(inv.tax_amount, inv.currency) + ' GST' },
      { label: 'Due Date', value: VMP.formatDate(inv.due_date) },
      { label: 'Project', value: VMP.getProject(inv.project_id)?.project_name || '—' }
    ]) + (inv.invoice_stage === 'Disputed' ? UI.alert('danger', 'Disputed: ' + (inv.dispute_reason || 'SOW mismatch — returned to vendor.')) : ''));

    const body = headerCard + sowCompare + lineTable + statusTrack + actions;
    return UI.processFlow(SH.invoiceStageSteps, SH.invoiceStageIndex(inv), { panels: SH.invoiceStageSteps.map((s, i) => i === SH.invoiceStageIndex(inv) ? body : UI.card(s, UI.alert('info', 'Stage: ' + s) + statusTrack)) });
  },

  renderInvoiceBatches() {
    const batches = VMP_DATA.invoiceBatches || [];
    const stats = UI.statsGrid([
      { value: batches.filter(b => b.status === 'Pending').length, label: 'Pending', class: 'warning' },
      { value: batches.filter(b => b.status === 'Processing').length, label: 'Processing', class: 'warning' },
      { value: batches.filter(b => b.status === 'Disbursed').length, label: 'Disbursed', class: 'success' },
      { value: VMP.formatCurrency(batches.reduce((s, b) => s + b.total_amount, 0)), label: 'Total Batched' }
    ]);
    const table = UI.card('Invoice Payment Batches', UI.table(['Batch Ref', 'Invoices', 'Total Amount', 'Status', 'Bank Transfer Ref', 'Payment Date'],
      batches.map(b => `<tr>
        <td><strong>${b.batch_ref}</strong></td>
        <td>${b.invoice_ids.map(iid => VMP.getInvoice(iid)?.invoice_number).join(', ')}</td>
        <td>${VMP.formatCurrency(b.total_amount, b.currency)} <span style="font-size:.7rem;color:var(--muted)">${b.currency}</span></td>
        <td>${UI.badge(b.status)}</td>
        <td>${b.bank_transfer_ref || '—'}</td>
        <td>${VMP.formatDate(b.payment_date)}</td>
      </tr>`),
      'No payment batches yet.'
    ));
    return SH.workflowBanner('Payment Batches', ['Pending', 'Processing', 'Disbursed'], 'Processing',
      'Approved invoices are grouped into payment batches for disbursement. Each batch tracks its bank transfer reference and payment date.',
      [UI.card('Pending', stats + table), UI.card('Processing', table), UI.card('Disbursed', table)]);
  },

  renderInvoiceSowValidation() {
    const queue = VMP_DATA.invoices.filter(i => i.sow_validation_status === 'Pending');
    const validated = VMP_DATA.invoices.filter(i => i.sow_validation_status === 'Validated');
    const disputed = VMP_DATA.invoices.filter(i => i.sow_validation_status === 'Disputed');

    const stats = UI.statsGrid([
      { value: queue.length, label: 'Awaiting SOW Validation', class: 'warning' },
      { value: validated.length, label: 'Validated (moved forward)', class: 'success' },
      { value: disputed.length, label: 'Disputed', class: 'danger' },
      { value: VMP.formatCurrency(queue.reduce((s, i) => s + i.invoice_amount, 0)), label: 'Value Pending Validation' }
    ]);

    const queueTable = UI.card('Invoices Awaiting SOW Validation', UI.table(['Invoice #', 'Vendor', 'Project / SOW', 'Period', 'Amount', 'SOW Rate', 'Actions'],
      queue.map(i => `<tr data-nav="invoices/detail?id=${i.id}">
        <td><strong>${i.invoice_number}</strong></td>
        <td>${VMP.getVendor(i.vendor_id)?.vendor_name}</td>
        <td>${VMP.getProject(i.project_id)?.project_code || '—'} · ${i.sow_document || '—'}</td>
        <td>${VMP.formatDate(i.billing_period_start)} – ${VMP.formatDate(i.billing_period_end)}</td>
        <td>${VMP.formatCurrency(i.invoice_amount, i.currency)}</td>
        <td>${VMP.formatCurrency(i.sow_rate, i.currency)}/mo</td>
        <td><a href="#invoices/detail?id=${i.id}" class="btn btn-sm btn-secondary">Open (SOW side-by-side)</a> <button class="btn btn-sm btn-success" data-action="validate-sow" data-id="${i.id}">Validate</button></td>
      </tr>`),
      'No invoices awaiting SOW validation.'
    ));

    const trackTable = UI.card('After Your Step — Downstream Status', UI.table(['Invoice #', 'Your Validation', 'TA Approval', 'Finance Processing', 'Payment Batch'],
      validated.concat(disputed).map(i => `<tr data-nav="invoices/detail?id=${i.id}"><td>${i.invoice_number}</td><td>${UI.badge(i.sow_validation_status)}</td><td>${UI.badge(i.ta_approval_status)}</td><td>${UI.badge(i.finance_processing_status)}</td><td>${i.invoice_batch_id ? VMP.getInvoiceBatch(i.invoice_batch_id)?.batch_ref : '—'}</td></tr>`),
      'Nothing validated yet.'
    ));

    return SH.workflowBanner('HR Ops — Invoice SOW Validation', SH.invoiceStageSteps, 'HR Ops SOW Validation',
      'The same queue pattern as "Candidates Awaiting HR Action". Open an invoice to see it side-by-side with the SOW terms, then validate or dispute. After you pass it along, track where it sits below.',
      [UI.card('Awaiting Validation', stats + queueTable), UI.card('SOW Comparison', UI.alert('info', 'Open any invoice to compare it against the SOW (rate, headcount, billing period) pulled directly into the tool.') + queueTable), UI.card('Downstream Status', trackTable)]) + trackTable;
  },

  renderInvoiceTaApproval() {
    const queue = VMP_DATA.invoices.filter(i =>
      (i.invoice_stage === 'TA Approval' || (i.sow_validation_status === 'Validated' && i.ta_approval_status === 'Pending')) &&
      i.ta_approval_status !== 'Approved' && i.invoice_stage !== 'Disputed' && i.sow_validation_status !== 'Disputed'
    );
    const awaitingHr = VMP_DATA.invoices.filter(i => i.sow_validation_status === 'Pending' || i.invoice_stage === 'SOW Validation');
    const done = VMP_DATA.invoices.filter(i => i.ta_approval_status === 'Approved');
    const stats = UI.statsGrid([
      { value: queue.length, label: 'Awaiting Your Approval', class: 'warning' },
      { value: awaitingHr.length, label: 'Still with HR Ops (SOW)', class: '' },
      { value: done.length, label: 'TA Approved', class: 'success' },
      { value: VMP.formatCurrency(queue.reduce((s, i) => s + i.invoice_amount, 0), 'INR'), label: 'Value Pending Approval' }
    ]);
    const queueTable = UI.table(
      ['Invoice #', 'Vendor', 'Project', 'Billing Period', 'Amount', 'SOW', 'Validated By', 'Actions'],
      queue.map(i => `<tr>
        <td><strong><a href="#invoices/detail?id=${i.id}">${i.invoice_number}</a></strong></td>
        <td>${VMP.getVendor(i.vendor_id)?.vendor_name || '—'}</td>
        <td>${VMP.getProject(i.project_id)?.project_code || '—'}</td>
        <td>${VMP.formatDate(i.billing_period_start)} – ${VMP.formatDate(i.billing_period_end)}</td>
        <td>${VMP.formatCurrency(i.invoice_amount, i.currency)}</td>
        <td style="font-size:.8rem">${i.sow_document || '—'}</td>
        <td>${VMP.getUser(i.sow_validated_by)?.full_name || 'HR Ops'}</td>
        <td>
          <a href="#invoices/detail?id=${i.id}" class="btn btn-sm btn-secondary">Review</a>
          <button class="btn btn-sm btn-success" data-action="ta-approve-invoice" data-id="${i.id}">Approve</button>
          <button class="btn btn-sm btn-danger" data-action="reject" data-type="Invoice" data-id="${i.id}">Reject</button>
        </td>
      </tr>`),
      'No SOW-validated invoices awaiting TA approval. After HR Ops validates an invoice against the SOW, it appears here.'
    );
    const waitingHrTable = UI.table(
      ['Invoice #', 'Vendor', 'Amount', 'Stage'],
      awaitingHr.map(i => `<tr data-nav="invoices/detail?id=${i.id}"><td>${i.invoice_number}</td><td>${VMP.getVendor(i.vendor_id)?.vendor_name}</td><td>${VMP.formatCurrency(i.invoice_amount, i.currency)}</td><td>${UI.badge(i.invoice_stage || 'SOW Validation')}</td></tr>`),
      'None waiting on HR Ops.'
    );
    const doneTable = UI.table(
      ['Invoice #', 'Vendor', 'Amount', 'TA Status', 'Next'],
      done.map(i => `<tr data-nav="invoices/detail?id=${i.id}"><td>${i.invoice_number}</td><td>${VMP.getVendor(i.vendor_id)?.vendor_name}</td><td>${VMP.formatCurrency(i.invoice_amount, i.currency)}</td><td>${UI.badge('Approved')}</td><td>${UI.badge(i.finance_processing_status || i.invoice_stage)}</td></tr>`),
      'None approved yet.'
    );
    return SH.workflowBanner('TA Invoice Approval', SH.invoiceStageSteps, 'TA Approval',
      'Flow: Vendor raises → HR Ops validates vs SOW → you approve → Finance processes. Only HR-validated invoices reach this queue.',
      [
        UI.card('Awaiting Your Approval', UI.alert('info', 'These invoices passed HR Ops SOW validation and need your approval before Finance can process payment.') + stats + queueTable),
        UI.card('Still with HR Ops', UI.alert('info', 'Not in your queue yet — waiting for SOW validation. When HR Ops validates them, they move here automatically.') + waitingHrTable),
        UI.card('Already Approved by TA', doneTable)
      ]);
  },

  renderRaiseInvoice() {
    const vid = VMP.getCurrentVendorId() || 'v1';
    const projects = VMP_DATA.projects.filter(p => p.status === 'Active');
    return UI.card('Raise Invoice', UI.formGrid([
      { label: 'Vendor', value: VMP.getVendor(vid)?.vendor_name, disabled: true },
      { label: 'Invoice Number', value: 'INV-2025-051' },
      { label: 'Project / SOW', type: 'select', options: projects.map(p => ({ label: p.project_code + ' — ' + p.project_name })) },
      { label: 'Billing Period Start', type: 'date', value: '2025-06-01' },
      { label: 'Billing Period End', type: 'date', value: '2025-06-30' },
      { label: 'Headcount', value: '2' },
      { label: 'Amount (INR)', value: '185000' },
      { label: 'GST Amount (INR)', value: '33300' },
      { label: 'Due Date', type: 'date', value: '2025-07-15' },
      { label: 'Supporting Timesheet', type: 'file', value: 'timesheets_jun.pdf' },
      { label: 'Invoice PDF', type: 'file', value: 'invoice_051.pdf' }
    ]) + UI.alert('info', 'Submit an invoice against a completed billing period. It goes to HR Ops for SOW validation first, then TA approval, then Finance processing.') +
    '<div class="form-actions"><button class="btn btn-secondary">Save Draft</button><button class="btn btn-primary">Submit Invoice</button></div>');
  },

  // ---- Finance: read-only final timesheet check (ownership moved to HR Ops) ----
  renderFinanceTimesheetReview() {
    const ready = VMP_DATA.timesheets.filter(t => t.hr_approval_status === 'HR Approved' || t.reconciliation_status === 'Confirmed' || t.reconciliation_status === 'In Finance Batch' || t.reconciliation_status === 'Paid');
    const table = UI.table(['Contractor', 'Period', 'Approved Hours', 'Supervisor', 'HR Ops', 'Status'],
      ready.map(t => `<tr><td>${VMP.getContractor(t.contractor_id)?.full_name}</td><td>${VMP.formatDate(t.work_period_start)} – ${VMP.formatDate(t.work_period_end)}</td><td>${t.approved_hours || t.submitted_hours}h</td><td>${UI.badge('Supervisor Approved')}</td><td>${UI.badge('HR Approved')}</td><td>${UI.badge(t.reconciliation_status)}</td></tr>`),
      'No HR-approved timesheets awaiting final finance check.'
    );
    return SH.workflowBanner('Timesheet Review (Final Check)', ['Contractor Submits', 'Supervisor Approves', 'HR Ops Approves', 'Finance Reviews', 'Finance Batch'], 'Finance Reviews',
      'Ownership moved to HR Ops. Finance only performs a read-only final check that the already-approved timesheet is clean before it feeds into invoicing/payment.',
      [
        UI.card('Finance Final Check (read-only)', UI.alert('info', 'These timesheets are already approved by the supervisor and HR Ops. Finance confirms the batch is clean before payment — no uploading, parsing, or chasing confirmations.') + table),
        UI.card('Ready for Batch', UI.alert('success', 'Clean timesheets flow into finance payment batches.') + '<a href="#finance/batches" class="btn btn-sm btn-primary">Open Payment Batches</a>')
      ]);
  }
};
