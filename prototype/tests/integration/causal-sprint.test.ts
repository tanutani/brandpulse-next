import { describe, expect, it } from "vitest";

import { createHeroSprint } from "@/lib/experiment/hero-sprint";
import { lockSprint, reviseSprint, validateSprint } from "@/lib/experiment/validate-sprint";
import { findOpportunityContract } from "@/lib/fixtures";

describe("hero sprint contract", () => {
  it("loads a valid fixture-derived design and prevents post-lock editing", () => {
    const contract = findOpportunityContract("opp-extra-time-sweat-confidence")!;
    const draft = createHeroSprint(contract);
    expect(validateSprint(draft).valid).toBe(true);
    const locked = lockSprint(draft, "2026-08-15T12:10:00.000Z");
    expect(locked).toMatchObject({ validationStatus: "valid", lockedAt: "2026-08-15T12:10:00.000Z" });
    expect(() => reviseSprint(locked, { budgetCapInr: 600_000 })).toThrow("SPRINT_RULES_LOCKED");
  });
});
