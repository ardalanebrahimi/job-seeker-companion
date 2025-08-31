# V0 – Seed MVP User Stories

**Epic:** Upload CV, paste job description, and generate tailored documents.  
Goal: Prove end-to-end flow with minimum friction.

---

## User Story 1 – Upload Base CV

**As a** job seeker  
**I want to** upload my base CV file (DOCX or PDF)  
**So that** the system has my history available for tailoring applications.

### Acceptance Criteria

- [ ] User can upload one CV file.
- [ ] File is parsed into structured facts (roles, skills, education).
- [ ] If parsing fails, raw file is still stored.
- [ ] User can view stored CV content (preview).

---

## User Story 2 – Paste Job Description

**As a** job seeker  
**I want to** paste a job description (text or URL)  
**So that** the system can analyze the requirements.

### Acceptance Criteria

- [ ] User can paste raw text.
- [ ] User can paste a URL (system fetches page content).
- [ ] JD is cleaned and stored as text.
- [ ] JD requirements (skills, experience, role title) are extracted.

---

## User Story 3 – Generate Tailored CV

**As a** job seeker  
**I want to** generate a tailored CV for a pasted job description  
**So that** I can increase my chance of being noticed.

### Acceptance Criteria

- [ ] Generated CV contains only real facts from user CV.
- [ ] Key achievements are rephrased to highlight JD-relevant skills.
- [ ] Output available as Markdown/HTML (manual copy).
- [ ] Reviewer Agent ensures no fabricated data is included.

---

## User Story 4 – Generate Tailored Cover Letter

**As a** job seeker  
**I want to** receive a tailored cover letter draft  
**So that** I can apply with a personalized application.

### Acceptance Criteria

- [ ] Letter is one page (3 paragraphs).
- [ ] Mentions role title and company (from JD).
- [ ] Highlights 2–3 skills/achievements from the CV.
- [ ] Uses neutral salutation if hiring manager unknown.
- [ ] Output available as Markdown/HTML (manual copy).

---

## User Story 5 – Store Application

**As a** job seeker  
**I want to** store the generated CV, cover letter, and job description together  
**So that** I can track my applications.

### Acceptance Criteria

- [ ] Application record is created automatically after generation.
- [ ] Application contains JD snapshot + CV draft + CL draft.
- [ ] User can add a manual note.
- [ ] Status defaults to "Found".

---

## User Story 6 – Coaching Tips

**As a** job seeker  
**I want to** see short actionable tips after generating docs  
**So that** I know how to improve my chances.

### Acceptance Criteria

- [ ] System generates 3–5 bullet-point tips.
- [ ] Tips focus on relevance, missing skills, or phrasing.
- [ ] No fabricated credentials are suggested.

---

## Stretch Story – Minimal Tracker View

**As a** job seeker  
**I want to** view my saved applications in a simple list  
**So that** I can see what I’ve generated so far.

### Acceptance Criteria

- [ ] List shows company name, role title, date generated.
- [ ] Clicking entry opens stored CV/CL + JD snapshot.
