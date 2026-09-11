# Video plan (~5 minutes): the design rationale

The assignment asks the video to cover five things. Structure the video as those five,
in order. Show the app only as evidence for a point, never as a tour. Talk to camera or
over the screen, either is fine. Sign out first, key set, browser at 110%.

## 1. Why this theme and this approach (0:00–1:00)

- Theme 1, exploration and understanding, with a Theme 4 bonus.
- The role is People Products: hiring, onboarding, teamwork. Onboarding was the piece that
  felt most broken and most solo. A new hire reads a wiki alone and does not know who to ask.
  Remote hires feel it hardest.
- Duolingo solved "make a boring solo task feel like a game you come back to." I borrowed
  the shape (path, one thing per screen, XP, streak, mascot) and dropped hearts on purpose.
- Show: the trail, 5 seconds.

## 2. What makes it interesting or non-obvious (1:00–2:15)

- **Most of week one is setup, not quizzes.** Setup and action stops are checklists with
  "Setup complete" and "Having an issue". Show: stop 2, raise the VPN issue, the help text.
- **Being stuck is a signal, never a score.** Issues and wrong answers count per stop, never
  per person. That is a doc-quality eval for the People team. Show: team board, the tall bars.
- **AI as coach, not examiner.** Learn three fact cards, try a scenario, get pointed back at
  the card you missed. Show: stop 6, one wrong answer, the card pulse. Ten seconds.
- **Notes accumulate.** Every stop carries notes from people who were new once, tagged with
  location and remote. Onboarding gets better without anyone owning a doc.

## 3. Key design decisions and tradeoffs (2:15–3:30)

- **No database, no auth, bundled fictional company.** Reviewer needs zero setup. Cost: no
  real multiplayer; cheers and the "watch a team" demo are scripted.
- **Fake sign-in with a name.** Personalizes every screen without a backend. Sign out wipes
  progress so a new name never inherits checkmarks.
- **Persona: an iOS engineer joining the Claude iOS team.** Every stop has a why. All people,
  channels, and rules are invented and the page says so.
- **Fallback grader.** If there is no key or the API fails, a keyword grader runs. The demo
  never dead-ends on review day. Each result says which grader ran.
- **Removed "How it grades".** It showed the rubric up front. The rubric was the answer.
  I cut it once I saw that. Facts are shown instead; the task is application, not recall.
- **Rubric plus fact index in structured output.** Small, cheap, testable. I tightened the
  prompt twice from real misses (keyword spam passed; an em dash got mangled).

## 4. How you'd extend it (3:30–4:20)

- **Admin section run by an agent.** The People team edits stops by talking to Claude:
  "add a setup stop for the new crash tool after Build the app." The agent drafts the stop
  (kind, checklist, help, rubric), shows a diff, admin approves. The stuck data feeds back:
  the agent proposes which stop to fix next. This turns the trail into a living system.
- Real-time presence and cheers. Generate stops from a real wiki with review.
- A grader eval set: 3 right and 3 wrong answers per practice stop, run on every prompt change.

## 5. Time spent and how I used AI (4:20–5:00)

- Time: N hours. (Fill in.)
- Built with Claude Code. I set the theme, the Duolingo constraint, no hearts, per-stop not
  per-person, the fallback grader, the persona, and the stop kinds. Claude drafted data,
  components, and prompts. I tested every flow in the browser and cut scope when it drifted.
  Transcript attached.

## Before you record
- Sign out. Key set. One answer shows "graded by claude".
- Practice the stop 6 wrong answer: "Post in #claude-ios and ask the team to fix the purchase flow."
- Fill in the time-spent line here and in `docs/rationale.md`.

## If you run long
Cut the notes point in section 2 and the second bullet in section 4.
