import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { SystemState } from "@/components/governance/system-state";
import { DecisionBrief } from "@/components/model/decision-brief";
import { GuidedJourney } from "@/components/shell/guided-journey";
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
      <GuidedJourney activeStep="test" />
      <header className="flow-heading"><p className="eyebrow">Lock the experiment</p><h1>Turn uncertainty into a test—not a national campaign.</h1><p>Fix the metric, cities, window, budget, and decision rules before any synthetic result becomes available.</p></header>
      <DecisionBrief
        deciding="What is the smallest experiment that can prove whether the opportunity converts?"
        considered="Treatment and comparison cities, stock, q-commerce conversion, budget, comparability, and service level."
        changed="The proposed activation is now a ₹5 lakh, four-city causal test with fixed success and kill rules."
        continuation="A valid design can continue only after every rule is locked before the result."
      />
      <SprintStudio contract={contract} />
    </main>
  );
}
