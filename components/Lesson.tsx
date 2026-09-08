"use client";
import { useState } from "react";
import { flushSync } from "react-dom";
import Mascot from "./Mascot";
import NotesSidebar from "./NotesSidebar";
import { docById, notesForStop, type Stop } from "@/lib/data";
import type { Grade } from "@/lib/grade";
import type { Progress } from "@/lib/progress";

export type LessonResult = { stop: Stop; xp: number; wrongCount: number; answer: string; revealed: boolean };

export default function Lesson({
  stop,
  alreadyDone,
  onBack,
  onComplete,
  onWrong,
  onPeek,
  progress,
  onPostNote,
  onHelp,
}: {
  stop: Stop;
  alreadyDone: boolean;
  onBack: () => void;
  onComplete: (r: LessonResult) => void;
  onWrong: (stop: Stop) => void;
  onPeek: (stop: Stop) => void;
  progress: Progress;
  onPostNote: (stopId: string, text: string) => void;
  onHelp: (noteId: string) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [grade, setGrade] = useState<Grade | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [showDoc, setShowDoc] = useState(false);
  const [showRubric, setShowRubric] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const doc = docById(stop.docId);
  const canPost = alreadyDone || !!grade?.pass;
  const noteCount = notesForStop(stop.id).length + progress.notes.filter((n) => n.stopId === stop.id).length;
  const sidebarProps = { stopId: stop.id, canPost, progress, onPost: (t: string) => onPostNote(stop.id, t), onHelp };

  /** Reveal or hide the notes column. The column change is a layout shift, so let the browser morph it. */
  function toggleNotes(next: boolean) {
    if (next && !canPost) onPeek(stop);
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) return setNotesOpen(next);
    doc.startViewTransition(() => flushSync(() => setNotesOpen(next)));
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
    <div className={`mx-auto grid w-full gap-7 pb-40 lg:items-start ${notesOpen ? "max-w-5xl lg:grid-cols-[1fr_340px]" : "max-w-2xl"}`}>
    <div style={{ viewTransitionName: "lesson-main" }} className="flex w-full flex-col gap-5">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-slate-600">
          ✕ Back to path
        </button>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Stop {stop.order} · +{stop.xp} XP
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span
          style={{ viewTransitionName: `stop-node-${stop.id}` }}
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-3xl ${
            alreadyDone ? "bg-emerald-500 shadow-[0_5px_0_#059669]" : "bg-amber-400 shadow-[0_5px_0_#d97706]"
          }`}
        >
          {stop.emoji}
        </span>
        <h1 style={{ viewTransitionName: `stop-title-${stop.id}` }} className="text-3xl font-extrabold text-slate-800">
          {stop.title}
        </h1>
      </div>

      {/* Bean + teammate note */}
      <div className="flex items-start gap-3">
        <Mascot mood={mood} size={64} />
        <div className="flex flex-1 flex-col">
          <div className="rounded-2xl rounded-tl-sm border-2 border-slate-200 bg-white p-4 text-lg font-semibold text-slate-800">
            {stop.prompt}
          </div>
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
        <div className="rounded-2xl border-2 border-violet-100 bg-violet-50 p-4 text-sm text-violet-950">
          <div className="mb-1 font-bold">Rubric Bean uses</div>
          {stop.rubric}
          <div className="mt-2 text-xs text-violet-700">Claude grades against this rubric and the wiki page only. Nothing else. Retries are free.</div>
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

      {!notesOpen && (
        <button
          type="button"
          onClick={() => toggleNotes(true)}
          className="group flex items-center gap-2 self-start rounded-full border-2 border-dashed border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition-colors duration-150 hover:border-sky-400 hover:text-sky-700"
        >
          <span className="transition-transform duration-200 group-hover:-rotate-12">{canPost ? "💬" : "🪤"}</span>
          {canPost ? "Leave a note for the next new hire" : "Are you stuck?"}
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-700">
            {noteCount} {noteCount === 1 ? "note" : "notes"}
          </span>
        </button>
      )}

    </div>

    {notesOpen && (
      <div style={{ viewTransitionName: "notes-column" }} className="sidebar-in sticky top-4 hidden lg:block">
        <NotesSidebar {...sidebarProps} onClose={() => toggleNotes(false)} />
      </div>
    )}

    {/* Mobile: bottom sheet */}
    {notesOpen && (
      <div className="sheet-backdrop fixed inset-0 z-50 flex items-end bg-slate-900/40 lg:hidden" onClick={() => setNotesOpen(false)}>
        <div className="sheet-in max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
          <NotesSidebar {...sidebarProps} onClose={() => setNotesOpen(false)} />
        </div>
      </div>
    )}

      {/* Bottom result bar, Duolingo style */}
      <div
        className={[
          "fixed inset-x-0 bottom-0 border-t-2 p-4 transition-colors duration-300",
          grade && "result-in",
          grade ? (grade.pass ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50") : "border-slate-200 bg-white",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
