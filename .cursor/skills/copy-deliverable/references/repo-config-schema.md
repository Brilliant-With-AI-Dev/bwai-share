# copy-deliverable.repo.yaml schema

Optional repo plug-in at repository root. Portable skill reads this after `wow-bar.md`.

## Top-level keys

| Key | Required | Description |
|-----|----------|-------------|
| `version` | yes | `1` |
| `eval_gate` | no | `silent` (default) or `explicit` (always show Improvements + A/B) |
| `copy_rules_overlay` | no | Path to repo-only copy rules (read after portable `copy-rules.md`) |
| `concepts` | no | Path to product naming file (e.g. `CONCEPTS.md`) |
| `deploy` | no | Deploy gate config (see below) |
| `trigger_globs` | no | For repo `copy-work.mdc` documentation |
| `types` | no | Extra deliverable types (see below) |
| `voice_skills` | no | Map of voice skill aliases → skill paths |
| `domain_skills` | no | Map of domain aliases → skill paths |
| `exemplars` | no | Map of type or alias → file path or clean route |

## deploy

```yaml
deploy:
  workflows:
    - deploy-my-site.yml
  path_map:
    sites/**: deploy-external.yml
    default: deploy-root.yml
  url_rules: docs/knowledge/do-not-share-deployment-urls-before-confirm.md
```

## types (per type)

```yaml
types:
  design-reference:
    signals: [question bank, Matt ingest]
    knowledge:
      - docs/knowledge/some-playbook.md
    exemplar: path/to/exemplar.html
    domain_skills: []
    post_draft: kw-review   # optional skill name after draft
    skip_voice_skills: true # optional
```

## voice_skills / domain_skills

```yaml
voice_skills:
  nish_outreach: .agents/skills/nish-mirror-outreach-voice/SKILL.md
domain_skills:
  mirror_letter: .agents/skills/mirror-export-publishing/SKILL.md
```

Paths are repo-relative. Skills must exist in repo (not in portable skill).
