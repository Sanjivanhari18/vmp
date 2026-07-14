# Primary Workflows (Easy)

Plain-text version of all workflows in `PRIMARY-WORKFLOWS.md`. Each step is written as **Actor - Action**, linked with `->`. For the visual version (cloud → square box → circle), open `PRIMARY-WORKFLOWS.md` and use Markdown preview.

V1 scope: foundational platform and operational spine (vendor → contractor → assignment → timesheet → invoice approval → pay). Vendor agreement e-sign (SLA, SOW, NDA, MSA via DocuSign), contractor performance concern flagging, and quarterly contractor ratings are in scope. Hiring orchestration beyond MFR intake, bulk import, and contractor offer e-sign are deferred to `FUTURE-WORKFLOWS.md`.

---

## Platform

### User & Role Management (System Admin)

TAQ / System Admin - Create User -> TAQ / System Admin - Assign Role & Permissions -> User - Login via RBAC Portal -> System - Enforce Role-Scoped Screen Access

---

### Central Approval Queue

Requester - Submit Entity for Approval -> System - Route to Approver Role -> Approver - Review Request -> Approver - Approve or Reject -> System - Record Audit Log Entry

_Routing: Vendor → Finance · Rate Card → Finance · Contractor Rate → Finance · Transfer → HR · MFR → TAQ · Invoice → Project Manager / Finance_

---

### Audit Log & Notifications

System - Trigger Workflow Event -> System - Send Notification -> System - Record Immutable Audit Log Entry

---

### Document Repository

User - Upload Document -> HR / System - Verify Document -> System - Store with Version History -> System - Track Expiry

---

## Master Data

### Vendor Registration, Onboarding & Compliance

HR - Initiate Vendor Registration -> HR - Enter Company Details -> HR - Upload Compliance Documents -> HR - Set SLA Terms -> HR / Legal - Send SLA, SOW, NDA & MSA via DocuSign -> Vendor - Sign Agreements via DocuSign -> System - Record DocuSign Status & Store Signed Copies -> HR / Finance - Verify Documents (Including Signed Agreements) -> System - Track Expiry -> System - Alert on Expiring Documents -> HR - Run Compliance Check -> HR - Submit for Approval -> Finance - Approve Vendor -> System - Activate Vendor -> HR - Provision Vendor Portal Access

---

### Rate Card Lifecycle

HR / Vendor - Draft Rate Card -> Vendor - Negotiate Bill/Pay Rates -> HR - Submit for Finance Approval -> Finance - Approve Rate Card -> System - Activate Rate Card -> System - Supersede Old Version

---

### Holiday Calendar Management

HR - Add Holiday to Calendar -> HR - Import Regional Calendar -> System - Apply Holiday Rules to Timesheet Validation

---

## People

### Contractor Onboarding & Activation

**Entry (choose one):**
- **HR-initiated:** HR - Enter Basic Info -> HR - Select Vendor, Project & Reporting Manager -> HR - Capture Engagement Terms (Project Name, Pay Rate, Start/End Dates, FTE Conversion Eligibility)
- **Vendor-initiated:** HR / Vendor - Register Contractor as Applied -> HR - Capture Engagement Terms (Project Name, Pay Rate, Start/End Dates, FTE Conversion Eligibility)

**Required engagement information (captured before onboarding proceeds):** project name, contractor pay rate (and bill rate where applicable), assignment start date, contract/assignment end date, and whether conversion to FTE is possible at the end of tenure.

**Common pipeline:**
Contractor - Upload Documents to HR -> HR - Initiate BGV -> Contractor - Provide BGV Consent & Documents -> HR - Upload BGV Report -> HR - Verify & Mark BGV Cleared -> HR - Send Offer (Including Project, Rates, Tenure & FTE Conversion Terms) -> Contractor - Sign Offer -> HR - Create Assignment (Draft/Pending) -> HR - Create Contractor Rate -> System - Validate Assignment & Rate Card Alignment -> HR - Submit Rate for Finance Approval -> Finance - Approve Rate -> System - Activate Assignment -> System - Activate Contractor

---

### Project Assignment

HR - Select Contractor -> HR - Assign to Project -> HR - Set Reporting Manager -> HR - Set Allocation & Start Date -> HR - Approve Assignment -> System - Activate Assignment

_Note: New contractors receive their first assignment during onboarding. Use this workflow for reassignment outside of a formal transfer._

---

### Assignment Transfer

Manager / HR - Initiate Transfer -> Manager / HR - Select New Project & Reporting Manager -> Manager / HR - Submit for Approval -> HR - Approve Transfer -> System - Close Old Assignment -> System - Open New Assignment -> System - Notify Stakeholders -> HR - Clear Reporting Anomaly

---

### Contractor Exit / Deboarding

System / HR - Trigger End Date -> Vendor - Initiate Exit Coordination -> HR - Run Exit Checklist -> IT - Revoke Access -> Finance - Close Final Timesheet & Invoice -> HR - Complete Exit & Archive Contractor Record -> System - Notify Stakeholders

---

## Operations

### Manpower Request (MFR) Intake

Manager - Draft MFR -> Manager - Submit MFR for Approval -> Business / Finance - Approve or Reject MFR -> TAQ - Receive & Review MFR -> TAQ - Convert MFR to Job Order -> TAQ - Create Open Position

_V1 note: Open positions are for planning and tracking demand. Contractors enter the system via Contractor Onboarding (HR- or vendor-initiated), not through the full hiring orchestration pipeline._

---

### Contractor Leave Request

Contractor - Submit Leave Request -> Manager - Approve or Reject Leave -> System - Sync Leave to Timesheet Validation

---

### Timesheet Submission & Confirmation

Contractor - Upload Timesheet File (CSV/Excel) or Enter Weekly Hours -> System - Parse & Extract Daily Hours -> System - Run Holiday/Leave Cross-Check (flags only) -> System - Send Confirmation Email to Contractor (CC Reporting Manager) -> Contractor - Confirm Yes or No via Email Link -> System - Record Confirmation Status -> Manager - View Confirmed / Rejected Status in Portal (read-only) -> Finance - Include Confirmed Hours in Payment Batch (downstream)

---

### Reporting Anomaly Detection & Resolution

System - Detect Anomaly (Stale Manager, Missing Rate, Inactive Project Assignment) -> HR / Finance - Assign Owner -> Owner - Investigate & Resolve -> System - Mark Anomaly Resolved

---

### Contractor Performance Concern & Work Verification

Manager - Flag Contractor for Performance Concern (Reason, Period, Evidence) -> System - Notify HR Operations & Record Flag -> HR Operations - Connect with Contractor & Review Work (Deliverables, Artefacts, Online Submissions) -> HR Operations - Record Investigation Findings -> Manager - Review Findings & Confirm Outcome -> HR Operations - Notify Vendor Manager (No Payment for Unworked Hours) if sustained -> Finance - Adjust or Block Disputed Timesheet Hours -> System - Record Case Outcome on Contractor Credibility Record

_Note: Use when a manager suspects a contractor is not performing or not working the hours claimed. HR Operations investigates before any payment adjustment. Sustained non-work outcomes are shared with the vendor manager and reflected on the contractor credibility record._

---

### Contractor Quarterly Performance Rating

System - Open Quarterly Rating Cycle -> Manager - Rate Contractor on Rubric (Quality, Communication, Delivery, Professionalism, Reliability) -> Manager - Submit Rating & Comments -> HR Operations - Review Rating for Completeness -> System - Store Rating on Contractor Credibility Record -> HR / TAQ - Use Rating History for Project Assignment & Transfer Decisions

_Note: Ratings run every quarter and build a credibility record that travels with the contractor across projects and managers. Rating history informs reassignment, transfer, and vendor feedback._

---

## Money

### Contractor Rate Lifecycle

HR - Create Contractor Rate -> System - Validate Assignment & Rate Card Alignment -> HR - Submit for Finance Approval -> Finance - Approve Rate -> System - Activate Rate -> System - Lock Version (Immutable)

_Note: During onboarding, assignment is created in Draft/Pending before rate submission. Rate activation and assignment activation occur together after Finance approval._

---

### Finance Payment Batch

Finance - Generate Batch from Contractor-Confirmed Timesheets -> System - Validate Assignment, Rate & Reporting Manager -> System - Flag Exceptions (Blocked Lines) -> Finance - Review & Remove Blocked Lines -> Finance - Approve Batch -> System - Mark Batch Ready for Invoicing

---

### Invoice Approval

Vendor / Finance - Submit or Upload Invoice -> Finance - Perform Invoice Completeness & Compliance Check -> System - Reconcile Invoice Against Approved Payment Batch and PO/SOW -> Finance / Vendor - Resolve Reconciliation Exceptions -> Project Manager - Confirm Services and Approved Hours -> Budget Owner - Approve Invoice Charge -> Finance - Approve or Reject Invoice -> Finance - Run Dual Approval (when threshold or policy requires) -> System - Mark Invoice Approved and Eligible for Payment

_Control note: The requester/uploader, service confirmer, budget approver, and Finance approver must be separate people where staffing permits. Any segregation-of-duties exception requires documented Finance Head approval._

---

### Invoice Payment & Settlement

Finance - Schedule Approved Invoice for Payment -> Finance - Generate Payment File / Bank Instruction -> Finance / Treasury - Approve and Release Payment -> System - Mark Invoice and Batch Paid -> System - Send Remittance Advice to Vendor
