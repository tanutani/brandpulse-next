import type { OpportunityContract, SprintRegistration } from "@/lib/contracts";
import { scoreCellComparability } from "@/lib/experiment/match-cells";

export function createHeroSprint(contract: OpportunityContract): SprintRegistration {
  const source = contract.causalSprint;
  if (!source) throw new Error("HERO_SPRINT_FIXTURE_MISSING");
  return {
    schemaVersion: "1.0.0",
    id: source.id,
    hypothesis: source.hypothesis,
    treatmentCells: source.treatmentCells,
    comparisonCells: source.comparisonCells,
    channel: "q_commerce",
    budgetCapInr: source.budgetCapInr,
    primaryMetric: "incremental q-commerce conversion",
    guardrailMetrics: ["service level at or above 90%"],
    measurementWindow: source.measurementWindow,
    scaleThreshold: { incrementalEffectAtLeast: 0.01 },
    killThreshold: { incrementalEffectBelow: 0, serviceLevelBelow: 0.9 },
    comparabilityScore: scoreCellComparability(
      [
        { id: "Mumbai-West", serviceLevel: 0.96, baselineConversion: 0.06, categorySearchIndex: 111 },
        { id: "Bengaluru-Central", serviceLevel: 0.96, baselineConversion: 0.059, categorySearchIndex: 110 },
      ],
      [
        { id: "Delhi-South", serviceLevel: 0.93, baselineConversion: 0.058, categorySearchIndex: 110 },
        { id: "Hyderabad-Central", serviceLevel: 0.93, baselineConversion: 0.059, categorySearchIndex: 110 },
      ],
    ),
    validationStatus: "draft",
    lockedAt: null,
  };
}
