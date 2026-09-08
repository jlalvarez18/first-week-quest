import { z } from "zod";
import { docById, type Stop } from "./data";

export const GradeSchema = z.object({
  pass: z.boolean(),
  feedback: z.string(),
  hint: z.string(),
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
    grader: "fallback",
  };
}

export function buildPrompt(stop: Stop, answer: string, attempt: number) {
  const doc = docById(stop.docId);
  const system = `You grade answers for a playful, Duolingo-style onboarding game at a fictional company, Orbital Coffee Co.
You are warm and brief. You never shame. You give a hint, not the answer, unless the rubric says to be generous.
Rules:
- Grade ONLY against the rubric and the wiki page. Do not invent extra requirements.
- pass=true if the rubric is satisfied in spirit. Synonyms and paraphrase are fine.
- pass=false for empty, joke, or off-topic answers, or when a required part is missing.
- pass=false for keyword spam: an answer must be a real attempt in plain sentences that shows the new hire understood the task. Repeating the right word without using it correctly is not an answer.
- feedback: one or two short sentences. Name what was right first. If pass=false, name the ONE missing thing without giving the answer.
- hint: if pass=false, one sentence that points to where to look. Attempt ${attempt + 1}: use hint level ${Math.min(attempt + 1, 2)} (level 1 points at the page, level 2 nearly gives it away). If pass=true, hint is an empty string.`;
  const user = `WIKI PAGE "${doc?.title}":
${doc?.body}

TASK: ${stop.prompt}

RUBRIC: ${stop.rubric}

SUGGESTED HINTS (level 1, level 2): ${JSON.stringify(stop.hints)}

NEW HIRE'S ANSWER:
"""
${answer}
"""`;
  return { system, user };
}
