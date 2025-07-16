# ComplianceApp – Product Requirements Document (Draft Rev 3)

## Elevator Pitch
ComplianceApp is a web-based platform that lets any fleet—commercial, municipal, or charitable—keep every DOT-required record in one place. It automatically tracks expirations, sends proactive alerts, and streamlines responses to violations, accidents, roadside inspections, and audits. By turning scattered paperwork into a unified dashboard and workflow, fleets stay compliant, maximize safety, reduce monetary risk and insurance premiums, and breeze through DOT audits.

## Who Is This App For
- **Fleet Safety & Compliance Managers** in trucking companies, government agencies, private carriers, and non-profits  
- **Operations Managers / Dispatchers** who must verify driver and vehicle readiness  
- **Executives & Directors** who need at-a-glance compliance status and audit readiness  
- *(Phase 2)* **Drivers** who will update documents (for example roadside inspections, accident photos) via a mobile companion app

## Functional Requirements
1. **Data Management**  
   - **Driver records:** licensing, MVR, drug/alcohol tests, physicals, training, **accidents**, **roadside inspections**  
   - **Vehicle records:** registration, annual DOT inspections, maintenance schedules, **accidents**, **roadside inspections**  
   - **Organization records:** insurance, permits, safety ratings  
2. **Automated Compliance Tracking**  
   - Calculate and store expiration / renewal dates for every record type  
   - Email / SMS notifications to responsible parties at configurable intervals (for example 60 / 30 / 7 days out)  
3. **Violation, Accident & Inspection Workflow**  
   - Log roadside inspections, accidents, and other violations tied to both driver **and** vehicle  
   - Task assignments and status tracking until corrective action is closed  
   - Document storage for supporting evidence and letters of correction  
4. **Audit Mode**  
   - One-click export or secure portal containing all required records within DOT look-back periods  
5. **Reporting & Dashboards**  
   - Organization-wide compliance score and heat map  
   - Driver / equipment lists with status filters (for example “expiring soon”, “out of service”)  
   - Historical trend charts (violations, inspections, accidents)  
6. **Security & Roles**  
   - Role-based access (Admin, Manager, Read-Only)  
   - Audit logs of changes  
7. **Scalability & Integration (MVP Scope)**  
   - Web app (responsive, desktop-first)  
   - CSV import / export for driver and vehicle master data  
   - (Post-MVP) ELD or HRIS API integrations  

## User Stories
| # | User | Story |
|---|------|-------|
| 1 | Compliance Manager | *As a compliance manager, I want automatic reminders for CDL renewals 60 days before they expire so I can schedule driver appointments in time.* |
| 2 | Maintenance Supervisor | *As a supervisor, I want to see a list of vehicles whose annual inspections are due next month so I can allocate shop time.* |
| 3 | Safety Director | *As a safety director, I want to upload a scanned roadside inspection form or accident report and assign corrective tasks so that follow-up is tracked and documented.* |
| 4 | Executive | *As an executive, I want a dashboard that shows current compliance health (green / yellow / red) and potential insurance-premium savings at the organization level so I know our risk exposure at a glance.* |
| 5 | DOT Auditor | *As an auditor (read-only access), I want to view all driver qualification files, roadside inspections, and accident logs within the last 24 months in one place so I can complete my review quickly.* |
| 6 | Insurance Carrier Underwriter | *As an insurance carrier underwriter, I want a read-only view of the fleet’s compliance metrics so I can validate lower risk and offer reduced premiums.* |

## User Interface (MVP Sketch)

### Global Layout & Navigation

| Region | Purpose | Notes |
|--------|---------|-------|
| **Top Navigation Bar** | Primary module switching | Company / Organization, Drivers, Equipment, Settings |
| **Context Sidebar** | Issue-level navigation inside the active module | Collapsible; becomes a hamburger drawer on tablets / phones |
| **Main Content Area** | Work surface for lists, dashboards, and forms | 12-column fluid grid; scrolls independently |
| **Notification Center** | Global alerts | Bell icon (top-right) with badge count; links to the relevant record |
| **Global “Add” FAB** | Quick-create record | Floating action button (bottom-right), context-aware label / icon (for example “Add Driver”) |

### Required Pages / Screens
- **Dashboard** (root)  
- **Organization Overview**  
- **Organization Permits & Insurance**  
- **Organization Reports**  
- **Organization Accidents & Roadside Inspections**  
- **Driver List**  
- **Driver Detail** (tabs: Overview, Licensing & Endorsements, MVRs, Drug & Alcohol, Physicals, Training, Accidents, Roadside Inspections, Documents)  
- **Equipment List**  
- **Equipment Detail** (tabs: Overview, Registration & Permits, Annual Vehicle Inspections, Maintenance, Accidents, Roadside Inspections, Documents)  
- **Role Explorer List**  
- **Role Detail**  
- **Issue Browser**  
- **Settings** (Users, Notifications, Import / Export)  

### Sidebar Menus by Module

| Module | Sidebar Items |
|--------|---------------|
| **Company / Organization** | Dashboard • Details • Permits & Insurance • Reports • Accidents • Roadside Inspections |
| **Drivers** | Overview • Licensing & Endorsements • MVRs • Drug & Alcohol • Physicals • Training • Accidents • Roadside Inspections • Documents |
| **Equipment** | Overview • Registration & Permits • Annual Vehicle Inspections • Maintenance • Accidents • Roadside Inspections • Documents |

*Every compliance issue (licensing, MVRs, inspections, accidents, etc.) is surfaced directly in the sidebar for one-click access.*

### Screen Elements
- **Company Dashboard Widgets**  
  - Compliance score cards (overall, driver, vehicle)  
  - Upcoming expirations timeline (color-coded)  
  - Accidents & Roadside Inspections queue with status chips  
  - Open violations / corrective-action list  

- **Driver & Vehicle Detail Pages**  
  - Tabbed layout: Profile | Documents | History | Accidents | Roadside Inspections | Tasks  
  - Drag-and-drop document upload; timeline feed of recent activity  

- **Notification Center**  
  - Bell icon displaying pending alerts and escalation status  

*(A mobile driver app is out of MVP scope but will reuse the same sidebar issue taxonomy for consistency.)*
