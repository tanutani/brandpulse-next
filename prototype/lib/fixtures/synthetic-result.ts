import fixture from "@/public/data/synthetic-results.json";
import { SyntheticOutcomeSchema } from "@/lib/contracts";

export const heroSyntheticOutcome = SyntheticOutcomeSchema.parse({
  id: fixture.results[0].id,
  sprintId: fixture.results[0].sprintId,
  observedAt: fixture.results[0].observedAt,
  primaryMetric: fixture.results[0].primaryMetric,
  treatmentRate: fixture.results[0].treatmentRate,
  comparisonRate: fixture.results[0].comparisonRate,
  incrementalEffect: fixture.results[0].incrementalEffect,
  confidenceInterval: fixture.results[0].confidenceInterval,
  serviceLevelGuardrail: fixture.results[0].serviceLevelGuardrail,
  synthetic: true,
});
