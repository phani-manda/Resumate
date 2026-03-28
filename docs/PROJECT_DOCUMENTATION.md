# Resumate - AI-Powered Resume Builder & Career Coach

## Comprehensive Project Documentation

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Features](#4-features)
5. [API Reference](#5-api-reference)
6. [Database Schema](#6-database-schema)
7. [Component Library](#7-component-library)
8. [AI Integration](#8-ai-integration)
9. [UI/UX Design System](#9-uiux-design-system)
10. [Future Enhancements](#10-future-enhancements)
11. [Deployment Guide](#11-deployment-guide)

---

## 1. Project Overview

### What is Resumate?

**Resumate** is an intelligent career platform that combines AI-powered resume optimization with professional career coaching. It helps job seekers create ATS-compatible resumes, receive real-time feedback, and get personalized career advice.

### Problem Statement

| Challenge | How Resumate Solves It |
|-----------|------------------------|
| **ATS Rejection** | AI analyzes resumes against job descriptions, providing ATS scores and keyword optimization |
| **Resume Quality** | Structured builder with guided sections ensures professional formatting |
| **Slow Iteration** | Real-time AI feedback accelerates resume improvement |
| **Career Guidance** | AI career coach provides 24/7 professional advice |
| **File Compatibility** | Supports PDF/DOCX upload with intelligent text extraction |

### Target Users

- Job seekers (entry-level to senior)
- Career changers
- Freelancers updating portfolios
- Students entering workforce
- Professionals seeking promotions

---

## 2. Tech Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.3 | App Router, SSR, API routes |
| **React** | 19.0.0 | UI components |
| **TypeScript** | 5.x | Type safety |
| **Turbopack** | Built-in | Fast bundling |

### Authentication

| Technology | Version | Purpose |
|------------|---------|---------|
| **Clerk** | 6.9.3 | Auth, sessions, user management |

### Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | Latest | Data persistence |
| **Prisma ORM** | 6.1.0 | Database access, migrations |

### AI Integration

| Provider | Model | Use Case |
|----------|-------|----------|
| **Groq** | Llama 3.3 70B | Chat, optimization analysis |
| **Ollama** | Llama 3.2 | Local file parsing (optional) |
| **Vercel AI SDK** | 4.0.38 | Unified AI interface |

### UI & Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.4.1 | Utility-first styling |
| **shadcn/ui** | Latest | 48+ Radix UI components |
| **Framer Motion** | 11.16.0 | Animations |
| **Lucide React** | 0.469.0 | Icons |

### File Processing

| Technology | Version | Purpose |
|------------|---------|---------|
| **unpdf** | Latest | PDF text extraction |
| **mammoth** | 1.11.0 | DOCX parsing |
| **jspdf** | 3.0.4 | PDF generation |
| **html2canvas** | 1.4.1 | HTML to image conversion |

### Forms & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Hook Form** | 7.54.2 | Form state management |
| **Zod** | 3.23.8 | Schema validation |

### Visualization

| Technology | Version | Purpose |
|------------|---------|---------|
| **Recharts** | 2.12.7 | Charts (Line, Bar, Pie) |

---

## 3. Architecture

### Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # Backend API Routes
│   │   ├── ai/
│   │   │   ├── chat/             # Career coach streaming
│   │   │   └── optimize/         # Resume ATS analysis
│   │   ├── resumes/
│   │   │   ├── route.ts          # GET/POST resumes
│   │   │   └── [id]/route.ts     # GET/PUT/DELETE single
│   │   └── upload/
│   │       ├── route.ts          # File upload
│   │       └── parse/route.ts    # AI-powered parsing
│   ├── builder/                  # Resume builder page
│   ├── coach/                    # Career coach page
│   ├── dashboard/                # Analytics page
│   ├── optimizer/                # AI optimizer page
│   ├── sign-in/                  # Auth pages
│   ├── sign-up/
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   ├── ResumeBuilder.tsx         # Resume editor (28.5KB)
│   ├── AIOptimizer.tsx           # Optimization UI (42.9KB)
│   ├── CareerCoachChat.tsx       # Chat interface
│   ├── StatsDashboard.tsx        # Analytics
│   ├── DashboardUI.tsx           # Landing dashboard
│   ├── *Shell.tsx                # Page wrappers
│   └── ui/                       # shadcn components (48+)
├── lib/
│   ├── db.ts                     # Prisma singleton
│   ├── utils.ts                  # Utilities
│   └── hooks/                    # Custom hooks
└── middleware.ts                 # Clerk auth middleware

prisma/
└── schema.prisma                 # Database schema

public/                           # Static assets
```

### Architectural Patterns

1. **Middleware-Based Auth**: Clerk middleware protects routes by default
2. **Prisma Singleton**: Prevents connection exhaustion in development
3. **API Layer**: Centralized backend for AI, resume management, file processing
4. **Component-Based UI**: Modular, reusable shadcn/ui components
5. **Streaming Responses**: AI chat uses SSE for real-time feedback
6. **Error Handling**: Comprehensive error handling with user-friendly messages

### Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Client UI     │ ──▶ │   API Routes    │ ──▶ │   Database      │
│   (React)       │     │   (Next.js)     │     │   (PostgreSQL)  │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   AI Providers  │
                        │   (Groq/Ollama) │
                        └─────────────────┘
```

---

## 4. Features

### Resume Building ✅

| Feature | Description |
|---------|-------------|
| **Section Editor** | Personal info, summary, experience, education, projects, skills |
| **Real-time Save** | Auto-saves to database on changes |
| **PDF Export** | Download resume as formatted PDF |
| **Collapsible UI** | Expandable sections with smooth animations |
| **Full Preview** | Full-page preview mode |
| **CRUD Operations** | Create, read, update, delete resumes |

### AI-Powered Optimization ✅

| Feature | Description |
|---------|-------------|
| **ATS Score** | 0-100 compatibility score |
| **Keyword Analysis** | Missing vs. matched keywords |
| **Suggestions** | Actionable improvement tips |
| **Job Matching** | Compare against specific job descriptions |
| **Report Saving** | Persist optimization reports |
| **Injection Protection** | Sanitized prompts |

### File Upload & Parsing ✅

| Feature | Description |
|---------|-------------|
| **PDF Support** | Extract text from PDF files |
| **DOCX Support** | Parse Word documents |
| **AI Cleaning** | Ollama-powered text cleanup |
| **Size Limit** | 10MB server-side validation |
| **Error Handling** | Graceful fallbacks |

### Career Coach Chatbot ✅

| Feature | Description |
|---------|-------------|
| **Real-time Streaming** | SSE-powered responses |
| **Suggested Questions** | Starter prompts for new users |
| **Career Advice** | Resume tips, interview prep |
| **Message History** | In-session conversation |
| **Auth Required** | Protected endpoint |

### Analytics Dashboard ✅

| Feature | Description |
|---------|-------------|
| **Stats Cards** | Profile views, downloads, interest metrics |
| **Line Charts** | Views over time |
| **Bar Charts** | Optimization scores by category |
| **Pie Charts** | Skill distribution |
| **Bento Layout** | Modern card-based UI |

### Authentication ✅

| Feature | Description |
|---------|-------------|
| **Clerk Integration** | Sign-in, sign-up, sessions |
| **Protected Routes** | Automatic redirects |
| **Auto-Logout** | Session timeout handling |
| **User Profile** | Dropdown with user info |

### Additional Features ✅

- Dark mode by default
- Responsive design (mobile, tablet, desktop)
- Toast notifications (Sonner)
- Smooth animations (Framer Motion)
- Accessibility (Radix UI primitives)
- Full TypeScript coverage

---

## 5. API Reference

### AI Endpoints

#### `POST /api/ai/chat`

Stream career coach responses.

```typescript
// Request
{
  "messages": [
    { "role": "user", "content": "How do I improve my resume?" }
  ]
}

// Response: Server-Sent Events stream
data: {"content": "Here are some tips..."}
```

| Property | Value |
|----------|-------|
| Auth | Required (Clerk) |
| Model | Groq Llama 3.3 70B |
| Timeout | 30 seconds |
| Rate Limit | 30 RPM (Groq free tier) |

#### `POST /api/ai/optimize`

Analyze resume against job description.

```typescript
// Request
{
  "resumeText": "John Doe\nSoftware Engineer...",
  "jobDescription": "Looking for a React developer..."
}

// Response
{
  "atsScore": 72,
  "keywordsToAdd": ["TypeScript", "GraphQL"],
  "matchedKeywords": ["React", "Node.js"],
  "suggestions": ["Add metrics to achievements..."],
  "reportId": "clx123..." // if saved
}
```

| Property | Value |
|----------|-------|
| Auth | Required |
| Max Input | 50KB each |
| Sanitization | Injection protection |

### Resume Endpoints

#### `GET /api/resumes`

List all user resumes.

```typescript
// Response
[
  {
    "id": "clx123...",
    "personalInfo": { "fullName": "John Doe", ... },
    "summary": "...",
    "experiences": [...],
    "education": [...],
    "projects": [...],
    "skills": ["React", "Node.js"],
    "createdAt": "2024-01-15T...",
    "updatedAt": "2024-01-16T..."
  }
]
```

#### `POST /api/resumes`

Create new resume.

```typescript
// Request
{
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1 555-1234",
    "location": "New York, NY",
    "linkedin": "linkedin.com/in/johndoe",
    "portfolio": "johndoe.dev"
  },
  "summary": "Experienced software engineer...",
  "experiences": [
    {
      "id": "exp-1",
      "company": "Tech Corp",
      "position": "Senior Developer",
      "startDate": "2022-01",
      "endDate": "Present",
      "description": "Led development of..."
    }
  ],
  "education": [...],
  "projects": [...],
  "skills": ["React", "TypeScript"]
}

// Response: 201 Created
{ "id": "clx456...", ... }
```

#### `PUT /api/resumes/[id]`

Update resume (partial update).

```typescript
// Request
{
  "summary": "Updated summary...",
  "skills": ["React", "TypeScript", "GraphQL"]
}

// Allowed fields: personalInfo, summary, experiences, education, projects, skills
```

#### `DELETE /api/resumes/[id]`

Delete resume. Returns `204 No Content`.

### Upload Endpoints

#### `POST /api/upload`

Upload and parse resume file.

```typescript
// Request: FormData with 'file' field

// Response
{
  "text": "Extracted resume text...",
  "filename": "resume.pdf",
  "size": 125000,
  "type": "application/pdf"
}
```

| Property | Value |
|----------|-------|
| Max Size | 10MB |
| Formats | PDF, DOCX, DOC |
| Timeout | 60 seconds |

#### `POST /api/upload/parse`

AI-powered structured parsing.

```typescript
// Response
{
  "personalInfo": { ... },
  "summary": "...",
  "experiences": [...],
  "education": [...],
  "projects": [...],
  "skills": [...]
}
```

---

## 6. Database Schema

### Models

#### Resume (Active)

```prisma
model Resume {
  id           String   @id @default(cuid())
  userId       String   // Legacy
  clerkUserId  String   // Clerk user ID
  personalInfo Json     // { fullName, email, phone, location, linkedin, portfolio }
  summary      String?
  experiences  Json     // Array of experience objects
  education    Json     // Array of education objects
  projects     Json?    // Array of project objects
  skills       String[] // Array of skill strings
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@index([clerkUserId])
}
```

#### ChatMessage (Active)

```prisma
model ChatMessage {
  id          String   @id @default(cuid())
  userId      String
  clerkUserId String
  role        String   // "user" | "assistant"
  content     String
  timestamp   DateTime @default(now())
  
  @@index([clerkUserId])
}
```

#### OptimizationReport (Active)

```prisma
model OptimizationReport {
  id          String   @id @default(cuid())
  userId      String
  clerkUserId String
  resumeId    String?
  atsScore    Int      // 0-100
  keywords    Json     // { missing: [], matched: [] }
  suggestions Json     // Array of suggestions
  createdAt   DateTime @default(now())
  
  @@index([clerkUserId])
}
```

### JSON Field Structures

**personalInfo:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555-1234",
  "location": "New York, NY",
  "linkedin": "linkedin.com/in/johndoe",
  "portfolio": "johndoe.dev"
}
```

**experiences:**
```json
[
  {
    "id": "exp-1",
    "company": "Tech Corp",
    "position": "Senior Developer",
    "startDate": "2022-01",
    "endDate": "Present",
    "description": "Led development of microservices architecture..."
  }
]
```

**education:**
```json
[
  {
    "id": "edu-1",
    "institution": "State University",
    "degree": "Bachelor of Science",
    "field": "Computer Science",
    "graduationDate": "2020-05"
  }
]
```

**projects:**
```json
[
  {
    "id": "proj-1",
    "name": "E-commerce Platform",
    "description": "Built a full-stack e-commerce solution...",
    "technologies": ["React", "Node.js", "PostgreSQL"],
    "link": "github.com/johndoe/ecommerce"
  }
]
```

---

## 7. Component Library

### Page-Level Components

| Component | Size | Purpose |
|-----------|------|---------|
| **ResumeBuilder** | 28.5KB | Full resume editor |
| **AIOptimizer** | 42.9KB | Resume analysis UI |
| **CareerCoachChat** | ~15KB | Chat interface |
| **StatsDashboard** | ~20KB | Analytics |
| **DashboardUI** | ~12KB | Landing page |

### Shell Components

| Component | Purpose |
|-----------|---------|
| **AppShell** | Main layout with navigation |
| **BuilderShell** | Builder page wrapper |
| **OptimizerShell** | Optimizer page wrapper |
| **CoachShell** | Coach page wrapper |
| **DashboardShell** | Dashboard page wrapper |

### shadcn/ui Components (48+)

**Form & Input:**
- Input, Textarea, Label, Checkbox, RadioGroup, Select, Switch, Toggle
- Form, Slider, InputOTP, Calendar

**Layout:**
- Card, Separator, Accordion, Tabs, Drawer, Dialog, Sheet, Sidebar
- Resizable, ScrollArea, AspectRatio, Carousel, Pagination

**Feedback:**
- Alert, AlertDialog, Badge, Progress, Toast (Sonner)
- HoverCard, Popover, Tooltip, DropdownMenu, ContextMenu

**Navigation:**
- Breadcrumb, Command, NavigationMenu, Menubar, Collapsible

**Data Display:**
- Table, Chart, Avatar, Skeleton

---

## 8. AI Integration

### Architecture

```
User Request
     │
     ▼
┌────────────────────────────────┐
│  Next.js API Route             │
│  • Authentication (Clerk)      │
│  • Input validation            │
│  • Prompt sanitization         │
└───────────────┬────────────────┘
                │
                ▼
┌────────────────────────────────┐
│  Vercel AI SDK                 │
│  (Unified Interface)           │
└───────────────┬────────────────┘
                │
        ┌───────┴───────┐
        │               │
        ▼               ▼
┌──────────────┐ ┌──────────────┐
│ Groq         │ │ Ollama       │
│ Llama 3.3    │ │ Llama 3.2    │
│ (Cloud)      │ │ (Local)      │
└──────────────┘ └──────────────┘
```

### Use Cases

| Use Case | Provider | Model | Type |
|----------|----------|-------|------|
| Career Chat | Groq | Llama 3.3 70B | Streaming |
| Resume Optimization | Groq | Llama 3.3 70B | One-shot |
| File Parsing | Ollama | Llama 3.2 | One-shot |

### Prompt Engineering

**Resume Optimization Prompt:**
```
You are an expert ATS analyst. Analyze the resume against the job description.

<RESUME_CONTENT>
{sanitized resume text}
</RESUME_CONTENT>

<JOB_DESCRIPTION>
{sanitized job description}
</JOB_DESCRIPTION>

Respond with JSON: { atsScore, keywordsToAdd, matchedKeywords, suggestions }
```

**Security:**
- Input sanitization removes injection patterns
- XML-style delimiters separate user content
- 50KB text length limits
- Error messages don't expose internals

### Cost Analysis

| Feature | Requests/day (100 users) | Free Tier | Monthly Cost |
|---------|--------------------------|-----------|--------------|
| Chat | ~1,000 | 14,400/day | $0 |
| Optimization | ~300 | 14,400/day | $0 |
| File Parsing | ~200 | Unlimited (local) | $0 |

**Total: $0/month** for 100 active users

---

## 9. UI/UX Design System

### Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| **Primary** | Purple-Blue gradient | Buttons, accents |
| **Background** | Zinc-950/900 | Dark theme base |
| **Surface** | White/5-10% opacity | Cards, containers |
| **Border** | White/10-20% opacity | Separators |
| **Text Primary** | White | Headings |
| **Text Secondary** | Zinc-300/400 | Body text |
| **Success** | Emerald-500 | Positive states |
| **Warning** | Amber-500 | Warnings |
| **Error** | Red-500 | Errors |
| **Info** | Blue-500 | Information |

### Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| H1 | 3xl-4xl | Bold | White |
| H2 | 2xl | Semibold | White |
| H3 | xl | Medium | White |
| Body | sm-base | Normal | Zinc-300 |
| Caption | xs | Normal | Zinc-500 |

### Spacing System

| Size | Value | Usage |
|------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Icon gaps |
| md | 16px | Component padding |
| lg | 24px | Section gaps |
| xl | 32px | Page margins |
| 2xl | 48px | Large sections |

### Animation Principles

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Micro | 150ms | ease-out | Hovers, toggles |
| Standard | 200-300ms | ease-in-out | Transitions |
| Enter | 300ms | ease-out | Modal open |
| Exit | 200ms | ease-in | Modal close |
| Emphasis | 400-600ms | spring | Highlights |

### Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Laptop |
| xl | 1280px | Desktop |
| 2xl | 1536px | Large desktop |

### Component Patterns

**Cards:**
```css
bg-white/5 border border-white/10 rounded-xl p-4
hover:bg-white/10 transition-colors
```

**Buttons (Primary):**
```css
bg-gradient-to-r from-purple-600 to-blue-600
hover:from-purple-500 hover:to-blue-500
shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]
```

**Inputs:**
```css
bg-black/40 border-white/20 text-white
placeholder:text-zinc-500
focus:border-primary focus:ring-1 focus:ring-primary
```

**Section Headers:**
```css
flex items-center gap-2
[Icon className="h-4 w-4 text-{color}-400"]
[Text className="text-sm font-medium text-zinc-300"]
```

---

## 10. Future Enhancements

### 🔴 Critical (High Priority)

#### 1. Chat History Persistence
**Current:** Messages lost on page refresh
**Solution:**
- Save messages to `ChatMessage` model
- Add `GET /api/ai/chat/history` endpoint
- Load history on component mount
- Implement conversation sessions

#### 2. Real Analytics Data
**Current:** Dashboard uses mock data
**Solution:**
- Calculate real metrics from database
- Track resume views (add `ResumeView` model)
- Track optimization history
- Add weekly/monthly trend calculations

#### 3. Rate Limiting
**Current:** No API rate limits
**Solution:**
- Implement Redis-based rate limiting
- 10 chat requests/minute per user
- 5 optimization requests/minute
- Display rate limit feedback in UI

### 🟡 Medium Priority

#### 4. Resume Templates
**Description:** Multiple professional resume designs
**Implementation:**
- Add 5 template options (Modern, Classic, Minimal, Creative, Technical)
- Template preview before selection
- Template-specific PDF generation
- Store template preference in user profile

#### 5. Resume Version History
**Description:** Track changes over time
**Implementation:**
- Add `ResumeVersion` model
- Auto-snapshot before major changes
- Diff view to compare versions
- Restore from any version

#### 6. Job Application Tracker
**Description:** Track applications and responses
**Implementation:**
- Add `JobApplication` model (company, position, status, dates)
- Kanban board view (Applied → Interview → Offer → Rejected)
- Follow-up reminders
- Link applications to specific resume versions

#### 7. Multi-Format Export
**Description:** Export to multiple formats
**Implementation:**
- PDF (existing)
- DOCX (using `docx` npm package)
- Plain text
- JSON (for backup/import)
- LinkedIn-optimized format

#### 8. AI-Powered Rewriting
**Description:** One-click section improvements
**Implementation:**
- "Improve with AI" button per section
- Before/after comparison
- Accept/reject suggestions
- Style options (formal, concise, detailed)

### 🟢 Lower Priority

#### 9. Collaboration & Sharing
**Description:** Share resumes with mentors
**Implementation:**
- Shareable links with optional expiration
- View-only or comment modes
- Email invite system
- Activity feed for comments

#### 10. LinkedIn Integration
**Description:** Import profile data
**Implementation:**
- OAuth with LinkedIn
- Import work history, education, skills
- Sync updates bi-directionally
- Profile completeness suggestions

#### 11. Interview Prep Module
**Description:** AI mock interviews
**Implementation:**
- Practice common questions
- Role-specific question banks
- AI feedback on responses
- Video recording option (future)

#### 12. Skills Assessment
**Description:** Validate claimed skills
**Implementation:**
- Mini quizzes per skill
- Badge system for verified skills
- Industry-standard benchmarks
- Link to learning resources

### 🎨 UI Improvements

#### Layout & Responsiveness

| Improvement | Description | Priority |
|-------------|-------------|----------|
| **Mobile Builder** | Touch-friendly resume editing | High |
| **Tablet Optimization** | Two-column layouts | Medium |
| **Print Preview** | Accurate PDF preview | High |
| **Drag & Drop** | Reorder sections/items | Medium |

#### Visual Polish

| Improvement | Description | Priority |
|-------------|-------------|----------|
| **Skeleton Loading** | Loading states for all data | High |
| **Empty States** | Illustrated empty states | Medium |
| **Micro-animations** | Button feedback, transitions | Low |
| **Dark/Light Toggle** | Theme switching | Medium |

#### Accessibility

| Improvement | Description | Priority |
|-------------|-------------|----------|
| **ARIA Labels** | All interactive elements | High |
| **Keyboard Nav** | Full keyboard support | High |
| **Screen Reader** | Announce dynamic content | High |
| **Focus Indicators** | Visible focus rings | Medium |
| **Color Contrast** | WCAG AA compliance | High |

#### Performance

| Improvement | Description | Priority |
|-------------|-------------|----------|
| **Code Splitting** | Lazy load routes | High |
| **Image Optimization** | Next/Image everywhere | Medium |
| **Bundle Analysis** | Reduce JS size | Medium |
| **Caching** | SWR for data fetching | High |

---

## 11. Deployment Guide

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account
- Groq API key
- (Optional) Ollama for local AI

### Environment Variables

```env
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database
DATABASE_URL=postgresql://user:password@host:5432/resumate

# AI Services
GROQ_API_KEY=gsk_...

# Optional: Local AI
OLLAMA_BASE_URL=http://localhost:11434
```

### Deployment Steps (Vercel)

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   vercel env add CLERK_SECRET_KEY
   vercel env add DATABASE_URL
   vercel env add GROQ_API_KEY
   ```

3. **Configure Clerk**
   - Add production domain to Clerk dashboard
   - Set allowed redirect URLs

4. **Run Database Migration**
   ```bash
   npx prisma migrate deploy
   ```

5. **Deploy**
   ```bash
   vercel --prod
   ```

### Recommended Providers

| Service | Recommended | Alternative |
|---------|-------------|-------------|
| **Hosting** | Vercel | Railway, Render |
| **Database** | Neon | Supabase, PlanetScale |
| **Auth** | Clerk | Auth0, NextAuth |
| **AI** | Groq | OpenAI, Anthropic |

### Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking (add `@sentry/nextjs`)
- **LogRocket**: Session replay (optional)

---

## Quick Start (Development)

```bash
# Clone and install
git clone <repo>
cd resumate
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your keys

# Database setup
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## License

MIT License - see LICENSE file for details.

---

*Last updated: March 2026*
*Version: 1.0.0*
