# P96 WC2026 Portal — TODO

## P1 (Launch, ~May 15)

### In progress / done
- [x] Next.js 14 scaffold (App Router, Tailwind, TypeScript)
- [x] Supabase connected — `events` + `intake` tables, RLS policies
- [x] Design tokens (`/styles/tokens.css`) — African flag palette, dark theme
- [x] Switzer font via Fontshare CDN
- [x] Homepage — hero image placeholder + WC2026 widget + tagline
- [x] Stepped intake modal (WHO YOU REPPIN → WHICH BOROUGH → email)
- [x] Unified calendar — WC mode + All Events mode
- [x] 33 diaspora match seed data (`/data/matches.ts`)
- [x] Filter chips — pre-selected from intake, sorted, scrollable
- [x] GameCard → tappable → GameDrawer (venue, notes)
- [x] EventCard → tappable → EventDrawer (flier, RSVP, links)
- [x] Admin panel — login gate, event list, create/edit/publish/delete, flier upload
- [x] ISR on calendar (`revalidate = 60`)

### Remaining for launch
- [ ] **1. Brand it** — P96 logo in navbar, real brand colors/typography pass, favicon
- [ ] **2. Desktop layout** — sidebar or wider grid above 768px, nav rework
- [ ] **3. Landing page** — brand intro (who is P96, what is this, energy/vibe), hero image swap
- [ ] **4. Calendar: NYC-first** — surface MetLife/NJ games at top, rest collapsible or secondary; calendar view (date-grouped) instead of flat list
- [ ] Storage bucket `fliers` created in Supabase (manual step)
- [ ] Supabase admin user created (Dashboard → Auth → Add user)
- [ ] Deploy to Vercel + env vars set

## P2 (Post-launch)
- [ ] Live scores via api-football.com (RapidAPI free tier)
- [ ] IG share card generator on event drawer (html2canvas)
- [ ] About page
- [ ] Shop page (Shopify embed)
- [ ] Borough/community filtering refinement
- [ ] Co-host / venue interest form
