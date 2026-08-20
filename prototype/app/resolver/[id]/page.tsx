import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ScopeControl } from "@/components/portfolio/scope-control";
import { SystemState } from "@/components/governance/system-state";
import { PLAYABLE_OPPORTUNITY_IDS, isPlayableOpportunity } from "@/lib/demo/journey";
import { findOpportunityContract, loadFixtureBundle } from "@/lib/fixtures";

export function generateStaticParams() {
  return PLAYABLE_OPPORTUNITY_IDS.map((id) => ({ id }));
}

export default async function ResolverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = findOpportunityContract(id);

  if (!contract || !isPlayableOpportunity(id)) {
    return (
      <div className="shell-frame">
        <SystemState
          title="Ownership detail is not available for this signal"
          detail="Two use cases carry the full set of scope and rights controls. The rest are readable as decisions but are not set up to be re-resolved."
        />
      </div>
    );
  }

  return (
    <div className="shell-frame">
      <Link className="back-link" href={`/opportunities/${id}`}>
        <ArrowLeft aria-hidden="true" size={15} /> Decision record
      </Link>
      <ScopeControl contract={contract} evaluatedAt={loadFixtureBundle().generatedAt} />
    </div>
  );
}
