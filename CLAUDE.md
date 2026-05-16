# P96 Culture House — WC2026 Portal
## Claude Code Context

---

## What we're building

A mobile-first community event portal for **P96 Culture House** centered on the 2026 FIFA World Cup. The site serves the Black diaspora community in NYC — helping people find where to watch diaspora nations play, discover P96-hosted events, and connect with their community during the tournament.

The user journey: **Instagram → Site → World Cup 2026 → Choose your country → Event cards → RSVP → Show up.**

This is a pro bono sprint. Keep decisions lean, cheap, and fast to ship.

---

## Site structure

```
/                   → Homepage (full-screen Mux video hero + nav overlay)
/wc2026             → WC2026 country selector (soccer ball grid, 10 diaspora nations)
/wc2026/[country]   → Nation events page (full-screen swipeable cards, shareable URL)
/calendar           → Unified calendar — BURIED (not in nav, exists for admin/direct link)
/about              → (ghost page, P2)
/shop               → (ghost page, P2)
/admin              → Admin panel (P96 team only, password-protected)
```

### WC2026 flow
- `/wc2026` — soccer ball pentagon grid, 10 nations (HT + CW TBD), P96 logo center
- `/wc2026/[country]` — events filtered by game_id → matches.ts lookup + general cultural events
- SVGs live in `public/teams/` — 10 position files (top-middle, top-left, etc.)
- Position → nation mapping is in `components/WC/CountrySelector.tsx`
- Event cards: full-screen, CSS scroll-snap horizontal, date = hero element
- Desktop: trading card feel, prev/next arrows outside card, max-width 440px

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | |
| Styling | CSS custom properties | Tokens in `styles/tokens.css`. Tailwind removed. |
| Database | Supabase | Free tier, Postgres + auth |
| CMS / Admin | Custom `/admin` page | Event CRUD, flier upload, RSVP links |
| Fonts | Syne (display) + Switzer (body) | `@fontsource/syne` + Fontshare CDN |
| Video | Mux (`@mux/mux-video` web component) | Playback ID: `sMAbbc8JVvn202la005w0102yrGGLRT2JSsX9dapewP7HPw` |
| Icons | Lucide React | Replaces all emoji icons except ⚽ and flag emojis |
| Mobile drawer | Vaul | Bottom sheet for event detail on mobile |
| State | Zustand (`lib/store.ts`) | wcMode, activeCategory, activeNations, activeBorough, intake |
| Game data | Static seed (`/data/matches.ts`) | 33 diaspora matches, group → semi |
| Deployment | Vercel | Free tier |

---

## Design system

### Philosophy
Dark, warm, bold. African flag palette. Big type. Feels like a cultural moment, not a sports app. Mobile-first — max content width 480px on inner pages. Homepage is full-screen, no max-width.

### Two-font system
- `--font-display`: Syne — headlines, nav, big UI moments (800 weight)
- `--font-body`: Switzer — body copy, labels, metadata (400–700)

### CSS tokens (`/styles/tokens.css`)
```css
:root {
  --c-gold: #FFDA44;
  --c-red: #E8412C;
  --c-green: #1A7F3C;
  --c-blue: #1B4FD8;
  --c-orange: #F97B22;

  --c-intake-bg: #FFDA44;
  --c-intake-text: #111111;

  --c-bg: #0E0E0E;
  --c-surface: #161616;
  --c-surface2: #1F1F1F;

  --c-text: #FFFFFF;
  --c-text-muted: rgba(255, 255, 255, 0.45);
  --c-text-subtle: rgba(255, 255, 255, 0.25);

  --c-border: rgba(255, 255, 255, 0.08);
  --c-border-emphasis: rgba(255, 255, 255, 0.15);

  --radius-card: 12px;
  --radius-pill: 99px;
  --radius-sm: 6px;
  --page-padding: 16px;
  --max-width: 480px;

  --font-display: 'Syne', system-ui, sans-serif;
  --font-body: 'Switzer', system-ui, sans-serif;
}
```

### Event categories (replaces old type field)
`watch_party` | `talks` | `workshop` | `hangout` | `collaboration` | `film_screening`

Colors defined in `lib/supabase.ts` → `CATEGORY_META`. Use `getCategoryMeta(cat)` — safe fallback for unknown values.

---

## Database schema (Supabase)

### `events` table
```sql
id              uuid primary key default gen_random_uuid()
created_at      timestamptz default now()
title           text not null
description     text
category        text not null  -- watch_party | talks | workshop | hangout | collaboration | film_screening
date            date not null
time            time
location_name   text
location_address text
flier_url       text
rsvp_url        text
additional_links jsonb   -- [{label, url}, ...]
game_id         integer  -- links to match in /data/matches.ts (nullable)
is_published    boolean default false
```

### `intake` table
```sql
id              uuid primary key default gen_random_uuid()
created_at      timestamptz default now()
email           text not null
phone           text
country         text   -- first selected nation only (multi-select lives in cookie)
borough         text
```

**Known gap:** intake table `country` is a single text column; cookie stores full `nations[]` array. Multi-nation picks beyond first are only in the cookie.

---

## Intake flow

3-step modal on first visit (`p96_intake` cookie absent):
1. **Nations** — multi-select, 12 diaspora nations, 3-col grid
2. **Borough** — 27 pill options (Bronx, Brooklyn, Manhattan, etc.)
3. **Email + phone** — email required to submit; phone optional; skip available

Data stored in:
- `p96_intake` cookie (180-day expiry) — full payload incl. all nations
- Supabase `intake` table — only if email provided, only first nation

Cookie reset: small `RotateCcw` icon in calendar footer (dev tool). Clears cookie + reloads.

---

## Calendar — unified model

### Modes
- **WC MODE** (default ON) — gold/red shimmer accent bar, nation filter chips visible, category locked to `watch_party`, filtered by active nations
- **All Events** — all published events, all categories, date-grouped

### Filter state (Zustand `lib/store.ts`)
- `wcMode: boolean` — default `true`
- `activeCategory: EventCategory | null`
- `activeNations: string[]` — 2-letter codes
- `activeBorough: string | null`
- `intake: IntakeData` — loaded from cookie on mount

### URL sync
Filters encode to URL params: `?n=GH,SN&b=Brooklyn&cat=watch_party&wc=1`
"Save Filter" button (Share2 icon) copies current URL to clipboard.

### Layout
- **Mobile**: single column list → Vaul bottom sheet drawer for event detail
- **Desktop**: 3-col (256px filters | flex-1 list | 320px detail panel)

### Seed events
`/data/seedEvents.ts` — 14 events across all categories, always merged under real DB events (deduped by title). Visible on prod until replaced by real admin-posted events.

---

## Homepage

Full-screen static image background (`/public/capture-11.jpg`), dark gradient scrim, content overlay.

- Top-left: P96 SVG logo (links to `/`)
- Bottom: WORLD CUP (links to `/wc2026`) / SHOP / ABOUT — 4px gap between items
- SHOP + ABOUT: "COMING SOON" label fades in on hover
- Footer bar: "P96 IS THE PLACE" · "STAY IN TOUCH" (mailto)

---

## Navbar (inner pages)

Minimal: P96 logo left → `/`. Right: SHOP · ABOUT at 10px allcaps muted + Bug icon → `/admin`. EVENTS removed from nav.

---

## Admin panel (`/admin`)

Password-protected (Supabase auth). Event CRUD — create/edit/delete, flier upload to Supabase storage, publish toggle, optional game_id attachment.

---

## World Cup data

`/data/matches.ts` — 33 diaspora-relevant match objects (group → semi). The 12 diaspora nations:
🇿🇦 South Africa · 🇲🇦 Morocco · 🇸🇳 Senegal · 🇩🇿 Algeria · 🇨🇻 Cape Verde · 🇪🇬 Egypt · 🇹🇳 Tunisia · 🇨🇮 Ivory Coast · 🇬🇭 Ghana · 🇨🇩 DR Congo · 🇭🇹 Haiti · 🇨🇼 Curaçao

---

## Auth / infra

- Supabase project: `zzajjlmesdnoeeobhlkh.supabase.co`
- RLS: anon = read published events + insert intake. Authenticated = full access.
- Storage bucket `fliers` — create manually in Supabase dashboard (public bucket).
- Admin user — create manually: Supabase Dashboard → Authentication → Users → Add user.
- Vercel env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Current state (as of May 10, 2026)

| Route | Status |
|---|---|
| `/` | Full-screen Mux video homepage, agency-style nav, hover states |
| `/calendar` | 3-col desktop + Vaul mobile, WC mode default, URL filter sync, seed events |
| `/admin` | Event CRUD, flier upload, publish toggle |

**Key files:**
- `components/Entry/HomepageLayout.tsx` — homepage (EVENTS → /wc2026)
- `components/Entry/IntakeModal.tsx` — 3-step intake modal
- `components/WC/CountrySelector.tsx` — /wc2026 soccer ball grid
- `components/WC/NationEventsPage.tsx` — /wc2026/[country] swipeable cards
- `components/Calendar/CalendarView.tsx` — buried calendar (still works, not in nav)
- `components/Layout/Navbar.tsx` — inner page nav (EVENTS removed)
- `lib/store.ts` — Zustand store
- `lib/supabase.ts` — DB client + category types + `getCategoryMeta()`
- `lib/nations.ts` — 12 nations + 27 boroughs
- `data/matches.ts` — 33 diaspora WC matches
- `data/seedEvents.ts` — 14 seed events
- `styles/tokens.css` — design tokens + atomic type classes (.t-hero, .t-display, etc.)
- `public/teams/` — 10 flag SVGs for soccer ball grid

---

## Notes for Claude Code sessions

- Mobile-first. Design for 390px viewport, enhance for larger.
- Use CSS tokens, not hardcoded hex values in components.
- `getCategoryMeta(cat)` not `CATEGORY_META[cat]` — safe fallback for unknown values.
- Event drawer is Vaul bottom sheet on mobile, right panel on desktop — single `EventDetail` component for both.
- Admin panel: functional over pretty.
- When in doubt, ship the simpler version. This is a sprint.
- Lucide icons for all UI chrome. Keep ⚽ and flag emojis.

---

## What's next — see TODO.md
