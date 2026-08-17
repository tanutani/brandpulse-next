import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ReviewWorkspace } from "@/components/governance/review-workspace";
import { SystemState } from "@/components/governance/system-state";
import { HERO_OPPORTUNITY_ID } from "@/lib/demo/journey";
import { findOpportunityContract } from "@/lib/fixtures";

export function generateStaticParams() {
  return [{ id: HERO_OPPORTUNITY_ID }];
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = findOpportunityContract(id);

  if (!contract || id !== HERO_OPPORTUNITY_ID) {
    return (
      <div className="shell-frame">
        <SystemState
          title="Review unavailable"
          detail="The governed activation package exists only for the hero journey."
        />
      </div>
    );
  }

  return (
    <div className="shell-frame">
      <Link className="back-link" href={`/sprint/${id}`}>
        <ArrowLeft aria-hidden="true" size={15} /> Causal Sprint
      </Link>
      <ReviewWorkspace contract={contract} />
    </div>
  );
}
