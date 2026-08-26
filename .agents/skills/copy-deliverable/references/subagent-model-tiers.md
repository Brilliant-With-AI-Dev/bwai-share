# Subagent model tiers

Use judgment to assign lower-power models where quality is not sacrificed.

| Step | Subagent? | Model tier |
|------|-----------|------------|
| Fresh-reader (Step 4) | Yes | **Lower OK** (fast / inherit) |
| Link audit (Step 8) | Yes | **Lower OK** |
| Silent critic (feeds auto-improve) | Yes | **Lower OK** — materiality filter |
| Gold-standard diff (Step 7) | Yes | **Medium** |
| auto-improve reviser (Step 6) | Yes | **High / parent** |
| Explicit eval (copy-eval-prompt) | Parent | **High** |
| harden, fight-me, kw-review, draft, classify | Parent | **High** |
| Voice fidelity (Nish/TWN) | Parent | **High** — fidelity not improvement |

Parent orchestrator should run draft, classify, and adversarial skills on high-reasoning
model when available.
