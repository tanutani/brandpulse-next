import { describe, expect, it } from "vitest";

import { minimalOpportunityContract, OpportunityContractSchema } from "@/lib/contracts";

describe("OpportunityContractSchema", () => {
  it("parses the frozen minimal contract", () => {
    expect(OpportunityContractSchema.parse(minimalOpportunityContract)).toEqual(
      minimalOpportunityContract,
    );
  });

  it("requires at least three brand assessments", () => {
    const result = OpportunityContractSchema.safeParse({
      ...minimalOpportunityContract,
      brandAssessments: minimalOpportunityContract.brandAssessments.slice(0, 2),
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing required route reason codes", () => {
    const withoutReasonCodes: Record<string, unknown> = { ...minimalOpportunityContract };
    delete withoutReasonCodes.routeReasonCodes;

    expect(OpportunityContractSchema.safeParse(withoutReasonCodes).success).toBe(false);
  });

  it("rejects forbidden root fields", () => {
    const result = OpportunityContractSchema.safeParse({
      ...minimalOpportunityContract,
      modelSelectedRoute: "act_now",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an unsupported provenance value", () => {
    const result = OpportunityContractSchema.safeParse({
      ...minimalOpportunityContract,
      opportunity: {
        ...minimalOpportunityContract.opportunity,
        evidence: [
          {
            ...minimalOpportunityContract.opportunity.evidence[0],
            evidenceType: "unlabeled",
          },
        ],
      },
    });

    expect(result.success).toBe(false);
  });
});
