# Video plan (~5 minutes)

Record the screen at 1280×800 with the browser zoomed to 110%. Talk over it. One take is
fine; two is better. Sign out first so the demo starts clean. Have the API key set.

| Time | Screen | Say |
|---|---|---|
| 0:00–0:30 | Sign-in page, don't click yet | **The problem.** Onboarding is a list of links you read alone. New hires nod along, don't know who to ask, and remote hires feel it worst. I built First Week Quest: a Duolingo-style path you play with your team. Theme 1, exploration and understanding, with an evals bonus. |
| 0:30–1:00 | Type a name, Login, SSO screen, Let's go | **Persona.** You play a new iOS engineer joining a fictional Claude iOS team. The fake SSO "finds" your team, lead, and buddy. Everything here is invented; the page says so. Note the hero morph on the mascot. |
| 1:00–1:45 | Trail. Open stop 2, Get your gear | **Most of week one is setup, not quizzes.** Tick a few items. Click Having an issue, pick VPN. Show the help text, the stuck counter line, and the notes column opening. Say: every issue raised is a per-stop signal, never per person. Finish the checklist, show the celebration. |
| 1:45–2:45 | Stop 6, Who owns what | **The AI part.** Learn, then try, then coach. Read Clay's why and the three fact cards out loud, fast. Type a wrong answer on purpose (post in #claude-ios). Show the toast, the card pulsing, and the hint that points at a card, not the answer. Then answer right. Say: Claude grades application, not recall, and the rubric is never shown up front because the rubric is the answer. |
| 2:45–3:15 | Same stop, Leave a note | **Multiplayer.** Post a note. Click Helped me on someone else's. Say: notes accumulate, so onboarding gets better without anyone owning a doc. Remote tags on every note. |
| 3:15–3:45 | Team board, hit Watch a team | **The eval angle.** Stuck per stop feeds this chart. Tall bar means fix the doc. Point at Build the app and Beacon. The 30-second demo shows hires moving and cheering. |
| 3:45–4:30 | Back to editor, or stay on the app | **Decisions and tradeoffs.** No database, no auth, bundled fake company: a reviewer needs zero setup. Fallback grader if there is no key, so the demo never dead-ends. Cheers are scripted, not websockets. Removed "How it grades" once I saw it was a cheat button. Left out Duolingo's hearts on purpose. |
| 4:30–5:00 | Sign-in page | **With more time.** An admin section where the People team edits stops by talking to an agent: "add a setup stop for the new crash tool after Build the app." The agent drafts it, shows a diff, admin approves, and the stuck data tells it what to fix next. Then: real-time presence, a grader eval set. Time spent: N hours. Built with Claude Code; transcript attached. |

## Before you record
- Sign out. Clear the browser's console noise (close devtools).
- Set the API key. Check one answer says "graded by claude".
- Update the time-spent line in `docs/rationale.md`.
- Practice the wrong answer for stop 6 so it's fast: "Post in #claude-ios and ask the team to fix the purchase flow."

## Cuts if you run long
Drop the Helped me click. Drop Watch a team and just point at the chart.
