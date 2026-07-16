// Living ecosystem context the composer pulls from, so issues carry accurate
// depth - real links, real numbers, real structure - instead of guessed ones.
//
// RULE: everything here must be TRUE and CURRENT. Numbers carry an `asOf` date
// and a `verify` pointer. When a number goes stale, update it here (one place)
// rather than letting a writer estimate in a draft. Never invent a figure - if
// it is not verified, leave it out or mark it clearly.

export interface ContextLink {
  label: string;
  url: string;
  what: string;
}

export interface ContextFact {
  label: string;
  value: string;
  asOf: string; // YYYY-MM-DD
  verify: string; // where to re-check it
}

export interface EcosystemEntity {
  name: string;
  oneLiner: string;
  links?: string[]; // labels into CANONICAL_LINKS
}

// Canonical links a writer can drop straight into a win. One link per win.
export const CANONICAL_LINKS: ContextLink[] = [
  { label: "newsletter", url: "https://paragraph.com/@thezao", what: "The ZAO Newsletter on Paragraph (where this publishes)" },
  { label: "zabalgamez-quest", url: "https://zabalgamez.com/quest", what: "ZABAL Gamez Season Run - the buildathon as a quest board" },
  { label: "zabalgamez-submissions", url: "https://zabalgamez.com/submissions", what: "approved ZABAL Gamez submissions feed" },
  { label: "zabalgamez-enter", url: "https://zabalgamez.com/enter", what: "how to enter the July open build-a-thon" },
  { label: "wwtracker", url: "https://wwtracker.vercel.app", what: "WaveWarZ on-chain tracker (treasury, battles, trades, overview)" },
  { label: "zao-hub", url: "https://thezao.xyz", what: "The ZAO hub" },
  { label: "zao-bots", url: "https://thezao.xyz/bots", what: "the cowork bots board" },
];

// Verified facts + numbers. Keep dated. Update in place when they move.
export const CONTEXT_FACTS: ContextFact[] = [
  { label: "WaveWarZ battles (on-chain)", value: "1,127 created / 1,110 settled", asOf: "2026-06-14", verify: "wwtracker overview tab (Dune snapshot)" },
  { label: "WaveWarZ trades (on-chain)", value: "9,045 (6,914 buys / 2,131 sells)", asOf: "2026-06-14", verify: "wwtracker overview tab" },
  { label: "WaveWarZ unique traders", value: "122 wallets", asOf: "2026-06-14", verify: "wwtracker overview tab" },
  { label: "WaveWarZ total volume (on-chain decode)", value: "~325 SOL buy volume", asOf: "2026-06-14", verify: "wwtracker overview tab; platform reports ~484 SOL" },
  { label: "WaveWarZ treasury", value: "~3.68 SOL live, above the 3.5 operating floor (peak 7.03 on 2026-06-27)", asOf: "2026-07-03", verify: "wwtracker /api/balance (live)" },
  { label: "WaveWarZ program (Solana)", value: "9TUfEHvk5fN5vogtQyrefgNqzKy2Bqb4nWVhSFUg2fYo", asOf: "2026-07-03", verify: "Solscan" },
  { label: "ZABAL Gamez Season Run stages", value: "learn, build, ship, claim, Finals", asOf: "2026-07-03", verify: "zabalgamez.com/quest" },
  { label: "ZABAL Gamez submission unit", value: "one small shippable PR = one submission = one move in the game", asOf: "2026-07-03", verify: "zabalgamez.com/enter" },
  { label: "ZAOstock", value: "Oct 3 2026, Franklin St Parklet", asOf: "2026-07-03", verify: "ZAO calendar / event doc" },
];

// The recurring entities writers reference. Keep one-liners tight and true.
export const ECOSYSTEM: EcosystemEntity[] = [
  { name: "The ZAO", oneLiner: "the decentralized music label / community this newsletter speaks for." },
  { name: "ZABAL Gamez", oneLiner: "the open build-a-thon, now playable as a quest board (Season Run): learn, build, ship, claim, Finals.", links: ["zabalgamez-quest", "zabalgamez-submissions", "zabalgamez-enter"] },
  { name: "WaveWarZ", oneLiner: "the music-battle market on Solana - artists compete song-vs-song, fans trade SOL, everything settles on-chain.", links: ["wwtracker"] },
  { name: "ZOE", oneLiner: "the orchestrator - the autonomous agent that runs The ZAO's loops (concierge + fix-PR pipeline)." },
  { name: "Fractal Mondays", oneLiner: "the weekly community call, 100+ weeks running." },
  { name: "ZAOstock", oneLiner: "the festival - Oct 3 2026 at Franklin St Parklet." },
];

// HOW I WANT YOU TO WORK - the behavioral contract for any agent/writer using
// this context (the piece of the persistent-context pattern we had not yet
// formalized; see research doc 958). These ride along with the facts so every
// consumer inherits the same working rules.
export const HOW_TO_WORK: string[] = [
  "Every recommendation carries an impact level (high/medium/low) and a time-to-results estimate.",
  "Comparisons come back as a table with exact copy to use, not instructions to write copy.",
  "Say when unsure. Never fill a gap with a guess - name the gap and where to verify.",
  "Numbers only from CONTEXT_FACTS or a source you can cite with a date. Never invent a figure.",
  "Links only from CANONICAL_LINKS or the issue itself. Never guess a URL.",
  "Final outbound voice stays human - drafts are specs, Zaal does the last pass.",
];

// Convenience: find a link by label for a starter hint.
export function linkByLabel(label: string): ContextLink | undefined {
  return CANONICAL_LINKS.find((l) => l.label === label);
}
