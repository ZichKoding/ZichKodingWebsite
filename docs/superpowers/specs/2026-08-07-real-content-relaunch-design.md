# Real-Content Relaunch + UX Polish — Design

**Date:** 2026-08-07
**Builds on:** `2026-06-06-static-migration-plan.md` (approved, never executed). That plan's
step-level detail (A0–A11, B1–B5) remains authoritative for the migration mechanics; this spec
adds the content and UX scope and records the deltas.

## Goal

Ship the portfolio as a truthful, working, fully static site:

1. **Execute the static migration** (MDX blog, static data, Resend contact, remove dead
   Supabase surface) per the June plan.
2. **Replace all fabricated content** (invented employers, fake projects, made-up proficiency
   percentages, placeholder blog titles) with Chris's real profile.
3. **Add a "How I Work" section** presenting strengths and growth areas in an
   operating-principles framing (user-selected 2026-08-07).
4. **UX polish while keeping the current visual design** — Chris: "I like the design of the
   current one. Just maybe make it a better UX possibly."

User decisions on record (2026-08-07): extend the existing site (no rebuild); "How I work"
framing for weaknesses; feature Senku, Shenron, claude-memory-engine + agent tooling, and ARA
professional work.

## Truth policy (governs every content edit)

Every published claim must trace to something Chris has stated or that is verifiable in his
repos. No invented dates, employers, percentages, or metrics. Where a fact is unknown (exact
employment dates, years-of-experience counts), the copy is written to not need it, and the gap
is listed in the done-report for Chris to fill.

## Content inventory (sourced)

- **Identity:** Chris Zichko, Florida. IT lead at American Recovery Association (national
  trade association): legacy Zend Framework PHP compliance platform, vendor API integrations
  (background-check webhooks), staged production data migrations, Dockerized PHPUnit harness,
  contractor coordination. U.S. Marine Corps background. UCF-certified full-stack developer.
  Space/quantum enthusiast (existing site theme stays).
- **Contact:** chriszichkocoding@gmail.com (per June plan, "confirmed"; replaces stale
  chris.zichko@zichkoding.com), github.com/ZichKoding, existing LinkedIn URL.
- **Projects:**
  - *Senku* — terminal AI agent harness in Rust; local models via Ollama plus cloud models;
    slash commands, context management; open source with external contributors.
    [github.com/ZichKoding/senku]
  - *Shenron* — offline-first Android AI companion; Gemma 4 on-device via LiteRT-LM; Kotlin.
    In active development (no public repo — describe, don't link).
  - *claude-memory-engine* — persistent memory CLI for AI coding agents; SQLite + FTS recall,
    cross-machine merge. [github.com/ZichKoding/claude-memory-engine]
  - *Agent tooling suite* — occlusion-proof Windows screenshot CLI, SSH relay tooling, local
    TTS reply pipeline, Discord mirroring (local/private — describe, don't link).
  - *ARA compliance platform* (professional) — described without code or repo link.
- **How I Work:**
  - *Principles:* Crawl–Walk–Run (Marine Corps; dry-run → scoped run with asserted numbers →
    widen; additive over destructive). Test-driven and red-teamed (TDD; adversarial plan review
    before code). Verification first (evidence before assertions; primary sources over
    narratives). Small, reviewable changes. AI-augmented, human-accountable.
  - *Strengths:* range (legacy PHP production ↔ modern web ↔ Rust/Kotlin ↔ edge AI);
    process discipline; solo end-to-end ownership.
  - *Growth areas (honest, first-person):* evaluation rigor (leans anecdotal; building
    measurement habits); focus across parallel projects (actively narrowing); solo-developer
    blind spots (countered with red-team review and outside contributors).

## Deltas from the June plan

- **A3/A4 ship real content, not preserved placeholders.** The June scope guard deferred
  repositioning to a follow-up workstream; that workstream is exactly what Chris requested on
  2026-08-07, so the two merge. No commit ever ships the fictional employers/projects into the
  new static files.
- **Skills data model drops proficiency percentages** (they were invented). New shape:
  categories → items with optional context note (e.g. "PHP (Zend) — production, daily").
  Touches `SkillsSection` (chips/cards replace bars), `useTerminal` `skills` rendering
  (grouped lists replace bar graphs), and the `quantum` easter egg (surfaces random skills
  without percentages).
- **Career timeline uses qualitative periods** ("Present", "Ongoing", "Earlier") in real
  chapters: ARA (present) · independent projects/open source (ongoing) · U.S. Marine Corps
  (earlier) · UCF certification (milestone). `CareerSection` renders `period` as an opaque
  string, so no component change; Chris can drop in exact dates later by editing one file.
- **Blog seed is one real post** (relaunch note: what the site now is, what he's building,
  what he'll write about) instead of three placeholder posts. `TERMINAL_DATA.blogPosts` is
  deleted; the home page (server component) reads `getAllPosts()` and threads `recentPosts`
  into `HomePage` → `SpaceTerminal`/`BlogSection`, so the terminal `blog` command and the blog
  section always reflect real MDX content (empty-safe).
- **`resume` command becomes honest.** `public/resume.pdf` does not exist; the fake download
  animation is replaced with output pointing to LinkedIn + `/contact`, driven by a
  `resumeAvailable` flag in the data file so dropping a real PDF re-enables the download path.

## PR plan

- **PR-A `feat/static-content`** — June plan A0–A11 with the deltas above.
- **PR-B `chore/remove-supabase`** — June plan B1–B5 unchanged.
- **PR-C `feat/how-i-work-ux`** — new scope:
  - `HowIWorkSection` (principles, strengths, growth areas) matching the existing section
    visual language; registered in `SectionDots`, terminal `how-i-work` command (alias
    `principles`), `help`/`ls`/`cd` updated.
  - UX/a11y: honor `prefers-reduced-motion` (starfield, warp, section transitions); clickable
    command-suggestion chips if not already present; `aria-live` on terminal output; focus
    management; metadata/OG description with real copy.
  - Kept: all existing easter eggs, history, tab completion, the space visual design.

## Gates (each PR)

`npm run build` + `npm run test:run` green; PR-A/B curl smoke per June plan; PR-C adds a
browser dogfood of every terminal command and every public page, with screenshots. Final state
also verifies zero requests to the dead Supabase host.

## Out of scope / left for Chris

- `RESEND_API_KEY` + Vercel env setup (contact form 500s gracefully until set).
- Real `public/resume.pdf`.
- Exact career dates (optional; qualitative periods ship fine without them).
- Deploying to Vercel and pushing/merging the PRs (branches left for review).
