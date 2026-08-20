import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ReviewWorkspace } from "@/components/governance/review-workspace";
import { SystemState } from "@/components/governance/system-state";
import { PLAYABLE_OPPORTUNITY_IDS } from "@/lib/demo/journey";
import { findOpportunityContract } from "@/lib/fixtures";

export function generateStaticParams() {
  return PLAYABLE_OPPORTUNITY_IDS.map((id) => ({ id }));
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = findOpportunityContract(id);

  if (!contract || !PLAYABLE_OPPORTUNITY_IDS.includes(id)) {
    return (
      <div className="shell-frame">
        <SystemState
          title="Review unavailable"
          detail="A governed activation package exists only for the two playable decisions."
        />
      </div>
    );
  }

  return (
    <div className="shell-frame">
      <Link className="back-link" href={contract.recommendedRoute === "act_now" ? `/resolver/${id}` : `/sprint/${id}`}>
        <ArrowLeft aria-hidden="true" size={15} /> {contract.recommendedRoute === "act_now" ? "Ownership view" : "Bounded test"}
      </Link>
      <ReviewWorkspace contract={contract} />
    </div>
  );
}
