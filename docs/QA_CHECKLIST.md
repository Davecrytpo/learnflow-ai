# Learnflow AI - QA Checklist

Use this checklist to validate functionality, routing, and UI integrity.

**Routing & Navigation**
- Home page loads without blank screen
- Student portal, instructor portal, admin portal load correctly
- Sidebars show all expected links for each role
- All new routes resolve without 404
- `*` fallback route works

**Auth & Roles**
- Unauthenticated users redirected to `/login`
- New users redirected to `/onboarding`
- Role-based access blocks unauthorized routes
- Logout returns to `/`

**Student Experience**
- Dashboard renders stats and sections
- Assignments, quizzes, discussions, messages
- Learning plan, progress, bookmarks
- Competencies, portfolio, adaptive learning
- Proctored exams, purchases
- Career center, mentorship, internships, job board
- Capstone tracker, employer connections, alumni network

**Instructor Experience**
- Dashboard and course management
- Assignments, quizzes, discussions, messages
- Rubrics, live sessions, surveys
- Competency frameworks, content library, assessments
- Proctoring and integrity cases
- Portfolio reviews, coaching, office hours
- Cohort heatmap, outcome analytics, accreditation evidence

**Admin Experience**
- Users, courses, analytics, security
- Audit logs, bulk enrollment, categories
- Reports, integrations, tenants, permissions, billing
- Accreditation, compliance, marketplace, AI governance
- Data exports, data pipelines
- Proctoring, plagiarism
- SSO provisioning, directory sync, branding, support center
- Advanced analytics, cohort insights, multi-campus, catalog segmentation

**UI & Accessibility**
- Keyboard navigation (focus visible)
- Skip-to-content works
- Contrast check for key text
- Responsive layouts for mobile/desktop
- Loading states render cleanly

**Build & Lint**
- `npm run lint` passes
- `npm run build` succeeds (requires esbuild spawn permission)
