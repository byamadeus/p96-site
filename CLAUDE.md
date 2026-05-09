# P96 Culture House — WC2026 Portal
## Claude Code Context

---

## What we're building

A mobile-first community event portal for **P96 Culture House** centered on the 2026 FIFA World Cup. The site serves the Black diaspora community in NYC — helping people find where to watch diaspora nations play, discover P96-hosted events, and connect with their community during the tournament.

The user journey: **Instagram → Site → "I know where to go" → RSVP → Show up.**

This is a pro bono sprint. Keep decisions lean, cheap, and fast to ship.

---

## Site structure

```
/                   → Entry screen (hero + intake form)
/calendar           → Unified calendar (World Cup mode / All Events mode)
/about              → (ghost page, P2)
/shop               → (ghost page, P2)
/admin              → Admin panel (P96 team only, password-protected)
```

No nation pages. No separate game calendar vs event calendar. One unified calendar, one drawer, one codebase.

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | |
| Styling | Tailwind CSS + CSS custom properties | Tokens defined in `tokens.css` |
| Database | Supabase | Free tier, Postgres + auth |
| CMS / Admin | Custom `/admin` page | Simple form to post events, drop in RSVP links |
| Font | Switzer | via `@fontsource/switzer` npm package |
| Game data | Static seed data + `api-football.com` (RapidAPI free tier) | Fall back to static if API unavailable |
| Deployment | Vercel | Free tier |

---

## Design system

### Philosophy
Dark, warm, bold. African flag palette. Big type. Feels like a cultural moment, not a sports app. Mobile-first — max content width 480px, page padding 16px.

### CSS tokens (`/styles/tokens.css`)
```css
:root {
  /* Brand colors — African flag palette */
  --c-gold: #F5C842;
  --c-red: #E8412C;
  --c-green: #1A7F3C;
  --c-blue: #1B4FD8;
  --c-orange: #F97B22;

  /* Surfaces */
  --c-bg: #0E0E0E;
  --c-surface: #161616;
  --c-surface2: #1F1F1F;

  /* Text */
  --c-text: #FFFFFF;
  --c-text-muted: rgba(255, 255, 255, 0.45);
  --c-text-subtle: rgba(255, 255, 255, 0.25);

  /* Borders */
  --c-border: rgba(255, 255, 255, 0.08);
  --c-border-emphasis: rgba(255, 255, 255, 0.15);

  /* Layout */
  --radius-card: 12px;
  --radius-pill: 99px;
  --radius-sm: 6px;
  --page-padding: 16px;
  --max-width: 480px;

  /* Spacing scale (4px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
}
```

### Type scale (Switzer)
| Role | Size | Weight | Usage |
|---|---|---|---|
| Display | 40px | 800 | Hero headlines |
| Headline | 26px | 700 | Section headers, match titles |
| Title | 17px | 700 | Card titles |
| Body | 14px | 400 | Descriptions, meta |
| Label | 11px | 600 | Tags, caps labels, uppercase |

### Event card hierarchy (visual priority order)
1. **P96 × World Cup** — gold border + warm gradient background, gold tag
2. **Community event** — green border, green tag
3. **P96 standalone** — default surface, muted, slightly lower opacity

Tag values in DB: `p96_wc` | `community` | `p96`

---

## Database schema (Supabase)

### `events` table
```sql
id              uuid primary key default gen_random_uuid()
created_at      timestamptz default now()
title           text not null
description     text
type            text not null  -- 'p96_wc' | 'community' | 'p96'
date            date not null
time            time
location_name   text
location_address text
flier_url       text           -- image URL (Supabase storage)
rsvp_url        text           -- Luma / Eventbrite / custom link
additional_links jsonb          -- [{label, url}, ...]
game_id         integer        -- links to WC match data (nullable)
is_published    boolean default false
```

### `intake` table
```sql
id              uuid primary key default gen_random_uuid()
created_at      timestamptz default now()
email           text not null
country         text           -- country they rep
borough         text           -- NYC borough or city
```

---

## Calendar — unified model

The calendar has two **modes** toggled at the top:

- **⚽ World Cup** — shows WC game cards (from static seed / API) + any `p96_wc` or `community` events attached to those game days, filtered by the user's intake selections
- **All Events** — shows all published events across all types, chronological

### Filter logic
- On entry, user submits intake form (email + country + borough)
- Stored in a cookie (`p96_intake`) and optionally in Supabase `intake` table
- Calendar reads cookie on load and pre-filters for matching nations + borough
- User can adjust chips manually without re-submitting the form

### Game data strategy
1. On build/revalidate, attempt fetch from `api-football.com` for WC 2026 fixtures
2. If unavailable or rate-limited, fall back to static seed data (the hardcoded match array — see `/data/matches.ts`)
3. Static seed already contains all 104 matches, diaspora flags, activation scores, city notes

---

## Key components to build

```
/components
  Layout/
    Navbar.tsx          -- P96 logo, Calendar / About / Shop links, hamburger
    PageWrapper.tsx     -- max-width + page-padding centering

  Entry/
    HeroSection.tsx     -- big display text, energy copy
    IntakeForm.tsx      -- email, country dropdown, borough/city input

  Calendar/
    ModeToggle.tsx      -- "World Cup" / "All Events" pill toggle
    FilterChips.tsx     -- nation chips from intake, + Add chip
    EventList.tsx       -- chronological list of cards
    GameCard.tsx        -- WC match card (always present in WC mode)
    EventCard.tsx       -- P96/community event card, hierarchy-styled
    EventDrawer.tsx     -- bottom sheet drawer (mobile)

  Drawer/
    DrawerFlier.tsx     -- full-width image if flier_url exists
    DrawerMeta.tsx      -- title, date, time, location
    DrawerRSVP.tsx      -- primary CTA button → rsvp_url
    DrawerLinks.tsx     -- additional_links list
    DrawerShareCard.tsx -- IG-ready share image (html2canvas or og-image)
    DrawerGameInfo.tsx  -- WC match data block (game_id events only)

  Admin/
    AdminLogin.tsx      -- simple password gate (Supabase auth)
    EventForm.tsx       -- create/edit event, all fields, link dropzone
```

---

## Admin panel (`/admin`)

Simple password-protected page for P96 team. No public access.

Key flows:
- **Post event** — fill form, upload flier to Supabase storage, paste RSVP link (Luma/Eventbrite/custom), toggle published
- **Attach to game** — optional dropdown to link event to a WC match ID (surfaces it in World Cup mode on that game day)
- **Additional links** — repeater field: label + URL (venue site, community info, co-host page, etc.)

Auth: Supabase email auth, single shared P96 admin account for now. Row-level security on `events` table — only authenticated users can insert/update.

---

## World Cup data seed

Full match data lives in `/data/matches.ts` — 104 matches, all groups through the Final. Already includes:
- Diaspora team flags + region tags (10 African, 2 Caribbean nations)
- City + venue
- Activation scores (1–5) with reasoning
- City diaspora notes

The 12 diaspora nations:
🇿🇦 South Africa · 🇲🇦 Morocco · 🇸🇳 Senegal · 🇩🇿 Algeria · 🇨🇻 Cape Verde · 🇪🇬 Egypt · 🇹🇳 Tunisia · 🇨🇮 Ivory Coast · 🇬🇭 Ghana · 🇨🇩 DR Congo · 🇭🇹 Haiti · 🇨🇼 Curaçao

---

## Launch scope (P1 — May 15)

- [ ] Entry screen with intake form (email + country + borough → cookie + Supabase)
- [ ] Unified calendar, World Cup mode, static game data
- [ ] Event cards with hierarchy styling
- [ ] Event drawer (bottom sheet, all fields)
- [ ] Admin panel — post events, drop RSVP links, publish toggle
- [ ] Supabase connected (events table + intake table)
- [ ] Deployed on Vercel
- [ ] Share card on drawer (basic)

## P2 (post-launch)
- Live game scores via API
- About page
- Shop page
- IG share card generator (polished)
- Borough/community filtering refinement
- Co-host / venue interest form

---

## Tone + copy direction

- Warm, community-centered, not corporate
- Big bold statements over long explanations
- "Bring your people" energy
- Copy examples: *"Your game. Your people. Your summer."* / *"Feels like home."* / *"On and off the continent."*
- Avoid: sports-app language, generic "find events near you" copy

---

## Notes for Claude Code sessions

- Always mobile-first. Design for 390px viewport, enhance for larger.
- Use CSS tokens, not hardcoded hex values in components.
- Supabase client lives in `/lib/supabase.ts` — use server components where possible for data fetching.
- The event drawer should be a bottom sheet on mobile (slides up), not a modal.
- Keep the admin panel functional over pretty — P96 team uses it, not the public.
- When in doubt, ship the simpler version. This is a sprint.

---

## Current state (as of May 2026) — read before coding

**What's built and working:**

The core scaffold is complete and running. All pages build clean, Supabase is wired up.

| Route | Status |
|---|---|
| `/` | Homepage — hero placeholder + WC2026 widget + tagline |
| `/calendar` | Full calendar — WC mode + All Events, intake modal for new visitors |
| `/admin` | Password-protected — event CRUD, flier upload, publish toggle |

**Key files to know:**
- `/data/matches.ts` — 33 diaspora match seed objects (all 12 nations, group → semi)
- `/lib/supabase.ts` — Supabase client + TypeScript types for `Event` and `Intake`
- `/styles/tokens.css` — all CSS custom properties (colors, spacing, radius)
- `/components/Entry/IntakeModal.tsx` — stepped modal (nation → borough → email), sets `p96_intake` cookie
- `/components/Calendar/CalendarView.tsx` — main calendar client component, reads cookie for pre-filtering
- `/components/Calendar/GameDrawer.tsx` — bottom sheet for WC match detail
- `/components/Calendar/EventDrawer.tsx` — bottom sheet for P96/community event detail
- `/components/Admin/AdminDashboard.tsx` + `EventForm.tsx` — admin UI

**Auth / infra:**
- Supabase project: `zzajjlmesdnoeeobhlkh.supabase.co`
- RLS: anon can read published events + insert intake. Authenticated = full access.
- Storage bucket `fliers` must be created manually in Supabase dashboard (public bucket).
- Admin user must be created manually: Supabase Dashboard → Authentication → Users → Add user.
- Deployed target: Vercel. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel env vars.

**What's next (priority order):**

See `TODO.md` for full list. Top 4 for the next session:

1. **Brand it** — P96 needs a logo in the navbar, real favicon, possible brand color/type pass. Confirm with user what assets exist before generating placeholders.
2. **Desktop layout** — currently mobile-only (480px max). Needs a sidebar or wider grid layout above ~768px, nav rework for horizontal spacing.
3. **Landing page brand intro** — homepage feels thin. P96 is a culture house, not just an events app. Needs copy/visual that introduces the org before the WC widget.
4. **Calendar: NYC-first + calendar view** — MetLife/NJ games should surface first. User wants a date-grouped calendar view (like a weekly/monthly grid) rather than the current flat card list.

**Collaborate before coding:** For any of the design tasks (brand, landing, desktop), ask the user what assets they have (logo files, photos, brand colors) before making visual decisions. The token system is already set up to swap values easily.
