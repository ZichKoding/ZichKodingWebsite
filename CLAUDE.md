# CLAUDE.md — ZichKoding Portfolio

## Project Overview

This is Chris's personal portfolio website — a modern, interactive Next.js application with a space-themed terminal explorer home page, a full blog CMS with Tiptap rich text editor, project showcase, contact management, and admin panel. Built for both job applications and freelancing (Fiverr).

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript, Tailwind CSS 4)
- **Database**: Supabase (PostgreSQL + Auth + Row-Level Security)
- **Rich Text**: Tiptap with extensions (Image, Link, YouTube, CodeBlock)
- **Testing**: Vitest + React Testing Library
- **Icons**: Lucide React
- **Validation**: Zod
- **Deployment**: Vercel (target)

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build (also runs TypeScript check)
npm run lint         # ESLint
npm test             # Vitest in watch mode
npm run test:run     # Single test run
npm run test:coverage # Test coverage report
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (dark theme, system fonts)
│   ├── globals.css             # Tailwind imports + custom styles
│   ├── login/page.tsx          # Auth login page
│   ├── (public)/               # Public route group (no auth required)
│   │   ├── layout.tsx          # Navbar + Footer wrapper
│   │   ├── page.tsx            # HOME — Space terminal explorer
│   │   ├── blog/
│   │   │   ├── page.tsx        # Blog listing (search, filter, pagination)
│   │   │   └── [slug]/page.tsx # Individual blog post
│   │   ├── projects/page.tsx   # Projects showcase
│   │   └── contact/page.tsx    # Contact form
│   ├── (admin)/                # Admin route group (auth required)
│   │   ├── layout.tsx          # Admin sidebar layout
│   │   └── admin/
│   │       ├── page.tsx        # Admin dashboard
│   │       ├── posts/          # Blog post management + editor
│   │       ├── categories/     # Category CRUD
│   │       ├── contacts/       # Contact message triage
│   │       ├── projects/       # Project CRUD
│   │       └── skills/         # Skills management
│   └── api/
│       ├── posts/              # Public: GET published posts, GET by slug
│       ├── categories/         # Public: GET categories with post count
│       ├── projects/           # Public: GET projects
│       ├── contact/            # Public: POST contact form
│       ├── skills/             # Public: GET skills
│       └── admin/              # Protected: full CRUD for all entities
├── components/
│   ├── public/                 # Navbar, Footer, BlogCard, ProjectCard, etc.
│   │   ├── ConditionalFooter.tsx
│   │   ├── PublicLayoutClient.tsx
│   │   ├── SearchBar.tsx
│   │   ├── TerminalBubble.tsx
│   │   └── TiptapRenderer.tsx  # (+ Navbar, Footer, BlogCard, etc.)
│   ├── admin/                  # TiptapEditor, AdminSidebar, etc.
│   └── home/                   # Home page components
│       ├── HomePage.tsx          # Main home page orchestrator
│       ├── HomePage.module.css
│       ├── SpaceTerminal.tsx     # Terminal interface
│       ├── Starfield.tsx         # Animated star background
│       ├── Starfield.module.css
│       ├── TerminalOutput.tsx    # Terminal output display
│       ├── SectionDots.tsx       # Section navigation dots
│       └── sections/
│           ├── AboutSection.tsx
│           ├── SkillsSection.tsx
│           ├── ProjectsSection.tsx
│           ├── CareerSection.tsx
│           ├── BlogSection.tsx
│           └── ContactSection.tsx
├── hooks/
│   └── useTerminal.ts          # Terminal state management + commands
├── data/
│   └── terminal-data.ts        # Skills, career, projects for terminal
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client (createClient)
│   │   ├── server.ts           # Server Supabase client (cookies-based)
│   │   ├── proxy.ts             # Auth proxy for middleware
│   │   └── types.ts            # Database TypeScript types
│   ├── auth/
│   │   └── admin.ts            # Admin route auth helper
│   ├── validations/            # Zod schemas (post, contact, project, etc.)
│   ├── test-utils/             # Supabase mock factory for tests
│   └── utils.ts                # formatDate, cn, truncate, generateGradient
└── middleware.ts               # Protects /admin/* routes, refreshes auth
```

## Architecture Decisions

- **Route Groups**: `(public)` and `(admin)` separate public/admin layouts without affecting URL paths
- **Server Components by default**: Pages fetch data server-side; `'use client'` only for interactive parts (forms, search, terminal)
- **URL-based state**: Blog search, filters, pagination all stored in URL params for SSR + bookmarking
- **Tiptap JSON storage**: Blog content stored as JSONB in Supabase, rendered client-side with `generateHTML`
- **RLS Policies**: All tables have Row-Level Security; public tables readable by `anon`, mutations require `authenticated`
- **Middleware auth**: `/admin/*` routes redirect to `/login` if no session
- **Tailwind CSS 4**: Uses `@tailwindcss/postcss` — no `tailwind.config.ts`, theme customization via `@theme` directives in `globals.css`

## Database

- **Supabase project**: supabase-orange-door (hmiqcmnbtifcqpbwimry)
- **Schema migration**: `supabase/migrations/001_initial_schema.sql` (already applied)
- **Tables**: profiles, posts, categories, post_categories, projects, contact_messages, skills
- **Auto-triggers**: `updated_at` timestamps, profile creation on user signup

## Environment Variables

Required in `.env.local` (already configured):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional, for server admin operations)

## Testing

Tests live alongside routes in `__tests__/` directories. Supabase is mocked using the factory in `src/lib/test-utils/supabase-mock.ts`.

```bash
npm run test:run   # Run all tests (68/68 passing)
```

## Key Patterns

- **Admin auth check**: `src/lib/auth/admin.ts` — call `getAuthenticatedUser()` at top of admin route handlers
- **Zod validation**: All API inputs validated with schemas in `src/lib/validations/`
- **Slug generation**: Auto-generated from title using `slugify` package
- **Dark theme**: `bg-slate-950` background, `text-gray-100`, blue/purple accents throughout
- **Terminal commands**: Add new commands in `src/hooks/useTerminal.ts` `processCommand()` function

## Current Status

- ✅ Database schema deployed to Supabase
- ✅ All API routes built with tests
- ✅ Public pages (home, blog, projects, contact)
- ✅ Admin panel (posts editor, contacts, projects, categories, skills)
- ✅ Space terminal home page with interactive commands
- ✅ Build passes clean
- ✅ All tests passing (68/68)
- ⬜ Create admin user in Supabase Auth dashboard
- ⬜ Polish/iterate based on browser testing
