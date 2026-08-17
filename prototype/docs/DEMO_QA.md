# BrandPulse NEXT Demo QA

Date: 17 August 2026
Mode: no API key configured; `DEMO_MODE=static`, `LIVE_AI_ENABLED=false`
Scope: live AI product demo release candidate on `feat/live-ai-product-demo`

## Automated gates

| Gate | Command | Result |
|---|---|---|
| ESLint | `npm.cmd run lint` | Pass — 0 errors, 0 warnings |
| TypeScript | `npm.cmd run typecheck` | Pass |
| Vitest | `npm.cmd run test` | Pass — 18 files, 87 tests |
| Production build | `npm.cmd run build` | Pass — 11 routes; all judged routes prerendered, `/api/synthesize` dynamic |
| Playwright | `npm.cmd run test:e2e` | Pass — 21 passed, 1 skipped in 26.2s |
| `git diff --check` | — | Pass — no whitespace errors |

The skipped Playwright test is `deployed-smoke.spec.ts`, which self-skips unless
`PLAYWRIGHT_BASE_URL` is set.

## Model boundary evidence

- `POST /api/synthesize` accepts only `{ opportunityId, evidenceVersion }`. A body carrying an extra
  `prompt` field returns 400, as does an unknown opportunity ID. There is no caller-authored prompt
  anywhere in the system.
- Live output is accepted only when it parses as strict JSON with no additional fields **and** every
  cited evidence ID exists in the approved registry.
- Verified fallbacks: disabled mode, missing key, timeout, quota (429), provider unavailable (5xx),
  malformed body, unexpected provider exception, and a response citing an invented source. All
  return HTTP 200 with `mode: precomputed_fallback` and a stated `fallbackReason`.
- Retry is bounded: 429 and 5xx retry exactly once and then fall back; a non-transient exception
  does not retry. A successful retry is also covered.
- `tests/integration/ai-decision-boundary.test.ts` feeds the pipeline a schema-valid response that
  asserts "ACT NOW", Proof 95, Permission 98, Preparedness 99, national approval, and a rights
  override in prose. Proof (68), readiness (68), route (`test`), the national/four-city brand
  ranking, and the blocker set are identical before and after the call.
- The response object carries only `mode`, `model`, `promptVersion`, `generatedAt`, `summary`,
  `themes`, `counterHypothesis`, and `missingEvidence`. It has no route, score, blocker, approval,
  threshold, or outcome field, asserted by key comparison.
- Live AI requires **both** `LIVE_AI_ENABLED=true` and `DEMO_MODE=hybrid`; either alone leaves the
  product on the checked-in synthesis. A whitespace-only key is treated as absent.

## Deterministic acceptance evidence

- Rexona outranks Dove and Axe on configured Permission; Dove's inclusion safety and Axe's portfolio
  conflict remain visible.
- National plus unlicensed match footage produces Watch with `RIGHTS_MATCH_FOOTAGE_UNAVAILABLE` and
  a remediation, and the continue action is unavailable.
- Four in-stock cities plus rights-safe creator content raises Preparedness and produces Test.
- Sprint validation blocks overlapping, under-stocked, incomplete, invalid-window, and
  low-comparability designs; locked metric, window, cells, budget, scale rule, and kill rule reject
  revision.
- `RIGHTS-001` blocks the match-footage variant; approval and result reveal are both disabled. The
  corrected variant passes all five checks.
- The result stays locked until a locked sprint and a current-version approval both exist.
- The checked-in 1.2 percentage-point lift with 95% service level evaluates to Scale against the
  locked rules, and the ledger replays after refresh.

## Signal replay

- Labelled "Simulated live replay"; the interface states "fixed order, no live feed".
- Seven events across six source families inside a fixed five-second window, with strictly ascending
  unique offsets. Unit tests assert order, timing, reset to an empty board, and determinism of
  `eventsRevealedAt`.
- Every event cites approved evidence IDs, and the synthetic flag must agree with the evidence type.
- No network request is made; the replay reads checked-in fixtures only.

## Guided conversation

- Eleven anchored steps. Action steps advance only when the highlighted control succeeds; clicking an
  unrelated control leaves the step in place, which is asserted.
- Only the two observation steps (`rights-check`, `ledger`) carry an acknowledgement button.
- Progress persists across route navigation and refresh.
- A direct link to a screen without the current anchor shows "This step is on the <screen>" and a
  link back.
- Skip, Resume (returns to where it stopped), Restart (returns to step 1), and Reset are distinct.
- Renders as a bottom sheet at 390px, full-bleed and docked to the bottom edge.

## Safety and data audit

- Secret-pattern scan across all `.ts`, `.tsx`, `.mjs`, `.json`, `.css`, and `.md` sources for
  `AIza…`, `sk-…`, private-key headers, assigned `GEMINI_API_KEY`, and bearer tokens: no key-shaped
  values found.
- Client bundle audit over 18 assets in `.next/static`: no `GEMINI_API_KEY`, no key, no
  `@google/genai`, and no provider endpoint. The SDK appears only in a server chunk.
- No `NEXT_PUBLIC_` variable exists. The only `process.env` read in application code is
  `lib/ai/synthesize.ts`, which no client component imports.
- Provider errors, keys, and stack traces are never returned; the API answers with stable codes.
- Only public and synthetic aggregate evidence is sent to the provider. Model-inference records are
  excluded from the approved set so prior inference is never recycled as grounding.
- All internal-like operational and outcome records carry synthetic disclosure; public fixtures carry
  a source URL and capture date.
- No person-level records, private HUL data, uploads, scraping, database, or authentication exist.

## Accessibility and responsiveness

- Contrast measured for every token pair and recorded in `docs/VISUAL_SYSTEM.md`. `--signal-teal` is
  3.92:1 and therefore restricted to borders, icons, and meters; text uses `--signal-teal-ink` at
  6.47:1. All text pairs meet AA or better.
- Colour is never the only signal: provenance, route, policy, and pulse states each carry an icon
  and a word.
- Keyboard: the cover's primary action is reachable by Tab, shows a visible focus outline, and
  activates with Enter. The guide does not trap focus.
- Reduced motion: the Decision Pulse renders static with transition duration under 50ms and loses no
  information.
- Phone (390×844): no horizontal overflow on the cover, Pulse Room, opportunity, or resolver;
  asserted in Playwright. Touch targets are at least 44px.
- No browser console errors across the phone sweep.

## Known limitations

- Live Gemini has not been exercised against the real provider from this machine; live behaviour is
  covered by provider mocks and a mocked-route Playwright test. A key holder should run one live
  call before relying on the live path in a presentation.
- The deployed smoke test still needs a deployment of this branch to run.
- Proxy-user comprehension sessions and presentation timing still require the registered team.
