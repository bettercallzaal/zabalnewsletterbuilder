# Newsletter Update Runbook

How to produce and publish a ZAO daily newsletter issue. Any session can follow this without re-explanation. Source of truth for the daily flow.

## What this repo is vs where the newsletter is published

- **This app** (zabalnewsletterbuilder, live at zabalnewsletterbuilder.vercel.app) is the *builder*. It plans issues, drafts them in ZAO voice, grades the voice, and generates Farcaster/X variants.
- **The newsletter itself** is published on Paragraph: **The ZAO Newsletter** (paragraph.com/@thezao). You paste the finished post there.
- **Socials** go out via the `/socials` skill (Firefly for Farcaster+X, plus GCs/LinkedIn/Facebook).

## Where the content lives

| Thing | Location |
|-------|----------|
| The daily-3 issue sequence (theme + 3 wins each) | `lib/issues.ts` (seed) + user edits via the `/issues` page (localStorage) |
| Voice rules the grader + composer enforce | `lib/voice.ts` |
| Voice score logic | `lib/score.ts` |
| Per-platform variants (Farcaster long-cast, X thread) | `lib/variants.ts` |
| Starter-draft generator (pre-fills the composer) | `lib/starter.ts` |
| Post assembler (ZM + theme + wins + closer + signoff) | `lib/assemble.ts` |
| Drafts / notes / statuses | browser localStorage (`znb.*` keys); portable via export backup or Supabase sync |
| The wins the sequence draws from | ZAOOS research docs 928 (Q2 wins) + 929 (full record); loop design = doc 930 |

## Create + write an issue

1. **Pick or add an issue.** Go to `/` (pipeline) to see the sequence, or `/issues` to add / edit / reorder / delete. Each issue = a theme + 3 wins. To change the seeded set in code, edit `lib/issues.ts`.
2. **Compose.** Click `compose` on an issue (or `/builder?issue=N`). It opens pre-filled with a starter draft. Write the 3 win blocks: lead with the build, one real number, name a person, one link per win.
3. **Watch the voice score** (right panel). Fix anything it flags.
4. **Save draft** (persists locally). **Copy post** when it reads right.
5. **Variants.** Switch the composer tab to Farcaster (a single <=1024-char cast) or X thread (numbered <=280-char posts). Copy per-post or the full thread.
6. **Read/export.** `/read` renders the whole series as clean posts; copy-all, export .md, or print.

## Publish

1. Paste the finished post into **The ZAO Newsletter on Paragraph** (paragraph.com/@thezao). Title format below. Add the header image.
2. Run `/socials` to generate platform posts, then post top-to-bottom (Firefly, X GC, Farcaster GC, Telegram, Discord, LinkedIn, Facebook).

## Run + deploy the app

```bash
cd ~/Desktop/repos/zabalnewsletterbuilder
npm install
npm run dev        # http://localhost:3000
npm run build      # verify green before pushing
```

Deploy: **push to `main` -> Vercel auto-deploys** to zabalnewsletterbuilder.vercel.app. No manual deploy step. Always `npm run build` locally first.

## The voice grader

`lib/score.ts` scores an assembled post 0-100 across 12 checks:
opens with "ZM.", all win blocks written (no placeholders), 250-480 words, has a real number, includes a link, short paragraphs (none over ~55 words), no work-day time phrases (timeless), no CTA labels, no emojis, no em dashes, no hype words, signs off as the ZABAL Team.

**Passing = 80 or higher (8 of 10).** Aim for 90+. The composer shows the live score and which checks fail.

## Per-platform variants

`lib/variants.ts`:
- `toFarcaster(issue, draft)` - a compact cast: ZM + theme + one line per win + closer, trimmed to 1024 chars.
- `toXThread(post)` - splits the full post into numbered posts each under 280 chars.

Both are surfaced as tabs in the composer with copy buttons. Add new platforms (LinkedIn, Telegram) here.

## Env vars

Optional. The app runs localStorage-only without them; cloud sync just stays off.

| Name | What it is for | Where set |
|------|----------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL for cross-device cloud sync | Vercel Project Settings -> Environment Variables |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key for cloud sync | Vercel Project Settings -> Environment Variables |

Never print secret values. To enable sync: add both in Vercel, run `supabase/schema.sql` in the Supabase SQL editor, redeploy.

## Daily cadence + title format

- **Title:** `Year of the ZABAL Day N`
- **Subtitle/frame:** a short line, then the post opens with `ZM.` and is framed as `day one of building on ZABAL Gamez` (increment the day language as the series runs).
- **Day number N** = the calendar day-of-year (the Year of the ZABAL began 2026-01-01 with the ZABAL token launch). Example: 2026-07-01 = Day 182. To get N for any date, count days since Jan 1 of that year (Jan 1 = Day 1).

## Voice + brand rules (hard, non-negotiable)

- Every post opens with **"ZM."**
- **No emojis. No hashtags. No em dashes** (hyphens only).
- **NEVER reference work-day times.** Not "this morning", "today", "by tonight", "at 10am". Use timeless language: "started a new repo and had it live the same day." (Zaal has a day job - posts must not imply building during work hours.)
- Lowercase-casual sentences, proper nouns capitalized. Lead with the build, not the feeling. Real numbers. Credit people by name.
- Sign off: `- BetterCallZaal on behalf of the ZABAL Team`.
- **Submission framing:** a pull request that adds one small thing to any lab repo IS a ZABAL Gamez submission. The bar is one small shippable move, not a big build. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Voice sources (read before drafting)

In the ZAOOS repo: `.claude/skills/zao-os/brand-voice.md`, `bot/src/zoe/brand.md`, `.claude/skills/newsletter/voice-reference.md`, and real posts at paragraph.com/@thezao.
