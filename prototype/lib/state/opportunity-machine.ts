import { setup } from "xstate";
import type { WorkflowEvent } from "@/lib/contracts";

export const opportunityMachine = setup({
  types: { context: {} as Record<string, never>, events: {} as WorkflowEvent },
}).createMachine({
  id: "opportunity",
  initial: "idle",
  context: {},
  states: {
    idle: { on: { START: "assembling_evidence" } },
    assembling_evidence: { on: {
      EVIDENCE_ASSEMBLED: "challenging",
      EVIDENCE_INSUFFICIENT: "insufficient_evidence",
      WINDOW_EXPIRED: "expired",
      SERVICE_FAILED: "service_degraded",
    } },
    challenging: { on: {
      CHALLENGE_COMPLETED: "scoring",
      EVIDENCE_INSUFFICIENT: "insufficient_evidence",
      WINDOW_EXPIRED: "expired",
      SERVICE_FAILED: "service_degraded",
    } },
    scoring: { on: {
      SCORING_COMPLETED: "awaiting_human_route",
      EVIDENCE_INSUFFICIENT: "insufficient_evidence",
      WINDOW_EXPIRED: "expired",
      SERVICE_FAILED: "service_degraded",
    } },
    awaiting_human_route: { on: {
      ROUTE_CONFIRMED: "designing_experiment",
      TEST_ROUTE_CONFIRMED: "designing_experiment",
      ACT_ROUTE_CONFIRMED: "reviewing_activation",
      WINDOW_EXPIRED: "expired",
    } },
    designing_experiment: { on: {
      EXPERIMENT_DESIGNED: "checking_readiness",
      WINDOW_EXPIRED: "expired",
      SERVICE_FAILED: "service_degraded",
    } },
    reviewing_activation: { on: {
      ACTIVATION_REVIEWED: "checking_readiness",
      POLICY_FAILED: "policy_blocked",
      WINDOW_EXPIRED: "expired",
      SERVICE_FAILED: "service_degraded",
    } },
    checking_readiness: { on: {
      READINESS_CHECKED: "awaiting_maker_approval",
      POLICY_FAILED: "policy_blocked",
      WINDOW_EXPIRED: "expired",
    } },
    awaiting_maker_approval: { on: {
      MAKER_APPROVED: "approved_test",
      ACT_MAKER_APPROVED: "approved_activation",
      POLICY_FAILED: "policy_blocked",
      WINDOW_EXPIRED: "expired",
    } },
    approved_test: { on: { OUTCOME_REQUESTED: "simulating_outcome", WINDOW_EXPIRED: "expired" } },
    approved_activation: { on: { OUTCOME_REQUESTED: "monitoring_outcome", WINDOW_EXPIRED: "expired" } },
    simulating_outcome: { on: { LEARNING_RECORDED: "learned", SERVICE_FAILED: "service_degraded" } },
    monitoring_outcome: { on: { LEARNING_RECORDED: "learned", SERVICE_FAILED: "service_degraded" } },
    learned: { type: "final" },
    insufficient_evidence: { on: { RETRY: "assembling_evidence" } },
    policy_blocked: { on: { RETRY: "checking_readiness" } },
    expired: { type: "final" },
    service_degraded: { on: { RETRY: "assembling_evidence" } },
  },
});
