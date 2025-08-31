# Job Companion – Agents

## Overview

Job Companion is not just a tool — it is an **AI-powered companion**.  
The system is designed as a set of **specialized agents**, each with a clear responsibility, orchestrated by a **Supervisor Agent**.

This agentic architecture allows the app to act like a coach, researcher, writer, and tracker simultaneously.

---

## Core Agents

### 1. **Planner Agent**

- **Role**: Decides _how to approach each job application_.
- **Inputs**: Job description, user CV, company snapshot, reality index.
- **Tasks**:
  - Infer best-fit persona (no fixed target roles).
  - Choose CV + cover letter strategy automatically.
  - Set parameters for Writer (tone, emphasis, level of aspiration).
  - Explain reasoning to the user in simple terms.

---

### 2. **Researcher Agent**

- **Role**: Gathers and structures external information.
- **Inputs**: Job link/text, company name, market signals.
- **Tasks**:
  - Parse job postings (title, requirements, skills, benefits).
  - Build company snapshots: summary, products, culture, recent news.
  - Enrich with structured data: size, locations, trends.
  - Provide insights for coaching (e.g., “This company values metrics-driven culture”).

---

### 3. **Writer Agent**

- **Role**: Generates the tailored **CV** and **cover letter**.
- **Inputs**: Resume facts, job requirements, Planner parameters.
- **Tasks**:
  - Rewrite achievements to align with JD priorities.
  - Insert role-specific keywords naturally.
  - Keep within “Reality Index” boundaries (no fabrications).
  - Produce multiple variants if needed (tight / balanced / extended).

---

### 4. **Reviewer Agent**

- **Role**: Guardrails + quality check.
- **Inputs**: Generated CV/CL drafts.
- **Tasks**:
  - Verify claims are backed by user facts.
  - Flag risky or misleading phrasing.
  - Check formatting consistency (ATS-friendly).
  - Highlight _why_ this version is strong or where it can be improved.

---

### 5. **Coach Agent**

- **Role**: Acts as the user’s **career companion**.
- **Inputs**: Application history, job gaps, company research.
- **Tasks**:
  - Give **practical tips** for each application.
  - Provide **gap → roadmap**: what to learn, how to prepare.
  - Suggest STAR interview stories from user history.
  - Encourage persistence and track emotional progress (motivational layer).

---

### 6. **Archivist Agent**

- **Role**: Handles knowledge & history.
- **Inputs**: All past applications, generated docs, statuses.
- **Tasks**:
  - Store every CV/CL variant with timestamps.
  - Deduplicate jobs already seen or applied.
  - Track outcomes (offer, rejection, ghosted).
  - Provide analytics (e.g., “CV version X → 40% higher callback”).

---

### 7. **Scheduler Agent**

- **Role**: Manages tasks, reminders, and interviews.
- **Inputs**: Application tracker events, calendar integration.
- **Tasks**:
  - Remind user of deadlines, follow-ups, interview dates.
  - Generate task lists (e.g., “3 jobs found today – ready to apply”).
  - Sync with calendars (ICS export, optional Google/Outlook).
  - Batch notifications to avoid overwhelm.

---

## Supervisor Agent

- **Role**: Orchestrates all agents.
- **Workflow Example**:
  1. **Researcher** parses job link → structured JD + company snapshot.
  2. **Planner** decides persona & tone.
  3. **Writer** drafts CV + cover.
  4. **Reviewer** validates + scores output.
  5. **Archivist** saves artifacts & links them to the application.
  6. **Coach** provides advice & gap roadmap.
  7. **Scheduler** sets reminders for next steps.

---

## Guardrails

- **Truth-first principle**: No invented jobs, titles, dates, or credentials.
- **Reality Index** (0–2): Adjusts tone from factual → aspirational (with guardrails).
- **Explainability**: Each agent should justify major decisions (why this persona, why these skills).
- **Privacy**: Data stored securely, deletable on request (GDPR ready).

---

## Future Additions

- **Mentor Agent**: Share anonymized applications with friends/mentors for review.
- **Market Agent**: Track industry/job trends to suggest proactive learning.
- **Collaboration Agent**: Multi-user mode for career coaches or job centers.
