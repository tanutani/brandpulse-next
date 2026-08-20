import type { MonitoredActivationPlan, PortfolioScope } from "@/lib/contracts";

export function createSurfMonitoredPlan(scope: PortfolioScope): MonitoredActivationPlan {
  return {
    schemaVersion: "1.0.0",
    id: "activation-surf-first-monsoon",
    activationWindow: {
      start: "2026-08-15T12:30:00.000Z",
      end: "2026-08-17T18:30:00.000Z",
    },
    selectedScope: scope,
    channel: "paid_social_and_q_commerce",
    descriptiveSuccessMetric: "qualified engagement rate against the recent rain-adjusted baseline",
    inventoryServiceGuardrail: 0.94,
    backlashGuardrail: 0.025,
    stopRule: "Pause if service falls below 94% or negative-response rate exceeds 2.5%.",
    approvalState: "pending",
  };
}
