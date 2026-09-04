import Link from "next/link";
import Mascot from "@/components/Mascot";
import { COMPANY, STOPS } from "@/lib/data";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center px-4 py-12 text-center">
      <div className="bouncy">
        <Mascot size={120} />
      </div>
      <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-slate-800">First Week Quest</h1>
      <p className="mt-3 max-w-xl text-lg text-slate-600">
        Onboarding is a list of links you read alone. This is a Duolingo-style path you play with your team.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/quest"
          className="rounded-2xl bg-emerald-500 px-7 py-4 text-lg font-extrabold text-white shadow-[0_5px_0_#059669] transition hover:translate-y-0.5 hover:shadow-[0_3px_0_#059669]"
        >
          ▶ Play as a new hire
        </Link>
        <Link
          href="/team?play=1"
          className="rounded-2xl bg-sky-500 px-7 py-4 text-lg font-extrabold text-white shadow-[0_5px_0_#0284c7] transition hover:translate-y-0.5 hover:shadow-[0_3px_0_#0284c7]"
        >
          👀 Watch a team
        </Link>
      </div>
      <p className="mt-3 text-sm text-slate-400">
        Demo company: {COMPANY.name}. {STOPS.length} stops. No sign-up. Nothing leaves your browser except the answer you type.
      </p>

      <div className="mt-14 grid w-full gap-4 text-left sm:grid-cols-3">
        <Card emoji="🎮" title="Learn by doing">
          Each stop is a real week-one task. Claude grades your answer against the wiki and gives a hint, never the answer first.
        </Card>
        <Card emoji="🫶" title="Never alone">
          Every stop carries a note from a teammate who was new once. Finish a stop and the team cheers. Remote folks included.
        </Card>
        <Card emoji="📊" title="Fixes the docs">
          Where new hires get stuck is counted per stop, never per person. That is a live signal for which pages need work.
        </Card>
      </div>

      <div className="mt-12 text-xs text-slate-400">
        Borrowed from Duolingo: the path, the Check button, XP, streaks, a mascot. Left out on purpose: hearts. Nobody should lose a life on their first week.
      </div>
    </main>
  );
}

function Card({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-5">
      <div className="text-3xl">{emoji}</div>
      <div className="mt-2 text-lg font-extrabold text-slate-800">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{children}</div>
    </div>
  );
}
