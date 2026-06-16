# Resumate — Complete Project Context

> **Purpose:** Single source of truth for AI assistants and developers. Read this file before making changes.  
> **Last verified against codebase:** May 22, 2026  
> **Package name:** `ai-resume-builder` (branded **Resumate** in UI)  
> **Repo path:** `c:\my all projects\Resumate`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Tech Stack (Exact Versions)](#2-tech-stack-exact-versions)
3. [Repository Layout](#3-repository-layout)
4. [Architecture & Data Flow](#4-architecture--data-flow)
5. [Authentication & Route Protection](#5-authentication--route-protection)
6. [Pages & Routing](#6-pages--routing)
7. [API Reference (Complete)](#7-api-reference-complete)
8. [Database (Prisma)](#8-database-prisma)
9. [Environment Variables](#9-environment-variables)
10. [Feature Flows (End-to-End)](#10-feature-flows-end-to-end)
11. [Frontend Components](#11-frontend-components)
12. [Hooks](#12-hooks)
13. [Shared Libraries (`src/lib`)](#13-shared-libraries-srclib)
14. [Design System & UI](#14-design-system--ui)
15. [AI Integration](#15-ai-integration)
16. [File Upload & Parsing](#16-file-upload--parsing)
17. [Export Formats](#17-export-formats)
18. [PWA & Service Worker](#18-pwa--service-worker)
19. [Testing & Quality](#19-testing--quality)
20. [Scripts & Tooling](#20-scripts--tooling)
21. [Deployment](#21-deployment)
22. [Conventions for Contributors / AI Agents](#22-conventions-for-contributors--ai-agents)
23. [Known Gaps, Mismatches & Tech Debt](#23-known-gaps-mismatches--tech-debt)
24. [Related Documentation Files](#24-related-documentation-files)

---

## 1. Executive Summary

**Resumate** is an AI-powered career platform: resume builder, ATS optimizer against job descriptions, AI career coach chat, and analytics dashboard. Users authenticate via **Clerk**; data persists in **PostgreSQL** via **Prisma**. AI features use **Groq** (`llama-3.3-70b-versatile`) through the **Vercel AI SDK** (`ai` v6).

| Capability | Status |
|------------|--------|
| Resume builder (sections, preview, auto-save) | Implemented |
| PDF/DOCX/TXT/JSON export | Implemented (client-side) |
| PDF/DOCX import + AI structuring | Implemented (`/api/upload/parse`) |
| ATS optimization | Implemented (`/api/ai/optimize`) |
| Career coach chat (streaming) | Implemented (`/api/ai/chat`) |
| Chat history in DB + UI load | Implemented |
| Dashboard real analytics API | Partial — API exists; **StatsDashboard UI still uses mock data** |
| Rate limiting on API routes | Not implemented (removed unused Upstash scaffolding) |
| Zod validation on API routes | Not implemented (validate at route level when added) |
| E2E tests | Config only — **no `e2e/` specs** |
| Unit tests | Setup only — **no test files** |

---

## 2. Tech Stack (Exact Versions)

From `package.json` (authoritative):

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Node.js | **24.x** (engines) |
| Framework | Next.js (App Router, Turbopack dev) | **16.2.6** |
| UI | React / React DOM | **19.0.0** |
| Language | TypeScript (strict) | **^5** |
| Auth | `@clerk/nextjs` | **7.3.7** |
| ORM | Prisma / `@prisma/client` | **^6.1.0** |
| Database | PostgreSQL | via `DATABASE_URL` |
| AI SDK | `ai` | **^6.0.185** |
| AI providers | `@ai-sdk/groq`, `@ai-sdk/google`, `@ai-sdk/react` | groq ^1.0.9, google ^1.0.7, react ^1.0.0 |
| Styling | Tailwind CSS | **^3.4.1** |
| Components | shadcn/ui (Radix primitives) | 40+ Radix packages |
| Icons | `lucide-react` | **^0.469.0** |
| Motion | `framer-motion` | **^11.16.0** |
| Forms | `react-hook-form`, `@hookform/resolvers`, `zod` | RHF ^7.54.2, zod ^3.23.8 |
| Data fetching (client) | `swr` | **^2.2.5** |
| Charts | `recharts` | **^2.12.7** |
| DnD | `@dnd-kit/*` | core ^6.3.1, sortable ^10.0.0 |
| PDF text extract | `unpdf` | **^1.4.0** |
| DOCX text extract | `mammoth` | **^1.11.0** |
| PDF export (client) | `html2canvas`, `jspdf` | 1.4.1, **4.2.1** |
| DOCX export (client) | `docx`, `file-saver` | docx ^9.5.0 |
| Rate limit (optional) | `@upstash/ratelimit`, `@upstash/redis` | ^2.0.5 / ^1.34.4 |
| Toasts | `sonner` | **^1.7.3** |
| Themes | `next-themes` | **^0.4.4** |
| PWA | Workbox 7.x | precaching, routing, strategies |
| Unit tests | `vitest`, `@testing-library/react`, `jsdom` | vitest ^4.1.6 |
| E2E | `@playwright/test` | ^1.49.1 |

**Font:** Google **Outfit** via `next/font` in `src/app/layout.tsx`.

---

## 3. Repository Layout

```
Resumate/
├── prisma/
│   ├── schema.prisma              # All models
│   └── migrations/
│       ├── 20260316090307_resumate/
│       └── 20260328095434_production_optimization/
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── sw.ts                      # Service worker (Workbox)
│   ├── favicon.ico, icons, svgs
│   └── offline.html (referenced by SW)
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root: Clerk, Theme, Toaster, AutoLogout
│   │   ├── page.tsx               # Landing → DashboardUI
│   │   ├── globals.css            # Design tokens + Tailwind
│   │   ├── loading.tsx
│   │   ├── dashboard/, builder/, optimizer/, coach/
│   │   ├── sign-in/, sign-up/     # Clerk catch-all routes
│   │   └── api/                   # Route handlers (see §7)
│   ├── components/
│   │   ├── ui/                    # 53 shadcn components
│   │   ├── builder/               # Resume builder modules
│   │   ├── optimizer/             # ATS optimizer modules
│   │   └── *.tsx                  # Shells, feature wrappers
│   ├── hooks/                     # Client hooks
│   ├── lib/                       # db, utils, animation
│   ├── test/setup.ts              # Vitest setup (@testing-library/jest-dom)
│   └── proxy.ts                   # Clerk auth gate (see §5)
├── optimization/                  # Agent build instructions + implementation plan
├── PROJECT_CONTEXT.md             # This file (primary documentation)
├── README.md
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── lighthouserc.json
├── components.json                # shadcn config
└── .env.example
```

**Removed / not present (important):**

- `src/app/api/upload/route.ts` — **deleted**; parsing is only `src/app/api/api/upload/parse/route.ts` → actually `src/app/api/upload/parse/route.ts`
- `src/middleware.ts` — **does not exist**; auth is `src/proxy.ts`
- `e2e/` — **no Playwright spec files** yet
- `src/lib/hooks/use-mobile.tsx` — **deleted**; use `src/hooks/use-mobile.ts`

---

## 4. Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser (React 19 Client Components)                           │
│  DashboardUI | Builder | Optimizer | Coach | StatsDashboard     │
└────────────────────────────┬────────────────────────────────────┘
                             │ fetch / useChat (SSE)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Next.js 16 App Router — src/app/api/*                          │
│  Clerk auth() on each protected handler                         │
└────────────┬───────────────────────────────┬────────────────────┘
             │                               │
             ▼                               ▼
┌────────────────────────┐      ┌──────────────────────────────┐
│  PostgreSQL (Prisma)   │      │  Groq API (llama-3.3-70b)    │
│  Resume, ChatMessage,  │      │  chat, optimize, parse       │
│  OptimizationReport, … │      │                              │
└────────────────────────┘      └──────────────────────────────┘
```

**Patterns in use:**

- **Prisma singleton** — `src/lib/db.ts` (global in dev for HMR)
- **Modular feature folders** — `builder/`, `optimizer/`
- **Re-export aliases** — `ResumeBuilder.tsx` → `ResumeBuilderRefactored`; `AIOptimizer.tsx` → `AIOptimizerRefactored`
- **Shell wrappers** — `*Shell.tsx` wrap features in `AppShell` layout
- **Dynamic imports** on landing `DashboardUI` for code splitting
- **Streaming AI** — `streamText` + `toDataStreamResponse()` for chat

---

## 5. Authentication & Route Protection

### Clerk

- Provider: `ClerkProvider` in `src/app/layout.tsx`
- Env: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- Sign-in: `/sign-in/[[...sign-in]]`
- Sign-up: `/sign-up/[[...sign-up]]`
- After sign-out: `/`
- README suggests Clerk dashboard redirects: after sign-in → `/dashboard`, after sign-up → `/builder`

### Middleware: `src/proxy.ts`

Clerk `clerkMiddleware` — **protects all routes by default** except:

| Public route pattern | Purpose |
|---------------------|---------|
| `/` | Landing (marketing + tabbed app preview) |
| `/sign-in(.*)` | Clerk sign-in |
| `/sign-up(.*)` | Clerk sign-up |
| `/api/webhooks(.*)` | Reserved for webhooks (**no handlers implemented yet**) |

Matcher excludes static assets and applies to `(api|trpc)(.*)`.

**Note:** There is no `middleware.ts`; Next.js 16 project uses `src/proxy.ts` as the auth middleware entry.

### Server-side redirects

Protected pages also call `auth()` and `redirect('/sign-in')` when unauthenticated (e.g. `src/app/builder/page.tsx`).

### AutoLogout

`src/components/AutoLogout.tsx` — 30 min idle → warning at 25 min → `signOut()` → `/sign-in?timeout=true`. Tracks mouse, keyboard, scroll, touch, visibility.

### User identity in DB

All app data uses **`clerkUserId`** (= Clerk `userId` from `auth()`). Legacy `User` model fields `userId` on Resume/ChatMessage duplicate this value but are not a separate auth system.

---

## 6. Pages & Routing

| Route | File | Wrapper | Main component | Auth |
|-------|------|---------|----------------|------|
| `/` | `src/app/page.tsx` | — | `DashboardUI` | Public (tabs gated in UI) |
| `/dashboard` | `src/app/dashboard/page.tsx` | `DashboardShell` | `StatsDashboard` | Protected |
| `/builder` | `src/app/builder/page.tsx` | `BuilderShell` | `ResumeBuilder` | Protected + redirect |
| `/optimizer` | `src/app/optimizer/page.tsx` | `OptimizerShell` | `AIOptimizer` | Protected |
| `/coach` | `src/app/coach/page.tsx` | `CoachShell` | `CareerCoachChat` | Protected |
| `/sign-in/*` | `src/app/sign-in/[[...sign-in]]/page.tsx` | — | Clerk `<SignIn />` | Public |
| `/sign-up/*` | `src/app/sign-up/[[...sign-up]]/page.tsx` | — | Clerk `<SignUp />` | Public |

### AppShell navigation (`src/components/AppShell.tsx`)

Desktop nav links: `/dashboard`, `/builder`, `/optimizer`, `/coach`. Includes `ThemeToggle`, `UserButton`, mobile sidebar (`MobileNav`).

### DashboardUI (`src/components/DashboardUI.tsx`)

Landing hub with tabs embedding (via dynamic import): Stats, Builder, Optimizer, Coach. Uses `useUser()` — shows auth gate for signed-out users on feature tabs.

---

## 7. API Reference (Complete)

All protected routes require Clerk session unless noted. Errors generally return `{ error: string }` JSON.

### `POST /api/ai/chat`

**File:** `src/app/api/ai/chat/route.ts`  
**maxDuration:** 30s

**Request body:**
```json
{
  "messages": [{ "role": "user|assistant|system", "content": "..." }],
  "sessionId": "optional — reused if provided",
  "resumeContext": "optional string appended to system prompt"
}
```

**Behavior:**

1. Validates messages array; requires at least one non-empty text message.
2. Session: reuse `sessionId`, or find session from last message within 30 min, or generate `session_{timestamp}_{random}`.
3. Persists last user message to `ChatMessage` before stream.
4. Model: `groq('llama-3.3-70b-versatile')` via `streamText`.
5. On finish: saves assistant message to DB.
6. Response: AI SDK data stream; header **`X-Session-Id`**.

**Errors:** 401, 400, 500 (missing `GROQ_API_KEY`).

---

### `GET /api/ai/chat/history`

**File:** `src/app/api/ai/chat/history/route.ts`

**Query params:**

| Param | Default | Max |
|-------|---------|-----|
| `limit` | 100 | 200 |
| `sessionId` | — | filter |

**Response:**
```json
{
  "messages": [{ "id", "role", "content", "timestamp", "sessionId", "reaction" }],
  "sessions": [{ "id", "messageCount", "lastActivity" }]
}
```

---

### `DELETE /api/ai/chat/history`

**Query:** optional `sessionId` — delete all user messages or one session.

**Response:** `{ "success": true }`

---

### `POST /api/ai/chat/messages/[id]/reaction`

**File:** `src/app/api/ai/chat/messages/[id]/reaction/route.ts`

**Body:** `{ "reaction": "thumbsUp" | "thumbsDown" }`  
Only **assistant** messages owned by user.

---

### `POST /api/ai/optimize`

**File:** `src/app/api/ai/optimize/route.ts`

**Request:**
```json
{
  "resumeText": "string (required)",
  "jobDescription": "string (required)"
}
```

**Processing:**

- Sanitizes prompt injection patterns (50k char cap).
- Groq `llama-3.3-70b-versatile`, `generateText`, JSON-only prompt.
- Parses JSON (strips markdown fences).
- Validates: `atsScore` number, `missingKeywords[]`, `matchedKeywords[]`, `suggestions[]`.

**Response:**
```json
{
  "atsScore": 72,
  "keywordsToAdd": ["..."],
  "matchedKeywords": ["..."],
  "suggestions": ["..."],
  "reportId": "cuid or null",
  "warning": "optional if DB save failed"
}
```

**DB:** Creates `OptimizationReport` with `keywords: { missing, matched }`. Failures logged; analysis still returned.

**Note:** `AI_SETUP.md` says Gemini for optimization; **code uses Groq only**.

---

### `POST /api/upload/parse`

**File:** `src/app/api/upload/parse/route.ts`  
**runtime:** nodejs | **maxDuration:** 120s

**Request:** `multipart/form-data`, field `file`

**Limits:** 10MB; types PDF, DOCX, MS Word.

**Pipeline:**

1. Extract text: `unpdf` (PDF) or `mammoth` (DOCX).
2. Minimum 50 chars or 400 error.
3. `parseResumeWithAI()` — Groq structures JSON (personalInfo, summary, experiences, education, projects, skills).
4. Truncated JSON repair heuristic if model cuts off.

**Response:** Full `ParsedResume` + `rawText` (see §16).

**Removed route:** `POST /api/upload` (old route deleted).

---

### `GET /api/resumes`

Lists resumes for `clerkUserId`, `orderBy: updatedAt desc`.

---

### `POST /api/resumes`

**Body:** `{ personalInfo, summary, experiences, education, projects?, skills }`  
Creates with `userId` and `clerkUserId` = Clerk id. **201** + resume object.

**Not validated with Zod** at the route layer.

---

### `GET /api/resumes/[id]`

Returns resume if `id` + `clerkUserId` match. **404** if not found.

---

### `PUT /api/resumes/[id]`

**Whitelist update fields:** `personalInfo`, `summary`, `experiences`, `education`, `projects`, `skills` only (mass-assignment safe).

**Does not update:** `title`, `sectionOrder`, `templateId`, `targetRole`, `isArchived` via API (schema has them; hook `useResumes` expects archive support — **gap**).

---

### `DELETE /api/resumes/[id]`

Hard delete. **204** No Content.

---

### `GET /api/resumes/[id]/versions`

Lists `ResumeVersion` snapshots, newest first, adds `versionNumber`, `changeDescription`.

---

### `POST /api/resumes/[id]/versions`

**Body:** `{ changeDescription?, label? }`  
Snapshots current resume JSON into `ResumeVersion.snapshot`.

---

### `GET /api/dashboard/stats`

**File:** `src/app/api/dashboard/stats/route.ts`

**Response shape (actual):**
```json
{
  "stats": {
    "resumesCount", "optimizationsCount", "chatSessionsCount",
    "latestScore", "avgScore", "scoreImprovement",
    "completionPercentage", "recentOptimizations"
  },
  "charts": {
    "scoreHistory": [{ "date", "score" }],
    "topMissingKeywords": [{ "keyword", "count" }],
    "weeklyActivity": "groupBy result (raw)"
  }
}
```

**Does not implement:** `dateRange` query (hook passes `?range=` but API ignores it).

---

### API routes not yet implemented

| Expected route | Notes |
|----------------|-------|
| `GET /api/optimization/reports` | List optimization history |
| `POST /api/ai/improve` | Per-section AI rewrite |
| UserActivity logging | `UserActivity` model exists |
| Share resume | Public share links |
| Clerk webhooks | `proxy.ts` public matcher only |

---

## 8. Database (Prisma)

**Datasource:** PostgreSQL, `env("DATABASE_URL")`  
**Client output:** `node_modules/.prisma/client`

### Active models (application use)

#### `Resume`

| Field | Type | Notes |
|-------|------|-------|
| id | cuid | PK |
| userId | String | Legacy; set to Clerk id |
| clerkUserId | String | Indexed |
| title | String? | Unique per user with title |
| personalInfo | Json | See structure below |
| summary | String? | |
| experiences | Json | Array |
| education | Json | Array |
| projects | Json? | Array |
| skills | String[] | |
| sectionOrder | String[] | DnD order |
| templateId | String? | |
| targetRole | String? | AI context |
| isArchived | Boolean | Soft delete default false |
| createdAt / updatedAt | DateTime | |

**Indexes:** `clerkUserId`, `(clerkUserId, updatedAt)`, unique `(clerkUserId, title)`

#### `ResumeVersion`

Snapshot JSON + optional `label`; cascade delete with resume.

#### `ResumeView`

`viewerIp` (intended SHA-256 hashed), `userAgent` — **no API writes yet**.

#### `ChatMessage`

`role`, `content`, `sessionId`, `reaction` (`thumbsUp`|`thumbsDown`).

#### `OptimizationReport`

`atsScore`, `keywords` Json, `suggestions` Json, optional `improvements`, `jobTitle`, `companyName`, `resumeId`.

#### `UserActivity`

Generic analytics — **no writers in API yet**.

#### `UserSettings`

`plan` (free|pro|admin), onboarding, `preferredTone`, `emailNotify` — **no API yet**.

### Legacy models (migration compatibility only)

`User`, `Session`, `Account`, `Verification` — Better Auth–style tables; **not used by Clerk flow**.

### JSON field structures (canonical)

**personalInfo:**
```json
{
  "fullName": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "portfolio": ""
}
```

**experience item:**
```json
{
  "id": "exp-1",
  "company": "",
  "position": "",
  "startDate": "YYYY-MM",
  "endDate": "Present",
  "description": ""
}
```

**education item:**
```json
{
  "id": "edu-1",
  "institution": "",
  "degree": "",
  "field": "",
  "graduationDate": ""
}
```

**project item:**
```json
{
  "id": "proj-1",
  "name": "",
  "description": "",
  "technologies": [],
  "link": ""
}
```

**optimization keywords (stored):**
```json
{ "missing": [], "matched": [] }
```

### Migrations

1. `20260316090307_resumate` — core tables  
2. `20260328095434_production_optimization` — versions, views, activity, settings, chat sessions, resume metadata

---

## 9. Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk client |
| `CLERK_SECRET_KEY` | Yes | Clerk server |
| `GROQ_API_KEY` | Yes | Chat, optimize, parse AI |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Recommended | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Recommended | `/sign-up` |
| `UPSTASH_REDIS_REST_URL` | Optional | Future rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Future rate limiting |
| `NODE_ENV` | Auto | development/production |

**Security:** Never commit `.env.local`. `.env.example` is a template only — rotate any keys that were ever committed.

---

## 10. Feature Flows (End-to-End)

### 10.1 Resume Builder

**Entry:** `/builder` → `BuilderShell` → `ResumeBuilder` (= `ResumeBuilderRefactored`)

**State:** `useResumeBuilder` — `ResumeData`, `resumeId`, auto-save **2s debounce** → `POST/PUT /api/resumes`.

**Sections:** personal (+ summary), experience, education, projects, skills — collapsible `SectionWrapper`.

**Import:** `useFileUpload` → `POST /api/upload/parse` → merges into `resumeData`.

**Export:**

| Format | Hook | Method |
|--------|------|--------|
| PDF | `usePdfExport` | html2canvas → jsPDF (A4) |
| DOCX | `useExportFormats` | `docx` package |
| TXT / JSON | `useExportFormats` | client generation |

**UI extras:** `ResumePreview`, full-screen preview dialog, `TemplatePicker`, `DraggableSections`, `VersionHistory`, `ExportMenu`, `ActionToolbar`.

**Save rule:** Requires `fullName` OR `email` for auto/manual save.

---

### 10.2 ATS Optimizer

**Entry:** `/optimizer` → `AIOptimizerRefactored` + `useOptimizer`

**Inputs:** Job description textarea; resume via paste, file upload, or edited parsed sections.

**Upload:** Same `/api/upload/parse`; builds plain text via `buildResumeText()`.

**Analyze:** `POST /api/ai/optimize` with `{ resumeText, jobDescription }`.

**UI modules:** `JobDescriptionInput`, `ResumeUploader`, `AnalysisProgress`, `ResultsPanel`, `ScoreCard`, `KeywordsPanel`, `SuggestionsPanel`, `ATSScoreGauge`, `EmptyResultsState`.

**View modes:** `text` | `sections` for parsed resume editing.

---

### 10.3 Career Coach

**Entry:** `/coach` or DashboardUI tab

**Client:** `useChat` from `@ai-sdk/react`, `api: '/api/ai/chat'`, passes `sessionId` in body.

**On mount:** Loads `/api/ai/chat/history?limit=40`, hydrates messages, sets `sessionId` from last message.

**Features:** Suggested questions, markdown rendering (`react-markdown`), copy message, thumbs up/down → reaction API.

---

### 10.4 Dashboard Analytics

**API:** Real DB aggregation (see §7).

**UI:** `StatsDashboard` — **still hardcoded mock charts** (`viewsData`, `skillsData`, etc.). `useDashboardStats` hook exists but is **not used** by `StatsDashboard`; response shape also **does not match** hook's expected flat `DashboardStats` type.

---

## 11. Frontend Components

### Shell & layout

| Component | Role |
|-----------|------|
| `AppShell` | Sidebar/top nav, Clerk `UserButton` |
| `DashboardShell` | Dashboard page layout |
| `BuilderShell` | Builder layout |
| `OptimizerShell` | Optimizer layout |
| `CoachShell` | Coach layout |
| `ThemeProvider` | `next-themes` dark default |
| `ThemeToggle` | Light/dark switch |

### Feature wrappers

| Export file | Actual implementation |
|-------------|----------------------|
| `ResumeBuilder.tsx` | `ResumeBuilderRefactored` |
| `AIOptimizer.tsx` | `AIOptimizerRefactored` |
| `DashboardUI.tsx` | Landing + tabbed features |
| `StatsDashboard.tsx` | Analytics UI (mock data) |
| `CareerCoachChat.tsx` | Chat UI |

### Builder module (`src/components/builder/`)

`PersonalInfoSection`, `ExperienceSection`, `EducationSection`, `ProjectsSection`, `SkillsSection`, `ResumePreview`, `ActionToolbar`, `SectionWrapper`, `DraggableSections`, `SortableSection`, `VersionHistory`, `ExportMenu`, `TemplatePicker`, hooks: `useResumeBuilder`, `useFileUpload`, `usePdfExport`, `useExportFormats`.

### Optimizer module (`src/components/optimizer/`)

Listed in §10.2; barrel `index.ts` exports all public pieces.

### shadcn/ui (`src/components/ui/` — 53 files)

Includes: Accordion, Alert, AlertDialog, Avatar, Badge, Breadcrumb, Button, ButtonGroup, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, Dialog, Drawer, DropdownMenu, Empty, Field, Form, HoverCard, Input, InputGroup, InputOTP, Item, Kbd, Label, Menubar, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Switch, Table, Tabs, Textarea, Toggle, ToggleGroup, Tooltip.

**Config:** `components.json` — style `new-york`, RSC, CSS variables, aliases `@/components`, `@/lib/utils`, `@/hooks`.

---

## 12. Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useResumeBuilder` | `builder/useResumeBuilder.ts` | Builder state + auto-save |
| `useFileUpload` | `builder/useFileUpload.ts` | Parse upload → resume data |
| `usePdfExport` | `builder/usePdfExport.ts` | PDF download |
| `useExportFormats` | `builder/useExportFormats.ts` | DOCX/TXT/JSON |
| `useOptimizer` | `optimizer/useOptimizer.ts` | Optimizer state + analyze |

`src/hooks/` has no standalone hooks after cleanup (logic lives in feature modules).

---

## 13. Shared Libraries (`src/lib`)

| File | Purpose |
|------|---------|
| `db.ts` | Prisma singleton |
| `utils.ts` | `cn()` — Tailwind class merge |
| `animation.ts` | Framer motion tokens, variants (used by `DashboardUI`) |

---

## 14. Design System & UI

### Tokens (`src/app/globals.css`)

Orange-forward dark theme (not purple from older docs):

- Primary HSL: `28 100% 54%` (~orange)
- Surfaces: zinc-like dark `0 0% 3%` background
- CSS vars: spacing, radius, duration, shadows, chart colors, sidebar tokens
- `.light` class overrides for light mode
- Utility classes: `glass-panel`, `futuristic-card`, `page-frame`, `skip-link`, shimmer skeletons

### Tailwind (`tailwind.config.ts`)

`darkMode: ["class"]`, extends shadcn color tokens from CSS variables.

### Motion

- Framer: `src/lib/animation.ts` — `duration`, `ease`, `pageVariants`, `springItem`, etc.
- `DashboardUI` uses `useReducedMotion` for accessibility

### Typography

Outfit (Google Font), scale via CSS vars `--text-xs` … `--text-4xl`.

---

## 15. AI Integration

### Production routes (actual)

| Feature | Provider | Model | SDK function |
|---------|----------|-------|--------------|
| Chat | Groq | llama-3.3-70b-versatile | `streamText` |
| Optimize | Groq | llama-3.3-70b-versatile | `generateText` |
| Parse resume | Groq | llama-3.3-70b-versatile | `generateText` (maxTokens 8192) |

### Prompt security

- 50k char limits on optimize/parse inputs
- Regex redaction of injection phrases
- XML-style wrappers `<RESUME_CONTENT>`, `<JOB_DESCRIPTION>`

### Client chat SDK

`@ai-sdk/react` `useChat` with `toDataStreamResponse()` on server.

### Discrepancy vs docs

- Older planning docs in `optimization/` may mention Gemini/Ollama — **production routes use Groq only**.
- Groq free tier: ~30 RPM (documented in `.env.example` comments).

---

## 16. File Upload & Parsing

**Endpoint:** `POST /api/upload/parse` only.

| Type | MIME | Library |
|------|------|---------|
| PDF | application/pdf | unpdf |
| Word | DOCX/DOC | mammoth |

**Output:** Structured sections + `rawText` for optimizer plain-text mode.

**Client validation:** 10MB, same MIME checks in `useOptimizer` / `useFileUpload`.

---

## 17. Export Formats

All **client-side** (no server PDF generation).

- **PDF:** html2canvas snapshot of preview DOM, white background, A4 jsPDF
- **DOCX:** structured sections via `docx` npm
- **TXT:** plain text concatenation
- **JSON:** full `ResumeData` backup

---

## 18. PWA

- `public/manifest.json` — standalone, shortcuts to builder/optimizer/coach
- Layout links manifest; theme color `#ff7a1a` in viewport
- Icons: `/icon-192.png`, `/icon-512.png` (referenced; verify exist in `public/`)
- Service worker removed (was never registered in Next config)

---

## 19. Testing & Quality

| Tool | Config | Status |
|------|--------|--------|
| Vitest | `vitest.config.ts`, `src/test/setup.ts` | No `*.test.tsx` files |
| Playwright | `playwright.config.ts`, expects `./e2e` | **No e2e folder** |
| ESLint | `eslint.config.mjs` | `npm run lint` |
| TypeScript | strict `tsc --noEmit` | `npm run type-check` |
| Lighthouse CI | `lighthouserc.json` | Performance/a11y budgets on key URLs |
| Coverage thresholds | 70% in vitest config | Not met (no tests) |

---

## 20. Scripts & Tooling

```json
"dev": "next dev --turbopack"
"build": "next build"
"start": "next start"
"lint" / "lint:fix"
"type-check": "tsc --noEmit"
"format" / "format:check": "prettier"
"db:generate" / "db:push" / "db:migrate" / "db:migrate:prod" / "db:studio" / "db:seed"
"test" / "test:watch" / "test:coverage"
"test:e2e" / "test:e2e:ui"
"analyze": "ANALYZE=true next build"
```

### `next.config.ts`

- Security headers (HSTS, X-Frame-Options, nosniff, referrer, permissions-policy)
- Static asset cache 1 year
- Image formats AVIF/WebP
- `optimizePackageImports` for lucide, framer-motion, recharts, radix

### Path alias

`@/*` → `./src/*` (`tsconfig.json`)

---

## 21. Deployment

**Recommended:** Vercel + Neon/Supabase PostgreSQL + Clerk + Groq.

**Steps:**

1. Set all required env vars in host dashboard.
2. `npm run build`
3. `npx prisma migrate deploy` (production migrations)
4. Configure Clerk production URLs and redirect URLs.
5. Optional: Upstash for rate limits.

**Node:** Must satisfy `engines.node: 24.x`.

---

## 22. Conventions for Contributors / AI Agents

1. **Read this file first** — do not rescan the whole repo for standard tasks.
2. **Minimize diff** — match existing patterns (orange theme, `glass-panel`, sonner toasts).
3. **Auth** — use `auth()` from `@clerk/nextjs/server` in API routes; `clerkUserId` for DB.
4. **DB** — import `prisma` from `@/lib/db` only; never `new PrismaClient()` elsewhere.
5. **AI** — Groq + AI SDK v6; chat streams with `toDataStreamResponse`.
6. **Upload** — only `/api/upload/parse`; do not recreate deleted `/api/upload/route.ts`.
7. **Validation** — add Zod at the API boundary when touching routes.
8. **Rate limits** — add Upstash (or similar) when exposing heavy public endpoints.
9. **Component splits** — extend `builder/` or `optimizer/` subfolders; keep refactored names exported via thin aliases.
10. **Do not commit secrets** — especially API keys in `.env.example`.
11. **Commits** — only when user explicitly asks (per project rules).

---

## 23. Known Gaps, Mismatches & Tech Debt

| Issue | Severity | Detail |
|-------|----------|--------|
| StatsDashboard mock data | High | API is real; UI ignores `useDashboardStats` |
| API/hook response shape | High | API returns `{ stats, charts }`; hook expects flat `DashboardStats` |
| `/api/optimization/reports` missing | Medium | No list endpoint for optimization history |
| PUT resume missing fields | Medium | `isArchived`, `title`, `sectionOrder` not in whitelist |
| `includeArchived` query on GET resumes | Low | Hook passes query; route ignores it |
| UserActivity / ResumeView / UserSettings | Low | Models exist; no CRUD APIs |
| Webhook routes | Low | Public in proxy; no handlers |
| Sentry | Low | Not integrated |
| Tests | Medium | Vitest/Playwright configured, no specs |
| Docs version drift | Low | README/docs cite Next 16.0.3, Clerk 6.x, AI SDK 4 — package.json is newer |
| Gemini/Ollama in old docs | Info | Production code is Groq-only for all three AI features |
| `.env.example` | Security | Must not contain real API keys |

### Recently changed (git snapshot context)

- Modified: `CareerCoachChat.tsx`, docs, `package.json`, optimization plans
- Deleted: `src/app/api/upload/route.ts`, `src/lib/hooks/use-mobile.tsx`
- Added: `src/test/setup.ts`, `.vscode/settings.json`

---

## 24. Related Documentation Files

| File | Contents |
|------|----------|
| `README.md` | Quick start, env setup, scripts |
| `PROJECT_CONTEXT.md` | This file — canonical project reference |
| `optimization/Resumate_Agent_Build_Instructions.txt` | Full production optimization spec (~1600 lines) |
| `optimization/Plan_v1___Optimize_Project_Features.md` | Gap analysis vs codebase (historical) |
| `.env.example` | Env template |

---

## Quick Local Bring-Up

```bash
npm install
cp .env.example .env.local   # fill DATABASE_URL, Clerk, GROQ_API_KEY
npm run db:generate
npm run db:migrate             # or db:push for dev
npm run dev                    # http://localhost:3000
```

If Prisma reports missing `DATABASE_URL`, ensure `.env.local` is loaded and restart the terminal from repo root.

---

*End of PROJECT_CONTEXT.md — maintain this file when adding routes, models, or changing AI providers.*
