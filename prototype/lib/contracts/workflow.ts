import type { WorkflowEventType, WorkflowState } from "./enums";

export interface WorkflowEvent {
  type: WorkflowEventType;
  occurredAt: string;
  actor: "system" | "brand_manager" | "brand_legal_checker" | "analytics_owner";
  contractVersion: number;
  reason?: string;
}

export interface LegalWorkflowTransition {
  from: WorkflowState;
  event: WorkflowEventType;
  to: WorkflowState;
}
