import type { OutcomeEvaluation, SprintRegistration, SyntheticOutcome } from "@/lib/contracts";

export function evaluateOutcome(sprint: SprintRegistration, outcome: SyntheticOutcome): OutcomeEvaluation {
  if (!sprint.lockedAt) throw new Error("SPRINT_NOT_LOCKED");
  if (sprint.id !== outcome.sprintId) throw new Error("OUTCOME_SPRINT_MISMATCH");
  if (sprint.primaryMetric !== outcome.primaryMetric) throw new Error("OUTCOME_METRIC_MISMATCH");

  const guardrailFailed = outcome.serviceLevelGuardrail < sprint.killThreshold.serviceLevelBelow;
  const negative = outcome.incrementalEffect < sprint.killThreshold.incrementalEffectBelow;
  if (guardrailFailed || negative) {
    return {
      ...outcome,
      decision: "kill",
      reasonCodes: [
        ...(negative ? ["PRIMARY_METRIC_BELOW_LOCKED_KILL_THRESHOLD"] : []),
        ...(guardrailFailed ? ["SERVICE_GUARDRAIL_FAILED"] : []),
      ],
    };
  }

  if (
    outcome.incrementalEffect >= sprint.scaleThreshold.incrementalEffectAtLeast
    && outcome.confidenceInterval.lower > 0
  ) {
    return {
      ...outcome,
      decision: "scale",
      reasonCodes: ["PRIMARY_METRIC_ABOVE_LOCKED_SCALE_THRESHOLD", "SERVICE_GUARDRAIL_PASSED"],
    };
  }

  return {
    ...outcome,
    decision: outcome.confidenceInterval.lower <= 0 && outcome.confidenceInterval.upper >= 0 ? "inconclusive" : "iterate",
    reasonCodes: [outcome.confidenceInterval.lower <= 0 ? "CONFIDENCE_INTERVAL_CROSSES_ZERO" : "BETWEEN_LOCKED_THRESHOLDS"],
  };
}
