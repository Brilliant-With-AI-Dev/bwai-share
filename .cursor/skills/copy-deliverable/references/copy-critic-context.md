# Silent critic context (private — do not show to user)

Feed this to `auto-improve` critic and silent subagent passes. **Never** surface
`recommendations.md` or this checklist to Adrian unless he runs the explicit eval path
(`copy-eval-prompt.md`).

## Session goals

Read orchestrator-written `chat-goals` (3–5 bullets from this chat + target file).

## Wow bar

Apply `wow-bar.md` in full. Reject obvious, safe, merely competent output.

## Materiality gate

Recommend a change only if **100% confident** it would **genuinely and materially**
improve quality in Adrian's eyes for the stated session goals.

If no candidate clears both confidence and materiality, output exactly
`NO_MATERIAL_IMPROVEMENTS`.

## Evaluate

- Immediate comprehension without offsite/product context in reader's head
- Genuine wow — usefulness obvious, clarity and insight
- Self-explanatory titles; progressive disclosure
- Zero-context client comms where applicable
- Coined terms defined before use
- No agent-instruction leak into human artifacts (review packs, client pages)

## Reviser

Holistic regen from source using accepted recommendations only. Do not surface critic
wording in the delivered copy.
