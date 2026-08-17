import inventoryFixture from "@/public/data/inventory.json";
import type { SynthesisEvidenceRecord } from "@/lib/contracts/live-ai";
import { loadFixtureBundle } from "@/lib/fixtures/load-fixtures";

/**
 * The approved evidence surface for the Gemini boundary.
 *
 * A model claim is only accepted when every cited ID appears here. This registry
 * is assembled server-side from checked-in fixtures, so an unknown ID means the
 * model invented a source and the whole response is discarded.
 */

/**
 * Covers the bundled opportunity contracts and the operational fixtures, which
 * share fixture version 1.0.0. Bump this when either fixture set changes so that
 * cached and client-held synthesis is invalidated.
 */
export const EVIDENCE_VERSION = "evidence-1.0.0";

export function isKnownEvidenceVersion(version: string): boolean {
  return version === EVIDENCE_VERSION;
}

/**
 * Operational readiness records the router already reasons over. They are
 * citable evidence for synthesis (inventory, channel coverage, rights) but they
 * remain synthetic aggregates — never person-level or private HUL data.
 */
function operationalEvidence(): SynthesisEvidenceRecord[] {
  const records: SynthesisEvidenceRecord[] = inventoryFixture.records.map((record) => ({
    id: record.id,
    claim: `Invented aggregate stock for ${record.cell}: ${record.daysCover} days cover at ${Math.round(record.serviceLevel * 100)}% service level.`,
    stance: record.serviceLevel >= 0.9 ? "support" : "contradict",
    evidenceType: "synthetic_internal",
    freshness: "live",
    geography: record.cell,
  }));

  const rights: SynthesisEvidenceRecord[] = inventoryFixture.rights.map((right) => ({
    id: right.id,
    claim: `Rights for ${right.asset} are ${right.status.replaceAll("_", " ")}.`,
    stance: right.status === "unavailable" ? "contradict" : "support",
    evidenceType: "synthetic_internal",
    freshness: "live",
    geography: "India demo scope",
  }));

  return [...records, ...rights];
}

/** Operational evidence is Rexona-specific, so it only joins the hero opportunity. */
const HERO_OPPORTUNITY_ID = "opp-extra-time-sweat-confidence";

/**
 * Approved evidence for one opportunity. Model-inference items are excluded on
 * purpose: prior inference must never be recycled as grounding for new inference.
 */
export function getApprovedEvidence(opportunityId: string): SynthesisEvidenceRecord[] {
  const contract = loadFixtureBundle().contracts.find(
    ({ opportunity }) => opportunity.id === opportunityId,
  );
  if (!contract) return [];

  const fromContract: SynthesisEvidenceRecord[] = contract.opportunity.evidence
    .filter(
      (evidence) =>
        evidence.evidenceType === "public" || evidence.evidenceType === "synthetic_internal",
    )
    .map((evidence) => ({
      id: evidence.id,
      claim: evidence.claim,
      stance: evidence.stance,
      evidenceType: evidence.evidenceType as SynthesisEvidenceRecord["evidenceType"],
      freshness: evidence.freshness,
      geography: String((evidence as Record<string, unknown>).geography ?? "India demo scope"),
    }));

  return opportunityId === HERO_OPPORTUNITY_ID
    ? [...fromContract, ...operationalEvidence()]
    : fromContract;
}

export function getApprovedEvidenceIds(opportunityId: string): Set<string> {
  return new Set(getApprovedEvidence(opportunityId).map(({ id }) => id));
}

export function isKnownOpportunityId(opportunityId: string): boolean {
  return loadFixtureBundle().contracts.some(
    ({ opportunity }) => opportunity.id === opportunityId,
  );
}

/**
 * True only when every cited ID is approved evidence for this opportunity.
 * An empty citation list is rejected: an uncited claim is not grounded.
 */
export function citesOnlyKnownEvidence(opportunityId: string, evidenceIds: string[]): boolean {
  if (evidenceIds.length === 0) return false;
  const approved = getApprovedEvidenceIds(opportunityId);
  return evidenceIds.every((id) => approved.has(id));
}
