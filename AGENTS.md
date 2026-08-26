# bwai-share — repository policy

`bwai-share` is a shared, public, production repository. Its static site is
published at https://bwai-share.vercel.app/.

## Identity and account routing

- Use an identified bot account for agent-authored commits, pull requests,
  reviews, comments, and other public repository activity. Never impersonate a
  human author. Any agent-authored message not posted by an obviously identified
  bot must disclose that it is agent-authored and unreviewed.
- GitHub organization: `Brilliant-With-AI-Dev`. Repository:
  https://github.com/Brilliant-With-AI-Dev/bwai-share.
- Vercel scope: `alignmktgs-projects`. Project: `bwai-share`.
  Link with `vercel link --project bwai-share --scope alignmktgs-projects`.

## Change workflow

- Never commit or push directly to `main`.
- Create a focused branch and open a pull request for every change.
- Require passing CI and required reviews/checks before merge.
- Keep `main` protected with server-side branch protection. Do not bypass,
  weaken, or work around protection rules.
- Do not merge a pull request without explicit authorization when the acting
  agent is responsible for the merge.

## Production deployments

Updates to `main` may automatically deploy the public production site. Treat a
merge to `main`, `vercel deploy --prod`, and any other production promotion as a
production deployment. Obtain explicit user approval immediately before causing
one. Preview deployments are allowed when they do not affect production.

## Artifacts

See `README.md` for the artifact structure. Adding an artifact normally means
adding a directory containing `index.html` and linking it from the root
`index.html`; use the branch-and-PR workflow above.
