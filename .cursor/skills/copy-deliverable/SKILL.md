---
name: copy-deliverable
description: >
  Cross-repo orchestrator for copy/prose/HTML deliverables. Loads repo plug-in
  copy-deliverable.repo.yaml when present. Silent auto-improve by default. Use for
  mirror letters, emails, landing pages, instructions, decks, briefs, deploy-linked HTML.
  Auto-invoke for copy work — do not wait for /copy-deliverable. Scope: copy/HTML only (6A).
---

# Copy Deliverable

**▶ copy-deliverable** — portable orchestrator. Repo-specific paths live in
`copy-deliverable.repo.yaml` at repo root, not in this skill.

Canonical skill: `~/.claude/skills/copy-deliverable/` (mirrored to `.agents/skills/` by
`bootstrapskills`).

## When to invoke (auto)

- Copy, headline, messaging, tone, rewrite, polish, letter, email, deck, brief, instructions
- Editing HTML under deploy paths (`sites/`, internal resources, etc.)
- User pastes eval / "best you can do?" → run **explicit eval path** (Step 6b)

**Do not** run full chain on engineering code artifacts (6A).

## Step 0 — Portable canon

1. `references/wow-bar.md`
2. `references/copy-rules.md`
3. `references/repo-discovery.md` → load `copy-deliverable.repo.yaml` if present
4. Repo overlay + knowledge from yaml (see discovery)
5. `concepts` file from yaml or `CONCEPTS.md` if exists

## Step 0.5 — Chat goals

Write 3–5 bullets per `references/chat-goals.md`. If rule-triggered with thin context,
use latest user message + target file path.

## Step 1 — Tier (7B)

| Tier | When | auto-improve |
|------|------|--------------|
| **Light** | diff &lt; ~15 lines OR user said tweak/typo/fix one line | Skip unless fresh-reader findings remain |
| **Full** | new page, client ship, ambiguous | Mandatory ×2 |

Default **full** when ambiguous.

## Step 2 — Classify deliverable

**Portable types:**

| Type | Signal | Default routing |
|------|--------|-----------------|
| `mirror-letter` | Mirror letter, action plan | repo `domain_skills.mirror_letter` or mirror-export |
| `mirror-outreach` | Nish email, invite | `voice_skills.nish_outreach` |
| `twn-editorial` | TWN, Nish-byline | `voice_skills.twn` |
| `alignment-deck` | Operating model deck | alignment-framing-brief → deck-build |
| `client-instructions` | Portal, runbook | context-interview if unclear |
| `marketing-page` | Public page, landing | html-artifact if rich UI |
| `client-email` | Onboarding, facilitator | zero-context rules or voice |
| `strategy-doc` | Memo, brief | kw-review after draft |

**Merge types from repo yaml** `types:` (e.g. `design-reference`, `alignment-kickoff`,
`review-pack`, `internal-ops`). Load each type's `knowledge` paths and `exemplar`.

## Step 3 — Draft

- Wow bar + copy rules + deploy-linked knowledge when yaml/types specify
- Voice skills: fidelity for Nish/TWN — do not "improve" voice
- Visual styling: only if repo points to a style-guide skill path

## Step 4 — Harden (DOC)

Run `harden` on draft. Fix Critical/High before continuing.

## Step 5 — Fresh-reader subagent

**Model: lower OK** (`references/subagent-model-tiers.md`)

Zero-context reader; comprehension only. Method:
`docs/knowledge/fresh-reader-review-catches-what-authors-cannot-see.md` when repo has it.

Apply valid findings; skip contradictions of explicit user decisions.

## Step 6 — Adversarial

| Type | Skill |
|------|-------|
| strategy-doc, alignment-deck, review-pack | kw-review or fight-me |
| mirror-letter, marketing-page | fight-me or redteam |
| outreach / TWN | voice fidelity check |

## Step 6a — Silent auto-improve (default `eval_gate: silent`)

Run `auto-improve` **even without** user `/auto-improve`.

- Evaluation context: `copy-critic-context.md` + chat-goals
- Up to **2 rounds** on full tier
- **Do not** show critic recommendations or Improvements list to user
- Deliver improved copy only

## Step 6b — Explicit eval (user pastes eval prompt OR `eval_gate: explicit`)

Run `references/copy-eval-prompt.md`:

- Show **Improvements indicated:** or **Looks good; no notes.**
- Ask A) regenerate B) more feedback
- Regen only if A

## Step 7 — Gold-standard diff

**Model: medium subagent OK**

Compare to `exemplars` in repo yaml for this type. Structure/bar, not verbatim copy.

## Step 8 — Link and deploy audit

**Link audit subagent: lower OK**

1. Pick workflow from yaml `deploy.path_map` or `CLAUDE.md`
2. No URLs until workflow `success` on pushed commit
3. Audit hrefs — no repo paths, correct domains, valid anchors

## Step 9 — Present

Follow `references/present-checklist.md` (silent default).

## STOP gates

- alignment-deck-build: after `run-state.json` operator gate
- mirror-export: never auto-send email
- Nish/TWN: fidelity over improvement

## Handoff

1. Ship (if asked)
2. design-ladder / design-shotgun for visual iteration
3. `/kw:compound` if reusable learning emerged
