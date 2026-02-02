---

description: "Task list for Authentication & API Security (Better Auth + JWT)"
---

# Tasks: Authentication & API Security (Better Auth + JWT)

**Input**: Design documents from `/specs/002-auth-security/`
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

- [x] T001 Update backend requirements.txt with JWT-related dependencies (python-jose, bcrypt, passlib)
- [x] T002 [P] Update frontend package.json with Better Auth dependencies
- [x] T003 Configure environment variables for JWT secret (BETTER_AUTH_SECRET)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [x] T004 Implement JWT utility functions in backend/src/utils/jwt.py
- [x] T005 [P] Create JWT verification dependency in backend/src/api/auth.py
- [x] T006 [P] Update User model to support JWT authentication in backend/src/models/user.py
- [x] T007 Create authentication service functions in backend/src/services/auth.py
- [x] T008 Update existing API endpoints to accept user_id from JWT instead of URL in backend/src/api/todos.py
- [x] T009 Implement authorization checks in backend services to validate user owns requested resources

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure User Authentication (Priority: P1) 🎯 MVP

**Goal**: Allow users to visit the application and sign up or sign in using their email and password, with the system securely authenticating the user and issuing a JWT token that enables access to protected resources.

**Independent Test**: Can be fully tested by registering a new user account, logging in successfully, and verifying that a valid JWT token is issued. The system should reject invalid credentials with appropriate error responses.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Contract test for auth endpoints in backend/tests/contract/test_auth.py
- [ ] T011 [P] [US1] Integration test for user authentication flow in backend/tests/integration/test_auth.py

### Implementation for User Story 1

- [x] T012 [P] [US1] Create signup endpoint in backend/src/api/auth.py
- [x] T013 [P] [US1] Create login endpoint in backend/src/api/auth.py
- [x] T014 [US1] Implement JWT token creation in authentication service in backend/src/services/auth.py
- [x] T015 [US1] Add password hashing functionality in backend/src/services/auth.py
- [x] T016 [US1] Create signup page component in frontend/src/app/auth/signup/page.tsx
- [x] T017 [US1] Create login page component in frontend/src/app/auth/login/page.tsx
- [x] T018 [US1] Implement Better Auth configuration in frontend
- [x] T019 [US1] Implement secure JWT token storage in frontend/src/lib/auth.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Secure API Access with JWT (Priority: P2)

**Goal**: Allow authenticated users to make API requests to access protected resources, with the frontend including the JWT token in the Authorization header and the backend validating the token before processing the request.

**Independent Test**: Can be fully tested by making API requests with valid JWT tokens (should succeed) and without tokens or with invalid tokens (should return 401 Unauthorized).

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T020 [P] [US2] Contract test for JWT validation in backend/tests/contract/test_jwt_validation.py
- [ ] T021 [P] [US2] Integration test for API access with JWT in backend/tests/integration/test_api_with_jwt.py

### Implementation for User Story 2

- [x] T022 [P] [US2] Update frontend API client to include JWT in Authorization header in frontend/src/lib/api.ts
- [x] T023 [P] [US2] Implement global error handler for 401 responses in frontend/src/lib/api.ts
- [x] T024 [US2] Add JWT validation to all protected endpoints in backend/src/api/todos.py
- [x] T025 [US2] Create reusable JWT verification dependency in backend/src/api/deps.py
- [x] T026 [US2] Update frontend components to handle token expiration scenarios
- [x] T027 [US2] Implement token refresh mechanism if needed in frontend/src/lib/auth.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - User Data Isolation (Priority: P3)

**Goal**: Ensure each authenticated user can only access and modify their own data, with the system enforcing data isolation by validating that the authenticated user has permission to access the requested resources.

**Independent Test**: Can be tested by creating two user accounts, having each user create different data items, and verifying that each user can only access their own data through both the frontend interface and direct API requests.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T028 [P] [US3] Contract test for data isolation enforcement in backend/tests/contract/test_data_isolation.py
- [ ] T029 [P] [US3] Integration test for cross-user access prevention in backend/tests/integration/test_cross_user_access.py

### Implementation for User Story 3

- [x] T030 [P] [US3] Update all backend service functions to validate user ownership of resources
- [x] T031 [P] [US3] Modify database queries to filter by authenticated user ID in backend/src/services/todo_service.py
- [x] T032 [US3] Update frontend API calls to rely on authenticated user context instead of user ID from URL
- [x] T033 [US3] Add authorization checks in frontend components to prevent unauthorized access
- [x] T034 [US3] Implement proper error handling for 403 Forbidden responses in frontend
- [x] T035 [US3] Add server-side validation to ensure URL user ID matches JWT user ID in backend/src/api/todos.py

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T036 [P] Update documentation to reflect JWT authentication changes
- [ ] T037 Add security headers to API responses
- [ ] T038 Implement rate limiting for authentication endpoints
- [ ] T039 [P] Add additional unit tests for auth components in backend/tests/unit/
- [ ] T040 Security audit and penetration testing preparation
- [ ] T041 Run quickstart.md validation

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
Task: "Contract test for auth endpoints in backend/tests/contract/test_auth.py"
Task: "Integration test for user authentication flow in backend/tests/integration/test_auth.py"

# Launch all auth components for User Story 1 together:
Task: "Create signup endpoint in backend/src/api/auth.py"
Task: "Create login endpoint in backend/src/api/auth.py"
Task: "Implement JWT token creation in authentication service in backend/src/services/auth.py"
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