import type { Issue } from "@/lib/issues";
import type { Draft } from "@/lib/drafts";
import { signOff } from "@/lib/voice";

// Assemble a full ZAO-voice post from an issue + its draft.
// placeholders=true (composer): show a prompt where a win block is empty.
// placeholders=false (read view): show [todo] so gaps are visible but quiet.
export function assemblePost(
  issue: Issue,
  draft: Draft,
  placeholders = true
): string {
  const gap = placeholders
    ? "[write 2-4 short paragraphs here, lead with the build, real numbers, credit people]"
    : "[todo]";
  const winParas = issue.wins
    .map((w, i) => {
      const body = draft.blocks[i]?.trim();
      return `${w}\n\n${body || gap}`;
    })
    .join("\n\n");
  const theme = draft.themeLine.trim() || (placeholders ? "[theme line]" : "");
  const close = draft.closer.trim();
  return [
    "ZM.",
    theme,
    winParas,
    close,
    signOff,
  ]
    .filter((s) => s.length > 0)
    .join("\n\n");
}

export function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).filter(Boolean).length : 0;
}
