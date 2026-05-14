# EntreSkill Hub — Phased Build Plan

The current project is the blank Lovable template (no auth, no DB, no pages). The reported "login loading / mentor redirect / missing admin" issues don't exist in code yet — we're building from scratch. Trying to ship every dashboard, table, realtime channel, and admin tool in one turn would produce shallow, buggy code. I'll deliver in phases, starting now with a fully working foundation.

## Phase 1 — Foundation (this turn)
1. Enable Lovable Cloud (Postgres + Auth + Storage + Realtime).
2. Design system: dark charcoal + deep violet + emerald accents, glassmorphism, gradient buttons. All tokens in `src/styles.css` (oklch).
3. Database schema + RLS:
   - `profiles` (id → auth.users, full_name, avatar_url)
   - `user_roles` (user_id, role enum: entrepreneur | mentor | admin) — separate table, `has_role()` security-definer fn
   - Auto-create profile + default `entrepreneur` role on signup via trigger
4. Auth pages: `/login`, `/register`, `/forgot-password`, `/reset-password` with Supabase email/password. Proper `onAuthStateChange` + `getSession` order, no infinite loading, error toasts.
5. Role-based routing:
   - `_authenticated` layout route guards session
   - After login, fetch role and redirect: entrepreneur → `/entrepreneur-dashboard`, mentor → `/mentor-dashboard`, admin → `/admin-dashboard`
   - Each dashboard route checks role and blocks cross-role access
6. Landing page (`/`) — hero, about, features, how it works, business categories, footer. Premium dark theme.
7. Shell sidebars + role badge under profile name for all three dashboards (skeleton screens with overview cards). Logout works.

**Seeded accounts:** Lovable Cloud auth doesn't allow seeding passwords via SQL (passwords are hashed by GoTrue). I'll provide a one-click "Seed demo accounts" button on the login page that signs them up the first time, OR you can register them manually. I'll wire the button.

## Phase 2 — Entrepreneur dashboard (next turn)
Skills, business ideas, roadmaps, learning center, mentors directory + requests, bookmarks, progress, notifications.

## Phase 3 — Mentor dashboard
Requests accept/reject, students, resource upload (Storage), sessions, Q&A, analytics, notifications. All buttons wired to backend.

## Phase 4 — Admin dashboard
User management, mentor verification, resource moderation, roadmap CMS, reports, analytics charts, announcements, login activity.

## Phase 5 — Realtime + polish
Postgres Realtime channels for notifications, requests, resources, sessions. Framer Motion polish, mobile responsiveness pass.

## Tech notes
- TanStack Start (this template) — not Next.js. Same React + Tailwind + Framer Motion DX.
- Recharts for analytics.
- All role checks server-side via `has_role()` + RLS — never trust client.

---

**Confirm to proceed with Phase 1 now.** After Phase 1 lands and you verify auth + routing work, I'll continue with Phase 2. This keeps each turn focused and shippable instead of one giant unstable drop.