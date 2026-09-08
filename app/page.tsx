"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Mascot from "@/components/Mascot";
import SsoSequence from "@/components/SsoSequence";
import { withViewTransition } from "@/lib/transition";
import { COMPANY, PERSONA, STOPS } from "@/lib/data";
import { clearName, firstName, getName, setName } from "@/lib/user";

export default function SignIn() {
  const router = useRouter();
  const [existing, setExisting] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [shake, setShake] = useState(false);
  /** Set once the form is submitted; swaps the page into the SSO sequence with a hero morph on Clay. */
  const [signingIn, setSigningIn] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
    setExisting(getName());
  }, []);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const name = draft.trim();
    if (!name) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setName(name);
    withViewTransition(() => setSigningIn(name));
  }

  function signOut() {
    clearName();
    setExisting(null);
    setDraft("");
  }

  return (
    <main
      className={`mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center px-4 text-center ${signingIn ? "justify-center py-8" : "py-12"}`}
    >
      <div
        className={signingIn ? "" : "bouncy"}
        style={{ viewTransitionName: "mascot" }}
      >
        <Mascot
          size={signingIn ? 96 : 110}
          mood={
            existing || signingIn
              ? "party"
              : signingIn === null && draft
                ? "think"
                : "happy"
          }
        />
      </div>

      {signingIn ? (
        <div className="mt-8 flex w-full flex-col items-center">
          <SsoSequence name={signingIn} onDone={() => router.push("/quest")} />
        </div>
      ) : existing ? (
        <div
          className="enter mt-4 flex flex-col items-center"
          style={{ "--i": 0 } as React.CSSProperties}
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
            Welcome back, {firstName(existing)}.
          </h1>
          <p className="mt-2 text-slate-600">
            {PERSONA.role}, {PERSONA.team} team. Your quest is where you left
            it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/quest"
              className="rounded-2xl bg-emerald-500 px-7 py-4 text-lg font-extrabold text-white shadow-[0_5px_0_#059669] transition hover:translate-y-0.5 hover:shadow-[0_3px_0_#059669]"
            >
              Continue →
            </Link>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="mt-3 text-sm font-bold text-slate-400 hover:text-slate-600"
          >
            Not you? Sign out
          </button>
        </div>
      ) : (
        <form
          onSubmit={submit}
          className="enter mt-4 flex w-full max-w-md flex-col items-center"
          style={
            {
              "--i": 0,
              viewTransitionName: "signin-form",
            } as React.CSSProperties
          }
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
            Let&apos;s sign in.
          </h1>
          <label htmlFor="name" className="mt-2 text-lg text-slate-600">
            What&apos;s your name?
          </label>
          <input
            id="name"
            autoFocus
            autoComplete="off"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Your name"
            className={`mt-5 w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-center text-xl font-semibold text-slate-800 outline-none transition-colors focus:border-sky-400 ${shake ? "shake border-rose-400" : ""}`}
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-2xl bg-sky-500 px-7 py-4 text-lg font-extrabold text-white shadow-[0_5px_0_#0284c7] transition hover:translate-y-0.5 hover:shadow-[0_3px_0_#0284c7]"
          >
            Login →
          </button>
          <p className="mt-3 text-xs text-slate-400">
            Demo sign-in. Nothing is sent anywhere. Your name stays in this
            browser.
          </p>
        </form>
      )}

      {signingIn ? null : (
        <div
          className="flex w-full flex-col items-center"
          style={{ viewTransitionName: "signin-rest" }}
        >
          <p className="mt-8 text-sm text-slate-400">
            <Link
              href="/team?play=1"
              className="font-bold text-sky-600 hover:underline"
            >
              Or watch a team play →
            </Link>
          </p>

          <div className="mt-14 grid w-full gap-4 text-left sm:grid-cols-3">
            <Card emoji="🎮" title="Learn, then try">
              Each stop teaches three facts, then hands you a real week-one
              scenario. Claude coaches your attempt and points you back to the
              card you need.
            </Card>
            <Card emoji="🫶" title="Never alone">
              Every stop carries notes from teammates who were new once. Finish
              a stop and the team cheers. Remote folks included.
            </Card>
            <Card emoji="📊" title="Fixes the docs">
              Where new hires get stuck is counted per stop, never per person.
              That is a live signal for which pages need work.
            </Card>
          </div>

          <div className="mt-12 max-w-xl text-xs text-slate-400">
            <p>
              You play as a new {PERSONA.role} joining the {PERSONA.team} team
              at {COMPANY.name}. {STOPS.length} stops.
            </p>
            <p className="mt-1">
              This is a fictional slice of Anthropic made for practice. Every
              person, channel, and rule is invented. It is not how anything
              really works there.
            </p>
            <p className="mt-1">
              Borrowed from Duolingo: the path, XP, streaks, a mascot. Left out
              on purpose: hearts. Nobody should lose a life in their first week.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

function Card({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-5">
      <div className="text-3xl">{emoji}</div>
      <div className="mt-2 text-lg font-extrabold text-slate-800">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{children}</div>
    </div>
  );
}
