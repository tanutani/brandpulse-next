import { describe, expect, it } from "vitest";

import { activationPackageFixture } from "@/lib/activation/draft-package";
import { evaluateOutcome } from "@/lib/experiment/evaluate-outcome";
import { createHeroSprint } from "@/lib/experiment/hero-sprint";
import { lockSprint } from "@/lib/experiment/validate-sprint";
import { findOpportunityContract } from "@/lib/fixtures";
import { heroSyntheticOutcome } from "@/lib/fixtures/synthetic-result";
import { approveCurrentVersion } from "@/lib/governance/approve-contract";
import { buildLedgerEntry } from "@/lib/learning/build-ledger-entry";
import { evaluateActivationVariant } from "@/lib/policies/evaluate-package";

describe("Learning Ledger", () => {
  it("replays the exact hypothesis, version, locked rule, approval, and synthetic outcome", () => {
    const contract = findOpportunityContract("opp-extra-time-sweat-confidence")!;
    const sprint = lockSprint(createHeroSprint(contract), "2026-08-15T12:10:00.000Z");
    const checks = evaluateActivationVariant(activationPackageFixture.variants[1], "2026-08-15T12:20:00.000Z");
    const approval = approveCurrentVersion({
      actor: "brand_legal_checker", actorDisplayName: "A. Rao",
      rationale: "Rights-safe, disclosed, current-version bounded test.",
      reviewedContractVersion: 3, currentContractVersion: 3, checks,
      decidedAt: "2026-08-15T12:25:00.000Z",
    });
    const outcome = evaluateOutcome(sprint, heroSyntheticOutcome);
    const entry = buildLedgerEntry({ contract, scope: "four_city", sprint, policyChecks: checks, approval, outcome, recordedAt: "2026-08-22T18:30:00.000Z" });

    expect(entry).toMatchObject({
      contractVersion: 3,
      hypothesis: contract.opportunity.hypothesis,
      scopeChange: { from: "national", to: "four_city" },
      sprint: { lockedAt: "2026-08-15T12:10:00.000Z", scaleThreshold: { incrementalEffectAtLeast: 0.01 } },
      approval: { decision: "approve_test", contractVersion: 3 },
      outcome: { decision: "scale", incrementalEffect: 0.012, synthetic: true },
    });
  });
});
