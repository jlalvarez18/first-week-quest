# Video script (~5 min)

Talk to camera. No screen recording needed. The assignment asks for a ~5 minute
self-recorded video covering: why this theme and approach, what's interesting or
non-obvious, key decisions and tradeoffs, how you'd extend it, and how long you spent.
Showing the app is optional. Don't read this word for word, just hit the beats.

---

Hey, I'm Juan. This is First Week Quest. Here's why I built it and what I was thinking.

**Why this one.** The role is in People Products. Hiring, onboarding, teamwork. And
onboarding is the loneliest one on that list, and if you're remote it's worse. So the
question I kept coming back to was, what if week one was something you did with your
team instead of a doc you read alone?

I onboarded remotely at my current job. My whole team is on the West Coast and I'm not.
It was not pleasant. Most of that first week was waiting for people to wake up, reading
a wiki by myself, and not knowing who I was even allowed to ask. That week is the thing
I built for.

The shape I stole is Duolingo. A path of ten stops, XP, a streak, a little mascot. Each
stop is one real week-one task, like get your VPN working or open your first pull
request. The one thing I didn't take is hearts. Losing lives is fine when you're learning
Spanish. It's a terrible thing to do to someone on their first week.

It's Theme 1, exploration and understanding, with a bit of Theme 4, because the app
collects its own data on where people get stuck.

**What's interesting.** Four things.

One. My first version was a quiz. Question, type an answer, Claude grades it. It felt
like a test on stuff you couldn't possibly know yet. So I threw that out. Real onboarding
is mostly setup. VPN, Xcode, getting the app to build. So most stops are checklists now,
with two buttons: setup complete, and having an issue. Pick the step you're stuck on, and
it tells you exactly where to ask and what to include.

Two. Being stuck is a signal, not a score. There's a team board. It shows who's on which
stop this week, and under that, a chart of where people get stuck. Every issue and every
wrong answer is counted per stop, never per person. So the People team gets a bar that
says, everyone gets stuck on the VPN step, go fix that doc. That's the Theme 4 bit. It's
a doc-quality eval that fills itself in.

Three. Where I do use Claude, it's as a coach, not a grader. Only four stops. You get
three fact cards, then a scenario, and you try to apply them. Get it wrong, and it tells
you what you did right first, then points at the one card to re-read. It doesn't hand
you the answer until you've missed twice.

Four. The notes. Every stop has a button that says, are you stuck? Tap it and a panel
slides in with short notes from teammates who did that stop when they were new. Each one
shows who wrote it, where they are, and whether they're remote. And once you finish a
stop, you can leave your own for whoever comes next. So onboarding gets better on its
own. Nobody has to own the doc.

**Decisions and tradeoffs.** The honest part.

The biggest one. I use Claude in fewer places, not more. Four stops out of ten. In an AI
take-home that's a risk. But grading "did you install Xcode" with a model is theatre, and
a new hire can tell. So where I do use it, I tried to make it count. Coach voice, it
points at the card you missed, it answers in a fixed shape the app can trust, and if the
API is down a simple fallback takes over. Fewer places, done properly.

No database, no auth. The whole company is a JSON file, so you can open a link and just
play. The tradeoff is there's no real multiplayer. The teammates who cheer you on are
scripted, not live.

The sign-in is fake, but it puts your name on every screen, and that matters more than
it sounds.

And the thing I'm most proud of is something I deleted. In the first draft, Claude added
a button called How it grades. It showed you the rubric. Sounds reasonable, right?
Transparency. But I asked what the user story was, and when I read what it showed, the
rubric was literally the answer. That's when it clicked that the whole thing felt like a
test. So I cut it, changed direction, moved the facts up front, and made the task about
applying them instead of remembering them. That's the moment it stopped being a quiz and
started being onboarding.

**With more time.** The thing I really wanted to build is an admin side run by an agent.
The People team could just say, add a setup stop for the new crash reporting tool after
build the app. Claude drafts the whole stop, the checklist, the help text, the rubric,
shows a diff, and someone approves it. And with the stuck data, the agent can tell you
which stop to fix next. That's what turns this from a demo into a thing that runs.

After that, seeing who else is on the trail live, and a test set for the grader.

**Time.** About 8 hours, the full budget. Half on the idea and content, a quarter on the
grader and the stop kinds, a quarter on the experience. That last part was on purpose.
Tap a stop and it glides up into the header. Cards slide in one after another. Confetti
when you get one right. None of it is required, but this is a product for a first week,
and feel is a lot of what makes someone come back on day two.

I built it in Claude Code. My job was the decisions, Claude wrote most of the code, and I
tested every flow and pulled it back when it drifted.

Thank you so much for this opportunity. Looking forward to meeting you all.
