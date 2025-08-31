# V6 – Automations & Rules

**Epic:** Automate repetitive job-seeking tasks with configurable rules and scheduled actions.  
Goal: Let the companion act more proactively — suggesting, batching, and guiding applications — while keeping the user in control.

---

## User Story 1 – Rules Engine

**As a** job seeker  
**I want** to define simple “if-then” rules  
**So that** the system can adjust behavior automatically for me.

### Acceptance Criteria

- [ ] User can create rules in the format: **IF [condition] THEN [action]**.
- [ ] Conditions: job title contains X, company size > Y, location = Z, JD mentions skill K.
- [ ] Actions: choose persona, set Reality Index, select template style, auto-archive.
- [ ] Rules can be toggled on/off.
- [ ] Logs stored with applications showing which rules were applied.

---

## User Story 2 – Morning Digest

**As a** job seeker  
**I want** a daily digest of new jobs and tasks  
**So that** I have one consolidated view instead of constant notifications.

### Acceptance Criteria

- [ ] Digest generated at user-configured time (default: 8am).
- [ ] Digest includes: new jobs found, Apply Queue, reminders due today, coaching notes.
- [ ] Digest view accessible from Dashboard.
- [ ] Notifications sent as one push/email (not multiple alerts).

---

## User Story 3 – Apply Queue Auto-Preprocessing

**As a** job seeker  
**I want** jobs in my Apply Queue to be pre-processed with AI scoring  
**So that** I can focus on the best matches.

### Acceptance Criteria

- [ ] Each job pre-labeled: Strong Fit / Medium Fit / Weak Fit.
- [ ] Fit score visible in Apply Queue card.
- [ ] Coach Agent provides 1 sentence justification for each label.
- [ ] Strong Fit jobs pinned to top of queue.

---

## User Story 4 – Auto Persona Assignment

**As a** job seeker  
**I want** personas assigned automatically via rules  
**So that** I don’t have to review them for each job.

### Acceptance Criteria

- [ ] Rules engine can assign personas without user input.
- [ ] Persona shown in application record with “(auto-assigned by rule)”.
- [ ] User can override manually; override logged.
- [ ] Conflicts (multiple rules triggered) resolved by priority order.

---

## User Story 5 – Reality Index Auto-Setting

**As a** job seeker  
**I want** Reality Index set automatically by rules  
**So that** I get the right level of aspiration without tweaking.

### Acceptance Criteria

- [ ] Rules can set RI=0,1,2 based on JD conditions.
- [ ] Default = 1 unless overridden by rules.
- [ ] Application record logs chosen RI and rule trigger.
- [ ] Reviewer ensures guardrails still enforced.

---

## User Story 6 – Auto-Archive Irrelevant Jobs

**As a** job seeker  
**I want** irrelevant jobs auto-archived  
**So that** my queue stays clean.

### Acceptance Criteria

- [ ] Rules can archive jobs if conditions match (e.g., location not in EU, job seniority mismatch).
- [ ] Archived jobs hidden from queue and digest by default.
- [ ] User can view “Auto-archived” list and restore jobs manually.
- [ ] All auto-archive actions logged.

---

## User Story 7 – Interview Reminder Automation

**As a** job seeker  
**I want** reminders created automatically when I set interviews  
**So that** I never forget preparation.

### Acceptance Criteria

- [ ] When user logs interview date/time → Scheduler creates reminder 24h before.
- [ ] Reminder added to digest and calendar export.
- [ ] Reminder includes quick prep checklist (STAR stories + company brochure).
- [ ] User can adjust or dismiss reminder.

---

## User Story 8 – Coaching Task Suggestions

**As a** job seeker  
**I want** the system to generate proactive coaching tasks  
**So that** I keep improving between applications.

### Acceptance Criteria

- [ ] Coaching Agent reviews gaps across all applications.
- [ ] Generates up to 3 actionable tasks per week (e.g., “Write 1 STAR story on leadership”).
- [ ] Tasks appear in digest and dashboard.
- [ ] User can complete/dismiss tasks; history logged.

---

## User Story 9 – Notification Batching

**As a** job seeker  
**I want** notifications batched into fewer alerts  
**So that** I’m not overwhelmed.

### Acceptance Criteria

- [ ] All notifications grouped into digest or single daily push/email.
- [ ] Urgent events (interview in <24h) can trigger separate alert.
- [ ] User can configure batch window (e.g., once/day, twice/day).
- [ ] Notification preferences stored per user.

---

## User Story 10 – Automation Logs

**As a** job seeker  
**I want** to see why an automation was triggered  
**So that** I trust the system and can adjust rules.

### Acceptance Criteria

- [ ] Each automated action (persona, RI, archive, reminder) logged with timestamp.
- [ ] Log entry shows rule ID and condition matched.
- [ ] Logs accessible from Application Detail and global “Automation Log”.
- [ ] User can disable a rule directly from the log entry.

---

## Non-Functional Requirements (V6)

- **Performance:** Rules evaluated in < 500ms per job.
- **Scalability:** Handle up to 500 new jobs/day with rules applied.
- **Transparency:** All automation must be explainable (log entries visible).
- **Safety:** No automation can bypass Reviewer guardrails (no fabrications).
- **Privacy:** Automation logs stored per user only.

---

## Out of Scope for V6

- Multi-persona simulation & A/B testing (V6.5).
- Mentor sharing (V7).
- Team workspaces (V8).
