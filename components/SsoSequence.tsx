"use client";
import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { PERSONA, STOPS, personById } from "@/lib/data";
import { firstName } from "@/lib/user";

type Step = { label: string; result: React.ReactNode };

/**
 * Fake SSO progress. Rows resolve on a timer, then a Let's go button appears. Nothing
 * advances without a click once the rows are done. Clicking a row area while loading skips
 * the wait. No server involved.
 */
export default function SsoSequence({ name, onDone }: { name: string; onDone: () => void }) {
  const [done, setDone] = useState(0);
  const [ready, setReady] = useState(false);
  const timers = useRef<number[]>([]);

  const lead = personById(PERSONA.leadId)!;
  const buddy = personById(PERSONA.buddyId)!;
  const steps: Step[] = [
    { label: "Signing in with SSO…", result: <>Signed in</> },
    {
      label: "Finding your team…",
      result: (
        <span className="flex items-center gap-2">
          <Avatar person={lead} size={22} /> {PERSONA.team} team · {lead.name} leads
        </span>
      ),
    },
    {
      label: "Meeting your buddy…",
      result: (
        <span className="flex items-center gap-2">
          <Avatar person={buddy} size={22} /> {buddy.name}, {buddy.team}
        </span>
      ),
    },
    { label: "Loading your first-week quest…", result: <>{STOPS.length} stops, ready</> },
  ];
  const total = steps.length;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gap = reduce ? 250 : 750;
    const started = timers.current;
    for (let i = 0; i < total; i++) started.push(window.setTimeout(() => setDone(i + 1), gap * (i + 1)));
    started.push(window.setTimeout(() => setReady(true), gap * (total + 1)));
    return () => started.forEach((t) => window.clearTimeout(t));
  }, [total]);

  function skipWait() {
    if (ready) return;
    timers.current.forEach((t) => window.clearTimeout(t));
    setDone(total);
    setReady(true);
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center" style={{ viewTransitionName: "sso-panel" }}>
      <ul className="w-full space-y-3" aria-live="polite" onClick={skipWait}>
        {steps.map((s, i) => {
          const state = i < done ? "done" : i === done ? "active" : "pending";
          if (state === "pending") return null;
          return (
            <li key={i} className="note-in flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              <span className={`tick ${state === "done" ? "tick-done" : ""}`} aria-hidden />
              <span className="flex-1">{state === "done" ? s.result : s.label}</span>
            </li>
          );
        })}
      </ul>
      {ready ? (
        <div className="enter mt-8 flex flex-col items-center text-center" style={{ "--i": 0 } as React.CSSProperties}>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Welcome to the {PERSONA.team} team, {firstName(name)}.
          </h1>
          <p className="mt-2 text-slate-600">Marcus and Lena are cheering you on. Kai has your back.</p>
          <button
            type="button"
            onClick={onDone}
            className="mt-6 rounded-2xl bg-emerald-500 px-7 py-3 text-lg font-extrabold text-white shadow-[0_5px_0_#059669] transition hover:translate-y-0.5 hover:shadow-[0_3px_0_#059669]"
          >
            Let&apos;s go →
          </button>
        </div>
      ) : (
        <button type="button" onClick={skipWait} className="mt-6 text-xs font-bold text-slate-400 hover:text-slate-600">
          Skip the wait
        </button>
      )}
    </div>
  );
}
