# Repo discovery (Step 0 after portable canon)

Discover repo-specific plug-in context in order:

1. **`copy-deliverable.repo.yaml`** at repo root (preferred)
2. **`AGENTS.md` / `CLAUDE.md`** — "Copy work routing" section if present
3. **`CONCEPTS.md`** — product naming if path in yaml or file exists at root
4. **Knowledge playbooks** — only paths listed in yaml `types.*.knowledge` or routing section
5. **Voice / domain skills** — only paths from yaml `voice_skills` / `domain_skills`
6. **`copy_rules_overlay`** path from yaml if set

If nothing found: portable defaults only; note in Step 9 present checklist.

Do **not** scan entire `docs/knowledge/` tree unprompted.

## Merge classification

Portable types (always available):

- `mirror-letter`, `mirror-outreach`, `twn-editorial`, `alignment-deck`
- `client-instructions`, `marketing-page`, `client-email`, `strategy-doc`

Merge additional types from yaml `types:` keys (e.g. `design-reference`, `review-pack`).

## Deploy workflow selection

If yaml `deploy.path_map` exists, pick workflow by changed file path prefix.
Else use `deploy.workflows[0]` or `CLAUDE.md` deploy notes.
