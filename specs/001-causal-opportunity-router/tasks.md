# Tasks: BrandPulse Causal Opportunity Router

**Input**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`

**Tests**: Required for deterministic gates, state transitions, fallback behavior, and the judged
end-to-end journey by the project constitution.

## Phase 1: Setup

**Purpose**: Create one pinned, Vercel-native TypeScript application and its quality commands.

- [X] T001 Scaffold the Next.js App Router TypeScript application in `app/layout.tsx`, `app/page.tsx`, `package.json`, `tsconfig.json`, and `next.config.ts`
- [X] T002 Install and pin the approved Day 1 Tailwind, XState 5, Zod, `@xstate/react`, and Lucide dependencies in `package.json` and `package-lock.json`; defer Recharts and all model SDKs per the controlled-foundation scope
- [X] T003 [P] Configure Vitest for deterministic domain and integration tests in `vitest.config.mts`
- [X] T004 [P] Configure Playwright with local and deployed base URL support in `playwright.config.ts`
- [X] T005 [P] Add lint, typecheck, unit, end-to-end, and production-build scripts to `package.json`
- [X] T006 [P] Add the controlled-foundation `DEMO_MODE=static` and `LIVE_AI_ENABLED=false` placeholders to `.env.example`
- [X] T007 Add generated application artifacts and secret files to `.gitignore` without excluding `public/data/` fixtures

**Checkpoint**: A blank application builds locally and all quality commands are callable.

---

## Phase 2: Foundational Decision Infrastructure

**Purpose**: Establish the contracts, fixtures, workflow, provenance system, and reusable UI shell
that block every user story.

- [X] T008 Port `contracts/opportunity-contract.schema.json` into Zod and TypeScript contracts in `lib/contracts/opportunity.ts`
- [X] T009 [P] Create route, evidence type, freshness, blocker severity, and workflow event enums in `lib/contracts/enums.ts`
- [X] T010 [P] Create versioned P3 weights and route-threshold configuration in `lib/scoring/config.ts`
- [X] T011 [P] Implement fixture parsing and schema validation in `lib/fixtures/load-fixtures.ts`
- [X] T012 [P] Create public, synthetic, model-inference, and business-assumption label components in `components/evidence/provenance-badge.tsx`
- [X] T013 [P] Create the Day 1 common app shell, static-mode badge, and disclosure banner in `components/shell/app-shell.tsx`
- [X] T014 Implement the guarded XState workflow and recovery states in `lib/state/opportunity-machine.ts`
- [X] T015 Add forbidden-transition and recovery-state unit tests in `tests/unit/opportunity-machine.test.ts`
- [X] T016 Implement typed browser persistence for contract versions and append-only decisions in `lib/persistence/local-contract-store.ts`
- [X] T017 Create checked-in precomputed synthesis loader and degraded-mode response in `lib/agents/fallback.ts`

**Checkpoint**: A validated empty Opportunity Contract can enter only legal states and survives a
browser refresh without any external service.

---

## Phase 3: User Story 1 - Evidence-backed route (Priority: P1) — MVP

**Goal**: Select a bundled signal, inspect support and counter-evidence, and receive an explainable
Act Now, Test, Incubate, Watch, or Ignore route.

**Independent test**: With no API key, open the hero and noise opportunities, view every decisive
input, change one assumption, and observe a deterministic route change or stable rejection.

- [X] T018 [P] [US1] Create hero, durable-shift, and single-source-noise signal fixtures in `public/data/signals.json`
- [X] T019 [P] [US1] Create labeled synthetic consumer-connect and commerce/off-take fixtures in `public/data/consumer-connects.jsonl` and `public/data/commerce-offtake.json`
- [X] T020 [P] [US1] Write Proof component, penalty, weakest-link, and route-boundary tests in `tests/unit/proof-and-routing.test.ts`
- [X] T021 [US1] Implement Proof component calculations and manipulation/source-concentration penalties in `lib/scoring/proof.ts`
- [X] T022 [US1] Implement non-compensating route selection and reason codes in `lib/routing/select-route.ts`
- [X] T023 [P] [US1] Implement deterministic topic clustering, freshness, evidence-family independence, and counter-evidence selection in `lib/evidence/cluster-opportunity.ts` and `lib/evidence/evaluate-evidence.ts`
- [X] T024 [P] [US1] Create precomputed Evidence Analyst and Skeptic outputs in `public/data/precomputed-synthesis.json`
- [X] T025 [US1] Build opportunity cards with signal class, countdown, evidence coverage, weakest link, and route in `app/opportunities/page.tsx`
- [X] T026 [US1] Build the Opportunity Contract evidence chain, counter-evidence panel, and component explanations in `app/opportunities/[id]/page.tsx`
- [X] T027 [US1] Add an editable source-concentration assumption with persisted deterministic recalculation in `components/gates/assumption-control.tsx`
- [X] T028 [US1] Add static fixture-to-Proof-to-route and refresh-persistence integration tests in `tests/integration/fixture-route.test.ts` and `tests/integration/persistence.test.ts`
- [X] T029 [US1] Add the MVP guided journey from Pulse Board to explained route in `tests/e2e/mvp-route.spec.ts`

**Checkpoint**: User Story 1 is a deployable MVP that distinguishes corroborated opportunity from
single-source noise and explains why.

---

## Phase 4: User Story 2 - Portfolio ownership and readiness (Priority: P2)

**Goal**: Compare three brands and show how brand permission, portfolio conflict, stock, rights, and
channel readiness determine ownership and scope.

**Independent test**: Compare Rexona, Dove, and Axe for the same opportunity; switch from national
scope to four in-stock cities and confirm Preparedness and the route update.

- [X] T030 [P] [US2] Create versioned Rexona, Dove, and Axe brand-memory fixtures with positioning, claims, taboos, history, and active campaigns in `public/data/brand-memory.json`
- [X] T031 [P] [US2] Create synthetic SKU inventory, service-level, channel, creator, and rights fixtures in `public/data/inventory.json` and `public/data/influencers.json`
- [X] T032 [P] [US2] Write Permission, Preparedness, hard-blocker, and portfolio-conflict tests in `tests/unit/portfolio-assessment.test.ts`
- [X] T033 [US2] Implement Permission scoring and configured claims/cultural blockers in `lib/scoring/permission.ts`
- [X] T034 [US2] Implement Preparedness scoring for product, stock, channel, creator, approval, rights, and measurement inputs in `lib/scoring/preparedness.ts`
- [X] T035 [US2] Implement brand ranking, weakest-link readiness, cannibalization warnings, and eligible-route derivation in `lib/portfolio/resolve-owner.ts`
- [X] T036 [US2] Build the three-brand Portfolio Resolver comparison in `app/resolver/[id]/page.tsx`
- [X] T037 [US2] Add national/city scope and rights-safe alternative controls in `components/portfolio/scope-control.tsx`
- [X] T038 [US2] Add portfolio ranking and geography-to-route integration coverage in `tests/integration/portfolio-resolver.test.tsx`
- [X] T039 [US2] Add the public-demo ownership/readiness interaction to `tests/e2e/portfolio-route.spec.ts`

**Checkpoint**: A public trend tool cannot reproduce the displayed decision without the synthetic
HUL-like portfolio and operational inputs.

---

## Phase 5: User Story 3 - Pre-registered Causal Sprint (Priority: P3)

**Goal**: Turn a promising Test route into a locked treatment/comparison design with budget,
measurement window, primary metric, guardrails, and scale/kill rules.

**Independent test**: Generate a complete sprint, block a non-comparable or under-stocked design,
lock a valid design, and prevent its primary rule from changing after results are revealed.

- [X] T040 [P] [US3] Write cell-comparability, stock-readiness, required-field, and threshold-lock tests in `tests/unit/causal-sprint.test.ts`
- [X] T041 [US3] Implement deterministic cell matching and comparability scoring in `lib/experiment/match-cells.ts`
- [X] T042 [US3] Implement sprint validation, budget cap, measurement window, and immutable scale/kill rules in `lib/experiment/validate-sprint.ts`
- [X] T043 [US3] Create the precomputed Experiment Architect rationale in `public/data/precomputed-synthesis.json`
- [X] T044 [US3] Build Causal Sprint Studio with treatment/comparison cells and validation messages in `app/sprint/[id]/page.tsx`
- [X] T045 [US3] Add a synthetic result fixture and pre-registered Scale/Iterate/Kill evaluator in `lib/experiment/evaluate-outcome.ts`
- [X] T046 [US3] Add valid, blocked, and post-result-lock integration coverage in `tests/integration/causal-sprint.test.tsx`
- [X] T047 [US3] Add the sprint-creation and result-lock journey to `tests/e2e/causal-sprint.spec.ts`

**Checkpoint**: Uncertainty creates a disciplined learning action rather than an AI recommendation
to spend.

---

## Phase 6: User Story 4 - Governed activation and maker-checker (Priority: P4)

**Goal**: Review a rights-safe activation package, block prohibited content, and append a human
decision before any simulated activation.

**Independent test**: The unlicensed-footage variant fails an exact rule; the corrected variant
passes; activation remains unavailable until the current contract version has an approving human
decision.

- [X] T048 [P] [US4] Create versioned claim, rights, disclosure, inclusion, expiry, and approval policies in `lib/policies/brand-rules.ts`
- [X] T049 [P] [US4] Write policy, stale-version, and no-approval transition tests in `tests/unit/governance.test.ts`
- [X] T050 [US4] Implement deterministic policy evaluation with rule IDs and remediation in `lib/policies/evaluate-package.ts`
- [X] T051 [US4] Implement deterministic activation-brief templating with one blocked and two rights-safe precomputed variants in `lib/activation/draft-package.ts` and `public/data/activation-packages.json`
- [X] T052 [US4] Implement append-only maker-checker decisions and current-version checks in `lib/governance/approve-contract.ts`
- [X] T053 [US4] Build the activation package, policy results, maker-checker action, and audit history in `app/review/[id]/page.tsx`
- [X] T054 [US4] Add no-approval, blocked-variant, corrected-variant, and persisted-audit integration coverage in `tests/integration/governed-review.test.tsx`
- [X] T055 [US4] Add the governed activation path to `tests/e2e/governed-activation.spec.ts`

**Checkpoint**: Fluent content cannot pass an explicit failed rule or activate without an
accountable human.

---

## Phase 7: User Story 5 - Learning Ledger (Priority: P5)

**Goal**: Replay the original hypothesis, evidence, route, human changes, locked experiment, and
result so future decisions can learn from outcomes and overrides.

**Independent test**: Complete a synthetic test, record Scale/Iterate/Kill, refresh, and replay the
exact contract version and any override rationale.

- [X] T056 [P] [US5] Write outcome-to-threshold, override-retention, and version-replay tests in `tests/unit/learning-ledger.test.ts`
- [X] T057 [US5] Implement immutable contract version assembly and outcome linkage in `lib/learning/build-ledger-entry.ts`
- [X] T058 [US5] Build the hypothesis-versus-outcome and human-override timeline in `components/governance/learning-ledger.tsx`
- [X] T059 [US5] Integrate the Learning Ledger into the completed review page in `app/review/[id]/page.tsx`
- [X] T060 [US5] Add replay-after-refresh integration coverage in `tests/integration/learning-ledger.test.tsx`
- [X] T061 [US5] Complete the guided end-to-end journey through the learned state in `tests/e2e/full-guided-demo.spec.ts`

**Checkpoint**: The product closes the loop and retains what humans and the test taught the system.

---

## Phase 8: Optional live synthesis, polish, and deployment proof

**Purpose**: Add bounded live AI without weakening static reliability; make the public prototype
judge-ready.

- [ ] T062 [P] Implement Zod-validated live Evidence Analyst and Skeptic structured generation with timeout and one retry in `app/api/synthesize/route.ts`
- [ ] T063 [P] Add contract tests for valid, malformed, timed-out, and fallback synthesis in `tests/integration/synthesis-api.test.ts`
- [ ] T064 Route live and precomputed synthesis through one typed interface and expose its mode in `lib/agents/synthesize.ts`
- [X] T065 [P] Add accessible focus order, labels, contrast, reduced-motion behavior, and keyboard operation across `app/` and `components/`
- [X] T066 [P] Add loading, empty, insufficient-evidence, expired, policy-blocked, and service-degraded UI states in `components/governance/system-state.tsx`
- [X] T067 [P] Add a `Start guided demo` landing experience and public/synthetic disclosure in `app/page.tsx`
- [X] T068 Add a second-network/private-window Playwright deployment profile and screenshot checkpoints in `tests/e2e/deployed-smoke.spec.ts`
- [X] T069 Audit the client bundle and repository for API keys, private data, and unlabeled synthetic records; document the result in `docs/DEMO_QA.md`
- [X] T070 Document environment setup, static fallback, Vercel deployment, and backup recording procedure in `README.md`
- [X] T071 Run lint, typecheck, unit, integration, end-to-end, static-mode, hybrid-fallback, and production-build checks and record outcomes in `docs/DEMO_QA.md`
- [ ] T072 Conduct five proxy-user completion tests, verify at least four can explain the route unaided, and document timings, failures, and resulting changes in `docs/USABILITY_TEST.md`
- [ ] T073 Verify slide claims, product behavior, official rubric, deadline, three-member eligibility, citations, QR link, and four-minute timing against `BRANDPULSE_NEXT_BLUEPRINT.md` in `docs/SUBMISSION_CHECKLIST.md`

**Checkpoint**: The public URL works with and without a provider, the critical path is under four
minutes, and every competition claim has visible product or source support.

---

## Phase 9: Self-explaining public prototype

**Purpose**: Make the production model and complete Rexona use case understandable without narration.

- [X] T074 Add a plain-language landing thesis, six-stage model map, Rexona outcome preview, and prototype/production boundary in `app/page.tsx` and `components/model/`
- [X] T075 Add reusable guided-demo steps, persistent progress rail, scoped reset control, and decision briefs across the hero journey in `components/shell/guided-journey.tsx` and hero routes
- [X] T076 Show eight proposed production connection contracts, access patterns, decision uses, fixture substitutes, and later capabilities without implying current HUL API access
- [X] T077 Extend Playwright coverage for first-visit comprehension, progress state, reset, business-value close, and deployed screenshot checkpoints

**Checkpoint**: A first-time viewer can distinguish the working static prototype from the future production model and complete the governed Rexona path without narration.

---

## Dependencies and execution order

```text
Setup -> Foundation -> US1 MVP -> US2 -> US3 -> US4 -> US5 -> Polish/Deploy
```

- US1 depends on Phase 2 contracts, state, and fixture loading.
- US2 depends on US1's route and evidence model.
- US3 depends on US2 selecting a brand and returning a Test route.
- US4 depends on US3 producing a valid, locked sprint.
- US5 depends on US4 producing a human decision and activation record.
- Live synthesis is optional and deliberately comes after the complete static vertical slice.

## Parallel execution examples

- During Setup, T003-T006 can proceed in parallel after T001 creates the base application.
- During Foundation, fixture validation, UI labels, configuration, and shell work (T009-T013) can
  proceed in parallel while one owner retains the contract shape in T008.
- During US1, fixture creation and unit tests (T018-T020) can proceed in parallel before services.
- During US2, brand fixtures, operational fixtures, and tests (T030-T032) can proceed in parallel.
- During US3, tests and precomputed rationale (T040 and T043) can proceed in parallel.
- During US4, policy configuration, tests, and activation fixtures (T048, T049, T051) can proceed in
  parallel.
- During Polish, live AI, accessibility, state UI, and landing work (T062, T063, T065-T067) can
  proceed in parallel after the static journey passes.

For a solo builder using multiple coding assistants, “parallel” means separate file ownership with
one human integrating changes; do not let assistants edit the same domain module concurrently.

## Implementation strategy

### MVP first

Complete T001-T029 before adding portfolio, experiment, or activation depth. This yields a usable
evidence-to-route product and confirms the contracts and visual language.

### Competition-complete vertical slice

T001-T061 is the non-negotiable judged product. If the build is behind, skip T062-T064 live AI and
retain precomputed synthesis. Do not skip the blocked path, human approval, or Learning Ledger.

### Suggested day mapping

- Days 1-2: T001-T019
- Day 3: T020-T024
- Day 4: T025-T029
- Day 5: T030-T039
- Day 6: T040-T047
- Day 7: T048-T061
- Day 8: T062-T071 as capacity permits
- Days 9-10: T072-T073, user fixes, rehearsal, feature freeze, and submission

## Format validation

All executable tasks use the required checklist form: checkbox, sequential task ID, optional `[P]`
marker, required user-story label within story phases, a concrete action, and an explicit file path.
