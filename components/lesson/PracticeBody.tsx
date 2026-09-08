"use client";
import { useState } from "react";
import { docById, type PracticeStop } from "@/lib/data";
import type { Grade } from "@/lib/grade";
import { btn, type BodyProps } from "./types";

/** Learn three facts → try a scenario → get coached. */
export default function PracticeBody({ stop, alreadyDone, stuckButton, setFeedback, setMood, setPassed, onWrong, onComplete }: BodyProps<PracticeStop>) {
  const [answer, setAnswer] = useState("");
  const [grade, setGrade] = useState<Grade | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [showDoc, setShowDoc] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const doc = docById(stop.docId);

  function show(g: Grade, isReveal = false) {
    setGrade(g);
    setMood(g.pass ? "party" : "think");
    if (g.pass) setPassed(true);
    setFeedback({
      key: `${attempt}-${g.pass ? "pass" : "miss"}-${isReveal ? "r" : ""}`,
      pass: g.pass,
      title: g.pass ? (isReveal ? "Okay, here it is" : "Nice!") : "Not quite",
      text: g.feedback,
      hint: !g.pass ? g.hint : undefined,
      grader: g.grader,
      xp: g.pass && !isReveal && !alreadyDone ? stop.xp : undefined,
      celebrate: g.pass && !isReveal,
    });
  }

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
      show(g);
      if (!g.pass) {
        if (g.factIndex != null) document.getElementById(`fact-${stop.id}-${g.factIndex}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
        setAttempt((a) => a + 1);
        onWrong();
      }
    } catch {
      show({ pass: false, feedback: "Clay tripped over a cable. Try again.", hint: "", factIndex: null, grader: "fallback" });
    } finally {
      setBusy(false);
    }
  }

  function reveal() {
    setRevealed(true);
    show({ pass: true, feedback: `Here it is: ${stop.reveal}`, hint: "", factIndex: null, grader: "fallback" }, true);
  }

  function proceed() {
    if (!grade?.pass) return;
    onComplete({ xp: alreadyDone ? 0 : revealed ? Math.floor(stop.xp / 2) : stop.xp, wrongCount: attempt, answer, revealed });
  }

  return (
    <>
      <section className="enter" style={{ "--i": 1 } as React.CSSProperties} aria-label="What you need to know">
        <div className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">Learn · what you need to know</div>
        <ol className="flex flex-col gap-2">
          {stop.facts.map((fact, i) => {
            const hot = !!grade && !grade.pass && grade.factIndex === i;
            return (
              <li
                key={i}
                id={`fact-${stop.id}-${i}`}
                className={[
                  "flex gap-3 rounded-2xl border-2 bg-white p-3.5 text-[15px] leading-snug text-slate-700 transition-colors duration-300",
                  hot ? "fact-pulse border-amber-400 bg-amber-50" : "border-slate-200",
                ].join(" ")}
              >
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${hot ? "bg-amber-400 text-amber-950" : "bg-sky-100 text-sky-700"}`}>
                  {i + 1}
                </span>
                <span>{fact}</span>
              </li>
            );
          })}
        </ol>
        <button type="button" onClick={() => setShowDoc((v) => !v)} className="mt-2 text-sm font-bold text-sky-600 hover:underline">
          {showDoc ? "Hide the full page" : "Read the full page →"}
        </button>
        {showDoc && doc && (
          <div className="mt-2 whitespace-pre-line rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="mb-1 font-bold">{doc.title}</div>
            {doc.body}
          </div>
        )}
      </section>

      <section className="enter flex flex-col gap-2" style={{ "--i": 2 } as React.CSSProperties} aria-label="Try it">
        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Try it</div>
        <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-4">
          <div className="text-sm font-semibold text-sky-900">{stop.scenario}</div>
          <div className="mt-1.5 text-lg font-extrabold text-slate-800">{stop.task}</div>
        </div>
      </section>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={!!grade?.pass}
        placeholder="Type your answer…"
        rows={4}
        style={{ "--i": 3 } as React.CSSProperties}
        className="enter w-full rounded-2xl border-2 border-slate-200 bg-white p-4 text-base text-slate-800 outline-none focus:border-sky-400 disabled:bg-slate-50"
      />

      <div className="enter flex items-center justify-between gap-3" style={{ "--i": 4 } as React.CSSProperties}>
        {stuckButton}
        <div className="flex gap-2">
          {grade && !grade.pass && attempt >= 2 && (
            <button type="button" onClick={reveal} className={btn.warn}>
              Show me
            </button>
          )}
          {grade?.pass ? (
            <button type="button" onClick={proceed} className={btn.go}>
              Continue
            </button>
          ) : (
            <button type="button" onClick={check} disabled={busy || !answer.trim()} className={btn.primary}>
              {busy ? "Checking…" : grade ? "Try again" : "Check"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
