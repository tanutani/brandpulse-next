import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { loadFixtureBundle } from "@/lib/fixtures";
import { getWeakestGate } from "@/lib/routing/select-route";

const TONES = ["hero", "durable", "noise"] as const;

export default function OpportunitiesPage() {
  const contracts = loadFixtureBundle().contracts;

  return (
    <main className="page-main page-frame">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Pulse Board · Three different decisions</p>
          <h1>Do not chase the feed.</h1>
        </div>
        <p>
          Each card is a replayable decision contract. Open the live moment first, then compare it
          with a durable shift and a concentrated spike the router rejects.
        </p>
      </header>
      <section className="card-grid" aria-label="Opportunity contracts">
        {contracts.map((contract, index) => {
          const assessment = contract.brandAssessments.find(
            ({ brandId }) => brandId === contract.selectedBrandId,
          ) ?? contract.brandAssessments[0];
          const weakest = getWeakestGate(
            assessment.proof,
            assessment.permission,
            assessment.preparedness,
          );

          return (
            <OpportunityCard
              key={contract.contractId}
              id={contract.opportunity.id}
              title={contract.opportunity.title}
              hypothesis={contract.opportunity.hypothesis}
              signalClass={contract.opportunity.signalClass.replaceAll("_", " ")}
              usefulWindow={index === 0 ? "46h window" : index === 1 ? "Strategic" : "24h window"}
              evidenceCount={contract.opportunity.evidence.length}
              weakestGate={`${weakest.gate} · ${weakest.score}`}
              route={contract.recommendedRoute}
              tone={TONES[index]}
            />
          );
        })}
      </section>
    </main>
  );
}
