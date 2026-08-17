"use client";

import { Check, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { RouteBadge } from "@/components/gates/route-badge";
import { ScoreBar } from "@/components/gates/score-bar";
import { useGuide } from "@/components/guide/guide-provider";
import { NextActionLink } from "@/components/shell/next-action-link";
import type { AssetMode, JourneyState, OpportunityContract, PortfolioScope } from "@/lib/contracts";
import { createHeroPortfolioCandidates } from "@/lib/portfolio/hero-portfolio";
import { resolvePortfolio } from "@/lib/portfolio/resolve-owner";
import { LocalContractStore } from "@/lib/persistence/local-contract-store";
import { LocalJourneyStore } from "@/lib/persistence/local-journey-store";

const defaultJourney = (contract: OpportunityContract): JourneyState => ({
  storageVersion: "1.0.0",
  contractId: contract.contractId,
  contractVersion: contract.version,
  scope: "national",
  assetMode: "unlicensed_match_footage",
  selectedBrandId: "rexona",
  sprint: null,
  selectedVariantId: null,
  decisions: [],
  outcome: null,
});

export function ScopeControl({
  contract,
  evaluatedAt,
}: {
  contract: OpportunityContract;
  evaluatedAt: string;
}) {
  const guide = useGuide();
  const [journey, setJourney] = useState<JourneyState>(() => defaultJourney(contract));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = new LocalJourneyStore(window.localStorage).load();
    queueMicrotask(() => {
      if (stored?.contractId === contract.contractId) setJourney(stored);
      setReady(true);
    });
  }, [contract.contractId]);

  const resolution = useMemo(
    () =>
      resolvePortfolio({
        candidates: createHeroPortfolioCandidates(contract, journey.scope, journey.assetMode),
        opportunity: contract.opportunity,
        scope: journey.scope,
        assetMode: journey.assetMode,
        evaluatedAt,
      }),
    [contract, evaluatedAt, journey.assetMode, journey.scope],
  );
  const selected = resolution.candidates.find(({ brandId }) => brandId === resolution.selectedBrandId)!;

  function applySelection(scope: PortfolioScope, assetMode: AssetMode) {
    const nextResolution = resolvePortfolio({
      candidates: createHeroPortfolioCandidates(contract, scope, assetMode),
      opportunity: contract.opportunity,
      scope,
      assetMode,
      evaluatedAt,
    });
    const nextSelected = nextResolution.candidates.find(
      ({ brandId }) => brandId === nextResolution.selectedBrandId,
    )!;
    const contractStore = new LocalContractStore(window.localStorage);
    const current = contractStore.load();
    const latestVersion = Math.max(
      contract.version,
      ...(current?.contractVersions
        .filter(({ contractId }) => contractId === contract.contractId)
        .map(({ version }) => version) ?? []),
    );
    const nextVersion = latestVersion + 1;
    const nextContract: OpportunityContract = {
      ...contract,
      version: nextVersion,
      selectedBrandId: nextSelected.brandId,
      brandAssessments: nextResolution.candidates.map((candidate) => ({
        brandId: candidate.brandId,
        proof: candidate.proof,
        permission: candidate.permission,
        preparedness: candidate.preparedness,
        readiness: candidate.readiness,
        portfolioConflicts: candidate.portfolioConflicts,
      })),
      recommendedRoute: nextSelected.decision.route,
      routeReasonCodes: nextSelected.decision.reasonCodes,
      assumptions: [
        ...contract.assumptions.filter(
          ({ label }) => !["Portfolio scope", "Asset mode"].includes(label),
        ),
        { label: "Portfolio scope", value: scope, evidenceType: "business_assumption" },
        { label: "Asset mode", value: assetMode, evidenceType: "business_assumption" },
      ],
    };
    contractStore.appendContractVersion(nextContract);
    const nextJourney = {
      ...journey,
      contractVersion: nextVersion,
      scope,
      assetMode,
      selectedBrandId: nextSelected.brandId,
      sprint: null,
      selectedVariantId: null,
      decisions: [],
      outcome: null,
    };
    new LocalJourneyStore(window.localStorage).save(nextJourney);
    setJourney(nextJourney);

    if (scope === "four_city" && journey.scope !== "four_city") guide.completeAction("scope-four-city");
    if (assetMode === "rights_safe_creator" && journey.assetMode !== "rights_safe_creator") {
      guide.completeAction("asset-creator");
    }
  }

  const blocked = selected.blockers.length > 0;
  const canContinue = selected.decision.route === "test";

  return (
    <div className="journey-grid">
      <div className="stack">
        <section className="decision-surface">
          <div className="decision-surface-head">
            <div>
              <p>Portfolio Resolver · contract v{journey.contractVersion}</p>
              <h2>Who can responsibly own this?</h2>
            </div>
            <RouteBadge route={selected.decision.route} />
          </div>
          <div className="decision-surface-body">
            <div className="brand-rank">
              {resolution.candidates.map((candidate) => (
                <article
                  className={`brand-row${candidate.brandId === resolution.selectedBrandId ? " is-selected" : ""}`}
                  key={candidate.brandId}
                >
                  <div>
                    <strong>{candidate.displayName}</strong>
                    <span className="muted small" style={{ display: "block" }}>
                      {candidate.brandId === resolution.selectedBrandId
                        ? "Recommended owner"
                        : "Candidate"}
                    </span>
                    {candidate.portfolioConflicts.map((conflict) => (
                      <span className="conflict" key={conflict}>
                        {conflict}
                      </span>
                    ))}
                  </div>
                  <div className="gate-stack">
                    <ScoreBar label="Proof" score={candidate.proof.score} />
                    <ScoreBar label="Permission" score={candidate.permission.score} />
                    <ScoreBar label="Preparedness" score={candidate.preparedness.score} />
                  </div>
                  <span className="readiness-value">
                    {candidate.readiness}
                    <small>Readiness</small>
                  </span>
                </article>
              ))}
            </div>

            <p className="muted small" style={{ marginTop: "var(--s4)" }} aria-live="polite">
              {ready ? `Saved locally · contract v${journey.contractVersion}` : "Restoring saved decision…"}
            </p>
          </div>
        </section>

        {canContinue ? (
          <NextActionLink
            cta="Design the Causal Sprint"
            detail="Budget, metric, window and decision rules are fixed before exposure."
            href={`/sprint/${contract.opportunity.id}`}
            label="The bounded test is ready to pre-register"
          />
        ) : (
          <div className="next-action">
            <div>
              <strong>Resolve stock and rights to continue</strong>
              <span>A mandatory blocker outranks every score, however high.</span>
            </div>
            <span className="btn btn-secondary" aria-disabled="true">
              Design the Causal Sprint
            </span>
          </div>
        )}
      </div>

      <div className="stack">
        <section className="surface surface-pad" aria-labelledby="controls-title">
          <div className="section-head">
            <div>
              <p className="section-kicker">Decision controls</p>
              <h2 id="controls-title" style={{ fontSize: 17 }}>
                Change what can be executed
              </h2>
            </div>
          </div>

          <fieldset className="control-group">
            <legend>Market scope</legend>
            <div className="segmented">
              <button
                aria-pressed={journey.scope === "national"}
                onClick={() => applySelection("national", journey.assetMode)}
                type="button"
              >
                National
              </button>
              <button
                aria-pressed={journey.scope === "four_city"}
                data-guide-anchor="scope-four-city"
                onClick={() => applySelection("four_city", journey.assetMode)}
                type="button"
              >
                Four in-stock cities
              </button>
            </div>
          </fieldset>

          <fieldset className="control-group" style={{ marginTop: "var(--s4)" }}>
            <legend>Creative rights</legend>
            <div className="segmented">
              <button
                aria-pressed={journey.assetMode === "unlicensed_match_footage"}
                onClick={() => applySelection(journey.scope, "unlicensed_match_footage")}
                type="button"
              >
                Match footage
              </button>
              <button
                aria-pressed={journey.assetMode === "rights_safe_creator"}
                data-guide-anchor="asset-creator"
                onClick={() => applySelection(journey.scope, "rights_safe_creator")}
                type="button"
              >
                Rights-safe creator
              </button>
            </div>
          </fieldset>

          <div style={{ marginTop: "var(--s4)" }} aria-live="polite">
            {blocked ? (
              <div className="blocker-alert">
                <ShieldAlert aria-hidden="true" size={18} />
                <div>
                  <strong>Action constrained</strong>
                  <span className="rule-id">{selected.blockers[0].code}</span>
                  <p>{selected.blockers[0].remediation ?? selected.blockers[0].message}</p>
                </div>
              </div>
            ) : (
              <div className="ready-alert">
                <Check aria-hidden="true" size={18} />
                <div>
                  <strong>Bounded test ready</strong>
                  <p>Four-city stock, creator rights and measurement checks all pass.</p>
                </div>
              </div>
            )}
          </div>

          <p className="muted small" style={{ marginTop: "var(--s3)" }}>
            {journey.scope === "national" ? "National execution" : "Four-city execution"} ·{" "}
            {journey.assetMode === "unlicensed_match_footage" ? "match footage" : "creator-led content"}
          </p>
        </section>

        <details className="detail-disclosure">
          <summary>Why this route — reason codes</summary>
          <div className="detail-body">
            <p className="mono muted small">{selected.decision.reasonCodes.join(" · ")}</p>
            <p className="muted small" style={{ marginTop: "var(--s2)" }}>
              Readiness is the weakest of the three gates. Ruleset{" "}
              <span className="mono">{resolution.rulesetVersion}</span>.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
