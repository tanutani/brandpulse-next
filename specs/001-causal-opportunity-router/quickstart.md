# Quickstart: BrandPulse NEXT Prototype

This is the implementation handoff for the ten-day competition build. It assumes the application
has not yet been scaffolded.

## 1. Prerequisites

- Node.js 22 LTS and npm
- Git
- A Vercel account
- Optional Google AI Studio API key for structured synthesis

Codex Plus and Claude Pro can help write the application, but consumer subscriptions do not provide
runtime API quota. Static mode requires no model key.

## 2. Create the app

From the verified repository root, scaffold one Next.js TypeScript application with Tailwind and the
App Router. Pin the resolved package-lock and install XState 5, Zod, Recharts, the Vercel AI SDK,
the Google provider, Vitest, Testing Library, and Playwright. Before implementation, verify current
stable package and model identifiers in official documentation.

Suggested environment file:

```text
DEMO_MODE=static
GOOGLE_GENERATIVE_AI_API_KEY=
BRANDPULSE_MODEL=gemini-3.6-flash
```

`DEMO_MODE=static` always loads checked-in synthesis. `hybrid` attempts the server call with an
eight-second timeout and falls back. `gemini-3.6-flash` is the selected model as of 6 August 2026;
recheck availability on build day. Never expose the key in a `NEXT_PUBLIC_` variable.

## 3. Build order

1. Copy the JSON Schema into TypeScript/Zod contracts.
2. Add two opportunity fixtures and three candidate-brand profiles for each.
3. Write pure functions for P3 components, blockers, weakest-link readiness, and route selection.
4. Write route-boundary tests before UI work.
5. Implement the XState workflow and forbidden-transition tests.
6. Build the five-screen judged journey using static data.
7. Add the optional structured synthesis endpoint and checked-in fallback.
8. Add maker-checker approval, local audit history, simulated result, and Learning Ledger.
9. Add the failure path and mode badge.
10. Deploy, test, and rehearse.

## 4. Mandatory demo scenarios

### Hero: useful but uncertain opportunity

A cross-source opportunity has credible search, consumer-language, and commerce progression but
needs a bounded test. The system compares three brands, selects one, shows P3 scores, and routes it
to Test. Changing target-market stock makes Preparedness the weakest link and narrows the test. The
user approves a pre-registered sprint, reviews safe channel variants, and reveals a simulated
incremental result.

### Contrast: attractive noise or blocked action

A viral one-creator spike has weak persistence and no behavioral progression, or a good opportunity
contains a prohibited claim/expired rights window. The product displays counter-evidence and blocks
Act Now. This path is essential proof that the system is not an agreeable content generator.

## 5. Definition of demo-ready

Run these checks locally and against the public URL:

```text
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Manual checks:

- Turn off the model key and complete the whole path.
- Change one evidence or inventory assumption and confirm the route changes.
- Attempt activation without human approval and confirm it is blocked.
- Fail a policy check and confirm the exact rule and remediation appear.
- Refresh and confirm the audit decision persists.
- Confirm every synthetic and public evidence label is visible.
- Check the deployed URL in a private browser window and on a second network.

## 6. Ten-day execution

| Day | Non-negotiable output |
|---:|---|
| 1 | Freeze hero user, hypothesis, route policy, brand set, and storyboard; book five interviews. |
| 2 | Complete fixtures, P3 formulas, contract, competitor gap, and two interviews. |
| 3 | Implement schemas, scoring, blockers, routing, and unit tests. |
| 4 | Build Pulse Board and Opportunity Contract. |
| 5 | Build Portfolio Resolver and interactive assumption change. |
| 6 | Build Causal Sprint validation, maker-checker review, and audit history. |
| 7 | Add structured synthesis, fallback, activation variants, and killed/blocked path. |
| 8 | Finish visual polish, accessibility, Playwright path, deployment, and five proxy-user tests. |
| 9 | Build the three slides, quantify the business case, rehearse hostile Q&A, and fix failures. |
| 10 | Freeze features; run deployment, fallback, link, rulebook, citation, and timing checks; submit early. |

If behind, remove live model generation first, then secondary charts, then the second scenario's
detail view. Never remove provenance, P3 gates, the causal contract, human approval, or fallback.

## 7. Public deployment

Import the repository into Vercel, add only server-side environment values, select the current Node
runtime, and run the production build. The judged URL should open directly to a short landing panel
with a `Start guided demo` action and a visible `Public + synthetic demo data` disclosure.

Keep a screen recording and locally runnable static build as backup. Do not add authentication to
the first-round public demo; include no private or personal information.
