# Job Companion – Documentation Hub

Welcome to the **Job Companion** project.  
This repository contains the vision, roadmap, specs, and backlog for building an **AI-powered job-seeking companion**.

The app acts not just as a tool, but as a **career coach and partner**:

- Tailors CVs & cover letters automatically.
- Tracks applications and interviews.
- Coaches users with actionable advice.
- Finds new jobs proactively.
- Grows into a full job-search ecosystem.

---

## 📂 Documentation Structure

All documentation is stored inside the [`documents/`](./documents) folder.

### 🔑 Entry Points

- [index.md](./documents/index.md) – High-level overview (vision, purpose, core flows, philosophy).
- [version-roadmap.md](./documents/version-roadmap.md) – Step-by-step roadmap (V0 → V10).

### 🤖 AI Agents

- [agents.md](./documents/agents.md) – Definitions of the core AI agents (Planner, Researcher, Writer, Reviewer, Coach, Archivist, Scheduler) and how they work together.

### 🧩 Feature Specs

Detailed specifications for major functional modules.  
Folder: [feature-specs/](./documents/feature-specs)

- [documents.md](./documents/feature-specs/documents.md) – Tailored CV/CL, templates, Reality Index.
- [tracker.md](./documents/feature-specs/tracker.md) – Application lifecycle, statuses, notes, reminders.
- [coach.md](./documents/feature-specs/coach.md) – Advice, STAR stories, gap→roadmap, interview prep.
- [radar.md](./documents/feature-specs/radar.md) – Job discovery, Apply Queue, deduplication.
- [research.md](./documents/feature-specs/research.md) – Company snapshots, multimedia brochures.
- [automation.md](./documents/feature-specs/automation.md) – Rules, daily digest, auto-archive, tasks.
- [integrations.md](./documents/feature-specs/integrations.md) – Cloud, calendar, email, Notion, APIs.

### 📝 User Stories

Backlog of user stories organized by version.  
Folder: [user-stories/](./documents/user-stories)

- [README.md](./documents/user-stories/README.md) – Backlog index with summaries of all versions.
- [v0-stories.md](./documents/user-stories/v0-stories.md) → [v10-stories.md](./documents/user-stories/v10-stories.md) – Full backlog, sprint-ready.

### 📊 Models & Ethics

- [data-model.md](./documents/data-model.md) – Draft of data structures and schema (future).
- [api-design.md](./documents/api-design.md) – REST/GraphQL endpoints sketch (future).
- [ethics.md](./documents/ethics.md) – Reality Index guardrails, truth rules, GDPR & privacy notes.

---

## 🛠 Development Flow

1. **Start Small** → Build V0–V1 (upload CV, paste JD, generate docs, auto persona/RI).
2. **Add Tracking** → V2–V3 introduces application tracker and pro-level documents.
3. **Expand Context** → V4–V5 adds company brochures and proactive job radar.
4. **Automate & Test** → V6–V6.5 enables rules, multi-career lenses, and A/B testing.
5. **Collaborate & Scale** → V7–V8 supports mentorship and enterprise workspaces.
6. **Integrate & Own Data** → V9 adds integrations and knowledge vault.
7. **Go Mobile** → V10 delivers full mobile-first experience with notifications.

---

## 📌 Philosophy

- **AI-First Design** – Agents handle logic and decisions automatically.
- **Coach Mentality** – Companion gives advice, not just documents.
- **Truth Guardrails** – Reality Index balances aspirational phrasing with ethics.
- **User Control** – Transparency, explainability, and privacy are built-in.
- **Incremental Delivery** – Each version is usable end-to-end.

---

## 🚀 Next Steps

- Review [version-roadmap.md](./documents/version-roadmap.md).
- Explore [user-stories/README.md](./documents/user-stories/README.md) for sprint planning.
- Use [feature-specs/](./documents/feature-specs) to detail technical implementation.
