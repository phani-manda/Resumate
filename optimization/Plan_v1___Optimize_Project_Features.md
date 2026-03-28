I have created the following plan after thorough exploration and analysis of the codebase. Follow the below plan verbatim. Trust the files and references. Do not re-verify what's written in the plan. Explore only when absolutely necessary. First implement all the proposed file changes and then I'll review all the changes together at the end.

# Resumate Production Optimization — Implementation Plan

## Observations

The codebase has **already implemented a significant portion** of the optimization document. Specifically, the following are already in place: Prisma schema with all new models (`ResumeVersion`, `ResumeView`, `UserActivity`, `UserSettings`), database migration applied, rate limiting (`src/lib/rate-limit.ts`), error handling middleware (`src/lib/api-handler.ts`), Zod validation schemas (`src/lib/schemas.ts`), animation system (`src/lib/animation.ts`), micro-interactions (`src/lib/micro-interactions.ts`), stagger animations (`src/lib/stagger-animations.ts`), `ErrorBoundary`, `PageTransition`, `MobileNav`, `EmptyState`, `Skeletons`, `useAutoSave`, `useCountUp`, `useResumes` (SWR), `useDashboardStats`, AI fallback chain, security headers in `next.config.ts`, PWA manifest, skip-to-content link, and builder/optimizer component splits. All npm packages are installed.

## Approach

I've cross-referenced every section (1–22) of the optimization document against the existing codebase. Rather than re-implementing what exists, this plan focuses exclusively on the **remaining gaps** — features and enhancements that are either missing entirely or partially implemented. The plan is organized into the same 4 phases from the document, with completed items removed.

---

## Phase 1 — Foundation Gaps (Remaining Items)

### Step 1: Design Token System in `globals.css`
- **File:** `file:src/app/globals.css`
- Add the full CSS custom property token system to the `:root` block as specified in Section 2: brand colors (`--color-primary`, `--color-accent`), surfaces, text, semantic colors, spacing, radius, and motion tokens
- Add the typography scale CSS variables (`--text-xs` through `--text-4xl`)
- Add the shadow & glow system (`shadow-glow-p`, `shadow-glow-b`, `shadow-glow-e`, `shadow-inner`)
- Add the shimmer keyframe animation for skeletons

### Step 2: Extend Tailwind Config with Design Tokens
- **File:** `file:tailwind.config.ts`
- Extend the `theme` section to reference the CSS custom properties for colors, spacing, radius, and shadows
- Add the typography scale to `fontSize` with corresponding line-heights and font-weights
- Add the custom shadow/glow values to `boxShadow`

### Step 3: Wire Chat History to UI
- **File to create:** `file:src/app/api/ai/chat/history/route.ts`
- Implement `GET` endpoint that fetches `ChatMessage` records for the authenticated user from Prisma, ordered by timestamp, limited to 100
- Implement `DELETE` endpoint for clearing chat history (optionally by `sessionId`)
- **File:** `file:src/components/CareerCoachChat.tsx`
- On mount, fetch `/api/ai/chat/history` and populate the message list
- Save user messages to DB **before** streaming begins; save assistant messages **after** stream completes
- Add `sessionId` generation logic: create new session after 30 minutes of inactivity

### Step 4: Replace Dashboard Mock Data with Real DB Queries
- **File:** `file:src/app/api/dashboard/stats/route.ts`
- Verify this endpoint queries real data from `OptimizationReport`, `UserActivity`, `ChatMessage`, and `Resume` models
- Implement all 8 metrics: ATS score over time, resume completion %, optimization runs count, most common missing keywords, chat sessions per week, downloads count, score improvement delta, skills distribution
- **File:** `file:src/components/StatsDashboard.tsx` / `file:src/components/DashboardUI.tsx`
- Replace any hardcoded/mock data with the `useDashboardStats` hook data
- Implement the bento grid CSS layout for dashboard cards

### Step 5: Apply Rate Limiting to All API Routes
- The rate limiting infrastructure exists in `file:src/lib/rate-limit.ts`
- **Files to update:** `file:src/app/api/ai/chat/route.ts`, `file:src/app/api/ai/optimize/route.ts`, `file:src/app/api/upload/route.ts`, `file:src/app/api/resumes/route.ts`
- Import and apply `withRateLimit` or `checkRateLimit` at the top of each route handler with the appropriate limiter type (`chat`, `ai`, `upload`, `general`)
- Ensure the UI handles 429 responses gracefully — show a countdown timer to the user

### Step 6: Apply Zod Validation to All API Routes
- Schemas exist in `file:src/lib/schemas.ts`
- **Files to update:** All API route files under `file:src/app/api/`
- Use `validateBody` from `file:src/lib/api-handler.ts` with the appropriate schema in every `POST`/`PUT` handler
- Never use raw `req.json()` without validation

### Step 7: Set Up Sentry Error Tracking
- **Files to create:** `file:sentry.client.config.ts`, `file:sentry.server.config.ts`
- **Package to install:** `@sentry/nextjs`
- Configure Sentry DSN from environment variable `SENTRY_DSN`
- Update `file:src/lib/api-handler.ts` — replace the placeholder `captureException` with real `Sentry.captureException`
- Update `file:src/components/ErrorBoundary.tsx` — replace the placeholder `captureToSentry` with real Sentry integration
- Add `SENTRY_DSN` to `file:.env.example`

### Step 8: Add ARIA Labels Audit
- **Files to update:** All interactive components across `file:src/components/`
- Add `role="meter"` with `aria-valuenow/min/max` to ATS score gauge in `file:src/components/optimizer/ATSScoreGauge.tsx`
- Add `role="log"` with `aria-live="polite"` to chat messages container in `file:src/components/CareerCoachChat.tsx`
- Add `aria-busy="true"` to all loading states
- Add `aria-invalid="true"` and `aria-describedby` to form inputs with validation errors
- Add descriptive `aria-label` to all icon-only buttons (e.g., "Delete resume named [name]")
- Add `role="progressbar"` with value attributes to all progress bars

---

## Phase 2 — Component Refactor & Micro-Interactions (Remaining Items)

### Step 9: Verify Builder Component Split is Complete
- The builder split exists in `file:src/components/builder/`
- **Check:** Ensure `file:src/components/ResumeBuilderRefactored.tsx` is being used as the active component (not the old monolith)
- **Missing components to create if absent:**
  - `file:src/components/builder/sections/SummarySection.tsx`
  - `file:src/components/builder/sections/ProjectsSection.tsx`
  - `file:src/components/builder/shared/AddItemButton.tsx`
  - `file:src/components/builder/shared/DraggableItem.tsx`
  - `file:src/components/builder/shared/AIImproveButton.tsx`
  - `file:src/components/builder/preview/TemplateRenderer.tsx`

### Step 10: Verify Optimizer Component Split is Complete
- The optimizer split exists in `file:src/components/optimizer/`
- **Missing components to create if absent:**
  - `file:src/components/optimizer/ComparisonView.tsx` — side-by-side diff view
  - `file:src/components/optimizer/ReportHistory.tsx` — past optimization reports list
  - `file:src/components/optimizer/ResumeSelector.tsx` — dropdown to pick saved resume

### Step 11: Add Dynamic Imports with Skeleton Fallbacks
- **Files to update:** `file:src/app/builder/page.tsx`, `file:src/app/optimizer/page.tsx`, `file:src/app/dashboard/page.tsx`, `file:src/app/coach/page.tsx`
- Use `next/dynamic` to lazy-load the main component on each page with the corresponding skeleton from `file:src/components/Skeletons.tsx` as the loading fallback
- Dynamically import `recharts` with `{ ssr: false }` wherever charts are used

### Step 12: Apply Button Micro-Interaction States System-Wide
- The variants exist in `file:src/lib/micro-interactions.ts`
- **File:** `file:src/components/ui/Button.tsx`
- Integrate the 7 button states (default, hover, focus, active, loading, success, disabled) using the `buttonVariants` from the micro-interactions module
- Add loading spinner that replaces icon, success checkmark morph, and disabled state styling

### Step 13: Apply Input Micro-Interactions
- **File:** `file:src/components/ui/Input.tsx`, `file:src/components/ui/Textarea.tsx`
- Implement: focus ring animation, character count (fades in near limit), validation shake on error, clear button that fades in when field has value, paste detection highlight
- Add autofill styling override in `file:src/app/globals.css`

### Step 14: Apply Card Hover Effects Universally
- **File:** `file:src/components/ui/Card.tsx`
- Add hover lift (`translateY(-2px)` + shadow expansion), focus-within highlight, and gradient border on hover using the `cardVariants` from `file:src/lib/micro-interactions.ts`

### Step 15: Build Interactive Keyword Chip System
- **File:** `file:src/components/optimizer/KeywordsPanel.tsx`
- Ensure keyword chips have matched/missing/partial color coding with the specified Tailwind classes
- Add click-to-add-to-resume functionality — clicking a missing keyword should add it to the active resume

---

## Phase 3 — Features & Polish (Remaining Items)

### Step 16: AI Section Improvement Button
- **File to create:** `file:src/app/api/ai/improve-section/route.ts`
- Accept `sectionType`, `content`, and `tone` parameters (use `ImproveSectionSchema` from `file:src/lib/schemas.ts`)
- Call AI with section-specific prompt, return `{ improved, diff }`
- **File to create:** `file:src/components/builder/shared/AIImproveButton.tsx`
- Add "Improve with AI" button to each `SectionWrapper`
- Show before/after modal with Accept and Reject buttons

### Step 17: Build Before/After Comparison Diff View
- **File to create:** `file:src/components/optimizer/ComparisonView.tsx`
- Implement side-by-side display showing original vs. improved text
- Highlight differences with color coding (additions in green, removals in red)

### Step 18: Build Onboarding Flow
- **Files to create:**
  - `file:src/components/onboarding/OnboardingFlow.tsx` — 7-step flow container
  - `file:src/components/onboarding/OnboardingProgress.tsx` — animated progress indicator
- Steps: Welcome splash → Choose goal → Upload or build → Quick profile → First optimization → Explore coach → Dashboard tour
- Track progress via `UserSettings.onboardingStep` and `onboardingDone` fields (already in Prisma schema)

### Step 19: Chat UX Enhancements
- **File:** `file:src/components/CareerCoachChat.tsx`
- Add typing indicator (3-dot bounce animation) — hide on first token received
- Add message reactions (thumbs up/down) — persist via `ChatMessage.reaction` field
- Add copy message button on hover
- Add suggested follow-up question chips after each AI response
- Add markdown rendering using `react-markdown` (already installed)
- Add context awareness — auto-inject active resume data as system context

### Step 20: Streaming Analysis Progress UI
- **File:** `file:src/components/optimizer/AnalysisProgress.tsx`
- Verify the 6-step sequential progress display is implemented with animated checkmarks
- Each step: spinner while active, green checkmark when complete, grayed out when pending

### Step 21: Clerk Webhook Endpoint
- **File to create:** `file:src/app/api/webhooks/clerk/route.ts`
- Handle `user.created` → auto-provision `UserSettings` row with `plan: 'free'`
- Handle `user.deleted` → GDPR cascade delete all user data (`ChatMessage`, `OptimizationReport`, `Resume`, `UserActivity`, `UserSettings`)
- Verify webhook signature using `svix` (already installed)

### Step 22: GDPR Data Export Endpoint
- **File to create:** `file:src/app/api/user/export/route.ts`
- `GET` endpoint that returns all user data (resumes, chat messages, optimization reports, activity) as downloadable JSON

---

## Phase 4 — Scale & Growth (Remaining Items)

### Step 23: Redis Caching for Optimization Results
- **File to create:** `file:src/lib/cache.ts`
- Implement `optimizationCacheKey`, `getCachedOptimization`, `cacheOptimization` using `@upstash/redis` (already installed)
- Cache optimization results with 1-hour TTL
- Cache resume lists with 30-second TTL, invalidate on mutation
- Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to `file:.env.example`

### Step 24: Database Connection Pooling
- **File:** `file:src/lib/db.ts`
- Add connection pooling parameters to the Prisma client: `connection_limit=10&pool_timeout=20`
- Add comment about using Neon PgBouncer URL format for production

### Step 25: AI Retry with Exponential Backoff
- **File to create:** `file:src/lib/ai-client.ts`
- Implement `callGroqWithRetry` with exponential backoff (500ms, 1000ms, 2000ms)
- The fallback chain already exists in `file:src/lib/ai-fallback.ts` — integrate retry logic into it
- Add Zod validation of AI output using `OptimizationResultSchema` before returning results
- Handle non-JSON AI responses with re-prompt strategy

### Step 26: Prompt Versioning System
- **Directory to create:** `file:src/lib/prompts/`
- Move all AI prompts from inline strings in route handlers to versioned files
- Add version comment headers to each prompt file

### Step 27: CI/CD Pipeline
- **File to create:** `file:.github/workflows/ci.yml`
- Jobs: `quality` (type-check, lint, unit tests, build), `e2e` (Playwright), `lighthouse` (Lighthouse CI), `accessibility` (axe-playwright), `deploy` (Vercel on main)
- Reference existing scripts from `file:package.json`

### Step 28: Vercel Analytics & Speed Insights
- **Packages to install:** `@vercel/analytics`, `@vercel/speed-insights`
- **File:** `file:src/app/layout.tsx`
- Add `<Analytics />` and `<SpeedInsights />` components to the root layout

### Step 29: Structured Logging
- **File to create:** `file:src/lib/logger.ts`
- Implement structured logger with fields: `userId`, `route`, `duration`, `statusCode`, `errorMessage`
- PII masking: mask email/phone before logging
- Use in all API routes

### Step 30: Landing Page Sections
- **File:** `file:src/app/page.tsx`
- Implement the 8 landing page sections: Hero (with animated ATS counter), Social Proof, Feature Showcase, ATS Score Demo, Testimonials, Pricing, FAQ Accordion (using Radix Accordion), Footer

### Step 31: PWA Service Worker & Offline Support
- **File:** `file:public/sw.ts` (already exists — verify implementation)
- Ensure Workbox strategies are configured for caching API responses and static assets
- Implement IndexedDB caching for resume data for offline editing
- **File:** `file:src/components/PWAInstallPrompt.tsx` (already exists — verify `beforeinstallprompt` handling)

### Step 32: Keyboard Navigation Enhancements
- **File:** `file:src/hooks/useKeyboardNavigation.tsx` (already exists — verify completeness)
- Ensure custom shortcuts: `Cmd+S` → save, `Cmd+P` → preview, `Cmd+E` → export, `Escape` → close panels
- Add roving tabindex for resume section item lists
- Install and integrate `focus-trap-react` (already installed) in all modal/dialog components

---

## Architecture Overview

```mermaid
graph TD
    subgraph "Frontend (React 19 + Next.js 16)"
        A[Root Layout] --> B[PageTransition]
        B --> C[ErrorBoundary]
        C --> D1[Dashboard Page]
        C --> D2[Builder Page]
        C --> D3[Optimizer Page]
        C --> D4[Coach Page]
        D1 --> E1[StatsDashboard - dynamic import]
        D2 --> E2[ResumeBuilder - dynamic import]
        D3 --> E3[AIOptimizer - dynamic import]
        D4 --> E4[CareerCoachChat - dynamic import]
    end

    subgraph "Data Layer"
        F1[useResumes - SWR]
        F2[useDashboardStats - SWR]
        F3[useChatHistory - SWR]
        F4[useAutoSave]
    end

    subgraph "API Routes"
        G1[/api/resumes]
        G2[/api/ai/optimize]
        G3[/api/ai/chat]
        G4[/api/dashboard/stats]
        G5[/api/ai/improve-section]
        G6[/api/webhooks/clerk]
        G7[/api/user/export]
        G8[/api/ai/chat/history]
    end

    subgraph "Infrastructure"
        H1[Rate Limiting - Upstash]
        H2[Redis Cache - Upstash]
        H3[AI Fallback - Groq → Google]
        H4[Prisma + PostgreSQL]
        H5[Sentry Error Tracking]
        H6[Zod Validation]
    end

    G1 & G2 & G3 & G4 & G5 --> H1
    G2 --> H2
    G2 & G3 & G5 --> H3
    G1 & G2 & G3 & G4 --> H4
    G1 & G2 & G3 & G4 --> H5
    G1 & G2 & G3 & G4 & G5 --> H6
```

## New Files to Create Summary

| File | Purpose |
|------|---------|
| `src/app/api/ai/chat/history/route.ts` | Chat history persistence API |
| `src/app/api/ai/improve-section/route.ts` | Per-section AI improvement API |
| `src/app/api/webhooks/clerk/route.ts` | Clerk webhook for user lifecycle |
| `src/app/api/user/export/route.ts` | GDPR data export endpoint |
| `src/lib/cache.ts` | Redis caching layer |
| `src/lib/ai-client.ts` | AI retry + exponential backoff |
| `src/lib/logger.ts` | Structured logging |
| `src/lib/prompts/` | Versioned AI prompt files |
| `src/components/onboarding/OnboardingFlow.tsx` | 7-step onboarding |
| `src/components/onboarding/OnboardingProgress.tsx` | Onboarding progress indicator |
| `src/components/optimizer/ComparisonView.tsx` | Before/after diff view |
| `src/components/optimizer/ReportHistory.tsx` | Past optimization reports |
| `src/components/builder/shared/AIImproveButton.tsx` | Per-section AI polish button |
| `sentry.client.config.ts` | Sentry client configuration |
| `sentry.server.config.ts` | Sentry server configuration |
| `.github/workflows/ci.yml` | CI/CD pipeline |

## New Packages to Install

| Package | Purpose |
|---------|---------|
| `@sentry/nextjs` | Error tracking & performance monitoring |
| `@vercel/analytics` | Web vitals & page view tracking |
| `@vercel/speed-insights` | Core Web Vitals per route |
| `shepherd.js` | Onboarding tour tooltips |
| `@lhci/cli` (dev) | Lighthouse CI for performance gates |

> **Note:** All other packages listed in the optimization document (`swr`, `@dnd-kit/*`, `focus-trap-react`, `react-markdown`, `@upstash/redis`, `@upstash/ratelimit`, `docx`, `msw`, `vitest`, `playwright`, `@axe-core/playwright`, etc.) are **already installed** in `package.json`.