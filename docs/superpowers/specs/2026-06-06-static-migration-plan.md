# Static-First Migration — Plan (drop Supabase)

**Date:** 2026-06-06
**Goal:** Convert the portfolio to a fully static Next.js 16 site. Blog → MDX files; projects/skills
→ static data; contact → Resend serverless email. Remove the entire Supabase/DB/admin/auth surface.
**Why:** backend (Supabase `hmiqcmnbtifcqpbwimry`) is gone; a DB-backed CMS is over-engineering for a
solo-dev portfolio. Static-first is leaner, kills the admin privilege-escalation surface entirely,
and is faster to credibly-live. (User decision, 2026-06-06.)

## Contracts verified (dev-loop step 2)

- **MDX:** use **`next-mdx-remote/rsc`** + `gray-matter` (read `.mdx` from a content folder, render in
  the existing `/blog/[slug]` route with `generateStaticParams`). NOT `@next/mdx` (that maps files to
  routes; we want content separated from routing). RSC variant = Server Component, no client JS for
  rendering. Ref: nextjs.org/docs/app/guides/mdx.
- **Resend:** `new Resend(process.env.RESEND_API_KEY)` → `resend.emails.send({from,to,subject,html})`.
  `from: 'onboarding@resend.dev'` works with **no domain**, but Resend then only delivers to the
  **account-owner email** — fine for a contact form (to = Chris). Verified domain = later upgrade.
  **CRITICAL CONTRACT (red-team):** `emails.send()` does NOT throw on a rejected send — it **resolves**
  with `{ data, error }`. A failed send (e.g. recipient ≠ account-owner pre-verification) populates
  `error` on a resolved promise. Therefore the route MUST `const { error } = await ...; if (error)
  return 500` — a try/catch alone passes failed sends through as a silent 201. **`CONTACT_EMAIL` =
  `chriszichkocoding@gmail.com`** (confirmed) — MUST be the Resend account-owner email until a domain
  is verified, else sends silently fail. Also update the stale `chris.zichko@zichkoding.com` in
  `terminal-data.ts`/contact UI to this address during conversion (consistency).

## Content policy (scope guard)

This migration is **plumbing, not content**. It **preserves the current (placeholder) content**
mechanically by moving `terminal-data.ts`'s projects/skills/career into static data files as-is, and
seeds **one** welcome MDX post so `/blog` isn't empty. The real **AI-Engineering repositioning**
(accurate skills, real projects, the memory-system blog) is a **separate** follow-up workstream — do
NOT invent real proficiency/experience here (same trap as the fictional data we already flagged).

## Decomposition — two PRs, build stays green at each step

### PR-A `feat/static-content` — make the public site static & self-contained

Order matters: add the static layer and convert pages to use it **before** anything is deleted, so the
build never breaks.

- **A0. Neuter middleware FIRST (red-team blocker).** `src/proxy.ts` is a per-request Next.js 16
  middleware entrypoint calling `supabase.auth.getUser()` against the dead host on every request —
  NOT harmless-until-PR-B. Replace its body with `return NextResponse.next()` (drop the supabase
  import) so PR-A's deployed site isn't degraded. The file is deleted entirely in PR-B.
- **A1. Deps.** `npm i next-mdx-remote gray-matter resend rehype-pretty-code shiki`. Commit.
- **A2. Content lib (TDD).** `src/lib/content/blog.ts`: `getAllPosts()`, `getPostBySlug(slug)`,
  `getAllSlugs()`, sorted newest-first; parse frontmatter (`title, date, excerpt, category,
  published?` [default true], `coverImage?`) with gray-matter; read from `src/content/blog/*.mdx`
  via `path.join(process.cwd(), 'src/content/blog')` (absolute, not relative — dev/build cwd differ).
  Unit tests with a fixture MDX dir: sorting, missing-frontmatter handling, unknown slug → null,
  draft handling (`published: false` excluded from listing/slugs).
- **A3. Static data (TDD-light).** `src/data/projects.ts`, `src/data/skills.ts` — typed arrays migrated
  verbatim from `terminal-data.ts`'s current values (placeholder, preserved). Validate against the
  EXISTING Zod schemas (`validations/project.ts`, `skill.ts`) in a small test so shape stays correct.
- **A4. Seed posts (≥3, varied — red-team: dogfood needs real variety).** `src/content/blog/*.mdx`:
  seed **3 posts across ≥2 categories** so pagination (>6 not required to test logic, but ≥ a few)
  and category/search filtering are actually exercised, not rendered empty. **Slugs MUST match**
  `terminal-data.ts` `blogPosts` (`nextjs-scalability`, `quantum-basics`, `terminal-ui-react`) OR
  update `terminal-data.ts` + `BlogSection.tsx` to the new slugs — else the home page links 404
  (red-team). Content is placeholder; real posts come in the repositioning workstream.
- **A5. Convert `/blog`** (`(public)/blog/page.tsx`): remove supabase import + query (lines 2,7,33,36-112);
  read `getAllPosts()` server-side; add a `BlogListClient` wrapper (`'use client'`) that reads the same
  `?q/?category/?sort/?page` via `useSearchParams` and filters the in-memory post array — so
  SearchBar/CategoryFilter/Pagination stay **unchanged** (they're already URL-param-driven). Map each
  post's single `category` string → the `{id,name,slug}` shape BlogCard expects via
  `{id: slugify(c), name: c, slug: slugify(c)}`; build the filter list as `unique(posts.map(p=>p.category))`.
- **A6. Convert `/blog/[slug]`**: remove supabase (lines 4,20-77); `export const dynamicParams = false`
  + `generateStaticParams` from `getAllSlugs()` (fully static, unknown slug → build-time 404);
  render MDX via `next-mdx-remote/rsc` with `rehype-pretty-code` (shiki) for **code-block syntax
  highlighting** (parity with the old Tiptap lowlight); `generateMetadata` from frontmatter.
- **A7. Convert `/projects`**: remove supabase (lines 2,11-20); import `src/data/projects.ts`.
- **A8. Convert `/sitemap.ts`**: remove supabase (lines 2,7-14); build URLs from `getAllSlugs()` +
  static routes.
- **A9. Contact → Resend (TDD).** Rewrite `src/app/api/contact/route.ts`: keep the SAME Zod validation
  (`validations/contact.ts`) and the SAME success/error response shapes (201 `{success,message}`, 400
  validation, 500); replace the Supabase insert with `resend.emails.send`. `to` = `CONTACT_EMAIL`
  env (= Resend account-owner email); `from` = `onboarding@resend.dev`; `replyTo` = submitter's email.
  **Handle the resolved-`{error}` contract:** `const { error } = await resend.emails.send(...); if
  (error) { console.error(error); return 500; }` — NOT a bare try/catch.
  **Spam guards (red-team):** (a) honeypot — add a hidden `website` field to `ContactForm`; route
  rejects (silent 200, no send) if non-empty; (b) light in-memory IP rate-limit (e.g. 5/min) → 429.
  **Tests (4 cases):** valid → resend called + 201; invalid → 400, no send; **resend resolves
  `{error}` → 500** (the case that catches the silent-201 bug); honeypot filled → 200, no send.
  **Fully rewrite** `api/contact/__tests__/route.test.ts` to mock `resend` (it currently imports the
  PR-B-deleted `supabase-mock` — a patch won't do). Update `ContactForm.tsx`: add hidden honeypot input
  (otherwise unchanged; it already POSTs `/api/contact`).
- **A10. Env template.** Add `RESEND_API_KEY`, `CONTACT_EMAIL` to a tracked `.env.example`
  (`!.env.example` negation in `.gitignore`); document removing Supabase vars (done in PR-B).
- **A11. Gate:** `npm run build`, `npm run test:run` (new content/contact tests pass; kept validation
  tests pass), curl smoke `/`, `/blog`, `/blog/welcome`, `/projects`, `/contact` → content asserted.
  Contact dogfood: POST valid payload → 201 and (if `RESEND_API_KEY` present) a real email arrives; if
  key absent → assert graceful 500 + report (per no-retry constraint). PR-A keeps the DB code present
  but unreferenced — that's fine; PR-B removes it.

### PR-B `chore/remove-supabase` — delete the now-dead backend surface

Only after PR-A merges and the site is green & static. Everything here is now unreferenced.

- **B1. Delete dirs/files:** `src/app/(admin)/`, `src/app/api/admin/`, `src/app/api/{posts,projects,skills,categories}/`,
  `src/lib/supabase/`, `src/lib/auth/`, `src/proxy.ts`, `src/app/login/`, `src/lib/test-utils/supabase-mock.ts`,
  `src/components/admin/`, **`src/components/public/TiptapRenderer.tsx`** (only the converted blog used
  it), `supabase/` (migrations+seed), removed-route tests (`api/posts`, `api/categories`; auth test),
  and **dead validations** `src/lib/validations/{post,category}.ts` + their `__tests__` (nothing
  reachable consumes them post-migration; `project/skill/contact` validations stay).
- **B2. Deps:** remove from package.json: `@supabase/ssr`, `@supabase/supabase-js`, all 8 `@tiptap/*`
  (`extension-code-block-lowlight`, `extension-image`, `extension-link`, `extension-placeholder`,
  `extension-youtube`, `pm`, `react`, `starter-kit`), `lowlight`, `slugify` (admin-only). Keep
  `date-fns`, `lucide-react`, `zod`. `npm install`; verify nothing in `src/` still imports them.
- **B3. Env:** drop Supabase vars from `.env.example`.
- **B4. Sweep:** `grep -rEi "supabase|createClient|@supabase|@tiptap|slugify" src/` → **must be empty**.
  Add `.claude/worktrees`/`.claude/**` ignore to `eslint.config.mjs` (parallels the vitest fix).
  Trim `src/app/robots.ts` disallow list (`/admin`,`/login` now 404; keep `/api/`).
- **B5. Gate:** `npm run build`, `npm run test:run`, `npm audit` (fewer deps), curl smoke unchanged.
  Confirm `/admin`, `/api/admin/*`, `/login` now → 404 (gone, not redirect).

## Risks / blast radius

- **Blog filtering** was server-side; moving to client-side changes interactivity — keep components,
  feed static data; verify search/category/pagination still work in dogfood.
- **Contact secret:** `RESEND_API_KEY` must be set locally + in Vercel; without it, contact 500s
  (graceful). Surfaced, not hidden.
- **Removed routes** that were linked anywhere (e.g., a Navbar link to `/login` or `/admin`) → 404.
  Sweep for internal links to removed routes in B4.
- **terminal-data.ts blog slugs** (`nextjs-scalability`, etc.) reference posts that won't exist as MDX
  → either create matching stubs or update `BlogSection`/`terminal-data` to point at real slugs. Flag.
- **SEO/build:** `/blog` and `/blog/[slug]` become static (good); confirm `generateStaticParams` covers
  all posts so none 404.

## Definition of done

- Public site fully static: home terminal, `/blog` (MDX), `/blog/[slug]`, `/projects`, `/contact`
  (Resend) all build & render with NO Supabase.
- `npm run build` green; `npm run test:run` green (content + contact + kept validation tests);
  `grep supabase src/` empty after PR-B; `npm audit` clean.
- Contact form sends a real email (or graceful-500-and-reported if key absent).
- Two PRs off `main`. Real-content repositioning explicitly deferred to its own workstream.
