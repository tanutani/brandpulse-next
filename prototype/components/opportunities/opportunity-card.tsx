import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { RouteBadge } from "@/components/gates/route-badge";
import type { Route } from "@/lib/contracts";

interface OpportunityCardProps {
  id: string;
  title: string;
  hypothesis: string;
  signalClass: string;
  usefulWindow: string;
  evidenceCount: number;
  weakestGate: string;
  route: Route;
  tone: "hero" | "durable" | "noise";
}

export function OpportunityCard(props: OpportunityCardProps) {
  return (
    <Link className={`opportunity-card ${props.tone}-card`} href={`/opportunities/${props.id}`}>
      <div className="card-topline"><span>{props.signalClass}</span><span>{props.usefulWindow}</span></div>
      <h2>{props.title}</h2>
      <p className="card-hypothesis">{props.hypothesis}</p>
      <div className="card-metrics">
        <div className="metric-cell"><span>Evidence</span><strong>{props.evidenceCount} items</strong></div>
        <div className="metric-cell"><span>Weakest link</span><strong>{props.weakestGate}</strong></div>
      </div>
      <div className="card-footer">
        <RouteBadge route={props.route} />
        <span className="open-label">Open contract <ArrowUpRight aria-hidden="true" size={15} /></span>
      </div>
    </Link>
  );
}
