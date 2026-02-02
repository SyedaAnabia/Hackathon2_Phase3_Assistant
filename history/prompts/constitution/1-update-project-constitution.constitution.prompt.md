---
id: 1
title: Update Project Constitution
stage: constitution
date: 2026-01-13
surface: agent
model: 
feature: none
branch: 
user: 
command: /sp.constitution
labels: [constitution, governance, principles]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - 
---

## Prompt

```
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are updating the project constitution at `.specify/memory/constitution.md`. This file is a TEMPLATE containing placeholder tokens in square brackets (e.g. `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`). Your job is to (a) collect/derive concrete values, (b) fill the template precisely, and (c) propagate any amendments across dependent artifacts.

Follow this execution flow:

1. Load the existing constitution template at `.specify/memory/constitution.md`.
   - Identify every placeholder token of the form `[ALL_CAPS_IDENTIFIER]`.
   **IMPORTANT**: The user might require less or more principles than the ones used in the template. If a number is specified, respect that - follow the general template. You will update the doc accordingly.

2. Collect/derive values for placeholders:
   - If user input (conversation) supplies a value, use it.
   - Otherwise infer from existing repo context (README, docs, prior constitution versions if embedded).
   - For governance dates: `RATIFICATION_DATE` is the original adoption date (if unknown ask or mark TODO), `LAST_AMENDED_DATE` is today if changes are made, otherwise keep previous.
   - `CONSTITUTION_VERSION` must increment according to semantic versioning rules:
     - MAJOR: Backward incompatible governance/principle removals or redefinitions.
     - MINOR: New principle/section added or materially expanded guidance.
     - PATCH: Clarifications, wording, typo fixes, non-semantic refinements.
   - If version bump type ambiguous, propose reasoning before finalizing.

3. Draft the updated constitution content:
   - Replace every placeholder with concrete text (no bracketed tokens left except intentionally retained template slots that the project has chosen not to define yet—explicitly justify any left).
   - Preserve heading hierarchy and comments can be removed once replaced unless they still add clarifying guidance.
   - Ensure each Principle section: succinct name line, paragraph (or bullet list) capturing non‑negotiable rules, explicit rationale if not obvious.
   - Ensure Governance section lists amendment procedure, versioning policy, and compliance review expectations.

4. Consistency propagation checklist (convert prior checklist into active validations):
   - Read `.specify/templates/plan-template.md` and ensure any "Constitution Check" or rules align with updated principles.
   - Read `.specify/templates/spec-template.md` for scope/requirements alignment—update if constitution adds/removes mandatory sections or constraints.
   - Read `.specify/templates/tasks-template.md` and ensure task categorization reflects new or removed principle-driven task types (e.g., observability, versioning, testing discipline).
   - Read each command file in `.specify/templates/commands/*.md` (including this one) to verify no outdated references (agent-specific names like CLAUDE only) remain when generic guidance is required.
   - Read any runtime guidance docs (e.g., `README.md`, `docs/quickstart.md`, or agent-specific guidance files if present). Update references to principles changed.

5. Produce a Sync Impact Report (prepend as an HTML comment at top of the constitution file after update):
   - Version change: old → new
   - List of modified principles (old title → new title if renamed)
   - Added sections
   - Removed sections
   - Templates requiring updates (✅ updated / ⚠ pending) with file paths
   - Follow-up TODOs if any placeholders intentionally deferred.

6. Validation before final output:
   - No remaining unexplained bracket tokens.
   - Version line matches report.
   - Dates ISO format YYYY-MM-DD.
   - Principles are declarative, testable, and free of vague language ("should" → replace with MUST/SHOULD rationale where appropriate).

7. Write the completed constitution back to `.specify/memory/constitution.md` (overwrite).

8. Output a final summary to the user with:
   - New version and bump rationale.
   - Any files flagged for manual follow-up.
   - Suggested commit message (e.g., `docs: amend constitution to vX.Y.Z (principle additions + governance update)`).

Formatting & Style Requirements:

- Use Markdown headings exactly as in the template (do not demote/promote levels).
- Wrap long rationale lines to keep readability (<100 chars ideally) but do not hard enforce with awkward breaks.
- Keep a single blank line between sections.
- Avoid trailing whitespace.

If the user supplies partial updates (e.g., only one principle revision), still perform validation and version decision steps.

If critical info missing (e.g., ratification date truly unknown), insert `TODO(<FIELD_NAME>): explanation` and include in the Sync Impact Report under deferred items.

Do not create a new template; always operate on the existing `.specify/memory/constitution.md` file.

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3–7 words (slug for filename)
   - Route is automatically determined by stage:
     - `constitution` → `history/prompts/constitution/`
     - Feature stages → `history/prompts/<feature-name>/` (spec, plan, tasks, red, green, refactor, explainer, misc)
     - `general` → `history/prompts/general/`

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path based on stage from step 2; write the file
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/` and matches stage; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.


/sp.constitution

Project: Todo Full-Stack Web Application (Hackathon Phase-2)

Core principles:
- Correctness-first implementation (backend, frontend, auth, database)
- Spec-driven development (Claude Code + Spec-Kit Plus compliance)
- Security-by-design (JWT-based stateless authentication)
- User isolation (strict per-user data access)
- Maintainability and clarity (clean architecture, readable code)

Key standards:
- All API behavior must match written specifications exactly
- RESTful API conventions must be followed
- Authentication must be enforced on every protected endpoint
- JWT verification must occur on the backend for all requests
- Database operations must always be scoped to the authenticated user
- Frontend must never trust client-side user identity alone
- Clear separation of concerns (frontend, backend, auth, database)

Constraints:
- Frontend: Next.js 16+ (App Router)
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (JWT-based)
- Spec-driven tooling: Claude Code + Spec-Kit Plus
- Environment-based secrets (no hardcoded secrets)
- Stateless backend (no server-side sessions)

Security requirements:
- All API requests require a valid JWT token
- Requests without or with invalid token return 401 Unauthorized
- JWT secret must be shared via environment variable (BETTER_AUTH_SECRET)
- Token expiry must be enforced
- Users can only access, modify, or delete their own tasks

Quality requirements:
- Clean, readable, and documented code
- Predictable API responses and error handling
- No duplicate logic across layers
- Defensive validation for all inputs

Success criteria:
- Multi-user Todo application works end-to-end
- Each user sees and manages only their own tasks
- JWT authentication works across frontend and backend
- All CRUD operations function correctly
- API passes authorization and ownership checks
- Application can be deployed with environment-based configuration

## Response snapshot

I've successfully updated the project constitution at `.specify/memory/constitution.md` based on your provided principles and requirements. Here's a summary of what was done:

1. Created a new constitution file with version 1.0.0
2. Incorporated all the specified core principles:
   - Correctness-First Implementation
   - Spec-Driven Development
   - Security-by-Design
   - User Isolation
   - Maintainability and Clarity
   - API Behavior Compliance
3. Added sections for Security Requirements and Quality Requirements
4. Included governance information with ratification date of 2026-01-13

The constitution now serves as the governing document for the Todo Full-Stack Web Application project, establishing clear principles and guidelines for development.

I also checked the template files to ensure they align with the updated constitution, though no changes were needed to the templates themselves as they are generic structures that accommodate various project types.

## Outcome

- ✅ Impact: Updated project constitution with comprehensive principles
- 🧪 Tests: No tests required for this task
- 📁 Files: .specify/memory/constitution.md created
- 🔁 Next prompts: Ready for spec development with /sp.specify
- 🧠 Reflection: Constitution provides solid foundation for project governance

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin feature specification with /sp.specify