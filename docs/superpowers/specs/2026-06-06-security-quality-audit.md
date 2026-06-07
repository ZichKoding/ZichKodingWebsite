# Security & Quality Audit — Spec + Implementation Plan (v2, post-red-team)

**Date:** 2026-06-06
**Repo:** ZichKoding/ZichKodingWebsite (PUBLIC, default branch `main`)
**Trigger:** 53 open Dependabot alerts; user requested a full security + quality pass.
**Status:** Red-teamed (agent ab35d6a3). All findings folded in below.

---

## 1. Problem statement

53 open Dependabot alerts (1 crit / 23 high / 23 med / 6 low) = 12 vulnerable packages locally
(per-advisory × per-manifest double-counting). Only **`next` 16.1.6** is production-facing.

The red-team surfaced a **second, larger issue not in the alerts**: in this codebase "admin"
means *any authenticated user* (no role/`is_admin`). On a PUBLIC repo with the anon key exposed
by design, if Supabase signups are enabled, anyone can self-register and get full admin CRUD.
User chose the **full fix** (real `is_admin` gate).

## 2. Ground truth (contract verification)

- `npm audit fix` (no `--force`) does **not** fix `next` — `package.json` pins exact `16.1.6`,
  so npm won't cross the minor. Requires explicit `npm i next@16.2.7 eslint-config-next@16.2.7`.
- `next@16.2.7` verified: highest stable 16.x, clears **every** next advisory (ceiling `<16.2.6`),
  `isSemVerMajor:false`, no `ERESOLVE` vs react 19.2.3. `postcss` is transitive-of-next → only
  clears via the next bump, so order is **next install → then `npm audit fix`**. The CLI's
  `--force` suggestion is a red herring (no fix is semver-major); `--force` stays forbidden.
- **Test env is polluted:** vitest collects a duplicate suite from `.claude/worktrees/serene-boyd/`
  → ~136 collected vs ~68 real. `vitest.config.ts` excludes worktrees only under `coverage`, not
  `test`. Current real failures: **0** (not the stale "2" from COWORK-CONTEXT). Baseline must be
  RUN, not assumed.
- Repo PUBLIC. `.gitignore` has `.env*`; `.env.local` never committed; no `.env*` tracked. ✅
- **Secret scanning + push protection + dependabot_security_updates are all verified DISABLED.**
- History (full) contains `SECRET_KEY='django-insecure-…'` in legacy `settings.py` — an
  auto-generated **dev placeholder** (real key came from CI `secrets.SECRET_KEY`). Low rotation
  urgency; document it. JWT/`service_role` patterns were insufficient — full-history broad-pattern
  scan is authoritative.
- Available creds (in gitignored `.env.local`): `SUPABASE_SERVICE_ROLE_KEY`, `POSTGRES_URL` /
  `_NON_POOLING` (direct DB), `SUPABASE_JWT_SECRET`. **No** Supabase Management-API token / CLI →
  cannot toggle the "Allow new user signups" auth setting headlessly (dashboard step, reported).

## 3. Constraints (user)

- **No browser automation** anywhere. On **Vercel/Supabase failure**: stop, report failures +
  fixes, **no retry**. Split PRs. Branch off `main`. Small single-purpose PRs.

## 4. Workstreams & sequencing

| # | Workstream | PR / mode | Depends on |
|---|---|---|---|
| A | **Admin authz hardening** (`is_admin` gate) — the real containment | PR `security/admin-authz` | own sub-plan + red-team + TDD |
| B | **Dependency sweep** (53 alerts) | PR `security/dependabot-sweep` | independent |
| C | **Secret scanning + dependabot security updates** | inline (gh api) | independent |
| D | **`.env`/secrets audit** | inline (report) | independent |
| E | **Lint + typecheck quality sweep** | PR `quality/lint-typecheck` (only if fixes) | after A/B |

Execution order this session: **B (deps, ready now)** → **A (authz, own plan+red-team)** →
**C + D (quick inline)** → **E (last)**. A is the highest-severity fix but most logic-bearing;
B is the user's stated anxiety (the 53) and is verified-safe, so it goes first to bank the win.
Manual dashboard step (disable signups) reported to user as belt-and-suspenders to A.

---

## 5. Workstream B — Dependency sweep (`security/dependabot-sweep`)

1. `git switch -c security/dependabot-sweep` off `main`.
2. **Fix the polluted test env first** (prereq for a meaningful baseline): add
   `test.exclude` to `vitest.config.ts` for `**/.claude/**`, `**/worktrees/**` (+ keep defaults).
   Commit separately ("test: exclude worktree copies from vitest").
3. **Capture baselines (pre-bump):** `npm run test:run` (record real pass/fail), `npm audit`
   summary, and `curl` snapshots of `/`, `/blog`, `/projects`, `/contact`, `/admin` (no cookie)
   — so post-bump deltas are attributable.
4. Read Next.js 16.2 release notes for breaking changes.
5. `npm i next@16.2.7 eslint-config-next@16.2.7` (exact, matches prior pin).
6. `npm audit fix` (no `--force`) for vitest→4.1.8, vite→7.3.5, transitives.
7. `npm audit` → expect 0. Residual ≠ `--force`; investigate.
8. **Verification gate (amended — must distinguish regression from pre-existing state):**
   - `npm run build` (incl. `tsc`).
   - `npm ci` from clean → lockfile reproducible (Vercel-clean-build insurance).
   - `npm run test:run` → **equal to step-3 baseline** (0 new failures).
   - Dev server, then headless curl:
     - `/admin` (no cookie) → **307/308 → /login** (directly tests the patched proxy/middleware,
       which is what most next advisories cover). This is the key assertion.
     - `/api/admin/skills` (no cookie) → **401** (gate fires).
     - `/`, `/blog`, `/projects`, `/contact` → assert **content** (expected marker present, no new
       "Error fetching") vs the step-3 baseline — not status alone.
   - Authenticated-admin path = **browser-only → not verified headlessly** (per no-browser rule).
     Stated explicitly, not faked. (Covered functionally by workstream A's tests instead.)
   - Any Supabase/Vercel failure → stop + report + solutions, no retry.
9. Commit (package.json + lock), push, open PR. Confirm Dependabot → ~0.

## 6. Workstream A — Admin authz hardening (`security/admin-authz`) — needs own plan

This is logic-bearing (migration + RLS + auth helper + tests) → gets its **own** writing-plans
pass + plan-redteam + TDD subagents before coding. Sketch only here:

- **Migration** (run via direct `POSTGRES_URL`, service role): add `profiles.is_admin boolean
  not null default false`; set Chris's profile `is_admin = true`; rewrite RLS mutation policies on
  posts/projects/skills/categories/post_categories/contact_messages from `auth.role()=
  'authenticated'` → require `EXISTS (select 1 from profiles where id = auth.uid() and is_admin)`.
  Re-examine the blanket `GRANT ALL … TO authenticated` (RLS still gates rows, but tighten if
  appropriate). Provide a forward migration file `supabase/migrations/003_admin_role.sql`.
- **App enforcement:** `requireAdminAuth()` and `(admin)/layout.tsx` check `is_admin`, not just
  session. `/login` non-admins → rejected with a clear message.
- **Tests (TDD):** unauth → redirect/401; authed-non-admin → 403/redirect (the new case);
  authed-admin → allowed. RLS-level test that a non-admin authenticated client cannot mutate.
- **Containment note:** with this gate, self-registration is inert. Still recommend the user
  disable signups in the Supabase dashboard (Management-API, can't do headlessly).
- Verification: headless admin dogfood now meaningful via direct DB + service role to seed an
  admin and a non-admin, then assert RLS behavior with the anon key (no browser).

## 7. Workstream C — Secret scanning + dependabot updates (inline)

- `gh api -X PATCH repos/ZichKoding/ZichKodingWebsite -f
  security_and_analysis.secret_scanning.status=enabled -f
  security_and_analysis.secret_scanning_push_protection.status=enabled`. Single PATCH (scanning
  processed first). **On 422** → split: enable `secret_scanning` first, re-read to confirm, then
  `secret_scanning_push_protection`. Also enable `dependabot_security_updates`.
- **Verify after** via `gh api repos/… --jq '.security_and_analysis'` (don't trust PATCH return).

## 8. Workstream D — `.env`/secrets audit (inline report)

- Confirmed clean: `.gitignore .env*`, `.env.local` never committed, no `.env*` tracked.
- **Broad full-history scan** (all refs, not recent): Django `SECRET_KEY`, `postgres://`/DB conn
  strings, Supabase `anon`/`publishable`/`service_role`, generic `eyJ`. Document the legacy
  `django-insecure-` key (low urgency, rotation optional).
- `.env.local.example` is itself untracked (ignored by `.env*`). Recommend `.env.example` +
  `!.env.example` negation so the onboarding template is version-controlled.

## 9. Workstream E — Lint + typecheck (`quality/lint-typecheck`, only if fixes)

- `npm run lint` + `npx tsc --noEmit` → categorize. Fix mechanical only; flag logic-bearing.

## 10. Definition of done

- Dependabot open alerts ~0; `build` green; `test:run` == baseline; curl gate (incl. `/admin`
  redirect + content assertions) green or blocked-and-reported.
- `is_admin` gate live (migration + app + RLS), non-admin mutation provably blocked; signup-disable
  recommended to user.
- Secret scanning + push protection + dependabot security updates enabled & verified.
- `.env`/secrets audit written with rotation/`.env.example` recommendations.
- PRs opened off `main`: deps, admin-authz, (quality if needed).
