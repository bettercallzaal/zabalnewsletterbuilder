import { describe, it, expect } from "vitest";
import { generateStarter } from "@/lib/starter";
import type { Issue } from "@/lib/issues";

const issue: Issue = {
  n: 1,
  theme: "The Machine",
  status: "next",
  wins: ["Win One", "Win Two", "Win Three"],
  need: "",
};

describe("generateStarter", () => {
  it("returns one block per win", () => {
    expect(generateStarter(issue).blocks).toHaveLength(3);
  });
  it("has a theme line and a closer", () => {
    const d = generateStarter(issue);
    expect(d.themeLine.length).toBeGreaterThan(0);
    expect(d.closer.length).toBeGreaterThan(0);
  });
  it("seeds each block from its win", () => {
    expect(generateStarter(issue).blocks[0].toLowerCase()).toContain("win one");
  });
});
