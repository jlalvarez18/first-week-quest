---
title: First Week Quest — Duolingo-style multiplayer onboarding (milestone 1)
status: implemented
created: 2026-09-04
updated: 2026-09-04
branch: main
base_branch: null
base_commit: null
implementation_commits: null
verification: manual browser pass, build + lint green
supersedes: []
---

# First Week Quest — Milestone 1

## 1. Outcome

A deployed web app. A reviewer clicks "Play as new hire" and lands on a Duolingo-style path of 8 lessons ("stops") for a fake company, **Orbital Coffee Co.** Each stop is a real onboarding task. The reviewer answers, Claude grades it against a rubric and gives a hint on a miss, XP and a streak grow, and a fake team cheers along. A second tab, "Team board", shows where new hires get stuck, per stop, never per person.

Assignment theme: **Theme 1 (Exploration & Understanding)**, with Theme 4 as a bonus (stuck data as a doc-quality eval). Team fit: onboarding, morale, remote inclusion.

## 2. Approach

**Duolingo mechanics we copy:**
- A vertical winding path of round nodes. Locked, active, done. One active node at a time.
- One question per screen. Big "Check" button. Green slide-up on correct, amber slide-up with a hint on miss. Retry allowed.
- XP per stop. Daily streak flame. A short celebration screen at the end with a "share your quest" card.
- A mascot: **Bean**, a coffee bean with a hard hat. Speech bubbles carry hints and teammate notes.

**Duolingo mechanics we skip on purpose:** hearts and lives. Losing lives punishes new hires. Say this in the rationale.

**Stack:** Next.js (App Router) + TypeScript + Tailwind, deployed on Vercel. One API route calls the Anthropic Messages API for grading. No database. Bundled JSON for company, stops, people, notes. `localStorage` for progress. Demo cheers are scripted timers, not real sockets.

**Why this wins:** two-hour budget. Every piece is one file. Vercel deploy is one command. The reviewer needs zero setup.

**Tradeoff losses:** no real multiplayer; cheers are scripted. Progress is per browser. Both are honest "next steps" in the video.

## 3. Scope

**In:** path UI, 8 stops with rubrics, Claude grading + hints, XP/streak, teammate notes, scripted cheers, team board, demo reset, fallback grader if no API key.

**Non-goals:** auth, real wiki, real-time sync, sound, mobile polish, i18n, hearts.

## 4. Change map

```
app/
  page.tsx              landing: Play / Watch team
  quest/page.tsx        path + lesson screens
  team/page.tsx         team board
  api/grade/route.ts    Claude grading endpoint
components/
  Path.tsx  Lesson.tsx  Mascot.tsx  CheerToast.tsx  StreakBar.tsx
data/
  company.json          Orbital Coffee Co. mini wiki (8 short docs)
  stops.json            8 stops: prompt, rubric, hint ladder, note author
  people.json           10 fake teammates + notes + cheer lines
lib/
  grade.ts              prompt builder + JSON parse + fallback keyword grader
  progress.ts           localStorage state, XP, streak, stuck counters
docs/rationale.md       written design doc for submission
```

## 5. Execution units

1. **Scaffold + data.** Create the app, Tailwind, and all three JSON files with real content. Evidence: `npm run dev` shows stops rendered as a list.
2. **Path screen.** Winding node path with locked/active/done states and Bean mascot. Evidence: clicking the active node opens its lesson; others are inert.
3. **Grading route.** `POST /api/grade` takes `{stopId, answer}` and returns `{pass, feedback, hint}`. Claude sees only the stop rubric and the relevant wiki doc. Fallback keyword grader when `ANTHROPIC_API_KEY` is missing. Evidence: curl with a right and a wrong answer.
4. **Lesson screen.** Question, teammate note bubble, answer box, Check button, green/amber result panels, hint ladder (hint 1, then hint 2, then show answer). Evidence: full pass through stop 1 and stop 2.
5. **Progress + morale.** XP, streak flame, stuck counter per stop, scripted cheers from `people.json` firing on stop completion, finish screen with share card. Evidence: reload keeps progress; finish screen appears after stop 8.
6. **Team board + demo mode.** Board with stuck bar per stop and "new hires on each stop" avatars. "Watch a team" plays 30 seconds of fake teammates advancing and cheering. "Reset demo" button. Evidence: board updates after playing; reset clears.
7. **Deploy + rationale.** Vercel deploy with env var. Write `docs/rationale.md` and a README run section. Evidence: public URL works in a fresh incognito window with no key required for the fallback path.

Units 1 to 4 are sequential. 5 and 6 can run in parallel after 4. 7 last.

## 6. Verification

- **Manual:** play all 8 stops in incognito. Try one wrong answer per stop. Confirm hints, XP, cheers, and finish screen.
- **Grading check:** 3 right and 3 wrong answers for stop 1 via curl. Confirm no false pass on an empty or joke answer.
- **No-key path:** unset the key locally. Confirm the fallback grader still lets the demo run.
- **Live:** open the Vercel URL on a phone once. It must not break, even if it is not pretty.

## 7. Risk

- **Claude grades wrong.** Rubric per stop plus a "how it grades" toggle that shows the rubric. Retry is free.
- **API cost or outage on review day.** Fallback grader keeps the demo alive.
- **Stuck data feels like surveillance.** Counts are per stop only. State this in the rationale and in the UI copy.
- **Time overrun.** Cut order if needed: share card, then streak, then Watch a team. Never cut grading or the path.
- **Rollback:** no shared state. Redeploy previous Vercel build.

**Unresolved:** none blocking. Assumption: Next.js is fine for you. Reversible.

## Implementation outcome

- Actual changes: all 7 units built. Next.js 16 app, 3 data files, grading route with Claude structured output + keyword fallback, path/lesson/finish UI, XP/streak/cheers, team board with 30s scripted demo, README, docs/rationale.md.
- Plan deviations: connector lines between nodes were dropped (misaligned; Duolingo has none). "Show me" reveal awards half XP. Vercel deploy not run: CLI is logged out on this machine; user deploys.
- Verification evidence: `npm run build` and `npm run lint` green. Browser pass: wrong answer -> hint; right answer -> pass, +10 XP, streak 1, two cheers; two misses -> "Show me" reveal; finish screen with confetti and share card; team board demo advances hires and bumps stuck bars; mobile viewport renders. No ANTHROPIC_API_KEY on this machine, so the Claude grading path is untested live; fallback path fully tested.
- Deferred work: live Claude grading check with a key; Vercel deploy; grader eval set (3 right/3 wrong per stop).
