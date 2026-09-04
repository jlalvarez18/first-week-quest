"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Path from "@/components/Path";
import Lesson, { type LessonResult } from "@/components/Lesson";
import Finish from "@/components/Finish";
import StreakBar from "@/components/StreakBar";
import CheerToast, { type Cheer } from "@/components/CheerToast";
import Mascot from "@/components/Mascot";
import { COMPANY, PEOPLE, STOPS, type Stop } from "@/lib/data";
import { bumpStreak, emptyProgress, loadProgress, resetProgress, saveProgress, type Progress } from "@/lib/progress";

export default function QuestPage() {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState<Stop | null>(null);
  const [cheers, setCheers] = useState<Cheer[]>([]);
  const cheerId = useRef(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
    setProgress(loadProgress());
    setLoaded(true);
  }, []);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    setProgress((p) => {
      const next = fn(p);
      saveProgress(next);
      return next;
    });
  }, []);

  const pushCheer = useCallback((delay: number, exclude: string[]) => {
    setTimeout(() => {
      const pool = PEOPLE.filter((p) => !exclude.includes(p.id));
      const person = pool[Math.floor(Math.random() * pool.length)];
      const text = person.cheers[Math.floor(Math.random() * person.cheers.length)];
      const id = ++cheerId.current;
      setCheers((c) => [...c, { id, person, text }]);
      setTimeout(() => setCheers((c) => c.filter((x) => x.id !== id)), 4500);
    }, delay);
  }, []);

  function onComplete(r: LessonResult) {
    const wasDone = progress.completed.includes(r.stop.id);
    update((p) => {
      const completed = wasDone ? p.completed : [...p.completed, r.stop.id];
      const notes = r.stop.id === "pay-it-forward" && !wasDone ? [...p.notes, { stopId: r.stop.id, text: r.answer }] : p.notes;
      const finished = completed.length === STOPS.length;
      return {
        ...p,
        completed,
        xp: p.xp + r.xp,
        streak: wasDone ? p.streak : bumpStreak(p.streak),
        attempts: { ...p.attempts, [r.stop.id]: (p.attempts[r.stop.id] ?? 0) + 1 },
        notes,
        finishedAt: finished && !p.finishedAt ? new Date().toISOString() : p.finishedAt,
      };
    });
    setOpen(null);
    if (!wasDone) {
      const a = PEOPLE[Math.floor(Math.random() * PEOPLE.length)].id;
      pushCheer(500, []);
      pushCheer(1800, [a]);
    }
  }

  function onWrong(stop: Stop) {
    update((p) => ({ ...p, wrong: { ...p.wrong, [stop.id]: (p.wrong[stop.id] ?? 0) + 1 } }));
  }

  function reset() {
    resetProgress();
    setProgress(emptyProgress());
    setOpen(null);
  }

  const finished = loaded && progress.completed.length === STOPS.length && !open;

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-slate-700">
          <Mascot size={36} /> First Week Quest <span className="hidden text-slate-400 sm:inline">· {COMPANY.name}</span>
        </Link>
        <div className="flex items-center gap-3">
          <StreakBar xp={progress.xp} streak={progress.streak.count} done={progress.completed.length} total={STOPS.length} />
          <Link href="/team" className="text-sm font-bold text-sky-600 hover:underline">
            Team board →
          </Link>
        </div>
      </header>

      {!loaded ? null : open ? (
        <Lesson
          key={open.id}
          stop={open}
          alreadyDone={progress.completed.includes(open.id)}
          onBack={() => setOpen(null)}
          onComplete={onComplete}
          onWrong={onWrong}
        />
      ) : finished ? (
        <Finish progress={progress} onReset={reset} />
      ) : (
        <>
          <div className="mx-auto mb-2 max-w-md rounded-2xl border-2 border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
            <span className="font-bold text-slate-800">Week 1 at {COMPANY.name}.</span> Eight stops. Answer in your own words.
            Wrong answers cost nothing but earn a hint.
          </div>
          <Path stops={STOPS} completed={progress.completed} onOpen={setOpen} />
          <div className="mt-6 text-center">
            <button type="button" onClick={reset} className="text-xs font-bold text-slate-400 hover:text-slate-600">
              Reset progress
            </button>
          </div>
        </>
      )}
      <CheerToast cheers={cheers} />
    </main>
  );
}
