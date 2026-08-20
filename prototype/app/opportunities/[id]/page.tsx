import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

import { ProvenanceBadge } from "@/components/evidence/provenance-badge";
import { AskWhy } from "@/components/gates/ask-why";
import { AssumptionControl } from "@/components/gates/assumption-control";
import { RouteBadge } from "@/components/gates/route-badge";
import { ScoreBar } from "@/components/gates/score-bar";
import { NextActionLink } from "@/components/shell/next-action-link";
import { buildFallbackSynthesis } from "@/lib/agents/fallback";
import brandMemory from "@/public/data/brand-memory.json";
import { MemoryYieldPanel } from "@/components/metrics/memory-yield-panel";
import { ShareOfSearchPanel } from "@/components/metrics/share-of-search-panel";
import { HERO_OPPORTUNITY_ID, isPlayableOpportunity } from "@/lib/demo/journey";
import { findOpportunityContract, loadFixtureBundle } from "@/lib/fixtures";
import { createHeroPortfolioCandidates } from "@/lib/portfolio/hero-portfolio";
import { getWeakestGate } from "@/lib/routing/select-route";
import { ROUTE_THRESHOLDS } from "@/lib/scoring/config";

export function generateStaticParams() {
  return loadFixtureBundle().contracts.map(({ opportunity }) => ({ id: opportunity.id }));
}

export default async function OpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = findOpportunityContract(id);

  if (!contract) {
    return (
      <div className="shell-frame">
        <section className="system-state" style={{ marginTop: "var(--s6)" }}>
          <h2>This bundled contract is unavailable</h2>
          <p>
            Return to the Pulse Room and choose one of the validated demo opportunities. No network
            request is required.
          </p>
          <Link className="btn btn-primary" href="/opportunities">
            Back to Pulse Room
          </Link>
        </section>
      </div>
    );
  }

  const synthesis = buildFallbackSynthesis(id, "disabled");
  const assessment =
    contract.brandAssessments.find(({ brandId }) => brandId === contract.selectedBrandId) ??
    contract.brandAssessments[0];
  const weakest = getWeakestGate(assessment.proof, assessment.permission, assessment.preparedness);
  const isHero = id === HERO_OPPORTUNITY_ID;
  const isKwil = contract.portfolioContext === "kwil_ecosystem";
  const isPhClaimsCase = id === "opp-ph-cleanser-discourse";

  // The blockers that apply at national scope with match footage, for "Ask why?".
  const nationalBlockers = isHero
    ? createHeroPortfolioCandidates(contract, "national", "unlicensed_match_footage")
        .find(({ brandId }) => brandId === "rexona")!
        .preparedness.blockers.map((blocker) => ({
          code: blocker.code,
          detail: blocker.message,
          remediation: blocker.remediation,
        }))
    : [];

  // Brand memory is a global configuration, so every brand it covers counts as
  // a brand whose claims the organisation already knows.
  const knownClaimBrandIds = brandMemory.brands.map(({ id }) => id);

  const support = contract.opportunity.evidence.filter(({ stance }) => stance !== "contradict");
  const against = contract.opportunity.evidence.filter(({ stance }) => stance === "contradict");

  return (
    <div className="shell-frame">
      <Link className="back-link" href="/opportunities">
        <ArrowLeft aria-hidden="true" size={15} /> Pulse Room
      </Link>

      <div className="journey-grid">
        <div className="stack">
          <section className="decision-surface">
            <div className="decision-surface-head">
              <div>
                <p>
                  Decision record · v{contract.version} ·{" "}
                  {contract.opportunity.signalClass.replaceAll("_", " ")}
                </p>
                <h2>{contract.opportunity.title}</h2>
              </div>
              <RouteBadge route={contract.recommendedRoute} actionMode={contract.actionMode} />
            </div>
            <div className="decision-surface-body">
              <p className="hypothesis-line">{contract.opportunity.hypothesis}</p>

              {isKwil ? (
                <div className="context-disclosure" role="note">
                  <strong>KWIL / wider portfolio ecosystem scenario — outside current HUL ownership</strong>
                  <p>
                    The ice-cream business demerger became effective on 1 December 2025. Kwality Wall&apos;s,
                    Cornetto and Magnum are not presented here as current HUL brands.
                  </p>
                  <a href="https://www.hul.co.in/files/annual-report-2025-26.pdf" target="_blank" rel="noreferrer">
                    HUL Integrated Annual Report 2025–26 <ExternalLink aria-hidden="true" size={11} />
                  </a>
                </div>
              ) : null}

              {isPhClaimsCase ? (
                <div className="blocker-alert" role="note">
                  <div>
                    <strong>Incubate — blocked on claims</strong>
                    <p>Build comparative substantiation and legal-review capability before any claim-bearing activation.</p>
                  </div>
                </div>
              ) : null}

              <div style={{ marginTop: "var(--s5)" }}>
                <ScoreBar
                  label="Proof"
                  score={assessment.proof.score}
                  weakest={weakest.gate === "proof"}
                />
                <ScoreBar
                  label="Permission"
                  score={assessment.permission.score}
                  weakest={weakest.gate === "permission"}
                />
                <ScoreBar
                  label="Preparedness"
                  score={assessment.preparedness.score}
                  weakest={weakest.gate === "preparedness"}
                />
              </div>

              <p className="muted small" style={{ marginTop: "var(--s3)" }}>
                Readiness = min({assessment.proof.score}, {assessment.permission.score},{" "}
                {assessment.preparedness.score}) = <strong>{assessment.readiness}</strong>
              </p>

              {isHero && synthesis ? (
                <div style={{ marginTop: "var(--s5)" }}>
                  <AskWhy
                    actProofThreshold={ROUTE_THRESHOLDS.actNow.proof}
                    nationalBlockers={nationalBlockers}
                    opportunityId={id}
                    permission={assessment.permission.score}
                    preparedness={assessment.preparedness.score}
                    proof={assessment.proof.score}
                    readiness={assessment.readiness}
                    reasonCodes={contract.routeReasonCodes}
                    route={contract.recommendedRoute}
                    synthesis={synthesis}
                    weakestGate={weakest.gate}
                  />
                </div>
              ) : null}
            </div>
          </section>

          {isPlayableOpportunity(id) ? (
            <NextActionLink
              detail={`${contract.brandAssessments
                .map(({ brandId }) => brandId)
                .join(", ")} are scored against the same evidence.`}
              href={`/resolver/${id}`}
              label="Decide which brand can responsibly own this"
              cta="Open the ownership view"
            />
          ) : null}

          {isHero ? (
            <AssumptionControl contract={contract} evaluatedAt={loadFixtureBundle().generatedAt} />
          ) : null}

          <MemoryYieldPanel contract={contract} knownClaimBrandIds={knownClaimBrandIds} />

          {isHero ? <ShareOfSearchPanel category="deodorants" /> : null}
        </div>

        <div className="stack">
          {synthesis ? (
            <div className="inference-surface">
              <ProvenanceBadge type="model_inference" />
              <h3 style={{ marginTop: 6 }}>What could make this wrong?</h3>
              <p style={{ marginTop: 4 }}>{synthesis.counterHypothesis.claim}</p>
              <span className="mono muted" style={{ fontSize: 10.5 }}>
                {synthesis.counterHypothesis.evidenceIds.join(" · ")}
              </span>
            </div>
          ) : null}

          <section className="surface surface-pad" aria-labelledby="evidence-title">
            <div className="section-head">
              <div>
                <p className="section-kicker">Evidence chain</p>
                <h2 id="evidence-title" style={{ fontSize: 17 }}>
                  Support before recommendation
                </h2>
              </div>
              <span className="muted small">{contract.opportunity.evidence.length} records</span>
            </div>

            <div className="scroll-panel" style={{ display: "grid", gap: "var(--s2)" }}>
              {[...support, ...against].map((evidence) => (
                <article
                  className={`evidence-card evidence-${evidence.evidenceType} stance-${evidence.stance}`}
                  key={evidence.id}
                >
                  <div className="evidence-card-top">
                    <ProvenanceBadge type={evidence.evidenceType} />
                    <span className="evidence-stance">
                      {evidence.stance} · {evidence.freshness}
                    </span>
                  </div>
                  <p>{evidence.claim}</p>
                  <span className="evidence-id">{evidence.id}</span>
                  {evidence.sourceUrl ? (
                    <a href={evidence.sourceUrl} target="_blank" rel="noreferrer">
                      Inspect public source <ExternalLink aria-hidden="true" size={11} />
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <details className="detail-disclosure">
            <summary>Proof calculation — every point has an input</summary>
            <div className="detail-body">
              <p className="muted small">
                Weighted evidence components, minus explicit manipulation and source-concentration
                penalties. Ruleset{" "}
                <span className="mono">{assessment.proof.rulesetVersion}</span>.
              </p>
              <div className="field-grid" style={{ marginTop: "var(--s3)" }}>
                {assessment.proof.components.map((component) => (
                  <div className="field" key={component.name}>
                    <span>{component.name.replaceAll(/([A-Z])/g, " $1")}</span>
                    <strong>{component.value}</strong>
                    <span className="mono muted">{Math.round(component.weight * 100)}% weight</span>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
