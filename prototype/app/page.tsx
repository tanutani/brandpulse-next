import { ArrowRight, Beaker, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { HowItWorksLink } from "@/components/shell/how-it-works-link";
import { ACT_OPPORTUNITY_ID } from "@/lib/demo/journey";

/**
 * The cover. One sentence, one preview, one primary action. Everything
 * explanatory lives in the "How BrandPulse works" drawer.
 */
export default function Home() {
  return (
    <div className="shell-frame">
      <section className="cover" aria-labelledby="cover-title">
        <div>
          <p className="cover-eyebrow">Governed signal-to-action for brand teams</p>
          <h1 id="cover-title">Attention is not demand.</h1>
          <p className="cover-sentence">
            BrandPulse turns a market signal into one accountable decision — whether to act, where it
            can actually be executed, and what must be proven first.
          </p>

          <div className="cover-actions">
            <Link className="btn btn-primary" href="/opportunities">
              Start Rexona guided demo <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link className="btn btn-secondary" href={`/opportunities/${ACT_OPPORTUNITY_ID}`}>
              See an ACT decision
            </Link>
            <HowItWorksLink />
          </div>

          <div className="cover-note">
            <span>
              <ShieldCheck aria-hidden="true" size={14} /> No login, key, or database required
            </span>
            <span>
              <Beaker aria-hidden="true" size={14} /> Dated public snapshots and labelled synthetic
              HUL-like data
            </span>
            <span>Unofficial Techtonic Season 8 concept · not an official HUL product</span>
          </div>
        </div>

        <div className="journey-previews">
        <aside className="use-case-preview" aria-label="Rexona use case preview">
          <div className="use-case-head">
            <span>Use case</span>
            <strong>Rexona · India</strong>
          </div>
          <div className="use-case-body">
            <h2>Extra-time sweat confidence</h2>
            <p>
              A late-match heat window looks relevant. National stock and match-footage rights make
              immediate activation unsafe.
            </p>

            <div className="use-case-shift">
              <div>
                <span>National + match footage</span>
                <span className="route-badge route-watch">Watch</span>
              </div>
              <div>
                <span>Four cities + creator content</span>
                <span className="route-badge">Test</span>
              </div>
            </div>

            <div className="use-case-result">
              <span>Synthetic result</span>
              <strong>+1.2pp · 95% service · Scale</strong>
            </div>
          </div>
        </aside>
        <aside className="use-case-preview is-act-preview" aria-label="Surf Excel use case preview">
          <div className="use-case-head">
            <span>90-second ACT contrast</span>
            <strong>Surf Excel · India</strong>
          </div>
          <div className="use-case-body">
            <h2>First-monsoon muddy play</h2>
            <p>
              Weather, search, social and commerce agree. Inventory, claim support and creator rights
              were prepared before the rain arrived.
            </p>
            <div className="use-case-shift">
              <div>
                <span>Prepared decision</span>
                <span className="route-badge route-act_now">Act now</span>
              </div>
              <div>
                <span>Consequential gate</span>
                <strong>Human approval</strong>
              </div>
            </div>
            <div className="use-case-result">
              <span>Monitored outcome</span>
              <strong>Descriptive only · no causal claim</strong>
            </div>
          </div>
        </aside>
        </div>
      </section>
    </div>
  );
}
