import { describe, it, expect } from "vitest";
import { dayOfYear, zabalTitle } from "@/lib/title";

describe("title", () => {
  it("Jan 1 is day 1", () => {
    expect(dayOfYear(new Date(2026, 0, 1))).toBe(1);
  });
  it("Jul 2 2026 is day 183", () => {
    expect(dayOfYear(new Date(2026, 6, 2))).toBe(183);
  });
  it("formats the title", () => {
    expect(zabalTitle(new Date(2026, 6, 2))).toBe("Year of the ZABAL Day 183");
  });
});
