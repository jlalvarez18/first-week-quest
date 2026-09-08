"use client";
import type { Stop } from "@/lib/data";

type State = "done" | "active" | "locked";
const OFFSETS = [0, 60, 90, 60, 0, -60, -90, -60];

export default function Path({
  stops,
  completed,
  onOpen,
  animateIn = false,
}: {
  stops: Stop[];
  completed: string[];
  onOpen: (stop: Stop) => void;
  /** Stagger the stops in. Only on first arrival; returning from a lesson uses the morph instead. */
  animateIn?: boolean;
}) {
  const activeIdx = stops.findIndex((s) => !completed.includes(s.id));
  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col items-center py-6">
      {stops.map((stop, i) => {
        const state: State = completed.includes(stop.id) ? "done" : i === activeIdx ? "active" : "locked";
        const x = OFFSETS[i % OFFSETS.length];
        return (
          <div
            key={stop.id}
            className={`relative flex h-40 w-full items-center justify-center ${animateIn ? "enter" : ""}`}
            style={animateIn ? ({ "--i": i } as React.CSSProperties) : undefined}
          >
            <div className="relative flex flex-col items-center" style={{ transform: `translateX(${x}px)` }}>
              {state === "active" && (
                <div className="bouncy absolute -top-10 z-10 rounded-lg border-2 border-amber-300 bg-white px-3 py-1 text-xs font-extrabold tracking-wide text-amber-600 shadow">
                  START
                  <div className="absolute left-1/2 top-full -ml-1.5 h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-amber-300" />
                </div>
              )}
              <button
                type="button"
                disabled={state === "locked"}
                onClick={() => onOpen(stop)}
                aria-label={`${stop.title} (${state})`}
                style={state !== "locked" ? { viewTransitionName: `stop-node-${stop.id}` } : undefined}
                className={[
                  "node relative flex h-20 w-20 items-center justify-center rounded-full text-3xl transition",
                  state === "done" && "bg-emerald-500 text-white shadow-[0_6px_0_#059669] hover:translate-y-0.5 hover:shadow-[0_4px_0_#059669]",
                  state === "active" && "bg-amber-400 shadow-[0_6px_0_#d97706] hover:translate-y-0.5 hover:shadow-[0_4px_0_#d97706]",
                  state === "locked" && "bg-slate-200 text-slate-400 shadow-[0_6px_0_#cbd5e1] cursor-not-allowed grayscale",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {state === "done" ? "✓" : state === "locked" ? "🔒" : stop.emoji}
              </button>
              <div className={`mt-2 text-center text-sm font-bold ${state === "locked" ? "text-slate-400" : "text-slate-700"}`}>
                <span style={state !== "locked" ? { viewTransitionName: `stop-title-${stop.id}` } : undefined} className="inline-block">
                  {stop.title}
                </span>
                <div className="text-xs font-semibold text-slate-400">+{stop.xp} XP</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
