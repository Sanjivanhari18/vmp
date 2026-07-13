/** Mock form submissions & button actions — temp in-memory record updates */
const MockActions = {
  readForm(fromEl) {
    const root = fromEl.closest('.card')?.querySelector('.form-grid')
      || fromEl.closest('.screen-wrap')?.querySelector('.form-grid');
    const data = {};
    root?.querySelectorAll('.form-group').forEach(g => {
      const label = g.querySelector('label')?.textContent.trim();
      const input = g.querySelector('input, select, textarea');
      if (label && input) data[label] = input.value;
    });
    return data;
  },

  refresh() {
    Router.renderSidebar();
    Router.navigate();
  },

  forwardCandidate(id, managerId) {
    const c = VMP_DATA.candidates.find(x => x.id === id);
    if (!c || c.stage !== 'Submitted') return;
    c.stage = 'Forwarded to Manager';
    c.forwarded_to_manager_id = managerId;
    VMP.addAuditLog('Candidate', id, 'Forwarded to Manager', 'Submitted', VMP.getUser(managerId)?.full_name);
    VMP.showToast(c.name + ' forwarded to manager for profile review');
    MockActions.refresh();
  },

  selectCandidate(id) {
    const c = VMP_DATA.candidates.find(x => x.id === id);
    if (!c || c.stage !== 'Forwarded to Manager') return;
    c.stage = 'Manager Selected';
    c.manager_selected = true;
    if (!VMP_DATA.interviewSchedules) VMP_DATA.interviewSchedules = [];
    if (!VMP_DATA.interviewSchedules.find(i => i.candidate_id === id)) {
      VMP_DATA.interviewSchedules.push({
        id: VMP.nextId('int', VMP_DATA.interviewSchedules),
        candidate_id: id, scheduled_by: null, interview_date: null, interview_time: null,
        mode: null, interviewer: VMP.getUser(c.forwarded_to_manager_id)?.full_name, status: 'Pending Schedule'
      });
    }
    VMP.addAuditLog('Candidate', id, 'Manager Selected', 'Forwarded to Manager', 'Awaiting HR interview');
    VMP.showToast(c.name + ' selected — HR Ops will schedule interview');
    MockActions.refresh();
  },

  rejectCandidate(id) {
    const c = VMP_DATA.candidates.find(x => x.id === id);
    if (!c) return;
    const prev = c.stage;
    c.stage = 'Rejected';
    c.manager_selected = false;
    VMP.addAuditLog('Candidate', id, 'Not Needed', prev, 'Rejected by manager');
    VMP.showToast(c.name + ' marked as not needed');
    MockActions.refresh();
  },

  scheduleInterview(candidateId, formData) {
    const c = VMP_DATA.candidates.find(x => x.id === candidateId);
    if (!c || c.stage !== 'Manager Selected') return;
    let int = VMP_DATA.interviewSchedules?.find(i => i.candidate_id === candidateId);
    if (!int) {
      int = { id: VMP.nextId('int', VMP_DATA.interviewSchedules), candidate_id: candidateId };
      VMP_DATA.interviewSchedules.push(int);
    }
    int.scheduled_by = VMP.currentUser?.id || 'u2';
    int.interview_date = formData['Interview Date'] || '2025-06-28';
    int.interview_time = formData['Interview Time'] || '10:00 AM';
    int.mode = formData['Mode'] || 'Video';
    int.interviewer = VMP.getUser(c.forwarded_to_manager_id)?.full_name;
    int.status = 'Scheduled';
    c.stage = 'Interview Scheduled';
    c.interview_date = int.interview_date;
    VMP.addAuditLog('Interview', int.id, 'Scheduled', 'Pending Schedule', int.interview_date);
    VMP.showToast('Interview scheduled for ' + c.name);
    MockActions.refresh();
  },

  sendOffer(candidateId) {
    const c = VMP_DATA.candidates.find(x => x.id === candidateId);
    if (!c) return;
    c.stage = 'Offer Sent';
    VMP.addAuditLog('Candidate', candidateId, 'Offer Sent', c.stage, 'HR');
    VMP.showToast('Offer sent to ' + c.name);
    MockActions.refresh();
  },

  resolveConcern(id, outcome) {
    const pc = (VMP_DATA.performanceConcerns || []).find(p => p.id === id);
    if (!pc) return;
    if (outcome === 'sustained') {
      pc.status = 'Sustained';
      pc.findings = pc.findings || 'HR verified no work product for the disputed period.';
      pc.outcome = 'Non-Work Sustained — Vendor Notified, Hours Blocked';
      pc.vendor_notified = true;
      VMP.addAuditLog('Performance Concern', id, 'Sustained', 'Under Investigation', 'Vendor notified; ' + pc.disputed_hours + 'h blocked');
      VMP.showToast('Non-work sustained — vendor notified, ' + pc.disputed_hours + 'h blocked from payment');
    } else {
      pc.status = 'Cleared';
      pc.findings = pc.findings || 'Work verified — deliverables present, no non-work found.';
      pc.outcome = 'No Action — Cleared';
      pc.disputed_hours = 0;
      VMP.addAuditLog('Performance Concern', id, 'Cleared', 'Under Investigation', 'No action — work verified');
      VMP.showToast('Case cleared — no payment adjustment');
    }
    MockActions.refresh();
  },

  advanceInvoice(id) {
    const inv = VMP.getInvoice(id);
    if (!inv) return;
    if (inv.reconciliation_status === 'Blocked') { VMP.showToast('Resolve the reconciliation exception first'); return; }
    if (inv.pm_confirmation_status !== 'Confirmed') {
      inv.pm_confirmation_status = 'Confirmed'; inv.approval_stage = 'Budget Approval';
      VMP.addAuditLog('Invoice', id, 'Services Confirmed', 'Pending', 'Project Manager confirmed hours');
      VMP.showToast('Services & approved hours confirmed by Project Manager');
    } else if (inv.budget_approval_status !== 'Approved') {
      inv.budget_approval_status = 'Approved'; inv.approval_stage = 'Finance Approval';
      VMP.addAuditLog('Invoice', id, 'Budget Approved', 'Pending', 'Budget owner approved charge');
      VMP.showToast('Invoice charge approved by Budget Owner');
    } else if (inv.finance_approval_status !== 'Approved' || (inv.dual_approval_required && !(inv.approver1 && inv.approver2))) {
      inv.finance_approval_status = 'Approved';
      if (inv.dual_approval_required) {
        if (!inv.approver1) inv.approver1 = VMP.currentUser?.id || 'u3';
        else if (!inv.approver2) inv.approver2 = VMP.currentUser?.id || 'u6';
      }
      if (inv.dual_approval_required && !(inv.approver1 && inv.approver2)) {
        inv.approval_stage = 'Dual Approval';
        VMP.addAuditLog('Invoice', id, 'Finance Approval (1 of 2)', 'Pending', 'Second approver required');
        VMP.showToast('First finance approval recorded — second approver required (dual approval)');
      } else {
        inv.approval_stage = 'Approved & Eligible for Payment';
        inv.reconciliation_status = 'Approved'; inv.payment_status = 'Approved';
        inv.settlement_status = 'Scheduled'; inv.scheduled_date = inv.scheduled_date || new Date().toISOString().slice(0, 10);
        VMP.addAuditLog('Invoice', id, 'Approved for Payment', 'Pending', 'Eligible for Payment');
        VMP.showToast('Invoice approved and eligible for payment');
      }
    }
    MockActions.refresh();
  },

  advanceSettlement(id) {
    const inv = VMP.getInvoice(id);
    if (!inv) return;
    if (!inv.settlement_status || inv.settlement_status === 'Not Started') {
      inv.settlement_status = 'Scheduled'; inv.scheduled_date = new Date().toISOString().slice(0, 10);
      VMP.showToast('Invoice scheduled for payment');
    } else if (inv.settlement_status === 'Scheduled') {
      inv.payment_file_ref = 'PAY-2025-' + String(Math.floor(Math.random() * 900 + 100));
      inv.settlement_status = 'Released';
      VMP.addAuditLog('Invoice', id, 'Payment Released', 'Scheduled', inv.payment_file_ref);
      VMP.showToast('Payment file generated & released — ' + inv.payment_file_ref);
    } else if (inv.settlement_status === 'Released') {
      inv.settlement_status = 'Paid'; inv.payment_status = 'Paid'; inv.remittance_sent = true;
      const b = VMP.getBatch(inv.batch_id);
      if (b) b.finance_status = 'Paid';
      VMP.addAuditLog('Invoice', id, 'Paid', 'Released', 'Remittance advice sent');
      VMP.showToast('Invoice & batch marked paid — remittance advice sent to vendor');
    }
    MockActions.refresh();
  },

  addApproval(entity_type, entity_id, workflow, stage, approver_role) {
    const id = VMP.nextId('ap', VMP_DATA.approvals);
    VMP_DATA.approvals.unshift({
      id, entity_type, entity_id,
      workflow_name: workflow,
      current_stage: stage,
      requester: VMP.currentUser?.id || 'system',
      requested_date: new Date().toISOString().slice(0, 10),
      sla: '2 days', priority: 'Medium', status: 'Pending', approver_role
    });
    return id;
  },

  approve(id, type) {
    const ap = VMP_DATA.approvals.find(a => a.entity_id === id || a.id === id);
    if (ap && ap.status === 'Pending') {
      ap.status = 'Approved';
      VMP.addAuditLog(ap.entity_type, ap.entity_id, 'Approved', 'Pending', 'Approved');
    }
    const ts = VMP_DATA.timesheets.find(t => t.id === id);
    if (ts && (!type || type === 'Timesheet')) {
      if (ts.leave_mismatch || ts.holiday_mismatch) {
        VMP.showToast('Cannot approve — resolve leave/holiday flags first');
        return false;
      }
      ts.manager_approval_status = 'Approved';
      ts.reconciliation_status = 'Manager Approved';
      ts.approved_hours = ts.submitted_hours;
      VMP.addAuditLog('Timesheet', id, 'Approved', 'Pending', 'Manager Approved');
    }
    const inv = VMP_DATA.invoices.find(i => i.id === id);
    if (inv && type === 'Vendor Payment') {
      if (inv.reconciliation_status === 'Blocked') {
        VMP.showToast('Cannot approve — finance reconciliation blocked');
        return false;
      }
      inv.vendor_approval_status = 'Approved';
      inv.payment_status = 'Vendor Approved';
      VMP.addAuditLog('Invoice', id, 'Vendor Payment Approved', 'Pending', 'Vendor Approved');
      return true;
    }
    if (inv && (!type || type === 'Invoice')) {
      if (inv.reconciliation_status === 'Blocked') {
        VMP.showToast('Cannot approve — resolve reconciliation exceptions first');
        return false;
      }
      if (inv.dual_approval_required) {
        if (!inv.approver1) { inv.approver1 = VMP.currentUser?.id; inv.payment_status = 'Pending'; }
        else if (!inv.approver2) { inv.approver2 = VMP.currentUser?.id; inv.payment_status = 'Approved'; }
      } else {
        inv.payment_status = 'Approved';
        inv.reconciliation_status = 'Approved';
      }
      VMP.addAuditLog('Invoice', id, 'Approved', 'Pending', inv.payment_status);
    }
    const an = VMP_DATA.anomalies.find(a => a.id === id);
    if (an) { an.status = 'Resolved'; VMP.addAuditLog('Reporting Anomaly', id, 'Resolved', 'Detected', 'Resolved'); }
    const lr = VMP_DATA.leaveRecords.find(l => l.id === id);
    if (lr && (!type || type === 'Leave')) {
      lr.leave_status = 'Approved';
      lr.approved_by = VMP.currentUser?.id;
      VMP.addAuditLog('Leave', id, 'Approved', 'Pending', 'Approved');
    }
    const rc = VMP_DATA.rateCards.find(r => r.id === id);
    if (rc && (!type || type === 'Rate Card')) {
      rc.approval_status = 'Approved';
      rc.status = 'Active';
      rc.approved_by = VMP.currentUser?.id;
      VMP.addAuditLog('Rate Card', id, 'Approved', 'Pending Finance', 'Active');
    }
    const rate = VMP_DATA.rates.find(r => r.id === id);
    if (rate && (!type || type === 'Contractor Rate')) {
      rate.approval_status = 'Approved';
      rate.immutable = true;
      rate.approved_by = VMP.currentUser?.id;
      VMP.addAuditLog('Contractor Rate', id, 'Approved', 'Pending Finance', 'Approved');
    }
    const vendor = VMP_DATA.vendors.find(v => v.id === id);
    if (vendor && (!type || type === 'Vendor')) {
      vendor.approval_status = 'Approved';
      vendor.status = 'Active';
      vendor.compliance_status = 'Compliant';
      VMP.addAuditLog('Vendor', id, 'Activated', 'Pending', 'Active');
    }
    return true;
  },

  reject(id, type) {
    const ap = VMP_DATA.approvals.find(a => a.entity_id === id || a.id === id);
    if (ap) { ap.status = 'Rejected'; VMP.addAuditLog(ap.entity_type, ap.entity_id, 'Rejected', 'Pending', 'Rejected'); }
    const ts = VMP_DATA.timesheets.find(t => t.id === id);
    if (ts) { ts.manager_approval_status = 'Rejected'; ts.reconciliation_status = 'Rejected'; VMP.addAuditLog('Timesheet', id, 'Rejected', 'Pending', 'Rejected'); }
    const lr = VMP_DATA.leaveRecords.find(l => l.id === id);
    if (lr) { lr.leave_status = 'Rejected'; VMP.addAuditLog('Leave', id, 'Rejected', 'Pending', 'Rejected'); }
    const rc = VMP_DATA.rateCards.find(r => r.id === id);
    if (rc) { rc.approval_status = 'Rejected'; rc.status = 'Draft'; VMP.addAuditLog('Rate Card', id, 'Rejected', 'Pending Finance', 'Rejected'); }
    const rate = VMP_DATA.rates.find(r => r.id === id);
    if (rate) { rate.approval_status = 'Rejected'; VMP.addAuditLog('Contractor Rate', id, 'Rejected', 'Pending Finance', 'Rejected'); }
    const inv = VMP_DATA.invoices.find(i => i.id === id);
    if (inv && type === 'Vendor Payment') {
      inv.vendor_approval_status = 'Rejected';
      VMP.addAuditLog('Invoice', id, 'Vendor Payment Rejected', 'Pending', 'Rejected');
    }
    return true;
  },

  /** Per-screen button handlers: label -> fn(btn) */
  handlers: {
    'rates/create': {
      'Submit for Finance Approval'(btn) {
        const d = MockActions.readForm(btn);
        const contractorName = d['Contractor'] || 'New Contractor';
        const contractor = VMP_DATA.contractors.find(c => d['Contractor']?.includes(c.full_name)) || VMP.getContractor('c4');
        const id = VMP.nextId('r', VMP_DATA.rates);
        VMP_DATA.rates.unshift({
          id, contractor_id: contractor?.id || 'c4', vendor_id: contractor?.vendor_id || 'v1',
          assignment_id: null, currency: 'INR', hourly_rate: null, daily_rate: null,
          monthly_rate: parseInt(d['Monthly Rate (INR)'] || '68000', 10),
          rate_type: d['Rate Type'] || 'Monthly',
          effective_from: d['Effective From'] || '2025-07-01', effective_to: d['Effective To'] || null,
          approval_status: 'Pending Finance', approved_by: null, version: 1, immutable: false
        });
        MockActions.addApproval('Contractor Rate', id, 'Rate Approval', 'Finance Approval', 'Finance');
        VMP.addAuditLog('Contractor Rate', id, 'Submitted', null, 'Pending Finance');
        VMP.showToast('Rate submitted — added to register pending finance approval');
        Router.go('rates/register');
      },
      'Cancel'() { Router.go('rates/register'); }
    },

    'finance/rate-cards': {
      'Submit for Finance Approval'(btn) {
        const d = MockActions.readForm(btn);
        const vendor = VMP_DATA.vendors.find(v => (d['Vendor'] || '').includes(v.vendor_name)) || VMP.getVendor('v1');
        const id = VMP.nextId('rc', VMP_DATA.rateCards);
        const bill = parseInt(d['Bill Rate (INR/day)'] || '12000', 10);
        const pay = parseInt(d['Pay Rate (INR/day)'] || '10200', 10);
        VMP_DATA.rateCards.unshift({
          id, vendor_id: vendor.id, role: d['Role Title'] || 'New Role',
          skills: d['Skills / Level'] || '', region: d['Region'] || 'India - Bangalore',
          bill_rate: bill, pay_rate: pay,
          overtime_rate: parseInt(d['Overtime Rate (INR/hr)'] || '1400', 10),
          effective_from: d['Effective From'] || '2025-07-01', effective_to: null,
          status: 'Draft', approval_status: 'Pending Finance', version: 1,
          margin_pct: Math.round((1 - pay / bill) * 100), contractors_using: 0,
          requested_by: VMP.currentUser?.id, submitted_date: new Date().toISOString().slice(0, 10)
        });
        MockActions.addApproval('Rate Card', id, 'Rate Card Approval', 'Finance Approval', 'Finance');
        VMP.addAuditLog('Rate Card', id, 'Submitted', 'Draft', 'Pending Finance');
        VMP.showToast('Rate card submitted — visible in Pending Approval tab');
        MockActions.refresh();
      },
      'Save Draft'(btn) {
        VMP.showToast('Rate card saved as draft');
        MockActions.refresh();
      }
    },

    'contractors/create': {
      'Create & Start Onboarding'(btn) {
        const d = MockActions.readForm(btn);
        const n = VMP_DATA.contractors.length + 1;
        const id = VMP.nextId('c', VMP_DATA.contractors);
        const vendor = VMP_DATA.vendors.find(v => (d['Vendor'] || '').includes(v.vendor_name)) || VMP.getVendor('v1');
        VMP_DATA.contractors.unshift({
          id, contractor_code: 'CON-' + String(n + 8).padStart(3, '0'),
          vendor_id: vendor.id, full_name: d['Full Name'] || 'New Contractor',
          email: d['Email'] || 'new@email.com', phone: d['Phone'] || '',
          skill_set: d['Skill Set'] || '', experience_years: parseInt(d['Experience (years)'] || '3', 10),
          location: d['Location'] || 'Mumbai', joining_date: d['Joining Date'] || '2025-07-01',
          exit_date: null, status: 'Onboarding', bgv_status: 'Not Started',
          bank_account: null, ifsc: null, onboarding_stage: 'Applied',
          project_name: d['Project Name'] || null,
          pay_rate: parseInt(d['Contractor Pay Rate (INR/mo)'] || '0', 10) || null,
          contract_end_date: d['Assignment End Date'] || null,
          fte_conversion_eligible: d['FTE Conversion Eligibility'] || 'To be reviewed at tenure end'
        });
        VMP_DATA.bgvRecords.unshift({
          id: VMP.nextId('bgv', VMP_DATA.bgvRecords), contractor_id: id, vendor_id: vendor.id,
          bgv_vendor: null, initiated_date: null, completed_date: null, bgv_status: 'Not Started', verified_by: null
        });
        MockActions.addApproval('Contractor', id, 'Contractor Activation', 'BGV Clearance', 'HR Ops');
        VMP.addAuditLog('Contractor', id, 'Created', null, 'Onboarding — Applied');
        VMP.showToast('Contractor created — added to onboarding pipeline');
        Router.go('contractors/list');
      },
      'Cancel'() { Router.go('contractors/list'); }
    },

    'vendors/register': {
      'Submit for Approval'(btn) {
        const d = MockActions.readForm(btn);
        const id = VMP.nextId('v', VMP_DATA.vendors);
        const code = 'VND-' + String(VMP_DATA.vendors.length + 1).padStart(3, '0');
        VMP_DATA.vendors.unshift({
          id, vendor_code: code, vendor_name: d['Vendor Name'] || 'New Vendor',
          registered_name: d['Registered Name'] || d['Vendor Name'],
          gst_number: d['GST Number'] || '', pan_number: d['PAN Number'] || '',
          address: d['Address'] || '', contact_name: d['Contact Name'] || '',
          contact_email: d['Contact Email'] || '', contact_phone: '',
          compliance_status: 'Pending Review', approval_status: 'Pending Finance Approval', status: 'Draft'
        });
        MockActions.addApproval('Vendor', id, 'Vendor Onboarding', 'Finance Approval', 'Finance');
        VMP.addAuditLog('Vendor', id, 'Submitted', 'Draft', 'Pending Finance Approval');
        VMP.showToast('Vendor submitted for approval — added to vendor list');
        Router.go('vendors/list');
      },
      'Save Draft'(btn) {
        VMP.showToast('Vendor registration saved as draft');
      }
    },

    'positions/create': {
      'Submit for Approval'(btn) {
        const d = MockActions.readForm(btn);
        const id = VMP.nextId('op', VMP_DATA.openPositions);
        const project = VMP_DATA.projects.find(p => (d['Project'] || '').includes(p.project_name)) || VMP.getProject('p1');
        VMP_DATA.openPositions.unshift({
          id, project_id: project.id, position_title: d['Position Title'] || 'New Position',
          skill_set: d['Skill Set'] || '', required_experience: d['Experience Required'] || '',
          no_of_positions: parseInt(d['No. of Positions'] || '1', 10),
          budget_rate: parseInt(d['Budget Rate (daily)'] || '8500', 10),
          location: d['Location'] || 'Remote', start_date: d['Start Date'] || '2025-07-01',
          end_date: d['End Date'] || '2026-06-30', status: 'Open',
          requested_by: VMP.currentUser?.id || 'u4', approved_by: null, vendor_ids: ['v1']
        });
        VMP.addAuditLog('Open Position', id, 'Created', null, d['Position Title']);
        VMP.showToast('Open position created — added to positions list');
        Router.go('positions/list');
      },
      'Cancel'() { Router.go('positions/list'); }
    },

    'manager/mrf': {
      'Submit to TAQ'(btn) {
        const d = MockActions.readForm(btn);
        const id = VMP.nextId('mrf', VMP_DATA.mrfs);
        VMP_DATA.mrfs.unshift({
          id, requested_by: VMP.currentUser?.id || 'u4',
          role_title: d['Role Title'] || 'New Role', skills: d['Skills Required'] || '',
          headcount: parseInt(d['Headcount'] || '1', 10),
          contract_duration: d['Contract Duration'] || '12 months',
          urgency: d['Urgency'] || 'Medium', status: 'Raised',
          open_position_id: null, created_date: new Date().toISOString().slice(0, 10)
        });
        VMP.addAuditLog('MRF', id, 'Submitted', null, d['Role Title']);
        VMP.showToast('MRF submitted to TAQ — added to your MRF status table');
        MockActions.refresh();
      }
    },

    'contractor/timesheet': {
      'Submit for Approval'(btn) {
        const d = MockActions.readForm(btn);
        const hours = ['Mon (Jun 2)', 'Tue (Jun 3)', 'Wed (Jun 4)', 'Thu (Jun 5)', 'Fri (Jun 6)']
          .reduce((s, k) => s + parseFloat(d[k] || 0), 0);
        const thuHours = parseFloat(d['Thu (Jun 5)'] || 0);
        const id = VMP.nextId('ts', VMP_DATA.timesheets);
        VMP_DATA.timesheets.unshift({
          id, contractor_id: 'c1', assignment_id: 'a1',
          work_period_start: '2025-06-09', work_period_end: '2025-06-13',
          submitted_hours: hours, approved_hours: 0, rejected_hours: 0,
          reconciliation_status: 'Submitted', manager_approval_status: 'Pending',
          leave_mismatch: false, holiday_mismatch: thuHours > 0, batch_id: null
        });
        MockActions.addApproval('Timesheet', id, 'Timesheet Approval', 'Manager Approval', "Contractor's Manager");
        VMP.addAuditLog('Timesheet', id, 'Submitted', null, hours + 'h');
        VMP.showToast('Timesheet submitted — pending manager approval');
        MockActions.refresh();
      }
    },

    'contractor/leave': {
      'Submit Request'(btn) {
        const d = MockActions.readForm(btn);
        const id = VMP.nextId('lr', VMP_DATA.leaveRecords);
        VMP_DATA.leaveRecords.unshift({
          id, contractor_id: 'c1',
          leave_date: d['Start Date'] || '2025-07-01',
          leave_type: d['Leave Type'] || 'Personal',
          leave_status: 'Pending', approved_by: null
        });
        VMP.addAuditLog('Leave', id, 'Requested', null, d['Leave Type']);
        VMP.showToast('Leave request submitted — pending manager approval');
        MockActions.refresh();
      }
    },

    'finance/invoice-upload': {
      'Upload & Start Reconciliation'(btn) {
        const d = MockActions.readForm(btn);
        const vendor = VMP_DATA.vendors.find(v => (d['Vendor'] || '').includes(v.vendor_name)) || VMP.getVendor('v1');
        const amount = parseInt(d['Amount (INR)'] || '185000', 10);
        const id = VMP.nextId('inv', VMP_DATA.invoices);
        const num = d['Invoice Number'] || ('INV-2025-' + String(VMP_DATA.invoices.length + 51).padStart(3, '0'));
        VMP_DATA.invoices.unshift({
          id, vendor_id: vendor.id, invoice_number: num,
          invoice_date: d['Invoice Date'] || '2025-06-20',
          billing_period_start: d['Billing Period Start'] || '2025-06-01',
          billing_period_end: d['Billing Period End'] || '2025-06-15',
          invoice_amount: amount, tax_amount: parseInt(d['Tax Amount'] || String(Math.round(amount * 0.18)), 10),
          currency: 'INR', reconciliation_status: 'Reconciling', exception_reason: null,
          payment_status: 'Pending', dual_approval_required: amount > 800000,
          approver1: null, approver2: null, vendor_approval_status: 'Pending'
        });
        MockActions.addApproval('Invoice', id, 'Invoice Approval', 'Finance Approval', 'Finance');
        VMP.addAuditLog('Invoice', id, 'Uploaded', null, num);
        VMP.showToast('Invoice uploaded — added to invoice list for reconciliation');
        Router.go('finance/invoices');
      }
    },

    'assignments/transfer': {
      'Submit for Approval'(btn) {
        const d = MockActions.readForm(btn);
        MockActions.addApproval('Assignment Transfer', 'a6', 'Assignment Transfer', 'HR Approval', 'HR Ops');
        VMP.addAuditLog('Assignment Transfer', 'a6', 'Submitted', null, d['New Project'] || 'Transfer');
        VMP.showToast('Transfer submitted for approval');
        MockActions.refresh();
      },
      'Cancel'() { Router.go('assignments/list'); }
    },

    'manager/performance': {
      'Submit Rating & Comments'(btn) {
        const d = MockActions.readForm(btn);
        const contractor = VMP_DATA.contractors.find(c => (d['Contractor'] || '').includes(c.full_name)) || VMP.getContractor('c1');
        const id = VMP.nextId('pr', VMP_DATA.performanceRatings);
        const g = k => parseInt(d[k] || '4', 10);
        const avg = (g('Quality (1-5)') + g('Communication (1-5)') + g('Delivery (1-5)') + g('Professionalism (1-5)') + g('Reliability (1-5)')) / 5;
        VMP_DATA.performanceRatings.unshift({
          id, contractor_id: contractor.id, manager_id: VMP.currentUser?.id || 'u4',
          period: d['Rating Period'] || VMP_DATA.ratingCycle.quarter,
          quality: g('Quality (1-5)'), communication: g('Communication (1-5)'),
          delivery: g('Delivery (1-5)'), professionalism: g('Professionalism (1-5)'),
          reliability: g('Reliability (1-5)'),
          comments: d['Comments'] || '', low_performer: avg < 3, review_status: 'HR Reviewed'
        });
        VMP.addAuditLog('Performance Rating', id, 'Submitted', null, contractor.full_name + ' — ' + (d['Rating Period'] || VMP_DATA.ratingCycle.quarter));
        VMP.showToast('Rating submitted — HR review then stored on credibility record');
        MockActions.refresh();
      }
    },

    'manager/performance-flag': {
      'Flag Contractor for Performance Concern'(btn) {
        const d = MockActions.readForm(btn);
        const team = VMP.getManagerTeam('u4');
        const contractor = (team.length ? team : VMP_DATA.contractors).find(c => (d['Contractor'] || '').includes(c.full_name)) || team[0] || VMP.getContractor('c1');
        const id = VMP.nextId('pc', VMP_DATA.performanceConcerns);
        VMP_DATA.performanceConcerns.unshift({
          id, contractor_id: contractor.id, manager_id: VMP.currentUser?.id || 'u4',
          flagged_date: new Date().toISOString().slice(0, 10),
          reason: d['Concern Reason'] || 'Suspected non-delivery',
          period: d['Affected Period'] || '—',
          evidence: d['Evidence / Examples'] || '',
          status: 'Under Investigation', hr_owner: 'u2', findings: null, outcome: null,
          disputed_hours: parseInt(d['Disputed Hours'] || '0', 10), vendor_notified: false
        });
        MockActions.addApproval('Performance Concern', id, 'Performance Concern & Work Verification', 'HR Investigation', 'HR Ops');
        VMP.addAuditLog('Performance Concern', id, 'Flagged', null, contractor.full_name);
        VMP.showToast('Contractor flagged — HR Operations notified for work verification');
        Router.go('manager/performance-flag');
      }
    },

    'import/upload': {
      'Upload & Validate'(btn) {
        const d = MockActions.readForm(btn);
        const id = VMP.nextId('ib', VMP_DATA.importBatches);
        VMP_DATA.importBatches.unshift({
          id, source_file_name: d['Source File'] || 'import_' + Date.now() + '.xlsx',
          import_type: d['Import Type'] || 'Contractors', total_rows: 10, success_rows: 10,
          failed_rows: 0, uploaded_by: VMP.currentUser?.id || 'u2',
          uploaded_at: new Date().toISOString().slice(0, 10), status: 'Completed', errors: []
        });
        VMP.addAuditLog('Import Batch', id, 'Uploaded', null, '10/10 success');
        VMP.showToast('Import completed — 10 rows added successfully');
        MockActions.refresh();
      }
    },

    'timesheets/upload': {
      'Upload & Validate'() {
        VMP.showToast('Timesheets validated — 22 success, 2 failed (see results table)');
      }
    },

    'finance/batches': {
      'Generate Batch'() {
        const id = VMP.nextId('fb', VMP_DATA.financeBatches);
        const ready = VMP_DATA.timesheets.filter(t => t.manager_approval_status === 'Approved' && t.reconciliation_status === 'Manager Approved' && !t.batch_id);
        const lines = ready.slice(0, 3).map(t => {
          const rate = VMP.getActiveRate(t.contractor_id);
          return {
            contractor_id: t.contractor_id, timesheet_id: t.id, approved_hours: t.approved_hours,
            rate_id: rate?.id || 'r2', amount: rate?.monthly_rate ? Math.round(rate.monthly_rate / 4) : 20000,
            exception_reason: null, blocked: false
          };
        });
        if (!lines.length) {
          VMP.showToast('No manager-approved timesheets available for batch generation');
          return;
        }
        lines.forEach(l => { const ts = VMP.getTimesheet(l.timesheet_id); if (ts) { ts.batch_id = id; ts.reconciliation_status = 'In Finance Batch'; } });
        VMP_DATA.financeBatches.unshift({
          id, vendor_id: 'v1', billing_period: 'Jun 9 – Jun 13, 2025',
          total_hours: lines.reduce((s, l) => s + l.approved_hours, 0),
          total_amount: lines.reduce((s, l) => s + l.amount, 0),
          currency: 'INR', generated_by: VMP.currentUser?.id || 'u3',
          finance_status: 'Ready for Review', approved_by: null, exported_at: null,
          payment_reference: null, line_items: lines
        });
        VMP.addAuditLog('Finance Batch', id, 'Generated', null, lines.length + ' lines');
        VMP.showToast('Payment batch generated — ' + lines.length + ' line items');
        Router.go('finance/batch-detail?id=' + id);
      }
    },

    'finance/batch-detail': {
      'Approve Batch'(btn) {
        const id = Router.getQueryParam('id');
        const b = VMP.getBatch(id);
        if (!b) return;
        if (b.line_items.some(l => l.blocked)) {
          VMP.showToast('Remove or resolve blocked lines before approving batch');
          return;
        }
        b.finance_status = 'Approved';
        b.approved_by = VMP.currentUser?.id;
        VMP.addAuditLog('Finance Batch', id, 'Approved', 'Exceptions Flagged', 'Approved');
        VMP.showToast('Batch approved — ready for export');
        MockActions.refresh();
      },
      'Remove Blocked Lines'(btn) {
        const id = Router.getQueryParam('id');
        const b = VMP.getBatch(id);
        if (!b) return;
        const removed = b.line_items.filter(l => l.blocked).length;
        b.line_items = b.line_items.filter(l => !l.blocked);
        b.total_amount = b.line_items.reduce((s, l) => s + l.amount, 0);
        b.total_hours = b.line_items.reduce((s, l) => s + l.approved_hours, 0);
        if (!b.line_items.some(l => l.blocked)) b.finance_status = 'Ready for Review';
        VMP.addAuditLog('Finance Batch', id, 'Blocked Lines Removed', removed + ' lines', b.line_items.length + ' remaining');
        VMP.showToast('Removed ' + removed + ' blocked line(s) from batch');
        MockActions.refresh();
      },
      'Export Payment File'() {
        VMP.showToast('Payment file exported — PAY-2025-' + String(Math.floor(Math.random() * 900 + 100)));
      }
    },

    'finance/invoice-reconcile': {
      'Create Exception'() {
        const id = Router.getQueryParam('id') || 'inv3';
        const inv = VMP.getInvoice(id);
        if (inv) { inv.reconciliation_status = 'Exception'; inv.exception_reason = inv.exception_reason || 'Manual exception created'; }
        VMP.showToast('Exception recorded — invoice flagged for review');
        MockActions.refresh();
      },
      'Request Vendor Correction'() {
        VMP.showToast('Correction request sent to vendor');
      }
    },

    'leave/holidays': {
      '+ Add Holiday'() {
        const id = VMP.nextId('h', VMP_DATA.holidays);
        VMP_DATA.holidays.push({
          id, region: 'India - All', holiday_date: '2025-08-01',
          holiday_name: 'New Holiday (Added)', calendar_year: 2025, status: 'Active'
        });
        VMP.addAuditLog('Holiday', id, 'Created', null, 'New Holiday');
        VMP.showToast('Holiday added to calendar');
        MockActions.refresh();
      },
      'Import Calendar'() { VMP.showToast('Holiday calendar import started'); }
    },

    'contractors/deboarding': {
      'Revoke Access'() {
        VMP.showToast('IT access revocation initiated for Lakshmi Venkat');
        VMP.addAuditLog('Contractor', 'c6', 'Access Revoked', 'Active', 'Revoked');
      },
      'Complete Exit & Archive'() {
        const c = VMP.getContractor('c6');
        if (c) { c.status = 'Exited'; c.onboarding_stage = 'Archived'; }
        VMP.showToast('Exit completed — contractor archived');
        Router.go('contractors/list');
      }
    },

    'contractor/documents': {
      'Upload'(btn) {
        const row = btn.closest('tr');
        const docType = row?.querySelector('td')?.textContent?.trim();
        let doc = VMP_DATA.documents.find(d => d.entity_id === 'c1' && d.document_type === docType);
        if (!doc) {
          doc = { id: VMP.nextId('doc', VMP_DATA.documents), entity_type: 'Contractor', entity_id: 'c1', document_type: docType, document_name: null, uploaded_by: null, status: 'Pending Upload' };
          VMP_DATA.documents.push(doc);
        }
        doc.status = 'Verified';
        doc.document_name = (docType || 'doc').replace(/\s/g, '-') + '-uploaded.pdf';
        doc.uploaded_by = 'c1';
        VMP.addAuditLog('Document', doc.id, 'Uploaded', 'Pending Upload', 'Verified');
        VMP.showToast((docType || 'Document') + ' uploaded and marked verified');
        MockActions.refresh();
      },
      'Download'() { VMP.showToast('Download started'); }
    },

    'taq/mrf': {
      'Convert to Job Order'(btn) {
        const row = btn.closest('tr');
        const mrfId = row?.querySelector('td')?.textContent;
        const mrf = VMP_DATA.mrfs.find(m => m.id === mrfId);
        if (mrf && mrf.status === 'Raised') {
          const opId = VMP.nextId('op', VMP_DATA.openPositions);
          VMP_DATA.openPositions.unshift({
            id: opId, project_id: 'p1', position_title: mrf.role_title, skill_set: mrf.skills,
            required_experience: '3+ years', no_of_positions: mrf.headcount, budget_rate: 9000,
            location: 'Remote', start_date: '2025-08-01', end_date: '2026-07-31',
            status: 'Open', requested_by: mrf.requested_by, approved_by: 'u1', vendor_ids: ['v1', 'v2']
          });
          mrf.status = 'Converted to Job Order';
          mrf.open_position_id = opId;
          VMP.addAuditLog('MRF', mrfId, 'Converted', 'Raised', 'Job Order ' + opId);
          VMP.showToast('MRF converted to job order — open position created');
          MockActions.refresh();
        }
      }
    },

    'taq/candidate-routing': {},

    'hr/interviews': {
      'Confirm Schedule'(btn) {
        const pending = VMP_DATA.candidates.filter(c => c.stage === 'Manager Selected');
        const candidateId = Router.getQueryParam('candidate') || pending[0]?.id;
        if (!candidateId) {
          VMP.showToast('No candidate selected for scheduling');
          return;
        }
        MockActions.scheduleInterview(candidateId, MockActions.readForm(btn));
      }
    },

    'hr/candidates': {
      'Send Offer'(btn) {
        const row = btn.closest('tr');
        const name = row?.querySelector('td')?.textContent?.trim();
        const c = VMP_DATA.candidates.find(x => x.name === name);
        if (c) MockActions.sendOffer(c.id);
      }
    },

    'vendor/candidates': {
      'Submit to TAQ for Routing'(btn) {
        const d = MockActions.readForm(btn);
        const jobId = Router.getQueryParam('job') || 'jo4';
        const jo = VMP_DATA.jobOrders.find(j => j.id === jobId);
        const vid = VMP.getCurrentVendorId() || 'v1';
        const id = VMP.nextId('can', VMP_DATA.candidates);
        VMP_DATA.candidates.unshift({
          id, job_order_id: jobId, vendor_id: vid,
          name: d['Candidate Name'] || 'New Candidate',
          email: d['Email'] || 'candidate@vendor.com',
          stage: 'Submitted', ai_score: 78 + Math.floor(Math.random() * 15), contractor_id: null,
          forwarded_to_manager_id: null, manager_selected: false
        });
        if (jo) {
          jo.candidates_submitted = (jo.candidates_submitted || 0) + 1;
          jo.response_status = jo.candidates_submitted >= (jo.headcount_needed || 1) ? 'Candidates Submitted' : 'In Progress';
        }
        VMP.addAuditLog('Candidate', id, 'Submitted by Vendor', null, d['Candidate Name']);
        VMP.showToast('Candidate submitted — TAQ will route profile to hiring manager');
        MockActions.refresh();
      }
    },

    'vendor/onboarding': {
      'Initiate Exit Coordination'(btn) {
        const row = btn.closest('tr');
        const name = row?.querySelector('td')?.textContent?.trim();
        const c = VMP_DATA.contractors.find(x => x.full_name === name);
        if (c) {
          VMP.addAuditLog('Contractor', c.id, 'Exit Coordination', 'Active', 'Vendor initiated');
          VMP.showToast('Exit coordination initiated for ' + name + ' — HR notified');
        }
      }
    }
  },

  /** Generic actions available on multiple screens */
  generic: {
    'Export'() { VMP.showToast('Export started — file will download shortly'); },
    'Export PDF'() { VMP.showToast('PDF export started'); },
    'Export File'() { VMP.showToast('File exported successfully'); },
    'Export Payment File'() { MockActions.handlers['finance/batch-detail']['Export Payment File'](); },
    'Sync Projects'() { VMP.showToast('Projects synced from ERP — 2 updated'); },
    'Download'() { VMP.showToast('Download started'); },
    'Download Errors'() { VMP.showToast('Error report downloaded'); },
    'Re-upload Corrected File'() { Router.go('import/upload'); },
    'Configure Templates'() { VMP.showToast('Template configuration opened'); },
    'Send Bundle via DocuSign'() { VMP.showToast('DocuSign envelope sent — SLA, SOW, NDA & MSA awaiting vendor signature'); },
    'Record Signed Copies'() { VMP.showToast('Signed copies recorded — DocuSign status: Signed, stored in repository'); },
    'Trigger Manual Sync'() { VMP.showToast('Leave sync triggered — completed successfully'); },
    'Run'() { VMP.showToast('Report generated'); },
    '+ Create User'() { VMP.showToast('User creation form — demo: add via HR workflow'); },
    '+ Create Agreement'() { VMP.showToast('Agreement created — pending signatures'); },
    'Edit'() { VMP.showToast('Edit mode — changes saved on submit'); },
    'View'() { VMP.showToast('Opening document viewer'); },
    'Upload Report'() { VMP.showToast('BGV report uploaded'); },
    'History'() { VMP.showToast('Opening version history'); },
    'Resolve'(btn) { MockActions.approve(btn.dataset.id); VMP.showToast('Anomaly resolved'); MockActions.refresh(); }
  },

  bindScreen() {
    const path = Router.getPath().split('?')[0];
    const screenHandlers = MockActions.handlers[path] || {};

    document.querySelectorAll('.form-actions button, .toolbar button, table button, .card-body button').forEach(btn => {
      if (btn.dataset.action === 'approve' || btn.dataset.action === 'reject') return;
      const label = btn.textContent.trim();
      const handler = screenHandlers[label] || MockActions.generic[label];
      if (!handler) return;
      btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handler(btn);
      });
    });

    // Document upload buttons in contractor/documents table
    document.querySelectorAll('table button').forEach(btn => {
      if (btn.dataset.bound) return;
      const label = btn.textContent.trim();
      if (label === 'Upload' && path === 'contractor/documents') {
        btn.dataset.bound = '1';
        btn.type = 'button';
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          MockActions.handlers['contractor/documents']['Upload'](btn);
        });
      }
    });
  }
};
