import { describe, expect, it } from "vitest";

import { activationPackageFixture } from "@/lib/activation/draft-package";
import { approveCurrentVersion, hasCurrentVersionApproval } from "@/lib/governance/approve-contract";
import { evaluateActivationVariant, policyChecksPass } from "@/lib/policies/evaluate-package";

const evaluatedAt = "2026-08-15T12:20:00.000Z";

describe("governed activation", () => {
  it("blocks unlicensed match footage with an exact rule and remediation", () => {
    const checks = evaluateActivationVariant(activationPackageFixture.variants[0], evaluatedAt);
    expect(checks.find(({ ruleId }) => ruleId === "RIGHTS-001")).toMatchObject({
      status: "fail",
      remediation: expect.stringContaining("original creator-led"),
    });
    expect(policyChecksPass(checks)).toBe(false);
  });

  it("passes both corrected rights-safe variants", () => {
    for (const variant of activationPackageFixture.variants.slice(1)) {
      expect(policyChecksPass(evaluateActivationVariant(variant, evaluatedAt))).toBe(true);
    }
  });

  it("rejects failed policy checks and stale contract approval", () => {
    const failedChecks = evaluateActivationVariant(activationPackageFixture.variants[0], evaluatedAt);
    const safeChecks = evaluateActivationVariant(activationPackageFixture.variants[1], evaluatedAt);
    const base = {
      actor: "brand_legal_checker" as const,
      actorDisplayName: "A. Rao",
      rationale: "Rights-safe, disclosed, current-version bounded test.",
      reviewedContractVersion: 3,
      currentContractVersion: 3,
      decidedAt: "2026-08-15T12:25:00.000Z",
    };
    expect(() => approveCurrentVersion({ ...base, checks: failedChecks })).toThrow("POLICY_CHECKS_FAILED");
    expect(() => approveCurrentVersion({ ...base, checks: safeChecks, reviewedContractVersion: 2 })).toThrow("STALE_CONTRACT_VERSION");
  });

  it("creates an appendable decision only for the current passing version", () => {
    const checks = evaluateActivationVariant(activationPackageFixture.variants[1], evaluatedAt);
    const approval = approveCurrentVersion({
      actor: "brand_legal_checker",
      actorDisplayName: "A. Rao",
      rationale: "Rights-safe, disclosed, current-version bounded test.",
      reviewedContractVersion: 3,
      currentContractVersion: 3,
      checks,
      decidedAt: "2026-08-15T12:25:00.000Z",
    });
    expect(hasCurrentVersionApproval([], 3)).toBe(false);
    expect(hasCurrentVersionApproval([approval], 3)).toBe(true);
    expect(hasCurrentVersionApproval([approval], 4)).toBe(false);
  });
});
