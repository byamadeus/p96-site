# P96 Site — Access Guide for the Project Owner

One page: what each tool is, why we use it, how to get in, what to touch (and not touch).

If Claude Code reads this file in a session, coach the PM through whichever step they're stuck on — don't just dump the whole doc back at them.

---

## The four tools

| Tool | What it's for | You touch it when |
|---|---|---|
| **GitHub** | Stores all code + history. Every change lives here as a commit. | Reviewing what changed, approving a PR, rolling back a bad change |
| **Vercel** | Hosts the live site. Auto-deploys from GitHub. | Checking if a deploy succeeded, grabbing the live URL, checking build errors |
| **Supabase** | Database — events, RSVP intake, admin login. | Adding/editing events by hand, checking who signed up, managing the flier bucket |
| **Claude Code** | Does the actual coding — features, fixes, content changes. | Asking for any change to the site (copy, design, new page, bug fix) |

---

## 1. GitHub — the source of truth

**Repo:** wherever this file lives — ask Claude for the URL if unsure (`git remote -v`).

**Why you need access:** every change Claude makes becomes a commit. GitHub is the paper trail — you can see exactly what changed, when, and why, and undo it if needed.

**What to do here:**
- Look at recent commits to see what shipped.
- Review a Pull Request (PR) before it merges to `main` — this is your "approve this change" moment.
- **Don't** edit files directly in the GitHub web UI — ask Claude to do it, so it goes through the normal branch → review → merge flow.

**Branches that matter:**
- `main` — production. What's live (via Vercel) reflects this.
- `feature/*` — work in progress. Safe to ignore until it's ready to merge.

**Access:** ask to be added as a collaborator on the repo (GitHub username needed).

---

## 2. Vercel — where the site actually runs

**Why:** Vercel watches GitHub. Every push to `main` auto-builds and deploys the live site. No manual deploy step, ever.

**What to do here:**
- Check the **Deployments** tab if the site looks broken — a red ✗ means the build failed (usually a code error Claude needs to fix).
- Grab **preview URLs** — every PR gets its own temporary live link, so you can see a change before it merges.
- Check **Environment Variables** only if Supabase keys ever need rotating (rare — Claude handles this normally).

**Don't:** change build settings or env vars without asking Claude first — wrong values break the live site immediately.

**Access:** ask to be added to the Vercel team/project.

---

## 3. Supabase — the database

**Why:** this is where real data lives — event listings, RSVP signups (`intake` table), admin login, uploaded fliers.

**What to do here:**
- **Table Editor → `events`**: see/edit events directly if needed (though normally you'd do this through `/admin` on the live site instead — much easier, built for humans).
- **Table Editor → `intake`**: exported list of everyone who gave email/phone via the calendar lead-capture.
- **Storage → `fliers`**: uploaded event flier images.
- **Authentication → Users**: this is where `/admin` login accounts get created — ask Claude or your dev to add you here.

**Prefer `/admin` over the Supabase dashboard directly** for day-to-day event management — it's the same data, built with a proper UI (calendar view, forms, publish/draft toggle) instead of raw spreadsheet-style tables.

**Access:** ask to be added as a project member in Supabase, or just get an `/admin` login (simpler for day-to-day use).

---

## 4. Claude Code — how work actually gets done

**Why:** Claude Code is the primary builder on this project. Nearly everything — new pages, copy changes, bug fixes, design tweaks — should be requested through Claude, not done by hand.

**How to make a request (good pattern):**
1. Say what you want changed, in plain language — "make the RSVP button green," "add a new event category," "fix the date picker on mobile."
2. Claude edits code, tests it, and creates a commit (and usually a PR for review).
3. You review the PR on GitHub (or the Vercel preview link) before it goes live.
4. Once approved/merged to `main`, Vercel deploys it automatically — live in ~1 minute.

**What Claude will NOT do without you explicitly saying so:**
- Push directly to `main` / go live without review, if you've asked for a review step.
- Delete data, force-push, or touch production Supabase data destructively.

**Good habits when talking to Claude:**
- Reference specific pages by URL (e.g. `/calendar`, `/admin`) so there's no ambiguity.
- If something looks broken on the live site, screenshot it and paste the URL — faster than describing it.
- For anything data-related (events, RSVPs), it's usually faster to just do it in `/admin` yourself than to ask Claude — save Claude requests for actual code changes.

---

## Quick reference: "I want to..."

| I want to... | Go to |
|---|---|
| Add/edit an event | `/admin` on the live site |
| See who RSVP'd / gave contact info | Supabase → `intake` table |
| Change site copy, design, or add a feature | Ask Claude Code |
| Check if my last request is live | Vercel → Deployments |
| See exactly what changed and why | GitHub → commit history / PRs |
| Get an admin login | Ask Claude or dev to add you in Supabase Auth |
