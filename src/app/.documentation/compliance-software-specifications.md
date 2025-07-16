# ComplianceApp – Software Requirements Specification (Party-Model Update v2)

## System Design
- **Web-first SaaS** hosted on Vercel (Edge + serverless functions).
- **Frontend**: Next.js (App Router) renders UI and calls typed API routes.
- **Backend**: Serverless handlers under `/api` use Prisma ORM for Supabase Postgres.
- **Realtime**: Supabase Realtime channels push issue-status changes to the UI.
- **Object Storage**: Supabase Storage buckets hold PDFs, images, and other docs.
- **Scheduled Jobs**: Vercel Cron triggers reminder e-mails/SMS via Resend & Twilio.

## Architecture pattern
- **Clean / Hexagonal** layers with feature folders (`organization`, `person`, `equipment`, `role`, `issue`).
- Shared UI primitives built with shadcn/ui + Tailwind.
- Strict TypeScript end-to-end for type safety.

## State management
- **TanStack Query** for server data & caching.
- **Zustand** for local UI state (drawers, modals).
- Minimal React Context (theme + session).

## Data flow
1. Component dispatches TanStack Query request.  
2. `/api` handler verifies Clerk JWT → Prisma → Postgres.  
3. Supabase `NOTIFY` broadcasts → WebSocket → query invalidation.  
4. Sonner toast shows success/error.

## Technical Stack
| Layer      | Tech                                     |
|------------|------------------------------------------|
| Frontend   | React 18, Next.js 14, Tailwind, shadcn/ui, lucide-react |
| State      | TanStack Query, Zustand                  |
| Auth       | Clerk (JWT, RBAC)                        |
| ORM        | Prisma                                   |
| Database   | Supabase Postgres                        |
| Realtime   | Supabase Realtime                        |
| Storage    | Supabase Storage                         |
| Hosting    | Vercel                                   |
| E-mail/SMS | Resend, Twilio                           |

## Authentication Process
1. `middleware.ts` enforces Clerk session on every request.  
2. Valid token exposes `orgId`, `userId`, `role` claims.  
3. API guard checks scope (`Admin`, `Manager`, `ReadOnly`).  
4. Front-end `useAuth` hook surfaces capabilities to components.

## Route Design (Next.js App Router)
/
└─ dashboard
/organizations
└─ [orgId]
├─ overview
├─ permits
├─ reports
└─ inspections # org-level accidents & roadside inspections
/persons
└─ [personId]
├─ overview
├─ roles # all roles for this person
└─ documents
/equipment
└─ [equipmentId]
├─ overview
├─ roles # ASSET roles linking to orgs
└─ inspections
/roles # polymorphic relationship explorer
├─ page.tsx # list & filters (party_a / party_b / role_type)
└─ [roleId]
├─ overview # parties, dates, notes
└─ issues # issues tied to this role (licenses, regs)
/issues # optional direct issue browser
└─ [issueId]
/settings
├─ users
├─ notifications
└─ import-export


## API Design
- Base URL: `/api/v1/*` (JSON, Zod-validated).
- **Core endpoints**  
  - `GET  /roles?orgId=` — list all roles for an org.  
  - `POST /roles` — create role (`party_a`, `party_b`, `role_type`, `start_date`).  
  - `PATCH /roles/{id}` — update/terminate (`end_date`).  
  - `GET  /issues` — filter by `partyId` or `roleId`.  
  - `POST /inspections` — new roadside inspection (`roleId?`, `equipmentId?`).  
  - `POST /accidents` — new accident (`roleId?`, `equipmentId?`).  
  - *(Future)* `POST /party-links` for direct person ↔ equipment ties.

## Database Design ERD (party model)
```sql
-- Core party tables
organization (
  id PK,
  name TEXT,
  ein TEXT,
  address JSONB,
  created_at TIMESTAMPTZ
)

person (
  id PK,
  first_name TEXT,
  last_name TEXT,
  dob DATE,
  ssn TEXT,
  address JSONB,
  created_at TIMESTAMPTZ
)

equipment (
  id PK,
  unit_number TEXT,
  vin TEXT,
  status ENUM('ACTIVE','INACTIVE','RETIRED'),
  created_at TIMESTAMPTZ
)

-- Polymorphic relationship table
role (
  id PK,
  party_a_type ENUM('ORGANIZATION','PERSON','EQUIPMENT'),
  party_a_id UUID,
  party_b_type ENUM('ORGANIZATION','PERSON','EQUIPMENT'),
  party_b_id UUID,
  role_type  ENUM('DRIVER','ASSET','SPOUSE','CHILD','CONTACT','DOT_AGENCY',
                   'SELF','DEPARTMENT','STAFF','ORGANIZATION','VENDOR'),
  start_date DATE,
  end_date   DATE NULL,
  notes TEXT,
  CHECK (party_a_id <> party_b_id)
)

-- Generic issue header
issue (
  id PK,
  role_id      UUID NULL REFERENCES role(id) ON DELETE CASCADE,
  equipment_id UUID NULL REFERENCES equipment(id) ON DELETE CASCADE,
  type ENUM('LICENSE','DRUG_TEST','PHYSICAL','MVR','REGISTRATION',
            'ANNUAL_INSPECTION','MAINTENANCE','ACCIDENT','INSPECTION'),
  expires_on DATE NULL,
  status ENUM('OK','DUE_60','DUE_30','EXPIRED'),
  created_at TIMESTAMPTZ
)

-- Typed child tables (1-to-1 with issue.id)
license_issue (
  issue_id PK REFERENCES issue(id) ON DELETE CASCADE,
  license_state CHAR(2),
  license_number TEXT,
  endorsements TEXT[]
)

drug_test_issue (
  issue_id PK REFERENCES issue(id) ON DELETE CASCADE,
  result ENUM('PASS','FAIL'),
  substance ENUM('drug','alcohol'),
  lab TEXT,
  accredited_by TEXT
)

physical_issue (
  issue_id PK REFERENCES issue(id) ON DELETE CASCADE,
  medical_examiner TEXT,
  expiration_notice_sent BOOLEAN DEFAULT FALSE
)

mvr_issue (
  issue_id PK REFERENCES issue(id) ON DELETE CASCADE,
  state CHAR(2),
  violations_count INT,
  clean_record BOOLEAN
)

registration_issue (
  issue_id PK REFERENCES issue(id) ON DELETE CASCADE,
  plate_number TEXT,
  state CHAR(2)
)

annual_inspection_issue (
  issue_id PK REFERENCES issue(id) ON DELETE CASCADE,
  inspection_location TEXT,
  inspector_name TEXT,
  passed BOOLEAN
)

maintenance_issue (
  issue_id PK REFERENCES issue(id) ON DELETE CASCADE,
  maintenance_type TEXT,
  odometer INT,
  notes TEXT
)

-- Complex types with sub-tables
accident_issue (
  issue_id PK REFERENCES issue(id) ON DELETE CASCADE,
  city TEXT,
  officer_name TEXT,
  officer_agency TEXT,
  report_number TEXT
)

accident_violation (
  id PK,
  accident_issue_id UUID REFERENCES accident_issue(issue_id) ON DELETE CASCADE,
  code TEXT,
  description TEXT,
  severity INT
)

inspection_issue (
  issue_id PK REFERENCES issue(id) ON DELETE CASCADE,
  location TEXT,
  officer_name TEXT,
  level ENUM('I','II','III','IV','V','VI')
)

inspection_violation (
  id PK,
  inspection_issue_id UUID REFERENCES inspection_issue(issue_id) ON DELETE CASCADE,
  code TEXT,
  description TEXT,
  oos BOOLEAN
)

document (
  id PK,
  url TEXT,
  mime TEXT,
  uploaded_by UUID,
  created_at TIMESTAMPTZ
)

**Design notes** 
Strict typing for ad-hoc SQL: each child table exposes native columns (e.g., result, endorsements), simplifying WHERE clauses and analytics.
One-to-one FK pattern suits Prisma and avoids Postgres inheritance quirks.
Extensibility: new issue types = new child table; parent issue.type ENUM updated.
Polymorphic roles cover any party-to-party relationship (person↔person, org↔equipment, etc.).
Registration (plate) lives in registration_issue, not on equipment, aligning with ownership changes.
All FKs cascade delete; unique index prevents duplicate active roles (party_a_id, party_b_id, role_type, end_date IS NULL).