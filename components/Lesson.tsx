"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import Mascot from "./Mascot";
import NotesSidebar from "./NotesSidebar";
import FeedbackToast, { type Feedback } from "./FeedbackToast";
import PracticeBody from "./lesson/PracticeBody";
import ChecklistBody from "./lesson/ChecklistBody";
import ReflectBody from "./lesson/ReflectBody";
import type { Mood } from "./lesson/types";
import { notesForStop, type Stop } from "@/lib/data";
import type { Progress } from "@/lib/progress";
import { withViewTransition } from "@/lib/transition";

export type LessonResult = { stop: Stop; xp: number; wrongCount: number; answer: string; revealed: boolean };

/**
 * The lesson shell: header (hero morph target), Clay's why, the kind-specific body, the
 * notes column or sheet, and the feedback toast. Bodies talk back through a small contract
 * (see lesson/types.ts) so the shell owns everything that looks the same across kinds.
 */
export default function Lesson({
  stop,
  alreadyDone,
  onBack,
  onComplete,
  onWrong,
  onPeek,
  onCheck,
  onPick,
  progress,
  userName,
  onPostNote,
  onHelp,
}: {
  stop: Stop;
  alreadyDone: boolean;
  onBack: () => void;
  onComplete: (r: LessonResult) => void;
  onWrong: (stop: Stop) => void;
  onPeek: (stop: Stop) => void;
  onCheck: (stopId: string, itemId: string, on: boolean) => void;
  onPick: (stopId: string, personId: string) => void;
  progress: Progress;
  userName: string;
  onPostNote: (stopId: string, text: string) => void;
  onHelp: (noteId: string) => void;
}) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [mood, setMood] = useState<Mood>("happy");
  const [passed, setPassed] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const canPost = alreadyDone || passed;
  const noteCount = notesForStop(stop.id).length + progress.notes.filter((n) => n.stopId === stop.id).length;
  const sidebarProps = { stopId: stop.id, canPost, progress, userName, onPost: (t: string) => onPostNote(stop.id, t), onHelp };

  /** Reveal or hide the notes column. On wide screens the column change is a layout shift the browser morphs. */
  function toggleNotes(next: boolean, countPeek = true) {
    if (next && countPeek && !canPost) onPeek(stop);
    withViewTransition(() => setNotesOpen(next), { wideOnly: true });
  }

  const stuckButton = !notesOpen ? (
    <button
      type="button"
      onClick={() => toggleNotes(true)}
      className="group flex items-center gap-2 rounded-full border-2 border-dashed border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition-colors duration-150 hover:border-sky-400 hover:text-sky-700"
    >
      <span className="transition-transform duration-200 group-hover:-rotate-12">{canPost ? "💬" : "🪤"}</span>
      {canPost ? "Leave a note for the next new hire" : "Are you stuck?"}
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-700">
        {noteCount} {noteCount === 1 ? "note" : "notes"}
      </span>
    </button>
  ) : (
    <span />
  );

  const bodyProps = {
    alreadyDone,
    progress,
    stuckButton,
    setFeedback,
    setMood,
    setPassed,
    onWrong: () => onWrong(stop),
    openNotes: () => {
      if (!notesOpen) toggleNotes(true, false);
    },
    onComplete: (r: { xp: number; wrongCount: number; answer: string; revealed: boolean }) => onComplete({ stop, ...r }),
    onCheck: (itemId: string, on: boolean) => onCheck(stop.id, itemId, on),
    onPick: (personId: string) => onPick(stop.id, personId),
  };

  const kindLabel = { practice: "Practice", setup: "Setup", action: "Do", reflect: "Reflect" }[stop.kind];

  return (
    <div className={`mx-auto grid w-full gap-7 pb-16 lg:items-start ${notesOpen ? "max-w-5xl lg:grid-cols-[1fr_340px]" : "max-w-2xl"}`}>
      <div style={{ viewTransitionName: "lesson-main" }} className="flex w-full flex-col gap-5">
        <div className="flex items-center justify-between">
          <button type="button" onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-slate-600">
            ✕ Back to path
          </button>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Stop {stop.order} · {kindLabel} · +{stop.xp} XP
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

        <div className="enter flex items-start gap-3" style={{ "--i": 0 } as React.CSSProperties}>
          <Mascot mood={mood} size={64} />
          <div className="flex-1 rounded-2xl rounded-tl-sm border-2 border-slate-200 bg-white p-4 text-base font-semibold text-slate-800">{stop.why}</div>
        </div>

        {stop.kind === "practice" ? (
          <PracticeBody stop={stop} {...bodyProps} />
        ) : stop.kind === "reflect" ? (
          <ReflectBody stop={stop} {...bodyProps} />
        ) : (
          <ChecklistBody stop={stop} {...bodyProps} />
        )}
      </div>

      {notesOpen && (
        <div style={{ viewTransitionName: "notes-column" }} className="sidebar-in sticky top-4 hidden lg:block">
          <NotesSidebar {...sidebarProps} onClose={() => toggleNotes(false)} />
        </div>
      )}

      {/* Mobile: bottom sheet. Portaled to <body> so no lesson layer can composite above it. */}
      {notesOpen &&
        createPortal(
          <div className="sheet-backdrop fixed inset-0 z-50 flex items-end bg-slate-900/40 lg:hidden" onClick={() => setNotesOpen(false)}>
            <div className="sheet-in max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
              <NotesSidebar {...sidebarProps} onClose={() => setNotesOpen(false)} />
            </div>
          </div>,
          document.body,
        )}

      {feedback && <FeedbackToast fb={feedback} />}
    </div>
  );
}
