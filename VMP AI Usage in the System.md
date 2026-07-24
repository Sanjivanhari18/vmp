# AI Usage in the System

How AI is used across the Vendor Management Platform (VMP), the tools that power it, and a **priority ranking** so the product ships value in V1 and gets smarter release over release.

This is a companion to `VMP Primary Workflows.md`. Read that first for the workflow spine (vendor → contractor → assignment → timesheet → invoice → pay).

---

## Product philosophy (read this first)

We behave like a **product company, not a service company**:

- **Build the IP, buy the commodity.** We build the reusable AI capabilities that make VMP smarter over time (extraction service, reconciliation assist, agent layer, guardrails). We *buy* solved problems — e-signature, background verification, sanctions feeds, OCR models, banking rails.
- **Ship a lean V1, then compound.** The system is huge in scope. V1 delivers the operational spine with a *small* set of high-ROI, low-risk AI capabilities. Everything else is sequenced behind it.
- **Deterministic core, AI on top.** Rules, routing, approvals, segregation-of-duties (SoD), and the immutable audit log stay deterministic. AI **extracts, assists, and detects** — it never approves money or people decisions.
- **One capability, many workflows.** We prefer platform capabilities reused across many screens over one-off AI features bolted onto a single screen.

Each AI capability is tagged by its role:

- **[Extract]** — turns unstructured input (PDFs, Excel, images) into validated structured data.
- **[Assist]** — drafts / summarizes / suggests; a human confirms.
- **[Detect]** — surfaces anomalies / patterns / risk for a human owner.

---

## Priority ranking at a glance

Priority **1 = ships with the first version**. Higher numbers are fast-follow and scale phases.

| # | AI capability | Powered by | Role | Phase |
|---|---------------|-----------|------|-------|
| 1 | Document Extraction Service | Azure AI Document Intelligence | Extract | **V1** |
| 2 | AI Invoice Capture & Reconciliation Assist | Rossum / Azure Doc Intelligence + Azure OpenAI | Extract + Detect | **V1** |
| 3 | Teams Timesheet Assistant (bot) | Copilot Studio + Bot Framework + Adaptive Cards | Extract + Assist | **V1** |
| 4 | Approval Summarizer & Risk Flagger | Azure OpenAI + Azure AI Search | Assist | **V1** |
| 5 | Anomaly & Fraud Detection | Azure OpenAI + custom ML (Azure ML) | Detect | V1.x |
| 6 | Internal VMP MCP Server + Agent Orchestration | MCP + Semantic Kernel / LangGraph | Foundation | V1.x |
| 7 | Natural-Language Audit & Report Query | Azure OpenAI + Azure AI Search | Assist | V1.x |
| 8 | BGV Report Interpretation | Azure Doc Intelligence + Azure OpenAI | Assist | V2 |
| 9 | MFR & Offer Drafting Assistant | Azure OpenAI | Assist | V2 |
| 10 | Rate Benchmarking Assistant | Azure OpenAI + market data (Fetch/web) | Assist | V2 |
| 11 | Skill + Credibility Matching | Azure OpenAI embeddings + Azure AI Search | Detect/Assist | V3 |
| 12 | Predictive Reporting-Anomaly Detection | Azure ML | Detect | V3 |
| 13 | Vendor Sanctions / Adverse-Media Screening Assist | ComplyAdvantage / World-Check + Azure OpenAI | Detect | V3 |
| 14 | Performance & Rating Assistance | Azure OpenAI (+ bias monitoring) | Assist | V3 (last, most sensitive) |

> **Why this order:** V1 items are reused across the most workflows, remove the most manual toil, and carry the least decision-risk. Sensitive, person-affecting AI (matching, performance, ratings) comes last — only after the guardrail foundation is proven.

---

## Foundation (build before or alongside V1 — non-negotiable)

These are not "features" but the substrate that makes every AI capability safe and reusable. In a product company this is our core IP.

- **AI platform backbone:** Azure OpenAI (in-tenant, no training on our data) + Azure AI Document Intelligence + Azure AI Search.
- **Guardrail path:** every AI-proposed *write* (activate vendor, approve rate, release payment) routes through the existing deterministic approval + SoD engine and lands in the immutable audit log (Microsoft Purview). AI never calls DocuSign, the bank, or the database directly.
- **Human-in-the-loop by default:** no AI output alone triggers money movement or a person-affecting decision. The human who accepts an AI suggestion counts as a required approver, not a shortcut around SoD.
- **Full AI traceability:** log model, inputs, suggestion, and who accepted/overrode it.

---

## Priority 1 — Ships with Version 1

### 1. Document Extraction Service — `[Extract]`

- **Tool:** Azure AI Document Intelligence (+ Azure OpenAI for cleanup/normalization).
- **Work:** One reusable service that turns uploaded PDFs/Excel/images into validated structured fields. Auto-classifies document type, extracts key fields (issue/expiry dates, tax IDs, amounts), and pre-fills forms; rules validate the output.
- **Workflows served:** Document Repository, Vendor Registration (GST/PAN/MSA/insurance/bank), Contractor Onboarding docs, Timesheet parsing, Invoice capture.
- **Why #1:** Single highest-leverage AI investment — one build, reused by more workflows than anything else. Low decision-risk (extraction, not approval). Directly powers items 2, 3, and 8.
- **Guardrail:** low-confidence extractions fall back to manual entry; rules own all validation.

### 2. AI Invoice Capture & Reconciliation Assist — `[Extract] + [Detect]`

- **Tool:** Rossum or Klippa/Nanonets (specialist invoice AI) or Azure Doc Intelligence invoice model, + Azure OpenAI to explain variances.
- **Work:** Extract invoice line items, tax, totals from any vendor format; feed the deterministic 3-way reconciliation against the approved payment batch and PO/SOW; highlight variances in plain English (e.g., "bills 42h at old rate; batch has 40h at new rate").
- **Workflows served:** Invoice Approval, Finance Payment Batch.
- **Why #1:** Highest finance ROI; invoices arrive in dozens of formats and manual matching is the biggest Finance toil in the spine.
- **Guardrail:** AI reconciles and explains — Finance resolves and approves. AI never approves or pays.

### 3. Teams Timesheet Assistant — `[Extract] + [Assist]`

- **Tool:** Microsoft Copilot Studio + Bot Framework in Microsoft Teams, Adaptive Cards, backed by the Document Extraction Service.
- **Work:** A Teams bot where contractors upload a file or type weekly hours; it parses, runs the (deterministic) holiday/leave cross-check, and returns a Confirm Yes/No Adaptive Card. Manager is CC'd via card. Keeps upload + validation + confirmation in one auditable place.
- **Workflows served:** Timesheet Submission & Confirmation, Contractor Leave (sync).
- **Why #1:** Directly replaces scattered Outlook threads (an explicit pain point); high user-visible value; confirmation identity is stronger via Entra than an email link.
- **Guardrail:** holiday/leave logic stays rules-based; AI only parses and flags soft anomalies.

### 4. Approval Summarizer & Risk Flagger — `[Assist]`

- **Tool:** Azure OpenAI grounded on internal records via Azure AI Search.
- **Work:** At the top of every approval (vendor, rate card, contractor rate, transfer, invoice), generate a one-paragraph "what changed, why, and what's unusual" summary from the entity record, documents, and history.
- **Workflows served:** Central Approval Queue and every approval step across the system.
- **Why #1:** Broad reuse across all approval screens; makes approvers faster without touching the decision; low risk.
- **Guardrail:** summary carries a "why / which fields" rationale; the human still approves.

---

## Priority 2 — Fast-follow (V1.x)

### 5. Anomaly & Fraud Detection — `[Detect]`

- **Tool:** Azure OpenAI + custom models on Azure ML.
- **Work:** Flag soft timesheet anomalies (hours vs history, round numbers, duplicates, hours on approved-leave days); detect duplicate/split invoices and pre-payment vendor bank-detail changes.
- **Workflows served:** Timesheet Confirmation, Invoice Approval, Invoice Payment.
- **Guardrail:** flags to Finance Controller / Reporting Manager only; never auto-blocks pay.

### 6. Internal VMP MCP Server + Agent Orchestration — `Foundation`

- **Tool:** A custom **MCP server** exposing VMP entities and *guarded* action tools, orchestrated with Semantic Kernel or LangGraph; plus 3rd-party MCP servers (Microsoft Graph/Teams, DocuSign, GitHub/Jira, read-only Postgres).
- **Work:** Lets AI assistants read VMP data and take guarded actions through the same rules a human would, with everything logged. This is what turns point features into a coherent agent platform.
- **Why here:** V1 wires Azure OpenAI + Doc Intelligence directly (simpler). The full MCP/agent layer is worth it once we go multi-agent/conversational at scale.
- **Guardrail:** the LLM never gets raw DB or payment access — only guarded MCP tools that respect approvals + SoD + audit.

### 7. Natural-Language Audit & Report Query — `[Assist]`

- **Tool:** Azure OpenAI + Azure AI Search over the immutable audit log.
- **Work:** Compliance/Finance/HR ask questions in plain English ("every rate change on vendor X approved out of hours").
- **Guardrail:** read-only; cannot mutate the audit log.

---

## Priority 3 — Scale & advanced (V2–V3)

### 8. BGV Report Interpretation — `[Assist]`
- **Tool:** Azure Doc Intelligence + Azure OpenAI.
- **Work:** Extract findings and highlight discrepancies (name mismatch, gaps, flags) so HR Compliance reviews exceptions, not every clean report.
- **Workflows:** Contractor Onboarding (BGV). **Guardrail:** human marks "BGV Cleared."

### 9. MFR & Offer Drafting Assistant — `[Assist]`
- **Tool:** Azure OpenAI.
- **Work:** Turn a manager's rough request into a complete, structured MFR draft and flag missing fields; draft offer letters from captured engagement terms using approved templates.
- **Workflows:** MFR Intake, Contractor Onboarding (offer). **Guardrail:** human submits/sends.

### 10. Rate Benchmarking Assistant — `[Assist]`
- **Tool:** Azure OpenAI + market data via Fetch/web MCP.
- **Work:** Suggest benchmark ranges and flag out-of-band rates for negotiators and Finance.
- **Workflows:** Rate Card Lifecycle, Contractor Rate Lifecycle. **Guardrail:** decision support only; Finance approves.

### 11. Skill + Credibility Matching — `[Detect]/[Assist]`
- **Tool:** Azure OpenAI embeddings + Azure AI Search.
- **Work:** Rank available contractors for a project/transfer by skill, availability, location, and rating/credibility history.
- **Workflows:** Project Assignment, Assignment Transfer. **Guardrail:** ranked shortlist; a human chooses.

### 12. Predictive Reporting-Anomaly Detection — `[Detect]`
- **Tool:** Azure ML.
- **Work:** Predict stale-manager / missing-rate / inactive-assignment issues before they occur; cluster recurring root causes.
- **Workflows:** Reporting Anomaly Detection & Resolution. **Guardrail:** assigns to a human owner.

### 13. Vendor Sanctions / Adverse-Media Screening Assist — `[Detect]`
- **Tool:** ComplyAdvantage or Refinitiv World-Check feeds + Azure OpenAI to summarize hits.
- **Work:** First-pass screening that surfaces potential sanctions/PEP/adverse-media hits.
- **Workflows:** Vendor Registration (Run Compliance Check). **Guardrail:** surfaces hits only; Compliance clears. Never auto-clear.

### 14. Performance & Rating Assistance — `[Assist]` (deliberately last)
- **Tool:** Azure OpenAI with bias monitoring; GitHub/Jira MCP for deliverable evidence.
- **Work:** Organize work-verification investigations (summarize deliverables/artefacts, build a timeline); pre-fill rating drafts from evidence and check comments for bias/consistency.
- **Workflows:** Performance Concern & Work Verification, Quarterly Performance Rating.
- **Why last:** most sensitive — affects pay and the credibility record that travels with a contractor. Requires bias monitoring to be in place first. **Guardrail:** AI never decides "did they work" and never adjusts pay; humans do.

---

## Enabling integrations (buy, not build)

Not AI, but the rails AI and the workflows depend on. Product-company stance: don't rebuild solved problems.

| Integration | Purpose | Where it plugs in |
|-------------|---------|-------------------|
| **DocuSign** (or Adobe Acrobat Sign) | Legally binding e-signature + status webhook | Vendor SLA/SOW/NDA/MSA; contractor offer |
| **Microsoft Entra ID** | SSO, MFA, RBAC, conditional access | User & Role Management, RBAC portal |
| **Microsoft Graph** | Teams / Outlook / SharePoint actions & notifications | Notifications, Teams bot, document repo |
| **SharePoint + Azure Blob** | Versioned document repository, retention | Document Repository, Track Expiry |
| **Microsoft Purview** | Immutable audit, DLP, retention | Audit Log & Notifications, compliance |
| **BGV providers** (AuthBridge / IDfy / SpringVerify; HireRight/Checkr global) | Run background checks | Contractor Onboarding (BGV) |
| **Sanctions/KYC feeds** (ComplyAdvantage / World-Check) | Sanctions/PEP/adverse-media data | Vendor Compliance Check |
| **ERP** (SAP / Oracle Fusion / NetSuite; Zoho/Tally mid-market) | GL posting, system of record | Payment Batch, Invoice, Payment |
| **Bank host-to-host / SWIFT / NEFT-RTGS** | Payment file + maker-checker release | Invoice Payment & Settlement |
| **Temporal / Camunda (BPMN)** | Durable workflow & approval orchestration | The deterministic spine AI plugs into |
| **Power Automate** | Low-code connectors for routine automations | Notifications, status updates |

---

## Where we deliberately do NOT use AI

Naming the no-go zones keeps us pragmatic:

- **Any approval or release decision** — vendor activation, rate approval, invoice approval, payment release. Human + rules + SoD only.
- **Immutable audit log writes** — AI reads/queries, never authors or alters.
- **Auto-clearing BGV, compliance, or sanctions** — surface only; humans clear.
- **Auto-adjusting or blocking pay** in performance disputes — investigation support only.
- **RBAC enforcement** — deterministic policy, not a probabilistic decision.
- **Simple deterministic validations** (holiday overlap, non-overlapping rate versions, threshold routing) — don't wrap rules in AI just to say we used AI.

---

## Responsible-AI guardrails (apply to every capability above)

- **Human-in-the-loop by default** — no AI output alone moves money or affects a person.
- **Everything AI touches is logged** to the immutable audit trail: model, inputs, suggestion, accept/override, actor.
- **Explainability over black-box** — every flag/suggestion carries a "why."
- **Confidence thresholds + graceful fallback** — low confidence → manual, never a guess.
- **Bias monitoring** on anything feeding the credibility record (matching, performance, ratings).
- **Data boundaries** — sensitive PII/rates/BGV processed in-tenant (Azure OpenAI), redacted before any external call.
- **SoD still applies** — accepting an AI suggestion makes you one of the required separate approvers, not an exception to them.
