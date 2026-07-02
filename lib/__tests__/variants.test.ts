import { describe, it, expect } from "vitest";
import { toFarcaster, toXThread } from "@/lib/variants";
import type { Issue } from "@/lib/issues";
import type { Draft } from "@/lib/drafts";

const issue: Issue = {
  n: 1,
  theme: "The Machine",
  status: "next",
  wins: ["win one", "win two", "win three"],
  need: "",
};
const sentence = "we shipped the thing and it works on chain. ".repeat(12);
const draft: Draft = {
  themeLine: "the quarter it ran itself",
  blocks: [sentence, sentence, sentence],
  closer: "the quiet work compounds.",
};

describe("variants", () => {
  it("farcaster cast stays within 1024 chars", () => {
    expect(toFarcaster(issue, draft).length).toBeLessThanOrEqual(1024);
  });
  it("x thread posts each stay within 280 chars", () => {
    const posts = toXThread(
      `ZM.\n\n${draft.themeLine}\n\n${draft.blocks.join("\n\n")}\n\n${draft.closer}`
    );
    expect(posts.length).toBeGreaterThan(0);
    for (const p of posts) expect(p.length).toBeLessThanOrEqual(280);
  });
});
