import type { GateAssessment, PermissionInputs } from "@/lib/contracts";
import { P3_RULESET_VERSION, P3_WEIGHTS } from "@/lib/scoring/config";

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function calculatePermission(inputs: PermissionInputs): GateAssessment {
  const components = [
    ["brandMeaning", inputs.brandMeaning, P3_WEIGHTS.permission.brandMeaning],
    ["audienceOverlap", inputs.audienceOverlap, P3_WEIGHTS.permission.audienceOverlap],
    ["distinctiveAssetFit", inputs.distinctiveAssetFit, P3_WEIGHTS.permission.distinctiveAssetFit],
    ["historicalCredibility", inputs.historicalCredibility, P3_WEIGHTS.permission.historicalCredibility],
    ["portfolioDistinctiveness", inputs.portfolioDistinctiveness, P3_WEIGHTS.permission.portfolioDistinctiveness],
    ["culturalClaimsSafety", inputs.culturalClaimsSafety, P3_WEIGHTS.permission.culturalClaimsSafety],
  ] as const;
  const raw = components.reduce((sum, [, value, weight]) => sum + clamp(value) * weight, 0);

  return {
    gate: "permission",
    score: Math.round(clamp(raw - clamp(inputs.portfolioConflictPenalty))),
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
