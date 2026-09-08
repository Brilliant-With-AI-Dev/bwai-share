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

See `README.md` for the artifact structure. Adding an artifact normally means
adding a directory containing `index.html` and linking it from the root
`index.html`; commit and push directly to `main`.

### Edelman version status and preservation — Matt, 2026-09-08

The combined layout at `edelman-apac-alignment-map-combined-rc-20260908/` is the **Current RC**,
first and visible on the `edelman-apac/` index. Every previous candidate and draft
belongs inside the index’s default-closed Previous candidates and drafts box.
All versions show last-updated dates/times in America/Chicago, based on document
revision history rather than administrative status-label changes.

Preserve every existing URL and document’s substantive contents. New revisions
receive separate versioned URLs and matching downloads. Never overwrite content
without Matt explicitly requesting replacement of that named version. Generic
“go” or “publish” does not authorize replacement. Status metadata can be updated
when Matt reclassifies versions. Root links to the engagement sub-index only.
