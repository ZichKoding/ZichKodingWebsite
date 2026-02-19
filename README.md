# ZichKoding Portfolio

> *"Exploring the digital frontier, one commit at a time."*

A space-themed interactive portfolio with a terminal explorer you can actually type into, a full blog CMS, project showcase, and admin panel. Built by Chris for job applications, freelance clients, and anyone who stumbles into orbit.

## Features

- **Space-themed Interactive Terminal**: Home page with ASCII art, animated starfield, and a working terminal with easter eggs
- **Sectioned Home Page**: Scrollable sections for About, Skills, Projects, Career, Blog, and Contact with dot navigation
- **Blog CMS**: Full-featured blogging platform with:
  - Rich text editor powered by Tiptap
  - Categories and filtering
  - Search functionality
  - Publishing and scheduling support
  - Cover images and excerpts
- **Project Showcase**: Featured projects with detailed descriptions, tech stacks, and links
- **Contact Management**:
  - Public contact form
  - Admin interface to manage messages
  - Status tracking (new, read, replied, archived)
  - Admin notes and reply tracking
- **Skills Management**:
  - Categorized skills (Frontend, Backend, DevOps, Tools, Leadership)
  - Proficiency levels (0-100)
  - Display ordering
- **Admin Panel**: Complete CRUD operations for all content types
- **Authentication**: Supabase Auth with email/password
- **Security**: Row-Level Security (RLS) policies for data protection
- **Responsive Design**: Dark theme optimized for all device sizes
- **Testing**: 68/68 tests passing with Vitest and Testing Library

## Tech Stack

### Core
- **Next.js 16** (App Router) - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **React 19** - UI component library
- **Tailwind CSS 4** - Utility-first CSS via `@tailwindcss/postcss` (no config file)

### Backend & Database
- **Supabase** - PostgreSQL database + authentication service
- **Supabase Auth** - User authentication and management
- **Supabase Row-Level Security** - Fine-grained access control

### Rich Text & Content
- **Tiptap 3** - WYSIWYG rich text editor
  - Code block highlighting with lowlight
  - Image support
  - Link formatting
  - YouTube embeds
  - Placeholder extensions

### UI & Utilities
- **Lucide React** - SVG icon library
- **date-fns** - Date formatting and manipulation
- **Slugify** - URL-friendly slug generation
- **Zod 4** - TypeScript-first schema validation

### Testing
- **Vitest 4** - Unit testing framework
- **Testing Library** - React component testing utilities
- **jsdom** - JavaScript DOM implementation

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account ([supabase.com](https://supabase.com) - free tier works)

### Setup

```bash
# Clone and install
git clone <repo-url>
cd portfolio
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials:
#   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
#   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Apply database schema
# In Supabase Dashboard > SQL Editor, run: supabase/migrations/001_initial_schema.sql

# Create admin user in Supabase Dashboard > Authentication > Users

# Launch
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're in orbit.

### Tests

```bash
npm test              # Watch mode
npm run test:run      # Single run (68/68 passing)
npm run test:coverage # Coverage report
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (dark theme, system fonts)
│   ├── globals.css             # Tailwind imports + @theme directives
│   ├── login/page.tsx          # Auth login page
│   ├── (public)/               # Public route group (no auth required)
│   │   ├── layout.tsx          # Navbar + Footer wrapper
│   │   ├── page.tsx            # HOME - Space terminal explorer
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
│   └── api/                    # REST API routes (public + admin)
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
│       ├── SpaceTerminal.tsx     # Terminal interface
│       ├── Starfield.tsx         # Animated star background
│       ├── TerminalOutput.tsx    # Terminal output display
│       ├── SectionDots.tsx       # Section navigation dots
│       └── sections/            # About, Skills, Projects, Career, Blog, Contact
├── hooks/
│   └── useTerminal.ts          # Terminal state management + commands
├── data/
│   └── terminal-data.ts        # Skills, career, projects for terminal
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client (cookies-based)
│   │   ├── proxy.ts            # Auth proxy for middleware
│   │   └── types.ts            # Database TypeScript types
│   ├── auth/admin.ts           # Admin route auth helper
│   ├── validations/            # Zod schemas (post, contact, project, etc.)
│   ├── test-utils/             # Supabase mock factory for tests
│   └── utils.ts                # formatDate, cn, truncate, generateGradient
└── middleware.ts               # Protects /admin/* routes, refreshes auth
```

## API Routes

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List published posts (supports `?category=`, `?search=`, pagination) |
| GET | `/api/posts/[slug]` | Get single post by slug |
| GET | `/api/categories` | List all categories |
| GET | `/api/projects` | List all projects |
| GET | `/api/skills` | List all skills |
| POST | `/api/contact` | Submit contact form |

### Admin Routes (authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST/PUT/DELETE | `/api/admin/posts` | Post CRUD |
| POST/PUT/DELETE | `/api/admin/projects` | Project CRUD |
| POST/PUT/DELETE | `/api/admin/categories` | Category CRUD |
| GET/PUT | `/api/admin/contacts` | Contact message management |
| POST/PUT/DELETE | `/api/admin/skills` | Skill CRUD |

## Terminal Commands

The home page terminal accepts these commands:

| Command | Description |
|---------|-------------|
| `help` | Display available commands |
| `about` | View profile and background |
| `skills` | View technical skills by category |
| `projects` | View featured projects |
| `career` | View career timeline |
| `contact` | Display contact information |
| `resume` | Download resume |
| `blog` | View recent blog posts |
| `clear` | Clear terminal output |
| `ls` | List available directories |
| `cd [dir]` | Navigate to directory |
| `matrix` | Enter the matrix |
| `quantum` | Observe quantum state |
| `sudo hire chris` | You know what to do |

## Database Schema

- **profiles**: User profiles linked to auth users
- **posts**: Blog posts with Tiptap JSON content
- **categories**: Blog post categories
- **post_categories**: Junction table linking posts to categories
- **projects**: Project showcase items
- **skills**: Technical skills with proficiency levels
- **contact_messages**: Contact form submissions

All tables use Row-Level Security. Public reads for published content, authenticated writes for admin operations.

## Deployment

### Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
4. Deploy

## Troubleshooting

**Build Issues:**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**Authentication Issues:**
- Verify Supabase credentials in `.env.local`
- Check that user exists in Supabase Authentication
- Ensure profile was created (check `profiles` table)

**Database Issues:**
- Verify migration ran successfully in Supabase SQL Editor
- Check RLS policies are correctly applied
- Ensure service role key is in `.env.local` (not in browser)

**Terminal Commands Not Working:**
- Check browser console for errors
- Verify terminal data in `/src/data/terminal-data.ts`
- Clear browser cache and reload

## License

MIT License

---

*"The universe is under no obligation to make sense to you." - But this codebase is. Warp speed ahead.*
