import type { LearningLedgerEntry, LedgerAssemblyInputs } from "@/lib/contracts";

export function buildLedgerEntry(inputs: LedgerAssemblyInputs): LearningLedgerEntry {
  if (inputs.approval.contractVersion < 1) throw new Error("LEDGER_APPROVAL_VERSION_INVALID");
  if (inputs.sprint.id !== inputs.outcome.sprintId) throw new Error("LEDGER_OUTCOME_MISMATCH");
  return {
    schemaVersion: "1.0.0",
    contractId: inputs.contract.contractId,
    contractVersion: inputs.approval.contractVersion,
    hypothesis: inputs.contract.opportunity.hypothesis,
    selectedBrandId: inputs.contract.selectedBrandId ?? "rexona",
    scopeChange: { from: "national", to: inputs.scope },
    sprint: inputs.sprint,
    policyChecks: inputs.policyChecks,
    approval: inputs.approval,
    outcome: inputs.outcome,
    recordedAt: inputs.recordedAt,
  };
}
