import type { GateAssessment, PreparednessInputs } from "@/lib/contracts";
import { P3_RULESET_VERSION, P3_WEIGHTS } from "@/lib/scoring/config";

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function calculatePreparedness(inputs: PreparednessInputs): GateAssessment {
  const components = [
    ["productClaimAvailability", inputs.productClaimAvailability, P3_WEIGHTS.preparedness.productClaimAvailability],
    ["inventoryService", inputs.inventoryService, P3_WEIGHTS.preparedness.inventoryService],
    ["channelCoverage", inputs.channelCoverage, P3_WEIGHTS.preparedness.channelCoverage],
    ["creatorAgencyReadiness", inputs.creatorAgencyReadiness, P3_WEIGHTS.preparedness.creatorAgencyReadiness],
    ["rightsLegalApproval", inputs.rightsLegalApproval, P3_WEIGHTS.preparedness.rightsLegalApproval],
    ["measurementReadiness", inputs.measurementReadiness, P3_WEIGHTS.preparedness.measurementReadiness],
  ] as const;
  const score = components.reduce((sum, [, value, weight]) => sum + clamp(value) * weight, 0);

  return {
    gate: "preparedness",
    score: Math.round(clamp(score)),
    components: components.map(([name, value, weight]) => ({
      name,
      value: clamp(value),
      weight,
      evidenceIds: inputs.evidenceIds,
    })),
    blockers: inputs.blockers.map(({ code }) => code),
    rulesetVersion: P3_RULESET_VERSION,
  };
}
