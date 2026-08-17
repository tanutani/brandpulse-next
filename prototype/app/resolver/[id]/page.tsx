import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ScopeControl } from "@/components/portfolio/scope-control";
import { SystemState } from "@/components/governance/system-state";
import { HERO_OPPORTUNITY_ID } from "@/lib/demo/journey";
import { findOpportunityContract, loadFixtureBundle } from "@/lib/fixtures";

export function generateStaticParams() {
  return [{ id: HERO_OPPORTUNITY_ID }];
}

export default async function ResolverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = findOpportunityContract(id);

  if (!contract || id !== HERO_OPPORTUNITY_ID) {
    return (
      <div className="shell-frame">
        <SystemState
          title="Portfolio detail is unavailable"
          detail="The full governed journey is intentionally bounded to the hero opportunity."
        />
      </div>
    );
  }

  return (
    <div className="shell-frame">
      <Link className="back-link" href={`/opportunities/${id}`}>
        <ArrowLeft aria-hidden="true" size={15} /> Opportunity Contract
      </Link>
      <ScopeControl contract={contract} evaluatedAt={loadFixtureBundle().generatedAt} />
    </div>
  );
}
