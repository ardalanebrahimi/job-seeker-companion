# V4 – Company Brochure & Interview Hub

**Epic:** Provide rich company insights (brochure-style) and structured interview preparation support.  
Goal: Help users prepare beyond documents — with **context, insights, and practice tools**.

---

## User Story 1 – Company Snapshot (Basic Card)

**As a** job seeker  
**I want** a concise snapshot of the company  
**So that** I quickly understand who they are.

### Acceptance Criteria

- [ ] Snapshot includes: name, logo, website, industry, size, HQ location.
- [ ] Snapshot includes 2–3 sentence summary of products/services.
- [ ] Snapshot includes recent news or public signals (funding, expansion).
- [ ] Stored with the application record for later reference.

---

## User Story 2 – Multimedia Brochure

**As a** job seeker  
**I want** a richer “brochure-style” company profile  
**So that** I get visual and narrative context.

### Acceptance Criteria

- [ ] Includes images (logo, product visuals if available, office map).
- [ ] Includes short timeline of company milestones (founded year, key launches).
- [ ] Categorized into sections: Products, Market, Culture, News.
- [ ] Exportable as a prep document (PDF).
- [ ] Stored in application history.

---

## User Story 3 – Role-Specific Fit Brief

**As a** job seeker  
**I want** a summary of how my profile fits this company and role  
**So that** I know what to emphasize in interviews.

### Acceptance Criteria

- [ ] Brief highlights 3–5 reasons why the user matches the JD + company.
- [ ] Explicitly links profile skills to company needs (e.g., “experience in SaaS → matches product-led culture”).
- [ ] Tone: coaching style, supportive.
- [ ] Saved as part of the brochure pack.

---

## User Story 4 – Interview Prep Pack

**As a** job seeker  
**I want** an auto-generated prep pack  
**So that** I can practice before my interview.

### Acceptance Criteria

- [ ] Prep pack includes: company snapshot, fit brief, STAR story suggestions.
- [ ] STAR stories generated from resume facts aligned to JD themes (3–5 stories).
- [ ] Pack exported as PDF for offline review.
- [ ] Accessible from Application Detail.

---

## User Story 5 – STAR Story Generator

**As a** job seeker  
**I want** to generate STAR-format stories from my history  
**So that** I can answer behavioral questions more effectively.

### Acceptance Criteria

- [ ] For each major JD requirement, generate 1 STAR story.
- [ ] STAR = Situation, Task, Action, Result (all populated).
- [ ] Story grounded strictly in user facts.
- [ ] “Reality Index” applied: reframe/quantify but never invent roles/dates.
- [ ] User can edit STAR stories in-app.

---

## User Story 6 – Likely Questions List

**As a** job seeker  
**I want** a list of likely interview questions  
**So that** I can prepare focused answers.

### Acceptance Criteria

- [ ] 5–10 role-specific questions predicted from JD themes.
- [ ] 3–5 company-specific questions (culture, strategy, values).
- [ ] 2–3 behavioral questions.
- [ ] Linked to STAR stories when possible.
- [ ] Exported as part of the prep pack.

---

## User Story 7 – Interview Notes

**As a** job seeker  
**I want** to take notes after interviews  
**So that** I keep a record of what happened.

### Acceptance Criteria

- [ ] Notes field in Application Detail → “Interview Notes”.
- [ ] Each note is timestamped and can be edited.
- [ ] Notes are stored alongside the application.
- [ ] Exportable with the application history.

---

## User Story 8 – Feedback Log

**As a** job seeker  
**I want** to log feedback from interviews  
**So that** I track improvement areas.

### Acceptance Criteria

- [ ] “Feedback” entry type in Application Detail.
- [ ] Linked to interview date.
- [ ] Coaching Agent adds 1–2 suggestions based on feedback log.
- [ ] Feedback searchable in the tracker.

---

## User Story 9 – Thank-You Email Generator

**As a** job seeker  
**I want** to generate a thank-you email after interviews  
**So that** I can follow up professionally.

### Acceptance Criteria

- [ ] Email template includes: greeting, 2–3 personalized sentences, closing.
- [ ] Personalized with role title, interviewer/company name (if known).
- [ ] User can edit before copy/export.
- [ ] Export as text or email draft (future integration).

---

## User Story 10 – Coaching Companion in Interview Hub

**As a** job seeker  
**I want** coaching suggestions in the interview hub  
**So that** I stay focused and improve iteratively.

### Acceptance Criteria

- [ ] Hub sidebar shows motivational advice + 1 practice suggestion.
- [ ] Advice references feedback logs and STAR story gaps.
- [ ] Suggestions update dynamically when new notes are added.

---

## Non-Functional Requirements (V4)

- **Performance:** Company snapshot fetch/render < 5s.
- **Data sources:** Only public/company-provided information; no scraping behind logins.
- **Formatting:** All brochures/prep packs exportable to PDF.
- **Storage:** Company data cached for reuse across applications.
- **Privacy:** Interview notes and feedback encrypted and user-only.

---

## Out of Scope for V4

- Daily job radar (V5).
- Automation rules (V6).
- Mentor sharing (V7).
