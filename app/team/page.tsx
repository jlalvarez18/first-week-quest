"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Avatar from "@/components/Avatar";
import Mascot from "@/components/Mascot";
import CheerToast, { type Cheer } from "@/components/CheerToast";
import { NOTES, PEOPLE, STOPS, STUCK_BASELINE, USER_COLOR, personById, type Person } from "@/lib/data";
import { firstName, getName, initialsOf } from "@/lib/user";
import { loadProgress, resetProgress, type Progress, emptyProgress } from "@/lib/progress";

type Hire = { id: string; name: string; initials: string; color: string; location: string; remote: boolean; stop: number };
const INITIAL_HIRES: Hire[] = [
  { id: "you", name: "You", initials: "YOU", color: USER_COLOR, location: "here", remote: true, stop: 0 },
  { id: "ravi", name: "Ravi Menon", initials: "RM", color: "#a855f7", location: "Dublin", remote: true, stop: 2 },
  { id: "mei", name: "Mei Tanaka", initials: "MT", color: "#f43f5e", location: "San Francisco", remote: false, stop: 5 },
  { id: "kai", name: "Kai Nakamura", initials: "KN", color: "#84cc16", location: "Tokyo", remote: true, stop: 8 },
];

export default function TeamPage() {
  return (
    <Suspense>
      <TeamBoard />
    </Suspense>
  );
}

function TeamBoard() {
  const params = useSearchParams();
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [name, setName] = useState<string | null>(null);
  const [hires, setHires] = useState<Hire[]>(INITIAL_HIRES);
  const [bumps, setBumps] = useState<Record<string, number>>({});
  const [cheers, setCheers] = useState<Cheer[]>([]);
  const [playing, setPlaying] = useState(false);
  const [tick, setTick] = useState(0);
  const timers = useRef<number[]>([]);
  const cheerId = useRef(0);

  useEffect(() => {
    const p = loadProgress();
    const n = getName();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
    setProgress(p);
    setName(n);
    setHires((h) => h.map((x) => (x.id === "you" ? { ...x, stop: p.completed.length, name: n ? `${firstName(n)} (you)` : "You", initials: n ? initialsOf(n) : "YOU" } : x)));
  }, []);

  useEffect(() => {
    if (params.get("play") === "1") play();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stop() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setPlaying(false);
  }

  function cheer(person: Person, text: string) {
    const id = ++cheerId.current;
    setCheers((c) => [...c, { id, person, text }]);
    timers.current.push(window.setTimeout(() => setCheers((c) => c.filter((x) => x.id !== id)), 4000));
  }

  /** 30 second scripted "day in the life": hires advance, get stuck, get cheered. */
  function play() {
    stop();
    setPlaying(true);
    setHires(INITIAL_HIRES.map((h) => (h.id === "you" ? { ...h, stop: loadProgress().completed.length, name: name ? `${firstName(name)} (you)` : "You", initials: name ? initialsOf(name) : "YOU" } : h)));
    setBumps({});
    setTick(0);
    const script: { at: number; run: () => void }[] = [
      { at: 1500, run: () => advance("ravi") },
      { at: 2200, run: () => cheer(personById("lena")!, "Ravi just cleared Learn the lingo. Remote high five from London!") },
      { at: 4500, run: () => stuck("beacon-goes-off") },
      { at: 5200, run: () => cheer(personById("nadia")!, "Mei is on Beacon. I am hopping in the thread to help.") },
      { at: 8000, run: () => stuck("beacon-goes-off") },
      { at: 10500, run: () => advance("mei") },
      { at: 11200, run: () => cheer(personById("marcus")!, "Mei cleared Beacon on the third try. That is the rule working.") },
      { at: 14000, run: () => advance("ravi") },
      { at: 14700, run: () => cheer(personById("priya")!, "Ravi shipped something tiny. One word PR. Perfect.") },
      { at: 17500, run: () => stuck("learn-the-lingo") },
      { at: 20000, run: () => advance("mei") },
      { at: 20700, run: () => cheer(personById("amara")!, "Mei is one stop from done. Cheer squad, assemble.") },
      { at: 23500, run: () => advance("ravi") },
      { at: 26000, run: () => advance("mei") },
      { at: 26700, run: () => cheer(personById("kai")!, "Mei finished! Two of us now. Ravi, you're next.") },
      { at: 29500, run: () => setPlaying(false) },
    ];
    script.forEach((s) => timers.current.push(window.setTimeout(() => { s.run(); setTick((t) => t + 1); }, s.at)));
  }
  function advance(id: string) {
    setHires((h) => h.map((x) => (x.id === id ? { ...x, stop: Math.min(STOPS.length, x.stop + 1) } : x)));
  }
  function stuck(stopId: string) {
    setBumps((b) => ({ ...b, [stopId]: (b[stopId] ?? 0) + 1 }));
  }

  function resetDemo() {
    stop();
    resetProgress();
    setProgress(emptyProgress());
    setHires(INITIAL_HIRES);
    setBumps({});
    setCheers([]);
  }

  const stuckFor = (id: string) => STUCK_BASELINE[id] + (progress.wrong[id] ?? 0) + (bumps[id] ?? 0);
  const maxStuck = Math.max(1, ...STOPS.map((s) => stuckFor(s.id)));
  const notes = [
    ...progress.notes.map((n) => ({ stopId: n.stopId, text: n.text, by: "you" })),
    ...NOTES.slice().sort((a, b) => b.helped - a.helped).slice(0, 6),
  ];

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-6" data-tick={tick}>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-slate-700">
          <Mascot size={36} /> Team board
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={playing ? stop : play}
            className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-extrabold text-white shadow-[0_4px_0_#0284c7]"
          >
            {playing ? "■ Stop" : "▶ Watch a team (30s)"}
          </button>
          <Link href="/quest" className="text-sm font-bold text-sky-600 hover:underline">
            Play →
          </Link>
        </div>
      </header>

      <section className="mb-6 rounded-2xl border-2 border-slate-200 bg-white p-5">
        <h2 className="text-lg font-extrabold text-slate-800">Who is where</h2>
        <p className="mb-4 text-sm text-slate-500">This week&apos;s new hires and the stop they are on. {playing && <span className="font-bold text-sky-600">Live demo running…</span>}</p>
        <div className="flex flex-col gap-3">
          {hires.map((h) => (
            <div key={h.id} className="flex items-center gap-3">
              <span
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white"
                style={{ background: h.color }}
              >
                {h.initials}
              </span>
              <div className="w-36 shrink-0 text-sm">
                <div className="font-bold text-slate-700">{h.name}</div>
                <div className="text-xs text-slate-400">{h.location}{h.remote ? " · remote" : ""}</div>
              </div>
              <div className="flex flex-1 items-center gap-1">
                {STOPS.map((s, i) => (
                  <div
                    key={s.id}
                    title={s.title}
                    className={[
                      "h-3 flex-1 rounded-full transition-all duration-500",
                      i < h.stop ? "bg-emerald-400" : i === h.stop ? "bg-amber-400 bouncy" : "bg-slate-200",
                    ].join(" ")}
                  />
                ))}
              </div>
              <div className="w-14 text-right text-xs font-bold text-slate-500">{h.stop === STOPS.length ? "Done 🎉" : `${h.stop}/${STOPS.length}`}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-2xl border-2 border-slate-200 bg-white p-5">
        <h2 className="text-lg font-extrabold text-slate-800">Where people get stuck</h2>
        <p className="mb-4 text-sm text-slate-500">
          Stuck signals per stop: wrong answers, plus opening the notes before passing. Last cohort plus this week. Counted per stop, never per person. A tall bar means the wiki page needs work, not the new hire.
        </p>
        <div className="flex flex-col gap-2">
          {STOPS.map((s) => {
            const n = stuckFor(s.id);
            const hot = n >= 8;
            return (
              <div key={s.id} className="flex items-center gap-3 text-sm">
                <div className="w-44 shrink-0 truncate font-bold text-slate-700">
                  {s.emoji} {s.title}
                </div>
                <div className="h-5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${hot ? "bg-rose-400" : "bg-amber-400"}`}
                    style={{ width: `${(n / maxStuck) * 100}%` }}
                  />
                </div>
                <div className="w-20 text-right text-xs font-bold text-slate-500">
                  {n} {hot && <span className="ml-1 rounded bg-rose-100 px-1 text-rose-600">fix doc</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-6 rounded-2xl border-2 border-sky-100 bg-sky-50 p-5">
        <h2 className="text-lg font-extrabold text-slate-800">Notes from the trail</h2>
        <p className="mb-3 text-sm text-slate-500">Left by people who finished. Shown to whoever comes next.</p>
        <div className="flex flex-col gap-2">
          {notes.map((n, i) => {
            const p = personById(n.by);
            return (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Avatar person={p ?? { name: name ?? "You", initials: name ? initialsOf(name) : "YOU", color: USER_COLOR }} size={28} />
                <div>
                  <span className="font-bold text-slate-700">{p?.name ?? (name ? `${firstName(name)} (you)` : "You")}</span>
                  <span className="text-slate-400"> · at {STOPS.find((s) => s.id === n.stopId)?.title}</span>
                  <div className="text-slate-600">&ldquo;{n.text}&rdquo;</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border-2 border-slate-200 bg-white p-5">
        <h2 className="text-lg font-extrabold text-slate-800">The cheer squad</h2>
        <p className="mb-3 text-sm text-slate-500">{PEOPLE.filter((p) => p.remote).length} of {PEOPLE.length} teammates are remote. All of them show up on the map.</p>
        <div className="flex flex-wrap gap-2">
          {PEOPLE.map((p) => (
            <div key={p.id} className="flex items-center gap-2 rounded-full border-2 border-slate-200 px-2 py-1 text-xs">
              <Avatar person={p} size={22} />
              <span className="font-bold text-slate-700">{p.name.split(" ")[0]}</span>
              <span className="text-slate-400">{p.location}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 text-center">
        <button type="button" onClick={resetDemo} className="text-xs font-bold text-slate-400 hover:text-slate-600">
          Reset demo
        </button>
      </div>
      <CheerToast cheers={cheers} />
    </main>
  );
}
