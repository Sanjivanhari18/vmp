# Second Level Workflow (Excel Spine)

Mid-level view between the **high-level overall flow** (Level 1) and the **primary workflows** (Level 3).

- **Level 1** — stage boxes only: vendor → MFR → onboarding → assignment ↔ transfer → timesheet → invoice → pay  
- **Level 2 (this file)** — same spine, with stage outcomes and **every Excel / CSV file touchpoint** called out  
- **Level 3** — full actor → action chains (see `VMP Primary Workflows.md` and `VMP workflows inc approvals.md`)

Excel / CSV artefacts are marked **[Excel]** below. Formats are typically `.xlsx` or `.csv` unless noted.

---



## 1. Vendor onboarding

**What happens:** HR registers the vendor, captures company and compliance details, collects signed agreements (SLA / SOW / NDA / MSA), Finance approves, vendor is activated and gets portal access.

**Key outcomes:** Active vendor · verified documents · approved commercial footing for rates and invoices.

## 2. MFR request

**What happens:** Manager drafts and submits a manpower request; Business / Finance approve or reject; TAQ reviews, converts to a job order, and creates an open position for demand tracking.

**Key outcomes:** Approved demand · open position for planning (V1 does not run full hire-to-pay orchestration).

## 3. Contractor onboarding

**What happens:** Contractor enters via HR- or vendor-initiated path. Engagement terms are captured (project, pay/bill rate, start/end, FTE conversion eligibility). Documents and BGV clear; offer is sent and signed; draft assignment and contractor rate are created; Finance approves the rate; assignment and contractor activate together.

**Key outcomes:** Active contractor · draft→active assignment · Finance-approved rate aligned to rate card.

---



## 4. Contractor assignment ↔ Project assignment transfer



## 5. Timesheet submission and approval

**What happens:** Contractor submits weekly hours (file upload or manual entry). System parses hours and flags leave/holiday mismatches. Reporting manager / supervisor approves their contractors’ timesheets (then HR Ops where applicable). Finance runs a **final check** on pay rates, work-period dates, and anomalies before anything is released for vendor payment.

**Key outcomes:** Parsed daily hours · manager (and HR Ops) approval · Finance clear/block on rate–date–anomaly checks · hours ready for Finance batch / vendor pay.

## 6. Invoice approval

**What happens:** Finance builds a payment batch only from **Finance-cleared** timesheets, validates assignment–rate–manager, and removes blocked lines. Vendor or Finance submits the invoice; system reconciles against the approved batch and PO/SOW; Project Manager confirms services/hours; budget owner and Finance approve (dual approval when policy requires). Cleared batch hours are what the vendor uses to pay contractors.

**Key outcomes:** Approved payment batch · reconciled invoice · invoice marked eligible for payment · vendor payment file from cleared hours.

## 7. Send to vendor for approval and pays

**What happens:** Approved invoice is scheduled; Finance generates the bank payment file; Treasury / Finance releases payment (maker-checker); system marks invoice and batch paid and sends remittance advice to the vendor.

**Key outcomes:** Payment file released · invoice/batch paid · vendor remittance sent.

---

---

