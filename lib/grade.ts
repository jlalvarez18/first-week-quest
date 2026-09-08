import { z } from "zod";
import { docById, type Stop } from "./data";

export const GradeSchema = z.object({
  pass: z.boolean(),
  feedback: z.string(),
  hint: z.string(),
  /** 0-based index of the fact card to re-read on a miss; null when none applies or on a pass. */
  factIndex: z.number().int().min(0).max(2).nullable(),
});
export type Grade = z.infer<typeof GradeSchema> & { grader: "claude" | "fallback" };

/**
 * Keyword grader used when no ANTHROPIC_API_KEY is set (and as a safety net if
 * the API call fails). Each keyword group is an OR; all groups must match (AND).
 * It is deliberately lenient: the demo must never dead-end a reviewer.
 */
export function fallbackGrade(stop: Stop, answer: string, attempt: number): Grade {
  const a = answer.toLowerCase().trim();
  const tooShort = a.split(/\s+/).filter(Boolean).length < 4;
  const missing = stop.keywords.filter((group) => !group.some((k) => a.includes(k.toLowerCase())));
  const pass = !tooShort && missing.length === 0;
  const hint = stop.hints[Math.min(attempt, stop.hints.length - 1)];
  return {
    pass,
    feedback: pass
      ? "That covers it. Nice work."
      : tooShort
        ? "Say a little more. A full sentence helps."
        : "Close, but something from the wiki page is missing.",
    hint: pass ? "" : hint,
    factIndex: pass ? null : Math.min(missing.length ? stop.keywords.indexOf(missing[0]) : 0, 2),
    grader: "fallback",
  };
}

export function buildPrompt(stop: Stop, answer: string, attempt: number) {
  const doc = docById(stop.docId);
  const facts = stop.facts.map((f, i) => `[${i}] ${f}`).join("\n");
  const system = `You are Clay, a friendly coach in a Duolingo-style onboarding game set at a fictional version of Anthropic.
The new hire is an iOS engineer joining the Claude iOS team (lead: Marcus; teammate: Lena in London; buddy: Kai on Claude Web).
They have just READ three fact cards and are now TRYING to apply them to a small scenario. This is practice, not a test.
Everything about this company in the cards is invented for the game; grade only against the cards and the rubric.
Rules:
- Grade only whether the answer applies the fact cards to the scenario, per the rubric. Do not invent extra requirements.
- pass=true when the rubric is met in spirit. Paraphrase, different wording, and reasonable extra detail are all fine.
- pass=false for empty, joke, off-topic, or keyword-spam answers, or when a required part of the rubric is missing. A real attempt is plain sentences that show the fact was applied.
- feedback: one or two short sentences, coach voice. Start with what they applied well. If pass=false, name the ONE thing to change, and refer to the fact card by what it says, not by number. Never give the full answer.
- factIndex: if pass=false, the index (0, 1, or 2) of the single fact card they should re-read. If pass=true, null.
- hint: if pass=false, one sentence pointing at that card. Attempt ${attempt + 1}: hint level ${Math.min(attempt + 1, 2)} (level 1 points at the card, level 2 nearly gives it away). If pass=true, hint is an empty string.`;
  const user = `FACT CARDS the new hire just read:
${facts}

FULL WIKI PAGE (for context only, "${doc?.title}"):
${doc?.body}

SCENARIO: ${stop.scenario}
TASK: ${stop.task}

RUBRIC: ${stop.rubric}

SUGGESTED HINTS (level 1, level 2): ${JSON.stringify(stop.hints)}

NEW HIRE'S ANSWER:
"""
${answer}
"""`;
  return { system, user };
}
