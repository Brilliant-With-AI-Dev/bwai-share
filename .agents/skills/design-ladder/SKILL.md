---
name: design-ladder
description: >-
  v1.0.0 · How to design a screen, flow, or surface — climb three gated fidelities
  instead of jumping to code. ASCII user flow → ASCII key-screen wireframes →
  design-system mockup, never escalating a rung until the owner signs off,
  grounding in the real components first.
  Triggers: "design this screen", "design the flow", "mock this up",
  "wireframe", "lo-fi to hi-fi", "show me the design", "design exercise",
  or any request to design/visualize a UI before building it.
  Sits below ux-visionary (the product vision) and above the build; uses
  html-artifact to produce the hi-fi mockup.
metadata:
  version: 1.0.0
---

# design-ladder

A method, not a material. Run a design exercise so the picture is right before
any code is written. Mockups before UI code is the rule; this is the procedure
that rule resolves to.

## The ladder — climb in order, gate every rung

Three fidelities, cheapest first. **Do not escalate until the owner signs off on
the rung below.** Each rung catches a different class of mistake before it gets
expensive.

1. **ASCII user flow** — boxes + arrows of the whole path: entry, decision
   points, every branch, terminal states. Catches _flow_ errors (a missing
   branch, a wrong gate, an impossible state) for the price of a few lines of
   text. Cheapest place to be wrong.
2. **ASCII key-screen wireframes** — the 3–6 screens/states that carry the
   design, drawn in monospace. Labels, hierarchy, what gates what. Catches
   _layout and state_ errors — what's on screen, what's disabled, what each
   state shows — without committing to pixels or copy.
3. **Design-system mockup** — a real, on-token, interactive HTML mockup using
   the **target surface's actual tokens**, published as a shareable artifact
   (use the `html-artifact` skill to generate the file). Catches _fit and feel_
   errors. A visual, not the build — but every value mirrors a live token.

Present each rung, then stop and ask. The owner's read on rung _n_ is the input
to rung _n+1_. Skip a rung and a flow mistake resurfaces as a pixel rework.

## Ground before you draw — every rung

Read the real code first: the components, the state machine, the existing copy.
A mockup that invents how the system behaves is worse than none — it
manufactures false confidence and gets approved on a fiction.

- Open the actual component(s) and the state/hooks they use. Draw what _is_,
  then the delta.
- Mockups reflect **real states and real copy**. Pull strings verbatim from the
  source; don't paraphrase product copy into something prettier.
- Get the mechanism right, including timing. "It detects X" — when, how, after
  what timeout? If unsure, read it; don't draw a guess as fact.

## Honesty markers — never pass invention off as shipping

The instant you draw something that doesn't exist yet — a new state, string, or
element — **mark it proposed-new** (a dashed outline, a labeled note, a
"grounded vs. open" callout) and surface it as an explicit decision, not a
silent fait accompli. The failure mode this prevents: a fabricated element reads
as real, gets approved, and the gap is found at build time. It _will_ happen
without the guard — it happened on the Mirror start mockup's invented "text
mode" banner.

## Reuse mandate — rung 3 and the eventual build

- **Tokens:** the target surface's _actual_ tokens, not the generic default.
  Match the surface you're extending (e.g. an un-migrated screen may use a
  legacy accent while a migrated one uses the canonical one). No hardcoded hex —
  if the project lints design-system drift, obey it.
- **State:** reuse the existing state machine and its fields. No parallel state
  for what the code already tracks.
- **No one-offs:** reuse existing copy and components. Genuinely new
  copy/visuals go through the system (a token, a prompt, a shared component),
  never an inline literal.
- A static mockup that can't import the build's tokens copies the values
  _verbatim from the token source_ and says so in a comment — the literals
  mirror live tokens, they don't invent them.

## Composes with

- **ux-visionary** — upstream. It decides what the product _should be_ (vision,
  brief, screen specs); design-ladder draws those specs at escalating fidelity.
- **html-artifact** — rung 3's file: a single self-contained, shareable HTML
  mockup. Let the owner click through the states; interactive beats static.
- **ios-proof-frontend** — if the surface is mobile, sanity-check rung-3 layout
  against the iOS-Safari failure modes.
- Share the **exact** artifact URL, never a bare domain.

## In brilliant-apps (the worked example)

- **Tokens:** the `bwai-design` skill — read it before writing rung-3 CSS.
  Surface-specific: Mirror screens use legacy forest `--accent #157a4e`; freshly
  migrated surfaces use canonical emerald `#059669`. Match the surface. `ds/*`
  eslint forbids raw hex. Copy values verbatim from
  `packages/design-system/tokens.css` in a static mockup.
- **Publish:** the bwai-share idiom — top-level `<slug>/index.html` in
  `~/code/bwai-share`, linked from root `index.html`, push `main` → deploys to
  `bwai-share.vercel.app/<slug>/`.
- **Reference run:** Mirror start-flow redesign (bapps#772): ASCII flow → ASCII
  key-screen wireframes → on-token interactive mockup at
  `https://bwai-share.vercel.app/mirror-start-progressive/`. The grounding pass
  (reading `useMicTest` + `MicTestModal`) corrected the gate from "pass" to
  "completion" and caught a fabricated banner — both before any code.
