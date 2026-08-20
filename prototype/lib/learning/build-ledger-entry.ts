import type {
  CausalLearningLedgerEntry,
  MonitoredLearningLedgerEntry,
  LedgerAssemblyInputs,
  MonitoredLedgerAssemblyInputs,
} from "@/lib/contracts";

export function buildLedgerEntry(inputs: LedgerAssemblyInputs): CausalLearningLedgerEntry {
  if (inputs.approval.contractVersion < 1) throw new Error("LEDGER_APPROVAL_VERSION_INVALID");
  if (inputs.sprint.id !== inputs.outcome.sprintId) throw new Error("LEDGER_OUTCOME_MISMATCH");
  return {
    kind: "test",
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

export function buildMonitoredLedgerEntry(
  inputs: MonitoredLedgerAssemblyInputs,
): MonitoredLearningLedgerEntry {
  if (inputs.approval.decision !== "approve_activation") {
    throw new Error("LEDGER_ACTIVATION_APPROVAL_REQUIRED");
  }
  if (inputs.activationPlan.id !== inputs.outcome.activationPlanId) {
    throw new Error("LEDGER_OUTCOME_MISMATCH");
  }
  return {
    kind: "act",
    schemaVersion: "1.0.0",
    contractId: inputs.contract.contractId,
    contractVersion: inputs.approval.contractVersion,
    hypothesis: inputs.contract.opportunity.hypothesis,
    selectedBrandId: inputs.contract.selectedBrandId ?? "surf-excel",
    activationPlan: inputs.activationPlan,
    policyChecks: inputs.policyChecks,
    approval: inputs.approval,
    outcome: inputs.outcome,
    recordedAt: inputs.recordedAt,
  };
}
