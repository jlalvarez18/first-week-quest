---
title: Stop kinds — setup, action, practice, reflect (milestone 4)
status: implemented
created: 2026-09-08
updated: 2026-09-08
branch: master
base_branch: master
base_commit: ae56c1c
implementation_commits: null
verification: live grader, full browser pass desktop + mobile, build + lint green
supersedes: []
---

# Stop kinds

Intent: a first week is mostly setup, not quizzes. Give each stop a `kind` so most stops are
checklists with "Setup complete" and "Having an issue", and only a few are Claude-coached
practice. Trail grows to 10 stops.

## Implementation outcome

- Actual changes: `Stop` is a discriminated union (`practice | setup | action | reflect`) in `lib/data.ts`. `stops.json` rewritten: 10 stops (new: Build the app, Who owns what; Meet your team, Ship something tiny, Book a coffee became checklists; Pay it forward is reflect). `Lesson.tsx` is a shell; bodies live in `components/lesson/` (`PracticeBody`, `ChecklistBody`, `ReflectBody`) with a small contract in `types.ts`. `FeedbackToast` extracted. Progress gains `checks` and `picks`. Grader rejects non-practice stops (400). Notes for the new stops; stuck baseline for 10 ids; team demo re-based. README + rationale explain the kinds.
- Plan deviations: completing a checklist shows the celebration first and turns the button into Continue, matching practice, instead of leaving the page on click. Grader prompt gained a "plain punctuation" rule after an em dash was mangled in transit.
- Verification evidence: build + lint green. POST grade for a setup stop → 400. who-owns-what wrong → factIndex 1; right → pass. learn-the-lingo right → pass. Browser: 10 nodes on the trail; stop 2 issue → VPN help shown, stuck count 1, notes opened; tick all 5 → Setup complete → toast "+10 XP" + confetti; ticks persisted in progress; Continue → completed, XP 20. Stop 8: Coffee booked disabled until a pick; pick Jun + 3 ticks → Done!. Stop 10: post note → Posted! +15 XP → finish screen; note appears on team board. Team board lists Build the app and Who owns what. Mobile: checklist and issue panel render.
- Deferred work: header XP pills wrap on very narrow screens; a compact mobile variant of StreakBar would help. Per-stop grader eval set still the next step.
