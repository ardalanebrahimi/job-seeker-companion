# Version Roadmap (from seed → pro)

## V0 — Seed (1–2 weeks)

**Inputs:** Upload base CV (DOCX/PDF), paste JD text or URL (manual fetch).

**Analyzer (lite):** Extract JD title, skills, must-haves; match vs your CV.

**Writer (lite):** Generate tailored CV & cover letter as Markdown/HTML (manual copy to Word/Docs).

**Tracker (lite):** Save job, status, notes, dates (Found/Applied).

**Coach (inline tips):** 5–7 actionable tips per job (what to stress, keywords to mirror).

## V1 — Auto-Decider & Reality Index

**Auto persona (no fixed roles):** The agent infers latent role personas from your history (clusters like PM, CS, Data-ish). It picks the best persona per JD automatically.

**Auto template pick:** Style + layout chosen by agent (you can override later).

**Reality Index (guardrailed):**

- **0:** Facts-only (strict).
- **1:** Reframe & emphasize (quantify with available evidence).
- **2:** Aspirational phrasing (allowed only as “in progress” or “exposure”; no fabrications).
- **3:** Not allowed (no invented roles/dates/certs ever).

**Explainability:** “Why this persona/template/tone” with editable switches.

## V1.5 — Company Snapshot (Lite)

**Company card:** tagline, products, locations, tech keywords, recent public news summary.

**Coach add-on:** 3 custom “conversation starters” + 3 “value hypotheses”.

## V2 — Applications 1.0

**Kanban:** Found → Applied → Interview(s) → Offer/Rejected.

**Artifacts:** Store generated CV/CL + JD snapshot per application (versioned).

**Reminders:** Follow-ups, interview dates, thank-you notes (email/ICS export).

**Dedup & Seen:** Detect already seen/applied across sources; merge duplicates.

## V2.5 — Job Radar (Safe Sources First)

**Connectors (public/official):** Greenhouse, Lever, Recruitee, Teamtailor, RSS/sitemaps, Google Jobs indexed pages.

**Saved searches:** Title/skills/location filters; run daily.

**Dedup engine:** Canonicalize (company + title + loc) + near-duplicate via embeddings.

**Applied-state sync:** Auto-mark as Applied when you submit via the app; manual toggle supported.

## V3 — Doc Generation Pro

**True DOCX templates:** with content controls; brandable themes.

**PDF rendering:** server-side; keep both DOCX+PDF.

**Variant generator:** 2–3 CV versions per job (tight/standard/long), pick best.

**Diff & traceability:** Show exactly what changed and why.

## V3.5 — ATS Autofill Assist (Human-in-the-loop)

**Browser extension (local):** Autofill common ATS fields from generated CV/CL.

**Local cookies/tokens:** kept on-device to respect TOS; no server-side automation.

**Red flags:** Warn on sites with strict anti-automation policies.

## V4 — Company Brochure 1.0 (Multimedia)

**Magazine-style card:** logo, product images, product categories, timeline of news, office map, hiring volume trend (public data only).

**Role-specific brief:** “How your profile maps to their problems” section.

**Save to application package:** for interview day.

## V4.5 — Interview Hub

**Prep pack:** STAR stories auto-drafted from your history aligned to JD themes.

**Question drill:** Likely Qs + model answers grounded in your facts.

**Interview notes:** Structured capture, scorecards, decision journal.

**Follow-up generator:** Personalized thank-you emails.

## V5 — Job Radar Pro

**Heuristics + ML ranking:** Prioritize by fit, freshness, conversion likelihood.

**Cross-portal dedup (hard mode):** canonical URL graph + semantic clustering.

**“Apply Queue:”** Morning list of ready-to-send applications with two-click generate.

## V5.5 — Gap→Roadmap & Portfolio

**Gap categories:** Must-have / Nice-to-have / Missing with evidence.

**Roadmaps:** Micro-projects (1–2 weeks), resource plan, practice schedule.

**Portfolio builder:** Turn micro-projects into public case studies; link in CV.

## V6 — Automations & Rules

**Rules engine:** “If JD contains X and company size > Y → use Persona B + Template T + Reality=1.”

**Recurring searches:** 2–3 daily runs; quiet hours; alert batching.

**Two-click apply flow:** Ready bundle (CV+CL+brochure) + ATS autofill → submit → update tracker.

## V6.5 — Multi-Career Lenses

**Persona studio:** Agent maintains several evolving personas; simulate “What if I lean CS vs PM?”

**A/B testing:** Alternate CV versions and measure callback rate.

## V7 — Collaboration & Mentors

**Share package (redact PII):** Ask a mentor/friend to comment.

**Coach mode live:** “Mock interviewer” with feedback and rubric scoring.

## V8 — Team / Enterprise

**Workspaces, SSO, policy guardrails:** shared templates, analytics (pipeline, call-back rates).

**Compliance:** GDPR/DSR tools, retention policies.

## V9 — Integrations & Knowledge Vault

**Drive/OneDrive/Notion artifact sync.**

**Calendar/email:** Deeper scheduling + templates.

**Public APIs:** for import/export.

## V10 — Mobile & Notifications

**iOS/Android:** Quick apply queue, reminders, push for new matches.

**Voice notes:** to application and on-the-go brochure preview.

**Agent System (always-on “companion”):**

- **Planner:** decides persona/template/reality level.
- **Researcher:** JD + company intel.
- **Writer:** CV/CL variants.
- **Reviewer:** consistency, ethics guardrails.
- **Archivist:** versioning, dedup, trace.
- **Coach:** advice, roadmaps, interview drills.
- **Scheduler:** tasks, reminders.

Single supervisor orchestrates; tools include: web fetcher, embeddings store, doc generator, tracker, calendar/email bridges. Swappable LLM vendors.

---

### Ethics & “Reality Index” Guardrails (baked-in)

- **Never invent:** employers, titles, dates, certs, degrees.
- **Level 1–2:** allow reframing and aspirational “in progress/assisted” phrasing, not false claims.
- **Evidence meter:** each strong claim links to a fact in your history (or is labeled as “learning/in progress”).
- **Truth linting:** Reviewer flags risky language before export.

### Job Sources Strategy

- **Start:** user paste + official/company boards + RSS/sitemaps.
- **Grow:** add connectors where TOS allows; “Bring-Your-Own-Login” via local extension for LinkedIn/Indeed/Zing/Xing if feasible.
- **Never store:** third-party credentials server-side; keep anything sensitive client/local.

### Platform Notes (non-Azure-locked)

- **Backend:** .NET + PostgreSQL + Redis (host anywhere).
- **Storage:** S3-compatible or Azure Blob (configurable).
- **Vectors:** pgvector or an external vector DB (swap).
- **LLM:** OpenAI primary with abstraction to swap (OpenRouter, Azure OpenAI, etc.).
- **Doc gen:** Start HTML→PDF; upgrade to DOCX+PDF in V3.

### What you get by version

- **V0–V1.5:** Fully agentic generation with auto decisions + basic coaching + quick manual export.
- **V2–V3.5:** Serious application CRM + robust documents + safer, faster submission.
- **V4–V5.5:** Deep research, multimedia company packs, proactive job radar, real gap closure.
- **V6–V7:** Automation at scale + mentor collaborations.
- **V8–V10:** Team features, rich integrations, mobile.
