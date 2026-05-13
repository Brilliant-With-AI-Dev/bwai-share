# bwai-share

Static HTML artifacts shared from Claude Code sessions for review.

Live at **https://bwai-share.vercel.app/**

## Purpose

A no-build, no-framework dump for sharing self-contained HTML deliverables (explainers, GUIs, mockups, one-off tools) that come out of Claude Code sessions. Stable URLs make them cmd-clickable and forwardable.

This is a **share/research surface, not production**. Anyone with the URL can read the contents. Do not paste secrets, customer data, or credentials.

## How to add an artifact

1. Create a directory at the repo root, slug-cased: `~/code/bwai-share/<slug>/`
2. Drop a self-contained `index.html` (plus any sibling assets) inside it.
3. Add a link to the new artifact in the root `index.html`.
4. Commit and push to `main`. Vercel auto-deploys.

## URL pattern

```
https://bwai-share.vercel.app/<slug>/
```

Example: `https://bwai-share.vercel.app/m2m-shapes/`

## Config

- `vercel.json` — `cleanUrls: true`, `trailingSlash: true`.
- No build step. Vercel serves the repo as static files.
