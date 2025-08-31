# Job Companion – Overview

## Vision

Job-seeking today is painful, fragmented, and slow.  
**Job Companion** is an **AI-powered agent and career coach** that transforms this process into a guided, efficient, and supportive journey.

It is not just a tool — it’s a **companion** that helps applicants apply faster, smarter, and with more confidence.

---

## Core Value

- **Two-click Apply**: Paste a job link → instantly get a tailored CV & cover letter.
- **Always-on Coach**: Personalized advice, tips, and roadmaps to close skill gaps.
- **Application Tracker**: Manage all applications, statuses, interviews, and notes.
- **Job Radar**: Daily discovery of relevant postings — no opportunity missed.
- **Company Snapshots**: Digestible profiles with products, news, and insights.

---

## Key Flows

1. **Input** → Upload CV once, paste a job description or link.
2. **Analyze** → AI extracts requirements, scores match, and finds gaps.
3. **Generate** → Auto-tailored CV + cover letter (+ later: multimedia company brochure).
4. **Track** → Save applications with docs, statuses, reminders, and interview notes.
5. **Coach** → Receive actionable advice: improve profile, prep for interviews, plan learning.
6. **Radar** → Auto-search job portals, deduplicate results, suggest new roles.

---

## Feature Groups

- **Documents**  
  Tailored CVs, cover letters, “reality index” tuning, DOCX/PDF generation.

- **Tracker**  
  Application CRM, interview calendar, notes, follow-up reminders.

- **Coach**  
  Personalized advice, STAR story generation, gap→roadmap, interview prep.

- **Research**  
  Company snapshots, multimedia brochures, market insights.

- **Radar**  
  Job portal connectors, scraping agents, dedup engine, smart ranking.

- **Automation**  
  Rules engine, daily apply queue, ATS autofill assist.

---

## Roadmap

Development is planned in **progressive versions (V0 → V10)**.  
Each version introduces new capabilities while keeping the system usable end-to-end.

See [version-roadmap.md](./version-roadmap.md) for the detailed breakdown.

---

## Files

- `index.md` → This overview document.
- `version-roadmap.md` → Full version roadmap with progressive milestones.
- `feature-specs/` → Detailed specs per feature (future).
- `user-stories/` → Backlog of user stories (future).
- `agents.md` → Description of AI agents & roles (future).
- `data-model.md` → Data structures and schema (future).

---

## Philosophy

Job Companion is built as an **AI-first, agent-driven system**:

- Agents act as planner, researcher, writer, reviewer, coach, archivist, and scheduler.
- Users don’t need to choose roles, templates, or settings — the system **decides automatically**, with explainable reasoning.
- A **“Reality Index”** dial lets users balance between _facts-only_ and _aspirational phrasing_, always with ethical guardrails (no fabricated history).
- The app grows from a simple assistant to a **true job-seeking partner** — tracking progress, improving skills, and supporting career growth.

# 📂 Job Companion – Documentation Structure

```
├── index.md                # High-level overview (vision, core flows, philosophy)
├── version-roadmap.md      # Full roadmap V0 → V10 with features & milestones
│
├── feature-specs/          # Detailed specs for major features
│   ├── documents.md        # CV/cover gen, reality index, doc rendering
│   ├── tracker.md          # Application tracking, statuses, notes, reminders
│   ├── coach.md            # Advice, gap→roadmap, interview prep, STAR stories
│   ├── radar.md            # Job search agents, deduplication, prioritization
│   ├── research.md         # Company snapshots, multimedia brochures
│   ├── automation.md       # Rules engine, apply queue, ATS autofill
│   └── integrations.md     # External services (calendars, cloud drives, APIs)
│
├── user-stories/           # Backlog of user stories
│   ├── v0-stories.md       # MVP (facts-only gen, tracker lite)
│   ├── v1-stories.md       # Auto-decider, reality index
│   ├── v2-stories.md       # Full tracker, dedup, reminders
│   ├── v3-stories.md       # DOCX/PDF generation, variant generator
│   ├── v4-stories.md       # Company brochure, interview hub
│   └── ...                 # Future versions
│
├── agents.md               # AI agent roles (Planner, Researcher, Writer, Reviewer, Coach, Archivist, Scheduler)
├── data-model.md           # Entities, schema, vector usage (draft → stable later)
├── api-design.md           # REST/GraphQL endpoints sketch, sample payloads
├── ethics.md               # Reality index guardrails, truth rules, GDPR notes
└── CONTRIBUTING.md         # How to add specs, stories, and roadmap items
```

## Notes

- **`index.md`** is the **entry point** (like a README).
- **`version-roadmap.md`** is your **stepwise development path** (already drafted).
- **`feature-specs/`** contains condensed but deep dives per module.
- **`user-stories/`** gives you sprint-ready backlog slices, one per version.
- **`agents.md`** defines the companion’s AI agents and their responsibilities.
- **`ethics.md`** ensures transparency about the “Reality Index” and guardrails.
