# First Week Quest — design rationale

**Theme:** 1, Exploration & Understanding (with a Theme 4 bonus: stuck data as a doc-quality eval).
**Time spent:** ~2 hours. <!-- adjust before submitting -->

## Why this

The People Products team builds AI for hiring, onboarding, teamwork, and promotions.
Onboarding was the piece that felt most broken and most solo. A new hire reads a wiki
alone, nods along in meetings, and does not know who to ask. Remote hires feel this
hardest. I wanted something that (a) teaches by doing, (b) makes the first week a team
activity, and (c) gives the People team a signal they do not have today.

## Why Duolingo

Duolingo solved "make a boring solo task feel like a game you come back to." I borrowed
the mechanics that create momentum: a path of nodes, one question per screen, a big Check
button, instant green/amber feedback, XP, a streak, and a mascot who delivers hints.

I left out **hearts and lives** on purpose. Losing a life is a fine motivator for a
language app. It is the wrong message for someone's first week at a new job.

## What is non-obvious

1. **AI as hint-giver, not answer-giver.** Claude grades against a rubric and the wiki
   page, and returns a hint that points at where to look. The answer is revealed only
   after two misses, at half XP. This is closer to how a good buddy behaves.
2. **The rubric is visible.** A "How it grades" toggle shows the exact rubric Bean uses.
   If the grader is wrong, the new hire can see why and argue with it. Retries are free.
3. **Stuck counts are per stop, never per person.** The team board shows which stops
   collect the most wrong answers. That is a doc-quality signal, not a performance signal.
   The UI says so out loud. HR teams will care about this line.
4. **Notes from the trail.** The last stop asks the new hire to write a note for the next
   one. Notes accumulate on the board. Onboarding content gets better without anyone
   owning a doc.
5. **Remote people are visible by design.** Teammate notes and cheers carry a location
   and a "remote" tag. Stop 5 teaches the company's air-time norm. The cheer squad
   section shows 7 of 10 teammates are remote.

## Key decisions and tradeoffs

- **No database, no auth.** Progress is in localStorage; company, stops, and people are
  bundled JSON. This kept the build inside the time box and means a reviewer needs zero
  setup. Cost: no real multiplayer; cheers are scripted.
- **Fallback grader.** If there is no API key, or Claude errors, a lenient keyword grader
  runs. The demo can never dead-end on review day. Each result says which grader ran.
- **Structured outputs with Zod** for grading (`{pass, feedback, hint}`), low effort
  setting, only the relevant wiki page in context. Cheap, fast, and hard to break.
- **Scripted "Watch a team" mode** instead of websockets. Thirty seconds of fake hires
  advancing, getting stuck on Beacon, and getting cheered. It shows the multiplayer idea
  without the infrastructure.

## With more time

- Real-time cheers and presence (websockets or a small Postgres + polling).
- Generate stops from a real wiki with Claude, with a human review step.
- Buddy suggestions based on who cheers whom.
- Voice notes at stops. Manager view with cohort trends.
- An eval set for the grader: 3 right and 3 wrong answers per stop, run on every prompt change.

## Use of AI

Built with Claude Code. The transcript is submitted alongside. Roughly: I set the theme,
the Duolingo constraint, the "no hearts" rule, the per-stop-not-per-person privacy rule,
and the fallback-grader requirement. Claude drafted the data, components, and grading
prompt; I reviewed, tested every flow in the browser, and cut scope where it drifted.
