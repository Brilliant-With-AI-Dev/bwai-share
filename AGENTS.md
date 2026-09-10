# bwai-share — repository policy

`bwai-share` is a public share/research surface. Its static site is
published at https://bwai-share.vercel.app/.

## Identity and account routing

- Use currently configured credentials and attribution; a bot account is optional.
  Never impersonate a human author. Agent-authored public messages must disclose
  that they are agent-authored and unreviewed, unless posted by an identified bot.
- GitHub organization: `Brilliant-With-AI-Dev`. Repository:
  https://github.com/Brilliant-With-AI-Dev/bwai-share.
- Vercel scope: `alignmktgs-projects`. Project: `bwai-share`.
  Link with `vercel link --project bwai-share --scope alignmktgs-projects`.

## Change workflow

- Edit, commit, and push completed work directly to `main`.
- Branches, pull requests, reviews, and existing validation are optional.
- Do not require GitHub review, status-check, or direct-push workflow gates.
- Preserve secret protections and safeguards against force-push and deletion.

## Production deployments

Updates to `main` automatically deploy the public site. “Publish this” authorizes
publishing the named artifact without a second approval or mandatory PR.
Do not publish unrelated artifacts. Public hosting alone creates no extra gate.
Secrets, customer data, and credentials must not be published.

### Edelman APAC exception — Matt, 2026-09-07

Matt has blanket-approved publishing Edelman APAC information to BWAI Share,
across all sessions until further notice. This supersedes the customer-data
restriction above for this client and destination. Do not request publication
approval again for Edelman APAC content. Secrets and credentials remain prohibited;
other clients and destinations are outside this exception. Preserve agent-authorship
disclosure and any content or design review checkpoints Matt requests.

## Artifacts

See `README.md` for the artifact structure. Standalone artifacts may link directly
from the root index. Projects likely to have multiple iterations (for example,
Edelman or GoTu Quarterly Planning) must have their own project index, linked
from the main index. Link project versions through that project index.

### Project indexes and promotion — Matt, 2026-09-10

- At the top of each project index, show the most current promoted (approved)
  version and at most one new promotion candidate. Label their statuses clearly
  and separately: **Approved** and **Candidate — not approved**.
- If no version is approved, say so explicitly. Publication, recency, or an agent
  review does not confer approval. Promote only with explicit human approval.
- Put older versions and supporting work in a default-closed, toggled dropdown.
  Preserve their URLs and label each item’s status. A superseded candidate is
  still unapproved; never imply that age makes it approved.
- Always distinguish approved work from candidates in project links and status
  copy. Keep project-specific presentation rules, including Edelman’s index-only
  version labels, unless Matt explicitly changes them.
- Client/prospect-facing artifacts must be free of internal notes, working titles,
  presenter instructions, review debates, source-retrieval commentary, and other
  internal process material before publication as a candidate or promotion as
  approved. Remove this material from the published files and routes; hiding
  links or collapsing it is insufficient. Keep internal supporting work outside
  the public deployment. Retain concise audience-relevant limitations and clear
  fictional/simulated labels.
- Limit each publication to the authorized project and files. Commit and push
  completed work directly to `main`.

### Edelman version status and preservation — Matt, 2026-09-08

The combined layout at `edelman-apac-alignment-map-combined-rc-20260908/` is the **Current RC**,
first and visible on the `edelman-apac/` index. Every previous candidate and draft
belongs inside the index’s default-closed Previous candidates and drafts box.
The index shows each version’s last-updated date/time in America/Chicago, based
on document revision history rather than administrative status-label changes.
Matt requested removing version/status headers from all documents. Keep status
and timestamps on the index only; do not reintroduce document version banners.

Preserve every existing URL and document’s substantive contents. New revisions
receive separate versioned URLs and matching downloads. Never overwrite content
without Matt explicitly requesting replacement of that named version. Generic
“go” or “publish” does not authorize replacement. Status metadata can be updated
when Matt reclassifies versions. Root links to the engagement sub-index only.

Matt also authorized an in-place update to the current combined RC removing its
How to Use top navigation tab. Retain its existing URL; do not create a new version
for that removal. Other versions retain their existing navigation.

### Current RC cleanup — Matt, 2026-09-08

Matt authorized replacing the current combined RC in place: remove the entire
How to Use page and every link to it; place Blind Spots and Moonshots evidence
on their cards; remove Matt/Nish review and retrieval-status copy; and remove
the last page’s Next arrow. Keep capacity under Divergent Perspectives with
“Similar POV, Divergent Approaches.” Clarify its explanatory copy without moving
the topic, changing its category, or inventing opposition between leaders.
Keep the matching HTML download identical. Earlier versions remain preserved.
