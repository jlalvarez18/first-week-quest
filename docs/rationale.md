# First Week Quest — design rationale

**Theme:** 1, Exploration & Understanding, with a Theme 4 bonus: the stuck data is a doc-quality eval.
**Time spent:** about 8 hours. Roughly half on the idea and content, a quarter on the grader and stop kinds, a quarter on the experience: the hero morph, staggered entrances, the notes reveal, the celebration.

## How to evaluate it in a minute

Open the link. Type any name and press Login. That is the whole setup. Play a checklist
stop (2 or 3), then a practice stop (6). Then open the Team board. No API key is needed:
without one a keyword grader runs and every result says which grader was used.
Everything is bundled: the company, the people, the notes. Nothing leaves your browser
except the answer you type.

## Why this

I onboarded remotely at my current job. My whole team is on the West Coast and I am
not. It was not pleasant. Most of week one was waiting for people to wake up, reading a
wiki alone, and not knowing who I was allowed to ask. That week is the problem I built for.

The People Products team owns hiring, onboarding, teamwork, and promotions. Onboarding
is the most solo part of that list and the one remote people feel hardest. I wanted
something that (a) teaches by doing, (b) makes the first week a team activity, and (c)
gives the People team a signal they do not have today: where new hires actually get stuck.

## What is non-obvious

1. **Most of week one is not a question.** It is setup: VPN, Xcode, the Apple team invite,
   getting the app to build, saying hi. So stops have kinds. Setup and action stops are
   checklists with two buttons: "Setup complete" and "Having an issue". Only four stops
   are practice, where judgment matters and a coach helps.
2. **"Having an issue" is the feature.** Pick the step, and it shows exactly where to ask
   and what to include. It counts as a stuck signal for that stop. And it opens the notes
   from people who hit the same thing. Being stuck becomes a normal, visible, useful act.
3. **Stuck is a signal, never a score.** Every wrong answer and every issue is counted per
   stop, never per person. The team board shows which stops collect the most. A tall bar
   means fix the doc, not the new hire. The UI says so in words. That is the Theme 4 part:
   an eval that fills itself in.
4. **AI as coach, not examiner.** Practice stops show three fact cards first, then a
   scenario to apply them to. Claude grades whether the facts were applied, names what
   went well first, then points at the one card to re-read. That card pulses. The answer
   is revealed only after two misses, at half XP.
5. **Notes accumulate.** Any stop can carry a note from someone who was new once, tagged
   with where they are and whether they are remote. Onboarding content gets better without
   anyone owning a doc. Seven of the ten fictional teammates are remote on purpose.

## Key decisions and tradeoffs

Each one: what I chose, why, and what it cost.

- **Fewer AI stops, not more.** Claude grades four stops out of ten. In an AI take-home
  that is a risk: less to show off. I think it is the right product call. Grading "did you
  install Xcode" with a model is theatre, and a new hire can tell. Cost: the AI surface is
  smaller. Mitigation: where it is used, it is used well (coach voice, card pointer,
  structured output, a fallback).
- **Learn, then try.** My first version asked a question and hid the wiki behind a
  "peek" button. It felt like a test of things you could not know yet. Now the facts are
  on screen and the task is to apply them. Cost: stops got easier. That is correct for
  onboarding.
- **Removed "How it grades".** It showed the rubric up front. The rubric was the answer.
  I cut it once I saw that. Cost: less visible transparency about grading. Mitigation: the
  fact cards are the rules, shown first, and every miss names which card to re-read.
- **One persona, fictional Anthropic.** A generic company made every stop feel arbitrary.
  Now you are an iOS engineer joining the Claude iOS team and every stop has a why.
  Cost: it is less general. Every person, channel, and rule is invented and the page says
  so. Mitigation: it is all data; a second persona is a second JSON file.
- **Fake sign-in.** A name on every screen without a backend. Sign out wipes progress so
  a new name never inherits someone else's checkmarks. Cost: it is a pretend SSO, and it
  says so.
- **No database, no auth.** Progress is in localStorage; company, stops, people, and
  notes are bundled JSON. A reviewer needs zero setup. Cost: no real multiplayer; cheers
  and the "watch a team" demo are scripted.
- **Fallback grader.** If there is no API key, or the call fails, a lenient keyword grader
  runs. The demo cannot dead-end on review day. Each result says which grader ran.
- **Structured outputs with Zod** for grading (`{pass, feedback, hint, factIndex}`), low
  effort setting, only the fact cards and one wiki page in context. Cheap, fast, and
  testable. The prompt changed twice from real misses: keyword spam passed once, and an
  em dash came back mangled. Both fixed with one sentence each.
- **A quarter of the time on feel.** The stop circle morphs into the lesson header. The
  trail and the fact cards stagger in. The notes slide in when you say you are stuck.
  Confetti on a pass. None of it is required. This is a product for a first week, and
  feel is a lot of what makes someone come back on day two. Cost: time I could have
  spent on a database. I would make the same call again.

## Why Duolingo

Duolingo solved "make a boring solo task feel like a game you come back to." I borrowed
the mechanics that create momentum: a path of nodes, one thing per screen, a big Check
button, instant green/amber feedback, XP, a streak, and a mascot who delivers hints.

I left out **hearts and lives** on purpose. Losing a life is a fine motivator for a
language app. It is the wrong message for someone's first week at a new job.

## With more time

- **An admin section run by an agent.** Today the stops live in a JSON file. The next
  step is an admin page where the People team edits stops by talking to Claude: "add a
  setup stop for the new crash reporting tool, put it after Build the app," or "the VPN
  step is the most-stuck item this month, rewrite its help text from these three Slack
  threads." The agent drafts the stop (kind, checklist, help, facts, rubric), shows a diff,
  and the admin approves. The stuck data feeds back in: the agent can propose which stop
  to fix next. This is the piece that makes the trail a living system instead of a doc.
- Real-time cheers and presence (websockets or a small Postgres + polling).
- Generate stops from a real wiki with Claude, with a human review step.
- Buddy suggestions based on who cheers whom. Voice notes at stops.
- An eval set for the grader: 3 right and 3 wrong answers per practice stop, run on every
  prompt change.

## Use of AI

Built with Claude Code. The transcript is submitted alongside. I set the theme, the
Duolingo constraint, no hearts, per-stop-not-per-person, the fallback grader, the persona,
the stop kinds, and which moments deserved motion. Claude drafted the data, the
components, and the grading prompt. I reviewed, tested every flow in the browser on
desktop and mobile, ran the live grader against right, wrong, and spam answers, and cut
scope where it drifted.
