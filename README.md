# First Week Quest

Onboarding is a list of links you read alone. First Week Quest turns week one into a
Duolingo-style path you play with your team.

- **You play a new iOS engineer joining the Claude iOS team** at a fictional slice of Anthropic.
  A demo sign-in asks your name; a fake SSO screen "finds" your team and buddy. Every person,
  channel, and rule is invented.
- **8 stops**, each a real week-one task for that role: who owns App Store refunds, getting
  Xcode to sign, the release train, your first PR, getting heard on a call, a 2am page.
- **Learn, then try.** Every stop shows three fact cards first, then a scenario to apply them to.
  It is practice, not a quiz. The full wiki page is one tap away but never required.
- **Claude coaches** your attempt against a per-stop rubric. On a miss it points at the one fact
  card to re-read (the card pulses). Wrong answers cost nothing. The answer is revealed only after two misses.
- **Multiplayer feel**: every stop carries a note from a teammate who was new once.
  Finish a stop and the team cheers. Most of them are remote.
- **Team board**: where new hires get stuck, counted per stop (never per person),
  as a live signal for which docs need work.

## Run it

```bash
npm install
cp .env.example .env.local   # optional: add ANTHROPIC_API_KEY for Claude grading
npm run dev                  # http://localhost:3000
```

Without a key the app uses a keyword grader so the demo always runs. Each result
panel says which grader was used.

## Demo mode

- **Sign in** — `/`. Type any name. `/welcome` plays the fake SSO. `/quest` is the path.
  Progress and your name live in your browser, under separate keys.
- **Watch a team** — `/team?play=1`. A 30 second scripted day: hires advance, get stuck, get cheered.
- "Reset progress" / "Reset demo" buttons clear local state.

## Layout

```
app/quest        path + lesson screens          components/Path, Lesson, Finish
app/team         team board + scripted demo     components/CheerToast, Mascot (Clay)
app/api/grade    Claude grading endpoint        lib/grade.ts (prompt + fallback grader)
data/*.json      company wiki, stops, people    lib/progress.ts (localStorage, XP, streak)
docs/rationale.md  design rationale             docs/plans/  the plan this was built from
```
