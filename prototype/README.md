# BrandPulse NEXT

BrandPulse NEXT turns a market signal into one accountable decision: whether to act, where it can
actually be executed, and what must be proven first.

**Unofficial Techtonic Season 8 competition concept. Not an official HUL product, not endorsed by
HUL, and not deployed at HUL.** It is HUL-inspired and uses no HUL or Unilever logo, proprietary
font, or brand photography. All HUL-like operational records and outcomes are invented aggregates
and are visibly labelled synthetic.

## Run locally

Prerequisites: Node.js 24.x and npm.

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`. No API key, database, authentication, or networked service is
required — the complete journey works without any of them.

## Judged path

Open the decision room, or use **Start guide** in the top bar for the anchored walkthrough:

```text
/opportunities
```

1. **Replay the signal.** A labelled five-second replay shows sports and news attention, search
   acceleration, "sweat confidence" consumer language, weak q-commerce progression, four-city
   readiness, the national stock shortfall, and unavailable match-footage rights.
2. **Run AI analysis.** Gemini groups the approved evidence and argues the strongest case against it.
3. **Open Rexona**, inspect the evidence chain, and use *Ask why?* to separate rule output from
   model inference.
4. **Portfolio Resolver**: switch from national to four in-stock cities and from match footage to
   rights-safe creator content. The route recalculates from Watch to Test.
5. **Causal Sprint**: lock the ₹5,00,000 experiment before any result exists.
6. **Activation Review**: `RIGHTS-001` blocks the unsafe variant; select the corrected variant and
   record maker-checker approval.
7. **Reveal the synthetic result** and inspect the persisted Learning Ledger.

The **Decision Pulse** rail tracks this journey from Signal to Learning on every screen.
**Present** gives a clean screenshot composition without needing browser fullscreen permission.

Browser decisions are stored in versioned `localStorage`. **Reset** removes only the three
BrandPulse keys — `brandpulse-next:contracts:1.0.0`, `brandpulse-next:journey:1.0.0`, and
`brandpulse-next:guide:1.0.0` — and leaves unrelated storage untouched.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `DEMO_MODE` | `static` | `static` never contacts a provider. `hybrid` permits one bounded server-side call. |
| `LIVE_AI_ENABLED` | `false` | Master switch. Live AI needs **both** this and `DEMO_MODE=hybrid`. |
| `GEMINI_API_KEY` | unset | Server-only. Never prefixed `NEXT_PUBLIC_` and never sent to the browser. |
| `BRANDPULSE_MODEL` | `gemini-3.5-flash-lite` | Optional model override. |

A missing key is not a failure state: the journey completes on the checked-in synthesis, and the
interface says which mode produced the answer.

## The Gemini boundary

```text
Approved evidence -> Gemini synthesis -> schema validation -> evidence-ID validation
  -> deterministic P3 rules -> human approval
```

Gemini **may** summarise approved evidence, group it into themes, generate a counter-hypothesis,
identify missing evidence, and draft short explanatory copy.

Gemini **may never** generate or modify Proof, Permission or Preparedness; select Act, Test,
Incubate, Watch or Ignore; override a blocker; modify sprint cells, budget, thresholds or
guardrails; approve activation; reveal or evaluate results; publish content; or receive private HUL
or person-level data.

`POST /api/synthesize` accepts only `{ opportunityId, evidenceVersion }`. There is no
caller-authored prompt anywhere in the system — evidence is loaded server-side. A response is
accepted only if it validates against a strict schema with no additional fields **and** cites
evidence IDs that exist in the approved set. Anything else falls back.

`tests/integration/ai-decision-boundary.test.ts` proves this by feeding the pipeline a response that
asserts a route, high scores, and an approval in prose, then showing that the proof score, readiness,
route, brand ranking, and blockers are byte-identical either side of the call.

### Live versus fallback

| Situation | `mode` | `fallbackReason` | Journey |
|---|---|---|---|
| Key configured, provider healthy | `live` | — | Complete |
| `LIVE_AI_ENABLED=false` or `DEMO_MODE=static` | `precomputed_fallback` | `disabled` | Complete |
| No key | `precomputed_fallback` | `missing_key` | Complete |
| Timeout or provider unavailable | `precomputed_fallback` | `timeout` | Complete |
| Quota exhausted | `precomputed_fallback` | `quota` | Complete |
| Malformed body, extra field, or unknown evidence ID | `precomputed_fallback` | `invalid_output` | Complete |

Six-second total budget with at most one retry for quota, timeout, and 5xx. HTTP 200 for live and
fallback, 400 for an invalid request, 503 only if the fallback is also unavailable. Provider errors,
keys, and stack traces are never returned.

## Evidence boundaries

- **Public Observation**: linked dated snapshot sources.
- **Synthetic HUL-like Data**: invented aggregate consumer, commerce, inventory, creator,
  brand-memory, and outcome records.
- **Model Inference**: summaries and counter-hypotheses; visually separated and never mixed with
  rule output.
- **Business Assumption**: explicit illustrative thresholds or scenario choices.

Colour never carries provenance alone — every label has an icon and a word.

## Quality gates

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

`test:e2e` builds, starts the production server on `127.0.0.1:3000`, runs the journey, guided-tour,
and release-smoke suites, then shuts down. Install Chromium once with
`npx.cmd playwright install chromium`.

Visual QA captures all six screens at desktop and phone width:

```powershell
node scripts/capture-screens.mjs docs/screenshots/after
```

Before and after screenshots live in `docs/screenshots/`. The design system is documented in
[docs/VISUAL_SYSTEM.md](docs/VISUAL_SYSTEM.md).

## Deployment

Deployment is intentionally not automatic.

1. Push a green commit to the approved GitHub repository.
2. Import it into Vercel with **Root Directory** set to `prototype`.
3. Use Node.js 24.x. Keep `DEMO_MODE=static` and `LIVE_AI_ENABLED=false` for a guaranteed-offline
   judged path, or set `DEMO_MODE=hybrid`, `LIVE_AI_ENABLED=true`, and `GEMINI_API_KEY` as a
   server-side secret to demonstrate live synthesis.
4. Verify the direct hero URL in an incognito window and on a second network.

See [docs/DEMO_QA.md](docs/DEMO_QA.md) for verified checks and
[docs/SUBMISSION_CHECKLIST.md](docs/SUBMISSION_CHECKLIST.md) for items still requiring human
confirmation.
