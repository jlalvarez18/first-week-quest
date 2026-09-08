"use client";
import Mascot from "./Mascot";
import Confetti from "./Confetti";

export type Feedback = {
  /** Changes force the toast to re-animate. */
  key: string;
  pass: boolean;
  title: string;
  text: string;
  hint?: string;
  grader?: string;
  /** XP badge to pop next to the title. */
  xp?: number;
  /** Confetti. Off for reveals and repeats. */
  celebrate?: boolean;
};

/** Drops in from the top edge. Never blocks clicks. */
export default function FeedbackToast({ fb }: { fb: Feedback }) {
  return (
    <>
      <div key={fb.key} className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4">
        <div
          role="status"
          className={`feedback-in flex w-full max-w-2xl items-start gap-3 rounded-2xl border-2 bg-white p-4 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.25)] ${
            fb.pass ? "border-emerald-300" : "border-amber-300"
          }`}
        >
          <Mascot mood={fb.pass ? "party" : "think"} size={44} />
          <div className="min-w-0 flex-1 text-sm">
            <div className={`text-lg font-extrabold ${fb.pass ? "text-emerald-700" : "text-amber-700"}`}>
              {fb.title}
              {fb.xp ? <span className="xp-float ml-2 inline-block text-base text-emerald-600">+{fb.xp} XP</span> : null}
            </div>
            <div className="text-slate-700">{fb.text}</div>
            {fb.hint && <div className="mt-1 text-slate-600">💡 {fb.hint}</div>}
            {fb.grader && <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">graded by {fb.grader}</div>}
          </div>
        </div>
      </div>
      {fb.celebrate && <Confetti burst count={48} />}
    </>
  );
}
