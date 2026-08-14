"use client";

import { ArrowRight, Check, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { RouteBadge } from "@/components/gates/route-badge";
import { ScoreBar } from "@/components/gates/score-bar";
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

export function ScopeControl({ contract, evaluatedAt }: { contract: OpportunityContract; evaluatedAt: string }) {
  const [journey, setJourney] = useState<JourneyState>(() => defaultJourney(contract));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = new LocalJourneyStore(window.localStorage).load();
    queueMicrotask(() => {
      if (stored?.contractId === contract.contractId) setJourney(stored);
      setReady(true);
    });
  }, [contract.contractId]);

  const resolution = useMemo(() => resolvePortfolio({
    candidates: createHeroPortfolioCandidates(contract, journey.scope, journey.assetMode),
    opportunity: contract.opportunity,
    scope: journey.scope,
    assetMode: journey.assetMode,
    evaluatedAt,
  }), [contract, evaluatedAt, journey.assetMode, journey.scope]);
  const selected = resolution.candidates.find(({ brandId }) => brandId === resolution.selectedBrandId)!;

  function applySelection(scope: PortfolioScope, assetMode: AssetMode) {
    const nextResolution = resolvePortfolio({
      candidates: createHeroPortfolioCandidates(contract, scope, assetMode),
      opportunity: contract.opportunity,
      scope,
      assetMode,
      evaluatedAt,
    });
    const nextSelected = nextResolution.candidates.find(({ brandId }) => brandId === nextResolution.selectedBrandId)!;
    const contractStore = new LocalContractStore(window.localStorage);
    const current = contractStore.load();
    const latestVersion = Math.max(
      contract.version,
      ...(current?.contractVersions.filter(({ contractId }) => contractId === contract.contractId).map(({ version }) => version) ?? []),
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
        ...contract.assumptions.filter(({ label }) => !["Portfolio scope", "Asset mode"].includes(label)),
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
  }

  return (
    <div className="resolver-workspace">
      <section className="control-rail" aria-labelledby="scope-title">
        <div><p className="eyebrow">Decision controls</p><h2 id="scope-title">Change what the business can safely execute.</h2></div>
        <fieldset>
          <legend>Market scope</legend>
          <button aria-pressed={journey.scope === "national"} onClick={() => applySelection("national", journey.assetMode)} type="button">National</button>
          <button aria-pressed={journey.scope === "four_city"} onClick={() => applySelection("four_city", journey.assetMode)} type="button">Four in-stock cities</button>
        </fieldset>
        <fieldset>
          <legend>Creative rights</legend>
          <button aria-pressed={journey.assetMode === "unlicensed_match_footage"} onClick={() => applySelection(journey.scope, "unlicensed_match_footage")} type="button">Use match footage</button>
          <button aria-pressed={journey.assetMode === "rights_safe_creator"} onClick={() => applySelection(journey.scope, "rights_safe_creator")} type="button">Rights-safe creator</button>
        </fieldset>
        <div className={selected.blockers.length ? "control-result blocked" : "control-result ready"} aria-live="polite">
          {selected.blockers.length ? <ShieldAlert aria-hidden="true" /> : <Check aria-hidden="true" />}
          <div><strong>{selected.blockers.length ? "Action constrained" : "Bounded test ready"}</strong><span>{selected.blockers[0]?.remediation ?? "Four-city stock, creator rights, and measurement checks pass."}</span></div>
        </div>
      </section>

      <section aria-labelledby="comparison-title">
        <div className="section-heading"><div><p className="eyebrow">Portfolio Resolver</p><h2 id="comparison-title">Rexona owns the clearest permission.</h2></div><RouteBadge route={selected.decision.route} /></div>
        <div className="portfolio-grid">
          {resolution.candidates.map((candidate) => (
            <article className={`portfolio-card ${candidate.brandId === resolution.selectedBrandId ? "selected" : ""}`} key={candidate.brandId}>
              <div className="portfolio-title"><div><span>{candidate.brandId === resolution.selectedBrandId ? "Recommended owner" : "Candidate"}</span><h3>{candidate.displayName}</h3></div><strong>{candidate.readiness}</strong></div>
              <ScoreBar label="Proof" score={candidate.proof.score} />
              <ScoreBar label="Permission" score={candidate.permission.score} />
              <ScoreBar label="Preparedness" score={candidate.preparedness.score} />
              {candidate.portfolioConflicts.map((conflict) => <p className="inline-warning" key={conflict}>{conflict}</p>)}
            </article>
          ))}
        </div>
        <div className="resolver-footer">
          <p>{ready ? `Saved locally · Contract v${journey.contractVersion}` : "Restoring saved decision…"}</p>
          {selected.decision.route === "test" ? (
            <Link className="primary-action" href={`/sprint/${contract.opportunity.id}`}>Design the causal sprint <ArrowRight aria-hidden="true" size={17} /></Link>
          ) : <span className="disabled-action">Resolve stock and rights to continue</span>}
        </div>
      </section>
    </div>
  );
}
