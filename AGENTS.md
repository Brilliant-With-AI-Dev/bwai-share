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

The latest copy revision at `edelman-apac-alignment-map-copy-revision-20260908/`
is the **Current candidate** and must appear first on `edelman-apac/`.
The morning version at `edelman-apac-alignment-map/` and editorial version at
`edelman-apac-alignment-map-candidate/` are **Earlier candidates**.
Other previews and supplements are **Earlier drafts**. No version is currently
labeled canonical or approved. Preserve all existing URLs and document contents.
Only status labels and ordering change when reclassifying versions.
New content revisions get separate versioned URLs and matching HTML downloads.
Never overwrite existing content without Matt explicitly requesting replacement
of that named version. Generic “go” or “publish” does not authorize replacement.
All Edelman links belong under the engagement sub-index; root links there only.
