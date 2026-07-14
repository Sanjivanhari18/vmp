# VMP HTML Mockup — Vendor Management Platform

Static HTML mockup for stakeholder demos. No backend, database, or real authentication.

## Quick Start

1. Open `index.html` in a browser (double-click or use a local server)
2. Use the **View as** dropdown in the top bar to switch between actors
3. Navigate using the sidebar

```bash
# Optional: serve locally
cd vmp-mockup
python3 -m http.server 8080
# Open http://localhost:8080
```

## Roles & Default Dashboards

| Role | Dashboard | Key Screens |
|------|-----------|-------------|
| TAQ / System Admin | TAQ Dashboard | Full nav — users, roles, hiring, all modules |
| HR Operations | HR Dashboard | Vendors, contractors, onboarding, leave, import |
| Finance | Finance Dashboard | Rates, batches, invoices, reconciliation |
| Contractor's Manager | Manager Dashboard | Timesheet confirmation view (CC), MFR, performance |
| Contractor | Contractor Portal | Timesheet upload & confirmation, documents, leave |

Use the **View as** dropdown in the top bar to instantly switch between all five actor portals.

## Demo Walkthroughs

### Journey D — Timesheet Confirmation (V1)

1. Contractor → Timesheet Confirmation (`#contractor/timesheet`) — upload file or enter hours
2. System → sends confirmation email (contractor To, manager CC)
3. Contractor → confirms Yes or No via email link
4. Manager → Timesheet Confirmation (`#manager/timesheets`) — view recorded status (read-only)
5. Finance → Finance Batches (`#finance/batches`) — confirmed hours in payment batch

> Talent Acquisition (MFR, job orders, candidate routing) is out of scope for V1 demos.

### Journey B — Assignment Transfer
1. Assignments → Transfer (`#assignments/transfer`)
2. Pending Approvals (`#admin/approvals`)
3. Anomaly Report (`#reports/anomalies`)

### Journey C — Exit
1. HR → Deboarding (`#contractors/deboarding`)

## File Structure

```
vmp-mockup/
├── index.html              # Main application entry point
├── app.html                # Redirects to index.html
├── system-diagram.html     # Actor interaction diagram
├── assets/
│   css/vmp.css            # Shared styles
│   js/
│     mock-data.js         # All entity data & relationships
│     components.js        # UI components (tables, badges, stepper)
│     screens.js           # ~55 screen renderers
│     router.js            # Hash navigation & RBAC nav
│     app.js               # Initialization
└── README.md
```

## Screens (~55)

All screens from Technical SRS §16 and Wireframe Spec are implemented.

## Interactivity

- **Approve/Reject** buttons update mock status and append audit log entries
- **Entity links** navigate between related records (contractor → vendor → assignment)
- **Stat cards** on dashboards link to detail screens
- **Role switcher** reloads with role-appropriate navigation

## Mock Data

Sample data includes 3 vendors, 8 contractors, 8 assignments, 10 rate versions, 12 timesheets, 4 invoices, 2 finance batches, 3 anomalies, and linked audit/notification records. All foreign keys resolve correctly.
