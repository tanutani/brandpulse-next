import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import { ProvenanceBadge } from "@/components/evidence/provenance-badge";
import {
  SHARE_OF_SEARCH_METHOD,
  computeShareOfSearch,
  type ShareDirection,
} from "@/lib/metrics/share-of-search";
import { getCitation } from "@/lib/model/parameter-catalogue";

/**
 * Share of search as a leading indicator, sitting beside the gates rather than
 * inside them.
 *
 * The discipline this panel has to keep: report the measured share and the
 * published basis, and stop. Binet's result is a population-level correlation
 * across categories, not a forecast about any brand here, so nothing on screen
 * may read as "therefore this brand will gain share".
 */

const DIRECTION_ICON: Record<ShareDirection, React.ReactNode> = {
  rising: <ArrowUpRight aria-hidden="true" size={14} />,
  flat: <ArrowRight aria-hidden="true" size={14} />,
  falling: <ArrowDownRight aria-hidden="true" size={14} />,
};

const BRAND_LABELS: Record<string, string> = {
  rexona: "Rexona",
  axe: "Axe",
  "other-category": "Rest of category",
};

export function ShareOfSearchPanel({ category }: { category: string }) {
  const result = computeShareOfSearch(category);
  if (!result) return null;

  const citation = getCitation(SHARE_OF_SEARCH_METHOD.citationId);
  const [leadLow, leadHigh] = SHARE_OF_SEARCH_METHOD.leadTimeMonths;

  return (
    <section className="surface surface-pad" aria-labelledby="sos-title">
      <div className="section-head">
        <div>
          <p className="section-kicker">Leading indicator · not a gate</p>
          <h2 id="sos-title" style={{ fontSize: 17 }}>
            Share of search
          </h2>
        </div>
        {result.synthetic ? <ProvenanceBadge type="synthetic_internal" /> : null}
      </div>

      <p className="muted small">
        Share of branded search within {result.category} in {result.geography}, by week. This does
        not feed Proof, Permission or Preparedness — it runs on a different clock from a decision
        about right now.
      </p>

      <ul className="sos-list">
        {result.readings.map((reading) => (
          <li className={`sos-row is-${reading.direction}`} key={reading.brandId}>
            <span className="sos-brand">{BRAND_LABELS[reading.brandId] ?? reading.brandId}</span>
            <span className="sos-bar" aria-hidden="true">
              <span style={{ width: `${reading.latestSharePct}%` }} />
            </span>
            <span className="sos-value">
              {reading.latestSharePct.toFixed(1)}%
              <small>
                {DIRECTION_ICON[reading.direction]}{" "}
                {reading.direction === "flat"
                  ? "flat"
                  : `${reading.deltaPp > 0 ? "+" : ""}${reading.deltaPp.toFixed(1)}pp`}
              </small>
            </span>
          </li>
        ))}
      </ul>

      <p className="muted small" style={{ marginTop: "var(--s3)" }}>
        Change compares the last four weeks with the four before them. Movement smaller than{" "}
        {SHARE_OF_SEARCH_METHOD.flatBandPp}pp is reported as flat rather than as a trend.
      </p>

      <details className="detail-disclosure" style={{ marginTop: "var(--s4)" }}>
        <summary>What this measure does and does not claim</summary>
        <div className="detail-body">
          <p className="small">
            The published finding is that share of search moves with market share and tends to lead
            it by roughly {leadLow} to {leadHigh} months, varying by category. That lead time is a
            property of the research across many brands. It is <strong>not</strong> a prediction
            that any brand on this screen will gain or lose share, and nothing here should be read
            as one.
          </p>
          {citation ? (
            <p className="citation-apa" style={{ marginTop: "var(--s3)" }}>
              {citation.apa}
            </p>
          ) : null}
          <p className="small muted" style={{ marginTop: "var(--s3)" }}>
            Index values here are invented for this prototype and labelled synthetic. The method,
            and its source, are real. Captured{" "}
            <span className="mono">{result.capturedAt}</span> ·{" "}
            <a href={result.sourceUrl} rel="noreferrer" target="_blank">
              query used
            </a>
          </p>
        </div>
      </details>
    </section>
  );
}
