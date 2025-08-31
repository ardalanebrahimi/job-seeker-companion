# V3 – Professional Document Generation

**Epic:** Move from Markdown/HTML drafts to professional **DOCX/PDF document generation** with multiple variants and clear diffs.  
Goal: Deliver high-quality, export-ready CVs and cover letters that can be submitted directly.

---

## User Story 1 – DOCX Generation

**As a** job seeker  
**I want** my tailored CV and cover letter in DOCX format  
**So that** I can edit them in Word or Google Docs before applying.

### Acceptance Criteria

- [ ] System fills pre-defined DOCX templates with user content.
- [ ] Generated DOCX retains correct formatting (headings, bullet points, alignment).
- [ ] CV includes sections: Summary, Skills, Experience, Education, Certifications.
- [ ] Cover letter is one page with paragraphs and signature.
- [ ] DOCX is downloadable from application detail.

---

## User Story 2 – PDF Generation

**As a** job seeker  
**I want** my tailored CV and cover letter in PDF format  
**So that** I can submit them directly to applications.

### Acceptance Criteria

- [ ] System can export any DOCX into PDF.
- [ ] PDF formatting must be identical to DOCX.
- [ ] PDF metadata (author, title) is set to the user’s name and job title.
- [ ] PDF is downloadable from application detail.
- [ ] Both DOCX and PDF versions are stored per application.

---

## User Story 3 – Multiple Variants

**As a** job seeker  
**I want** 2–3 variants of my CV for each job  
**So that** I can choose the one that best fits the role.

### Acceptance Criteria

- [ ] System generates at least 2 variants: “Concise” and “Detailed”.
- [ ] Optional third variant: “Balanced”.
- [ ] Variants differ in depth of experience bullets, skills emphasis, and summary tone.
- [ ] All variants respect Reality Index rules from V1.
- [ ] User can preview all variants side by side.

---

## User Story 4 – Diff View

**As a** job seeker  
**I want** to see what changed between my base CV and generated CV  
**So that** I understand the tailoring and can learn from it.

### Acceptance Criteria

- [ ] Diff view highlights added/removed/modified lines.
- [ ] Changes are color-coded (green = added, red = removed, yellow = modified).
- [ ] Each diff item links back to the source fact in the resume.
- [ ] Cover letter diffs highlight sentences added or rewritten.

---

## User Story 5 – Template Styles

**As a** job seeker  
**I want** clean, professional templates automatically selected  
**So that** I don’t need to design layouts myself.

### Acceptance Criteria

- [ ] System supports at least 3 styles: Modern, Minimal, Classic.
- [ ] Templates are ATS-friendly (simple layout, standard fonts).
- [ ] Style is auto-chosen based on JD/company type (startup vs corporate).
- [ ] User can override style if desired.
- [ ] Selected template style is logged in application history.

---

## User Story 6 – Cover Letter Generator (Polished)

**As a** job seeker  
**I want** my cover letter formatted with professional standards  
**So that** it looks ready-to-send.

### Acceptance Criteria

- [ ] Cover letter includes: header (user info + company info), salutation, 3 paragraphs, closing.
- [ ] Salutation defaults to “Dear Hiring Manager” if no contact info available.
- [ ] Language is natural and aligned to company tone.
- [ ] Supports multi-language (same as JD language).
- [ ] Saved alongside CV in DOCX+PDF formats.

---

## User Story 7 – Document Preview

**As a** job seeker  
**I want** to preview my documents before download  
**So that** I can quickly check formatting.

### Acceptance Criteria

- [ ] Inline preview for DOCX and PDF in the browser.
- [ ] Preview is identical to the downloadable file.
- [ ] Preview loads in under 3 seconds for standard 2-page CV.

---

## User Story 8 – Document History

**As a** job seeker  
**I want** previous versions of my generated documents saved  
**So that** I can roll back or compare.

### Acceptance Criteria

- [ ] Every generated DOCX/PDF is stored with timestamp.
- [ ] User can view/download older versions in Application Detail.
- [ ] Versions are labeled (v1, v2, v3).
- [ ] Old versions remain even if new variants are generated.

---

## User Story 9 – Reviewer Enhancements

**As a** job seeker  
**I want** final documents checked for formatting and readability  
**So that** they are submission-ready.

### Acceptance Criteria

- [ ] Reviewer ensures consistent fonts, spacing, and bullet structure.
- [ ] Reviewer ensures CV length ≤ 2 pages (3 pages allowed only if >15 yrs experience).
- [ ] Reviewer flags jargon-heavy or repetitive bullets.
- [ ] Reviewer confirms contact details and job title in header.

---

## User Story 10 – Coaching Notes on Variants

**As a** job seeker  
**I want** short advice on which CV variant to use  
**So that** I can apply with the most effective version.

### Acceptance Criteria

- [ ] Each variant includes a 2–3 sentence coaching note.
- [ ] Notes highlight why this variant fits (e.g., “Concise version emphasizes leadership; better for senior roles”).
- [ ] Recommendation is logged in application history.

---

## Non-Functional Requirements (V3)

- **Performance:** DOCX+PDF generation under 10s per variant.
- **Formatting:** All templates ATS-friendly.
- **Storage:** DOCX and PDF stored in encrypted blob storage.
- **Privacy:** Only user facts used; no documents shared externally.
- **Auditability:** Each generated file logged with version ID and style.

---

## Out of Scope for V3

- Company brochures (V4).
- Interview hub (V4).
- Job Radar (V2.5+).
- Automation rules (V6).
