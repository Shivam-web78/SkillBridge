# SkillBridge — Academia–Industry Collaboration Portal

Built for Smart India Hackathon 2026. SkillBridge connects students, industry
partners, and academic institutions on one platform: AI-driven skill
assessment, a skill-gap-aware learning path, and a matching engine that
ranks candidates against internships and jobs by real skill overlap
rather than keyword search.

## How it's built

```
React (Vite) → Redux Toolkit → services/mockApi.js (localStorage) → Pages
```

The entire frontend runs against a **mock backend** — `src/services/mockApi.js` —
that persists to `localStorage` and is shaped exactly like a real REST API
(same function names, same request/response shapes, same async behavior).
That means the app is fully interactive and demo-able with zero setup, and
a real backend can be swapped in later by changing only the API layer, not
any component or Redux slice.

A complete **reference backend** (Express + MongoDB) also lives in
`/backend`, implementing every one of those same endpoints for real —
see [Running with the real backend](#running-with-the-real-backend) below.

**Stack:** React 18, Vite, Tailwind CSS, Redux Toolkit, React Router v6,
Recharts, Lucide icons, React Hook Form, Zod.

---

## Quick start (mock mode — recommended for demos)

No database, no `.env`, no backend process. Everything runs in the browser.

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). On the
`/login` page, use the **"Login as Student / Industry / Admin"** buttons
to jump straight into a fully populated demo account — dashboards,
applications, notifications, and certificates are all pre-seeded on first
load.

To wipe and re-seed the mock data at any time, clear `localStorage` for
the site (or open DevTools → Application → Local Storage → delete the
`skillbridge_db_v1` and `skillbridge_session_v1` keys) and refresh.

---

## Project structure

```
skillbridge/
├── src/
│   ├── app/store.js              Redux store (auth, student, industry, admin, notifications, messages, ui)
│   ├── services/
│   │   ├── mockApi.js            Mock REST layer — localStorage-backed, real backend to swap in later
│   │   └── seedData.js           Demo users, profiles, internships, jobs, courses, assessment bank
│   ├── features/                 Redux slices, one per domain
│   ├── components/                Shared UI: cards, badges, modals, charts, timelines
│   ├── layouts/                  StudentLayout / IndustryLayout / AdminLayout (sidebar + navbar shells)
│   └── pages/
│       ├── student/               Dashboard, Profile, Skill Assessment, Skill Gap, Learning Path,
│       │                          Internships, Jobs, Industry Programs, Applications, Portfolio, Certificates
│       ├── industry/               Dashboard, Company Profile, Post Internship/Job, Learning Programs,
│       │                          Candidates, AI Matching, Applications, Collaboration, Analytics
│       ├── admin/                  Dashboard, Students, Industry, Faculty & Academia, Verification,
│       │                          Collaboration, Analytics
│       └── Messages.jsx / Settings.jsx   Shared across all three roles
└── backend/                       Reference Express + MongoDB implementation (see below)
```

## Demo accounts (mock mode)

| Role     | Email               | Notes                                    |
|----------|----------------------|-------------------------------------------|
| Student  | rahul@skillbridge.demo     | IIT Delhi, CS, pre-filled skills & applications |
| Industry | hr@technova.demo     | TechNova Solutions, verified, active postings |
| Admin    | admin@skillbridge.demo     | Full platform analytics & verification queue |

Password is irrelevant in mock mode — the demo login buttons bypass it
entirely. Use "Register" to create additional accounts of any role, or
"Forgot Password" to test that flow.

---

## Running with the real backend

The `/backend` folder is a complete, working Express + MongoDB API that
mirrors `mockApi.js` endpoint-for-endpoint — same matching algorithm
(`computeMatch`), same field names, same response shapes — so pointing
the frontend at it requires no component changes.

### 1. Start MongoDB

Use a local install or a free MongoDB Atlas cluster. Either way, you'll
need a connection string.

### 2. Configure and start the backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI to your connection string, and JWT_SECRET to any long random string
npm run seed   # creates the three demo accounts + sample internships/jobs/courses
npm run dev    # starts on http://localhost:5000
```

Demo credentials after seeding (password `demo1234` for all three):

- `rahul@skillbridge.demo` (student)
- `hr@technova.demo` (industry)
- `admin@skillbridge.demo` (admin)

### 3. Point the frontend at it

The frontend currently calls `mockApi.js` directly rather than over HTTP.
To switch to the real backend, replace the body of each function in
`src/services/mockApi.js` with an `axios`/`fetch` call to the matching
route below — the function signatures and return shapes already match,
so Redux slices and components need no changes.

| Mock function | Real endpoint |
|---|---|
| `apiLogin` / `apiDemoLogin` / `apiRegister` / `apiResetPassword` | `POST /api/auth/{login, demo-login, register, reset-password}` |
| `fetchProfile` / `updateProfile` | `GET` / `PUT /api/student/profile` |
| `uploadResume` | `POST /api/student/resume` (multipart) |
| `getAssessmentQuestions` / `getNextAssessmentQuestion` / `submitAssessment` / `getAssessmentResult` | `/api/student/assessment/*` |
| `getSkillGap` | `GET /api/student/skill-gap` |
| `getCourses` / `getLearningProgress` / `updateLearningProgress` | `/api/student/{courses, learning-progress}` |
| `getInternships` / `getJobs` / `getRecommendations` / `getOpportunityMatch` / `apply` / `getApplications` | `/api/student/*` |
| `getCertificates` / `uploadCertificate` / `getPortfolio` | `/api/student/{certificates, portfolio}` |
| `getIndustryProfile` / `updateIndustryProfile` | `/api/industry/profile` |
| `postInternship` / `postJob` / `getCompanyOpportunities` | `/api/industry/{internships, jobs, opportunities}` |
| `getCandidatesForOpportunity` / `shortlistCandidateDirect` | `/api/industry/candidates/*` |
| `getAllApplicationsForCompany` / `updateApplicationStatus` / `bulkShortlist` | `/api/industry/applications/*` |
| `getAllStudents` / `getAllIndustries` / `verifyIndustry` / `verifyCertificate` / `getVerificationRequests` | `/api/admin/*` |
| `getAdminAnalytics` | `GET /api/admin/analytics` |
| `getFacultyOpportunities` / `getCollaborations` | `/api/admin/{faculty-opportunities, collaborations}` |
| `getNotifications` / `markNotificationRead` / `markAllNotificationsRead` | `/api/shared/notifications*` |
| `getConversations` / `getThread` / `sendMessage` / `listMessagablePeople` | `/api/shared/*` |

Auth: the real backend issues a JWT on login — store it (e.g. in memory
or a secure cookie) and attach it as `Authorization: Bearer <token>` on
every subsequent request; `middleware/auth.js` enforces both
authentication and per-role access on every protected route.

### Backend structure

```
backend/
├── server.js              Express app entry point
├── seed.js                 Seeds demo accounts + sample data
├── config/db.js             Mongoose connection
├── models/                  User, StudentProfile, IndustryProfile, Internship, Job,
│                            Application, Certificate, Course, LearningProgress,
│                            AssessmentResult, Notification, Message, VerificationRequest,
│                            FacultyOpportunity, Collaboration
├── routes/                  auth, student, industry, admin, shared (messages/notifications)
├── middleware/auth.js        JWT verification + role-based access guard
├── utils/matching.js         computeMatch() — ported 1:1 from the frontend mock
└── data/assessmentBank.js    Static quiz question bank
```

---

## Notes for judges / reviewers

- The mock layer isn't a stub — it implements the full matching algorithm,
  adaptive assessment difficulty, and application status timelines exactly
  as the real backend does, so every number and recommendation on screen
  is genuinely computed, not hardcoded.
- All localStorage state lives under two keys (`skillbridge_db_v1` for data,
  `skillbridge_session_v1` for the current session) for easy inspection in
  DevTools during a demo.
