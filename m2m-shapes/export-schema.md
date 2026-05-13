# M2M Shapes — Export Schema v1

The interactive explainer (`index.html`) exports/imports a YAML document
describing an ordered list of **prompt-flow steps**. This doc is the contract:
parse a YAML matching this schema and you have a deterministic, machine-readable
representation of one "shape" of the bapps↔TWAI prompt flow.

The Import button in the GUI accepts the same document this Export button
produces. Round-trip is required: `Export(state) → Import → state'` MUST produce
the same in-memory state.

---

## Top-level

```yaml
# m2m-shape-export
# version: 1
# variant: current | parity-plus | next-gen | custom
steps:
  - type: <step-type>
    role: <role> # optional, only for chat-message types
    submitToLlm: <bool> # optional, only for system|developer roles
    label: "<short name>"
    notes: "<free text>"
```

| Field     | Type                | Required | Notes                                                                                                |
| --------- | ------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `version` | integer (in header) | yes      | Always `1` for this schema. Bump if the field set changes.                                           |
| `variant` | string (in header)  | yes      | One of `current` / `parity-plus` / `next-gen` / `custom`. `custom` = user edited away from a preset. |
| `steps`   | list[Step]          | yes      | Ordered. Position is meaningful — index 0 runs first.                                                |

The leading three `#`-comment lines (`m2m-shape-export`, `version`, `variant`)
are **part of the contract**, not pure comments. The exporter writes them; the
importer parses them. Don't remove them by hand.

---

## Step

```yaml
- type: <one of the 12 step types below>
  role: user | system | developer | tool # optional
  submitToLlm: true | false # optional
  label: "Interview opener"
  notes: "Trigger AI's first turn via __AISTART__"
```

| Field         | Type                               | Required                                    | Notes                                                                                                                                 |
| ------------- | ---------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `type`        | enum (see below)                   | yes                                         | The kind of operation this step performs.                                                                                             |
| `role`        | `user`/`system`/`developer`/`tool` | only for chat-message types                 | Maps directly to the platform's `TaskStepChatRequest.role` (`tool` reserved for v2 use; platform doesn't accept it today).            |
| `submitToLlm` | boolean                            | only when `role` is `system` or `developer` | Append-without-submit (`false`) vs. submit-and-stream (`true`). Ignored for `user`. Platform rejects explicit `false` on `user` role. |
| `label`       | string                             | yes                                         | Short human-readable name, ≤80 chars. Shown on the row.                                                                               |
| `notes`       | string                             | no                                          | Free text describing intent. Multi-line OK (use YAML `\|` block).                                                                     |

---

## `type` values

The 12 step types fall into three buckets: **end-shape primitives**, **legacy
hacks** (kept so we can describe the current shape honestly), and **v2 building
blocks** that lean on platform features which may or may not be there yet.

### End-shape primitives (v1 Parity-Plus uses these)

| Type                           | Role required | `submitToLlm` valid? | What it represents                                                                                                                                                    |
| ------------------------------ | ------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `system-prompt-override`       | `system`      | n/a                  | `promptOverrides.system` on the first `__AISTART__` request. Layer-4 system-prompt override. **Valid only on first request of a step's session.**                     |
| `user-message`                 | `user`        | always `true`        | A real end-user chat message (or the literal `__AISTART__` AIStart trigger). Carried in `TaskStepChatRequest` body.                                                   |
| `assistant-response`           | (none)        | n/a                  | An AI turn — streamed JSON `{visible_message, data}` per the platform's chat endpoint. Doesn't require a row in the request flow; included as a marker between turns. |
| `system-message-append`        | `system`      | yes                  | Mid-conversation `role: system` message. `submitToLlm: false` = append to history without an AI turn; `true` = system message that triggers an assistant response.    |
| `developer-instruction-append` | `developer`   | yes                  | Mid-conversation `role: developer` message. Same submit-vs-append semantics as the system variant.                                                                    |

### Side-channel reads/writes

| Type                        | Role required | What it represents                                                                                                                                                                        |
| --------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `context-asset-write`       | n/a           | Direct `POST /api/context-assets` (`m2m:write:context-assets`). Persist a fact/note for a downstream step.                                                                                |
| `context-asset-read`        | n/a           | `GET /api/context-assets`. Pull a previously-persisted asset (or one emitted as part of an `assistant-response`'s `data.context_assets`).                                                 |
| `structured-output-extract` | n/a           | Capture typed fragments from an assistant turn's `data` object (`additionalProperties: true`) into bapps server state. Doesn't hit a new endpoint — it's how bapps consumes the response. |

### v2 building blocks (may exceed platform today — see capability matrix)

| Type            | What it represents                                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tool-call`     | The AI requests an external action (file upload, calendar lookup, follow-up scheduling). **Platform does not expose tool-calling today** — represented for design. |
| `agent-handoff` | Bapps server pivots the active step to a different prompt template (e.g. Interviewer → Synthesis agent). Coordinated by bapps; platform has no "agent" primitive.  |

### Legacy hacks (only valid in `variant: current`)

| Type                    | Role required | What it represents                                                                                                                                                                |
| ----------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hidden-injection`      | `user`        | A browser-issued `role: user` message whose `content` contains `<hidden>...</hidden>` system instructions. The "prompt leak" path the migration kills.                            |
| `transcriber-roundtrip` | (none)        | The `context-asset-transcriber` step's full lifecycle: bapps sends combined prompt as a fake user message; platform copies it verbatim into the `interview_prompt` context asset. |

---

## Validation rules an importer SHOULD enforce

1. `version` MUST be `1`. Future versions bump this.
2. `variant` MUST be one of the four allowed values.
3. Each `step.type` MUST be one of the 12 allowed values.
4. If `type` is `system-prompt-override`, the step SHOULD be index 0 (platform
   rejects `promptOverrides` after the first request of a session). The
   importer MAY warn but MUST NOT silently drop later occurrences.
5. If `role` is `user`, `submitToLlm` MUST be absent or `true`. Platform 400s
   on explicit `false` for user.
6. If `type` is `hidden-injection` or `transcriber-roundtrip`, `variant` SHOULD
   be `current`. The importer MAY warn if seen in another variant.
7. Unknown fields on a step SHOULD be preserved (forward-compat) but not used.

---

## Example: a minimal Parity-Plus shape

```yaml
# m2m-shape-export
# version: 1
# variant: parity-plus
steps:
  - type: system-prompt-override
    role: system
    label: "Interviewer persona + topic guide + form context"
    notes: |
      promptOverrides.system on the interview step's __AISTART__ call.
      Replaces today's transcriber roundtrip AND the <hidden> form-input
      injection (form data is interpolated into the system template
      server-side, not smuggled in a user message).
  - type: user-message
    role: user
    label: "AISTART trigger"
    notes: "content = __AISTART__ — kicks off the AI's opening turn"
  - type: assistant-response
    label: "Opening question"
  - type: user-message
    role: user
    label: "Stakeholder's first answer"
  - type: assistant-response
    label: "Follow-up turn (loop until coverage)"
  - type: system-message-append
    role: system
    submitToLlm: false
    label: "Report-mode flip"
    notes: |
      Replaces today's <hidden>/generate-report wrapper. Server-side
      injection of the deliverable instructions; user never sees it.
  - type: user-message
    role: user
    label: "Closing-questions response (or skip marker)"
  - type: assistant-response
    label: "Deliverable streams as <deliverable>...</deliverable>"
```

---

## Round-trip guarantee

The GUI's Export button writes this format; the Import button reads it back.
Reordering, type changes, label edits, and notes edits all survive the round
trip exactly. Anything the parser can't handle is reported in a banner above
the GUI, never silently dropped.
