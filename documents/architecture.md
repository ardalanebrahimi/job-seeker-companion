# Technical Architecture — Job Companion (v1)

_Last updated: 2025-08-31_

---

## 0) Goals & Non-Goals

### Goals

- AI-powered job companion with automated persona/style/template decisions.
- Modular monolith: scalable from single user → multi-tenant workspaces.
- OpenAPI-first backend contracts (generate Angular SDK).
- Strong truth/privacy guardrails (Reality Index, provenance).
- Infra not Azure-locked (can swap storage & DB providers).

### Non-Goals

- Full event sourcing for all domains.
- Scraping portals that forbid automation.
- Perfect cross-portal coverage in MVP.

---

## 1) Bounded Contexts

### Core

- **Applications** → pipeline, statuses, notes, reminders.
- **Documents** → CV/CL generation, templates, versions.
- **Research** → JD parsing, company snapshots/brochures.
- **Radar** → job ingestion, deduplication, apply queue.
- **Coach** → gap→roadmap, STAR stories, nudges.
- **Agents** → planner, researcher, writer, reviewer, coach, archivist, scheduler.

### Support

- **Auth & Identity**, **Users & Workspaces**.
- **Integrations** (Drive/OneDrive, Calendars, Notion, Email).
- **Analytics** (vault search, KPIs, A/B results).

---

## 2) Layered Architecture

```
[ Angular Web/Mobile ]
│ (HTTPS, OpenAPI SDK)
[ API Controllers ]
│
[ Application Layer (CQRS) ]
│
[ AI Agent Layer (Planner, Writer, etc.) ]
│
[ Domain Layer (Entities, Services, Events) ]
│
[ Infrastructure (Postgres, Blob, Vector, Jobs, Integrations) ]
```

---

## 3) AI Agent Layer

- **PlannerAgent** → persona, template, RI defaults.
- **ResearcherAgent** → JD parse, company info.
- **WriterAgent** → CV/CL generation (facts-bounded).
- **ReviewerAgent** → truth/ATS lint, provenance checks.
- **CoachAgent** → tips, gap→roadmap, STAR stories.
- **ArchivistAgent** → versioning, dedup, decision logs.
- **SchedulerAgent** → reminders, digests, apply-queue timing.

### Guardrails

- Prompts versioned in `/documents/prompts/*`.
- JSON schema validation for all AI I/O.
- **Reality Index** (0–2) enforced centrally.
- Provenance required for strong statements.

---

## 4) Data Architecture

- **Postgres** + **pgvector** for embeddings.
- **Redis** for caching.
- **Blob storage** (Azure Blob or S3).
- **Background jobs** (Bull/BullMQ for Node.js).
- **Vault**: Postgres + blob (documents, notes, JD snapshots).

---

## 5) Security & Privacy

- OAuth 2.1 / OIDC.
- JWT with refresh rotation.
- PII encrypted at rest.
- GDPR: export/delete, consent for sharing.
- No storage of 3rd-party portal credentials.
- Reviewer blocks fabrications (roles, dates, certs).

---

## 6) API Strategy

- **OpenAPI 3.1** spec in `/apps/backend/openapi.yaml`.
- Tags: `auth`, `users`, `documents`, `applications`, `jobs`, `radar`, `research`, `coach`, `rules`, `integrations`, `analytics`.
- TypeScript SDK generated for Angular.
- Versioned `/v1`.

---

## 7) Suggested Tech Stack

### Primary

- **Frontend**: Angular 19 (standalone), Capacitor wrapper later.
- **Backend**: Node.js with TypeScript, Express/Fastify.
- **DB**: PostgreSQL + pgvector, Redis cache.
- **Jobs**: Bull/BullMQ for background jobs.
- **Doc Gen**: Puppeteer for PDF, docx library for DOCX.
- **AI**: OpenAI (GPT-4.x/5.x), embeddings.
- **CI/CD**: GitHub Actions, Docker.

---

## 8) Repo & Folder Structure

```
/apps
/backend (node.js/typescript)
  /src
    /api
    /application
    /domain
    /infrastructure
    /agents
  openapi.yaml
/frontend (angular)
  /src/app
    /core
    /features
    /shared
    /infra
/documents
/packages
/sdk # generated Angular client
```

---

## 9) Minimal API Endpoints (V0–V1)

- `POST /jobs/ingest { url | rawText }` → `{ jobId }`
- `GET /jobs/{id}` → job + JD analysis.
- `POST /applications/generate { jobId }` → tailored docs.
- `GET /applications` → list.
- `GET /applications/{id}` → detail.
- `POST /applications/{id}/status` → update status.
- `POST /applications/{id}/notes` → add note.
- `POST /coach/gap-roadmap { jobId }` → coaching.
- `GET /radar/apply-queue` → daily jobs.
