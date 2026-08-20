import { describe, expect, it } from "vitest";
import { AUTO_DRAFT_LATEST, autoDraftWorkspace, buildAutoDraftRow } from "@/lib/autodraft";
import type { Issue } from "@/lib/issues";

const issue: Issue = {
  n: 3,
  theme: "the quarter we stopped doing the work by hand.",
  status: "next",
  wins: ["a", "b", "c"],
  need: "nothing",
} as Issue;

const now = new Date("2026-08-20T06:00:00.000Z");

describe("autoDraftWorkspace", () => {
  it("keys by ISO date", () => {
    expect(autoDraftWorkspace(now)).toBe("auto-draft:2026-08-20");
  });

  it("latest key is stable", () => {
    expect(AUTO_DRAFT_LATEST).toBe("auto-draft:latest");
  });
});

describe("buildAutoDraftRow", () => {
  const row = buildAutoDraftRow({
    issue,
    draft: { themeLine: "t", blocks: ["1", "2", "3"], closer: "c" },
    post: "body",
    words: 42,
    score: 81,
    title: "Year of the ZABAL - Day 232",
    now,
  });

  it("carries the issue number and date", () => {
    expect(row.issueNumber).toBe(3);
    expect(row.date).toBe("2026-08-20");
    expect(row.generated_at).toBe(now.toISOString());
  });

  it("keeps the draft, score and title intact", () => {
    expect(row.draft.blocks).toHaveLength(3);
    expect(row.score).toBe(81);
    expect(row.title).toContain("Day 232");
    expect(row.words).toBe(42);
  });
});
