# Submission Checklist

## Prototype — verified locally

- [x] Journey completes without a key, database, or authentication.
- [x] Evidence, counter-evidence, freshness, and provenance are visible and labelled.
- [x] Rexona, Dove, and Axe are compared on the same evidence.
- [x] Geography and rights controls change Preparedness and the route.
- [x] Sprint rules lock before the result and reject revision.
- [x] `RIGHTS-001` cannot be bypassed.
- [x] Current-version maker-checker approval is required before the result unlocks.
- [x] Synthetic outcome and Learning Ledger survive refresh.
- [x] Lint, typecheck, 87 unit/integration tests, production build, and 21 Playwright tests pass.

## Live AI product demo — verified locally

- [x] Labelled, resettable five-second signal replay with no network request.
- [x] `POST /api/synthesize` accepts only an opportunity ID and evidence version.
- [x] Live output is schema-validated, extra-field-rejecting, and evidence-ID-grounded.
- [x] Fallback covers disabled, missing key, timeout, quota, 5xx, malformed output, and invented
      sources; the interface states which mode produced the answer.
- [x] A model response asserting a route, scores, and an approval changes none of them.
- [x] Guided messages advance only on real actions; skip, resume, restart, and reset are distinct.
- [x] Reset clears only the three BrandPulse keys and preserves unrelated storage.
- [x] Presentation mode needs no browser fullscreen permission.
- [x] No key, SDK, or provider endpoint appears in any client asset.

## Unofficial-concept positioning — verified

- [x] Top bar, disclosure strip, README, and visual documentation all state that this is an
      unofficial Techtonic competition concept and not an official HUL product.
- [x] No HUL or Unilever logo, no proprietary Unilever font, no brand campaign photography.
- [x] No wording claiming HUL deployment, ownership, or endorsement.
- [x] Proposed production interfaces are labelled as proposed, not confirmed HUL API paths.

## Official documents — verified

- [x] Official case-study and rulebook PDFs are present and were reviewed page by page.
- [x] Stage 1 deadline is 20 August 2026; the supplied PDFs state no exact cutoff time or timezone.
- [x] Stage 1 is exactly three slides, described as a "3-slider PPT solution".
- [x] Official rubric is Product 25%, Ecosystem 20%, AI/Technical Feasibility 20%, Prioritization
      15%, Impact 15%, and Creativity/Prototype 5%.
- [x] A prototype is mandatory; submissions without one will not be considered.

## Requires the user/team

- [ ] Review the redesign and approve the branch before any push, merge, or deployment.
- [ ] Decide whether production runs `static` (guaranteed offline) or `hybrid` with a server-side
      `GEMINI_API_KEY`. Never commit the key; set it only in Vercel project settings.
- [ ] Run one real Gemini call before relying on the live path in a live presentation.
- [ ] Check Unstop for the exact cutoff time/timezone, file-size limit, filename convention, upload
      field, and prototype-link mechanism; these are absent from the supplied PDFs.
- [ ] Confirm three eligible registered members and exact team/institute identifiers.
- [ ] Verify the release deep link on a physical second network/device, then create the QR.
- [ ] Run three to five proxy-user sessions and record comprehension and timing.
- [ ] Put the final Decision Pulse screenshot and direct-link QR on Slide 2.
- [ ] Reverify every public claim and numeric reference; label prototype thresholds, scores, costs,
      and outcomes as assumptions or synthetic.
- [ ] Confirm the deck makes no real-HUL-integration, endorsement, autonomous-publishing, or
      unsupported "real-time/first" claim.
- [ ] Rehearse the four-minute path three times and record the 90-second backup.
- [ ] Export and inspect the final three-slide PPTX on a second device.

Release links:

- Public prototype (previous release): <https://brandpulse-next.vercel.app>
- Direct Rexona journey: <https://brandpulse-next.vercel.app/opportunities/opp-extra-time-sweat-confidence>
- Private source: <https://github.com/tanutani/brandpulse-next>

Note: the deployed URLs still serve the previous static release. This branch has not been pushed or
deployed.

Do not add private HUL access or autonomous publishing without a separate approved integration
phase. Google AI Studio import remains a separate later submission step.
