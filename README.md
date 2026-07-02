# ZABAL Newsletter Builder

The ZAO daily-3 newsletter, as a Vercel app. A pipeline dashboard plus an issue composer that assembles posts in ZAO voice.

## What it is

The Q2 recap was one big post nobody reads twice. This reframes it into a daily series: one issue = 3 wins, tight, in voice, built to get better each day. See Doc 930 (the loop), Doc 928 (Q2 wins), Doc 929 (full record) in the ZAO OS repo.

## Producing an issue

See [NEWSLETTER-UPDATE.md](./NEWSLETTER-UPDATE.md) - the full runbook for creating, drafting, grading, and publishing a daily issue (any session can follow it). [BUILD-LOG.md](./BUILD-LOG.md) is the day-by-day record.

## Pages

- `/` - Pipeline. The 9-issue sequence (biggest-first), each with its 3 wins, status, and what ZOE still needs. Filter by status. Voice guardrails at the bottom.
- `/builder` - Compose. Pick an issue, draft the 3 win blocks, and it assembles a full ZAO-voice post live. Word count, off-voice flags (emoji / em dash / hype words), copy button.

## Stack

Next.js 15 (App Router), React 19, TypeScript, plain CSS. No external UI deps, so it builds clean on Vercel.

## Run locally

```bash
npm install
npm run dev
# http://localhost:3000
```

## Deploy to Vercel

```bash
# option A: dashboard
# push this repo to GitHub, then "New Project" on vercel.com, pick the repo, deploy (zero config).

# option B: CLI
npm i -g vercel
vercel
```

Next.js is auto-detected. No env vars needed for v1.

## Data

- `lib/issues.ts` - the 9-issue sequence + the 3 wins each. Edit here to reorder or update.
- `lib/voice.ts` - the do/never voice rules + banned-word list the composer flags.

## Cloud sync (Supabase)

Optional. Without env vars the app runs localStorage-only; the dashboard shows a "not configured" note. To turn it on:

1. In your Supabase project, run `supabase/schema.sql` (creates `newsletter_state` + anon RLS policies).
2. In Vercel, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings -> Environment Variables).
3. Redeploy.

Then the dashboard "Cloud sync" section lets you push/pull all state under a workspace name (last-write-wins). It reuses the same JSON shape as the local backup, so cloud and file backups are interchangeable.

## Roadmap

- Persist edits + statuses (Supabase) instead of static data.
- Wire ZOE to pre-draft each issue (a `bot/src/zoe/newsletter.ts` worker in ZAO OS, boot-verified + PR to main).
- Engagement column: track what landed, weight next issue.
- Push a finished issue straight to Paragraph / the socials pipeline.

## Contributing (ZABAL Gamez submissions)

Small additions welcome. Pick one thing, add it, open a PR - that PR is a ZABAL Gamez submission. No minimum size. See [CONTRIBUTING.md](./CONTRIBUTING.md) for good first tasks, and [BUILD-LOG.md](./BUILD-LOG.md) for the day-one record (13 passes, each a template for a submission).

## Voice

Sourced from the ZAO OS repo: `.claude/skills/zao-os/brand-voice.md`, `bot/src/zoe/brand.md`, `.claude/skills/newsletter/voice-reference.md`. Open "ZM.", lead with the build, real numbers, no emojis, no em dashes, sign off as the ZABAL Team.
