"use client";
import { useState } from "react";
import Link from "next/link";
import Mascot from "./Mascot";
import type { Progress } from "@/lib/progress";
import { PERSONA, STOPS, stopById } from "@/lib/data";
import { firstName } from "@/lib/user";

export default function Finish({ progress, name, onReset }: { progress: Progress; name: string; onReset: () => void }) {
  const [copied, setCopied] = useState(false);
  const share = `${firstName(name)} finished the ${PERSONA.team} First Week Quest! ⚡ ${progress.xp} XP · 🔥 ${progress.streak.count} day streak · ✅ ${STOPS.length}/${STOPS.length} stops. Clay says hi.`;
  async function copy() {
    try {
      await navigator.clipboard.writeText(share);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }
  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-6 py-10 text-center">
      <Confetti />
      <div className="bouncy">
        <Mascot mood="party" size={120} />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-800">Quest complete!</h1>
      <p className="text-lg text-slate-600">You know who owns what, how the app ships, and what to do at 2am. That is week one on {PERSONA.team}.</p>
      <div className="grid w-full grid-cols-3 gap-3">
        <Stat label="XP" value={`⚡ ${progress.xp}`} />
        <Stat label="Streak" value={`🔥 ${progress.streak.count}`} />
        <Stat label="Stops" value={`✅ ${STOPS.length}`} />
      </div>
      {progress.notes.length > 0 && (
        <div className="w-full rounded-2xl border-2 border-sky-100 bg-sky-50 p-4 text-left text-sm">
          <div className="mb-1 font-bold text-slate-700">Your note for the next new hire</div>
          {progress.notes.map((n, i) => (
            <div key={i} className="text-slate-600">
              &ldquo;{n.text}&rdquo; <span className="text-slate-400">· left at {stopById(n.stopId)?.title}</span>
            </div>
          ))}
          <div className="mt-2 text-xs text-slate-500">It now shows on the team board for whoever comes next.</div>
        </div>
      )}
      <div className="w-full rounded-2xl border-2 border-dashed border-emerald-300 bg-white p-4 text-left text-sm text-slate-700">
        {share}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={copy} className="rounded-2xl bg-emerald-500 px-5 py-3 font-extrabold text-white shadow-[0_4px_0_#059669]">
          {copied ? "Copied!" : "Copy share card"}
        </button>
        <Link href="/team" className="rounded-2xl bg-sky-500 px-5 py-3 font-extrabold text-white shadow-[0_4px_0_#0284c7]">
          See the team board
        </Link>
        <button type="button" onClick={onReset} className="rounded-2xl border-2 border-slate-200 bg-white px-5 py-3 font-extrabold text-slate-500">
          Play again
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-3">
      <div className="text-2xl font-extrabold text-slate-800">{value}</div>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}

function Confetti() {
  const colors = ["#f59e0b", "#10b981", "#0ea5e9", "#ec4899", "#8b5cf6"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          className="confetti absolute block h-2 w-2 rounded-sm"
          style={{
            left: `${(i * 37) % 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${(i % 10) * 0.15}s`,
            animationDuration: `${2.5 + (i % 5) * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}
