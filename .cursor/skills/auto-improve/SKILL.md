---
name: auto-improve
description: Privately critique the latest major assistant output and return only a materially improved replacement. Use only when the user explicitly invokes /auto-improve or $auto-improve.
---

# Auto Improve

Replace the assistant's latest major output with a stronger version. Keep the critique private and apply only recommendations whose benefit survives independent judgment.

## Procedure

1. **Resolve the scope.** Use, in order:
   - The output or artifact explicitly named with the invocation.
   - The assistant's most recent major output, such as a draft, plan, report, design, or created artifact.
   - The assistant's last significant-length message.

   Include the user's request, stated preferences, constraints, and acceptance criteria as evaluation context. If no output can be identified, ask for the output to improve and stop. Complete this step only when one exact source version and its governing intent are identified.

2. **Open a private editorial room.** When the host supports subagents, create a unique, owner-only temporary directory outside the repository. Store source text there; for a file or other artifact, store a manifest that identifies the source and its delivery form. Keep the directory path available to the orchestrator for recovery. Use two fresh subagents:
   - A **critic** reads the source and context, writes `recommendations.md`, and returns only a readiness signal plus the file path.
   - A **reviser** reads the source, context, and recommendations, writes the complete replacement as `result.md` or a native-format artifact, and returns only a readiness signal plus the result path.

   Do not load `recommendations.md` into the orchestrator's conversation unless a subagent fails, the result is missing, or validation requires diagnosis. When subagents or shared temporary storage are unavailable, perform the same critic and reviser passes sequentially and keep their intermediate content private. Complete this step only when the orchestrator can retrieve the source, recommendations, and result independently without exposing the recommendations to the user.

3. **Run the critic pass.** Evaluate the whole scope, not merely obvious defects. Recommend a change only when 100% confident it would genuinely and materially improve quality in the user's eyes. Consider correctness, completeness, usefulness, structure, voice, and presentation; treat mere personal preference as no improvement.

   Assign criticality from the combined gain in:
   - clarity or concision; and
   - audience-independent reliability or determinism of interpretation.

   Rank larger combined gains above smaller ones. Group accepted candidates as `Critical`, `High`, `Medium`, or `Low`. For each candidate, write a 3–4 word stem headline, an 8–10 word description, 2–5 detail bullets of 4–8 words each, and an 8–10 word rationale. Stop adding detail at marginal-value saturation. If no candidate clears both the confidence and materiality gates, write exactly `NO_MATERIAL_IMPROVEMENTS`.

   For accepted candidates, structure `recommendations.md` as:

   ```markdown
   Generate a new version of <scope name> with the following changes/improvements:

   ### <Criticality Level>

   1. **<Stem headline>:** <Description>.
      - <Detail bullet>
      - <Detail bullet>

   **Criticality Notes**

   - **<Criticality Level>**

     1. **<Stem headline>:** <Rationale>
   ```

   Repeat only as needed. Omit the former approval request because this skill proceeds automatically. Complete this step only when every recommendation in `recommendations.md` clears both gates or the file contains only the sentinel.

4. **Run the reviser pass.** Independently judge every recommendation against the source and governing intent. Accept only changes with clear net benefit. Reject changes that introduce uncertainty, conflict with the user's intent, alter supported facts, add gratuitous length, weaken voice, or merely reflect the critic's taste. Regenerate the output holistically from the source using only the accepted recommendations; do not mechanically patch the critic's wording into it.

   Preserve the source's purpose, claims, required format, and delivery medium unless an accepted improvement requires a change. If no recommendation survives, reproduce the source unchanged. Complete this step only when the replacement is complete, self-contained, and contains no critique, recommendation list, criticality label, approval request, process note, or reference to this skill.

5. **Return only the replacement.** Read the result without reading the private recommendations unless recovery is necessary. Deliver the improved version in the same form the user would ordinarily receive the scoped output. Include no preamble, explanation, sign-off, or fenced wrapper unless that wrapper is part of the output's required format. Do not reveal the recommendations unless the user later asks for them.

## Output contract

The visible response is exactly the auto-improved output. A perfect source therefore returns unchanged; it does not return a verdict about being perfect. The one request for missing scope in step 1 is the only exception.
