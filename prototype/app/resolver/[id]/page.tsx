import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ScopeControl } from "@/components/portfolio/scope-control";
import { SystemState } from "@/components/governance/system-state";
import { DecisionBrief } from "@/components/model/decision-brief";
import { GuidedJourney } from "@/components/shell/guided-journey";
import { findOpportunityContract, loadFixtureBundle } from "@/lib/fixtures";

export function generateStaticParams() {
  return [{ id: "opp-extra-time-sweat-confidence" }];
}

export default async function ResolverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = findOpportunityContract(id);
  if (!contract || id !== "opp-extra-time-sweat-confidence") {
    return <main className="page-main page-frame"><SystemState title="Portfolio detail is unavailable" detail="The full governed journey is intentionally bounded to the hero opportunity." /></main>;
  }
  return (
    <main className="page-main page-frame">
      <Link className="back-link" href={`/opportunities/${id}`}><ArrowLeft aria-hidden="true" size={16} /> Opportunity Contract</Link>
      <GuidedJourney activeStep="choose" />
      <header className="flow-heading"><p className="eyebrow">Choose brand and scope</p><h1>Brand fit is not enough. The plan must also be executable.</h1><p>Compare Rexona, Dove, and Axe, then change geography and creative rights to create a safe Test.</p></header>
      <DecisionBrief
        deciding="Which brand should own the moment, and where can it act safely?"
        considered="Brand meaning, audience fit, portfolio conflict, stock, channel coverage, creator readiness, and rights."
        changed="The default national plan uses unavailable match footage, so the model starts at Watch."
        continuation="A Test unlocks only after you select four in-stock cities and rights-safe creator content."
      />
      <ScopeControl contract={contract} evaluatedAt={loadFixtureBundle().generatedAt} />
    </main>
  );
}
