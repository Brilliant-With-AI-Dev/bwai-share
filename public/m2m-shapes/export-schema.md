# M2M Shapes — Export Schema v2

The interactive remix GUI (`index.html` &rarr; Section D) exports and imports a
YAML document describing an ordered list of **phases**, each containing an
ordered list of **rows**. This doc is the contract: parse a YAML matching this
schema and you have a deterministic, machine-readable representation of one
&ldquo;shape&rdquo; of the bapps&harr;TWAI interview product.

The Import button accepts the same document the Export button produces.
Round-trip is required: `Export(state) → Import → state'` MUST produce the
same in-memory state.

v2 supersedes [v1's `steps:` schema](#v1-supersession-notes). v1 documents are
rejected on import with a banner; re-export from the v2 GUI.

---

## Top-level

```yaml
# m2m-shape-export
# version: 2
# variant: today | parity-plus | next-gen | custom
phases:
  - name: "Invited"
    rows:
      - actor: "Stakeholder"
        action: "Clicks the invitation link"
        why: "Wants to share their input"
        intent: ask
```

| Field     | Type                | Required | Notes                                                                                              |
| --------- | ------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `version` | integer (in header) | yes      | Always `2` for this schema. Bump if the field set changes.                                         |
| `variant` | string (in header)  | yes      | One of `today` / `parity-plus` / `next-gen` / `custom`. `custom` = user edited away from a preset. |
| `phases`  | list[Phase]         | yes      | Ordered. Position is meaningful &mdash; index 0 runs first.                                        |

The leading three `#`-comment lines (`m2m-shape-export`, `version`, `variant`)
are **part of the contract**, not pure comments. The exporter writes them; the
importer parses them. Don't remove them by hand.

---

## Phase

```yaml
- name: "Set up"
  rows:
    - <Row>
    - <Row>
```

| Field  | Type      | Required | Notes                                                                                                 |
| ------ | --------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `name` | string    | yes      | Short human-readable name, &le;80 chars. Shown on the phase header.                                   |
| `rows` | list[Row] | yes      | Ordered. Position is meaningful. May be empty (a phase with no rows is rendered but flagged on save). |

The seven canonical phase names &mdash; **Invited**, **Set up**, **Opener**,
**Conversation**, **Wrap-up**, **Report**, **Delivered** &mdash; are the
defaults the presets ship with. Custom shapes are free to rename, reorder, add,
or drop phases &mdash; the schema does not enforce the seven-phase set.

---

## Row

```yaml
- actor: "Bapps server"
  action: "Verifies the session cookie server-side"
  why: "Trust anchor for everything downstream"
  intent: verify
```

| Field    | Type                                         | Required | Notes                                                                                                                          |
| -------- | -------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `actor`  | string (one of the actor enum, or free text) | yes      | Who is doing the action. Importers SHOULD accept any string but the GUI surfaces unknown actors via the `Other` slot.          |
| `action` | string                                       | yes      | One short sentence describing the action. Plain English. Multi-line OK (YAML `\|` block scalar).                               |
| `why`    | string                                       | yes      | One short sentence explaining the purpose. Plain English.                                                                      |
| `intent` | enum (see below) or absent                   | no       | Optional structured tag. Omit or empty for "no intent". Useful when the YAML is consumed downstream for programmatic analysis. |

### Actor enum

The GUI's actor dropdown offers these values. The schema accepts any string
(forward-compat) but importers SHOULD warn on unknown actors not in this list:

| Actor           | Meaning                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| `Stakeholder`   | The person being interviewed.                                                                        |
| `App`           | What runs in the stakeholder's browser (UI / front-end code).                                        |
| `Bapps server`  | Our own server (the `apps/web` Next.js server functions / proxy / m2m-chat route).                   |
| `AI`            | The primary language model running the conversation.                                                 |
| `Observer AI`   | (Next-Gen only) a second AI watching coverage and quietly nudging the primary AI.                    |
| `Synthesis AI`  | (Next-Gen only) a third AI drafting insight fragments as the interview runs.                         |
| `TWAI Platform` | The shared platform service (chat endpoint, task steps, context assets).                             |
| `External`      | Third-party services we depend on: login (Stytch), voice transcription (Deepgram), etc.              |
| `Other`         | Free-text escape hatch. The GUI shows this as the dropdown value; the actual string can be anything. |

### Intent enum

Optional. Tags what kind of work the row represents, in product terms:

| Intent     | Meaning                                                            |
| ---------- | ------------------------------------------------------------------ |
| `ask`      | Posing a question / soliciting input.                              |
| `answer`   | Providing a response to a question.                                |
| `render`   | Displaying or playing back content.                                |
| `send`     | Forwarding / dispatching a message.                                |
| `store`    | Persisting state (context asset, insight store, long-term memory). |
| `verify`   | Authenticating, validating, or checking a claim.                   |
| `decide`   | Branching / control-flow action (e.g. wrap-up).                    |
| `observe`  | Background monitoring without speaking to the user.                |
| `generate` | Drafting / composing structured output.                            |

---

## Validation rules an importer SHOULD enforce

1. `version` MUST be `2`. v1 (`steps:`) documents MUST be rejected with a clear
   error pointing the user at re-exporting from v2.
2. `variant` MUST be one of the four allowed values (`today` / `parity-plus` /
   `next-gen` / `custom`). Unknown variants MAY be warned but SHOULD be loaded
   as `custom`.
3. `phases` MUST be a non-empty list.
4. Each phase MUST have a `name` and a `rows` field. Empty `rows` is allowed
   but SHOULD be flagged in the UI.
5. Each row MUST have `actor`, `action`, and `why` strings (any of them may
   be empty string, but the key MUST be present).
6. Unknown row fields SHOULD be preserved on import (forward-compat) but not
   used by the renderer.
7. Multi-line strings use YAML block scalars (`|`). The exporter emits `|`
   blocks at the appropriate indent; the importer reads them at the same
   indent.

---

## Round-trip guarantee

The GUI's Export button writes this format; the Import button reads it back.
Reordering phases, reordering rows within phases, renaming, adding, deleting,
and editing all four row fields all survive the round trip exactly. Anything
the parser can't handle is reported in a banner above the GUI, never silently
dropped.

Tested round-trips at ship time:

- `today` preset &rarr; export &rarr; import &rarr; equality with original
- `parity-plus` preset &rarr; export &rarr; import &rarr; equality with original
- `next-gen` preset &rarr; export &rarr; import &rarr; equality with original

---

## Example: minimal Parity-Plus shape (excerpt)

```yaml
# m2m-shape-export
# version: 2
# variant: parity-plus
phases:
  - name: "Invited"
    rows:
      - actor: "Stakeholder"
        action: "Clicks the invitation link"
        why: "Wants to share their input"
        intent: ask
      - actor: "Bapps server"
        action: "Verifies the session cookie server-side"
        why: "Trust anchor for everything downstream"
        intent: verify
  - name: "Set up"
    rows:
      - actor: "Bapps server"
        action: "Assembles real setup instructions and hands them to the platform"
        why: "Sets the AI up properly in one go"
        intent: generate
      - actor: "TWAI Platform"
        action: "Uses them directly as the AI's setup"
        why: "One round-trip disappears"
        intent: store
```

---

## v1 supersession notes

The v1 schema (`m2m-shape-export` / `version: 1` / `steps:`) modelled the
flow as a flat list of chat-message-shaped steps (`role`, `submitToLlm`,
`type` from a 12-value enum). That was too close to the LLM-chat-turn data
model and too far from how a non-technical reviewer thinks about the
interview product.

v2 reorganises around **phases** (the seven product phases the interview
actually goes through, top to bottom) and **rows of who-does-what within
each phase** (the actor &times; action grid that mirrors how a product spec
reads). Technical chat-turn detail moves out of the schema entirely and
lives instead in the page's collapsed &ldquo;Under the hood&rdquo; tech
detail.

If you have a v1 document, re-author it in the v2 GUI. There is no
automated v1 &rarr; v2 migration because the schemas describe different
things.
