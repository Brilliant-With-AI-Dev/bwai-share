# Explicit eval prompt (Adrian invokes manually)

Use when Adrian pastes the "best you can do?" prompt, asks for **Improvements indicated**,
or requests A/B before another revision. **Do not** run this on every copy-deliverable pass
when `eval_gate: silent` (default).

## Prompt contract

**Yes/no: Is that absolutely the best you can do?** Here's what I mean:

- **If and only if** there are changes that could genuinely improve the experience Adrian
  is working on — based on the **goals stated in this chat** — that you are **100%
  confident** would **genuinely and materially** improve its quality/efficacy in Adrian's
  eyes:
  - Say **"Improvements indicated:"**
  - Print numbered list of concise improvements with explanations (sentence fragments OK).
- After the list, ask:
  - **A)** regenerate a new version with the suggested updates
  - **B)** more feedback
- Else, say **"Looks good; no notes."** (Fully acceptable.)

Apply `wow-bar.md` and session `chat-goals` when evaluating.

## After Adrian picks A

Run reviser / `auto-improve` with listed improvements as context, then present improved
artifact.
