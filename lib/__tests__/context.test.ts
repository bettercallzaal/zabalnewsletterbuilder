import { describe, it, expect } from "vitest";
import {
  CANONICAL_LINKS,
  CONTEXT_FACTS,
  ECOSYSTEM,
  linkByLabel,
} from "@/lib/context";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

describe("CANONICAL_LINKS", () => {
  it("is non-empty and every link is fully filled in", () => {
    expect(CANONICAL_LINKS.length).toBeGreaterThan(0);
    for (const l of CANONICAL_LINKS) {
      expect(l.label.length).toBeGreaterThan(0);
      expect(l.what.length).toBeGreaterThan(0);
      expect(l.url.startsWith("https://")).toBe(true);
    }
  });

  it("has unique labels", () => {
    const labels = CANONICAL_LINKS.map((l) => l.label);
    expect(new Set(labels).size).toBe(labels.length);
  });
});

describe("CONTEXT_FACTS", () => {
  it("is non-empty and every fact is dated + verify-tagged", () => {
    expect(CONTEXT_FACTS.length).toBeGreaterThan(0);
    for (const f of CONTEXT_FACTS) {
      expect(f.label.length).toBeGreaterThan(0);
      expect(f.value.length).toBeGreaterThan(0);
      expect(f.verify.length).toBeGreaterThan(0);
      // the guardrail: no undated numbers can slip in
      expect(f.asOf).toMatch(DATE);
    }
  });
});

describe("ECOSYSTEM", () => {
  it("every entity has a name + one-liner", () => {
    expect(ECOSYSTEM.length).toBeGreaterThan(0);
    for (const e of ECOSYSTEM) {
      expect(e.name.length).toBeGreaterThan(0);
      expect(e.oneLiner.length).toBeGreaterThan(0);
    }
  });

  it("every entity link points at a real canonical link label", () => {
    const labels = new Set(CANONICAL_LINKS.map((l) => l.label));
    for (const e of ECOSYSTEM) {
      for (const ref of e.links ?? []) {
        expect(labels.has(ref)).toBe(true);
      }
    }
  });
});

describe("linkByLabel", () => {
  it("resolves a known label and returns undefined for an unknown one", () => {
    expect(linkByLabel("wwtracker")?.url).toContain("wwtracker");
    expect(linkByLabel("does-not-exist")).toBeUndefined();
  });
});
