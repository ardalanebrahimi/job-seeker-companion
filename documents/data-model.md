# Data Model (Draft) — Job Companion

_Last updated: 2025-08-31_

---

## Core Entities

### User

- `id (uuid)`
- `email`, `name`, `locale`, `timezone`
- `created_at`, `updated_at`

### Workspace

- `id`, `name`, `description`
- `owner_user_id`
- `settings_json` (policies, RI caps, etc.)

### Persona

- `id`, `user_id`
- `label` (e.g., “PM”, “Customer Success”)
- `summary_md`
- `skills[]`
- `style_prefs_json`

### ResumeFact

- `id`, `user_id`, `kind` (`role|project|education|cert|skill`)
- `data_json` (company, title, bullets, dates, metrics)
- `source_uri` (CV file reference)

### JobPosting

- `id`, `source` (`manual|url|connector`)
- `url`, `company`, `title`, `location`
- `jd_text`, `jd_struct_json` (skills, reqs, benefits)
- `raw_html_uri` (blob)
- `embedding (vector)`

### Application

- `id`, `user_id`, `job_posting_id`
- `status` (`Found|Applied|Interview|Offer|Rejected`)
- `applied_at`, `next_event_at`
- `notes_md`
- `decision_log_id`

### ApplicationDoc

- `id`, `application_id`
- `kind` (`cv|cover|brochure|prep`)
- `format` (`md|docx|pdf`)
- `blob_uri`, `checksum`
- `variant_label` (`concise|balanced|detailed|A|B`)
- `language`

### DecisionLog

- `id`, `application_id`
- `persona_label`
- `reality_index (0–2)`
- `signals_json` (top JD/profile matches)
- `keywords_emphasized[]`
- `created_at`

### Reminder

- `id`, `application_id`
- `due_at`, `kind` (`followup|interview|task`)
- `payload_json`, `done_at`

### Rule

- `id`, `user_id|workspace_id`
- `condition_json`, `action_json`
- `enabled (bool)`, `priority (int)`

### VariantMetric

- `id`, `application_id`, `variant_label`
- `event` (`callback|interview|offer`)
- `happened_at`

---

## Relationships

- **User** → many Personas, ResumeFacts, Applications.
- **JobPosting** → many Applications.
- **Application** → many ApplicationDocs, one DecisionLog.
- **Application** → many Reminders.
- **Workspace** → many Users, Rules.

---

## Enumerations

```json
{
  "ApplicationStatus": ["Found", "Applied", "Interview", "Offer", "Rejected"],
  "DocumentKind": ["cv", "cover", "brochure", "prep"],
  "DocumentFormat": ["md", "docx", "pdf"],
  "ReminderKind": ["followup", "interview", "task"]
}
```

---

## Example DTOs

### POST /jobs/ingest

**Request:**

```json
{ "url": "https://example.com/job/123", "rawText": null }
```

**Response:**

```json
{ "jobId": "uuid" }
```

### GET /jobs/{id}

**Response:**

```json
{
  "id": "uuid",
  "company": "Acme",
  "title": "Product Manager",
  "location": "Berlin",
  "jdText": "...",
  "jdStruct": {
    "skills": ["Agile", "Stakeholder Mgmt"],
    "requirements": ["5+ yrs experience"]
  }
}
```

### POST /applications/generate

**Request:**

```json
{ "jobId": "uuid" }
```

**Response:**

```json
{
  "applicationId": "uuid",
  "docs": [
    { "kind": "cv", "format": "docx", "uri": "blob://cv1" },
    { "kind": "cover", "format": "pdf", "uri": "blob://cl1" }
  ],
  "decision": {
    "persona": "PM",
    "realityIndex": 1,
    "signals": ["recent leadership", "SaaS metrics"]
  }
}
```
