# ResumeAI - AI-Powered Resume Builder & Career Coach

An intelligent resume optimization platform powered by AI, built with Next.js 15, Clerk authentication, Prisma, and Groq AI.

## Features

- **AI-Powered Resume Builder**: Create professional resumes with intelligent suggestions
- **Career Coach Chatbot**: Get personalized career advice and resume tips 24/7
- **AI Resume Optimizer**: Analyze and optimize your resume for ATS compatibility
- **Analytics Dashboard**: Track your resume performance and optimization metrics
- **Smart Keyword Matching**: Match your resume with job descriptions automatically
- **Real-time AI Streaming**: Get instant responses from the AI career coach

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Groq AI (llama-3.3-70b-versatile) with Vercel AI SDK
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account ([clerk.com](https://clerk.com))
- Groq API key ([console.groq.com](https://console.groq.com))

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# Groq AI
GROQ_API_KEY=your_groq_api_key
```

### Getting API Keys

**Clerk**:
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable and secret keys from the dashboard
4. Configure redirect URLs:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/builder`

**Groq**:
1. Sign up at [console.groq.com](https://console.groq.com)
2. Create a new API key
3. Copy the key to your `.env.local`

**PostgreSQL**:
- Use a local PostgreSQL installation, or
- Use a cloud provider like [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Railway](https://railway.app)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-resume-builder--career-coach
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see above)

4. Generate Prisma client:
```bash
npm run db:generate
```

5. Push database schema (development):
```bash
npm run db:push
```

For production, use migrations:
```bash
npm run db:migrate
```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database (dev)
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio GUI

## Database Setup

The application uses Prisma with PostgreSQL. To set up the database:

1. Create a PostgreSQL database
2. Add the connection string to `.env.local`
3. Run `npm run db:generate` to generate the Prisma client
4. Run `npm run db:push` (development) or `npx prisma migrate deploy` (production)

To view and manage your database:
```bash
npm run db:studio
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and configs
│   └── visual-edits/    # Visual editing tools
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

1. Build the application: `npm run build`
2. Set environment variables
3. Run database migrations: `npx prisma migrate deploy`
4. Start the server: `npm start`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Groq AI Documentation](https://console.groq.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

## License

MIT

