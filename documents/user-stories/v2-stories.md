# V2 – Application Tracker & Deduplication

**Epic:** Introduce an Application Tracker with statuses, reminders, and deduplication of already-seen or applied jobs.  
Goal: Move from “document generator” to a **lightweight CRM for job applications**, enabling users to organize their job search history.

---

## User Story 1 – Application Statuses

**As a** job seeker  
**I want** to mark applications with statuses  
**So that** I can see the progress of each job in my pipeline.

### Acceptance Criteria

- [ ] Supported statuses: **Found, Applied, Interview, Offer, Rejected**.
- [ ] New applications default to **Found**.
- [ ] Status can be changed manually from detail or list view.
- [ ] Status change automatically logged with timestamp.
- [ ] Status icons/labels visible in the tracker view.

---

## User Story 2 – Application List (Tracker View)

**As a** job seeker  
**I want** to see all my saved applications in a list view  
**So that** I can quickly review them and open details.

### Acceptance Criteria

- [ ] List shows: Company, Job Title, Status, Date Added.
- [ ] Clicking an entry opens Application Detail.
- [ ] List supports basic sorting (by status, date added).
- [ ] Applications are paginated or lazy-loaded.

---

## User Story 3 – Application Detail

**As a** job seeker  
**I want** to view all information and documents for one application  
**So that** I can prepare for follow-ups or interviews.

### Acceptance Criteria

- [ ] Detail shows: Job description snapshot, tailored CV(s), tailored CL(s).
- [ ] Notes field for free text.
- [ ] History log: status changes, notes added.
- [ ] Reality Index, persona, and decisions from V1 are included.
- [ ] User can download CV/CL (in this version still Markdown/HTML, PDF comes V3).

---

## User Story 4 – Notes on Applications

**As a** job seeker  
**I want** to add notes to applications  
**So that** I can track reminders, insights, or interview feedback.

### Acceptance Criteria

- [ ] Notes field is editable in Application Detail.
- [ ] Each note is timestamped.
- [ ] Notes can be edited or deleted.
- [ ] Notes are stored alongside the application record.

---

## User Story 5 – Reminders for Applications

**As a** job seeker  
**I want** to set reminders on applications  
**So that** I don’t miss follow-ups or interviews.

### Acceptance Criteria

- [ ] User can set a reminder date/time for an application.
- [ ] Reminder appears in a “Upcoming Tasks” panel.
- [ ] Notifications are batched (no spam).
- [ ] After reminder passes, it is archived into the log.

---

## User Story 6 – Deduplication: Already Seen Jobs

**As a** job seeker  
**I want** jobs I’ve already seen to be marked as duplicates  
**So that** I don’t waste time analyzing or applying twice.

### Acceptance Criteria

- [ ] When a new JD is pasted/fetched, system compares it against history.
- [ ] Dedup check: Company + Role Title + Location + content similarity > 85%.
- [ ] If duplicate → show banner “You’ve seen this before” with link to existing record.
- [ ] User can override and save as a new application manually.

---

## User Story 7 – Deduplication: Already Applied Jobs

**As a** job seeker  
**I want** jobs I’ve already applied for to be recognized  
**So that** I don’t accidentally apply again.

### Acceptance Criteria

- [ ] If status = Applied/Interview/Offer/Rejected for a similar job, system auto-flags.
- [ ] Duplicate flagged with message “You already applied here”.
- [ ] User can override manually if JD is truly new.
- [ ] Override must be logged in application history.

---

## User Story 8 – Search & Filter in Tracker

**As a** job seeker  
**I want** to search and filter my applications  
**So that** I can focus on what matters right now.

### Acceptance Criteria

- [ ] Filters: by status, by date, by company.
- [ ] Search: keyword match in company, title, notes.
- [ ] Filters and search can be combined.
- [ ] Results update in under 2s.

---

## User Story 9 – Coaching Hints in Tracker

**As a** job seeker  
**I want** coaching hints connected to my applications  
**So that** I get guidance on next steps.

### Acceptance Criteria

- [ ] Each application card shows one “next step hint” (e.g., “Follow up in 3 days”).
- [ ] Hints are generated based on status and notes.
- [ ] User can dismiss hints; dismissed hints do not return for that application.

---

## User Story 10 – Export Applications

**As a** job seeker  
**I want** to export my applications list  
**So that** I can keep a backup or share with mentors.

### Acceptance Criteria

- [ ] Export as CSV/JSON.
- [ ] Contains: Company, Title, Status, Dates, Notes, Generated Docs URIs.
- [ ] Export initiated manually from Tracker view.

---

## Non-Functional Requirements (V2)

- **Performance:** Tracker list loads 20 items < 2s.
- **Storage:** All applications stored in DB with encrypted user data.
- **Dedup:** Fuzzy match must run under 1s per JD check.
- **Privacy:** Users can delete an application → all linked docs & notes deleted.
- **Auditability:** Every status change and reminder is timestamped and visible in history.

---

## Out of Scope for V2

- DOCX/PDF rendering (V3).
- Company brochures (V4).
- Job Radar (V2.5+).
