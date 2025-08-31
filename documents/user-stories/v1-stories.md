# V1 – Auto-Decider & Reality Index

**Epic:** The system automatically decides persona, style, and template; adds a “Reality Index” dial with strict truth guardrails; explains its choices like a coach.

Goal: Remove manual choices. Users paste a JD and receive **auto-decided**, **ethically tuned**, and **explained** outputs.

---

## User Story 1 – Auto Persona (No Fixed Roles)

**As a** job seeker  
**I want** the system to infer my best-fit persona for each JD automatically  
**So that** I don’t have to pre-define or select target roles.

### Acceptance Criteria

- [ ] Given a base CV and JD, the system infers a latent persona (e.g., “Product-leaning”, “Customer-Success-leaning”, “Data-curious PM”) without user input.
- [ ] Persona selection is shown in the explanation panel with top 3 signals (e.g., recent roles, skills, project types).
- [ ] If signals are weak/ambiguous, the system defaults to a generalist persona and states this in the explanation.
- [ ] Persona inference **never** adds roles or titles not present in user history.

---

## User Story 2 – Auto Style & Template Choice

**As a** job seeker  
**I want** the system to pick the document style and structure automatically  
**So that** I get a ready, ATS-friendly draft without choosing templates.

### Acceptance Criteria

- [ ] The system selects section order, headings, and emphasis depth suitable for the JD and persona.
- [ ] Default tone: concise, impact-first, ATS-friendly; language matches JD language.
- [ ] The explanation panel lists _why_ this style fits (e.g., “enterprise JD → quant bullets + concise summary”).
- [ ] User may optionally toggle “More Detail / More Concise” without choosing a whole template.

---

## User Story 3 – Reality Index Dial (0–2)

**As a** job seeker  
**I want** a dial that controls how strictly my documents adhere to factual claims  
**So that** I can emphasize strengths without crossing ethical lines.

### Acceptance Criteria

- [ ] **RI=0 (Facts-Only):** Only verifiable facts from CV; no extrapolation; no “in progress”.
- [ ] **RI=1 (Reframe & Quantify):** Rephrase for impact, quantify using provided metrics, combine related facts; no new facts.
- [ ] **RI=2 (Aspirational Phrasing):** Allowed _only_ as “learning/in progress/assisted by team”; no invented roles/titles/dates/certs.
- [ ] RI level shown in the UI; default = 1.
- [ ] Attempting RI>2 is blocked with a clear message.

---

## User Story 4 – Claim Provenance (Fact Links)

**As a** job seeker  
**I want** strong claims in my CV/CL to link back to source facts  
**So that** I can trust the output and edit quickly.

### Acceptance Criteria

- [ ] Each strong achievement bullet has a hidden annotation mapping to a resume fact ID.
- [ ] Hover/expand reveals the source role/project/metric.
- [ ] If no supporting fact exists, the Reviewer flags the sentence and suggests a compliant rewrite.

---

## User Story 5 – Decision Explainability

**As a** job seeker  
**I want** to understand why the system chose persona, tone, and emphasis  
**So that** I can learn and (optionally) adjust.

### Acceptance Criteria

- [ ] An “Explain” panel summarizes: chosen persona, top signals, tone rationale, key JD keywords emphasized.
- [ ] Shows up to 5 “switches” (e.g., “Emphasize customer wins / product metrics / leadership”) that re-generate in place.
- [ ] Toggling switches respects the current Reality Index and guardrails.

---

## User Story 6 – Writer + Reviewer Handshake

**As a** job seeker  
**I want** the final draft to pass a truth/ATS lint  
**So that** it is safe and scannable.

### Acceptance Criteria

- [ ] Reviewer removes or rewrites any phrasing that implies invented roles/dates/certs.
- [ ] Flags buzzword stuffing (>3 repeats of the same keyword).
- [ ] Ensures bullets begin with action verbs, contain outcome/metric when available, and stay under 2 lines (guideline).

---

## User Story 7 – Coaching Nudges (Per-JD)

**As a** job seeker  
**I want** short, actionable coaching notes tied to the JD  
**So that** I know how to improve my odds immediately.

### Acceptance Criteria

- [ ] After generation, show 3–5 bullets: what to stress, what to trim, 1 gap to address this week.
- [ ] Advice references JD themes (e.g., “stakeholder mgmt,” “OKR delivery”).
- [ ] No suggestion includes fabricating credentials.

---

## User Story 8 – Ambiguity & Language Handling

**As a** job seeker  
**I want** graceful handling when the JD is ambiguous or in a different language  
**So that** I still get a safe, useful draft.

### Acceptance Criteria

- [ ] If JD is ambiguous, the system generates a generalist version and lists missing info it would normally use.
- [ ] If JD language ≠ CV language, the system writes in the JD language and notes this in the explanation.
- [ ] If the CV lacks key sections, the system requests them _inline_ (single prompt), but still generates a minimal draft.

---

## User Story 9 – Decision Log (For Each Application)

**As a** job seeker  
**I want** the system’s decisions stored with the application  
**So that** I can review what worked later.

### Acceptance Criteria

- [ ] Each generated application stores: persona name, reality index, top 5 signals, emphasized keywords.
- [ ] Log is viewable from the application detail.
- [ ] Logs contain no sensitive model prompts or secrets; only explanations and settings.

---

## User Story 10 – Quality & Safety Gates

**As a** job seeker  
**I want** hard safety rules enforced before I export  
**So that** I never accidentally submit risky content.

### Acceptance Criteria

- [ ] Hard block on invented employers/titles/dates/certs (regex + provenance check).
- [ ] If any block triggers, user sees clear reasons and one-click “Fix & regenerate”.
- [ ] Final drafts include an internal “safety-passed” tag before they can be saved to the application.

---

## Non-Functional Requirements (V1)

- **Performance:** Auto-decide + generate within 15s p95 for a typical 700–1200 word JD.
- **i18n:** Support at least English + German detection and output.
- **Privacy:** No third-party credentials stored; PII encrypted at rest; per-application deletion supported.
- **Auditability:** Decision logs retained with the application, exportable as JSON.

---

## Out of Scope for V1 (Tracked in Later Versions)

- Full Kanban tracker, reminders, and dedup (V2).
- DOCX/PDF rendering (V3).
- Company brochures and interview hub (V4).
- Job Radar connectors (V2.5+).
