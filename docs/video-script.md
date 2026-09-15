# Video script (~5 min)

Talk to camera. No screen recording needed. The assignment asks for a ~5 minute
self-recorded video covering: why this theme and approach, what's interesting or
non-obvious, key decisions and tradeoffs, how you'd extend it, and how long you spent.
Showing the app is optional. Don't read this word for word, just hit the beats.

---

Hey, I'm Juan. For my project I created First Week Quest. Let me walk you through why I built it and
what I was thinking.

**Why this one.** Well, the role is in People Products. Hiring, onboarding, teamwork. And onboarding is the loneliest one on that list, and if you're remote it's worse. So the question I kept coming back to was, what if week one was something you did with your team instead of a doc you read alone?

So, I onboarded remotely at my current job. My whole team is on the
West Coast and I'm not. And honestly, it was not pleasant. Most of that first week was
waiting for people to wake up, reading a wiki by myself, and not knowing who I was even
allowed to ask. That week is the thing I built for.



The shape I stole is Duolingo. A path, one thing per screen, XP, a streak, a little
mascot. The one thing I deliberately didn't take is hearts. Losing lives is fine when
you're learning Spanish. It's a terrible thing to do to someone on their first week.

This falls under Theme 1, exploration and understanding. It also touches Theme 4,
evaluation and data quality, because the app collects its own data on where people get
stuck. I'll show you what I mean in a second.

**What's interesting about it.** Let me give you the four things I'd actually want you
to notice.

1. My first version was basically a quiz. Question, type an answer, Claude grades it.
And it felt like a test on stuff you couldn't possibly know yet. So I threw that out.
Real onboarding is mostly setup. VPN, Xcode, getting the app to build. So most stops
are checklists now, with two buttons. Setup complete, and having an issue. The having
an issue one is the part I like. You pick the step you're stuck on, and it tells you
exactly where to ask and what to include, and it opens notes from people who got stuck
on the same thing.

1. Being stuck is a signal, not a score. Every issue and every wrong answer gets
counted per stop, never per person. So the People team gets a chart that says, hey,
everyone gets stuck on the VPN step, go fix that doc. That's the Theme 4 bit. It's
basically a doc-quality eval that fills itself in.

1. Where I do use Claude, it's as a coach, not a grader. Only four stops. You get
three fact cards, then a scenario, and you try to apply them. Get it wrong, and it
tells you what you did right first, then points at the one card to go re-read. It
doesn't hand you the answer until you've missed twice.

1. The notes. On every stop there's a button that says, are you stuck? Tap it and a
panel slides in with short notes from teammates who did that same stop when they were
new. Things like, the asset tag sticker is on the bottom of the laptop, yes you have to
flip it over. Each note shows who wrote it, where they are, and whether they're remote,
so a new hire in London sees that Lena in London got stuck here too. You can tap
"helped me" on a note, and the ones that help the most float to the top. And once you
finish a stop, you can leave your own note for whoever comes next. So the onboarding
gets better on its own, one note at a time. Nobody has to own the doc.

**Decisions and tradeoffs.** Okay, the honest part.

The biggest one. I use Claude in fewer places, not more. Four stops out of ten. In an AI
take-home that's a risk, there's less to show off. But grading "did you install Xcode"
with a model is theatre, and a new hire can tell. So where I do use it, I tried to make
it count. It talks like a coach, not a grader. When you miss, it tells you which of the
three cards to go back to. It answers in a fixed shape the app can trust, pass or fail,
feedback, hint, card number. And if the API is down or there's no key, a simple keyword
grader takes over so nothing breaks. Fewer places, done properly. I'd make that call again.

No database, no auth. The whole company is a JSON file. I did that so you could open a
link and just play, zero setup. The tradeoff is there's no real multiplayer. The cheers
are scripted.

The sign-in is fake, but it puts your name on every screen, and I think that matters
more than it sounds. Signing out wipes your progress so nobody inherits someone else's
checkmarks.

The grader has a fallback. If there's no API key, or the call fails, a dumb keyword
grader kicks in. I didn't want the demo dying on you on review day. It tells you which
one graded you.

And the thing I'm most proud of is actually something I deleted. Early on I had a
button called How it grades. It showed you the rubric. And at some point I looked at it
and went, wait, the rubric is literally the answer. So I cut it, moved the facts up
front, and made the task about applying them instead of remembering them. That's the
moment it stopped feeling like a test.

**With more time.** The thing I really wanted to build and didn't is an admin side, run
by an agent. So the People team could just say, add a setup stop for the new crash
reporting tool, put it after build the app. And Claude drafts the whole stop, the
checklist, the help text, the rubric, shows a diff, and someone approves it. And because
you've got the stuck data, the agent can tell you which stop to fix next. That's what
would turn this from a nice demo into a thing that actually runs.

After that, real-time presence, pulling stops out of a real wiki with a review step, and
an eval set for the grader so I can change the prompt without guessing.

**Time and how I used Claude.** About 8 hours, so the full budget. Roughly half was the
idea and the content, a quarter was the grader and the stop kinds, and a quarter was the
experience. I spent real time on that last part on purpose. The stop circle morphs into
the lesson header. The trail and the fact cards stagger in. The notes slide in when you
say you're stuck. Confetti when you get one right. None of that is required, but this is
a product for a first week, and feel is a lot of what makes someone come back on day two.

I built it in Claude Code. My job was the decisions. The theme, the Duolingo thing, no
hearts, per-stop not per-person, the fallback, the persona, the stop kinds, and which
moments deserved motion. Claude wrote most of the data and the components and the
prompts. I tested everything in the browser and pulled it back when it drifted.

Thank you so much for this opportunity. Looking forward to meeting ya'll.
