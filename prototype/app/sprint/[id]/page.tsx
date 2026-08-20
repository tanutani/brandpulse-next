import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { SystemState } from "@/components/governance/system-state";
import { SprintStudio } from "@/components/sprint/sprint-studio";
import { HERO_OPPORTUNITY_ID } from "@/lib/demo/journey";
import { findOpportunityContract } from "@/lib/fixtures";

export function generateStaticParams() {
  return [{ id: HERO_OPPORTUNITY_ID }];
}

export default async function SprintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = findOpportunityContract(id);

  if (!contract || id !== HERO_OPPORTUNITY_ID) {
    return (
      <div className="shell-frame">
        <SystemState
          title="Sprint unavailable"
          detail="Only the Rexona Test route has a pre-registered bounded test in this prototype."
        />
      </div>
    );
  }

  return (
    <div className="shell-frame">
      <Link className="back-link" href={`/resolver/${id}`}>
        <ArrowLeft aria-hidden="true" size={15} /> Ownership view
      </Link>
      <SprintStudio contract={contract} />
    </div>
  );
}
