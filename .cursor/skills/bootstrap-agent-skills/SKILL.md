---
name: bootstrap-agent-skills
description: Install Adrian's standard agent skills and plugins into the current repo for Claude Code, Cursor, and cloud sessions. Use when the user says "bootstrap skills", "install skills into this repo", "wire skills for cloud", "set up agent skills", or opens a new repo that needs the Compound, Matt Pocock, and personal skill packs.
argument-hint: "[--plugins-only] [--skills-only] [--no-matt] [--no-compound] [--no-personal]"
disable-model-invocation: true
---

# Bootstrap Agent Skills

Wire this repository so Claude Code, Cursor, and cloud/Cowork-compatible sessions can use Adrian's standard skill pack.

## What this installs

**Plugins** (via `.claude/settings.json` `enabledPlugins` + marketplaces):

- `compound-engineering@compound-engineering-plugin`
- `compound-knowledge@compound-knowledge-plugin`
- `mattpocock-skills@claude-plugins-official`

**Personal skills** (copied into `.claude/skills`, `.cursor/skills`, `.agents/skills`):

- auto-improve, capture-idea, catch-me-up, context-interview, design-ladder, design-shotgun, fanout, fight-me, harden, html-artifact, pr-triage, quickprompt, redteam, bootstrap-agent-skills

**Compound Knowledge skills** (Cursor/agents copies; Claude usually loads via plugin):

- kw-brainstorm, kw-compound, kw-confidence, kw-plan, kw-review, kw-work

**Matt Pocock skills** (flattened from the official plugin cache):

- Engineering: ask-matt, code-review, codebase-design, diagnosing-bugs, domain-modeling, grill-with-docs, implement, improve-codebase-architecture, prototype, research, resolving-merge-conflicts, setup-matt-pocock-skills, tdd, to-spec, to-tickets, triage, wayfinder
- Productivity: grill-me, grilling, handoff, teach, writing-great-skills

## Flags

- `--plugins-only` — only update `.claude/settings.json`
- `--skills-only` — only copy skill folders (no settings merge)
- `--no-matt` / `--no-compound` / `--no-personal` — skip that pack

## Procedure

Run from the **repository root**.

### 0) Preconditions

```bash
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"
mkdir -p .claude/skills .cursor/skills .agents/skills
```

If Claude plugins are missing locally, install/enable them (user scope):

```bash
claude plugin marketplace add EveryInc/compound-engineering-plugin 2>/dev/null || true
claude plugin marketplace add EveryInc/compound-knowledge-plugin 2>/dev/null || true
claude plugin install compound-engineering@compound-engineering-plugin -s user || true
claude plugin install compound-knowledge@compound-knowledge-plugin -s user || true
claude plugin install mattpocock-skills@claude-plugins-official -s user || true
```

### 1) Merge `.claude/settings.json` (skip if `--skills-only`)

Create or merge **without removing** existing keys:

```python
import json, os
path = ".claude/settings.json"
data = json.load(open(path)) if os.path.exists(path) else {}
data.setdefault("extraKnownMarketplaces", {})
data["extraKnownMarketplaces"]["compound-engineering-plugin"] = {
  "source": {"source": "github", "repo": "EveryInc/compound-engineering-plugin"}
}
data["extraKnownMarketplaces"]["compound-knowledge-plugin"] = {
  "source": {"source": "github", "repo": "EveryInc/compound-knowledge-plugin"}
}
data.setdefault("enabledPlugins", {})
data["enabledPlugins"]["compound-engineering@compound-engineering-plugin"] = True
data["enabledPlugins"]["compound-knowledge@compound-knowledge-plugin"] = True
data["enabledPlugins"]["mattpocock-skills@claude-plugins-official"] = True
os.makedirs(".claude", exist_ok=True)
json.dump(data, open(path, "w"), indent=2)
open(path, "a").write("\n")
print("wrote", path)
```

### 2) Copy skills (skip if `--plugins-only`)

Canonical sources (prefer first existing path):

**Personal**

- `$HOME/.claude/skills/<name>/`

**Matt Pocock**

- `$HOME/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/*/skills/engineering/<name>/`
- `$HOME/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/*/skills/productivity/<name>/`

**Compound Knowledge kw-***

- `$HOME/.claude/plugins/cache/compound-knowledge-plugin/compound-knowledge/*/skills/<name>/`

Copy with `rsync -a --delete` into:

- `.claude/skills/<name>/` (personal + matt; kw optional here)
- `.cursor/skills/<name>/` (all)
- `.agents/skills/<name>/` (all)

Also refresh user-global Cursor/agents copies:

- `$HOME/.cursor/skills/<name>/`
- `$HOME/.agents/skills/<name>/`

### 3) Report a status table

Print:

| Check | Status |
|---|---|
| `.claude/settings.json` plugins | ✅/❌ |
| personal skills present | count |
| mattpocock skills present | count |
| kw skills present | count |
| ready to commit | list paths |

Then tell the user the **cloud commit** they need:

```bash
git add .claude/settings.json .claude/skills .cursor/skills .agents/skills
git status --short
git commit -m "Bootstrap agent skills and Compound/Matt Pocock plugins for cloud"
git push
```

### 4) Cowork note

Cowork/claude.ai does **not** read repo skills alone for account skills. If the user also wants them in Claude Desktop, point them at uploading zips or re-running account skill sync. Repo commits cover **Claude Code cloud** and **Cursor cloud**.

## Guardrails

- Never overwrite unrelated project skills the user already customized unless content is identical or the user asks to replace.
- Never commit secrets, MCP tokens, or unrelated dirty files.
- Preserve existing `.claude/settings.json` permissions/hooks/plugins.
- Prefer plugin enablement for Matt Pocock / Compound over vendoring huge plugin trees twice when `--plugins-only` is requested.
