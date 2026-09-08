import type { Stop } from "@/lib/data";
import type { Progress } from "@/lib/progress";
import type { Feedback } from "@/components/FeedbackToast";

export type Mood = "happy" | "think" | "party";

/** What every lesson body gets from the shell. */
export type BodyProps<S extends Stop = Stop> = {
  stop: S;
  alreadyDone: boolean;
  progress: Progress;
  /** The "Are you stuck? / Leave a note" toggle, rendered by the shell; bodies place it in their action row. */
  stuckButton: React.ReactNode;
  setFeedback: (fb: Feedback | null) => void;
  setMood: (m: Mood) => void;
  /** Mark the stop passed (unlocks note posting). */
  setPassed: (v: boolean) => void;
  /** Count a stuck signal for this stop. */
  onWrong: () => void;
  /** Open the notes column without counting a peek (used after an issue was already counted). */
  openNotes: () => void;
  onComplete: (r: { xp: number; wrongCount: number; answer: string; revealed: boolean }) => void;
  onCheck: (itemId: string, on: boolean) => void;
  onPick: (personId: string) => void;
};

export const btn = {
  primary: "rounded-xl bg-sky-500 px-5 py-2 text-sm font-extrabold text-white shadow-[0_3px_0_#0284c7] hover:translate-y-0.5 hover:shadow-[0_1px_0_#0284c7] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none",
  go: "rounded-xl bg-emerald-500 px-5 py-2 text-sm font-extrabold text-white shadow-[0_3px_0_#059669] hover:translate-y-0.5 hover:shadow-[0_1px_0_#059669] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none",
  warn: "rounded-xl border-2 border-amber-300 bg-white px-4 py-2 text-sm font-extrabold text-amber-700 hover:bg-amber-50",
};
