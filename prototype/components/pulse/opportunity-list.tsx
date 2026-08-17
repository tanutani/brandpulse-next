"use client";

import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

import { RouteBadge } from "@/components/gates/route-badge";
import { useGuide } from "@/components/guide/guide-provider";
import type { Route } from "@/lib/contracts";

export interface OpportunitySummary {
  id: string;
  title: string;
  signalClass: string;
  evidenceCount: number;
  weakestGate: string;
  route: Route;
  primary: boolean;
}

export function OpportunityList({ opportunities }: { opportunities: OpportunitySummary[] }) {
  const guide = useGuide();

  return (
    <div className="opportunity-list">
      {opportunities.map((opportunity) => (
        <Link
          className={`opportunity-row${opportunity.primary ? " is-primary" : ""}`}
          data-guide-anchor={opportunity.primary ? "open-hero" : undefined}
          href={`/opportunities/${opportunity.id}`}
          key={opportunity.id}
          onClick={() => {
            if (opportunity.primary) guide.completeAction("open-hero");
          }}
        >
          <span>
            {opportunity.primary ? (
              <span className="primary-tag">
                <Star aria-hidden="true" size={11} /> Primary journey
              </span>
            ) : null}
            <strong>{opportunity.title}</strong>
            <span className="meta">
              <span>{opportunity.signalClass}</span>
              <span>{opportunity.evidenceCount} evidence records</span>
              <span className="mono">weakest {opportunity.weakestGate}</span>
            </span>
          </span>
          <span style={{ display: "grid", gap: 6, justifyItems: "end" }}>
            <RouteBadge route={opportunity.route} />
            <span className="muted small" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              Open <ArrowRight aria-hidden="true" size={13} />
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
