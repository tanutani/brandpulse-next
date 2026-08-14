import { describe, expect, it } from "vitest";

import type { SprintRegistration, SyntheticOutcome } from "@/lib/contracts";
import { evaluateOutcome } from "@/lib/experiment/evaluate-outcome";
import { scoreCellComparability } from "@/lib/experiment/match-cells";
import { lockSprint, reviseSprint, validateSprint } from "@/lib/experiment/validate-sprint";

const sprint: SprintRegistration = {
  schemaVersion: "1.0.0",
  id: "sprint-extra-time-four-city",
  hypothesis: "Rights-safe creator content will lift q-commerce conversion versus matched cells.",
  treatmentCells: ["Mumbai-West", "Bengaluru-Central"],
  comparisonCells: ["Delhi-South", "Hyderabad-Central"],
  channel: "q_commerce",
  budgetCapInr: 500_000,
  primaryMetric: "incremental q-commerce conversion",
  guardrailMetrics: ["service level"],
  measurementWindow: { start: "2026-08-15T18:30:00.000Z", end: "2026-08-18T18:30:00.000Z" },
  scaleThreshold: { incrementalEffectAtLeast: 0.01 },
  killThreshold: { incrementalEffectBelow: 0, serviceLevelBelow: 0.9 },
  comparabilityScore: 86,
  validationStatus: "draft",
  lockedAt: null,
};

const outcome: SyntheticOutcome = {
  id: "result-hero-sprint-later",
  sprintId: sprint.id,
  observedAt: "2026-08-22T18:00:00.000Z",
  primaryMetric: sprint.primaryMetric,
  treatmentRate: 0.071,
  comparisonRate: 0.059,
  incrementalEffect: 0.012,
  confidenceInterval: { lower: 0.003, upper: 0.021 },
  serviceLevelGuardrail: 0.95,
  synthetic: true,
};

describe("causal sprint", () => {
  it("scores preselected cell similarity deterministically", () => {
    expect(scoreCellComparability(
      [{ id: "a", serviceLevel: 0.96, baselineConversion: 0.06, categorySearchIndex: 111 }],
      [{ id: "b", serviceLevel: 0.93, baselineConversion: 0.059, categorySearchIndex: 110 }],
    )).toBe(86);
  });
  it("validates the preselected matched four-city design", () => {
    expect(validateSprint(sprint)).toEqual({ valid: true, errors: [] });
  });

  it("blocks overlapping, under-stocked, and weakly comparable cells", () => {
    const invalid = {
      ...sprint,
      comparisonCells: ["Mumbai-West", "Kolkata-Demo"],
      comparabilityScore: 64,
    };
    expect(validateSprint(invalid).errors).toEqual(expect.arrayContaining([
      "CELLS_MUST_BE_DISJOINT",
      "CELL_STOCK_NOT_READY",
      "CELL_COMPARABILITY_BELOW_70",
    ]));
  });

  it("blocks incomplete fields and invalid measurement windows", () => {
    const invalid = { ...sprint, hypothesis: "", measurementWindow: { start: sprint.measurementWindow.end, end: sprint.measurementWindow.start } };
    expect(validateSprint(invalid).errors).toEqual(expect.arrayContaining(["INVALID_HYPOTHESIS", "MEASUREMENT_WINDOW_INVALID"]));
  });

  it("makes registered rules immutable", () => {
    const locked = lockSprint(sprint, "2026-08-15T12:00:00.000Z");
    expect(() => reviseSprint(locked, { primaryMetric: "incremental q-commerce conversion" })).toThrow("SPRINT_RULES_LOCKED");
  });

  it("applies the synthetic result only to the locked thresholds", () => {
    const locked = lockSprint(sprint, "2026-08-15T12:00:00.000Z");
    expect(evaluateOutcome(locked, outcome)).toMatchObject({
      decision: "scale",
      reasonCodes: ["PRIMARY_METRIC_ABOVE_LOCKED_SCALE_THRESHOLD", "SERVICE_GUARDRAIL_PASSED"],
    });
    expect(() => evaluateOutcome(sprint, outcome)).toThrow("SPRINT_NOT_LOCKED");
  });
});
