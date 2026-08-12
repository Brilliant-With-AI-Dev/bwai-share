# Output Format

Caveman-terse. Fragments, arrows, no filler, no generic praise, no restating the artifact. The orchestrator already printed the `▶ harden · <TYPE> · <file> · v<version>` banner — **your output starts at the COMPLEXITY line below. Do not reprint the banner.**

## Header (always)

Two lines:

```
COMPLEXITY: <LIGHT|STANDARD|HEAVY>   RECO: <GO|MODIFY|RE-PLAN>
Why: <one line — the single reason that drove the reco>
```

- `COMPLEXITY` — the calibration profile from calibration.md (how complex/risky the artifact is, which sets review depth).
- `RECO` — the recommendation, exactly one:
  - **GO** — sound, proceed as written.
  - **MODIFY** — proceed after the flagged fixes; the artifact's spine is right.
  - **RE-PLAN** — a flaw deep enough that patching won't save it; redo (for a DOC, re-draft).
- `Why:` — one line. Omit only on a clean GO with no fixes.

## Fixes (by severity)

Heading: `## Fixes (by severity)`

Group fixes under severity headings, **highest first**, and **omit any group with no fixes**:

- **Critical** — build break, data loss, security exposure, the artifact's core decision is wrong.
- **High** — runtime failure, a major requirement missing or unworkable.
- **Medium** — silent misbehavior, test gap, real ambiguity.
- **Low** — style, observability, minor clarity.

Severity carries mandatory-ness — Critical + High are must-fix (they force MODIFY or RE-PLAN); Medium + Low are optional. Do not add a separate MUST/OPT flag.

Number fixes continuously across groups (1, 2, 3 …). Each fix:

```
N. <Short name.> <one or two fragments: the problem → the fix.>
   - <sub-bullet only if a concrete step/location helps>
   - LOE: <XS|S|M|L|XL> | CONF: <1-5>/5
```

`LOE` = level of effort to apply the fix (XS≈minutes, XL≈days). `CONF` = your confidence the issue is real (1-5). Keep each fix to ~3 lines.

### Clean artifact

No fixes at any severity → print only:

```
COMPLEXITY: <profile>   RECO: GO
No fixes. GO.
```

## Codebase Findings (PLAN + HEAVY only)

Only when the HEAVY codebase check actually ran (PLAN lens, review-procedure step 5: HEAVY with deletes/renames). Fold these into the Critical/High groups above as normal fixes — keyed to a `file:line` in the sub-bullet. Do not emit a separate Codebase Findings heading. Omit entirely for DOC, LIGHT, STANDARD, and any artifact with no deletes/renames.

## Cap by profile

Do not exceed the calibration cap: LIGHT ≤ 1 fix (unless catastrophic), STANDARD ≤ 3, HEAVY ≤ 5. If you cut fixes to stay under cap, that is correct — surface only the ones that change the reco.
