# STANDARD Example

Input plan: a feature touching UI, API handler, persistence, and tests.

Posture: check it discovers conventions first and validates risky assumptions before broad edits; up to three fixes.

Example output:

```
COMPLEXITY: STANDARD   RECO: MODIFY
Why: persistence added before schema conventions confirmed.

## Fixes (by severity)

**Critical**
1. Schema unconfirmed. Plan writes persistence before checking existing schema patterns → avoidable rework.
   - confirm conventions in one file, then build
   - LOE: S | CONF: 4/5

**High**
2. Validation only at end. Riskiest assumption untested til late.
   - add a narrow check after step 2
   - LOE: XS | CONF: 4/5
```
