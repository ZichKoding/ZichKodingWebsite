# COWORK-CONTEXT.md

> Answers to every section of COWORK-QUESTIONS.md, based on the full design sessions and build history.

---

## 1. Original Design Vision

**Overall Aesthetic**: A dark, sci-fi-inspired portfolio that blends a space/quantum physics theme with a functional developer terminal. The site should feel like a mission control interface crossed with a star map — technically impressive, memorable, and accessible to both recruiters and Fiverr clients.

**Color Palette**:
- Background: `#0a0a1a` (deep navy/black), Tailwind `bg-slate-950`
- Primary text: `text-gray-100` / `text-gray-200`
- Terminal text (input/prompts): `#00ff9d` or Tailwind `text-green-400` / `text-emerald-400`
- Accent blue: `#3b82f6` (Tailwind `blue-500`)
- Accent purple: `#8b5cf6` (Tailwind `purple-500`)
- Terminal cursor/glow: cyan `#06b6d4` (Tailwind `cyan-400`)
- Error text: `text-red-400`
- Stars: white / blue-white dots (`#ffffff`, `#e0e7ff`)

**Animations**:
- 3-layer parallax starfield (CSS radial-gradient stars drifting at 200s, 100s, 50s)
- Terminal typing animation (fast, ~5ms per character)
- Constellation overlay that activates when `skills` command is typed
- Frosted glass (backdrop-blur) on terminal window and navbar
- Subtle hover transitions on cards (scale, shadow, border glow)
- Blinking cyan cursor with glow effect

**No specific reference sites** were cited, but the vibe is: Claude Code's terminal aesthetic meets a NASA mission dashboard, with a Notion-like editor for the blog admin.

---

## 2. Home Page (SpaceTerminal)

**Available Commands**:
| Command | Description |
|---------|-------------|
| `help` | Shows list of all commands |
| `about` | Bio: UCF-certified Full-Stack Dev, Lead Developer & Tech Manager, loves space/quantum physics |
| `skills` | Shows skills with █░ progress bars + triggers constellation animation in starfield |
| `projects` | Shows project cards with ASCII borders, descriptions, and links |
| `career` | Career timeline with │ and ├── ASCII formatting |
| `contact` | Contact info + link to /contact |
| `resume` | "Downloading resume..." progress animation + PDF link |
| `blog` | Recent blog posts with links to /blog |
| `clear` | Clears terminal output |
| `ls` | Lists "directories": about/ skills/ projects/ career/ contact/ blog/ |
| `cd <dir>` | Navigates to corresponding page (e.g., `cd projects` → /projects) |

**Easter Eggs**:
| Command | Effect |
|---------|--------|
| `sudo hire chris` | "Permission granted! 🚀 Redirecting to contact page..." → navigates to /contact |
| `matrix` | Brief matrix rain effect in terminal |
| `quantum` | "Observing quantum state..." → randomly reveals skills one by one |

**Starfield**: 3 layers of CSS-animated stars using radial-gradient box-shadows. Small (1px/200s drift), medium (2px/100s), large (3px/50s). Radial gradient overlay at edges for depth. Stars are white/blue-white on `#0a0a1a` background.

**First Visit Experience**: Auto-typing welcome sequence:
```
> Initializing ZichKoding Portfolio...
> Loading quantum state... ████████████ 100%
> Welcome to Chris's Portfolio Terminal
>
> Type 'help' to see available commands, or click a suggestion below.
```
Below the terminal: clickable suggestion chips for `about`, `skills`, `projects`, `career`, `contact`.

**Terminal UI**: Frosted glass window (max-width ~800px), macOS-style traffic light dots (red/yellow/green) in header bar, title "chris@zichkoding ~ $", scrollable output area, input line with prompt `visitor@zichkoding:~$ ` and blinking cyan cursor.

**Keyboard**: Command history (up/down arrows), tab completion for command names.

---

## 3. Page-by-Page Requirements

### Public Pages

**Blog (`/blog`)**:
- Search bar at top (debounced, updates `?q=` URL param)
- Horizontal scrollable category filter pills (updates `?category=` param), "All" option to clear
- Date sort toggle (newest/oldest via `?sort=` param)
- 2-column grid on desktop, 1 on mobile
- Blog cards: cover image (or gradient placeholder generated from title), title, excerpt, date (formatted like "Jan 15, 2026"), category tags, "Read more" link
- Pagination at bottom with page numbers + prev/next (via `?page=` param)
- Empty state: friendly "No posts yet" message
- Individual post page (`/blog/[slug]`): title, author, published date, categories, cover image, Tiptap JSON content rendered to HTML with good typography (prose styling), "Back to blog" link

**Projects (`/projects`)**:
- Featured projects section at top (larger cards)
- Regular projects in grid below, ordered by `display_order`
- Each card: image (or gradient placeholder), title, description (truncated), tech stack as colored badges, external link icons for live URL and GitHub URL
- Hover animations on cards

**Contact (`/contact`)**:
- Centered form with fields: name, email, subject, message (textarea)
- Client-side Zod validation matching the API schema (name min 1/max 100, email valid, subject min 1/max 200, message min 10/max 5000)
- Field-level error messages shown inline
- Submit button with loading state
- Success state: "Message sent!" confirmation with icon
- Error state: "Something went wrong" with retry option
- Submits to `POST /api/contact`

### Admin Pages

**Dashboard (`/admin`)**:
- Overview stats: total posts (published/draft), total contacts (by status), total projects, total skills
- Recent activity section (latest contacts, recently edited posts)
- Quick action links to create new post, view contacts, etc.

**Posts Editor (`/admin/posts`)**:
- List view: all posts including drafts, with title, status (published/draft), date, edit/delete actions
- Editor page: Tiptap rich text editor with toolbar for bold, italic, headings, lists, code blocks, images (URL-based), links, YouTube embeds (via URL), and a placeholder extension
- Draft/publish toggle (boolean `published` field)
- Auto-generates slug from title using `slugify`
- Category selection (multi-select from existing categories)
- Excerpt field, cover image URL field

**Categories (`/admin/categories`)**:
- Simple list with name, description, post count
- Inline create (name + description → auto-generates slug)
- Edit/delete actions

**Contacts (`/admin/contacts`)**:
- List view with status filter pills (All, New, Read, Replied, Archived)
- Each message shows: name, email, subject, date, status badge
- Detail view: full message, status update dropdown, admin notes textarea
- Status workflow: new → read → replied → archived

**Projects (`/admin/projects`)**:
- List with title, featured badge, display order
- Create/edit form: title, description, content (Tiptap), tech_stack (comma-separated → array), live_url, github_url, image_url, featured toggle, display_order number

**Skills (`/admin/skills`)**:
- Grouped by category (frontend, backend, devops, tools, leadership)
- Each skill: name, proficiency (1-100 slider or number input), icon, display_order
- Create/edit/delete

---

## 4. Database Content Plan

**Categories** (suggested initial set):
- Web Development
- DevOps & Cloud
- Tutorials & How-To
- Software Architecture
- Leadership & Management
- JavaScript / TypeScript
- Python

**Initial Blog Posts**: None seeded yet. Chris will write these through the admin editor. The seed file (`supabase/seed.sql`) exists but may be empty or have sample data.

**Projects to Showcase** (placeholder data in `src/data/terminal-data.ts`, should be replaced with real ones):
1. **ZichKoding Portfolio** — This portfolio itself (Next.js, Supabase, Tiptap, Tailwind)
2. Other projects Chris wants to add via the admin panel

**Skills** (defined in `src/data/terminal-data.ts` for the terminal, should also be added via admin to the DB):
- **Frontend**: React (90%), Next.js (85%), TypeScript (88%), Tailwind CSS (85%), HTML/CSS (95%)
- **Backend**: Node.js (85%), Python (75%), PostgreSQL (80%), REST APIs (90%), GraphQL (70%)
- **DevOps**: Docker (75%), AWS (70%), CI/CD (80%), Linux (78%), Vercel (85%)
- **Tools**: Git (92%), VS Code (90%), Figma (65%), Postman (85%), Jira (80%)
- **Leadership**: Team Management (88%), Agile/Scrum (85%), Code Review (90%), Mentoring (85%), Technical Writing (80%)

---

## 5. Known Issues & TODOs

**RESOLVED**:
- ~~Root `src/app/page.tsx` shadows SpaceTerminal~~ — **Fixed**: file deleted, `(public)/page.tsx` now serves `/`
- ~~MySQL-style COMMENT syntax in migration SQL~~ — **Fixed**: inline COMMENTs replaced with `COMMENT ON COLUMN` statements
- ~~Supabase client export mismatch~~ — **Fixed**: exports `createClient` function
- ~~Next.js 16 Promise params~~ — **Fixed**: all route handlers and pages await params
- ~~Supabase `leftJoin` usage~~ — **Fixed**: replaced with two-step query pattern
- ~~Google Font loading in sandbox~~ — **Fixed**: removed Geist fonts, using system fonts

**STILL OPEN**:
- **Placeholder social links**: Footer has generic GitHub, LinkedIn, email URLs (need real ones — see Section 6)
- **2 test failures**: Category filter mock tests fail due to the two-step query refactor. Not logic bugs; will pass against real Supabase.
- **Admin panel not browser-tested yet**: Built but needs manual verification
- **No admin user created yet**: Need to create one in Supabase Auth dashboard
- **Terminal data is static**: Skills/projects/career in `src/data/terminal-data.ts` are hardcoded placeholders. Could optionally fetch from Supabase instead.
- **No image upload**: Images are URL-based only (no Supabase Storage integration yet). Blog cover images and project images require pasting a URL.
- **Resume PDF**: The `resume` terminal command links to a placeholder. Needs a real PDF uploaded to `/public/` or Supabase Storage.
- **SEO**: Basic title/description metadata exists. No OG images, no sitemap, no robots.txt yet.
- **Mobile testing**: Responsive design built with Tailwind breakpoints but not manually verified on mobile devices.

---

## 6. Social Links & Branding

- **GitHub**: `https://github.com/ZichKoding` (needs confirmation from Chris)
- **LinkedIn**: Needs Chris's real LinkedIn URL
- **Contact email**: `chriszichkocoding@gmail.com` (from user profile)
- **Fiverr profile**: Needs URL if Chris has one
- **Other socials**: Unknown — Chris should specify (Twitter/X, YouTube, Discord, etc.)
- **Site title / navbar branding**: `Chris | ZichKoding`
- **Footer copyright**: `© 2026 Chris | ZichKoding. All rights reserved.`

**Action needed**: Chris should provide real URLs for GitHub, LinkedIn, Fiverr, and any other profiles. These need to be updated in:
- `src/components/public/Footer.tsx`
- `src/data/terminal-data.ts` (contact command output)

---

## 7. Deployment Plan

**Target**: Vercel (free tier)
- Push to GitHub → Import in Vercel → Add env vars → Deploy
- The Supabase project (`supabase-orange-door`, ID: `hmiqcmnbtifcqpbwimry`) is already connected via Vercel Marketplace integration

**Environment Variables for Production**:
- `NEXT_PUBLIC_SUPABASE_URL` — already in `.env.local`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — already in `.env.local`
- `SUPABASE_SERVICE_ROLE_KEY` — optional, for server-side admin ops

**Custom Domain**: Not discussed yet. Can be configured in Vercel after initial deployment.

**Pre-deployment Checklist**:
1. Replace placeholder social links with real URLs
2. Create admin user in Supabase Auth
3. Verify all pages work in browser locally (`npm run dev`)
4. Run `npm run build` — must pass clean
5. Add real resume PDF to `/public/resume.pdf`
6. Seed database with initial categories and skills via admin panel
7. Set up OG image for social sharing
8. Add `robots.txt` and `sitemap.xml`

**SEO Metadata** (currently set):
- Title: "ZichKoding | Chris - Full Stack Developer"
- Description: "Portfolio of Chris, a UCF-certified Full-Stack Web Developer, Lead Developer, and Technology Manager"
- OG image: Not yet created

---

## 8. Priority Order

**Recommended order** (updated from original):

1. ✅ ~~Fix boilerplate home page~~ — **Done**
2. **Run locally and verify in browser** — `npm install && npm run dev`, check each page
3. **Create admin user** — Supabase Dashboard → Authentication → Add User
4. **Replace placeholder social links** — Footer.tsx + terminal-data.ts
5. **Seed real content** — Add categories, skills, and at least one project via admin panel
6. **Add resume PDF** — Upload to `/public/resume.pdf`
7. **Polish based on browser testing** — Fix any visual issues, responsive tweaks
8. **Deploy to Vercel** — Push to GitHub, import, configure env vars
9. **SEO & OG image** — Sitemap, robots.txt, social preview image
10. **Optional enhancements** — Image upload via Supabase Storage, dynamic terminal data from DB, analytics

This priority order makes sense because you need to see the site working before investing in content and polish.
