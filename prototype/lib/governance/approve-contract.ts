import type { ApprovalRequest, HumanDecision } from "@/lib/contracts";
import { HumanDecisionSchema } from "@/lib/contracts";
import { policyChecksPass } from "@/lib/policies/evaluate-package";

export function hasCurrentVersionApproval(
  decisions: HumanDecision[],
  currentVersion: number,
  expected: "approve_test" | "approve_activation" = "approve_test",
): boolean {
  return decisions.some((decision) => decision.decision === expected && decision.contractVersion === currentVersion);
}

export function approveCurrentVersion(request: ApprovalRequest): HumanDecision {
  if (request.reviewedContractVersion !== request.currentContractVersion) throw new Error("STALE_CONTRACT_VERSION");
  if (!policyChecksPass(request.checks)) throw new Error("POLICY_CHECKS_FAILED");
  if (!request.rationale.trim()) throw new Error("APPROVAL_RATIONALE_REQUIRED");
  return HumanDecisionSchema.parse({
    id: `approval-v${request.currentContractVersion}-${request.decidedAt.replaceAll(/[^0-9]/g, "")}`,
    actor: `${request.actorDisplayName} · Brand Legal Checker`,
    decision: request.decision ?? "approve_test",
    rationale: request.rationale,
    decidedAt: request.decidedAt,
    contractVersion: request.currentContractVersion,
  });
}
