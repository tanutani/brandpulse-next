import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="landing page-frame">
      <section className="landing-copy" aria-labelledby="landing-title">
        <p className="eyebrow">Causal opportunity router · Competition-complete</p>
        <h1 id="landing-title">Attention is not demand.</h1>
        <p className="landing-thesis">
          Decide whether a signal is real, which portfolio brand has permission, and what must be
          proven before HUL spends or publishes.
        </p>
        <div className="landing-actions">
          <Link className="primary-action" href="/opportunities/opp-extra-time-sweat-confidence">
            Start guided demo <ArrowRight aria-hidden="true" size={18} />
          </Link>
          <Link className="secondary-action" href="/opportunities">
            Open Pulse Board <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
          <span className="assurance-note">
            <ShieldCheck aria-hidden="true" size={17} /> No API key required
          </span>
        </div>
      </section>
      <aside className="decision-manifest" aria-label="Decision contract principles">
        <p className="manifest-kicker">One contract keeps the chain intact</p>
        <ol>
          <li><span>01</span> Evidence and counter-evidence</li>
          <li><span>02</span> Proof, Permission, Preparedness</li>
          <li><span>03</span> Deterministic route and locked causal test</li>
          <li><span>04</span> Rights block, human approval, and learning</li>
        </ol>
        <p className="manifest-foot">Public observations + visibly synthetic HUL-like aggregates</p>
      </aside>
    </main>
  );
}
