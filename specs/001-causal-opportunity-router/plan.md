# Implementation Plan: BrandPulse Causal Opportunity Router

**Branch**: `001-causal-opportunity-router` | **Date**: 2026-08-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-causal-opportunity-router/spec.md`

## Summary

Build a public, judge-ready vertical slice that converts a fragmented market signal into a
versioned Opportunity Contract. The product triangulates public and synthetic HUL-like evidence,
compares three portfolio brands, applies separate Proof, Permission, and Preparedness gates, routes
the opportunity to Act Now, Test, Incubate, Watch, or Ignore, pre-registers a causal micro-test, and
requires maker-checker approval before simulated activation. A typed XState workflow and pure
TypeScript scoring functions own consequential decisions; an optional Gemini call supplies
structured synthesis and copy drafts. Bundled snapshots and precomputed model output keep the demo
fully usable without network or model access.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 22 LTS

**Primary Dependencies**: Next.js App Router, React, Tailwind CSS, shadcn/ui, XState 5, Zod,
Vercel AI SDK with `@ai-sdk/google`, Recharts

**Storage**: Versioned JSON/JSONL/CSV fixtures plus browser `localStorage` for prototype decisions;
no production database in the first-round build

**Testing**: Vitest, React Testing Library, and Playwright

**Target Platform**: Modern desktop browsers; public deployment on Vercel with a locally runnable
fallback

**Project Type**: Single full-stack web application

**Performance Goals**: First meaningful screen under 2 seconds on a normal connection; deterministic
route recalculation under 100 milliseconds; optional synthesis response or fallback within 8 seconds;
complete judged path in 3-4 minutes

**Constraints**: One primary builder, ten calendar days, three-slide first-round submission, no
private datasets, no live scraping in the critical path, API credentials kept server-side, all
HUL-like data visibly labeled synthetic

**Scale/Scope**: Three opportunity cards (one complete hero path and two compact contrasts); three
candidate brands for the hero; five primary screens; five deterministic routes; one successful
governed test and one blocked or killed path

## Constitution Check

*GATE: Passed before Phase 0 and re-checked after Phase 1.*

| Principle | Design response | Status |
|---|---|---|
| Evidence Before Eloquence | Each claim links to provenance, date, geography, freshness, evidence type, and counter-evidence. | Pass |
| Deterministic Gates Around Probabilistic AI | Pure scoring and route functions own thresholds; AI output is Zod-validated and cannot approve or publish. | Pass |
| Demo Reliability and Graceful Degradation | `static`, `hybrid`, and precomputed fallback modes share the same typed contract. | Pass |
| Synthetic Data Transparency and Privacy | Fixtures contain only public snapshots or explicitly synthetic aggregated data; no person-level targeting. | Pass |
| Solo-Build Scope Discipline | Five screens and one complete vertical slice; production connectors and collaboration features are architecture-only. | Pass |

Post-design re-check: no exception is required. XState is retained because explicit transitions and
guards directly implement the governance requirement. A database, authentication, open-ended agent
framework, live scraper, and content publishing integration are deliberately excluded from v1.

## Product and Decision Design

### Opportunity Contract

The Opportunity Contract is the product's atomic object. It keeps the hypothesis, evidence,
counter-evidence, P3 assessments, candidate-brand comparison, route, assumptions, causal test,
activation package, human decisions, and outcome in one replayable record.

### Gate model

The headline readiness value is `min(Proof, Permission, Preparedness)`, not an average. Component
weights are configured in versioned TypeScript objects and shown in the interface. Mandatory safety,
rights, claim, expiry, measurement, and stock checks can block a route even when numeric scores are
high.

Default prototype route policy:

- **Act Now**: live moment, useful window at most 72 hours, Proof at least 75, Permission at least 80,
  Preparedness at least 80, and no blocker. This is a recommendation; simulated activation still
  requires current-version human approval.
- **Test**: Proof 55-74 or Preparedness 55-79, Permission at least 70, no mandatory blocker.
- **Incubate**: durable trend with strong Proof and Permission but no current product or long
  operational lead time.
- **Watch**: Proof 35-54, material disagreement, geographic mismatch, or stale evidence.
- **Ignore**: Proof below 35, Permission below 40, manipulation risk, or an uncured safety blocker.

Thresholds are illustrative competition assumptions, not claimed HUL policy. The UI allows a judge
to change a documented input and observe the deterministic route change.

### Workflow state machine

```text
idle
  -> assembling_evidence
  -> challenging
  -> scoring
  -> awaiting_human_route
  -> designing_experiment
  -> checking_readiness
  -> awaiting_maker_approval
  -> approved_test
  -> simulating_outcome
  -> learned

terminal or recovery states:
  insufficient_evidence | policy_blocked | expired | service_degraded
```

Only valid events can advance the workflow. Model responses never transition the machine directly.

## Project Structure

### Documentation

```text
specs/001-causal-opportunity-router/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- api.openapi.yaml
|   `-- opportunity-contract.schema.json
|-- checklists/
|   `-- requirements.md
`-- tasks.md                 # generated during implementation planning
```

### Source Code

```text
app/
|-- api/synthesize/route.ts
|-- opportunities/page.tsx
|-- opportunities/[id]/page.tsx
|-- resolver/[id]/page.tsx
|-- sprint/[id]/page.tsx
`-- review/[id]/page.tsx
components/
|-- evidence/
|-- gates/
|-- portfolio/
|-- sprint/
`-- governance/
lib/
|-- contracts/
|-- scoring/
|-- routing/
|-- experiment/
|-- policies/
|-- agents/
|-- state/
`-- fixtures/
public/data/
|-- signals.json
|-- consumer-connects.jsonl
|-- commerce-offtake.json
|-- brand-memory.json
|-- inventory.json
|-- influencers.json
`-- precomputed-synthesis.json
tests/
|-- unit/
|-- integration/
`-- e2e/
```

**Structure Decision**: One Next.js repository is the smallest Vercel-native deployment. Domain
logic lives outside React so gate calculations, policies, and state transitions can be unit tested
without the UI or model provider.

## Agent Responsibilities

| Component | Probabilistic responsibility | Deterministic boundary |
|---|---|---|
| Evidence Analyst | Extract themes and summarize evidence into a typed claim set. | Cannot invent sources or change evidence values. |
| Skeptic | Identify strongest counter-hypothesis and missing evidence. | Cannot select the route. |
| Portfolio Resolver | Draft an explanation of the brand comparison. | Scores, blockers, and ranking come from configured rules. |
| Experiment Architect | Draft test rationale and measurement notes. | Cell matching, budget cap, thresholds, and validation are rule-based. |
| Brand Guardian | Flag ambiguous semantic concerns for review. | Exact claims, rights, disclosures, expiry, and approval blocks are policy code. |

Each agent returns a Zod-validated object, has a timeout and one retry, and falls back to a checked-in
output. There is no autonomous agent-to-agent loop.

## Delivery Phases

### Phase 0 - Decisions and evidence

- Freeze one hero scenario and one guarded contrast scenario.
- Create the P3 formulas, route policy, provenance taxonomy, and opportunity contract.
- Validate the novelty statement against public competitor documentation.
- Conduct at least five practitioner interviews and back-test 15-20 signals if access permits.

### Phase 1 - Deterministic core

- Add fixtures and schemas.
- Implement scoring, blockers, routing, causal-test validation, and state transitions.
- Cover every mandatory gate with unit tests before connecting a model.

### Phase 2 - Judge-facing flow

- Build the Pulse Board, Contract, Portfolio Resolver, Causal Sprint, and Review/Learning views.
- Add provenance labels, counter-evidence, assumption controls, audit history, and one blocked path.
- Add structured Gemini synthesis with static fallback.

### Phase 3 - Proof and submission

- Deploy to Vercel, run the Playwright journey against the public URL, test airplane-mode fallback,
  rehearse the 3-4 minute walkthrough, and align every slide claim with displayed behavior.

## Verification Gates

- Unit: component scores, weakest-link readiness, mandatory blockers, route boundaries, cell
  comparability, threshold evaluation, and expired-window handling.
- Integration: malformed model output uses fallback; no human approval blocks activation; inventory
  changes update the route; killed tests cannot be scaled.
- End to end: hero signal reaches an approved Test and simulated learning outcome; contrast signal is
  blocked or routed to Ignore; all evidence labels remain visible.
- Deployment: no client bundle contains API keys; refresh preserves the local audit record; static
  mode works without external services; the public prototype has no broken navigation.

## Live AI product demo (additive, v1.1)

### Pipeline

```text
Approved evidence -> Gemini synthesis -> schema validation -> evidence-ID validation
  -> deterministic P3 rules -> human approval
```

A fluent model response remains model inference, not evidence, and is labelled as such wherever it
appears.

### Provider boundary

`POST /api/synthesize` is the only route that may reach a provider. It accepts a strict
`SynthesisRequest` of `{ opportunityId, evidenceVersion }` and nothing else; there is no
caller-authored prompt anywhere in the system. Evidence is loaded server-side by the approved
evidence registry.

- Model `gemini-3.5-flash-lite` via the official `@google/genai` server SDK, overridable with
  `BRANDPULSE_MODEL`.
- Live AI requires **both** `LIVE_AI_ENABLED=true` and `DEMO_MODE=hybrid`, plus `GEMINI_API_KEY`.
- Six-second total budget with at most one retry for quota, timeout, and 5xx.
- Fallback on disabled mode, missing key, timeout, quota, provider failure, malformed output, or an
  unknown evidence identifier. 200 for live and fallback, 400 for an invalid request, 503 only when
  the fallback is also unavailable.
- Provider errors, keys, and stack traces are never returned. Strings and arrays are bounded.
- A small in-process cache keyed by opportunity and evidence version avoids duplicate calls; there
  is no database.

A missing key is not a blocker. Live behaviour is covered by provider mocks, and the no-key journey
stays complete.

### Additional verification gates

- Replay schema, timing, ordering, and reset.
- Request validation, extra-field rejection, unknown evidence-ID rejection.
- Missing key, disabled, timeout, 429, 5xx, malformed body, and provider-exception fallbacks.
- Identical scores and routes under live and fallback, including against a response that asserts a
  route, a score, and an approval in prose.
- Reset preserving unrelated browser storage.
- Guided pop-up progression, skip, resume, restart, presentation mode, phone bottom sheet, keyboard
  navigation, reduced motion, and no console errors.

## Complexity Tracking

No constitution violations. `@google/genai` is the single added runtime dependency and is
server-only; the client bundle contains no provider key, SDK, or provider endpoint. Deferred items
include authentication, multi-user collaboration, production connectors, long-term database storage,
automated media buying, live publishing, and model fine-tuning.
