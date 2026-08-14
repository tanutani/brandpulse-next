import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ScopeControl } from "@/components/portfolio/scope-control";
import { SystemState } from "@/components/governance/system-state";
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
      <header className="flow-heading"><p className="eyebrow">Step 2 of 4 · Own and prepare</p><h1>Permission without preparedness is not a green light.</h1><p>Compare the portfolio, then change geography and rights to create an executable Test.</p></header>
      <ScopeControl contract={contract} evaluatedAt={loadFixtureBundle().generatedAt} />
    </main>
  );
}
