import { ArrowLeft, ArrowRight, ExternalLink, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { ProvenanceBadge } from "@/components/evidence/provenance-badge";
import { AssumptionControl } from "@/components/gates/assumption-control";
import { RouteBadge } from "@/components/gates/route-badge";
import { ScoreBar } from "@/components/gates/score-bar";
import { SystemState } from "@/components/governance/system-state";
import { DecisionBrief } from "@/components/model/decision-brief";
import { GuidedJourney } from "@/components/shell/guided-journey";
import { getFallbackSynthesis } from "@/lib/agents/fallback";
import { findOpportunityContract, loadFixtureBundle } from "@/lib/fixtures";

export function generateStaticParams() {
  return loadFixtureBundle().contracts.map(({ opportunity }) => ({ id: opportunity.id }));
}

export default async function OpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = findOpportunityContract(id);

  if (!contract) {
    return (
      <main className="page-main page-frame">
        <SystemState
          title="This bundled contract is unavailable"
          detail="Return to the Pulse Board and choose one of the three validated demo opportunities. No network request is required."
        />
      </main>
    );
  }

  const synthesis = getFallbackSynthesis(id);
  const assessment = contract.brandAssessments.find(
    ({ brandId }) => brandId === contract.selectedBrandId,
  ) ?? contract.brandAssessments[0];
  const isHero = id === "opp-extra-time-sweat-confidence";

  return (
    <main className="contract-page page-frame">
      <Link className="back-link" href="/opportunities"><ArrowLeft aria-hidden="true" size={16} /> Pulse Board</Link>
      {isHero ? <GuidedJourney activeStep="understand" /> : null}
      <header className="contract-hero">
        <div>
          <p className="eyebrow">Opportunity Contract · v{contract.version}</p>
          <h1>{contract.opportunity.title}</h1>
          <p className="contract-hypothesis">{contract.opportunity.hypothesis}</p>
        </div>
        <div className="contract-route">
          <span>Recommended route</span>
          <RouteBadge route={contract.recommendedRoute} />
          <small>{isHero ? "46h useful window" : contract.opportunity.signalClass.replaceAll("_", " ")}</small>
        </div>
      </header>

      {isHero ? (
        <DecisionBrief
          deciding="Is this sports moment credible enough to deserve brand time?"
          considered="Dated search, weather, news, synthetic consumer and commerce evidence, plus a counter-explanation."
          changed="Scattered observations now sit in one evidence chain with an explicit source-concentration penalty."
          continuation="The signal is strong enough to compare brand ownership, but it is not permission to publish."
        />
      ) : null}

      <section className="contract-grid">
        <div className="evidence-column">
          <div className="section-heading"><div><p className="eyebrow">Evidence chain</p><h2>Support before recommendation</h2></div><span>{contract.opportunity.evidence.length} records</span></div>
          <div className="evidence-list">
            {contract.opportunity.evidence.map((evidence) => (
              <article className={`evidence-row evidence-${evidence.stance}`} key={evidence.id}>
                <div className="evidence-row-top">
                  <ProvenanceBadge type={evidence.evidenceType} />
                  <span>{evidence.freshness}</span>
                </div>
                <p>{evidence.claim}</p>
                {evidence.sourceUrl ? (
                  <a href={evidence.sourceUrl} target="_blank" rel="noreferrer">
                    Inspect public source <ExternalLink aria-hidden="true" size={12} />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <aside className="skeptic-panel">
          <ShieldAlert aria-hidden="true" size={24} />
          <p className="eyebrow">Skeptic · Model inference</p>
          <h2>What could make this wrong?</h2>
          <p>{synthesis.strongestCounterEvidence[0]}</p>
          <div className="skeptic-alt"><span>Alternative explanation</span>{synthesis.skeptic.alternativeExplanation}</div>
          <ProvenanceBadge type="model_inference" />
        </aside>
      </section>

      {isHero ? (
        <AssumptionControl contract={contract} evaluatedAt={loadFixtureBundle().generatedAt} />
      ) : (
        <section className="decision-panel">
          <div className="decision-panel-heading"><div><p className="eyebrow">Deterministic decision</p><h2>The weakest gate determines the route.</h2></div><RouteBadge route={contract.recommendedRoute} /></div>
          <div className="score-stack">
            <ScoreBar label="Proof" score={assessment.proof.score} />
            <ScoreBar label="Permission" score={assessment.permission.score} />
            <ScoreBar label="Preparedness" score={assessment.preparedness.score} />
          </div>
        </section>
      )}

      <section className="proof-explainer">
        <div><p className="eyebrow">Proof calculation</p><h2>Every point has an input.</h2><p>Weighted evidence components, minus explicit manipulation and source-concentration penalties.</p></div>
        <div className="component-grid">
          {assessment.proof.components.map((component) => (
            <div className="component-cell" key={component.name}>
              <span>{component.name.replaceAll(/([A-Z])/g, " $1")}</span>
              <strong>{component.value}</strong>
              <small>{Math.round(component.weight * 100)}% weight</small>
            </div>
          ))}
        </div>
      </section>
      {isHero ? (
        <div className="journey-next">
          <div><p className="eyebrow">Step 1 complete</p><strong>Now decide which brand can responsibly own the opportunity.</strong></div>
          <Link className="primary-action" href={`/resolver/${id}`}>Resolve portfolio ownership <ArrowRight aria-hidden="true" size={17} /></Link>
        </div>
      ) : null}
    </main>
  );
}
