# SSSF Resources

## Knowledge

- [Ask Matt flow — Matt Pocock](https://github.com/mattpocock/skills/tree/main/skills/ask-matt)
  Primary map of the familiar grilling → PRD/issues → implementation → review flow. Use for: comparing SSSF roles and transitions with Matt Pocock skills.
- [SSSF README — Disler](https://github.com/disler/super-simple-software-factory/blob/de31374882e7a4e3e5b7bb9bd09e69dc2f779356/README.md)
  Primary product explanation and installation guide. Use for: purpose, architecture, starter workflows, and known limitations.
- [SSSF system overview — Disler](https://github.com/disler/super-simple-software-factory/blob/de31374882e7a4e3e5b7bb9bd09e69dc2f779356/.claude/skills/sssf/cookbooks/sssf_overview.md)
  Maintainer-authored map of phases, envelopes, layout, and operating rules. Use for: internal vocabulary and control flow.
- [Plan-build-test workflow source — Disler](https://github.com/disler/super-simple-software-factory/blob/de31374882e7a4e3e5b7bb9bd09e69dc2f779356/.claude/skills/sssf/templates/adws/adw_plan_build_test.py)
  Representative workflow implementation. Use for: seeing how planning, building, testing, repair, commit, and final acceptance connect.
- [SSSF configuration reference — Disler](https://github.com/disler/super-simple-software-factory/blob/de31374882e7a4e3e5b7bb9bd09e69dc2f779356/.claude/skills/sssf/references/config.md)
  Maintainer-authored config specification. Use for: models, tools, write boundaries, protected files, and per-agent settings.
- [SSSF handoff reference — Disler](https://github.com/disler/super-simple-software-factory/blob/de31374882e7a4e3e5b7bb9bd09e69dc2f779356/.claude/skills/sssf/references/handoff.md)
  Primary specification for typed envelopes, shared files, same-session corrections, and resumed sessions.
- [SSSF gate implementation — Disler](https://github.com/disler/super-simple-software-factory/blob/de31374882e7a4e3e5b7bb9bd09e69dc2f779356/.claude/skills/sssf/templates/adws/adw_modules/gates.py)
  Executable source for checking artifact, JSON, diff, verdict, and test claims.
- [Pi coding agent repository](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)
  Primary source for the worker runtime SSSF v1 launches. Use for: Pi sessions, models, tools, and extensions.

## Wisdom (Communities)

- [SSSF GitHub issues](https://github.com/disler/super-simple-software-factory/issues)
  Best place to test implementation assumptions with maintainers and users.
- [Pi GitHub discussions](https://github.com/badlogic/pi-mono/discussions)
  Use for: real-world questions about the worker runtime beneath SSSF.

## Gaps

- No independent production case studies yet establish reliability at scale.
- SSSF v1 documents Claude Code worker support as stubbed, not implemented.
