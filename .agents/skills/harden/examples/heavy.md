# HEAVY Example

Input plan: migrate auth/session handling across services.

Posture: rollback, compatibility, observability, and security are central; separate mandatory controls from polish; look for a simpler staged rollout.

Example output:

```
COMPLEXITY: HEAVY   RECO: RE-PLAN
Why: behavior change bundled with migration, no rollback path.

## Fixes (by severity)

**Critical**
1. No rollback. Auth migration + behavior change ship together → lockout is hard to debug under load, no recovery.
   - split migration from behavior change; stage behind a flag
   - LOE: M | CONF: 5/5
2. No compat window. Old and new session formats not both honored during cutover.
   - dual-read sessions until migration drains
   - LOE: M | CONF: 4/5
```
