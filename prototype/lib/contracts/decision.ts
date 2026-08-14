import type { BlockerSeverity, Route } from "./enums";
import type { EvidenceItem, GateAssessment, Opportunity } from "./opportunity";

export interface ProofInputs {
  persistence: number;
  independentCorroboration: number;
  behavioralProgression: number;
  diffusion: number;
  commercialSignal: number;
  freshnessQuality: number;
  sourceConcentration: number;
  manipulationRisk: number;
  evidence: EvidenceItem[];
}

export interface DecisionBlocker {
  code: string;
  severity: BlockerSeverity;
  message: string;
  remediation: string | null;
}

export interface RouteInputs {
  opportunity: Pick<Opportunity, "signalClass" | "usefulUntil">;
  proof: GateAssessment;
  permission: GateAssessment;
  preparedness: GateAssessment;
  blockers: DecisionBlocker[];
  evaluatedAt: string;
}

export interface RouteDecision {
  route: Route;
  readiness: number;
  weakestGate: GateAssessment["gate"];
  reasonCodes: string[];
}

export type ProofCalculator = (inputs: ProofInputs) => GateAssessment;
export type RouteSelector = (inputs: RouteInputs) => RouteDecision;
