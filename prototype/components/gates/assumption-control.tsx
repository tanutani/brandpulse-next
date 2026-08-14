"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { RouteBadge } from "@/components/gates/route-badge";
import { ScoreBar } from "@/components/gates/score-bar";
import type { OpportunityContract, ProofInputs } from "@/lib/contracts";
import { LocalContractStore } from "@/lib/persistence/local-contract-store";
import { selectRoute } from "@/lib/routing/select-route";
import { calculateProof } from "@/lib/scoring/proof";

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
    if (!storageReady) return;

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
  }, [assessment.brandId, contract, decision.readiness, decision.reasonCodes, decision.route, proof, sourceConcentration, storageReady]);

  return (
    <section className="decision-panel" aria-labelledby="decision-panel-title">
      <div className="decision-panel-heading">
        <div>
          <p className="eyebrow">Deterministic decision · Team thresholds</p>
          <h2 id="decision-panel-title">The weakest gate determines the route.</h2>
        </div>
        <RouteBadge route={decision.route} />
      </div>
      <div className="score-stack">
        <ScoreBar label="Proof" score={proof.score} />
        <ScoreBar label="Permission" score={assessment.permission.score} />
        <ScoreBar label="Preparedness" score={assessment.preparedness.score} />
      </div>
      <div className="assumption-box">
        <div className="assumption-copy">
          <label htmlFor="source-concentration">Assume evidence is concentrated in one source family</label>
          <p>
            {sourceConcentration}% concentration applies a {proof.penalties[0].points.toFixed(0)}-point
            Proof penalty. At 70%, Proof falls from 68 to 54 and the route becomes Watch.
          </p>
        </div>
        <output htmlFor="source-concentration">{sourceConcentration}%</output>
        <input
          id="source-concentration"
          type="range"
          min="0"
          max="100"
          step="10"
          value={sourceConcentration}
          onInput={(event) => setSourceConcentration(Number(event.currentTarget.value))}
        />
        <button className="reset-control" type="button" onClick={() => setSourceConcentration(0)}>
          <RotateCcw aria-hidden="true" size={14} /> Reset
        </button>
      </div>
      <div className="decision-foot">
        <span>Readiness = min({proof.score}, {assessment.permission.score}, {assessment.preparedness.score}) = <strong>{decision.readiness}</strong></span>
        <span aria-live="polite">
          {!storageReady
            ? "Loading saved assumption…"
            : persistenceAvailable
              ? "Saved locally; reload restores your latest assumption"
              : "Persistence unavailable; deterministic controls still work"}
        </span>
      </div>
    </section>
  );
}
