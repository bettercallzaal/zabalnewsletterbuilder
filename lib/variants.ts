import type { Issue } from "@/lib/issues";
import type { Draft } from "@/lib/drafts";

const FC_LIMIT = 1024;
const X_LIMIT = 280;

function firstSentence(text: string, fallback: string): string {
  const t = text.trim();
  if (!t || /^\[/.test(t)) return fallback;
  const m = t.match(/^[^.!?\n]+[.!?]?/);
  return (m ? m[0] : t).trim();
}

// A compact Farcaster long-cast built from the issue's theme + one line per win.
export function toFarcaster(issue: Issue, draft: Draft): string {
  const theme = draft.themeLine.trim();
  const lines = issue.wins.map((w, i) =>
    firstSentence(draft.blocks[i] ?? "", w)
  );
  const closer = draft.closer.trim();
  let cast = ["ZM.", theme, ...lines, closer]
    .filter((s) => s.length > 0)
    .join("\n\n");
  if (cast.length > FC_LIMIT) cast = cast.slice(0, FC_LIMIT - 1).trimEnd() + "…";
  return cast;
}

// Split an assembled post into numbered X-thread posts under 280 chars each.
export function toXThread(post: string): string[] {
  // work from paragraphs, then pack into <=280 with room for " n/N"
  const paras = post
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const room = X_LIMIT - 6; // reserve for " 99/99"
  const chunks: string[] = [];
  let cur = "";

  const push = () => {
    if (cur.trim()) chunks.push(cur.trim());
    cur = "";
  };

  for (const p of paras) {
    if (p.length > room) {
      // split long paragraph by words
      push();
      const words = p.split(" ");
      for (const w of words) {
        if ((cur + " " + w).trim().length > room) push();
        cur = (cur ? cur + " " : "") + w;
      }
      push();
    } else if ((cur ? cur + "\n\n" + p : p).length > room) {
      push();
      cur = p;
    } else {
      cur = cur ? cur + "\n\n" + p : p;
    }
  }
  push();

  const total = chunks.length;
  return chunks.map((c, i) => `${c} ${i + 1}/${total}`);
}
