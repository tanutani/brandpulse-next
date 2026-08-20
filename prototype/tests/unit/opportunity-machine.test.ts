import { createActor } from "xstate";
import { describe, expect, it } from "vitest";
import type { WorkflowEvent, WorkflowEventType } from "@/lib/contracts";
import { opportunityMachine } from "@/lib/state/opportunity-machine";

const event = (type: WorkflowEventType): WorkflowEvent => ({
  type, occurredAt: "2026-08-15T12:00:00.000Z", actor: "system", contractVersion: 1,
});

describe("opportunity workflow", () => {
  it("completes the only legal happy path", () => {
    const actor = createActor(opportunityMachine).start();
    for (const type of [
      "START", "EVIDENCE_ASSEMBLED", "CHALLENGE_COMPLETED", "SCORING_COMPLETED",
      "ROUTE_CONFIRMED", "EXPERIMENT_DESIGNED", "READINESS_CHECKED", "MAKER_APPROVED",
      "OUTCOME_REQUESTED", "LEARNING_RECORDED",
    ] as WorkflowEventType[]) actor.send(event(type));
    expect(actor.getSnapshot().value).toBe("learned");
    expect(actor.getSnapshot().status).toBe("done");
  });
  it("completes the approval-first ACT path without an experiment", () => {
    const actor = createActor(opportunityMachine).start();
    for (const type of [
      "START", "EVIDENCE_ASSEMBLED", "CHALLENGE_COMPLETED", "SCORING_COMPLETED",
      "ACT_ROUTE_CONFIRMED", "ACTIVATION_REVIEWED", "READINESS_CHECKED", "ACT_MAKER_APPROVED",
      "OUTCOME_REQUESTED", "LEARNING_RECORDED",
    ] as WorkflowEventType[]) actor.send(event(type));
    expect(actor.getSnapshot().value).toBe("learned");
    expect(actor.getSnapshot().status).toBe("done");
  });
  it("ignores forbidden scoring and premature approval events", () => {
    const actor = createActor(opportunityMachine).start();
    actor.send(event("SCORING_COMPLETED"));
    expect(actor.getSnapshot().value).toBe("idle");
    actor.send(event("START"));
    actor.send(event("MAKER_APPROVED"));
    expect(actor.getSnapshot().value).toBe("assembling_evidence");
  });
  it("recovers insufficient evidence only through retry", () => {
    const actor = createActor(opportunityMachine).start();
    actor.send(event("START"));
    actor.send(event("EVIDENCE_INSUFFICIENT"));
    actor.send(event("MAKER_APPROVED"));
    expect(actor.getSnapshot().value).toBe("insufficient_evidence");
    actor.send(event("RETRY"));
    expect(actor.getSnapshot().value).toBe("assembling_evidence");
  });
  it("requires remediation before leaving a policy block", () => {
    const actor = createActor(opportunityMachine).start();
    for (const type of [
      "START", "EVIDENCE_ASSEMBLED", "CHALLENGE_COMPLETED", "SCORING_COMPLETED",
      "ROUTE_CONFIRMED", "EXPERIMENT_DESIGNED", "POLICY_FAILED",
    ] as WorkflowEventType[]) actor.send(event(type));
    expect(actor.getSnapshot().value).toBe("policy_blocked");
    actor.send(event("MAKER_APPROVED"));
    expect(actor.getSnapshot().value).toBe("policy_blocked");
    actor.send(event("RETRY"));
    expect(actor.getSnapshot().value).toBe("checking_readiness");
  });
  it("makes expiry terminal", () => {
    const actor = createActor(opportunityMachine).start();
    actor.send(event("START"));
    actor.send(event("WINDOW_EXPIRED"));
    actor.send(event("RETRY"));
    expect(actor.getSnapshot().value).toBe("expired");
    expect(actor.getSnapshot().status).toBe("done");
  });
});
