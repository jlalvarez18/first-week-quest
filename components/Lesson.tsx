"use client";
import { useState } from "react";
import Mascot from "./Mascot";
import Avatar from "./Avatar";
import { docById, personById, type Stop } from "@/lib/data";
import type { Grade } from "@/lib/grade";

export type LessonResult = { stop: Stop; xp: number; wrongCount: number; answer: string; revealed: boolean };

export default function Lesson({
  stop,
  alreadyDone,
  onBack,
  onComplete,
  onWrong,
}: {
  stop: Stop;
  alreadyDone: boolean;
  onBack: () => void;
  onComplete: (r: LessonResult) => void;
  onWrong: (stop: Stop) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [grade, setGrade] = useState<Grade | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [showDoc, setShowDoc] = useState(false);
  const [showRubric, setShowRubric] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const doc = docById(stop.docId);
  const author = personById(stop.noteBy);

  async function check() {
    if (!answer.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ stopId: stop.id, answer, attempt }),
      });
      const g = (await res.json()) as Grade;
      setGrade(g);
      if (!g.pass) {
        setAttempt((a) => a + 1);
        onWrong(stop);
      }
    } catch {
      setGrade({ pass: false, feedback: "Bean tripped over a cable. Try again.", hint: "", grader: "fallback" });
    } finally {
      setBusy(false);
    }
  }

  function reveal() {
    setRevealed(true);
    setGrade({ pass: true, feedback: `Here it is: ${stop.reveal}`, hint: "", grader: "fallback" });
  }

  function proceed() {
    if (!grade?.pass) return;
    onComplete({ stop, xp: alreadyDone ? 0 : revealed ? Math.floor(stop.xp / 2) : stop.xp, wrongCount: attempt, answer, revealed });
  }

  const mood = grade ? (grade.pass ? "party" : "think") : "happy";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 pb-40">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-slate-600">
          ✕ Back to path
        </button>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Stop {stop.order} · +{stop.xp} XP
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-800">
        {stop.emoji} {stop.title}
      </h1>

      {/* Bean + teammate note */}
      <div className="flex items-start gap-3">
        <Mascot mood={mood} size={64} />
        <div className="flex flex-1 flex-col gap-2">
          <div className="rounded-2xl rounded-tl-sm border-2 border-slate-200 bg-white p-4 text-lg font-semibold text-slate-800">
            {stop.prompt}
          </div>
          {author && (
            <div className="flex items-start gap-2 rounded-2xl border-2 border-sky-100 bg-sky-50 p-3 text-sm">
              <Avatar person={author} size={28} />
              <div>
                <span className="font-bold text-slate-700">{author.name}</span>
                <span className="text-slate-400"> · {author.location}{author.remote ? " · remote" : ""}</span>
                <div className="text-slate-600">&ldquo;{stop.note}&rdquo;</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm font-bold">
        <button type="button" onClick={() => setShowDoc((v) => !v)} className="rounded-full border-2 border-slate-200 bg-white px-3 py-1 text-slate-600 hover:bg-slate-50">
          📖 {showDoc ? "Hide" : "Peek at"} the wiki page
        </button>
        <button type="button" onClick={() => setShowRubric((v) => !v)} className="rounded-full border-2 border-slate-200 bg-white px-3 py-1 text-slate-600 hover:bg-slate-50">
          🧐 {showRubric ? "Hide" : "How"} it grades
        </button>
      </div>
      {showDoc && doc && (
        <div className="whitespace-pre-line rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <div className="mb-1 font-bold">{doc.title}</div>
          {doc.body}
        </div>
      )}
      {showRubric && (
        <div className="rounded-2xl border-2 border-violet-100 bg-violet-50 p-4 text-sm text-slate-700">
          <div className="mb-1 font-bold">Rubric Bean uses</div>
          {stop.rubric}
          <div className="mt-2 text-xs text-slate-500">Claude grades against this rubric and the wiki page only. Nothing else. Retries are free.</div>
        </div>
      )}

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={!!grade?.pass}
        placeholder="Type your answer…"
        rows={4}
        className="w-full rounded-2xl border-2 border-slate-200 bg-white p-4 text-base text-slate-800 outline-none focus:border-sky-400 disabled:bg-slate-50"
      />

      {/* Bottom result bar, Duolingo style */}
      <div
        className={[
          "fixed inset-x-0 bottom-0 border-t-2 p-4 transition-colors",
          grade ? (grade.pass ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50") : "border-slate-200 bg-white",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 text-sm">
            {grade ? (
              <>
                <div className={`text-lg font-extrabold ${grade.pass ? "text-emerald-700" : "text-amber-700"}`}>
                  {grade.pass ? (revealed ? "Okay, here it is" : "Nice!") : "Not quite"}
                </div>
                <div className="text-slate-700">{grade.feedback}</div>
                {!grade.pass && grade.hint && <div className="mt-1 text-slate-600">💡 {grade.hint}</div>}
                <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">graded by {grade.grader}</div>
              </>
            ) : (
              <div className="text-slate-400">Answer in your own words. Bean checks it against the wiki.</div>
            )}
          </div>
          <div className="flex gap-2">
            {grade && !grade.pass && attempt >= 2 && (
              <button type="button" onClick={reveal} className="rounded-2xl border-2 border-amber-300 bg-white px-4 py-3 font-extrabold text-amber-700 hover:bg-amber-100">
                Show me
              </button>
            )}
            {grade?.pass ? (
              <button type="button" onClick={proceed} className="rounded-2xl bg-emerald-500 px-6 py-3 font-extrabold text-white shadow-[0_4px_0_#059669] hover:translate-y-0.5 hover:shadow-[0_2px_0_#059669]">
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={check}
                disabled={busy || !answer.trim()}
                className="rounded-2xl bg-sky-500 px-6 py-3 font-extrabold text-white shadow-[0_4px_0_#0284c7] hover:translate-y-0.5 hover:shadow-[0_2px_0_#0284c7] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {busy ? "Checking…" : grade ? "Try again" : "Check"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
