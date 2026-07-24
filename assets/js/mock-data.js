/**
 * VMP Mock Data — single source of truth for all entities and relationships
 */
const VMP_DATA = {
  roles: [
    { id: 'role-taq', name: 'TAQ / System Admin', code: 'taq' },
    { id: 'role-hr', name: 'HR Operations', code: 'hr' },
    { id: 'role-finance', name: 'Finance', code: 'finance' },
    { id: 'role-manager', name: "Contractor's Manager", code: 'manager' },
    { id: 'role-contractor', name: 'Contractor', code: 'contractor' },
    { id: 'role-vendor', name: 'Vendor Side Manager', code: 'vendor' }
  ],

  users: [
    { id: 'u1', employee_id: 'EMP001', full_name: 'Priya Sharma', email: 'priya.sharma@company.com', department: 'Talent Acquisition', designation: 'TA Lead', role_id: 'role-taq', manager_id: null, status: 'Active', phone: '+91-9876543210' },
    { id: 'u2', employee_id: 'EMP002', full_name: 'Anita Desai', email: 'anita.desai@company.com', department: 'HR Operations', designation: 'HR Ops Manager', role_id: 'role-hr', manager_id: null, status: 'Active', phone: '+91-9876543211' },
    { id: 'u3', employee_id: 'EMP003', full_name: 'Rajesh Kumar', email: 'rajesh.kumar@company.com', department: 'Finance', designation: 'Finance Manager', role_id: 'role-finance', manager_id: null, status: 'Active', phone: '+91-9876543212' },
    { id: 'u4', employee_id: 'EMP004', full_name: 'Vikram Mehta', email: 'vikram.mehta@company.com', department: 'Engineering', designation: 'Engineering Manager', role_id: 'role-manager', manager_id: null, status: 'Active', phone: '+91-9876543213' },
    { id: 'u5', employee_id: 'EMP005', full_name: 'Sneha Patel', email: 'sneha.patel@company.com', department: 'Product', designation: 'Product Manager', role_id: 'role-manager', manager_id: null, status: 'Active', phone: '+91-9876543214' },
    { id: 'u6', employee_id: 'EMP006', full_name: 'Arun Nair', email: 'arun.nair@company.com', department: 'Finance', designation: 'Finance Analyst', role_id: 'role-finance', manager_id: 'u3', status: 'Active', phone: '+91-9876543215' },
    { id: 'vm1', employee_id: 'VND-001-MGR', full_name: 'Ravi Menon', email: 'ravi@acmestaff.com', department: 'Acme Staffing Solutions', designation: 'Vendor Side Manager', role_id: 'role-vendor', manager_id: null, status: 'Active', phone: '+91-9123456780', vendor_id: 'v1' }
  ],

  permissions: [
    { role_id: 'role-taq', module: 'All Modules', can_view: true, can_create: true, can_update: true, can_approve: true, can_export: true },
    { role_id: 'role-hr', module: 'Contractors', can_view: true, can_create: true, can_update: true, can_approve: true, can_export: true },
    { role_id: 'role-finance', module: 'Finance', can_view: true, can_create: true, can_update: true, can_approve: true, can_export: true },
    { role_id: 'role-manager', module: 'Team Timesheets', can_view: true, can_create: false, can_update: false, can_approve: true, can_export: false },
    { role_id: 'role-contractor', module: 'Self Service', can_view: true, can_create: true, can_update: true, can_approve: false, can_export: false },
    { role_id: 'role-vendor', module: 'Vendor Portal', can_view: true, can_create: true, can_update: true, can_approve: true, can_export: true }
  ],

  vendors: [
    { id: 'v1', vendor_code: 'VND-001', vendor_name: 'Acme Staffing Solutions', registered_name: 'Acme Staffing Pvt Ltd', gst_number: '27AABCA1234F1Z5', pan_number: 'AABCA1234F', address: 'Mumbai, MH', contact_name: 'Ravi Menon', contact_email: 'ravi@acmestaff.com', contact_phone: '+91-9123456780', compliance_status: 'Compliant', approval_status: 'Approved', status: 'Active', contract_start_date: '2024-01-15', contract_end_date: '2025-12-31', contract_document: 'MSA-Acme-2024.pdf' },
    { id: 'v2', vendor_code: 'VND-002', vendor_name: 'TechTalent Partners', registered_name: 'TechTalent Partners LLP', gst_number: '29AABCT5678G1Z2', pan_number: 'AABCT5678G', address: 'Bangalore, KA', contact_name: 'Kavitha Rao', contact_email: 'kavitha@techtalent.com', contact_phone: '+91-9123456781', compliance_status: 'Pending Review', approval_status: 'Pending Finance Approval', status: 'Draft', contract_start_date: '2025-07-01', contract_end_date: '2026-06-30', contract_document: null },
    { id: 'v3', vendor_code: 'VND-003', vendor_name: 'Global Contract Services', registered_name: 'GCS International', gst_number: '07AABCG9012H1Z8', pan_number: 'AABCG9012H', address: 'Delhi, DL', contact_name: 'Mohit Singh', contact_email: 'mohit@gcs.com', contact_phone: '+91-9123456782', compliance_status: 'Non-Compliant', approval_status: 'Suspended', status: 'Suspended', contract_start_date: '2023-03-01', contract_end_date: '2025-08-31', contract_document: 'MSA-GCS-2023.pdf' }
  ],

  vendorDocuments: [
    { id: 'vd1', vendor_id: 'v1', document_type: 'MSA', document_name: 'Master Service Agreement 2025.pdf', expiry_date: '2026-12-31', renewal_date: '2026-11-30', verification_status: 'Verified', uploaded_by: 'u2', verified_by: 'u3', created_at: '2024-01-15', updated_at: '2024-01-15' },
    { id: 'vd2', vendor_id: 'v1', document_type: 'SOW', document_name: 'SOW-Engineering-2025.pdf', expiry_date: '2025-12-31', renewal_date: '2025-11-30', verification_status: 'Verified', uploaded_by: 'u2', verified_by: 'u2', created_at: '2025-01-05', updated_at: '2025-04-20' },
    { id: 'vd3', vendor_id: 'v1', document_type: 'Insurance', document_name: 'Insurance Certificate.pdf', expiry_date: '2025-06-30', renewal_date: '2025-06-15', verification_status: 'Expiring Soon', uploaded_by: 'u2', verified_by: 'u2', created_at: '2024-07-01', updated_at: '2025-05-20' },
    { id: 'vd4', vendor_id: 'v2', document_type: 'Company Registration', document_name: 'COI-TechTalent.pdf', expiry_date: null, renewal_date: null, verification_status: 'Pending', uploaded_by: 'u2', verified_by: null, created_at: '2025-06-18', updated_at: '2025-06-18' }
  ],

  projects: [
    { id: 'p1', project_code: 'PRJ-101', project_name: 'Platform Modernization', client_name: 'Internal', department: 'Engineering', project_manager_id: 'u4', start_date: '2024-01-01', end_date: '2026-12-31', status: 'Active' },
    { id: 'p2', project_code: 'PRJ-102', project_name: 'Customer Portal Revamp', client_name: 'Internal', department: 'Product', project_manager_id: 'u5', start_date: '2024-06-01', end_date: '2025-12-31', status: 'Active' },
    { id: 'p3', project_code: 'PRJ-103', project_name: 'Data Analytics Hub', client_name: 'Internal', department: 'Engineering', project_manager_id: 'u4', start_date: '2025-01-01', end_date: '2025-12-31', status: 'Active' },
    { id: 'p4', project_code: 'PRJ-104', project_name: 'Legacy Migration', client_name: 'Internal', department: 'IT', project_manager_id: 'u4', start_date: '2023-01-01', end_date: '2024-12-31', status: 'Inactive' },
    { id: 'p5', project_code: 'PRJ-105', project_name: 'Mobile App v2', client_name: 'Internal', department: 'Product', project_manager_id: 'u5', start_date: '2025-03-01', end_date: '2026-06-30', status: 'Active' }
  ],

  openPositions: [
    { id: 'op1', project_id: 'p1', position_title: 'Senior Java Developer', skill_set: 'Java, Spring Boot, AWS', required_experience: '5+ years', no_of_positions: 2, budget_rate: 8500, location: 'Mumbai', start_date: '2025-04-01', end_date: '2025-12-31', status: 'Open', requested_by: 'u4', approved_by: 'u1', vendor_ids: ['v1'] },
    { id: 'op2', project_id: 'p2', position_title: 'UX Designer', skill_set: 'Figma, User Research', required_experience: '3+ years', no_of_positions: 1, budget_rate: 6500, location: 'Bangalore', start_date: '2025-05-01', end_date: '2025-11-30', status: 'In Progress', requested_by: 'u5', approved_by: 'u1', vendor_ids: ['v1', 'v2'] },
    { id: 'op3', project_id: 'p3', position_title: 'Data Engineer', skill_set: 'Python, Spark, SQL', required_experience: '4+ years', no_of_positions: 1, budget_rate: 9000, location: 'Remote', start_date: '2025-06-01', end_date: '2025-12-31', status: 'Filled', requested_by: 'u4', approved_by: 'u1', vendor_ids: ['v1'] }
  ],

  contractors: [
    { id: 'c1', contractor_code: 'CON-001', vendor_id: 'v1', full_name: 'Amit Joshi', email: 'amit.joshi@email.com', phone: '+91-9988776655', skill_set: 'Java, Spring Boot', experience_years: 6, location: 'Mumbai', joining_date: '2024-03-15', exit_date: null, status: 'Active', bgv_status: 'Cleared', bank_account: '1234567890', ifsc: 'HDFC0001234', onboarding_stage: 'Active', project_name: 'Platform Modernization', pay_rate: 92000, contract_end_date: '2025-12-31', fte_conversion_eligible: 'Yes — eligible at tenure end', leave_balance: { annual: 12, sick: 6, personal: 3 } },
    { id: 'c2', contractor_code: 'CON-002', vendor_id: 'v1', full_name: 'Deepa Krishnan', email: 'deepa.k@email.com', phone: '+91-9988776656', skill_set: 'React, TypeScript', experience_years: 4, location: 'Bangalore', joining_date: '2024-08-01', exit_date: null, status: 'Active', bgv_status: 'Cleared', bank_account: '2345678901', ifsc: 'ICIC0002345', onboarding_stage: 'Active' },
    { id: 'c3', contractor_code: 'CON-003', vendor_id: 'v1', full_name: 'Suresh Reddy', email: 'suresh.r@email.com', phone: '+91-9988776657', skill_set: 'Python, Data Engineering', experience_years: 5, location: 'Hyderabad', joining_date: '2025-01-10', exit_date: null, status: 'Active', bgv_status: 'Cleared', bank_account: '3456789012', ifsc: 'SBIN0003456', onboarding_stage: 'Active' },
    { id: 'c4', contractor_code: 'CON-004', vendor_id: 'v1', full_name: 'Meera Iyer', email: 'meera.i@email.com', phone: '+91-9988776658', skill_set: 'UX Design, Figma', experience_years: 3, location: 'Bangalore', joining_date: '2025-04-01', exit_date: null, status: 'Onboarding', bgv_status: 'In Progress', bank_account: null, ifsc: null, onboarding_stage: 'Docs Submitted', project_name: 'Customer Portal Revamp', pay_rate: 68000, contract_end_date: '2026-03-31', fte_conversion_eligible: 'To be reviewed at tenure end' },
    { id: 'c5', contractor_code: 'CON-005', vendor_id: 'v2', full_name: 'Karan Malhotra', email: 'karan.m@email.com', phone: '+91-9988776659', skill_set: 'DevOps, Kubernetes', experience_years: 7, location: 'Delhi', joining_date: '2025-05-15', exit_date: null, status: 'Onboarding', bgv_status: 'Not Started', bank_account: null, ifsc: null, onboarding_stage: 'Applied' },
    { id: 'c6', contractor_code: 'CON-006', vendor_id: 'v1', full_name: 'Lakshmi Venkat', email: 'lakshmi.v@email.com', phone: '+91-9988776660', skill_set: 'QA Automation', experience_years: 4, location: 'Chennai', joining_date: '2023-06-01', exit_date: '2025-06-30', status: 'Active', bgv_status: 'Cleared', bank_account: '4567890123', ifsc: 'AXIS0004567', onboarding_stage: 'Active' },
    { id: 'c7', contractor_code: 'CON-007', vendor_id: 'v1', full_name: 'Rohit Agarwal', email: 'rohit.a@email.com', phone: '+91-9988776661', skill_set: 'Java, Microservices', experience_years: 8, location: 'Mumbai', joining_date: '2022-01-01', exit_date: '2025-03-31', status: 'Exited', bgv_status: 'Cleared', bank_account: '5678901234', ifsc: 'HDFC0005678', onboarding_stage: 'Archived' },
    { id: 'c8', contractor_code: 'CON-008', vendor_id: 'v1', full_name: 'Pooja Shah', email: 'pooja.s@email.com', phone: '+91-9988776662', skill_set: 'Business Analyst', experience_years: 5, location: 'Mumbai', joining_date: '2024-11-01', exit_date: null, status: 'Active', bgv_status: 'Cleared', bank_account: '6789012345', ifsc: 'KKBK0006789', onboarding_stage: 'Active' }
  ],

  assignments: [
    { id: 'a1', contractor_id: 'c1', project_id: 'p1', reporting_manager_id: 'u4', vendor_id: 'v1', start_date: '2024-03-15', end_date: null, allocation_percentage: 100, assignment_status: 'Active', transfer_reason: null, approved_by: 'u2' },
    { id: 'a2', contractor_id: 'c2', project_id: 'p2', reporting_manager_id: 'u5', vendor_id: 'v1', start_date: '2024-08-01', end_date: null, allocation_percentage: 100, assignment_status: 'Active', transfer_reason: null, approved_by: 'u2' },
    { id: 'a3', contractor_id: 'c3', project_id: 'p3', reporting_manager_id: 'u4', vendor_id: 'v1', start_date: '2025-01-10', end_date: null, allocation_percentage: 100, assignment_status: 'Active', transfer_reason: null, approved_by: 'u2' },
    { id: 'a4', contractor_id: 'c6', project_id: 'p1', reporting_manager_id: 'u4', vendor_id: 'v1', start_date: '2023-06-01', end_date: '2025-06-30', allocation_percentage: 100, assignment_status: 'Active', transfer_reason: null, approved_by: 'u2' },
    { id: 'a5', contractor_id: 'c8', project_id: 'p1', reporting_manager_id: 'u5', vendor_id: 'v1', start_date: '2024-11-01', end_date: null, allocation_percentage: 100, assignment_status: 'Active', transfer_reason: null, approved_by: 'u2' },
    { id: 'a6', contractor_id: 'c1', project_id: 'p3', reporting_manager_id: 'u4', vendor_id: 'v1', start_date: '2025-07-01', end_date: null, allocation_percentage: 100, assignment_status: 'Pending Transfer', transfer_reason: 'Project reallocation', approved_by: null },
    { id: 'a7', contractor_id: 'c2', project_id: 'p4', reporting_manager_id: 'u4', vendor_id: 'v1', start_date: '2024-08-01', end_date: null, allocation_percentage: 100, assignment_status: 'Active', transfer_reason: null, approved_by: 'u2' },
    { id: 'a8', contractor_id: 'c3', project_id: 'p1', reporting_manager_id: null, vendor_id: 'v1', start_date: '2025-01-10', end_date: null, allocation_percentage: 100, assignment_status: 'Active', transfer_reason: null, approved_by: 'u2' }
  ],

  rates: [
    { id: 'r1', contractor_id: 'c1', vendor_id: 'v1', assignment_id: 'a1', currency: 'INR', hourly_rate: null, daily_rate: null, monthly_rate: 85000, rate_type: 'Monthly', effective_from: '2024-03-15', effective_to: '2024-12-31', approval_status: 'Approved', approved_by: 'u3', version: 1, immutable: true },
    { id: 'r2', contractor_id: 'c1', vendor_id: 'v1', assignment_id: 'a1', currency: 'INR', hourly_rate: null, daily_rate: null, monthly_rate: 92000, rate_type: 'Monthly', effective_from: '2025-01-01', effective_to: null, approval_status: 'Approved', approved_by: 'u3', version: 2, immutable: true },
    { id: 'r3', contractor_id: 'c2', vendor_id: 'v1', assignment_id: 'a2', currency: 'INR', hourly_rate: null, daily_rate: null, monthly_rate: 72000, rate_type: 'Monthly', effective_from: '2024-08-01', effective_to: null, approval_status: 'Approved', approved_by: 'u3', version: 1, immutable: true },
    { id: 'r4', contractor_id: 'c3', vendor_id: 'v1', assignment_id: 'a3', currency: 'INR', hourly_rate: null, daily_rate: null, monthly_rate: 95000, rate_type: 'Monthly', effective_from: '2025-01-10', effective_to: null, approval_status: 'Approved', approved_by: 'u3', version: 1, immutable: true },
    { id: 'r5', contractor_id: 'c4', vendor_id: 'v1', assignment_id: null, currency: 'INR', hourly_rate: null, daily_rate: null, monthly_rate: 68000, rate_type: 'Monthly', effective_from: '2025-04-01', effective_to: null, approval_status: 'Pending Finance', approved_by: null, version: 1, immutable: false },
    { id: 'r6', contractor_id: 'c6', vendor_id: 'v1', assignment_id: 'a4', currency: 'INR', hourly_rate: null, daily_rate: null, monthly_rate: 65000, rate_type: 'Monthly', effective_from: '2023-06-01', effective_to: null, approval_status: 'Approved', approved_by: 'u3', version: 1, immutable: true },
    { id: 'r7', contractor_id: 'c8', vendor_id: 'v1', assignment_id: 'a5', currency: 'INR', hourly_rate: null, daily_rate: null, monthly_rate: 78000, rate_type: 'Monthly', effective_from: '2024-11-01', effective_to: null, approval_status: 'Approved', approved_by: 'u3', version: 1, immutable: true },
    { id: 'r8', contractor_id: 'c1', vendor_id: 'v1', assignment_id: 'a6', currency: 'INR', hourly_rate: null, daily_rate: null, monthly_rate: 98000, rate_type: 'Monthly', effective_from: '2025-07-01', effective_to: null, approval_status: 'Draft', approved_by: null, version: 3, immutable: false },
    { id: 'r9', contractor_id: 'c2', vendor_id: 'v1', assignment_id: 'a7', currency: 'INR', hourly_rate: null, daily_rate: null, monthly_rate: 72000, rate_type: 'Monthly', effective_from: '2024-08-01', effective_to: '2025-05-31', approval_status: 'Approved', approved_by: 'u3', version: 1, immutable: true },
    { id: 'r10', contractor_id: 'c5', vendor_id: 'v2', assignment_id: null, currency: 'INR', hourly_rate: null, daily_rate: null, monthly_rate: 110000, rate_type: 'Monthly', effective_from: '2025-05-15', effective_to: null, approval_status: 'Draft', approved_by: null, version: 1, immutable: false }
  ],

  bgvRecords: [
    { id: 'bgv1', contractor_id: 'c1', vendor_id: 'v1', bgv_vendor: 'VerifyFirst', initiated_date: '2024-03-01', completed_date: '2024-03-10', bgv_status: 'Cleared', verified_by: 'u2' },
    { id: 'bgv2', contractor_id: 'c2', vendor_id: 'v1', bgv_vendor: 'VerifyFirst', initiated_date: '2024-07-15', completed_date: '2024-07-25', bgv_status: 'Cleared', verified_by: 'u2' },
    { id: 'bgv3', contractor_id: 'c4', vendor_id: 'v1', bgv_vendor: 'VerifyFirst', initiated_date: '2025-03-20', completed_date: null, bgv_status: 'In Progress', verified_by: null },
    { id: 'bgv4', contractor_id: 'c5', vendor_id: 'v2', bgv_vendor: null, initiated_date: null, completed_date: null, bgv_status: 'Not Started', verified_by: null }
  ],

  timesheets: [
    { id: 'ts1', contractor_id: 'c1', assignment_id: 'a1', work_period_start: '2025-06-02', work_period_end: '2025-06-06', submitted_hours: 40, approved_hours: 40, rejected_hours: 0, reconciliation_status: 'Confirmed', manager_approval_status: 'Supervisor Approved', hr_approval_status: 'HR Approved', finance_review_status: 'Pending', contractor_confirmation_status: 'Confirmed', confirmation_email_sent_at: '2025-06-06 17:05', leave_mismatch: false, holiday_mismatch: false, batch_id: null },
    { id: 'ts2', contractor_id: 'c2', assignment_id: 'a2', work_period_start: '2025-06-02', work_period_end: '2025-06-06', submitted_hours: 40, approved_hours: 0, rejected_hours: 0, reconciliation_status: 'Awaiting Supervisor', manager_approval_status: 'Awaiting Supervisor', hr_approval_status: 'Pending', contractor_confirmation_status: 'Submitted', confirmation_email_sent_at: '2025-06-16 09:00', leave_mismatch: false, holiday_mismatch: false, batch_id: null },
    { id: 'ts3', contractor_id: 'c3', assignment_id: 'a3', work_period_start: '2025-06-02', work_period_end: '2025-06-06', submitted_hours: 32, approved_hours: 0, rejected_hours: 0, reconciliation_status: 'Awaiting Supervisor', manager_approval_status: 'Awaiting Supervisor', hr_approval_status: 'Pending', contractor_confirmation_status: 'Submitted', confirmation_email_sent_at: '2025-06-16 09:05', leave_mismatch: true, holiday_mismatch: false, batch_id: null,
      daily_hours: [{ day: 'Mon', date: 'Jun 2', hours: 8 }, { day: 'Tue', date: 'Jun 3', hours: 8 }, { day: 'Wed', date: 'Jun 4', hours: 8, flag: 'Leave on file' }, { day: 'Thu', date: 'Jun 5', hours: 0 }, { day: 'Fri', date: 'Jun 6', hours: 8 }] },
    { id: 'ts4', contractor_id: 'c1', assignment_id: 'a1', work_period_start: '2025-05-26', work_period_end: '2025-05-30', submitted_hours: 40, approved_hours: 40, rejected_hours: 0, reconciliation_status: 'In Finance Batch', manager_approval_status: 'Supervisor Approved', hr_approval_status: 'HR Approved', finance_review_status: 'Cleared for Vendor Pay', contractor_confirmation_status: 'Confirmed', confirmation_email_sent_at: '2025-05-30 17:10', leave_mismatch: false, holiday_mismatch: false, batch_id: 'fb1' },
    { id: 'ts5', contractor_id: 'c6', assignment_id: 'a4', work_period_start: '2025-06-02', work_period_end: '2025-06-06', submitted_hours: 40, approved_hours: 40, rejected_hours: 0, reconciliation_status: 'Awaiting HR', manager_approval_status: 'Supervisor Approved', hr_approval_status: 'Pending', contractor_confirmation_status: 'Confirmed', confirmation_email_sent_at: '2025-06-06 17:15', leave_mismatch: false, holiday_mismatch: false, batch_id: null },
    { id: 'ts6', contractor_id: 'c8', assignment_id: 'a5', work_period_start: '2025-06-02', work_period_end: '2025-06-06', submitted_hours: 40, approved_hours: 0, rejected_hours: 40, reconciliation_status: 'Rejected', manager_approval_status: 'Rejected', hr_approval_status: 'Pending', contractor_confirmation_status: 'Rejected', confirmation_email_sent_at: '2025-06-16 09:10', leave_mismatch: true, holiday_mismatch: true, batch_id: null,
      daily_hours: [{ day: 'Mon', date: 'Jun 2', hours: 8 }, { day: 'Tue', date: 'Jun 3', hours: 8 }, { day: 'Wed', date: 'Jun 4', hours: 8, flag: 'Leave on file' }, { day: 'Thu', date: 'Jun 5', hours: 8, flag: 'Holiday' }, { day: 'Fri', date: 'Jun 6', hours: 8 }] },
    { id: 'ts7', contractor_id: 'c2', assignment_id: 'a2', work_period_start: '2025-05-26', work_period_end: '2025-05-30', submitted_hours: 40, approved_hours: 40, rejected_hours: 0, reconciliation_status: 'In Finance Batch', manager_approval_status: 'Supervisor Approved', hr_approval_status: 'HR Approved', finance_review_status: 'Cleared for Vendor Pay', contractor_confirmation_status: 'Confirmed', confirmation_email_sent_at: '2025-05-30 17:00', leave_mismatch: false, holiday_mismatch: false, batch_id: 'fb1' },
    { id: 'ts8', contractor_id: 'c3', assignment_id: 'a3', work_period_start: '2025-05-26', work_period_end: '2025-05-30', submitted_hours: 40, approved_hours: 40, rejected_hours: 0, reconciliation_status: 'Confirmed', manager_approval_status: 'Supervisor Approved', hr_approval_status: 'HR Approved', finance_review_status: 'Pending', contractor_confirmation_status: 'Confirmed', confirmation_email_sent_at: '2025-05-30 17:05', leave_mismatch: false, holiday_mismatch: false, batch_id: null },
    { id: 'ts9', contractor_id: 'c1', assignment_id: 'a1', work_period_start: '2025-05-19', work_period_end: '2025-05-23', submitted_hours: 40, approved_hours: 40, rejected_hours: 0, reconciliation_status: 'Paid', manager_approval_status: 'Supervisor Approved', hr_approval_status: 'HR Approved', contractor_confirmation_status: 'Confirmed', confirmation_email_sent_at: '2025-05-23 17:00', leave_mismatch: false, holiday_mismatch: false, batch_id: 'fb2' },
    { id: 'ts10', contractor_id: 'c6', assignment_id: 'a4', work_period_start: '2025-05-26', work_period_end: '2025-05-30', submitted_hours: 40, approved_hours: 40, rejected_hours: 0, reconciliation_status: 'In Finance Batch', manager_approval_status: 'Supervisor Approved', hr_approval_status: 'HR Approved', finance_review_status: 'Cleared for Vendor Pay', contractor_confirmation_status: 'Confirmed', confirmation_email_sent_at: '2025-05-30 17:20', leave_mismatch: false, holiday_mismatch: false, batch_id: 'fb1' },
    { id: 'ts11', contractor_id: 'c8', assignment_id: 'a5', work_period_start: '2025-05-26', work_period_end: '2025-05-30', submitted_hours: 40, approved_hours: 40, rejected_hours: 0, reconciliation_status: 'Confirmed', manager_approval_status: 'Supervisor Approved', hr_approval_status: 'HR Approved', finance_review_status: 'Pending', contractor_confirmation_status: 'Confirmed', confirmation_email_sent_at: '2025-05-30 17:25', leave_mismatch: false, holiday_mismatch: false, batch_id: null },
    { id: 'ts12', contractor_id: 'c2', assignment_id: 'a2', work_period_start: '2025-05-19', work_period_end: '2025-05-23', submitted_hours: 40, approved_hours: 40, rejected_hours: 0, reconciliation_status: 'Paid', manager_approval_status: 'Supervisor Approved', hr_approval_status: 'HR Approved', finance_review_status: 'Cleared for Vendor Pay', contractor_confirmation_status: 'Confirmed', confirmation_email_sent_at: '2025-05-23 17:05', leave_mismatch: false, holiday_mismatch: false, batch_id: 'fb2' },
    { id: 'ts13', contractor_id: 'c8', assignment_id: 'a5', work_period_start: '2025-06-09', work_period_end: '2025-06-13', submitted_hours: 40, approved_hours: 40, rejected_hours: 0, reconciliation_status: 'In Finance Batch', manager_approval_status: 'Supervisor Approved', hr_approval_status: 'HR Approved', finance_review_status: 'Blocked — Anomaly', contractor_confirmation_status: 'Confirmed', confirmation_email_sent_at: '2025-06-13 17:00', leave_mismatch: false, holiday_mismatch: false, batch_id: 'fb1', finance_block_reason: 'Stale Reporting Manager' }

  holidays: [
    { id: 'h1', region: 'India - Mumbai', holiday_date: '2025-08-15', holiday_name: 'Independence Day', calendar_year: 2025, status: 'Active' },
    { id: 'h2', region: 'India - Mumbai', holiday_date: '2025-10-02', holiday_name: 'Gandhi Jayanti', calendar_year: 2025, status: 'Active' },
    { id: 'h3', region: 'India - Bangalore', holiday_date: '2025-11-01', holiday_name: 'Karnataka Rajyotsava', calendar_year: 2025, status: 'Active' },
    { id: 'h4', region: 'India - All', holiday_date: '2025-12-25', holiday_name: 'Christmas', calendar_year: 2025, status: 'Active' },
    { id: 'h5', region: 'India - Mumbai', holiday_date: '2025-06-05', holiday_name: 'Company Foundation Day', calendar_year: 2025, status: 'Active' }
  ],

  leaveRecords: [
    { id: 'lr1', contractor_id: 'c3', leave_date: '2025-06-04', leave_type: 'Personal', leave_status: 'Approved', approved_by: 'u4' },
    { id: 'lr2', contractor_id: 'c3', leave_date: '2025-06-05', leave_type: 'Personal', leave_status: 'Approved', approved_by: 'u4' },
    { id: 'lr3', contractor_id: 'c8', leave_date: '2025-06-03', leave_type: 'Sick', leave_status: 'Approved', approved_by: 'u5' },
    { id: 'lr4', contractor_id: 'c2', leave_date: '2025-06-20', leave_type: 'Annual', leave_status: 'Pending', approved_by: null },
    { id: 'lr5', contractor_id: 'c1', leave_date: '2025-07-01', leave_type: 'Annual', leave_status: 'Pending', approved_by: null }
  ],

  invoices: [
    { id: 'inv1', vendor_id: 'v1', invoice_number: 'INV-2025-042', invoice_date: '2025-06-10', billing_period_start: '2025-05-01', billing_period_end: '2025-05-31', invoice_amount: 425000, tax_amount: 76500, currency: 'INR', batch_id: 'fb2', reconciliation_status: 'Approved', exception_reason: null, payment_status: 'Paid', dual_approval_required: true, approver1: 'u3', approver2: 'u6', vendor_approval_status: 'Approved',
      completeness_status: 'Passed', pm_confirmation_status: 'Confirmed', budget_approval_status: 'Approved', finance_approval_status: 'Approved', approval_stage: 'Approved & Eligible for Payment',
      settlement_status: 'Paid', payment_file_ref: 'PAY-2025-089', remittance_sent: true, scheduled_date: '2025-06-12',
      project_id: 'p1', sow_document: 'SOW-Engineering-2025.pdf', sow_headcount: 5, sow_rate: 92000, due_date: '2025-06-25', invoice_batch_id: 'ib-pay-1',
      invoice_stage: 'Paid', sow_validation_status: 'Validated', sow_validated_by: 'u2', ta_approval_status: 'Approved', ta_approved_by: 'u1', finance_processing_status: 'Paid' },
    { id: 'inv2', vendor_id: 'v1', invoice_number: 'INV-2025-048', invoice_date: '2025-06-15', billing_period_start: '2025-05-26', billing_period_end: '2025-06-06', invoice_amount: 185000, tax_amount: 33300, currency: 'INR', batch_id: 'fb1', reconciliation_status: 'Reconciling', exception_reason: null, payment_status: 'Pending', dual_approval_required: false, approver1: null, approver2: null, vendor_approval_status: 'Pending',
      completeness_status: 'Passed', pm_confirmation_status: 'Pending', budget_approval_status: 'Pending', finance_approval_status: 'Pending', approval_stage: 'Service Confirmation',
      settlement_status: 'Not Started', payment_file_ref: null, remittance_sent: false, scheduled_date: null,
      project_id: 'p2', sow_document: 'SOW-Product-2025.pdf', sow_headcount: 2, sow_rate: 72000, due_date: '2025-06-30', invoice_batch_id: null,
      invoice_stage: 'SOW Validation', sow_validation_status: 'Pending', sow_validated_by: null, ta_approval_status: 'Not Started', ta_approved_by: null, finance_processing_status: 'Not Started' },
    { id: 'inv3', vendor_id: 'v1', invoice_number: 'INV-2025-049', invoice_date: '2025-06-16', billing_period_start: '2025-06-01', billing_period_end: '2025-06-15', invoice_amount: 520000, tax_amount: 93600, currency: 'INR', batch_id: null, reconciliation_status: 'Blocked', exception_reason: 'Rate mismatch: billed at 95000 vs approved 92000 for CON-001', payment_status: 'Blocked', dual_approval_required: true, approver1: null, approver2: null, vendor_approval_status: 'Pending',
      completeness_status: 'Passed', pm_confirmation_status: 'Blocked', budget_approval_status: 'Pending', finance_approval_status: 'Pending', approval_stage: 'Reconciliation Exception',
      settlement_status: 'Not Started', payment_file_ref: null, remittance_sent: false, scheduled_date: null,
      project_id: 'p1', sow_document: 'SOW-Engineering-2025.pdf', sow_headcount: 5, sow_rate: 92000, due_date: '2025-06-28', invoice_batch_id: null,
      invoice_stage: 'Disputed', sow_validation_status: 'Disputed', sow_validated_by: 'u2', ta_approval_status: 'Not Started', ta_approved_by: null, finance_processing_status: 'Not Started', dispute_reason: 'Billed rate ₹95,000 exceeds SOW rate ₹92,000 for CON-001' },
    { id: 'inv4', vendor_id: 'v1', invoice_number: 'INV-2025-050', invoice_date: '2025-06-17', billing_period_start: '2025-06-01', billing_period_end: '2025-06-15', invoice_amount: 72000, tax_amount: 12960, currency: 'INR', batch_id: null, reconciliation_status: 'Approved', exception_reason: null, payment_status: 'Vendor Approved', dual_approval_required: false, approver1: 'u3', approver2: null, vendor_approval_status: 'Approved',
      completeness_status: 'Passed', pm_confirmation_status: 'Confirmed', budget_approval_status: 'Approved', finance_approval_status: 'Approved', approval_stage: 'Approved & Eligible for Payment',
      settlement_status: 'Scheduled', payment_file_ref: null, remittance_sent: false, scheduled_date: '2025-06-20',
      project_id: 'p2', sow_document: 'SOW-Product-2025.pdf', sow_headcount: 2, sow_rate: 55000, due_date: '2025-06-30', invoice_batch_id: null,
      invoice_stage: 'Finance Processing', sow_validation_status: 'Validated', sow_validated_by: 'u2', ta_approval_status: 'Approved', ta_approved_by: 'u1', finance_processing_status: 'Processing' },
    { id: 'inv5', vendor_id: 'v1', invoice_number: 'INV-2025-051', invoice_date: '2025-06-18', billing_period_start: '2025-06-01', billing_period_end: '2025-06-15', invoice_amount: 276000, tax_amount: 49680, currency: 'INR', batch_id: null, reconciliation_status: 'Reconciling', exception_reason: null, payment_status: 'Pending', dual_approval_required: false, approver1: null, approver2: null, vendor_approval_status: 'Pending',
      completeness_status: 'Passed', pm_confirmation_status: 'Confirmed', budget_approval_status: 'Pending', finance_approval_status: 'Pending', approval_stage: 'Service Confirmation',
      settlement_status: 'Not Started', payment_file_ref: null, remittance_sent: false, scheduled_date: null,
      project_id: 'p1', sow_document: 'SOW-Engineering-2025.pdf', sow_headcount: 3, sow_rate: 92000, due_date: '2025-07-02', invoice_batch_id: null,
      invoice_stage: 'TA Approval', sow_validation_status: 'Validated', sow_validated_by: 'u2', ta_approval_status: 'Pending', ta_approved_by: null, finance_processing_status: 'Not Started' },
    { id: 'inv6', vendor_id: 'v1', invoice_number: 'INV-2025-052', invoice_date: '2025-06-19', billing_period_start: '2025-06-01', billing_period_end: '2025-06-15', invoice_amount: 144000, tax_amount: 25920, currency: 'INR', batch_id: null, reconciliation_status: 'Reconciling', exception_reason: null, payment_status: 'Pending', dual_approval_required: false, approver1: null, approver2: null, vendor_approval_status: 'Pending',
      completeness_status: 'Passed', pm_confirmation_status: 'Confirmed', budget_approval_status: 'Pending', finance_approval_status: 'Pending', approval_stage: 'Service Confirmation',
      settlement_status: 'Not Started', payment_file_ref: null, remittance_sent: false, scheduled_date: null,
      project_id: 'p3', sow_document: 'SOW-Data-2025.pdf', sow_headcount: 1, sow_rate: 85000, due_date: '2025-07-05', invoice_batch_id: null,
      invoice_stage: 'TA Approval', sow_validation_status: 'Validated', sow_validated_by: 'u2', ta_approval_status: 'Pending', ta_approved_by: null, finance_processing_status: 'Not Started' }
  ],

  /** Invoice payment batches (Invoice Management module) — groups approved invoices for disbursement */
  invoiceBatches: [
    { id: 'ib-pay-1', batch_ref: 'PAYB-2025-01', invoice_ids: ['inv1'], total_amount: 501500, currency: 'INR', status: 'Disbursed', bank_transfer_ref: 'NEFT-889021', payment_date: '2025-06-12', created_by: 'u3' },
    { id: 'ib-pay-2', batch_ref: 'PAYB-2025-02', invoice_ids: ['inv4'], total_amount: 84960, currency: 'INR', status: 'Processing', bank_transfer_ref: null, payment_date: null, created_by: 'u3' }
  ],

  financeBatches: [
    { id: 'fb1', vendor_id: 'v1', billing_period: '2025-05-26 to 2025-06-06', total_hours: 160, total_amount: 307000, currency: 'INR', generated_by: 'u3', finance_status: 'Exceptions Flagged', approved_by: null, exported_at: null, payment_reference: null, line_items: [
      { contractor_id: 'c1', timesheet_id: 'ts4', approved_hours: 40, rate_id: 'r2', amount: 92000, exception_reason: null, blocked: false },
      { contractor_id: 'c2', timesheet_id: 'ts7', approved_hours: 40, rate_id: 'r3', amount: 72000, exception_reason: null, blocked: false },
      { contractor_id: 'c6', timesheet_id: 'ts10', approved_hours: 40, rate_id: 'r6', amount: 65000, exception_reason: null, blocked: false },
      { contractor_id: 'c8', timesheet_id: 'ts13', approved_hours: 40, rate_id: 'r7', amount: 78000, exception_reason: 'Reporting manager mismatch — expected Vikram Mehta, actual Sneha Patel', blocked: true }
    ]},
    { id: 'fb2', vendor_id: 'v1', billing_period: '2025-05-01 to 2025-05-23', total_hours: 80, total_amount: 164000, currency: 'INR', generated_by: 'u3', finance_status: 'Paid', approved_by: 'u3', exported_at: '2025-06-01', payment_reference: 'PAY-2025-089', line_items: [
      { contractor_id: 'c1', timesheet_id: 'ts9', approved_hours: 40, rate_id: 'r2', amount: 92000, exception_reason: null, blocked: false },
      { contractor_id: 'c2', timesheet_id: 'ts12', approved_hours: 40, rate_id: 'r3', amount: 72000, exception_reason: null, blocked: false }
    ]}
  ],

  approvals: [
    { id: 'ap1', entity_type: 'Vendor', entity_id: 'v2', workflow_name: 'Vendor Onboarding', current_stage: 'Finance Approval', requester: 'u2', requested_date: '2025-06-10', sla: '2 days', priority: 'High', status: 'Pending', approver_role: 'Finance' },
    { id: 'ap2', entity_type: 'Contractor Rate', entity_id: 'r5', workflow_name: 'Rate Approval', current_stage: 'Finance Approval', requester: 'u2', requested_date: '2025-06-12', sla: '1 day', priority: 'Medium', status: 'Pending', approver_role: 'Finance' },
    { id: 'ap3', entity_type: 'Assignment Transfer', entity_id: 'a6', workflow_name: 'Assignment Transfer', current_stage: 'HR Approval', requester: 'u4', requested_date: '2025-06-14', sla: '3 days', priority: 'High', status: 'Pending', approver_role: 'HR Ops' },
    { id: 'ap4', entity_type: 'Timesheet', entity_id: 'ts2', workflow_name: 'Timesheet Confirmation', current_stage: 'Awaiting Contractor Confirmation', requester: 'c2', requested_date: '2025-06-16', sla: '1 day', priority: 'Medium', status: 'Pending', approver_role: 'Contractor' },
    { id: 'ap5', entity_type: 'Invoice', entity_id: 'inv2', workflow_name: 'Invoice Approval', current_stage: 'Finance Approval', requester: 'u3', requested_date: '2025-06-15', sla: '2 days', priority: 'Medium', status: 'Pending', approver_role: 'Finance' },
    { id: 'ap6', entity_type: 'Contractor', entity_id: 'c4', workflow_name: 'Contractor Activation', current_stage: 'BGV Clearance', requester: 'u2', requested_date: '2025-06-13', sla: '5 days', priority: 'High', status: 'Pending', approver_role: 'HR Ops' }
  ],

  anomalies: [
    { id: 'an1', contractor_id: 'c8', assignment_id: 'a5', current_project: 'PRJ-101 Platform Modernization', expected_manager: 'Vikram Mehta', actual_manager: 'Sneha Patel', anomaly_type: 'Stale Reporting Manager', owner: 'u2', status: 'Assigned' },
    { id: 'an2', contractor_id: 'c5', assignment_id: null, current_project: null, expected_manager: null, actual_manager: null, anomaly_type: 'Missing Rate', owner: 'u3', status: 'Detected' },
    { id: 'an3', contractor_id: 'c2', assignment_id: 'a7', current_project: 'PRJ-104 Legacy Migration', expected_manager: 'Vikram Mehta', actual_manager: 'Vikram Mehta', anomaly_type: 'Inactive Project Assignment', owner: 'u2', status: 'Resolved' }
  ],

  mfrs: [
    { id: 'mfr1', requested_by: 'u4', role_title: 'Senior Java Developer', skills: 'Java, Spring Boot, AWS', headcount: 2, contract_duration: '9 months', urgency: 'High', status: 'Converted to Job Order', open_position_id: 'op1', created_date: '2025-03-01' },
    { id: 'mfr2', requested_by: 'u5', role_title: 'UX Designer', skills: 'Figma, User Research', headcount: 1, contract_duration: '6 months', urgency: 'Medium', status: 'In Progress', open_position_id: 'op2', created_date: '2025-04-15' },
    { id: 'mfr3', requested_by: 'u4', role_title: 'DevOps Engineer', skills: 'Kubernetes, CI/CD', headcount: 1, contract_duration: '12 months', urgency: 'Low', status: 'Raised', open_position_id: null, created_date: '2025-06-10' }
  ],

  jobOrders: [
    { id: 'jo1', open_position_id: 'op1', vendor_id: 'v1', status: 'Active', assigned_date: '2025-03-05', response_status: 'Candidates Submitted', headcount_needed: 2, candidates_submitted: 3, due_date: '2025-04-15', requested_by: 'u1' },
    { id: 'jo2', open_position_id: 'op2', vendor_id: 'v1', status: 'Active', assigned_date: '2025-04-20', response_status: 'In Progress', headcount_needed: 1, candidates_submitted: 2, due_date: '2025-06-30', requested_by: 'u1' },
    { id: 'jo3', open_position_id: 'op2', vendor_id: 'v2', status: 'Active', assigned_date: '2025-04-22', response_status: 'Pending Response', headcount_needed: 1, candidates_submitted: 0, due_date: '2025-07-01', requested_by: 'u1' },
    { id: 'jo4', open_position_id: 'op1', vendor_id: 'v1', status: 'Active', assigned_date: '2025-06-18', response_status: 'Pending Response', headcount_needed: 1, candidates_submitted: 0, due_date: '2025-07-15', requested_by: 'u1', notes: 'Urgent DevOps backfill — respond with qualified profiles' }
  ],

  vendorSowCompliance: [
    { id: 'sc1', contractor_id: 'c1', project_id: 'p1', sow_document: 'SOW-Engineering-2025.pdf', compliance_status: 'Compliant', deliverables_status: 'On Track', end_date: null, last_review: '2025-06-01', manager_feedback: 'Strong delivery on platform milestones' },
    { id: 'sc2', contractor_id: 'c2', project_id: 'p2', sow_document: 'SOW-Product-2025.pdf', compliance_status: 'Compliant', deliverables_status: 'On Track', end_date: null, last_review: '2025-05-28', manager_feedback: 'UX deliverables on schedule' },
    { id: 'sc3', contractor_id: 'c6', project_id: 'p1', sow_document: 'SOW-Engineering-2025.pdf', compliance_status: 'Review Due', deliverables_status: 'At Risk', end_date: '2025-06-30', last_review: '2025-05-15', manager_feedback: 'Exit in progress — confirm knowledge transfer' },
    { id: 'sc4', contractor_id: 'c3', project_id: 'p3', sow_document: 'SOW-Data-2025.pdf', compliance_status: 'Compliant', deliverables_status: 'On Track', end_date: null, last_review: '2025-06-10', manager_feedback: 'Data pipeline deliverables met' }
  ],

  candidates: [
    { id: 'can1', job_order_id: 'jo1', vendor_id: 'v1', name: 'Amit Joshi', email: 'amit.joshi@email.com', stage: 'Onboarded', ai_score: 92, contractor_id: 'c1', forwarded_to_manager_id: 'u4', manager_selected: true },
    { id: 'can2', job_order_id: 'jo2', vendor_id: 'v1', name: 'Meera Iyer', email: 'meera.i@email.com', stage: 'Offer Sent', ai_score: 88, contractor_id: 'c4', forwarded_to_manager_id: 'u5', manager_selected: true, interview_date: '2025-06-10' },
    { id: 'can3', job_order_id: 'jo2', vendor_id: 'v2', name: 'Karan Malhotra', email: 'karan.m@email.com', stage: 'Interview Scheduled', ai_score: 75, contractor_id: 'c5', forwarded_to_manager_id: 'u4', manager_selected: true, interview_date: '2025-06-25' },
    { id: 'can4', job_order_id: 'jo4', vendor_id: 'v1', name: 'Rajesh Kumar', email: 'rajesh.k@email.com', stage: 'Submitted', ai_score: 81, contractor_id: null, forwarded_to_manager_id: null, manager_selected: false },
    { id: 'can5', job_order_id: 'jo2', vendor_id: 'v1', name: 'Priya Nambiar', email: 'priya.n@email.com', stage: 'Forwarded to Manager', ai_score: 86, contractor_id: null, forwarded_to_manager_id: 'u5', manager_selected: false },
    { id: 'can6', job_order_id: 'jo1', vendor_id: 'v1', name: 'Vikram Desai', email: 'vikram.d@email.com', stage: 'Manager Selected', ai_score: 79, contractor_id: null, forwarded_to_manager_id: 'u4', manager_selected: true }
  ],

  interviewSchedules: [
    { id: 'int1', candidate_id: 'can3', scheduled_by: 'u2', interview_date: '2025-06-25', interview_time: '10:00 AM', mode: 'Video', interviewer: 'Vikram Mehta', status: 'Scheduled' },
    { id: 'int2', candidate_id: 'can6', scheduled_by: null, interview_date: null, interview_time: null, mode: null, interviewer: 'Vikram Mehta', status: 'Pending Schedule' }
  ],

  documents: [
    { id: 'doc1', entity_type: 'Contractor', entity_id: 'c1', document_type: 'NDA', category: 'NDA', document_name: 'NDA-Amit-Joshi.pdf', uploaded_by: 'c1', status: 'Verified', created_at: '2024-03-12', updated_at: '2024-03-12' },
    { id: 'doc2', entity_type: 'Contractor', entity_id: 'c1', document_type: 'ID Proof', category: 'Compliance', document_name: 'Aadhaar-Amit.pdf', uploaded_by: 'c1', status: 'Verified', created_at: '2024-03-14', updated_at: '2024-03-14' },
    { id: 'doc3', entity_type: 'Contractor', entity_id: 'c4', document_type: 'NDA', category: 'NDA', document_name: null, uploaded_by: null, status: 'Pending Upload', created_at: '2025-06-10', updated_at: '2025-06-10' },
    { id: 'doc4', entity_type: 'Vendor', entity_id: 'v1', document_type: 'SOW', category: 'SOW', document_name: 'SOW-Engineering-2025.pdf', uploaded_by: 'u2', status: 'Verified', created_at: '2025-01-05', updated_at: '2025-04-20' },
    { id: 'doc5', entity_type: 'Contractor', entity_id: 'c4', document_type: 'Bank Details', category: 'Compliance', document_name: null, uploaded_by: null, status: 'Rejected', rejection_reason: 'IFSC mismatch', created_at: '2025-06-08', updated_at: '2025-06-11' },
    { id: 'doc6', entity_type: 'Contractor', entity_id: 'c1', document_type: 'Tax Forms', category: 'Compliance', document_name: null, uploaded_by: null, status: 'Pending Upload', created_at: '2025-06-01', updated_at: '2025-06-01' },
    { id: 'doc7', entity_type: 'Vendor', entity_id: 'v1', document_type: 'MSA', category: 'MSA', document_name: 'MSA-Acme-2024.pdf', uploaded_by: 'u2', status: 'Verified', created_at: '2024-01-15', updated_at: '2024-01-15' },
    { id: 'doc8', entity_type: 'Vendor', entity_id: 'v1', document_type: 'SLA', category: 'SLA', document_name: 'SLA-Acme-Staffing-2025.pdf', uploaded_by: 'u2', status: 'Verified', created_at: '2024-01-15', updated_at: '2025-01-10' },
    { id: 'doc9', entity_type: 'Vendor', entity_id: 'v1', document_type: 'NDA', category: 'NDA', document_name: 'NDA-Acme-Mutual.pdf', uploaded_by: 'u2', status: 'Verified', created_at: '2024-01-12', updated_at: '2024-01-15' },
    { id: 'doc10', entity_type: 'Vendor', entity_id: 'v1', document_type: 'Insurance', category: 'Compliance', document_name: 'Insurance Certificate.pdf', uploaded_by: 'u2', status: 'Expiring Soon', created_at: '2024-07-01', updated_at: '2025-05-20' },
    { id: 'doc11', entity_type: 'Vendor', entity_id: 'v1', document_type: 'SOW', category: 'SOW', document_name: 'SOW-Product-2025.pdf', uploaded_by: 'u2', status: 'Verified', created_at: '2025-02-01', updated_at: '2025-05-28' },
    { id: 'doc12', entity_type: 'Vendor', entity_id: 'v2', document_type: 'MSA', category: 'MSA', document_name: 'MSA-TechTalent-Draft.pdf', uploaded_by: 'u2', status: 'Pending Upload', created_at: '2025-06-18', updated_at: '2025-06-18' },
    { id: 'doc13', entity_type: 'Vendor', entity_id: 'v2', document_type: 'SLA', category: 'SLA', document_name: 'SLA-TechTalent-Draft.pdf', uploaded_by: 'u2', status: 'Pending Upload', created_at: '2025-06-18', updated_at: '2025-06-18' },
    { id: 'doc14', entity_type: 'Vendor', entity_id: 'v1', document_type: 'Company Registration', category: 'Compliance', document_name: 'COI-Acme-2024.pdf', uploaded_by: 'u2', status: 'Verified', created_at: '2024-01-08', updated_at: '2024-01-08' },
    { id: 'doc15', entity_type: 'Contractor', entity_id: 'c1', document_type: 'BGV Consent', category: 'Compliance', document_name: 'BGV-Consent-Amit.pdf', uploaded_by: 'c1', status: 'Verified', created_at: '2024-03-10', updated_at: '2024-03-10' },
    { id: 'doc16', entity_type: 'Vendor', entity_id: 'v1', document_type: 'SOW', category: 'SOW', document_name: 'SOW-Data-2025.pdf', uploaded_by: 'u2', status: 'Verified', created_at: '2025-03-15', updated_at: '2025-06-10' }
  ],

  agreements: [
    { id: 'agr1', entity_type: 'Vendor', entity_id: 'v1', title: 'Master Service Agreement (MSA)', version: 3, status: 'Signed', signed_date: '2024-01-15', signed_by: ['Company', 'Acme Staffing'], esign_provider: 'DocuSign', envelope_id: 'DS-ENV-1001' },
    { id: 'agr2', entity_type: 'Contractor', entity_id: 'c1', title: 'Contractor Agreement', version: 1, status: 'Signed', signed_date: '2024-03-10', signed_by: ['Company', 'Amit Joshi'], esign_provider: 'DocuSign', envelope_id: 'DS-ENV-1002' },
    { id: 'agr3', entity_type: 'Contractor', entity_id: 'c4', title: 'Offer Letter', version: 1, status: 'Sent for Signature', signed_date: null, signed_by: [], esign_provider: 'DocuSign', envelope_id: 'DS-ENV-1003' }
  ],

  /** DocuSign envelopes for vendor agreement bundles (SLA, SOW, NDA, MSA) */
  esignEnvelopes: [
    { id: 'env1', vendor_id: 'v1', bundle: ['SLA', 'SOW', 'NDA', 'MSA'], provider: 'DocuSign', signatory: 'Ravi Menon (Authorized Signatory)', sent_at: '2024-01-10', signed_at: '2024-01-15', status: 'Signed', envelope_ref: 'DS-ENV-1001' },
    { id: 'env2', vendor_id: 'v2', bundle: ['SLA', 'SOW', 'NDA', 'MSA'], provider: 'DocuSign', signatory: 'Kavitha Rao (Authorized Signatory)', sent_at: '2025-06-18', signed_at: null, status: 'Sent for Signature', envelope_ref: 'DS-ENV-1004' }
  ],

  /** Contractor performance concern / work-verification cases */
  performanceConcerns: [
    { id: 'pc1', contractor_id: 'c8', manager_id: 'u5', flagged_date: '2025-06-18', reason: 'Suspected non-delivery — no visible output for two sprints', period: '2025-06-02 to 2025-06-13', evidence: 'No commits in repo, missed 3 standups, empty sprint board', status: 'Under Investigation', hr_owner: 'u2', findings: null, outcome: null, disputed_hours: 40, vendor_notified: false },
    { id: 'pc2', contractor_id: 'c2', manager_id: 'u5', flagged_date: '2025-05-20', reason: 'Concern raised about deliverable quality', period: '2025-05-05 to 2025-05-16', evidence: 'Rework required on 2 modules', status: 'Cleared', hr_owner: 'u2', findings: 'Work verified — deliverables present, minor rework is normal. No non-work found.', outcome: 'No Action — Cleared', disputed_hours: 0, vendor_notified: false },
    { id: 'pc3', contractor_id: 'c6', manager_id: 'u4', flagged_date: '2025-04-10', reason: 'Contractor unreachable, hours logged without output', period: '2025-04-01 to 2025-04-11', evidence: 'No submissions, unresponsive on Slack/email for 6 working days', status: 'Sustained', hr_owner: 'u2', findings: 'Contractor confirmed absent; no work product for disputed period.', outcome: 'Non-Work Sustained — Vendor Notified, Hours Blocked', disputed_hours: 48, vendor_notified: true }
  ],

  importBatches: [
    { id: 'ib1', source_file_name: 'contractor_rates_may2025.xlsx', import_type: 'Contractor Rates', total_rows: 45, success_rows: 42, failed_rows: 3, uploaded_by: 'u2', uploaded_at: '2025-05-20', status: 'Completed', errors: [
      { row: 12, field: 'reporting_manager_id', rejected_value: 'INVALID', message: 'Manager not found in system' },
      { row: 28, field: 'monthly_rate', rejected_value: '-5000', message: 'Rate must be positive' },
      { row: 33, field: 'vendor_id', rejected_value: 'VND-999', message: 'Vendor does not exist' }
    ]}
  ],

  notifications: [
    { id: 'n1', recipient_user_id: 'u4', event: 'Timesheet awaiting supervisor approval', entity_type: 'Timesheet', entity_id: 'ts2', channel: 'In-App', status: 'Sent', sent_at: '2025-06-16 09:00', nav: 'manager/timesheets', read: false },
    { id: 'n2', recipient_user_id: 'u3', event: 'Rate approval required', entity_type: 'Contractor Rate', entity_id: 'r5', channel: 'In-App', status: 'Sent', sent_at: '2025-06-12 14:30', nav: 'admin/approvals', read: false },
    { id: 'n3', recipient_user_id: 'u2', event: 'Document expiring soon', entity_type: 'Vendor Document', entity_id: 'vd3', channel: 'In-App', status: 'Sent', sent_at: '2025-06-15 08:00', nav: 'vendors/compliance', read: false },
    { id: 'n4', recipient_user_id: 'u2', event: 'Reporting anomaly detected', entity_type: 'Reporting Anomaly', entity_id: 'an1', channel: 'In-App', status: 'Sent', sent_at: '2025-06-14 11:00', nav: 'reports/anomalies', read: false },
    { id: 'n5', recipient_user_id: 'u1', event: 'New MFR received', entity_type: 'MFR', entity_id: 'mfr3', channel: 'In-App', status: 'Sent', sent_at: '2025-06-10 16:45', nav: 'taq/mfr', read: false },
    { id: 'n6', recipient_user_id: 'u1', event: '2 invoices awaiting TA approval after SOW validation', entity_type: 'Invoice', entity_id: 'inv5', channel: 'In-App', status: 'Sent', sent_at: '2025-06-18 11:20', nav: 'invoices/ta-approval', read: false }
  ],

  notificationTemplates: [
    { id: 'nt1', template_code: 'TS_CONFIRMATION', channel: 'Email', subject: 'Please confirm your timesheet hours', status: 'Active' },
    { id: 'nt2', template_code: 'RATE_APPROVAL', channel: 'Email', subject: 'Contractor Rate Pending Your Approval', status: 'Active' },
    { id: 'nt3', template_code: 'ONBOARDING_STAGE', channel: 'Email', subject: 'Onboarding Stage Update', status: 'Active' },
    { id: 'nt4', template_code: 'DOC_EXPIRY', channel: 'In-App', subject: 'Document Expiring Soon', status: 'Active' }
  ],

  auditLogs: [
    { id: 'al1', entity_type: 'Contractor Rate', entity_id: 'r2', action: 'Approved', old_value: '85000', new_value: '92000', performed_by: 'u3', performed_at: '2024-12-20 10:30' },
    { id: 'al2', entity_type: 'Assignment', entity_id: 'a5', action: 'Created', old_value: null, new_value: 'Project PRJ-101, Manager Sneha Patel', performed_by: 'u2', performed_at: '2024-11-01 09:15' },
    { id: 'al3', entity_type: 'Timesheet', entity_id: 'ts6', action: 'Rejected', old_value: 'Submitted', new_value: 'Rejected - leave/holiday mismatch', performed_by: 'u5', performed_at: '2025-06-17 11:00' },
    { id: 'al4', entity_type: 'Vendor', entity_id: 'v1', action: 'Activated', old_value: 'Pending', new_value: 'Active', performed_by: 'u3', performed_at: '2024-01-20 14:00' },
    { id: 'al5', entity_type: 'Invoice', entity_id: 'inv3', action: 'Blocked', old_value: 'Reconciling', new_value: 'Blocked - rate mismatch', performed_by: 'u3', performed_at: '2025-06-16 15:30' },
    { id: 'al6', entity_type: 'Assignment Transfer', entity_id: 'a6', action: 'Initiated', old_value: 'PRJ-101', new_value: 'PRJ-103 (pending approval)', performed_by: 'u4', performed_at: '2025-06-14 10:00' },
    { id: 'al7', entity_type: 'Contractor', entity_id: 'c4', action: 'Onboarding Stage', old_value: 'Applied', new_value: 'Docs Submitted', performed_by: 'u2', performed_at: '2025-06-13 16:00' },
    { id: 'al8', entity_type: 'Finance Batch', entity_id: 'fb1', action: 'Generated', old_value: null, new_value: 'Batch with 1 exception', performed_by: 'u3', performed_at: '2025-06-17 09:00' },
    { id: 'al9', entity_type: 'Rate Card', entity_id: 'rc1', action: 'Version Created', old_value: 'v1 ₹8,000/day', new_value: 'v2 ₹8,500/day', performed_by: 'u3', performed_at: '2024-12-20 11:00' },
    { id: 'al10', entity_type: 'Rate Card', entity_id: 'rc6', action: 'Submitted', old_value: 'Draft', new_value: 'Pending Finance Approval', performed_by: 'u2', performed_at: '2025-06-20 14:30' }
  ],

  rateCards: [
    { id: 'rc1', vendor_id: 'v1', role: 'Senior Java Developer', skills: 'Java, Spring Boot, Microservices', region: 'India - Bangalore', bill_rate: 8500, pay_rate: 7200, overtime_rate: 950, effective_from: '2025-01-01', effective_to: null, status: 'Active', approval_status: 'Approved', version: 2, margin_pct: 15.3, contractors_using: 2, approved_by: 'u3' },
    { id: 'rc2', vendor_id: 'v1', role: 'UX Designer', skills: 'Figma, User Research, Prototyping', region: 'India - Mumbai', bill_rate: 6500, pay_rate: 5500, overtime_rate: 750, effective_from: '2025-01-01', effective_to: null, status: 'Active', approval_status: 'Approved', version: 1, margin_pct: 15.4, contractors_using: 1, approved_by: 'u3' },
    { id: 'rc3', vendor_id: 'v1', role: 'Data Engineer', skills: 'Spark, Python, Airflow', region: 'India - Bangalore', bill_rate: 9000, pay_rate: 7800, overtime_rate: 1050, effective_from: '2025-01-01', effective_to: null, status: 'Active', approval_status: 'Approved', version: 1, margin_pct: 13.3, contractors_using: 1, approved_by: 'u3' },
    { id: 'rc4', vendor_id: 'v1', role: 'DevOps Engineer', skills: 'Kubernetes, Terraform, AWS', region: 'India - Bangalore', bill_rate: 9500, pay_rate: 8100, overtime_rate: 1100, effective_from: '2025-04-01', effective_to: null, status: 'Active', approval_status: 'Approved', version: 1, margin_pct: 14.7, contractors_using: 1, approved_by: 'u3' },
    { id: 'rc5', vendor_id: 'v1', role: 'QA Automation Lead', skills: 'Selenium, Cypress, API Testing', region: 'India - Mumbai', bill_rate: 7200, pay_rate: 6100, overtime_rate: 850, effective_from: '2025-01-01', effective_to: '2025-06-30', status: 'Expiring Soon', approval_status: 'Approved', version: 1, margin_pct: 15.3, contractors_using: 0, approved_by: 'u3' },
    { id: 'rc6', vendor_id: 'v2', role: 'Cloud Architect', skills: 'AWS, Azure, Solution Design', region: 'India - Bangalore', bill_rate: 12000, pay_rate: 10200, overtime_rate: 1400, effective_from: '2025-07-01', effective_to: null, status: 'Draft', approval_status: 'Pending Finance', version: 1, margin_pct: 15.0, contractors_using: 0, requested_by: 'u2', submitted_date: '2025-06-20' },
    { id: 'rc7', vendor_id: 'v2', role: 'Full Stack Developer', skills: 'React, Node.js, PostgreSQL', region: 'India - Delhi', bill_rate: 7800, pay_rate: 6600, overtime_rate: 900, effective_from: '2025-07-01', effective_to: null, status: 'Draft', approval_status: 'Pending Finance', version: 1, margin_pct: 15.4, contractors_using: 0, requested_by: 'u2', submitted_date: '2025-06-22' },
    { id: 'rc8', vendor_id: 'v1', role: 'Business Analyst', skills: 'Requirements, JIRA, Agile', region: 'India - Mumbai', bill_rate: 6800, pay_rate: 5800, overtime_rate: 800, effective_from: '2025-01-01', effective_to: null, status: 'Active', approval_status: 'Approved', version: 1, margin_pct: 14.7, contractors_using: 1, approved_by: 'u3' }
  ],

  rateCardHistory: [
    { vendor_id: 'v1', role: 'Senior Java Developer', version: 1, bill_rate: 8000, pay_rate: 6800, effective_from: '2024-01-01', superseded_on: '2024-12-31', approved_by: 'u3', reason: 'Annual revision' },
    { vendor_id: 'v1', role: 'Senior Java Developer', version: 2, bill_rate: 8500, pay_rate: 7200, effective_from: '2025-01-01', superseded_on: null, approved_by: 'u3', reason: 'Market adjustment +5%' },
    { vendor_id: 'v1', role: 'UX Designer', version: 1, bill_rate: 6500, pay_rate: 5500, effective_from: '2025-01-01', superseded_on: null, approved_by: 'u3', reason: 'Initial rate card' }
  ],

  rateCardMappings: [
    { rate_card_id: 'rc1', contractor_id: 'c1', vendor_id: 'v1', role: 'Senior Java Developer', rate_card_bill: 92000, contractor_rate: 92000, status: 'Aligned' },
    { rate_card_id: 'rc1', contractor_id: 'c3', vendor_id: 'v1', role: 'Senior Java Developer', rate_card_bill: 85000, contractor_rate: 85000, status: 'Aligned' },
    { rate_card_id: 'rc2', contractor_id: 'c5', vendor_id: 'v1', role: 'UX Designer', rate_card_bill: 55000, contractor_rate: 55000, status: 'Aligned' },
    { rate_card_id: 'rc3', contractor_id: 'c2', vendor_id: 'v1', role: 'Data Engineer', rate_card_bill: 78000, contractor_rate: 78000, status: 'Aligned' },
    { rate_card_id: 'rc1', contractor_id: 'c1', vendor_id: 'v1', role: 'Senior Java Developer', rate_card_bill: 92000, contractor_rate: 95000, status: 'Mismatch' }
  ],

  invoiceLineItems: [
    { invoice_id: 'inv1', contractor_id: 'c1', invoice_hours: 160, approved_hours: 160, invoice_rate: 92000, approved_rate: 92000, amount: 92000, match: true },
    { invoice_id: 'inv1', contractor_id: 'c2', invoice_hours: 160, approved_hours: 160, invoice_rate: 78000, approved_rate: 78000, amount: 78000, match: true },
    { invoice_id: 'inv2', contractor_id: 'c3', invoice_hours: 168, approved_hours: 168, invoice_rate: 85000, approved_rate: 85000, amount: 89250, match: true },
    { invoice_id: 'inv3', contractor_id: 'c1', invoice_hours: 160, approved_hours: 160, invoice_rate: 95000, approved_rate: 92000, amount: 95000, match: false, exception_reason: 'Rate mismatch' },
    { invoice_id: 'inv4', contractor_id: 'c5', invoice_hours: 152, approved_hours: 152, invoice_rate: 55000, approved_rate: 55000, amount: 52250, match: true },
    { invoice_id: 'inv5', contractor_id: 'c1', invoice_hours: 120, approved_hours: 120, invoice_rate: 92000, approved_rate: 92000, amount: 138000, match: true },
    { invoice_id: 'inv5', contractor_id: 'c8', invoice_hours: 120, approved_hours: 120, invoice_rate: 92000, approved_rate: 92000, amount: 138000, match: true },
    { invoice_id: 'inv6', contractor_id: 'c3', invoice_hours: 160, approved_hours: 160, invoice_rate: 85000, approved_rate: 85000, amount: 144000, match: true }
  ],

  performanceRatings: [
    { id: 'pr1', contractor_id: 'c1', manager_id: 'u4', period: '2025 Q1', quality: 4, communication: 5, delivery: 4, professionalism: 5, reliability: 5, comments: 'Strong performer, consistently delivers on time.', low_performer: false, review_status: 'Recorded' },
    { id: 'pr2', contractor_id: 'c2', manager_id: 'u5', period: '2025 Q1', quality: 3, communication: 4, delivery: 3, professionalism: 4, reliability: 3, comments: 'Good but needs improvement on delivery timelines.', low_performer: false, review_status: 'Recorded' },
    { id: 'pr3', contractor_id: 'c8', manager_id: 'u5', period: '2025 Q1', quality: 2, communication: 2, delivery: 2, professionalism: 3, reliability: 2, comments: 'Below expectations — escalation recommended.', low_performer: true, review_status: 'Recorded' }
  ],

  /** Current quarterly rating cycle */
  ratingCycle: { quarter: '2025 Q2', status: 'Open', due_date: '2025-07-15', rubric: ['Quality', 'Communication', 'Delivery', 'Professionalism', 'Reliability'] },

  config: {
    rate_types: ['Hourly', 'Daily', 'Monthly'],
    document_types: ['NDA', 'ID Proof', 'Bank Details', 'Tax Forms', 'BGV Consent', 'MSA', 'SOW', 'Insurance'],
    regions: ['India - Mumbai', 'India - Bangalore', 'India - Delhi', 'India - All'],
    approval_stages: ['Draft', 'Pending HR', 'Pending Finance', 'Approved', 'Rejected'],
    sla_settings: { vendor_onboarding: '5 days', rate_approval: '2 days', timesheet_approval: '1 day', invoice_approval: '3 days' },
    dual_approval_threshold_usd: 10000
  }
};

// Helper functions
const VMP = {
  getUser: (id) => VMP_DATA.users.find(u => u.id === id),
  getRole: (id) => VMP_DATA.roles.find(r => r.id === id),
  getVendor: (id) => VMP_DATA.vendors.find(v => v.id === id),
  getProject: (id) => VMP_DATA.projects.find(p => p.id === id),
  getContractor: (id) => VMP_DATA.contractors.find(c => c.id === id),
  getAssignment: (id) => VMP_DATA.assignments.find(a => a.id === id),
  getRate: (id) => VMP_DATA.rates.find(r => r.id === id),
  getTimesheet: (id) => VMP_DATA.timesheets.find(t => t.id === id),
  getInvoice: (id) => VMP_DATA.invoices.find(i => i.id === id),
  getBatch: (id) => VMP_DATA.financeBatches.find(b => b.id === id),

  getContractorAssignments: (cid) => VMP_DATA.assignments.filter(a => a.contractor_id === cid),
  getActiveAssignment: (cid) => VMP_DATA.assignments.find(a => a.contractor_id === cid && a.assignment_status === 'Active'),
  getContractorRates: (cid) => VMP_DATA.rates.filter(r => r.contractor_id === cid),
  getActiveRate: (cid) => VMP_DATA.rates.find(r => r.contractor_id === cid && r.approval_status === 'Approved' && !r.effective_to),
  getVendorContractors: (vid) => VMP_DATA.contractors.filter(c => c.vendor_id === vid),
  getCurrentVendorId: () => NAV_CONFIG[VMP.currentRole]?.vendorId || VMP.currentUser?.vendor_id || null,
  getVendorJobOrders: (vid) => VMP_DATA.jobOrders.filter(j => j.vendor_id === vid),
  getVendorInvoices: (vid) => VMP_DATA.invoices.filter(i => i.vendor_id === vid),
  getVendorCandidates: (vid) => VMP_DATA.candidates.filter(c => c.vendor_id === vid),
  getVendorSowCompliance: (vid) => VMP_DATA.vendorSowCompliance.filter(sc => VMP.getContractor(sc.contractor_id)?.vendor_id === vid),
  getVendorDocuments: (vid) => VMP_DATA.vendorDocuments.filter(d => d.vendor_id === vid),

  DOC_CATEGORIES: ['Compliance', 'SOW', 'SLA', 'NDA', 'MSA', 'Other'],

  docCategory: (type) => {
    const t = String(type || '').trim();
    if (t === 'MSA' || /master service/i.test(t)) return 'MSA';
    if (t === 'SOW' || /statement of work/i.test(t)) return 'SOW';
    if (t === 'SLA' || /service level/i.test(t)) return 'SLA';
    if (t === 'NDA' || /non.?disclosure/i.test(t)) return 'NDA';
    if (['Insurance', 'Company Registration', 'ID Proof', 'Bank Details', 'Tax Forms', 'BGV Consent', 'GST Certificate'].includes(t)) return 'Compliance';
    return 'Other';
  },

  /** Unified document repository rows — any submitted doc lands here. Role-scoped for mock. */
  getRepositoryDocuments: (role) => {
    const r = role || VMP.currentRole;
    const rows = VMP_DATA.documents.map(d => ({
      ...d,
      category: d.category || VMP.docCategory(d.document_type),
      created_at: d.created_at || d.updated_at || '2025-01-01',
      updated_at: d.updated_at || d.created_at || '2025-01-01'
    }));
    if (r === 'contractor') {
      const cid = VMP.currentUser?.id || 'c1';
      const c = VMP.getContractor(cid);
      const vid = c?.vendor_id || 'v1';
      return rows.filter(d =>
        (d.entity_type === 'Contractor' && d.entity_id === cid) ||
        (d.entity_type === 'Vendor' && d.entity_id === vid && ['MSA', 'SOW', 'SLA', 'NDA'].includes(d.category || VMP.docCategory(d.document_type)))
      );
    }
    if (r === 'vendor') {
      const vid = VMP.getCurrentVendorId?.() || 'v1';
      return rows.filter(d => d.entity_type === 'Vendor' && d.entity_id === vid);
    }
    if (r === 'manager') {
      const teamIds = new Set((VMP.getManagerTeam?.('u4') || []).map(c => c.id).concat(['c1', 'c2', 'c3', 'c6', 'c8']));
      return rows.filter(d =>
        (d.entity_type === 'Contractor' && teamIds.has(d.entity_id)) ||
        ['SOW', 'SLA', 'NDA', 'MSA', 'Compliance'].includes(d.category || VMP.docCategory(d.document_type))
      );
    }
    // taq / hr / finance — full repository
    return rows;
  },

  entityLabelForDoc: (d) => {
    if (d.entity_type === 'Contractor') return VMP.getContractor(d.entity_id)?.full_name || d.entity_id;
    if (d.entity_type === 'Vendor') return VMP.getVendor(d.entity_id)?.vendor_name || d.entity_id;
    return `${d.entity_type} ${d.entity_id}`;
  },
  getProjectPositions: (pid) => VMP_DATA.openPositions.filter(o => o.project_id === pid),
  getContractorTimesheets: (cid) => VMP_DATA.timesheets.filter(t => t.contractor_id === cid),
  getManagerTeam: (mid) => VMP_DATA.assignments.filter(a => a.reporting_manager_id === mid && a.assignment_status === 'Active').map(a => VMP.getContractor(a.contractor_id)).filter(Boolean),
  getVendorEnvelope: (vid) => (VMP_DATA.esignEnvelopes || []).find(e => e.vendor_id === vid),
  getContractorConcerns: (cid) => (VMP_DATA.performanceConcerns || []).filter(p => p.contractor_id === cid),
  getContractorRatings: (cid) => VMP_DATA.performanceRatings.filter(p => p.contractor_id === cid),
  getCredibility: (cid) => {
    const ratings = VMP.getContractorRatings(cid);
    const concerns = VMP.getContractorConcerns(cid);
    const sustained = concerns.filter(c => c.status === 'Sustained').length;
    const avg = ratings.length ? ratings.reduce((s, r) => s + (r.quality + r.communication + r.delivery + r.professionalism + (r.reliability || r.professionalism)) / 5, 0) / ratings.length : null;
    let standing = 'Good Standing';
    if (sustained > 0) standing = 'At Risk';
    else if (avg !== null && avg < 3) standing = 'Needs Improvement';
    else if (avg !== null && avg >= 4.2) standing = 'Trusted';
    return { avg, sustained, ratingCount: ratings.length, concernCount: concerns.length, standing };
  },
  getInvoiceBatch: (id) => (VMP_DATA.invoiceBatches || []).find(b => b.id === id),

  /** Demo "today" anchor so expiry windows are stable in the mockup */
  today: () => new Date('2025-06-18'),

  daysUntil: (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d)) return null;
    return Math.round((d - VMP.today()) / (1000 * 60 * 60 * 24));
  },

  /** Returns items (vendor contracts + documents) expiring within `days`.
   *  bucket: '30' | '60' | '90' | 'all' */
  getExpiringItems: (days = 90) => {
    const items = [];
    VMP_DATA.vendors.forEach(v => {
      const d = VMP.daysUntil(v.contract_end_date);
      if (d !== null && d <= days) items.push({ type: 'Vendor Contract', name: v.vendor_name, ref: v.vendor_code, expiry: v.contract_end_date, days: d, nav: `vendors/detail?id=${v.id}` });
    });
    VMP_DATA.vendorDocuments.forEach(doc => {
      const d = VMP.daysUntil(doc.expiry_date);
      if (d !== null && d <= days) items.push({ type: doc.document_type + ' Document', name: VMP.getVendor(doc.vendor_id)?.vendor_name, ref: doc.document_name, expiry: doc.expiry_date, days: d, nav: 'vendors/compliance' });
    });
    return items.sort((a, b) => a.days - b.days);
  },

  expiryBucket: (days) => {
    if (days === null) return '—';
    if (days < 0) return 'Expired';
    if (days <= 30) return '≤30 days';
    if (days <= 60) return '≤60 days';
    if (days <= 90) return '≤90 days';
    return '>90 days';
  },

  getContractorLeaveBalance: (cid) => {
    const c = VMP.getContractor(cid);
    return c?.leave_balance || { annual: 0, sick: 0, personal: 0 };
  },

  getPendingApprovals: (roleCode) => {
    const roleMap = { taq: 'TAQ', hr: 'HR Ops', finance: 'Finance', manager: "Contractor's Manager", vendor: 'Vendor Side Manager' };
    const roleName = roleMap[roleCode];
    return VMP_DATA.approvals.filter(a => a.status === 'Pending' && (roleCode === 'taq' || a.approver_role === roleName || (roleCode === 'hr' && a.approver_role === 'HR Ops')));
  },

  badgeClass: (status) => {
    const map = {
      'Active': 'badge-active', 'Approved': 'badge-approved', 'Pending': 'badge-pending',
      'Draft': 'badge-draft', 'Rejected': 'badge-rejected', 'Blocked': 'badge-blocked',
      'Resolved': 'badge-resolved', 'Suspended': 'badge-suspended', 'Exited': 'badge-exited',
      'Onboarding': 'badge-onboarding', 'Cleared': 'badge-cleared', 'Failed': 'badge-failed',
      'Paid': 'badge-paid', 'Pending Finance Approval': 'badge-pending',
      'Pending Transfer': 'badge-pending', 'In Progress': 'badge-pending',
      'Manager Approved': 'badge-approved', 'Submitted': 'badge-pending',
      'Validated': 'badge-pending', 'In Finance Batch': 'badge-active',
      'Reconciling': 'badge-pending', 'Vendor Approved': 'badge-approved',
      'Exceptions Flagged': 'badge-blocked', 'Detected': 'badge-pending',
      'Assigned': 'badge-pending', 'Not Started': 'badge-draft',
      'In Progress': 'badge-pending', 'Expiring Soon': 'badge-pending',
      'Vendor Approved': 'badge-approved', 'Reconciling': 'badge-pending',
      'In Finance Batch': 'badge-active', 'Manager Approved': 'badge-approved',
      'Submitted': 'badge-pending', 'Success': 'badge-approved', 'Failed': 'badge-rejected',
      'Completed': 'badge-approved', 'Converted to Job Order': 'badge-approved',
      'Open': 'badge-active', 'Filled': 'badge-approved', 'Interview Scheduled': 'badge-pending',
      'Interview Complete': 'badge-pending', 'Forwarded to Manager': 'badge-pending', 'Manager Selected': 'badge-approved',
      'Offer Sent': 'badge-pending', 'Onboarded': 'badge-approved', 'Raised': 'badge-pending',
      'Compliant': 'badge-approved', 'Pending Review': 'badge-pending',
      'Non-Compliant': 'badge-rejected', 'Pending Finance Approval': 'badge-pending',
      'Expiring Soon': 'badge-pending', 'Aligned': 'badge-approved', 'Mismatch': 'badge-blocked',
      'Ready for Review': 'badge-pending', 'Pending Response': 'badge-pending',
      'Candidates Submitted': 'badge-approved', 'On Track': 'badge-approved', 'At Risk': 'badge-blocked',
      'Review Due': 'badge-pending', 'Compliant': 'badge-approved',
      'Pending Signature': 'badge-pending', 'High': 'badge-blocked', 'Medium': 'badge-pending', 'Low': 'badge-draft',
      'Signed': 'badge-approved', 'Sent for Signature': 'badge-pending', 'Passed': 'badge-approved',
      'Under Investigation': 'badge-pending', 'Sustained': 'badge-rejected', 'Flagged': 'badge-blocked',
      'Confirmed': 'badge-approved', 'Recorded': 'badge-approved', 'HR Reviewed': 'badge-approved',
      'Scheduled': 'badge-active', 'Released': 'badge-approved', 'Remittance Sent': 'badge-approved',
      'Not Started': 'badge-draft', 'Service Confirmation': 'badge-pending', 'Reconciliation Exception': 'badge-blocked',
      'Approved & Eligible for Payment': 'badge-approved', 'Good Standing': 'badge-active',
      'Trusted': 'badge-approved', 'At Risk': 'badge-rejected', 'Needs Improvement': 'badge-pending',
      'Eligible': 'badge-approved', 'Missing': 'badge-blocked', 'Ready for Batch': 'badge-active',
      'SOW Validation': 'badge-pending', 'TA Approval': 'badge-pending', 'Finance Processing': 'badge-active',
      'Validated': 'badge-approved', 'Disputed': 'badge-rejected', 'Disbursed': 'badge-paid',
      'Ending Soon': 'badge-pending', 'Processing': 'badge-active', 'Withdrawn': 'badge-draft',
      'Not Started': 'badge-draft',
      'Awaiting Supervisor': 'badge-pending', 'Supervisor Approved': 'badge-approved', 'HR Approved': 'badge-approved',
      'Awaiting HR': 'badge-pending', 'In Payment Batch': 'badge-active', 'Submitted': 'badge-active',
      'Finance Reviewed': 'badge-approved', 'Expired': 'badge-rejected', 'Renewal Due': 'badge-pending',
      '≤30 days': 'badge-rejected', '≤60 days': 'badge-blocked', '≤90 days': 'badge-pending', '>90 days': 'badge-approved'
    };
    return map[status] || 'badge-draft';
  },

  formatCurrency: (amount, currency = 'INR') => {
    if (currency === 'INR') return '₹' + amount.toLocaleString('en-IN') + ' INR';
    if (currency === 'USD') return '$' + amount.toLocaleString('en-US') + ' USD';
    return currency + ' ' + amount.toLocaleString('en-US');
  },

  formatDate: (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',

  entityLink: (type, id, label) => `<span class="entity-link" data-nav="${type}/${id}">${label}</span>`,

  nextId: (prefix, items) => {
    let max = 0;
    items.forEach(i => {
      const m = String(i.id || '').match(new RegExp('^' + prefix + '(\\d+)$'));
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return prefix + (max + 1);
  },

  addAuditLog: (entity_type, entity_id, action, old_value, new_value) => {
    VMP_DATA.auditLogs.unshift({
      id: 'al' + Date.now(), entity_type, entity_id, action,
      old_value, new_value, performed_by: VMP.currentUser?.id || 'system',
      performed_at: new Date().toISOString().slice(0, 16).replace('T', ' ')
    });
    VMP._lastAudit = { entity_type, entity_id, action };
  },

  /** Map entity type (+ optional id) to a deep-link hash path for notification clicks. */
  navForEntity: (entity_type, entity_id) => {
    const map = {
      'Timesheet': 'timesheets/review',
      'Contractor Rate': 'admin/approvals',
      'Rate Card': 'finance/rate-cards',
      'Vendor Document': 'vendors/compliance',
      'Document': 'shared/documents',
      'Reporting Anomaly': 'reports/anomalies',
      'MFR': 'taq/mfr',
      'Invoice': entity_id ? `invoices/detail?id=${entity_id}` : 'invoices/register',
      'Vendor Payment': entity_id ? `invoices/detail?id=${entity_id}` : 'vendor/invoices',
      'Candidate': 'hr/candidates',
      'Interview': 'hr/interviews',
      'Leave': 'contractor/leave',
      'Performance Concern': 'hr/performance-concerns',
      'Assignment': 'assignments/list',
      'Assignment Transfer': 'assignments/transfer',
      'Vendor': 'vendors/list',
      'Contractor': entity_id ? `contractors/profile?id=${entity_id}` : 'contractors/list',
      'Finance Batch': entity_id ? `finance/batch-detail?id=${entity_id}` : 'finance/batches',
      'Approval': 'admin/approvals'
    };
    if (entity_type === 'Timesheet' && VMP.currentRole === 'manager') return 'manager/timesheets';
    if (entity_type === 'Timesheet' && VMP.currentRole === 'contractor') return 'contractor/timesheet';
    if (entity_type === 'Timesheet' && VMP.currentRole === 'finance') return 'finance/timesheet-review';
    if (entity_type === 'Invoice' && VMP.currentRole === 'vendor') {
      return entity_id ? `invoices/detail?id=${entity_id}` : 'invoices/register';
    }
    return map[entity_type] || null;
  },

  unreadNotificationCount: () => VMP_DATA.notifications.filter(n => !n.read).length,

  addNotification: (event, opts = {}) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const entity_type = opts.entity_type || null;
    const entity_id = opts.entity_id || null;
    const currentPath = (location.hash || '').replace(/^#/, '') || (NAV_CONFIG?.[VMP.currentRole]?.dashboard) || 'dashboard/main';
    const nav = opts.nav || VMP.navForEntity(entity_type, entity_id) || currentPath;
    VMP_DATA.notifications.unshift({
      id: 'n' + Date.now(),
      recipient_user_id: opts.recipient_user_id || VMP.currentUser?.id || null,
      event,
      entity_type: entity_type || 'Activity',
      entity_id: entity_id || '—',
      channel: 'In-App',
      status: 'Sent',
      sent_at: now,
      nav,
      read: false
    });
    if (typeof NotifUI !== 'undefined') NotifUI.refresh();
    else VMP.updateNotifBadge();
  },

  updateNotifBadge: () => {
    const el = document.getElementById('notif-count') || document.querySelector('.notif-count');
    if (!el) return;
    const count = VMP.unreadNotificationCount();
    el.textContent = count > 99 ? '99+' : String(count);
    el.style.display = count > 0 ? 'flex' : 'none';
  },

  showToast: (msg, opts) => {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
    // Mirror triggered actions into the notification bar (skip if opts.silent)
    if (!opts || opts.silent !== true) {
      const last = VMP._lastAudit || {};
      VMP.addNotification(msg, {
        entity_type: opts?.entity_type || last.entity_type,
        entity_id: opts?.entity_id || last.entity_id,
        nav: opts?.nav,
        recipient_user_id: opts?.recipient_user_id
      });
    }
  },

  currentRole: null,
  currentUser: null
};

if (typeof module !== 'undefined') module.exports = { VMP_DATA, VMP };
