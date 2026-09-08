# First Week Quest

Onboarding is a list of links you read alone. First Week Quest turns week one into a
Duolingo-style path you play with your team.

- **You play a new iOS engineer joining the Claude iOS team** at a fictional slice of Anthropic.
  A demo sign-in asks your name; a fake SSO screen "finds" your team and buddy. Every person,
  channel, and rule is invented.
- **10 stops**, four kinds. **Setup** and **action** stops are checklists (get your gear, build
  the app, say hi, open your first PR, book a coffee) with "Setup complete" and "Having an
  issue" buttons. **Practice** stops teach three facts and coach a scenario with Claude (lingo,
  who owns what, getting heard, a 2am page). One **reflect** stop leaves a note for the next hire.
- **Learn, then try.** Practice stops show three fact cards first, then a scenario to apply them
  to. The full wiki page is one tap away but never required.
- **Claude coaches** practice attempts against a per-stop rubric. On a miss it points at the one
  fact card to re-read (the card pulses). Wrong answers cost nothing. The answer is revealed only after two misses.
- **"Having an issue"** on a checklist shows where to ask and what to include, counts as a stuck
  signal, and opens the notes from people who hit the same thing.
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
  Progress and your name live in your browser. Sign out clears both, so a new name starts fresh.
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
