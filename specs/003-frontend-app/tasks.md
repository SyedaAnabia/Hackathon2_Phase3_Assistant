# Tasks: Frontend Application (Next.js App Router)

**Input**: Design documents from `/specs/003-frontend-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create frontend directory structure per implementation plan
- [x] T002 [P] Initialize package.json with Next.js 16+, React 18+, Better Auth dependencies
- [x] T003 [P] Configure Next.js App Router with required settings in next.config.js
- [x] T004 Create tsconfig.json and tailwind.config.js with appropriate settings

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [x] T005 [P] Install and configure Better Auth for Next.js frontend
- [x] T006 Create authentication context/provider in frontend/src/contexts/AuthContext.tsx
- [x] T007 Create authentication utility functions in frontend/src/lib/auth.ts
- [x] T008 Create centralized API client utility in frontend/src/lib/api.ts
- [x] T009 Implement protected route component in frontend/src/components/ProtectedRoute.tsx
- [x] T010 Create authentication hooks (useAuth) in frontend/src/hooks/useAuth.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication Flow (Priority: P1) 🎯 MVP

**Goal**: Allow end users to visit the Todo application and sign up or sign in using their email and password. The system securely authenticates the user and redirects them to the appropriate dashboard based on their authentication status.

**Independent Test**: Can be fully tested by registering a new user account, logging in successfully, and verifying that the user is redirected to the Todo dashboard. The system should redirect unauthenticated users to the sign-in page when attempting to access protected routes.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T011 [P] [US1] Contract test for auth endpoints in frontend/tests/contract/test_auth.js
- [ ] T012 [P] [US1] Integration test for user authentication flow in frontend/tests/integration/test_auth.js

### Implementation for User Story 1

- [x] T013 [P] [US1] Create signup page component in frontend/src/app/auth/signup/page.tsx
- [x] T014 [P] [US1] Create login page component in frontend/src/app/auth/login/page.tsx
- [x] T015 [US1] Implement signup form with validation in signup page
- [x] T016 [US1] Implement login form with validation in login page
- [x] T017 [US1] Connect signup form to auth API endpoint
- [x] T018 [US1] Connect login form to auth API endpoint
- [x] T019 [US1] Implement redirect to dashboard after successful authentication
- [x] T020 [US1] Implement redirect to login for unauthenticated users accessing protected routes

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Todo Management Interface (Priority: P2)

**Goal**: Allow authenticated users to access the Todo dashboard and create, view, update, delete, and complete tasks. The UI reflects the real backend state with no mock data.

**Independent Test**: Can be fully tested by logging in as a user, creating a new todo item, viewing the list of todos, updating a todo's status, and deleting a todo. The UI should accurately reflect the backend state for all operations.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T021 [P] [US2] Contract test for todo endpoints in frontend/tests/contract/test_todos.js
- [ ] T022 [P] [US2] Integration test for todo management flow in frontend/tests/integration/test_todos.js

### Implementation for User Story 2

- [x] T023 [P] [US2] Create TodoList component in frontend/src/components/TodoList.tsx
- [x] T024 [P] [US2] Create TodoItem component in frontend/src/components/TodoItem.tsx
- [x] T025 [P] [US2] Create TodoForm component in frontend/src/components/TodoForm.tsx
- [x] T026 [US2] Create dashboard page in frontend/src/app/dashboard/page.tsx
- [x] T027 [US2] Implement fetching todos from API in dashboard
- [x] T028 [US2] Implement creating new todo via API in dashboard
- [x] T029 [US2] Implement updating todo via API in TodoItem component
- [x] T030 [US2] Implement deleting todo via API in TodoItem component
- [x] T031 [US2] Implement toggling todo completion via API in TodoItem component

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Responsive UI Experience (Priority: P3)

**Goal**: Ensure users can access the Todo application on various devices (desktop, tablet, mobile) and experience a responsive layout that works well on all screen sizes. The UI provides clear feedback for authentication and API errors.

**Independent Test**: Can be fully tested by accessing the application on different screen sizes and verifying that the layout adapts appropriately. Error states should be clearly communicated to the user.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T032 [P] [US3] Contract test for responsive UI in frontend/tests/contract/test_responsive.js
- [ ] T033 [P] [US3] Integration test for error handling in frontend/tests/integration/test_errors.js

### Implementation for User Story 3

- [ ] T034 [P] [US3] Apply responsive styling to all UI components using Tailwind CSS
- [ ] T035 [P] [US3] Create error boundary components for graceful error handling
- [ ] T036 [US3] Implement loading states for all API operations
- [ ] T037 [US3] Implement empty states for todo list
- [ ] T038 [US3] Add accessibility attributes (aria labels, focus states) to components
- [ ] T039 [US3] Implement global error handling for API responses
- [ ] T040 [US3] Add visual feedback for user actions (button states, etc.)

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T041 [P] Add documentation in docs/
- [ ] T042 Code cleanup and refactoring
- [ ] T043 Performance optimization across all stories
- [ ] T044 [P] Additional unit tests (if requested) in frontend/tests/unit/
- [ ] T045 Security hardening
- [ ] T046 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for auth endpoints in frontend/tests/contract/test_auth.js"
Task: "Integration test for user authentication flow in frontend/tests/integration/test_auth.js"

# Launch all auth components for User Story 1 together:
Task: "Create signup page component in frontend/src/app/auth/signup/page.tsx"
Task: "Create login page component in frontend/src/app/auth/login/page.tsx"
Task: "Implement signup form with validation in signup page"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence