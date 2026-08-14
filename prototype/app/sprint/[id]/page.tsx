import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { SystemState } from "@/components/governance/system-state";
import { SprintStudio } from "@/components/sprint/sprint-studio";
import { findOpportunityContract } from "@/lib/fixtures";

export function generateStaticParams() { return [{ id: "opp-extra-time-sweat-confidence" }]; }

export default async function SprintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = findOpportunityContract(id);
  if (!contract || id !== "opp-extra-time-sweat-confidence") {
    return <main className="page-main page-frame"><SystemState title="Sprint unavailable" detail="Only the hero Test route has a pre-registered Causal Sprint in this bounded prototype." /></main>;
  }
  return (
    <main className="page-main page-frame">
      <Link className="back-link" href={`/resolver/${id}`}><ArrowLeft aria-hidden="true" size={16} /> Portfolio Resolver</Link>
      <header className="flow-heading"><p className="eyebrow">Step 3 of 4 · Pre-register</p><h1>Uncertainty becomes a disciplined learning action.</h1><p>The metric, cells, window, budget, and decision rules are fixed before any simulated result is available.</p></header>
      <SprintStudio contract={contract} />
    </main>
  );
}
