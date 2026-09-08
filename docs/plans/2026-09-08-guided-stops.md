---
title: Guided stops — learn, then try (milestone 2)
status: implemented
created: 2026-09-08
updated: 2026-09-08
branch: master
base_branch: master
base_commit: af00a70
implementation_commits: null
verification: live Claude grading on stops 1 and 7, build + lint green, desktop + mobile screenshots
supersedes: []
---

# Guided stops — learn, then try

## 1. Outcome

A stop no longer feels like a test of things you should already know. Each stop opens by
**teaching** in Bean's voice, then asks you to **try it** on a small scenario, then **coaches**
you on the attempt. Being wrong means "apply it differently," never "you did not know."
The full wiki page is one tap away, but you never need it to succeed.

## 2. Approach

Copy Duolingo's lesson shape: concept first, exercise second, feedback that points back to
the concept. Concretely, every stop gets three sections in a fixed order:

1. **Learn.** Bean says one line of why this matters. Under it, 3 short fact cards pulled
   from the wiki page. These are the only things the task needs. Below, a quiet link:
   "Read the full page" (the current Peek content, collapsed).
2. **Try it.** A one-line scenario, then the ask, phrased as *doing*, not *recalling*.
   "A customer was charged twice. Write the message you'd post, and where." The answer box
   and the Check / Are you stuck row stay as they are.
3. **Coach.** Claude grades against the fact cards. On a miss it names which card to
   re-read and that card pulses. The hint ladder stays. "How it grades" is removed; the
   cards *are* the rules, shown up front.

**Why this wins:** the material is on screen, so the task is application, not memory. The
fact cards also give the grader a tighter contract than free-text rubrics. Cost: the page
is longer; scenario copy must be rewritten for all 8 stops.

**Tradeoff losses:** stops become easier. That is correct for onboarding. XP values stay.

## 3. Scope

**In:** content model change, all 8 stops rewritten, Lesson layout, grader prompt and
response shape, card pulse, copy on landing/README/rationale.

**Non-goals:** new stops, changing the path, notes sidebar, team board, the morph.
Progress format is unchanged. Fallback grader keeps working (keywords stay).

## 4. Change map

```
data/stops.json           add: why (1 line), facts (3 strings), scenario, task; rewrite prompts
lib/data.ts               Stop type gains the fields; `prompt` becomes `task`
lib/grade.ts              prompt built from facts + scenario; schema adds factIndex (number|null)
app/api/grade/route.ts    passes factIndex through
components/Lesson.tsx     Learn / Try it sections; remove rubric chip; pulse card on miss
app/globals.css           card-pulse keyframe
app/page.tsx, README.md, docs/rationale.md   "guides, not quizzes" copy
```

## 5. Execution units

1. **Content model.** Extend the Stop type and rewrite `stops.json` for all 8 stops:
   `why`, `facts[3]`, `scenario`, `task`, keep `rubric`, `keywords`, `hints`, `reveal`.
   Rewrite each ask as an action ("write the message", "list what you'd do at 2am").
   Evidence: typecheck passes; every stop has exactly 3 facts.
2. **Lesson layout.** Learn section (Bean line, fact cards, "Read the full page"
   disclosure), then Try it (scenario, task, field, action row). Delete the rubric chip and
   its state. Keep `enter` stagger; cards stagger as a list.
   Evidence: screenshot at desktop and mobile widths.
3. **Coach grader.** Prompt receives facts, scenario, task, rubric. System voice: coach,
   not examiner; feedback names what was applied well, then the one thing to change,
   pointing at a fact card by number. Schema: `{pass, feedback, hint, factIndex}`.
   Fallback returns `factIndex: null`. Evidence: curl right/wrong/spam on 2 stops.
4. **Card pulse.** On a miss with `factIndex`, that card gets a 2-beat amber pulse and
   scrolls into view. Reduced motion: static amber ring only.
   Evidence: manual miss shows the pulse.
5. **Copy pass.** Landing card "Learn by doing" → "Learn, then try". README and
   rationale describe the learn-try-coach shape and why "How it grades" was removed.
   Evidence: grep for "rubric" and "How it grades" in UI copy returns nothing.

Units 1 → 2 → 3 → 4 are sequential. 5 can run any time after 2.

## 6. Verification

- Play stops 1, 5, and 7 end to end with the real key. One miss each. Confirm the
  hint names a card, the card pulses, and the pass feedback praises application.
- Fallback path with the key unset still passes/fails sensibly.
- `npm run build` and `npm run lint` green.
- Mobile: fact cards stack, sheet still opens.

## 7. Risk

- **Facts give away the answer.** Intended. The ask is application, so the facts are
  ingredients, not the answer. Stop 4 (ship a PR) and 7 (Beacon) are the check: the task
  asks for an ordered plan, not a fact.
- **Grader points at the wrong card.** Cards are numbered in the prompt; ask for the
  index explicitly; `null` is allowed. UI tolerates null.
- **Rollback:** revert the commit; progress data is untouched.

**Assumption (reversible):** fact cards always show, never collapse. Say so if you want
them collapsible after a pass.

## Implementation outcome

- Actual changes: all 5 units. stops.json rewritten (why, 3 facts, scenario, task; prompt removed). Lesson shows Learn (Bean why, numbered fact cards, full-page disclosure) then Try it (scenario + task). Grader is coach-voiced, receives numbered facts, returns factIndex; fallback maps the first missing keyword group to a card. Missed card pulses and scrolls into view. Copy updated on landing, README, rationale. "How it grades" removed.
- Plan deviations: added lib/transition.ts, a shared View Transition helper that swallows abort rejections (an uncaught InvalidStateError surfaced during testing). Two rubrics reworded to match the new asks.
- Verification evidence: live Claude, stop 1 wrong -> factIndex 0, coach feedback, hint names the card; stop 1 right -> pass. Stop 7 wrong -> factIndex 0; right -> pass praising ack/runbook/escalate. Keyword spam -> fail with a kind nudge. Browser: card 1 carried the pulse class after the miss; desktop and mobile layouts render; build and lint green.
- Deferred work: fallback grader's factIndex is a heuristic; a per-stop eval set (3 right / 3 wrong) is still the right next step.
