import { describe, it, expect } from "vitest";
import { scorePost } from "@/lib/score";

const pass = (post: string, label: string) =>
  scorePost(post).checks.find((c) => c.label.includes(label))?.pass;

describe("scorePost", () => {
  it("flags em dashes", () => {
    expect(pass("ZM. we shipped it — live.", "em dashes")).toBe(false);
  });
  it("flags work-day time phrases", () => {
    expect(pass("ZM. shipped it today.", "work-day time")).toBe(false);
  });
  it("passes timeless language", () => {
    expect(pass("ZM. shipped it the same day.", "work-day time")).toBe(true);
  });
  it("flags hashtags", () => {
    expect(pass("ZM. shipped #build", "hashtags")).toBe(false);
  });
  it("requires a ZM open", () => {
    expect(pass("hello there", "ZM")).toBe(false);
  });
});
