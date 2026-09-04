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

## Artifacts

See `README.md` for the artifact structure. Adding an artifact normally means
adding a directory containing `index.html` and linking it from the root
`index.html`; commit and push directly to `main`.
