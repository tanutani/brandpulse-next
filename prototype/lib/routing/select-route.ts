import type { DecisionBlocker, GateAssessment, RouteDecision, RouteInputs } from "@/lib/contracts";
import { ROUTE_THRESHOLDS } from "@/lib/scoring/config";

export const ROUTE_REASON_CODES = {
  expired: "WINDOW_EXPIRED",
  mandatoryBlocker: "MANDATORY_BLOCKER",
  remediableBlocker: "REMEDIABLE_BLOCKER_REQUIRES_REMEDIATION",
  proofBelowIgnore: "PROOF_BELOW_IGNORE_THRESHOLD",
  permissionBelowIgnore: "PERMISSION_BELOW_IGNORE_THRESHOLD",
  actThresholdsMet: "ACT_NOW_THRESHOLDS_MET",
  liveWindowEligible: "LIVE_WINDOW_WITHIN_72_HOURS",
  testThresholdsMet: "TEST_THRESHOLDS_MET",
  durableLeadTime: "DURABLE_TREND_NEEDS_CAPABILITY",
  proofNeedsMore: "PROOF_NEEDS_MORE_EVIDENCE",
  permissionNeedsReview: "PERMISSION_NEEDS_REVIEW",
  preparednessNeedsReview: "PREPAREDNESS_NEEDS_REVIEW",
  evidenceConcern: "EVIDENCE_QUALITY_REQUIRES_WATCH",
  blockerReview: "BLOCKER_REQUIRES_REVIEW",
  liveWindowTooLong: "LIVE_WINDOW_EXCEEDS_72_HOURS",
} as const;

const WATCH_CODES = new Set(["MATERIAL_DISAGREEMENT", "GEOGRAPHIC_MISMATCH", "STALE_EVIDENCE"]);
const mandatoryBlockers = (blockers: DecisionBlocker[]) =>
  blockers.filter((blocker) => blocker.severity === "mandatory");
const nonRemediableMandatoryBlockers = (blockers: DecisionBlocker[]) =>
  mandatoryBlockers(blockers).filter((blocker) => blocker.remediation === null);
const remediableMandatoryBlockers = (blockers: DecisionBlocker[]) =>
  mandatoryBlockers(blockers).filter((blocker) => blocker.remediation !== null);
const watchConcern = (blockers: DecisionBlocker[]) => blockers.some((b) => WATCH_CODES.has(b.code));

export function getWeakestGate(...gates: GateAssessment[]): GateAssessment {
  return gates.reduce((current, gate) => (gate.score < current.score ? gate : current));
}

function watchReasons(inputs: RouteInputs): string[] {
  const reasons: string[] = [];
  if (inputs.proof.score < ROUTE_THRESHOLDS.test.proof) reasons.push(ROUTE_REASON_CODES.proofNeedsMore);
  if (inputs.permission.score < ROUTE_THRESHOLDS.test.permission) reasons.push(ROUTE_REASON_CODES.permissionNeedsReview);
  if (inputs.preparedness.score < ROUTE_THRESHOLDS.test.preparedness) reasons.push(ROUTE_REASON_CODES.preparednessNeedsReview);
  if (watchConcern(inputs.blockers)) reasons.push(ROUTE_REASON_CODES.evidenceConcern);
  else if (inputs.blockers.length) reasons.push(ROUTE_REASON_CODES.blockerReview);
  return reasons.length ? reasons : [ROUTE_REASON_CODES.proofNeedsMore];
}

export function selectRoute(inputs: RouteInputs): RouteDecision {
  const low = getWeakestGate(inputs.proof, inputs.permission, inputs.preparedness);
  const base = { readiness: low.score, weakestGate: low.gate };
  const hours = (Date.parse(inputs.opportunity.usefulUntil) - Date.parse(inputs.evaluatedAt)) / 3_600_000;

  if (!Number.isFinite(hours) || hours <= 0)
    return { ...base, route: "ignore", reasonCodes: [ROUTE_REASON_CODES.expired] };
  const nonRemediable = nonRemediableMandatoryBlockers(inputs.blockers);
  if (nonRemediable.length)
    return {
      ...base,
      route: "ignore",
      reasonCodes: [
        ROUTE_REASON_CODES.mandatoryBlocker,
        ...nonRemediable.map((blocker) => blocker.code).sort(),
      ],
    };
  if (inputs.proof.score < ROUTE_THRESHOLDS.ignore.proofBelow)
    return { ...base, route: "ignore", reasonCodes: [ROUTE_REASON_CODES.proofBelowIgnore] };
  if (inputs.permission.score < ROUTE_THRESHOLDS.ignore.permissionBelow)
    return { ...base, route: "ignore", reasonCodes: [ROUTE_REASON_CODES.permissionBelowIgnore] };

  const remediable = remediableMandatoryBlockers(inputs.blockers);
  if (remediable.length)
    return {
      ...base,
      route: "watch",
      reasonCodes: [
        ROUTE_REASON_CODES.remediableBlocker,
        ...remediable.map((blocker) => blocker.code).sort(),
      ],
    };

  const act =
    inputs.opportunity.signalClass === "live_moment" &&
    hours <= ROUTE_THRESHOLDS.actNow.maxUsefulHours &&
    inputs.proof.score >= ROUTE_THRESHOLDS.actNow.proof &&
    inputs.permission.score >= ROUTE_THRESHOLDS.actNow.permission &&
    inputs.preparedness.score >= ROUTE_THRESHOLDS.actNow.preparedness &&
    inputs.blockers.length === 0;
  if (act)
    return {
      ...base,
      route: "act_now",
      reasonCodes: [ROUTE_REASON_CODES.actThresholdsMet, ROUTE_REASON_CODES.liveWindowEligible],
    };

  const incubate =
    inputs.opportunity.signalClass === "durable_trend" &&
    inputs.proof.score >= ROUTE_THRESHOLDS.actNow.proof &&
    inputs.permission.score >= ROUTE_THRESHOLDS.actNow.permission &&
    inputs.preparedness.score < ROUTE_THRESHOLDS.test.preparedness;
  if (incubate)
    return { ...base, route: "incubate", reasonCodes: [ROUTE_REASON_CODES.durableLeadTime] };

  const test =
    inputs.proof.score >= ROUTE_THRESHOLDS.test.proof &&
    inputs.permission.score >= ROUTE_THRESHOLDS.test.permission &&
    inputs.preparedness.score >= ROUTE_THRESHOLDS.test.preparedness &&
    !watchConcern(inputs.blockers);
  if (test) {
    const reasonCodes: string[] = [ROUTE_REASON_CODES.testThresholdsMet];
    if (inputs.opportunity.signalClass === "live_moment" && hours > ROUTE_THRESHOLDS.actNow.maxUsefulHours)
      reasonCodes.push(ROUTE_REASON_CODES.liveWindowTooLong);
    if (inputs.blockers.length) reasonCodes.push(ROUTE_REASON_CODES.blockerReview);
    return { ...base, route: "test", reasonCodes };
  }
  return { ...base, route: "watch", reasonCodes: watchReasons(inputs) };
}
