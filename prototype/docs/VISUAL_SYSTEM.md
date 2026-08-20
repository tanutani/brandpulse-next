# BrandPulse NEXT — visual system

Unofficial Techtonic Season 8 competition concept. HUL-inspired, not an official HUL product,
not endorsed by and not deployed at HUL. No Unilever or HUL logo, font, or campaign image is used.

## 1. Visual plan

The product is a **decision room**, not a dashboard and not an article.

A brand, insights, commerce, and legal group is looking at *one* decision at a time. The screen's
job is to show what is known, who may own it, what blocks it, and what happens next — with the
chain of custody visible the whole way. So the interface commits to three things:

1. **One decision per screen.** The current route and the next action sit above the fold. Evidence,
   formulas, and architecture live in drawers and bounded scroll panels, not in permanent blocks.
2. **Colour carries meaning, never decoration.** A corporate blue is the structure. The portfolio
   accents are a *provenance and state* vocabulary: teal for public observation, violet for model
   inference, amber for the decision itself, red for a blocker. Nothing is coloured for mood.
3. **The journey is one continuous object.** The Decision Pulse persists across every screen so the
   viewer always knows where this decision sits between signal and learning.

This is what keeps it specific to HUL's multibrand context rather than a generic blue SaaS shell:
the accent system exists because a portfolio company has to say *which brand may own this and on
whose evidence*, and the interface encodes that answer in colour, badge, and position.

## 2. Tokens

Prototype tokens. These are competition design choices, **not** claimed official HUL brand standards.

```css
--brand-primary: #1746c9;   /* structure, primary action, active state */
--brand-deep:    #0b2463;   /* headings on light, deep surfaces */
--brand-soft:    #eaf0ff;   /* selected and information fills */
--signal-teal:   #00a6c8;   /* cyan observation accent; non-text use */
--portfolio-violet: #6656c9;/* model inference */
--decision-yellow: #f6c453; /* route / decision */
--block-red:     #c83e4d;   /* blocker */

--canvas:        #f4f7fc;
--surface:       #ffffff;
--surface-muted: #eef2f7;
--ink:           #10213d;
--ink-muted:     #61708a;
--line:          #dbe3ef;
```

### Measured contrast (sRGB, WCAG 2.1)

| Pair | Ratio | Verdict |
|---|---|---|
| `--brand-primary` on `--surface` | 7.62:1 | AAA |
| white on `--brand-primary` | 7.62:1 | AAA |
| `--brand-deep` on `--surface` | 14.52:1 | AAA |
| `--brand-primary` on `--brand-soft` | 6.68:1 | AA |
| `--ink` on `--canvas` | 14.96:1 | AAA |
| `--ink-muted` on `--canvas` | 4.66:1 | AA |
| `--portfolio-violet` on `--surface` | 5.62:1 | AA |
| `--block-red` on `--surface` | 4.94:1 | AA |
| `--ink` on `--decision-yellow` | 9.90:1 | AAA |
| `--signal-teal` on `--surface` | 2.88:1 | **Non-text accent only** |
| `--signal-teal-ink` on `--surface` | 6.77:1 | AA |

`--signal-teal` fails AA for text, so text uses `--signal-teal-ink` (#00647a, 6.77:1).
Cyan itself is reserved for borders, motifs, meters, and non-text state accents. The same applies
to `--decision-yellow`, which never carries white text; it pairs with `--ink` or
`--decision-ink` (#7a5a00).

### Semantic state tokens

Components reference these, never a raw hue:

`--state-success`, `--state-warning`, `--state-blocked`, `--state-information`,
`--state-synthetic`, `--state-model-inference`, `--state-public-evidence`

Each pairs with a `-fill`, `-ink`, and `-line` variant. **Colour is never the only signal** — every
state also carries an icon and a text label.

## 3. Typography

`Inter, "Helvetica Neue", Arial, system-ui, sans-serif` — declared as a stack, with no runtime
external font request.

| Role | Desktop | Tablet | Phone |
|---|---|---|---|
| Product display | 44–56px | 36–42px | 30–36px |
| Screen title | 30–36px | 28–30px | 24–26px |
| Section title | 20–24px | 20px | 18px |
| Card title | 16–18px | 16px | 16px |
| Body | 14–16px / 1.45–1.6 | — | — |
| Utility label | 11–12px, uppercase only where it encodes status | — | — |

Numeric decision values use `font-variant-numeric: tabular-nums`. Monospace is reserved for
evidence IDs, rule IDs, timestamps, and contract versions.

## 4. Layout

Max product width 1360px. Gutters 32 / 20 / 16px. Eight-pixel spacing scale. Top bar 64px.
Twelve-column desktop grid. Card radius 12px. One-pixel `--line` borders. Elevation only on
overlays and the selected decision surface.

Primary action and decision result stay visible without scrolling at 1366×768. Evidence scrolls
inside bounded panels or opens in a drawer.

### Cover wireframe

```
┌─ topbar ────────────────────────────── mode · synthetic · guide ─┐
├─ disclosure strip (quiet) ───────────────────────────────────────┤
│                                                                  │
│  BrandPulse NEXT                    ┌── Rexona preview ───────┐  │
│  One product sentence.              │ National + footage      │  │
│                                     │        ↓ Watch          │  │
│  [Open live decision room]          │ Four cities + creator   │  │
│  [How BrandPulse works]             │        ↓ Test           │  │
│                                     │ +1.2pp · Scale          │  │
│                                     ├── Surf ACT preview ─────┤  │
│  data + unofficial-concept note     │ Prepared → approval     │  │
│                                     └─────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Pulse Room wireframe

```
┌─ topbar ─────────────────────────────────────────────────────────┐
├─ DECISION PULSE  ●signal ─ ○evidence ─ ○route ─ ○block ─ ○test ─ ○learn ┤
│ ┌── signal replay (bounded scroll) ──┐ ┌── AI analysis ────────┐ │
│ │ 0.0s sports/news attention         │ │ Live Gemini |Fallback │ │
│ │ 0.8s search acceleration           │ │ summary               │ │
│ │ 1.6s "sweat confidence"            │ │ themes                │ │
│ │ 2.4s q-commerce (weak)             │ │ counter-hypothesis    │ │
│ │ 3.2s four cities ready             │ │ missing evidence      │ │
│ │ 4.0s national stock short          │ └───────────────────────┘ │
│ │ 4.7s match rights blocked          │ ┌── open decisions ─────┐ │
│ │ [Replay signal] [Run AI analysis]  │ │ Rexona (primary)      │ │
│ └────────────────────────────────────┘ │ Dove · Axe            │ │
└──────────────────────────────────────────────────────────────────┘
```

## 5. Signature: the Decision Pulse

One continuous rail across the guided journey:

`Signal → Evidence → Route → Blocked action → Approval → Learning`

- Six stations on a single track, each owning one accent: teal, blue, amber, red, violet, deep blue.
- Completed stations fill and show a check; the current station shows a ring; upcoming stay hollow.
- The connector fills from the previous accent to the next as the journey advances.
- It animates **only when the active station actually changes**, using opacity and transform.
- Under `prefers-reduced-motion: reduce` it renders static, with no loss of information.
- It is the intended Slide 2 screenshot element.

No other part of the interface animates ambiently.

## 6. Component roles

Distinct treatments, deliberately not one white card repeated:

| Role | Treatment |
|---|---|
| Hero decision surface | Elevated, deep-blue header band, largest type, owns the route badge |
| Evidence / source card | Flat, left provenance spine in the evidence-type accent, compact |
| Score / gate meter | Track + fill, tabular numerals, weakest gate marked |
| Blocker alert | Red left rule, tinted fill, rule ID in mono, remediation text |
| Human approval surface | Bordered in brand blue, actor line, append-only history |
| Model-inference surface | Violet spine + violet "model inference" badge, never mixed with rule output |
| Synthetic-data badge | Amber-hatched pill with a distinct icon |
| Guided conversation bubble | Floating, small, arrow anchored to its control; bottom sheet on phone |
| Expandable technical detail | Quiet summary row that discloses formulas and IDs in place |
| Learning Ledger event | Timeline with connector, mono timestamps |

## 7. Interaction states

Default, hover, focus-visible, pressed, selected, loading, disabled, blocked, complete, and
degraded/fallback are each specified. Transitions run 140–220ms on colour, opacity, and transform.
Layout height is not animated.

The focus indicator combines warm yellow with a deep-blue outer ring so it stays visible on both
light and deep-blue surfaces. The methodology dialog traps Tab/Shift+Tab, closes on Escape, and
returns focus to the invoking control. `prefers-reduced-motion: reduce` collapses all transitions and
animations to 0.01ms without removing state information.

## 8. Critique applied

Removed during the redesign because it read as generic-AI or editorial rather than as an HUL
decision tool: full-page gradients, glassmorphic top bar blur, oversized Georgia headlines
(112px), the dark full-bleed "model map" band, the eight-row landing table, repeated equal-weight
white cards, and decorative accent bars with no meaning. No chatbot mascot, no neon, no stock
photography.
