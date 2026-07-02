import { describe, it, expect } from "vitest";
import { assemblePost } from "@/lib/assemble";
import type { Issue } from "@/lib/issues";

const issue: Issue = {
  n: 1,
  theme: "The Machine",
  status: "next",
  wins: ["a win", "b win", "c win"],
  need: "",
};

describe("assemblePost", () => {
  it("opens with ZM and signs off as the ZABAL Team", () => {
    const post = assemblePost(
      issue,
      { themeLine: "a theme", blocks: ["one", "two", "three"], closer: "done." },
      false
    );
    expect(post.startsWith("ZM.")).toBe(true);
    expect(post).toContain("ZABAL Team");
  });
});
