"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Mascot from "@/components/Mascot";
import Avatar from "@/components/Avatar";
import { PERSONA, STOPS, personById } from "@/lib/data";
import { firstName, getName } from "@/lib/user";

type Step = { label: string; result: React.ReactNode };

/**
 * Fake SSO progress screen. Purely scripted: each row resolves on a timer, then we land on
 * the quest. Any click skips ahead. Nothing here talks to a server.
 */
export default function Welcome() {
  const router = useRouter();
  const [name, setNameState] = useState<string | null>(null);
  const [done, setDone] = useState(0); // rows resolved
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

  useEffect(() => {
    const n = getName();
    if (!n) {
      router.replace("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
    setNameState(n);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gap = reduce ? 250 : 750;
    steps.forEach((_, i) => timers.current.push(window.setTimeout(() => setDone(i + 1), gap * (i + 1))));
    timers.current.push(window.setTimeout(() => setReady(true), gap * (steps.length + 1)));
    timers.current.push(window.setTimeout(() => router.push("/quest"), gap * (steps.length + 1) + 1600));
    const started = timers.current;
    return () => started.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function go() {
    timers.current.forEach((t) => window.clearTimeout(t));
    router.push("/quest");
  }

  if (!name) return null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4 py-12" onClick={go}>
      <Mascot size={96} mood={ready ? "party" : "think"} />
      <ul className="mt-8 w-full space-y-3" aria-live="polite">
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
      {ready && (
        <div className="enter mt-8 flex flex-col items-center text-center" style={{ "--i": 0 } as React.CSSProperties}>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Welcome to the {PERSONA.team} team, {firstName(name)}.
          </h1>
          <p className="mt-2 text-slate-600">Marcus and Lena are cheering you on. Kai has your back.</p>
          <button
            type="button"
            onClick={go}
            className="mt-6 rounded-2xl bg-emerald-500 px-7 py-3 text-lg font-extrabold text-white shadow-[0_5px_0_#059669] transition hover:translate-y-0.5 hover:shadow-[0_3px_0_#059669]"
          >
            Let&apos;s go →
          </button>
        </div>
      )}
      {!ready && <p className="mt-6 text-xs text-slate-400">Click anywhere to skip</p>}
    </main>
  );
}
