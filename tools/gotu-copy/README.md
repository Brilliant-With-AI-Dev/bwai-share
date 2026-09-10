# GoTu copy review round trips

Export → edit/comment → discuss → preview → finalize → import.

This is an explicit agent-assisted workflow. There is no two-way synchronization.
The maintained catalog preserves the 164 reconciled v10 review blocks, stable IDs,
page order, source-owner references, and exact source fingerprints.

Python 3.10+ runs the scripts; Node.js syntax-checks proposed JavaScript patches.
No Python or Node package installation is required.

## What the scripts do

- Export readable Markdown copy in a CSV, with immutable provenance columns.
- Snapshot every candidate source file, including assets, and record SHA-256 hashes.
- Keep drafts, comments, and comment resolutions separate from publishable copy.
- Require an explicit decision for changed copy or intentional deletion.
- Tie each changed block to exact, unique source replacements prepared by an agent.
- Check that added wording appears in its associated source patches.
- Show the actual source diff before finalization.
- Record editorial approval and verification references at finalization.
- Reject changed baselines, late review edits, missing IDs, ambiguous/overlapping
  patches, invalid JavaScript, unresolved annotations, and existing target versions.
- Import into a new candidate directory and emit a catalog for the next review.

**The agent still does the editorial work.** It interprets comments, discusses
options with Matt, prepares source patches, and checks the rendered experience.
This avoids guessing how a rewritten paragraph maps onto markup and dynamic code.
The scripts enforce provenance and reproducible application; they do not prove
that arbitrary source edits preserve behavior. The source diff and end-to-end
checks remain part of final review.

## 1. Export a review package

Run from the publishing repository:

```sh
python3 tools/gotu-copy/copy_roundtrip.py export \
  --repo . \
  --catalog tools/gotu-copy/catalogs/v10.json \
  --out "$HOME/Documents/GoTu-copy-review-01"
```

The output must be outside the publishing repository. Review comments and source
snapshots must never become public site artifacts. Tooling and catalogs are
excluded from deployment by `.vercelignore`.

The catalog is a reconciled inventory tied to exact source bytes. Export fails
if those bytes changed independently. An agent must reconcile the catalog with
those changes instead of silently exporting stale copy. Existing published
candidates are never treated as mutable authoring directories.

## 2. Edit, comment, and discuss

Open `review.csv`, or import it into a new Google Sheet. Filter by **Page**; rows
are already ordered by the demo flow. Do not add formulas to the review CSV.

Matt normally edits only **Draft copy (Markdown)** and **Comments**.
The agent maintains **Resolution** and **Decision** after discussion.

| Column | Contract |
| --- | --- |
| Block ID, Order, Page, Section, Provenance, Current copy | Preserve exactly. Sorting complete rows is fine; deleting rows is not. |
| Draft copy (Markdown) | Blank means retain Current. This is working copy until finalized. |
| Comments | Instructions and questions, never publishable copy. |
| Resolution | For comments, start with `resolved:` or `deferred:` and explain the disposition. |
| Decision | Blank/`keep` retains Current; `replace` uses nonempty Draft; `remove` intentionally clears copy. |

Reference stable Block IDs in chat. Examples: “COPYBLOCK-138 needs a stronger
participant invitation” or “Defer COPYBLOCK-014's modal layout request.”

After Sheet discussion, download the complete working tab as CSV and replace
`review.csv` in the package. Headers and protected values must remain intact.
The original live Sheet is not read or written automatically. Existing notes
must be carried into Comments when starting another review, not silently dropped.

Dynamic examples in the review—names, counts, timestamps, and browser validation
messages—are not instructions to hard-code those values. Preserve the underlying
expressions, participant statements, controls, field mappings, and approval logic.

## 3. Agent prepares the implementation and preview

Create exact source replacements in `patches.json`. Paths are relative to the
candidate snapshot. Each patch references one or more changed Block IDs:

```json
{
  "format": "gotu-copy-review/1",
  "patches": [
    {
      "blocks": ["COPYBLOCK-012"],
      "file": "app.js",
      "before": "btn('Get started','begin-onboarding'",
      "after": "btn('Begin here','begin-onboarding'"
    }
  ]
}
```

The example illustrates the format; it is not a proposed GoTu copy change.
Generate JSON with a JSON writer. Do not use shell substitutions for copy.
Every `before` must match exactly once; include surrounding context when needed.
Multiple occurrences require explicit patches. Changes to shared strings must
account for every affected review block. Comments and resolution notes never go
into the source patch. Additions or deletions of whole screens are outside this
copy workflow; source files and block IDs are fixed within a round.

```sh
python3 tools/gotu-copy/copy_roundtrip.py preview /path/to/review-package \
  --out /tmp/gotu-copy-preview-01
python3 -m http.server 8765 --directory /tmp/gotu-copy-preview-01
```

Read `preview.diff` and `preview-copy.json`. The preview command builds a disposable test candidate
from the source snapshot and patches. Open the returned preview path on localhost
and verify the actual UI and all affected
controls, accessibility labels, exports, and approval boundaries. Keep verification
results beside the private review package. Fix the draft and patches together.

The added-wording check is lexical: it catches missing wording, but cannot verify
screen placement, deletions, formatting, or runtime behavior. Do not treat it as
a substitute for the rendered walkthrough or source review.

## 4. Finalize the agreed wording

Only after Matt's explicit editorial approval, record the real approval reference
and the actual verification report. These fields are an audit record, not an
automatic permission grant or proof of human approval.

```sh
python3 tools/gotu-copy/copy_roundtrip.py finalize /path/to/review-package \
  --approval-reference 'Actual approving message or review reference' \
  --verification-reference '/path/to/actual-verification-report.md'
```

This freezes the accepted wording, resolutions, patches, diff, and input hashes.
Late changes invalidate import. A finalized round cannot be overwritten; export
a new round when further discussion changes the agreement.

## 5. Import explicitly

Check repository and deployed versions before choosing an unused target:

```sh
python3 tools/gotu-copy/copy_roundtrip.py import /path/to/review-package \
  --repo /path/to/bwai-share --target gotu/mirror-demo-v11
```

This is a dry run. Apply that exact package explicitly:

```sh
python3 tools/gotu-copy/copy_roundtrip.py import /path/to/review-package \
  --repo /path/to/bwai-share --target gotu/mirror-demo-v11 --apply
```

Import creates a new candidate, repoints its local assets/routes, and writes
`import-receipt.json` plus `imported-catalog.json` in the private package. Source
bytes must still match the baseline. Prior candidates remain unchanged.

Copy `imported-catalog.json` into `tools/gotu-copy/catalogs/v11.json` for the next
export. Its source hashes identify the exact new content, and refreshed function
anchors locate it. An uncommitted candidate has a null commit and an explicit
unpublished status; do not imply it has been published. After committing the
candidate, record its actual source commit in the maintained catalog.

Then run the candidate's checks and review the diff. Publishing, index updates,
and Slack messages are separate actions requiring their own authorization.
The importer performs none of them.

## Agent continuation prompt

> Continue the GoTu copy review in this package. Read START-HERE.md and the
> copy-roundtrip README. Preserve baseline/provenance columns and stable IDs.
> Reconcile Draft and Comments with me, documenting resolved/deferred requests.
> Prepare exact source patches, preview the diff, and verify the rendered copy
> and affected behavior. Finalize only when I approve the reconciled wording.
> Import the finalized package into an unused candidate when instructed. Preserve
> existing published candidates and return the new catalog for the next round.

## Verification

```sh
python3 -m unittest discover -s tools/gotu-copy -p 'test_*.py' -v
```

Tests include successive rounds, blank-as-keep, explicit deletion, provenance
corruption, missing/duplicate IDs, unresolved comments, literal URLs, missing or
ambiguous patches, invalid JavaScript, baseline conflicts, late edits, and
preservation of previous versions.

Agent-authored tooling. Initial catalog corresponds to published candidate v10,
commit `1d4f515c3fe1b3d6d1c379ab24bbb2e8734f1ceb`.
