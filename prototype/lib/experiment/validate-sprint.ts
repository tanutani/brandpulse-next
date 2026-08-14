import type { SprintRegistration, SprintValidation } from "@/lib/contracts";
import { SprintRegistrationSchema } from "@/lib/contracts";

export const HERO_READY_CELLS = [
  "Mumbai-West",
  "Bengaluru-Central",
  "Delhi-South",
  "Hyderabad-Central",
] as const;

export function validateSprint(
  candidate: SprintRegistration,
  readyCells: readonly string[] = HERO_READY_CELLS,
): SprintValidation {
  const errors: string[] = [];
  const parsed = SprintRegistrationSchema.safeParse(candidate);
  if (!parsed.success) {
    errors.push(...parsed.error.issues.map((issue) => `INVALID_${issue.path.join("_").toUpperCase() || "SPRINT"}`));
  }

  const treatment = new Set(candidate.treatmentCells);
  const comparison = new Set(candidate.comparisonCells);
  if ([...treatment].some((cell) => comparison.has(cell))) errors.push("CELLS_MUST_BE_DISJOINT");
  if ([...treatment, ...comparison].some((cell) => !readyCells.includes(cell))) errors.push("CELL_STOCK_NOT_READY");
  if (candidate.comparabilityScore < 70) errors.push("CELL_COMPARABILITY_BELOW_70");
  if (Date.parse(candidate.measurementWindow.end) <= Date.parse(candidate.measurementWindow.start)) {
    errors.push("MEASUREMENT_WINDOW_INVALID");
  }
  if (candidate.scaleThreshold.incrementalEffectAtLeast <= candidate.killThreshold.incrementalEffectBelow) {
    errors.push("SCALE_THRESHOLD_MUST_EXCEED_KILL_THRESHOLD");
  }
  return { valid: errors.length === 0, errors: [...new Set(errors)] };
}

export function lockSprint(candidate: SprintRegistration, lockedAt: string): SprintRegistration {
  if (candidate.lockedAt) return candidate;
  const validation = validateSprint(candidate);
  if (!validation.valid) throw new Error(`SPRINT_INVALID:${validation.errors.join(",")}`);
  if (Number.isNaN(Date.parse(lockedAt))) throw new Error("LOCK_TIME_INVALID");
  return SprintRegistrationSchema.parse({ ...candidate, validationStatus: "valid", lockedAt });
}

export function reviseSprint(
  candidate: SprintRegistration,
  patch: Partial<Omit<SprintRegistration, "id" | "schemaVersion" | "lockedAt">>,
): SprintRegistration {
  if (candidate.lockedAt) throw new Error("SPRINT_RULES_LOCKED");
  return SprintRegistrationSchema.parse({ ...candidate, ...patch });
}
