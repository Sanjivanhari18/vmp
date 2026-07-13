# Future Workflows

Deferred enhancements beyond V1 primary scope. These extend hiring orchestration, vendor collaboration, operational efficiency, and compliance depth. See `PRIMARY-WORKFLOWS.md` for the build-first operational spine.

---

### End-to-End Hiring Orchestration (Hire to Pay)

Manager - Raise Manpower Request (MRF) -> TAQ - MRF Intake & Review -> TAQ - Create Open Position -> TAQ - Post Job Order to Vendor -> Vendor - Shortlist from Bench -> Vendor - Submit Candidate Profiles to TAQ -> TAQ - Route Profiles to Manager -> Manager - Review Candidate Profile -> Manager - Select Candidate -> HR - Schedule Interview -> HR - Conduct Interview -> HR - Send Offer -> HR - Start Contractor Onboarding -> Finance - Approve Contractor Rate -> HR - Create Assignment -> Contractor - Upload Timesheet & Confirm Hours -> System - Record Confirmation (Manager CC'd) -> Finance - Generate Payment Batch -> Finance - Upload & Reconcile Invoice -> Vendor - Approve Payment -> Finance - Export Payment

---

### Post Position to Vendor (Job Order)

TAQ - Approve MRF -> TAQ - Create Open Position -> TAQ - Select Approved Vendors -> TAQ - Issue Job Order -> Vendor - Receive Job Order -> Vendor - Shortlist Candidates from Bench -> Vendor - Submit Profiles to TAQ

---

### Candidate Routing (TAQ Orchestration)

Vendor - Submit Candidate Profile -> TAQ - Review Profile & AI Score -> TAQ - Forward Profile to Hiring Manager -> Manager - Review Profile -> Manager - Select Candidate or Mark Not Needed -> HR - Schedule Interview (if selected)

---

### HR Candidate Pipeline (Post-Manager Selection)

Manager - Select Candidate -> HR - Schedule Interview -> HR - Conduct Interview -> HR - Send Offer -> HR - Hand Off to Onboarding Pipeline

---

### Interview Scheduling

Manager - Select Candidate -> HR - Schedule Interview (Date, Time, Mode) -> Manager - Conduct Interview as Interviewer -> HR - Record Feedback -> HR - Send Offer

---

### Vendor Candidate Submission

Vendor - Receive Job Order -> Vendor - Shortlist from Bench -> Vendor - Submit Candidate Profile to TAQ -> TAQ - Route to Manager -> Manager - Select Candidate -> HR - Schedule Interview

---

### Vendor Onboarding & Offboarding Coordination (Vendor View)

Vendor - Coordinate Docs to HR -> HR - Run BGV -> HR - Send Offer -> Contractor - Become Active on Project -> System - Trigger End Date -> Vendor - Initiate Exit Coordination -> HR - Complete Offboarding -> System - Archive Contractor Record

---

### SOW Compliance & Deliverables

Vendor - Sign SOW -> Contractor - Deliver on Project -> Manager - Review Deliverables & Provide Feedback -> Vendor - Run Compliance Check -> Vendor - Plan Renewal or Exit

---

### Timesheet Bulk Import (Finance)

Finance - Upload Timesheet File -> System - Validate Rows & Parse Hours -> System - Run Leave/Holiday Cross-Check -> System - Trigger Confirmation Email per Contractor (CC Manager) -> Contractor - Confirm Yes or No -> System - Record Outcome -> Finance - Add Confirmed Rows to Payment Batch

---

### Contractor Performance Rating

_Moved to V1 primary scope — see **Contractor Quarterly Performance Rating** in `PRIMARY-WORKFLOWS.md`._

---

### Data Import

HR / TAQ - Upload Excel File -> System - Validate All Rows -> System - Import Successful Rows -> HR - Review Failed Rows -> HR - Re-upload Corrected File

---

### Digital Agreements (E-Sign)

User - Create Digital Agreement -> Parties - Sign Agreement -> System - Store Signed Version


