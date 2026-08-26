# Copy rules (Adrian preferences — portable)

Hard constraints for client-facing and deploy-linked copy. Apply on every
`copy-deliverable` run unless the user explicitly overrides.

Read `references/wow-bar.md` first — it is the quality bar.

## §0 The bar

See `wow-bar.md`. Repo may add signals via `copy-deliverable.repo.yaml` and
`copy_rules_overlay`.

## Titles and structure

1. **Self-explanatory titles** — topic clear from title alone.
2. **Progressive disclosure** — hero stands alone; detail in layers.
3. **Editorial page structure** — blog-post / brief shape, not data dumps.

## Voice and quality bar

4. **Blog-post quality for instructions** — narrative stage-setting, not bullet fragments.
5. **Cut weak/generic lines** — no smart-sounding empty taglines.
6. **Zero-context client communications** — sequencing, direct links, unambiguous nouns,
   signed "we" unless requested.

## Review and ship gates

7. **No self-scored impact** — use independent subagent (fresh-reader).
8. **Silent quality loop** — `auto-improve` up to 2 rounds on full tier; see SKILL Step 6.
9. **Gold-standard comparison** — diff exemplar from repo yaml when present.
10. **Deploy and link verification** — no public URLs until workflow success + link audit.

## Repo plug-in

After portable rules, read repo yaml:

- `copy_rules_overlay` if set
- Knowledge paths from `types.*.knowledge`
- `concepts` file for naming
- Voice/domain skill paths from yaml only — **not** baked into portable skill

Portable skill location: `~/.claude/skills/copy-deliverable/` (mirrored into repo by
`bootstrapskills`).
