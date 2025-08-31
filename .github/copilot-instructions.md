# GitHub Copilot Instructions

**Project:** Job Companion — V1 (MVP)  
**Tech Stack:** Node.js/TypeScript backend, Angular 19 frontend, PostgreSQL  
**Approach:** OpenAPI-first, DDD modules, Backend-heavy logic

---

## 1) Core Rules

- **Golden Rule:** Update OpenAPI first → generate SDK → implement code. Never improvise APIs.
- **Tech Stack:** Node.js/TypeScript backend, Angular 19 frontend
- **Source of truth:** Specs in `/documents/`, OpenAPI contract in `/apps/backend/openapi.yaml`
- **One feature per PR** – implement tickets individually

---

## 2) Implementation Workflow

1. Read feature spec in `/documents/feature-specs/`
2. Update `openapi.yaml` with new paths/schemas
3. Run `npm run gen:sdk` to refresh SDK
4. **Backend**: Add controllers → services → repositories in DDD modules, write tests
5. **Frontend**: Create standalone Angular components (`.ts/.html/.scss`), use generated SDK
6. Add DB migrations if needed

---

## 3) Key Development Practices

- **Target correct directories**: Work inside `apps/backend` or `apps/frontend`
- **Testing**: Use `npm run build` and `ng build` instead of running dev servers
- **Ask for clarification** rather than guessing requirements
- **Keep frontend thin** – business logic stays in backend services

---

## 4) File Size & Code Structure

- **No large files**: Keep files under 300 lines of code
- **Separate concerns**: Controllers, Services, Repositories, Domain Models in separate files
- **Favor modularity**: Reusable Angular components and backend services
- **Strict typing**: Strong TypeScript types; Angular strict mode enabled
- **Avoid mixing responsibilities** in the same file

---

## 5) Agent Behavior Rules

- **Never auto-run/test/debug**: Developer handles execution manually
- **Ask before related changes**: If a related file needs edits, confirm first
- **Clarify ambiguity**: Analyze prompts and ask questions when unclear
- **No assumptions**: Don’t invent missing requirements, always confirm
- **Stay maintainable**: Clean, composable code preferred over shortcuts

---

## 6) Documentation Organization

- **Keep root clean**: Don’t create implementation docs at root
- **Feature documentation**: Place specs in `/documents/feature-specs/<module>.md`
- **User stories**: Found in `/documents/user-stories/`
- **Implementation artifacts**: Use `<TICKET-ID>-IMPLEMENTATION.md` if needed
- **Summary docs**: Use `<TICKET-ID>-SUMMARY.md` for high-level overview
- **Technical guides**: Place in `/apps/backend/README_*.md` or `/apps/frontend/README_*.md`

---

## 7) Essential Coding Standards

### Backend (Node.js/TypeScript)

- **Controllers**: Thin, handle validation and mapping only
- **Services**: Business logic, orchestrate agents
- **Repositories**: Data access via Prisma/TypeORM
- Return errors as `{ error: { code, message } }` with proper HTTP status
- Input validation for all endpoints

### Frontend (Angular 19)

- **Always 3 files**: `.ts`, `.html`, `.scss` (never inline)
- **Standalone components** only (no `NgModule`)
- Feature-first structure under `/features/<module>`
- Use generated SDK for API calls
- Keep UI presentation clean, minimal logic

### Database (PostgreSQL)

- Tables/columns: `snake_case`
- JSON responses: `camelCase`
- Primary keys: `uuid`, timestamps: `timestamptz` (UTC)
- Migrations required for schema changes

---

## 8) Commands & Validation

```bash
# SDK generation after OpenAPI changes
npm run gen:sdk

# Validation builds
cd apps/backend && npm run build
cd apps/frontend && ng build
```

---

## 9) When in Doubt

- Check `/documents/index.md`, `/documents/version-roadmap.md`, and feature specs.
- Confirm unclear requirements before coding.
- Keep business logic in backend services.
- Frontend consumes backend via generated SDK only.
