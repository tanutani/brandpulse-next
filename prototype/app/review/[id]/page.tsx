import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ReviewWorkspace } from "@/components/governance/review-workspace";
import { SystemState } from "@/components/governance/system-state";
import { DecisionBrief } from "@/components/model/decision-brief";
import { GuidedJourney } from "@/components/shell/guided-journey";
import { findOpportunityContract } from "@/lib/fixtures";

export function generateStaticParams() { return [{ id: "opp-extra-time-sweat-confidence" }]; }

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = findOpportunityContract(id);
  if (!contract || id !== "opp-extra-time-sweat-confidence") {
    return <main className="page-main page-frame"><SystemState title="Review unavailable" detail="The governed activation package exists only for the hero journey." /></main>;
  }
  return (
    <main className="page-main page-frame">
      <Link className="back-link" href={`/sprint/${id}`}><ArrowLeft aria-hidden="true" size={16} /> Causal Sprint</Link>
      <GuidedJourney activeStep="approve" />
      <header className="flow-heading"><p className="eyebrow">Approve and learn</p><h1>Block unsafe work. Approve the correction. Retain what happened.</h1><p>Every policy result, human action, contract version, and synthetic outcome remains inspectable.</p></header>
      <DecisionBrief
        deciding="Can the current creative package be approved for the locked test?"
        considered="Match-footage rights, claims, disclosure, inclusion, expiry, and current-version human approval."
        changed="The first variant fails RIGHTS-001; selecting original creator content creates a reviewable correction."
        continuation="Only a passing current version can receive approval and reveal the synthetic result."
      />
      <ReviewWorkspace contract={contract} />
    </main>
  );
}
