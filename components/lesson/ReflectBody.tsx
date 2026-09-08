"use client";
import { useState } from "react";
import type { ReflectStop } from "@/lib/data";
import { btn, type BodyProps } from "./types";

/** One text box, no grading. A sincere note of eight words or more is enough. */
export default function ReflectBody({ stop, alreadyDone, stuckButton, setFeedback, setMood, setPassed, onComplete }: BodyProps<ReflectStop>) {
  const [text, setText] = useState("");
  const [posted, setPosted] = useState(false);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const ok = words >= 8;

  function post() {
    if (!ok) return;
    setPosted(true);
    setPassed(true);
    setMood("party");
    setFeedback({ key: "posted", pass: true, title: "Posted!", text: "That goes on the map for whoever comes next.", xp: alreadyDone ? undefined : stop.xp, celebrate: true });
  }

  return (
    <>
      <section className="enter rounded-2xl border-2 border-sky-200 bg-sky-50 p-4" style={{ "--i": 1 } as React.CSSProperties}>
        <div className="text-lg font-extrabold text-slate-800">{stop.prompt}</div>
      </section>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={posted}
        placeholder="Dear next new hire…"
        rows={4}
        style={{ "--i": 2 } as React.CSSProperties}
        className="enter w-full rounded-2xl border-2 border-slate-200 bg-white p-4 text-base text-slate-800 outline-none focus:border-sky-400 disabled:bg-slate-50"
      />
      <div className="enter flex items-center justify-between gap-3" style={{ "--i": 3 } as React.CSSProperties}>
        {stuckButton}
        <div className="flex items-center gap-3">
          {!posted && <span className="text-xs text-slate-400">{ok ? "Ready" : `${Math.max(0, 8 - words)} more words`}</span>}
          {posted ? (
            <button type="button" onClick={() => onComplete({ xp: alreadyDone ? 0 : stop.xp, wrongCount: 0, answer: text, revealed: false })} className={btn.go}>
              Continue
            </button>
          ) : (
            <button type="button" onClick={post} disabled={!ok} className={btn.go}>
              Post my note
            </button>
          )}
        </div>
      </div>
    </>
  );
}
