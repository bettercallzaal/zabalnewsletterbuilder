# Build Log

The memory of this repo. What got built, when, and why. Newest first.

## Day 1 - 2026-07-01 (Year of the ZABAL, Day 182)

Started this morning, live on Vercel by tonight. Day one of building on ZABAL Gamez, in the open, one improvement per pass, each shipped live before the next.

Announced in The ZAO Newsletter: "Year of the ZABAL Day 182".

What shipped on day one:

- **v0 - foundation:** Next.js 15 (App Router) + React 19, pipeline dashboard + ZAO-voice issue composer. Data in `lib/issues.ts` (the 9-issue daily-3 sequence from Doc 930), voice rules in `lib/voice.ts`.
- **Next.js 16 upgrade:** bumped 15.1.6 -> 16.2.9 (CVE-2025-66478, was blocking the Vercel deploy).
- **Pass 1 - persistent drafts:** per-issue drafts saved to localStorage, dashboard shows draft state + word count.
- **Pass 2 - starter drafts:** composer opens pre-filled from each issue's wins, not a blank page.
- **Pass 3 - read/print/export:** `/read` renders the whole series as clean posts; copy-all, export .md, print CSS.
- **Pass 4 - notes:** per-issue "what landed" field, the input to the get-better loop.
- **Pass 5 - command palette:** Cmd/Ctrl+K to jump anywhere.
- **Pass 6 - today + streak:** next-up card + consecutive-day ship streak.
- **Pass 7 - voice score:** every draft graded 0-100 against 10 ZAO voice checks.
- **Pass 8 - export/import backup:** portable JSON of all state, cross-device.
- **Pass 9 - per-platform variants:** a Farcaster long-cast (<=1024) and an X thread (<=280 posts) from any issue.
- **Pass 10 - metadata + OG:** per-route titles, favicon, 1200x630 OG card (next/og).
- **Pass 11 - manage issues:** add / edit / reorder / delete your own issues (`useIssues`, `/issues`), everything now reads through the hook.
- **Pass 12 - mobile + empty states:** responsive polish.
- **Pass 13 - Supabase cloud sync:** push/pull workspace state, graceful without env (`supabase/schema.sql`, `lib/cloud.ts`).

Stack: Next.js 16, React 19, TypeScript, plain CSS, Supabase (optional). No UI deps, builds clean on Vercel.

Every item above is also a worked example of a ZABAL Gamez submission: one small, shippable move, out loud. See [CONTRIBUTING.md](./CONTRIBUTING.md).
