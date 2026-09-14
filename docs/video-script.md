# Video script (~5 min, ~720 words)

Read it as written or loosely. Cues in [brackets] say what to have on screen.
Pace: about 140 words a minute. Don't rush section 3, it is the one they grade.

---

[Sign-in page on screen. Don't click yet.]

Hi, I'm Juan. This is First Week Quest. It's my take on Theme 1, exploration and
understanding, with a bit of Theme 4, because the stuck data doubles as an eval.

**Why this.** The role I'm interviewing for is People Products. Hiring, onboarding,
teamwork. Onboarding was the piece that felt most broken to me, and most lonely. A new
hire gets a list of links, reads them alone, nods along in meetings, and doesn't know
who to ask. Remote hires feel that hardest. I wanted week one to be something you do
with your team, not a doc you read by yourself.

The shape is borrowed from Duolingo. A path. One thing per screen. XP, a streak, a
mascot. I left out hearts on purpose. Losing a life is fine in a language app. It's the
wrong message on someone's first week.

[Type a name, Login, let the SSO screen play, Let's go. Trail appears.]

You play a new iOS engineer joining a fictional Claude iOS team. The sign-in is fake.
The people, the channels, the rules are all invented, and the page says so.

**What's non-obvious.** Four things.

[Open stop 2, Get your gear.]

First, most of a real first week isn't questions. It's setup. VPN, Xcode, the Apple team
invite, getting the app to build. Grading that with an LLM would be theatre. So stops
have kinds. Setup and action stops are checklists with two buttons: Setup complete, and
Having an issue.

[Click Having an issue, pick VPN. Point at the help text and the notes column.]

Having an issue is the interesting one. Pick the step, and it shows exactly where to ask
and what to include. It counts as a stuck signal for that stop. And it opens notes from
people who hit the same thing.

[Team board. Point at the tall bars.]

Second, being stuck is a signal, never a score. Wrong answers and issues are counted per
stop, never per person. A tall bar means fix the doc, not the new hire. That's a live
doc-quality eval for the People team.

[Stop 6, Who owns what. Read the three cards fast. Type the wrong answer. Card pulses.]

Third, AI as coach, not examiner. Only four stops use Claude. Each one shows three fact
cards first, then a scenario to apply them to. Get it wrong, and Claude names what you
did well, then points at the one card to re-read. That card pulses. It never gives the
answer until you've missed twice.

[Leave a note. Post it.]

Fourth, notes accumulate. Every stop carries notes from people who were new once, tagged
with where they are and whether they're remote. Onboarding gets better without anyone
owning a doc.

**Decisions and tradeoffs.** [Stay on the app, or cut to camera.]

No database, no auth. The company is bundled JSON. A reviewer needs zero setup. The cost
is no real multiplayer. Cheers and the watch-a-team demo are scripted.

Sign-in is fake but it personalizes every screen. Sign out wipes progress, so a new name
never inherits someone else's checkmarks.

The grader has a fallback. No key, or the API fails, and a keyword grader runs. The demo
never dead-ends on review day. Each result says which grader ran.

The one I'm proudest of is a thing I removed. Early on there was a How it grades button
that showed the rubric. I noticed the rubric was the answer. So I cut it, and put the
facts up front instead. The task became application, not recall. That's also when the
whole thing stopped feeling like a quiz.

And the grading prompt changed twice from real misses. Keyword spam passed once.
An em dash got mangled in transit once. Both are fixed by a line in the prompt.

**With more time.** [Sign-in page.]

The first thing I'd build is an admin section run by an agent. The People team edits
stops by talking to Claude. "Add a setup stop for the new crash tool, after Build the
app." The agent drafts the stop, kind, checklist, help text, rubric, shows a diff, and an
admin approves. The stuck data feeds back in, so the agent can say which stop to fix
next. That turns the trail into a living system.

After that: real-time presence, generating stops from a real wiki with review, and an
eval set for the grader. Three right and three wrong answers per stop, run on every
prompt change.

**Time and AI.** I spent about N hours. I built it with Claude Code. I set the theme,
the Duolingo constraint, no hearts, per-stop not per-person, the fallback grader, the
persona, and the stop kinds. Claude drafted the data, the components, and the prompts. I
tested every flow in the browser and cut scope when it drifted. The transcript is
attached.

Thanks for watching.
