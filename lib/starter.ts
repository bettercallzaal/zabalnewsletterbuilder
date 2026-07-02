import type { Issue } from "@/lib/issues";
import type { Draft } from "@/lib/drafts";

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
  return `${opener}.\n\n[lead with the build. one real number. name a person. drop one link.]`;
}

// Build an editable starter draft from an issue's wins.
export function generateStarter(issue: Issue): Draft {
  return {
    themeLine: themeLines[issue.n] ?? "here is what shipped.",
    blocks: issue.wins.map(winStub),
    closer: "the quiet work compounds.",
  };
}
