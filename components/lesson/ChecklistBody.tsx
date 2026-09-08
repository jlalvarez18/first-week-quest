"use client";
import { useState } from "react";
import Avatar from "@/components/Avatar";
import { personById, type ChecklistStop } from "@/lib/data";
import { btn, type BodyProps } from "./types";

/**
 * Setup and action stops. Tick every item, then complete. "Having an issue" is always
 * available: pick the stuck item, read where to ask, and the notes open. Each issue raised
 * counts once as a stuck signal for the team board.
 */
export default function ChecklistBody({ stop, alreadyDone, progress, stuckButton, setFeedback, setMood, setPassed, onWrong, openNotes, onComplete, onCheck, onPick }: BodyProps<ChecklistStop>) {
  const checked = new Set(progress.checks[stop.id] ?? []);
  const pick = progress.picks[stop.id];
  const [issueOpen, setIssueOpen] = useState(false);
  const [issueItem, setIssueItem] = useState<string | null>(null);
  const [raised, setRaised] = useState<string[]>([]);
  const [done, setDone] = useState(alreadyDone);

  const allChecked = stop.checklist.every((c) => checked.has(c.id));
  const needsPick = !!stop.pickOne && !pick;
  const canComplete = allChecked && !needsPick;
  const people = (stop.people ?? []).map((id) => personById(id)!).filter(Boolean);

  function raise(itemId: string) {
    setIssueItem(itemId);
    if (!raised.includes(itemId)) {
      setRaised((r) => [...r, itemId]);
      onWrong();
    }
    setMood("think");
    openNotes();
  }

  function complete() {
    setDone(true);
    setPassed(true);
    setMood("party");
    setFeedback({
      key: `done-${Date.now()}`,
      pass: true,
      title: stop.kind === "setup" ? "Setup complete!" : "Done!",
      text: stop.kind === "setup" ? "That is the part most people dread. You are through it." : "Real thing, really done. That counts.",
      xp: alreadyDone ? undefined : stop.xp,
      celebrate: true,
    });
  }

  const issue = issueItem ? stop.checklist.find((c) => c.id === issueItem) : null;

  return (
    <>
      {people.length > 0 && (
        <section className="enter" style={{ "--i": 1 } as React.CSSProperties} aria-label="People">
          <div className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">{stop.pickOne ? "Pick one" : "Who's who"}</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {people.map((p) => {
              const picked = pick === p.id;
              const Tag = stop.pickOne ? "button" : "div";
              return (
                <Tag
                  key={p.id}
                  type={stop.pickOne ? "button" : undefined}
                  onClick={stop.pickOne ? () => onPick(p.id) : undefined}
                  aria-pressed={stop.pickOne ? picked : undefined}
                  className={[
                    "flex items-center gap-3 rounded-2xl border-2 bg-white p-3 text-left transition-colors duration-150",
                    picked ? "border-emerald-400 bg-emerald-50" : "border-slate-200",
                    stop.pickOne && "hover:border-sky-400",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Avatar person={p} size={36} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-slate-800">
                      {p.name}
                      {picked && <span className="ml-1 text-emerald-600">✓</span>}
                    </div>
                    <div className="truncate text-xs text-slate-500">{p.role}</div>
                    <div className="text-[11px] text-slate-400">
                      {p.location}
                      {p.remote ? " · remote" : ""}
                    </div>
                  </div>
                </Tag>
              );
            })}
          </div>
        </section>
      )}

      <section className="enter" style={{ "--i": 2 } as React.CSSProperties} aria-label="Checklist">
        <div className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
          {stop.kind === "setup" ? "Setup" : "Do it"} · {checked.size}/{stop.checklist.length}
        </div>
        <ul className="flex flex-col gap-2">
          {stop.checklist.map((c, i) => {
            const on = checked.has(c.id);
            return (
              <li key={c.id}>
                <label
                  className={[
                    "flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-white p-3.5 text-[15px] leading-snug transition-colors duration-200",
                    on ? "border-emerald-300 bg-emerald-50 text-slate-500" : "border-slate-200 text-slate-700 hover:border-sky-300",
                  ].join(" ")}
                >
                  <input type="checkbox" checked={on} onChange={(e) => onCheck(c.id, e.target.checked)} disabled={done} className="peer sr-only" />
                  <span
                    aria-hidden
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition-all duration-200 ${
                      on ? "check-pop bg-emerald-500 text-white" : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {on ? "✓" : i + 1}
                  </span>
                  <span className={on ? "line-through decoration-emerald-400/60" : ""}>{c.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {issueOpen && (
        <section className="note-in rounded-2xl border-2 border-amber-300 bg-amber-50 p-4" aria-label="Having an issue">
          <div className="text-sm font-extrabold text-amber-800">Which step is stuck?</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {stop.checklist.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => raise(c.id)}
                className={`rounded-full border-2 px-3 py-1 text-xs font-bold transition-colors ${
                  issueItem === c.id ? "border-amber-500 bg-amber-400 text-amber-950" : "border-amber-300 bg-white text-amber-800 hover:bg-amber-100"
                }`}
              >
                {i + 1}. {c.label.length > 34 ? c.label.slice(0, 32) + "…" : c.label}
              </button>
            ))}
          </div>
          {issue && (
            <div key={issue.id} className="note-in mt-3 rounded-xl border-2 border-amber-200 bg-white p-3 text-sm text-slate-700">
              <div className="mb-1 font-extrabold text-slate-800">{issue.label}</div>
              {issue.help}
              <div className="mt-2 text-xs text-amber-700">This counted as a stuck signal for this stop, so the doc gets better. Notes from people who hit it are open on the side.</div>
            </div>
          )}
          <div className="mt-3 text-right">
            <button type="button" onClick={() => setIssueOpen(false)} className="text-xs font-bold text-amber-800 hover:underline">
              Got it, keep going
            </button>
          </div>
        </section>
      )}

      <div className="enter flex flex-wrap items-center justify-between gap-3" style={{ "--i": 3 } as React.CSSProperties}>
        {stuckButton}
        <div className="flex gap-2">
          {!done && (
            <button type="button" onClick={() => setIssueOpen((v) => !v)} className={btn.warn}>
              Having an issue
            </button>
          )}
          {done ? (
            <button type="button" onClick={() => onComplete({ xp: alreadyDone ? 0 : stop.xp, wrongCount: raised.length, answer: "", revealed: false })} className={btn.go}>
              Continue
            </button>
          ) : (
            <button type="button" onClick={complete} disabled={!canComplete} className={btn.go} title={needsPick ? "Pick someone first" : !allChecked ? "Tick every item first" : undefined}>
              {stop.completeLabel}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
