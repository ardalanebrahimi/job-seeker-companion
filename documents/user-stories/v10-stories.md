# V10 – Mobile & Notifications

**Epic:** Deliver a seamless mobile-first experience with push notifications, quick-apply flows, and on-the-go interview prep.  
Goal: Make Job Companion fully usable from a smartphone, enabling quick action anywhere.

---

## User Story 1 – Mobile App Access

**As a** job seeker  
**I want** a mobile app (iOS/Android)  
**So that** I can use Job Companion on the go.

### Acceptance Criteria

- [ ] Mobile app built using Capacitor/Ionic or native wrappers.
- [ ] Login with same account as web.
- [ ] Core features available: Apply Queue, Tracker, Coaching, Notifications.
- [ ] Layout optimized for mobile (responsive design).

---

## User Story 2 – Push Notifications for New Jobs

**As a** job seeker  
**I want** to get notified when new jobs appear in my Apply Queue  
**So that** I never miss fresh opportunities.

### Acceptance Criteria

- [ ] Notifications sent when Apply Queue is generated (default daily).
- [ ] Notification preview includes: Company, Role, Location, Fit Score.
- [ ] Tapping notification opens job detail in app.
- [ ] Notifications can be snoozed or turned off in settings.

---

## User Story 3 – Push Notifications for Reminders

**As a** job seeker  
**I want** to be reminded of interviews or tasks  
**So that** I stay on track with my job search.

### Acceptance Criteria

- [ ] Reminders trigger push notifications at scheduled time.
- [ ] Notifications include action (e.g., “Prep STAR stories”).
- [ ] User can mark reminder as “Done” directly from notification.
- [ ] All actions logged in tracker.

---

## User Story 4 – Quick Apply from Mobile

**As a** job seeker  
**I want** to apply to jobs with two taps from my phone  
**So that** I can act fast.

### Acceptance Criteria

- [ ] Apply Queue items have “Generate & Save” button.
- [ ] Generates tailored CV + CL (DOCX/PDF) using V1–V3 pipeline.
- [ ] Application record created with status “Found”.
- [ ] Docs downloadable or shareable from mobile (e.g., upload to ATS).

---

## User Story 5 – Offline Access

**As a** job seeker  
**I want** offline access to my saved applications and docs  
**So that** I can prepare without internet.

### Acceptance Criteria

- [ ] Last 10 applications cached offline.
- [ ] Includes JD, CV, CL, coaching notes.
- [ ] Offline mode clearly indicated.
- [ ] Syncs automatically when back online.

---

## User Story 6 – Voice Notes

**As a** job seeker  
**I want** to record voice notes after interviews  
**So that** I can capture thoughts quickly.

### Acceptance Criteria

- [ ] User can record short audio note (max 3 min).
- [ ] Notes linked to application and timestamped.
- [ ] Voice notes transcribed automatically.
- [ ] Both audio + text stored securely.

---

## User Story 7 – Mobile Interview Prep Mode

**As a** job seeker  
**I want** a mobile-friendly prep mode  
**So that** I can review key info before interviews.

### Acceptance Criteria

- [ ] Prep mode shows company snapshot, STAR stories, likely questions.
- [ ] Optimized for mobile screen (card layout).
- [ ] Works offline if cached beforehand.
- [ ] Launchable directly from reminder notification.

---

## User Story 8 – Mobile Coaching Companion

**As a** job seeker  
**I want** coaching tips in mobile notifications and app  
**So that** I stay motivated.

### Acceptance Criteria

- [ ] Daily coaching tip shown on dashboard.
- [ ] Push notification once/week with personalized advice.
- [ ] Tips reference user’s gaps, progress, or feedback trends.
- [ ] User can save tips as notes.

---

## User Story 9 – Mobile-Friendly Analytics

**As a** job seeker  
**I want** to see simple charts on my phone  
**So that** I can track progress on the go.

### Acceptance Criteria

- [ ] Mobile dashboard shows callback rate, interview rate, offer rate.
- [ ] Charts simplified (bar/line).
- [ ] Data filters preserved from web.
- [ ] Refresh runs under 3s.

---

## User Story 10 – Notifications Management

**As a** job seeker  
**I want** to control notification settings in the app  
**So that** I only get alerts I care about.

### Acceptance Criteria

- [ ] User can toggle notifications: jobs, reminders, coaching tips, digests.
- [ ] Frequency options: instant, batched daily, off.
- [ ] Settings synced between web and mobile.
- [ ] Defaults: jobs/reminders ON, coaching/digest weekly.

---

## Non-Functional Requirements (V10)

- **Performance:** Mobile app loads dashboard < 3s.
- **Offline:** Cached apps sync without data loss.
- **Security:** Voice notes/audio encrypted.
- **Notifications:** Must work on iOS + Android (via FCM/APNs).
- **Consistency:** Web and mobile state synchronized.

---

## Out of Scope for V10

- Real-time chat with mentors (future extension).
- Enterprise mobile dashboards (beyond V8 scope).
