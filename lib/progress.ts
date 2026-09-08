"use client";

export type Progress = {
  completed: string[];
  xp: number;
  streak: { count: number; lastDay: string | null };
  attempts: Record<string, number>;
  wrong: Record<string, number>;
  notes: { id: string; stopId: string; text: string; at: string }[];
  /** ids of trail notes (bundled or own) the user marked as helpful */
  helped: string[];
  finishedAt: string | null;
};

const KEY = "first-week-quest:v1";

export const emptyProgress = (): Progress => ({
  completed: [],
  xp: 0,
  streak: { count: 0, lastDay: null },
  attempts: {},
  wrong: {},
  notes: [],
  helped: [],
  finishedAt: null,
});

export function loadProgress(): Progress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...emptyProgress(), ...JSON.parse(raw) } : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* private mode etc. */
  }
}

export function resetProgress() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);

/** Duolingo-style streak: +1 if last activity was yesterday, keep if today, else restart at 1. */
export function bumpStreak(s: Progress["streak"]): Progress["streak"] {
  const today = dayKey();
  if (s.lastDay === today) return s;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const count = s.lastDay === dayKey(y) ? s.count + 1 : 1;
  return { count, lastDay: today };
}
