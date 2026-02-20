# Maplewood Course Planning - Solution Documentation

## 1. Scope and Goal

This document describes how the current implementation satisfies the requirements in `PROBLEM_STATEMENT.md`, including backend validation rules, frontend behavior, and state management.

## 2. Requirement Coverage

### 2.1 Students can browse and discover courses
- Implemented in frontend catalog page with search, type filters, and "only enrollable" toggle.
- Backend provides course + section data for the current semester.

### 2.2 Students can plan semester schedule
- Students can select sections in catalog and enroll one-by-one or in batch.
- Dedicated schedule page supports viewing weekly schedule and dropping courses.

### 2.3 Students can track progress
- Profile/Dashboard display GPA, earned credits, current courses, remaining credits.
- Graduation target is enforced as 30 credits in profile service.

### 2.4 System prevents invalid enrollments
- Enforced at backend enrollment validation:
1. Missing prerequisites
2. Time conflicts
3. More than 5 active courses
4. Grade level mismatch
5. Full section
6. Duplicate enrollment (same section)
7. Duplicate enrollment (another section of same course)

### 2.5 Frontend real-time validation feedback
- Catalog sections include:
1. `canEnroll`
2. `blockingReasons[]`
- UI surfaces reasons before user submits enrollment.

### 2.6 Clear state and error communication
- Centralized Redux Toolkit state with async thunks.
- Loading and error states displayed in Dashboard, Catalog, Profile, and Schedule.
- Toast notifications for enrollment/drop success and failure.

## 3. Backend Design

### 3.1 Key APIs
- `GET /api/courses`
- `GET /api/courses/available?studentId={id}&semester={label}`
- `GET /api/students/{studentId}/profile`
- `GET /api/students/{studentId}/schedule`
- `POST /api/enrollments`
- `DELETE /api/enrollments/{studentId}/{sectionId}`
- `GET /api/enrollments/available-sections?studentId={id}&semester={label}`
- `GET /api/semesters/current`

### 3.2 Validation layer
- `EnrollmentValidationService` is the central rule engine for enrollment checks.
- Validation is applied on `POST /api/enrollments`, not only in frontend.

### 3.3 SQLite date/time compatibility
- Custom JPA converters added to read text-based SQLite fields safely:
1. Local time converter for `time_slots.start_time/end_time`
2. Local date converter for `semesters.start_date/end_date`

## 4. Frontend Design

### 4.1 Pages
- `/` Dashboard
- `/catalog` Course browser + section selection + enroll actions
- `/schedule` Weekly schedule + enrolled list + drop
- `/profile` Student profile and progress

### 4.2 State management
- Redux slices:
1. `studentSlice`
2. `courseSlice`
3. `enrollmentSlice`
4. `uiSlice`
- Async thunks coordinate API calls and refresh dependent state after enrollment actions.

### 4.3 UX behavior
- Course cards show capacity, timeslots, block reasons, select state.
- Batch enrollment continues even if one selected section fails.
- Error banners are visible in primary pages for API failures.

## 5. Database Additions for Current-Semester Planning

The solution uses the required additional tables:
- `course_sections`
- `time_slots`
- `current_enrollments`

The repository includes `create_new_tables.sql` for setup/population support.

## 6. Acceptance Scenarios Mapping

Scenarios from `PROBLEM_STATEMENT.md` are supported as follows:
1. Valid enrollment -> accepted when all validations pass.
2. Prerequisite violation -> blocked with explicit error reason.
3. Time conflict -> blocked with explicit error reason.
4. Course limit (6th course) -> blocked with explicit error reason.

## 7. Known Simplifications

- GPA is computed from pass/fail (`passed=4.0`, `failed=0.0`) because historical records do not include letter-grade points.
- Authentication/user identity is not implemented; demo uses student selection fallback in store (default student id).

## 8. How to Verify Quickly

1. Start backend and frontend.
2. Open catalog and confirm block reasons are visible on non-enrollable sections.
3. Enroll in an enrollable section and confirm:
   - success toast
   - schedule/profile refresh
4. Attempt invalid enrollments (missing prerequisite, conflict, 6th course) and confirm clear error.

