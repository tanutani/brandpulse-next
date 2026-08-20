import { OpportunityContractSchema } from "./opportunity";

const emptyGate = (gate: "proof" | "permission" | "preparedness") => ({
  gate,
  score: 0,
  components: [],
  blockers: [],
  rulesetVersion: "p3-1.0.0",
});

export const minimalOpportunityContract = OpportunityContractSchema.parse({
  schemaVersion: "1.0.0",
  contractId: "contract-minimal",
  version: 1,
  opportunity: {
    id: "opportunity-minimal",
    title: "Minimal validated opportunity",
    hypothesis: "A bounded hypothesis exists for contract validation.",
    signalClass: "unresolved",
    usefulUntil: "2026-08-18T12:00:00.000Z",
    evidence: [
      {
        id: "evidence-minimal",
        stance: "neutral",
        claim: "This record exists only to validate the frozen shape.",
        evidenceType: "business_assumption",
        freshness: "recent",
      },
    ],
  },
  selectedBrandId: null,
  brandAssessments: ["rexona", "dove", "axe"].map((brandId) => ({
    brandId,
    proof: emptyGate("proof"),
    permission: emptyGate("permission"),
    preparedness: emptyGate("preparedness"),
    readiness: 0,
    portfolioConflicts: [],
  })),
  recommendedRoute: "watch",
  actionMode: "monitor",
  portfolioContext: "hul_current",
  routeReasonCodes: ["INSUFFICIENT_EVIDENCE"],
  assumptions: [
    {
      label: "Validation-only contract",
      value: true,
      evidenceType: "business_assumption",
    },
  ],
  causalSprint: null,
  humanDecisions: [],
  outcome: null,
});
