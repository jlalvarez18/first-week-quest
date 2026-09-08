import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { isPractice, stopById } from "@/lib/data";
import { GradeSchema, buildPrompt, fallbackGrade, type Grade } from "@/lib/grade";

export const runtime = "nodejs";

/**
 * POST { stopId, answer, attempt } -> Grade
 * Uses Claude when ANTHROPIC_API_KEY is set. Falls back to the keyword grader
 * otherwise, or on any API error, so the demo never dead-ends.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { stopId?: string; answer?: string; attempt?: number }
    | null;
  const stop = body?.stopId ? stopById(body.stopId) : undefined;
  const answer = (body?.answer ?? "").toString().slice(0, 2000);
  const attempt = Math.max(0, Number(body?.attempt ?? 0) | 0);
  if (!stop) return NextResponse.json({ error: "unknown stop" }, { status: 400 });
  if (!isPractice(stop)) return NextResponse.json({ error: "this stop is not graded" }, { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(fallbackGrade(stop, answer, attempt));
  }

  try {
    const client = new Anthropic();
    const { system, user } = buildPrompt(stop, answer, attempt);
    const res = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: user }],
      output_config: { effort: "low", format: zodOutputFormat(GradeSchema) },
    });
    if (!res.parsed_output) throw new Error("no parsed output");
    // The model occasionally emits a bare newline where a dash was meant. Keep prose on one line.
    const tidy = (t: string) => t.replace(/\s*\n+\s*/g, " ").replace(/\s{2,}/g, " ").trim();
    const grade: Grade = { ...res.parsed_output, feedback: tidy(res.parsed_output.feedback), hint: tidy(res.parsed_output.hint), grader: "claude" };
    return NextResponse.json(grade);
  } catch (err) {
    console.error("grade: Claude call failed, using fallback", err);
    return NextResponse.json(fallbackGrade(stop, answer, attempt));
  }
}
