# V7 – Collaboration & Mentorship

**Epic:** Allow users to share anonymized application packages with mentors or peers for feedback.  
Goal: Extend the companion into a collaborative tool, enabling outside perspective and mentorship while keeping user data safe.

---

## User Story 1 – Share Application (Anonymized)

**As a** job seeker  
**I want** to share an application package with a mentor  
**So that** I can receive feedback without exposing sensitive personal info.

### Acceptance Criteria

- [ ] Application can be exported with anonymization (replace name, email, phone with placeholders).
- [ ] Shared package includes: JD snapshot, generated CV/CL (anonymized), coaching notes.
- [ ] Exportable as share link (read-only) or PDF.
- [ ] User decides what to include/exclude.

---

## User Story 2 – Mentor Access via Link

**As a** mentor  
**I want** to open a shared application via secure link  
**So that** I can review it without needing an account.

### Acceptance Criteria

- [ ] Share link protected with token (expires in 7 days by default).
- [ ] Link opens read-only web view with docs and notes.
- [ ] Mentor cannot see user personal identifiers (if anonymized).
- [ ] User can revoke link at any time.

---

## User Story 3 – Commenting on Applications

**As a** mentor  
**I want** to leave comments on a shared application  
**So that** I can give targeted feedback.

### Acceptance Criteria

- [ ] Mentors can highlight text in CV/CL and add inline comments.
- [ ] Comments stored in shared version only (not altering original doc).
- [ ] User notified when new comments are added.
- [ ] User can reply or resolve comments.

---

## User Story 4 – Feedback Dashboard

**As a** job seeker  
**I want** to see all mentor feedback in one place  
**So that** I can act on suggestions.

### Acceptance Criteria

- [ ] Feedback tab in Application Detail shows all comments.
- [ ] Comments grouped by mentor and section (CV, CL, JD, notes).
- [ ] User can mark feedback as “addressed”.
- [ ] Feedback history preserved even if resolved.

---

## User Story 5 – Invite Trusted Mentors

**As a** job seeker  
**I want** to invite a mentor for recurring reviews  
**So that** they can access my applications more easily.

### Acceptance Criteria

- [ ] User can send invite to mentor email.
- [ ] Mentor gets limited-access account (view/comment only).
- [ ] User decides which applications are visible to mentor.
- [ ] Mentor cannot access unrelated user data.

---

## User Story 6 – Mentor Suggestions in Coaching Flow

**As a** job seeker  
**I want** mentor suggestions integrated with coaching tips  
**So that** I can balance AI and human advice.

### Acceptance Criteria

- [ ] Coaching panel shows mentor suggestions alongside AI coaching notes.
- [ ] Notes labeled clearly as “Mentor Feedback” vs “AI Coaching”.
- [ ] User can filter or merge advice.
- [ ] Mentors see anonymized context when providing suggestions.

---

## User Story 7 – Peer Review Mode

**As a** job seeker  
**I want** to share my applications with peers (not only mentors)  
**So that** I can crowdsource quick feedback.

### Acceptance Criteria

- [ ] User can generate public read-only link with comment permissions.
- [ ] Comments require email capture (to identify peer).
- [ ] Public links expire within 72 hours.
- [ ] Peer feedback separated from mentor feedback in dashboard.

---

## User Story 8 – Feedback Analytics

**As a** job seeker  
**I want** to see patterns in mentor/peer feedback  
**So that** I understand recurring strengths/weaknesses.

### Acceptance Criteria

- [ ] System clusters feedback by theme (e.g., “Too long summary”, “Add metrics”).
- [ ] Dashboard shows top 3 recurring strengths and weaknesses.
- [ ] Exportable summary per month.

---

## User Story 9 – Mentor Coaching Notes

**As a** mentor  
**I want** to leave general career advice  
**So that** I can guide the user beyond one application.

### Acceptance Criteria

- [ ] Mentors can leave free-form notes not tied to a specific doc.
- [ ] Notes appear in a separate “Mentor Advice” section.
- [ ] User can tag advice as “active” or “archived”.
- [ ] Archived advice still viewable historically.

---

## User Story 10 – Privacy & Revocation

**As a** job seeker  
**I want** full control over shared data  
**So that** I can protect my privacy.

### Acceptance Criteria

- [ ] User can revoke any share link at any time.
- [ ] Revoked link immediately becomes invalid.
- [ ] Mentors cannot copy or export anonymized data unless explicitly allowed by user.
- [ ] Sharing logs visible in settings (who accessed, when).

---

## Non-Functional Requirements (V7)

- **Performance:** Shared app view loads < 3s.
- **Security:** Share links tokenized & time-limited.
- **Privacy:** Anonymization mandatory unless user overrides.
- **Auditability:** All access events logged.
- **Interoperability:** Comments stored separately, do not alter originals.

---

## Out of Scope for V7

- Team/enterprise shared workspaces (V8).
- Knowledge vault integrations (V9).
- Mobile push for mentor feedback (V10).
