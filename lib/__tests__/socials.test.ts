import { describe, it, expect } from "vitest";
import { generatePosts } from "@/lib/socials";
import type { Issue } from "@/lib/issues";
import type { Draft } from "@/lib/drafts";

const issue: Issue = {
  n: 1,
  theme: "The Machine",
  status: "next",
  wins: ["shipped the thing", "and another", "and a third"],
  need: "",
};
const draft: Draft = {
  themeLine: "the day it worked",
  blocks: ["a", "b", "c"],
  closer: "done.",
};

describe("generatePosts", () => {
  const posts = generatePosts(issue, draft, "example.com");

  it("returns 7 platform posts", () => {
    expect(posts).toHaveLength(7);
  });
  it("every post opens with ZM", () => {
    for (const p of posts) expect(p.text.startsWith("ZM.")).toBe(true);
  });
  it("firefly stays within 280 chars", () => {
    const f = posts.find((p) => p.key === "firefly")!;
    expect(f.text.length).toBeLessThanOrEqual(280);
  });
  it("linkedin gives one line of ZAO context", () => {
    const l = posts.find((p) => p.key === "linkedin")!;
    expect(l.text.toLowerCase()).toContain(
      "decentralized network for independent artists"
    );
  });
  it("includes the link when provided", () => {
    expect(posts.find((p) => p.key === "firefly")!.text).toContain("example.com");
  });
});
