# P96 Culture House — WC2026 Portal
## Claude Code Context

---

## What we're building

Mobile-first community event portal for **P96 Culture House** centered on the 2026 FIFA World Cup. Serves the Black diaspora community in NYC — find where to watch diaspora nations play, discover P96-hosted events, connect with community.

User journey: **Instagram → Site → WORLD CUP → Calendar → Pick date → Event card → RSVP → Show up.**

Pro bono sprint. Decisions lean, cheap, fast to ship.

---

## Site structure

```
/                   → TEMP: World Cup landing page (blue gradient, wheel animation, Get Access CTA)
/homepage           → Legacy homepage (Capture 11 photo, dark overlay, nav links) — restore post-campaign
/world-cup          → Redirects to /
/calendar           → PRIMARY user-facing calendar (light mode, event cards)
/wc2026             → WC2026 country selector (soccer ball grid, 12 diaspora nations)
/wc2026/[country]   → Nation events page (swipeable cards, shareable URL)
/about              → Ghost page (P2)
/shop               → Ghost page (P2)
/admin              → Admin panel (Supabase auth, event CRUD)
```

**TEMP LANDING:** `/` is currently the WC2026 landing page (`app/page.tsx`). When campaign ends:
1. Delete or archive `app/page.tsx` (the landing)
2. Move `app/homepage/page.tsx` → `app/page.tsx`
3. Remove `app/world-cup/page.tsx` redirect

**Flow:** Homepage WORLD CUP link → `/calendar` (not `/wc2026`). Do not change this.

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | |
| Styling | CSS custom properties | Tokens in `styles/tokens.css`. No Tailwind. |
| Database | Supabase | Free tier, Postgres + auth |
| CMS / Admin | Custom `/admin` page | Event CRUD, flier upload, RSVP links |
| Fonts | Syne (display) + Switzer (body) | `@fontsource/syne` + Fontshare CDN |
| Icons | Lucide React | All UI chrome. Keep ⚽ and flag emojis only. |
| Mobile drawer | Vaul | Bottom sheet for event detail on mobile |
| State | Zustand (`lib/store.ts`) | activeNations, activeBorough, intake |
| Game data | Static seed (`/data/matches.ts`) | 33 diaspora matches, group → semi |
| Deployment | Vercel | Free tier |

**Removed:** Mux video (homepage is now static photo). WC mode toggle removed from calendar.

---

## Design system

### Philosophy
Light mode on inner pages (white, cream, warm). Homepage stays dark. Bold display type. African flag palette accents. Mobile-first — max content width 480px on inner pages.

### Light mode pattern (calendar, admin)
- `document.documentElement.style.backgroundColor = '#FFFFFF'` set on mount
- `background: '#FFFFFF'` on root container
- Navbar: `<Navbar light />` — switches colors to dark-on-light
- Header gradient: `linear-gradient(180deg, #FFFBEF 0%, #FFFFFF 100%)`
- Footer: `<PageFooter />` — always white bg

### Two-font system
- `--font-display`: Syne — headlines, nav, big UI moments (800 weight)
- `--font-body`: Switzer — body copy, labels, metadata (400–700)

### Key CSS tokens (`/styles/tokens.css`)
```css
--c-gold: #FFDA44;
--c-red: #E8412C;
--c-green: #1A7F3C;
--c-blue: #1B4FD8;
--c-orange: #F97B22;
--c-bg: #0E0E0E;
--c-text: #FFFFFF;
--max-width: 480px;
--font-display: 'Syne', system-ui, sans-serif;
--font-body: 'Switzer', system-ui, sans-serif;
```

### Event categories
`watch_party` | `talks` | `workshop` | `hangout` | `collaboration` | `film_screening`

Always use `getCategoryMeta(cat)` — never `CATEGORY_META[cat]` directly (safe fallback for unknowns).

---

## Atomic components (shared, single source of truth)

| Component | Path | Purpose |
|---|---|---|
| `ShimmerBar` | `components/Layout/ShimmerBar.tsx` | 3px gold→red gradient bar + keyframe |
| `PageFooter` | `components/Layout/PageFooter.tsx` | Light footer. Props: `label`, `showContact`, `showDevReset` |
| `EventCard` | `components/Calendar/EventCard.tsx` | Card visual. Exports: `WhiteCard`, `CardBody`, `fmtTime` |
| `Navbar` | `components/Layout/Navbar.tsx` | Prop: `light?: boolean` — switches to dark-on-light |
| `CalendarGrid` | `components/Calendar/CalendarGrid.tsx` | Props: `light`, `adminMode`, `compact` |
| `DateStrip` | `components/Calendar/CalendarGrid.tsx` | Sidebar date column for view mode |

**Rule:** if adding a UI element used in 2+ places, extract it. Don't duplicate shimmer divs, footer markup, card visuals, etc.

---

## Calendar (`/calendar`)

### Visual states (date cells)
1. **Active** — has published events: gold gradient bg, amber text, pointer cursor
2. **Accented-disabled** — in `PRIORITY_DATES` but no events: light gold tint, lock icon (top-right), pointer cursor → opens lead capture
3. **Disabled** — no events, not priority: muted text, default cursor, not clickable

`PRIORITY_DATES` = 16 WC match days in June 2026 (defined in `CalendarGrid.tsx`).

### Month navigation
- State: `const [month, setMonth] = useState(MIN_MONTH)` where `MIN_MONTH = 6`, `MAX_MONTH = 7`
- Chevron buttons in header right slot — disabled at bounds
- Switching month resets `selectedDate` and closes view mode

### Browse mode → View mode
- Clicking active date → sets `selectedDate`, enters view mode (desktop full-screen overlay)
- View mode: shimmer bar + top bar (back + date label + logo + event count) + body (DateStrip sidebar 64px | EventCarousel)
- Mobile: Vaul bottom sheet drawer (88dvh, white bg) with scroll-snap carousel

### Lead capture
- Only fires when clicking priority date with no published events
- `LeadCaptureModal` — email + phone form, saves to Supabase `intake` table + cookie
- **NOT shown on homepage load** — intake modal on homepage is disabled

### Key files
- `components/Calendar/CalendarView.tsx` — main orchestrator
- `components/Calendar/CalendarGrid.tsx` — grid + DateStrip + PRIORITY_DATES
- `components/Calendar/EventCarousel.tsx` — desktop 3-card carousel + mobile scroll-snap
- `components/Calendar/EventCard.tsx` — card visual (shared with admin)
- `components/Calendar/LeadCaptureModal.tsx` — lead capture form

---

## Admin panel (`/admin`)

Mirrors the user calendar experience exactly — same grid, same card visual, same view mode layout. "Mirror experience: user sees, admin audits and edits."

### Calendar tab
- `<CalendarGrid adminMode />` — all 30 dates clickable (any date can receive new events)
- Clicking date → view mode with admin event cards
- Empty date → "No events / Create Event" prompt
- `PRIORITY_DATES` shown with gold tint but no lock icon in adminMode

### View mode (admin)
Same layout as user view mode. Right area shows `AdminEventCard` per event:
- Shared `<EventCard />` visual (identical to public)
- Admin controls below: `○ DRAFT / ● LIVE` toggle | Edit | Delete

### All Events tab
Flat list sorted by date. Per row: category dot · title · date · DRAFT/LIVE pill (click to toggle) · Edit · Delete.

### Form modal
- Sheet from bottom, white bg, max-height 92dvh
- `<EventForm>` — light theme inputs, `initialDate` prop pre-fills date when creating from calendar
- All new events: `is_published: false` (draft) by default

### Month nav
Same Jun/Jul chevron nav as user calendar, shown in tab bar right slot (only on Calendar tab).

### Key files
- `components/Admin/AdminDashboard.tsx` — all admin UI
- `components/Admin/EventForm.tsx` — create/edit form (light theme)
- `components/Admin/AdminLogin.tsx` — Supabase auth gate

---

## Homepage (`/`)

Full-screen static photo (`/public/capture-11.jpg`), dark gradient scrim, content overlay. No video.

- Top-left: P96 SVG logo → `/`
- Bottom: **WORLD CUP** → `/calendar` | **SHOP** (coming soon) | **ABOUT** (coming soon)
- SHOP + ABOUT: "COMING SOON" fades in on hover
- Footer: "P96 IS THE PLACE" · "STAY IN TOUCH" (mailto)
- **No intake modal on load** — disabled. Lead capture is calendar-only.

---

## Navbar (inner pages)

`components/Layout/Navbar.tsx` — always takes `light?: boolean`.

Right links: **EVENTS** → `/calendar` · **SHOP** → `/shop` · **ABOUT** → `/about` · Bug icon → `/admin`

---

## Database schema (Supabase)

### `events` table
```sql
id              uuid primary key default gen_random_uuid()
created_at      timestamptz default now()
title           text not null
description     text
category        text not null
date            date not null
time            time
location_name   text
location_address text
flier_url       text
rsvp_url        text
additional_links jsonb   -- [{label, url}, ...]
game_id         integer  -- nullable, links to /data/matches.ts
is_published    boolean default false
```

Published events = visible to users. Draft events = admin-only. Gate for calendar date states is `is_published`.

### `intake` table
```sql
id          uuid primary key default gen_random_uuid()
created_at  timestamptz default now()
email       text not null
phone       text
country     text
borough     text
```

---

## Auth / infra

- Supabase project: `zzajjlmesdnoeeobhlkh.supabase.co`
- RLS: anon = read published events + insert intake. Authenticated = full access.
- Storage bucket `fliers` — public bucket, manually created in Supabase dashboard.
- Admin user — create manually: Supabase Dashboard → Authentication → Users → Add user.
- Vercel env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## World Cup data

`/data/matches.ts` — 33 diaspora-relevant match objects. 12 diaspora nations:
🇿🇦 South Africa · 🇲🇦 Morocco · 🇸🇳 Senegal · 🇩🇿 Algeria · 🇨🇻 Cape Verde · 🇪🇬 Egypt · 🇹🇻 Tunisia · 🇨🇮 Ivory Coast · 🇬🇭 Ghana · 🇨🇩 DR Congo · 🇭🇹 Haiti · 🇨🇼 Curaçao

`/data/seedEvents.ts` — seed file exists but is NOT imported anywhere. Calendar shows only published Supabase events.

---

## Current state (as of June 1, 2026)

| Route | Status |
|---|---|
| `/` | WC2026 landing — blue radial gradient, wheel animation, "Get Access" + "View Calendar" CTAs |
| `/calendar` | Blue gradient bg, white event cards, peek carousel (scroll-snap), mobile Vaul drawer |
| `/admin` | Matches calendar visual — same gradient, same EventCard, aligned login screen |
| `/wc2026` | Country selector (soccer ball grid) |
| `/404` | Custom — gradient bg, wheel animation, "404" display font, Go Home CTA |
| `/reference` | Design tokens viewer (internal) |

---

## Working conventions (established this session)

### Component decisions
- **Extract when used 2+ places.** No inline duplication of shimmer bars, footers, card markup.
- **`adminMode` prop on CalendarGrid** makes all dates clickable, hides lock icons.
- **`light` prop on Navbar** for dark-on-light inner pages.
- **EventCard is the canonical card.** Admin wraps it with controls below; don't re-implement visually.
- **AdminEventCard** wraps `<EventCard />` + control row below. Width `300` to match.
- **`light` prop on DateStrip** always pass in view mode (both user calendar and admin) — matches PAGE_GRADIENT bg.

### Carousel (EventCarousel)
- Uses CSS `scroll-snap-type: x mandatory` + `scroll-snap-align: center` — native momentum snap, no debounce.
- `onScroll` updates `idx` for scale/opacity state only. Does NOT call `scrollIntoView`.
- `scrollIntoView` only fires on programmatic nav (dot/card click) via `programmaticNav` ref flag.
- All cards width `300`. Active card `scale(1)` opacity `1`, side cards `scale(0.88)` opacity `0.6`.
- Track padding `calc(50% - 150px)` so first/last card can center-snap.
- Mobile: `mobile` prop → hides bottom date label + dots (dots live in drawer header instead).

### Calendar visual design
- `PAGE_GRADIENT = 'radial-gradient(ellipse at 70% 50%, #FFFFFF 0%, #C5E8F5 42%, #7BBAD6 100%)'`
- All calendar cells have subtle background. Event cells pop with white bg + border. Priority cells gold tint.
- Soccer ball icons: white `sports_soccer` Material Icon in colored circle. Category color when events exist, `rgba(0,0,0,0.1)` grey when disabled.
- Mobile cell aspect ratio: `1/1.3`. Desktop: `1/1`.
- No month header on main grid (compact sidebar only).

### Shadow / overflow pattern
- **Never use `overflow: hidden` on containers that wrap cards** — clips drop shadows.
- Use `overflowY: auto` + `minHeight: 0` on flex children that need scroll.
- View mode body: `display: 'flex', minHeight: 0` (not `overflow: hidden`).

### Calendar architecture
- `eventsForDate` uses raw `events` (not filtered) — nations filter hidden, don't re-add filtering there.
- `allEventDates` = `new Set(events.map(e => e.date))` — drives which dates are "active".
- Admin fetches ALL events (no `is_published` filter). User calendar fetches only published.

### Month navigation pattern
```tsx
const [month, setMonth] = useState(MIN_MONTH) // MIN=6, MAX=7
// Chevron buttons:
onClick={() => { setMonth(m => m - 1); setSelectedDate(null); setViewMode(false) }}
disabled={month === MIN_MONTH}
```

### Lead capture flow
Priority date clicked + no events → `setShowLeadCapture(true)`. Never show intake on homepage load.

### Git workflow
- TypeScript check (`npx tsc --noEmit`) before every commit.
- ESLint check (`npx next lint`) before pushing — Vercel treats lint errors as build failures.
- Pull/rebase before pushing when behind origin. Resolve conflicts by preserving our intended state.

### Light mode page setup
```tsx
useEffect(() => {
  document.documentElement.style.backgroundColor = '#FFFFFF'
  document.body.style.backgroundColor = '#FFFFFF'
  return () => {
    document.documentElement.style.backgroundColor = ''
    document.body.style.backgroundColor = ''
  }
}, [])
```

---

## Notes for future Claude Code sessions

- Mobile-first. Design for 390px, enhance for larger.
- Use CSS tokens, not hardcoded hex. Exception: `#FFFFFF`, `#111`, `#0E0E0E` for light/dark backgrounds.
- `getCategoryMeta(cat)` — always, never direct object access.
- All new events default `is_published: false`. Published = visible to users = unlocks calendar date.
- When adding shimmer bar: import `ShimmerBar`, don't copy the div inline.
- When adding footer: import `PageFooter` with appropriate props.
- When adding event card visual: import `EventCard` from `@/components/Calendar/EventCard`.
- Admin and user calendar should stay in visual sync. If you change EventCard, it affects both.
- Sprint mentality: ship simple version. Optimize later.
- Lucide for all icons. ⚽ and flag emojis are the only emoji exceptions.
- Soccer ball: `<span className="material-icons">sports_soccer</span>` — Material Icons CDN loaded in `app/layout.tsx`.
- Lead capture modal: entrance animation via `programmaticNav` double-rAF pattern (`visible` state, fade + translateY).
- SHOP + ABOUT nav links: disabled with hover "COMING SOON" (`DisabledNavItem` component in Navbar.tsx).
- `/wc2026/[country]` route deleted — was removed as part of visual redesign sprint.
- dev branch (`origin/dev`) = Vercel preview. Feature work in `feature/visual-redesign`, force-push to dev for preview.
