# P96 WC2026 Portal — TODO

## P1 (Launch, ~May 15)

### Done ✓
- [x] Next.js 14 scaffold (App Router, TypeScript)
- [x] CSS token system — African flag palette, dark theme, two-font system (Syne + Switzer)
- [x] Supabase connected — `events` + `intake` tables, RLS policies
- [x] Homepage — full-screen Mux video, agency nav overlay, hover states (SHOP/ABOUT → COMING SOON)
- [x] P96 SVG logo component
- [x] Stepped intake modal — nations (multi-select) → borough → email + phone
- [x] Intake stored in cookie (`p96_intake`, 180d) + Supabase `intake` table
- [x] Unified calendar — WC mode (default ON) + All Events mode
- [x] 3-col desktop layout: filter sidebar | event list | detail panel
- [x] Vaul bottom sheet drawer on mobile
- [x] EventDetail — single component for desktop panel + mobile drawer
- [x] WC mode — gold/red shimmer accent, nation filter chips, category locked to watch_party
- [x] URL filter sync (`?n=GH,SN&b=Brooklyn&wc=1`) + Save Filter button
- [x] FilterGroup — wrapping pill chips, max 6 visible, show more/less
- [x] EventCard — row style, category badge, game badge on watch_party + game_id
- [x] Lucide icons throughout (replaced all emoji except ⚽ + flags)
- [x] 33 diaspora match seed objects (`/data/matches.ts`)
- [x] 14 seed events across all categories (`/data/seedEvents.ts`), always visible on prod
- [x] Admin panel — login gate, event CRUD, flier upload, publish toggle, game_id attach
- [x] Footer on calendar page
- [x] Cookie reset button in calendar footer (RotateCcw icon, dev tool)
- [x] Bug icon in navbar → /admin (temp dev shortcut)
- [x] ISR on calendar (`revalidate = 60`)
- [x] Deployed on Vercel

### Still needed for launch
- [ ] **Real events** — P96 team posts actual WC2026 events via admin panel
- [ ] **Supabase storage** — create `fliers` bucket manually (public) for flier uploads
- [ ] **Admin user** — Supabase Dashboard → Authentication → Users → Add user
- [ ] **Favicon** — swap placeholder
- [ ] **OG image** — social share preview for link drops
- [ ] **Fix intake → Supabase** — `country` column is single text; should store all selected nations as JSONB array. Migration needed.

## P2 (Post-launch)
- [ ] Gate Bug icon + cookie reset behind `NODE_ENV === 'development'` or remove entirely
- [ ] Mobile filter UI — sidebar hidden on mobile, no filter access on small screens
- [ ] IG share card on event drawer (html2canvas or Vercel OG)
- [ ] Live game scores via api-football.com (RapidAPI free tier)
- [ ] About page
- [ ] Shop page
- [ ] Borough filtering refinement (currently soft-match on location_name only)
- [ ] Co-host / venue interest form
