# Present checklist (Step 9 — silent default)

Deliver to Adrian:

1. **Final copy** or file paths changed
2. **Chain summary:** tier (light/full), deliverable type, steps run
3. **Fresh-reader:** count fixed / skipped
4. **Deploy status** — no clickable URL unless workflow `success` on pushed commit
5. **Config note** if `copy-deliverable.repo.yaml` missing (portable defaults only)

**Do not include** (silent `eval_gate` default):

- Improvements indicated list
- A/B regenerate ask
- Critic recommendations dump
- Self-scored quality (e.g. "9/10")

**Include only if** explicit eval path ran (`copy-eval-prompt.md`) or `eval_gate: explicit`
in repo yaml.

If Adrian rejects output, note which wow-bar signal failed; offer `/kw:compound` if a
reusable learning emerged.
