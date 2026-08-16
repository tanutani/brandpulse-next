# BrandPulse NEXT

BrandPulse NEXT is a static-first case-competition prototype that turns a market signal into an evidence-backed, human-approved causal test. All HUL-like operational records and outcomes are invented aggregates and are visibly labeled synthetic.

The landing page explains both the current prototype and the proposed production model. Its eight connection contracts show where future access to signal, consumer, commerce, inventory, brand-policy, creator-rights, approval/activation, and experiment-outcome data would replace checked-in fixtures. These are proposed interfaces, not confirmed HUL API paths.

## Run locally

Prerequisites: Node.js 24.x and npm.

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`. No API key, database, authentication, or networked AI service is required.

## Judged path

Use **Start guided demo** or open:

```text
/opportunities/opp-extra-time-sweat-confidence
```

1. Inspect supporting and contradictory evidence.
2. Open Portfolio Resolver; switch from national to four in-stock cities and from match footage to rights-safe creator content.
3. Confirm the route becomes Test and lock the Causal Sprint.
4. Observe `RIGHTS-001` block the unsafe variant, select the corrected variant, and record maker-checker approval.
5. Reveal the synthetic result and inspect the persisted Learning Ledger.

Browser decisions are stored in versioned `localStorage`. Clearing site storage resets the journey.
The **Reset demo** control clears only BrandPulse contract and journey keys, then returns to the hero opportunity.

## Quality gates

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

`test:e2e` creates a production build, starts it on `127.0.0.1:3000`, runs the golden, guarded, and release-smoke journeys, and shuts the server down. Chromium must be installed once with `npx.cmd playwright install chromium`.

After deployment, capture landing and hero checkpoints against the public URL:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://your-project.vercel.app"
npm.cmd run test:e2e:external -- tests/e2e/deployed-smoke.spec.ts
```

## Static Vercel deployment

Deployment is intentionally not automatic.

1. Push a green commit to the approved GitHub repository.
2. Import it into Vercel with **Root Directory** set to `prototype`.
3. Use Node.js 24.x and keep `DEMO_MODE=static` and `LIVE_AI_ENABLED=false`.
4. Deploy without any provider key.
5. Verify the direct hero URL in an incognito window and on a second network.
6. Use that exact deep link as the QR target.

The competition build contains no Gemini, OpenRouter, Supabase, authentication, scraping, publishing, or private HUL integration.

## Evidence boundaries

- Public Observation: linked snapshot sources with capture dates.
- Synthetic HUL-like Data: invented aggregate consumer, commerce, inventory, creator, brand-memory, and outcome records.
- Model Inference: checked-in explanatory text only; it cannot alter scores or decisions.
- Business Assumption: explicit illustrative thresholds or scenario choices.

See [docs/DEMO_QA.md](docs/DEMO_QA.md) for verified checks and [docs/SUBMISSION_CHECKLIST.md](docs/SUBMISSION_CHECKLIST.md) for external items still requiring human confirmation.
