# COWORK-QUESTIONS.md

> **Instructions for Cowork**: Read each section below and create a `COWORK-CONTEXT.md` file answering every question based on the full project context and plans from our previous sessions. Be specific — include actual URLs, color codes, content, and decisions.

---

## 1. Original Design Vision

- What should each page look and feel like? Describe the space theme, color palette, animations, and overall aesthetic goals.
- What specific colors, gradients, or effects define the "space terminal" look?
- Are there any reference sites or design inspirations?

## 2. Home Page (SpaceTerminal)

- What terminal commands should be available? (e.g., `help`, `about`, `skills`, `projects`, `contact`)
- What should the starfield/background look like? (star density, animation speed, colors)
- What's the intended user experience on first visit? (auto-typing intro, prompt waiting, guided tour?)
- Any easter egg commands?

## 3. Page-by-Page Requirements

For each page, describe the expected layout, functionality, and content:

### Public Pages
- **Blog** (`/blog`): Layout, card style, search/filter behavior, pagination, empty state
- **Projects** (`/projects`): Card layout, what info per project, links (live demo, GitHub), filtering
- **Contact** (`/contact`): Form fields, validation messages, success/error states, social links displayed

### Admin Pages
- **Dashboard** (`/admin`): What stats/metrics to show? Recent activity?
- **Posts Editor** (`/admin/posts`): Tiptap editor features needed, image upload flow, draft/publish workflow
- **Categories** (`/admin/categories`): CRUD interface details
- **Contacts** (`/admin/contacts`): Message triage workflow (read/unread, reply, archive?)
- **Projects** (`/admin/projects`): Fields per project, image handling
- **Skills** (`/admin/skills`): Skill categories, proficiency levels?

## 4. Database Content Plan

- What categories should exist? (e.g., "Web Development", "DevOps", "Tutorials")
- Any initial blog posts to seed?
- What projects should be showcased? (name, description, tech stack, links)
- What skills to list? (languages, frameworks, tools, with proficiency levels?)

## 5. Known Issues & TODOs

We've already found these issues:
- **BLOCKING**: Root `src/app/page.tsx` contains Next.js boilerplate and shadows the SpaceTerminal home page at `src/app/(public)/page.tsx`. Fix: delete the boilerplate file.
- **Expected**: Blog and projects pages show "Error fetching" when DB is empty or disconnected.
- **Placeholder social links**: Footer points to generic `https://github.com`, `https://linkedin.com`, `mailto:hello@example.com`.

Are there other known issues, incomplete features, or things that need polish?

## 6. Social Links & Branding

- What is the real GitHub profile URL?
- What is the real LinkedIn profile URL?
- What is the contact email address?
- Fiverr profile URL (if applicable)?
- Any other social links? (Twitter/X, YouTube, Discord, etc.)
- Site title / navbar branding text?
- Footer copyright text?

## 7. Deployment Plan

- Vercel project config or custom domain?
- Any environment variable notes for production?
- Pre-deployment checklist items?
- SEO metadata (title, description, OG image)?

## 8. Priority Order

What should be fixed/built first vs. what can wait? Suggested starting order:
1. Fix the boilerplate home page (delete `src/app/page.tsx`)
2. Replace placeholder social links
3. Seed database with real content
4. Polish and iterate

Does this priority make sense, or should something else come first?

---

> **One-liner for Cowork**: Read `COWORK-QUESTIONS.md` in the project root and create a `COWORK-CONTEXT.md` file answering every section based on the full project context and plans from our previous sessions.
