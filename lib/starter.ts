import type { Issue } from "@/lib/issues";
import type { Draft } from "@/lib/drafts";
import { CANONICAL_LINKS, CONTEXT_FACTS } from "@/lib/context";

// Per-issue theme lines (the line after "ZM."). Voice-shaped, editable.
const themeLines: Record<number, string> = {
  1: "the quarter we stopped doing the work by hand.",
  2: "the battles are not the point. what they pay for is.",
  3: "we stopped talking about builders and started teaching them.",
  4: "culture needs a treasury. we built one that ranks.",
  5: "an event is just a room until you lock the room.",
  6: "the lab kept spinning things out that stand on their own.",
  7: "some of it does not happen on a screen.",
  8: "none of this is solo. here is who showed up.",
  9: "the boring parts are the ones that compound.",
};

// Turn a win headline into a starter paragraph the writer fills in.
function winStub(win: string): string {
  const opener = win.charAt(0).toLowerCase() + win.slice(1);
  return `${opener}.\n\n[lead with the build. one real number (see context). name a person. drop one link (see context).]`;
}

// A compact, accurate context block the composer can surface next to the draft,
// so writers pull real links + verified numbers instead of guessing. Draws from
// lib/context.ts - the single place these are kept current.
export function contextHint(): { links: { label: string; url: string; what: string }[]; facts: { label: string; value: string; asOf: string }[] } {
  return {
    links: CANONICAL_LINKS.map((l) => ({ label: l.label, url: l.url, what: l.what })),
    facts: CONTEXT_FACTS.map((f) => ({ label: f.label, value: f.value, asOf: f.asOf })),
  };
}

// Build an editable starter draft from an issue's wins.
export function generateStarter(issue: Issue): Draft {
  return {
    themeLine: themeLines[issue.n] ?? "here is what shipped.",
    blocks: issue.wins.map(winStub),
    closer: "the quiet work compounds.",
  };
}
