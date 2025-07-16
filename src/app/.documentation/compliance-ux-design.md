# ComplianceApp – User Interface Design Document (UIDD)

## Layout Structure

| Region | Purpose | Notes |
|--------|---------|-------|
| **Top Navigation Bar** | Primary module switching and global search | Items: **Company / Organization**, **Drivers**, **Equipment**, **Settings** + a right-aligned **Quick-Select** autocomplete field |
| **Context Sidebar** | Issue-level navigation inside the active module | Collapsible; becomes a hamburger drawer on ≤ 1024 px |
| **Slide-Out Selector Drawer** | On-demand list of Drivers **or** Equipment | Hidden by default; opens via keyboard shortcut (**G D** / **G E**) or “Browse” icon. Toggle switches between lists. Rows show a status pill—green (OK), yellow (≤ 60 d), orange (≤ 30 d), red (expired). |
| **Main Content Area** | Work surface for dashboards, tables, and detail panels | 12-column responsive grid. When the Selector Drawer is open on large screens, content shifts right; on tablets/mobile the drawer floats above. |
| **Notification Center** | Global alerts | Bell icon with badge. Dropdown links to the triggering record. |
| **Global “Add” FAB** | Quick-create record | Floating action button (bottom-right), context-aware label/icon (e.g., “Add Driver”). |

---

## Core Components

1. **KPI Cards**  
   - Large, clickable cards for Org / Driver / Vehicle compliance scores.  
   - Status strip (green ✔, yellow ⚠, red ✖) across the top edge.

2. **Driver / Equipment Selector Drawer**  
   - Toggle button for Drivers ⇄ Equipment.  
   - Incremental search within the drawer.  
   - Selecting a row loads the record and auto-closes the drawer.

3. **Issue Data Table** (within an issue section)  
   - Columns: Name/ID, Status, Expiry, Last Action.  
   - Single-select; row selection populates the adjacent Detail Panel.

4. **Detail Panel**  
   - Tabs: Overview | Documents | History | Tasks.  
   - Read-only by default; **Edit** button toggles fields or opens modal.  
   - Drag-and-drop upload area in *Documents* tab.

5. **Sidebar Anchor Links**  
   - Smooth-scroll to page sections; active link highlights on scroll.

6. **Modal / Drawer Forms**  
   - Used for create/edit; autosave on blur, explicit **Save**/**Cancel**.

7. **Global Quick-Select Field**  
   - Autocomplete in the top bar; groups results by Driver / Equipment.  
   - **Enter** navigates directly to the chosen record.

---

## Interaction Patterns

- **Dashboard Quick-Drill** – Click a KPI card → pre-filtered issue table → auto-scroll to anchor.  
- **Selector Drawer Navigation** – Browsing or keyboard shortcut opens the drawer; choosing an item loads its detail and closes the drawer.  
- **Global Quick-Select** – Type from anywhere to jump straight to a record.  
- **Master–Detail Browsing** – URL remains stable while switching records; browser history saves selected tab.  
- **Responsive Sidebar & Selector Drawer** – On tablets, Context Sidebar collapses to icons; Selector Drawer slides over content.  
- **Keyboard Shortcuts** – *N* (new), *S* (save), */* (search), *G D* (focus Driver list), *G E* (focus Equipment list).

---

## Visual Design Elements & Color Scheme

| Element | Style | Purpose |
|---------|-------|---------|
| Background | `#F8F9FA` light grey | Neutral canvas |
| Primary Accent | `#0066FF` blue | Links, buttons, FAB |
| Success | `#2ECC71` green | Compliant / OK |
| Warning | `#F1C40F` yellow | Due ≤ 60 days |
| Alert | `#FF9F1A` orange | Due ≤ 30 days |
| Danger | `#E74C3C` red | Expired / Failed |
| Border Radius | 6 px | Soft, approachable |
| Card Shadow | `0 2 6 rgba(0,0,0,0.08)` | Subtle elevation |

All color pairs meet WCAG 2.1 AA contrast.

---

## Mobile, Web App, Desktop Considerations

| Breakpoint | Behaviour |
|------------|-----------|
| ≥ 1440 px | Sidebar fixed; Selector Drawer pushes content 25 % width; KPI cards in 4-col grid. |
| 1024 – 1439 px | Sidebar collapsible; Selector Drawer overlays 70 % width; KPI cards in 2 × 2 grid. |
| 768 – 1023 px (tablet) | Sidebar becomes icon rail; Selector Drawer floats full width; Detail Panel in drawer-style overlay. |
| ≤ 767 px (future mobile) | Top nav becomes hamburger; cards stack; Selector Drawer covers full screen. *(Mobile not in MVP but layout prepared.)* |

---

## Typography

| Style | Font | Size (desktop) | Usage |
|-------|------|---------------|-------|
| Headline | **Inter Bold** | 24 px | Section & card titles |
| Sub-header | **Inter Semibold** | 18 px | Table headings, modals |
| Body | **Inter Regular** | 14 px | Main copy, forms |
| Small | **Inter Regular** | 12 px | Helper text, timestamps |

Inter is open-source, legible, and cross-platform friendly.

---

## Accessibility

- **WCAG 2.1 AA** compliant contrast, focus styling, and keyboard order.  
- All interactive elements tabbable and announced with ARIA roles/labels.  
- **Skip-to-content** link for screen-reader users.  
- Animations ≤ 200 ms; respect **prefers-reduced-motion**.  
- Error messages announced via `aria-live="polite"`.

---
