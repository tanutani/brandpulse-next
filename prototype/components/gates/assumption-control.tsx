"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { RouteBadge } from "@/components/gates/route-badge";
import { ScoreBar } from "@/components/gates/score-bar";
import type { OpportunityContract, ProofInputs } from "@/lib/contracts";
import { LocalContractStore } from "@/lib/persistence/local-contract-store";
import { selectRoute } from "@/lib/routing/select-route";
import { calculateProof, hasFullProofComponents } from "@/lib/scoring/proof";

export function AssumptionControl({
  contract,
  evaluatedAt,
}: {
  contract: OpportunityContract;
  evaluatedAt: string;
}) {
  const assessment = contract.brandAssessments.find(
    ({ brandId }) => brandId === contract.selectedBrandId,
  ) ?? contract.brandAssessments[0];
  const [sourceConcentration, setSourceConcentration] = useState(0);
  const [storageReady, setStorageReady] = useState(false);
  const [persistenceAvailable, setPersistenceAvailable] = useState(true);

  /**
   * Re-scoring needs the six proof inputs. A collapsed assessment stores only its
   * own total, so there is nothing to vary and the panel is hidden rather than
   * shown computing on absent values.
   */
  const canRecompute = hasFullProofComponents(assessment.proof.components);

  const componentValues = useMemo(
    () => Object.fromEntries(assessment.proof.components.map(({ name, value }) => [name, value])),
    [assessment.proof.components],
  );

  const proof = useMemo(
    () => calculateProof({
      persistence: componentValues.persistence,
      independentCorroboration: componentValues.independentCorroboration,
      behavioralProgression: componentValues.behavioralProgression,
      diffusion: componentValues.diffusion,
      commercialSignal: componentValues.commercialSignal,
      freshnessQuality: componentValues.freshnessQuality,
      sourceConcentration,
      manipulationRisk: 0,
      evidence: contract.opportunity.evidence,
    } as ProofInputs),
    [componentValues, contract.opportunity.evidence, sourceConcentration],
  );

  const decision = useMemo(
    () => selectRoute({
      opportunity: contract.opportunity,
      proof,
      permission: assessment.permission,
      preparedness: assessment.preparedness,
      blockers: [],
      evaluatedAt,
    }),
    [assessment.permission, assessment.preparedness, contract.opportunity, evaluatedAt, proof],
  );

  useEffect(() => {
    try {
      const stored = new LocalContractStore(window.localStorage).load();
      const latest = stored?.contractVersions
        .filter(({ contractId }) => contractId === contract.contractId)
        .at(-1);
      const saved = latest?.assumptions.find(
        ({ label }) => label === "Current source concentration percentage",
      )?.value;
      queueMicrotask(() => {
        if (typeof saved === "number") setSourceConcentration(saved);
        setStorageReady(true);
      });
    } catch {
      queueMicrotask(() => {
        setPersistenceAvailable(false);
        setStorageReady(true);
      });
    }
  }, [contract.contractId]);

  useEffect(() => {
    if (!storageReady || !canRecompute) return;

    try {
      const store = new LocalContractStore(window.localStorage);
      const current = store.load();
      const latest = current?.contractVersions
        .filter(({ contractId }) => contractId === contract.contractId)
        .at(-1);
      const saved = latest?.assumptions.find(
        ({ label }) => label === "Current source concentration percentage",
      )?.value;

      if (saved === sourceConcentration && latest?.recommendedRoute === decision.route) {
        return;
      }

      const nextVersion = Math.max(
        contract.version,
        ...(current?.contractVersions
          .filter(({ contractId }) => contractId === contract.contractId)
          .map(({ version }) => version) ?? []),
      ) + 1;
      const assumptions = contract.assumptions.map((assumption) =>
        assumption.label === "Current source concentration percentage"
          ? { ...assumption, value: sourceConcentration }
          : assumption,
      );
      const brandAssessments = contract.brandAssessments.map((item) =>
        item.brandId === assessment.brandId
          ? { ...item, proof, readiness: decision.readiness }
          : item,
      );

      store.appendContractVersion({
        ...contract,
        version: nextVersion,
        assumptions,
        brandAssessments,
        recommendedRoute: decision.route,
        routeReasonCodes: decision.reasonCodes,
      });
    } catch {
      // The deterministic route remains usable even when browser storage is unavailable.
    }
  }, [assessment.brandId, canRecompute, contract, decision.readiness, decision.reasonCodes, decision.route, proof, sourceConcentration, storageReady]);

  if (!canRecompute) return null;

  return (
    <details className="detail-disclosure">
      <summary>Test the evidence — change a documented assumption</summary>
      <div className="detail-body">
        <div className="section-head">
          <div>
            <p className="section-kicker">Sensitivity · team thresholds</p>
            <h3>Concentrated evidence lowers Proof</h3>
          </div>
          <RouteBadge route={decision.route} actionMode={contract.actionMode} />
        </div>

        <ScoreBar label="Proof" score={proof.score} weakest />
        <ScoreBar label="Permission" score={assessment.permission.score} />
        <ScoreBar label="Preparedness" score={assessment.preparedness.score} />

        <div style={{ marginTop: "var(--s4)" }}>
          <label className="small" htmlFor="source-concentration" style={{ fontWeight: 650 }}>
            Assume evidence is concentrated in one source family
          </label>
          <p className="muted small" style={{ marginTop: 4 }}>
            {sourceConcentration}% concentration applies a{" "}
            {proof.penalties[0].points.toFixed(0)}-point Proof penalty. At 70%, Proof falls from 68
            to 54 and the route becomes Watch.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--s3)", marginTop: "var(--s2)" }}>
            <input
              id="source-concentration"
              type="range"
              min="0"
              max="100"
              step="10"
              value={sourceConcentration}
              style={{ flex: 1 }}
              onInput={(event) => setSourceConcentration(Number(event.currentTarget.value))}
            />
            <output className="mono numeric" htmlFor="source-concentration">
              {sourceConcentration}%
            </output>
            <button className="btn btn-quiet" type="button" onClick={() => setSourceConcentration(0)}>
              <RotateCcw aria-hidden="true" size={13} /> Reset
            </button>
          </div>
        </div>

        <p className="muted small" style={{ marginTop: "var(--s3) " }} aria-live="polite">
          Readiness = min({proof.score}, {assessment.permission.score},{" "}
          {assessment.preparedness.score}) = <strong>{decision.readiness}</strong> ·{" "}
          {!storageReady
            ? "Loading saved assumption…"
            : persistenceAvailable
              ? "Saved locally; reload restores your latest assumption"
              : "Persistence unavailable; deterministic controls still work"}
        </p>
      </div>
    </details>
  );
}
