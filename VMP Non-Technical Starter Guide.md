# Vendor Management Platform (VMP)  
## Non-Technical Starter Guide

This document is for anyone who needs to understand **what VMP is for**, **who does what**, and **the rules the system lives by** — without technical detail, process maps, or implementation specs.

Use it as the first read before diving into detailed materials.

---

## 1. What VMP is

VMP is the company’s **Vendor Management Platform** for contingent (contractor) workforce.

It is the single place to:

- Bring **vendors** on board and keep them compliant  
- Onboard **contractors** and place them on projects  
- Capture and confirm **hours worked**  
- Approve **rates, invoices, and payments**  
- Track **performance and credibility**  
- Keep a trustworthy **record of every important decision**

In short: **vendor → contractor → assignment → hours → invoice → pay**, with clear ownership and controls at every step.

---

## 2. Why it exists

Without a platform like this, contractor work tends to live in email, spreadsheets, and disconnected tools. That creates risk around:

- Who is allowed to work for us  
- Whether rates and agreements are current and approved  
- Whether hours claimed are real and confirmed  
- Whether invoices match what we agreed to pay  
- Whether the right people approved money and people decisions  

VMP exists so those answers are **consistent, auditable, and owned by the right roles**.

---

## 3. Who uses VMP (roles)

| Role | Main responsibility |
|------|---------------------|
| **TAQ / System Admin** | User access, roles, permissions; overall platform ownership; manpower request intake on the TAQ side |
| **HR Operations** | Vendors, contractors, onboarding, documents, leave, transfers, exits, performance investigations |
| **Finance** | Rates, payment batches, invoices, reconciliation, payment release |
| **Contractor’s Manager** | Manpower requests, timesheet visibility, performance flags and ratings, assignment context |
| **Contractor** | Own documents, leave, timesheet submission and confirmation |
| **Vendor** (portal access after activation) | Commercial collaboration, agreements, candidate/contractor coordination as allowed |
| **Legal / Compliance** | Agreements, compliance checks, background verification clearance, sanctions / risk review |
| **IT** | Access revocation at exit |
| **Treasury** (with Finance) | Payment release where dual control is required |
| **Budget Owner / Project Manager** | Confirm services and charges on invoices; own project assignment context |

People only see and do what their **role allows**. Access is granted on a least-privilege basis.

---

## 4. What the platform does (functions)

Think of VMP as six connected areas of business function.

### A. Platform foundations

- **Users & access** — create people in the system, assign roles, enforce who can see and act on what  
- **Approvals** — route important requests to the right approver; record approve / reject with comments  
- **Audit & notifications** — every material event is recorded permanently and relevant people are notified  
- **Documents** — store, verify, version, and track expiry of compliance and commercial documents  

### B. Vendors & commercial footing

- Register and onboard vendors  
- Collect and verify compliance documents (tax IDs, insurance, bank proof, etc.)  
- Capture and sign commercial agreements (SLA, SOW, NDA, MSA)  
- Run compliance checks before activation  
- Maintain **rate cards** (bill / pay rates by role, location, period)  
- Maintain **holiday calendars** used when validating timesheets  

### C. People & assignments

- Onboard contractors (HR-initiated or vendor-initiated)  
- Capture engagement terms before work starts: project, pay/bill rates, start/end dates, FTE conversion eligibility  
- Complete background verification (BGV) and mark clearance  
- Send and accept offers  
- Create and activate assignments and contractor rates  
- Reassign or **transfer** contractors between projects / managers  
- Run **exit / deboarding** (checklist, access revoke, final money close-out, archive)  

### D. Demand & day-to-day operations

- **Manpower Request (MFR)** intake for planning demand (open positions for tracking; full hire-to-pay orchestration is a later phase)  
- **Leave** requests with manager approval, linked to timesheet validation  
- **Timesheets** — submit hours, validate against leave/holidays, contractor confirmation (manager kept informed)  
- **Reporting anomalies** — e.g. stale manager, missing rate, inactive assignment — assigned to an owner until resolved  
- **Performance concerns** — investigate suspected non-work or poor delivery before any pay impact  
- **Quarterly ratings** — build a credibility record that travels with the contractor  

### E. Money

- Maintain **contractor rates** aligned to approved rate cards (versions are locked once active)  
- Build **payment batches** from confirmed hours  
- Receive and check **invoices**, reconcile to approved batches and commercial terms  
- Approve invoices (with dual approval when policy/threshold requires)  
- Schedule and release **payment**, then send remittance advice  

### F. Assistance that does not replace judgment

The platform can help people work faster by:

- Reading documents and filling structured fields for review  
- Highlighting mismatches on invoices and timesheets  
- Summarizing what changed before an approval  
- Flagging unusual patterns for a human to investigate  

**Assistance never replaces approval.** Money movement and people decisions stay with humans and fixed rules.

---

## 5. The big picture spine (in plain language)

Everything important connects in this order:

1. **Vendor** is compliant, signed, and Finance-approved → active  
2. **Demand** may be recorded via MFR / open position (planning)  
3. **Contractor** is onboarded with terms, BGV, offer, rate, and assignment  
4. Contractor works on an **assignment** under a reporting manager  
5. **Hours** are submitted and **confirmed**  
6. Finance builds a **batch** from confirmed hours  
7. **Invoice** is checked and reconciled, then approved  
8. **Payment** is released under dual control where required  

Side paths that matter equally:

- **Transfers** close the old assignment and open the new one under HR approval  
- **Exit** closes access, final timesheets/invoices, and archives the record  
- **Performance / ratings** affect credibility and may affect pay only after investigation and human decision  

---

## 6. Non-negotiable rules

These rules apply across the whole system. They are not optional features.

### Access & duty of care

1. **Least privilege** — people get only the access their role needs.  
2. **Requester and approver must be different people.**  
3. **Segregation of duties (SoD)** applies especially to money: the person who uploads/requests, the person who confirms services, the budget approver, and the Finance approver should be separate where staffing allows. Any exception needs documented Finance Head approval.  
4. Accepting a system suggestion does **not** bypass SoD — you still count as one of the required separate approvers.

### Approvals & money

5. **No automatic approval** of vendors, rates, invoices, or payments.  
6. **Finance owns vendor activation, rate cards, contractor rates, batches, invoices, and payment release** (with other roles confirming their part).  
7. **HR owns transfers** and people lifecycle controls (with Finance when rates change).  
8. Payment release uses **maker–checker** style dual control where required.  
9. Only **confirmed** hours feed payment batches. Blocked or disputed lines stay out until resolved.  
10. Invoices must **reconcile** to the approved payment batch and commercial terms (PO/SOW) before they are eligible for payment.

### People & compliance

11. A vendor is not active until documents, signed agreements, compliance check, and **Finance approval** are complete.  
12. A contractor is not active until BGV is cleared (by a human), the offer is accepted, the rate is Finance-approved, and the assignment is activated.  
13. **BGV, sanctions, and compliance hits are surfaced for humans to clear — never auto-cleared.**  
14. Documents have owners, issue/expiry dates, and renewal alerts; expired critical documents are a business risk, not a paperwork detail.  
15. Rate versions do not overlap; once a rate is active, the approved version is **locked** (immutable). New rates supersede old ones with a clear effective date.

### Timesheets, leave & holidays

16. Holiday and leave checks are **rule-based** (not discretionary guesses).  
17. The contractor must **confirm** submitted hours; the manager is informed and can see status.  
18. Leave approved by the manager feeds timesheet validation.

### Performance & credibility

19. Performance concerns require **HR investigation** before any payment adjustment or vendor notification of sustained non-work.  
20. The system never decides alone that someone “did not work” or auto-adjusts pay.  
21. Quarterly ratings build a **credibility record** used for future assignment and transfer decisions; they are reviewed for completeness by HR.  
22. Anything that can affect a person’s credibility or pay is treated as sensitive and requires human ownership.

### Records

23. Material actions produce an **immutable audit entry** (who, what, when, decision, comments). Audit history is not rewritten.  
24. Stakeholders are notified of material events; silence is not the default for activation, transfer, exit, or pay outcomes.

---

## 7. Who approves what (approval map)

| What is being approved | Goes to |
|------------------------|---------|
| Vendor activation | Finance |
| Rate card | Finance |
| Contractor rate | Finance |
| Assignment transfer | HR |
| Manpower request (MFR) | Business / Finance, then TAQ |
| Invoice | Project Manager / Budget Owner and Finance (dual when required) |
| Leave | Reporting Manager |
| Payment release | Finance / Treasury (dual control when required) |

Approvers review completeness, policy fit, and supporting evidence — then approve or reject with a clear reason.

---

## 8. Information that must exist before work can proceed

These are business prerequisites, not “nice to have.”

### For a vendor

- Legal company identity and contacts  
- Tax and bank details with proof  
- Compliance document pack with validity dates  
- Signed SLA, SOW, NDA, and MSA  
- Compliance clearance and Finance approval  

### For a contractor engagement

- Active vendor and project context  
- Reporting manager  
- Project name, pay rate (and bill rate where applicable)  
- Start and end dates  
- Whether conversion to FTE is possible at end of tenure  
- Required personal/compliance documents  
- BGV consent, report, and human clearance  
- Signed offer including project, rates, tenure, and FTE terms  
- Rate aligned to an approved rate card  
- Finance-approved contractor rate  

### For hours to be paid

- Active assignment and active rate  
- Valid reporting manager relationship  
- Hours submitted and **contractor-confirmed**  
- Leave/holiday conflicts reviewed  
- No open blocking anomaly or sustained performance hold on those hours  

### For an invoice to be paid

- Approved payment batch from confirmed hours  
- Invoice completeness and compliance check  
- Reconciliation to batch and commercial terms  
- Project Manager confirmation of services/hours  
- Budget owner and Finance approvals (and dual approval if required)  

---

## 9. Key business concepts (glossary)

| Term | Meaning |
|------|---------|
| **Vendor** | The staffing / services company supplying contractors |
| **Contractor** | The individual contingent worker |
| **Assignment** | The live link of a contractor to a project, manager, allocation, and dates |
| **Transfer** | Closing one assignment and opening another (new project and/or manager) |
| **Rate card** | Vendor-level commercial rate schedule (bill/pay by role, location, period) |
| **Contractor rate** | The approved rate for a specific contractor assignment; version-locked when active |
| **MFR** | Manpower Request — formal demand for contingent capacity |
| **Open position** | Planning record of approved demand (V1 tracking; not full hiring pipeline) |
| **BGV** | Background verification |
| **Timesheet confirmation** | Contractor attests that submitted hours are correct |
| **Payment batch** | Finance grouping of confirmed hours ready for invoicing |
| **Reconciliation** | Matching invoice lines to the approved batch and commercial terms |
| **Credibility record** | History of ratings and sustained performance outcomes that travels with the contractor |
| **SoD** | Segregation of duties — critical steps split across separate people |
| **Immutable audit log** | Permanent, non-editable record of material actions and decisions |

---

## 10. Documents & agreements that matter

| Document / agreement | Why it matters |
|----------------------|----------------|
| GST / PAN / tax IDs | Vendor identity and tax compliance |
| Insurance & registration | Risk and regulatory footing |
| Bank proof | Correct payment destination |
| **MSA** | Master services agreement |
| **SLA** | Service levels and escalation |
| **SOW** | Scope of work / commercial scope |
| **NDA** | Confidentiality |
| Offer letter | Contractor terms: project, rates, tenure, FTE conversion |
| BGV report & consent | Clearance to engage the person |
| Timesheet files | Source of claimed hours |
| Invoice | Vendor claim for payment |
| Remittance advice | Proof/notice of payment to vendor |

Documents are verified, versioned, and tracked for expiry. Signed commercial agreements are stored as the official copies.

---

## 11. What “good” looks like in V1

First version focuses on the **operational spine** and the controls around it:

- Vendor onboarding with signed agreements and Finance activation  
- Contractor onboarding with BGV, offer, rate, and assignment activation  
- Assignment, transfer, and exit  
- Leave and timesheet confirmation  
- Performance concern investigation and quarterly ratings  
- Finance batch → invoice approval → payment  
- Central approvals, documents, audit, and role-based access  
- MFR intake for demand tracking  

**Intentionally later (not required to start operating the spine):**

- Full hire-to-pay orchestration (job orders to vendors, candidate routing, interview pipeline)  
- Bulk data import at scale  
- Deeper predictive / matching / sanctions automation beyond what humans already clear  

Ship a lean, trustworthy core first; add depth once the rules and ownership are proven in use.

---

## 12. How smart assistance is used (plain language)

Assistance is allowed to **extract, draft, summarize, and flag**. It is not allowed to **decide**.

Allowed examples:

- Pull key fields from uploaded documents into a form for human review  
- Explain why an invoice does not match the approved batch  
- Help contractors submit hours and surface soft mismatches  
- Give approvers a short “what changed / what’s unusual” summary  
- Later: help interpret BGV reports, draft MFRs/offers, benchmark rates, shortlist candidates, screen adverse media — always with human clearance  

Hard stops:

- No AI-only approval of vendors, rates, invoices, or payments  
- No auto-clearing of BGV, compliance, or sanctions  
- No auto-blocking or adjusting pay from a model alone  
- No rewriting of the audit log  
- Low-confidence results fall back to manual entry — the system should not guess  

Every accepted or overridden suggestion remains attributable to a person and stays in the audit trail.

---

## 13. Ownership at a glance

| Domain | Primary owner | Must also involve |
|--------|---------------|-------------------|
| Access & roles | TAQ / System Admin | Security / System Owner |
| Vendors & documents | HR | Finance, Legal, Compliance |
| Rate cards & contractor rates | HR (draft) | Finance (approve) |
| Onboarding & BGV | HR | Compliance, Finance (rate) |
| Assignments & transfers | HR | Managers; Finance if rate impact |
| Leave & timesheets | Contractor + Manager | Finance (downstream pay) |
| Performance & ratings | Manager + HR | Vendor (when outcome sustained); Finance (pay impact) |
| Batches, invoices, pay | Finance | Project Manager, Budget Owner, Treasury |
| Audit & compliance evidence | System (record) | Compliance / Internal Audit (review) |

---

## 14. How to use this guide

- **New stakeholder** — read sections 1–7 and 13 first.  
- **Policy / control owner** — focus on sections 6, 7, 8, and 12.  
- **Operations (HR / Finance / Managers)** — focus on sections 4, 8, 9, and 10.  
- **For step-by-step process detail** — use the separate workflow documents; this guide deliberately does not replace them.  

If something in a detailed document conflicts with the **non-negotiable rules** in section 6, treat section 6 as the governing intent and escalate for clarification.

---

*Companion materials in this project cover workflows, approvals detail, future scope, and AI capability sequencing. This starter guide stays at rules, roles, functions, and business meaning only.*
