import { describe, it, expect } from "vitest";
import { resolveLink, generatePosts } from "@/lib/socials";
import { linkByLabel } from "@/lib/context";
import type { Issue } from "@/lib/issues";
import type { Draft } from "@/lib/drafts";

const issue = (theme: string, wins: string[] = []): Issue => ({
  n: 1,
  theme,
  status: "queued" as Issue["status"],
  wins,
  need: "",
});

const draft = (themeLine = ""): Draft => ({
  themeLine,
  blocks: [],
  closer: "",
});

describe("resolveLink (canonical-context wiring)", () => {
  it("expands a canonical label to its real URL", () => {
    const url = resolveLink(issue("anything"), draft(), "wwtracker");
    expect(url).toBe(linkByLabel("wwtracker")!.url);
  });

  it("passes a raw URL through untouched", () => {
    const url = resolveLink(issue("anything"), draft(), "https://example.com/x");
    expect(url).toBe("https://example.com/x");
  });

  it("infers the entity link from the issue content when no link is given", () => {
    const url = resolveLink(issue("WaveWarZ treasury holds the floor"), draft(), "");
    expect(url).toBe(linkByLabel("wwtracker")!.url);
  });

  it("falls back to the newsletter when nothing matches", () => {
    const url = resolveLink(issue("a quiet day"), draft(), "");
    expect(url).toBe(linkByLabel("newsletter")!.url);
  });
});

describe("generatePosts carries real links", () => {
  it("every post with a link uses the resolved canonical URL, never the raw label", () => {
    const posts = generatePosts(issue("ZABAL Gamez ships", ["Season Run is live"]), draft(), "zabalgamez-quest");
    const url = linkByLabel("zabalgamez-quest")!.url;
    for (const p of posts) {
      expect(p.text).toContain(url);
      expect(p.text).not.toMatch(/zabalgamez-quest(?!\.)/); // no bare label leaking
    }
  });
});
