---
title: Persona + fake sign-in — iOS engineer joining the Claude iOS team (milestone 3)
status: implemented
created: 2026-09-08
updated: 2026-09-08
branch: master
base_branch: master
base_commit: 8c12e02
implementation_commits: null
verification: live grader on stops 1 and 7, full browser flow desktop + mobile, build + lint green
supersedes: []
---

# Persona + fake sign-in

Full plan text lived in the Claude Code plan file for this session. Summary of intent:
replace the generic demo company with a fictional slice of Anthropic, make the player an
iOS engineer joining the Claude iOS team, give every stop a role-specific "why", and take
the player's name from a demo sign-in screen with a fake SSO progress step.

Constraint honored: every person, channel, and rule is invented; the sign-in page says so.

## Implementation outcome

- Actual changes: `data/company.json`, `people.json`, `stops.json`, `notes.json` rewritten for the Claude iOS persona; new `data/persona.json`, `lib/user.ts`; `app/page.tsx` is now the sign-in (welcome-back state, sign out); new `app/welcome/page.tsx` fake SSO sequence (skippable, auto-continues); `/quest` and `/welcome` redirect to `/` without a name; name shown in quest intro, finish card, team board row, and the sidebar avatar (initials); `Avatar` accepts a plain look; grader system prompt names the persona; grader text normalizer for stray newlines; README + rationale updated.
- Plan deviations: none material. Fake new hires' locations moved to Dublin/San Francisco to match the new org.
- Verification evidence: grep for the old company terms is clean. Live grader: stop 1 wrong (#claude-ios) → factIndex 1; right (#subscriptions) → pass; stop 7 wrong → factIndex 0; right → pass; spam → fail. Browser: `/quest` with no name → `/`; empty submit shakes; "Sam Rivera" → `/welcome` rows resolve with checks → `/quest` intro "Welcome to the Claude iOS team, Sam"; team board row "Sam (you)"; sidebar note avatar "SR"; `/` shows "Welcome back, Sam"; sign out clears name and keeps progress; `/welcome` without name → `/`. Mobile screenshots of sign-in, welcome, and stop 1 render cleanly. `npm run build` and `npm run lint` green.
- Deferred work: Bean mascot is still a coffee bean; reskin is a separate task. Per-stop grader eval set still the right next step.
