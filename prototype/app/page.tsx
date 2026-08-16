import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { ModelMap } from "@/components/model/model-map";
import { ProductionConnections } from "@/components/model/production-connections";
import { HERO_OPPORTUNITY_ID } from "@/lib/demo/model";

export default function Home() {
  return (
    <main className="landing-page page-frame">
      <section className="landing" aria-labelledby="landing-title">
        <div className="landing-copy">
          <p className="eyebrow">Decision system for brand teams · Static competition prototype</p>
          <h1 id="landing-title">Attention is not demand.</h1>
          <p className="landing-thesis">
            BrandPulse tells a brand team whether, where, and how to respond to a market signal—before
            it spends money or publishes unsafe work.
          </p>
          <div className="landing-actions">
            <Link className="primary-action" href={`/opportunities/${HERO_OPPORTUNITY_ID}`}>
              Try the Rexona use case <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link className="secondary-action" href="/opportunities">
              Explore other decisions <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
            <span className="assurance-note">
              <ShieldCheck aria-hidden="true" size={17} /> No login or API key
            </span>
          </div>
        </div>
        <aside className="hero-use-case" aria-label="Rexona demo outcome preview">
          <div className="hero-use-case-topline"><span>Live example</span><strong>Rexona · India</strong></div>
          <h2>Extra-time sweat confidence</h2>
          <p>A late-match sports moment looks relevant—but national stock and match-footage rights make immediate activation unsafe.</p>
          <div className="route-shift"><span>National + match footage <strong>Watch</strong></span><ArrowRight aria-hidden="true" size={18} /><span>Four cities + creator content <strong>Test</strong></span></div>
          <div className="hero-use-case-result"><span>Synthetic result</span><strong>+1.2pp lift · 95% service · Scale</strong></div>
        </aside>
      </section>

      <section className="landing-answers" aria-label="BrandPulse explained">
        <div><span>What is it?</span><strong>A governed market-signal decision system.</strong></div>
        <div><span>Who uses it?</span><strong>Brand, insights, commerce, and legal teams.</strong></div>
        <div><span>Why now?</span><strong>Fast attention can be temporary, unsafe, or impossible to execute.</strong></div>
        <div><span>What comes out?</span><strong>Act, Test, Incubate, Watch, or Ignore—with reasons.</strong></div>
      </section>

      <ModelMap />

      <section className="prototype-boundary" aria-labelledby="boundary-title">
        <div className="boundary-heading"><p className="eyebrow">Honest product boundary</p><h2 id="boundary-title">The prototype proves the decision contract—not a live HUL integration.</h2></div>
        <div className="boundary-columns">
          <article><span>Prototype today</span><h3>Reliable enough to judge</h3><ul><li>Dated public and visibly synthetic snapshots</li><li>Deterministic TypeScript decision rules</li><li>Versioned browser-local journey history</li></ul></article>
          <article><span>Production model</span><h3>Connected to the operating system</h3><ul><li>Listening, consumer, commerce, and inventory inputs</li><li>Brand memory, rights, claims, and campaign systems</li><li>Enterprise roles, lineage, approvals, and outcome store</li></ul></article>
        </div>
      </section>

      <ProductionConnections />
    </main>
  );
}
