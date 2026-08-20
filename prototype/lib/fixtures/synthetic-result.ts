import fixture from "@/public/data/synthetic-results.json";
import { MonitoredOutcomeSchema, SyntheticOutcomeSchema } from "@/lib/contracts";

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

const surf = fixture.results.find((result) => result.kind === "act");
if (!surf || !("activationPlanId" in surf)) throw new Error("SURF_MONITORED_OUTCOME_MISSING");

export const surfMonitoredOutcome = MonitoredOutcomeSchema.parse({
  id: surf.id,
  activationPlanId: surf.activationPlanId,
  observedAt: surf.observedAt,
  successMetric: surf.successMetric,
  observedValue: surf.observedValue,
  inventoryService: surf.inventoryService,
  backlashRate: surf.backlashRate,
  decision: surf.decision,
  reasonCodes: surf.reasonCodes,
  observationBasis: surf.observationBasis,
  synthetic: true,
});
