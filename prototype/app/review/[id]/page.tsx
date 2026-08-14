import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ReviewWorkspace } from "@/components/governance/review-workspace";
import { SystemState } from "@/components/governance/system-state";
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
      <header className="flow-heading"><p className="eyebrow">Step 4 of 4 · Govern and learn</p><h1>Block the unsafe asset. Approve the correction. Learn against the rule.</h1><p>Every policy result, human action, contract version, and synthetic outcome remains inspectable.</p></header>
      <ReviewWorkspace contract={contract} />
    </main>
  );
}
