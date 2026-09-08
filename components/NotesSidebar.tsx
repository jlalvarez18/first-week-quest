"use client";
import { useState } from "react";
import Avatar from "./Avatar";
import { notesForStop, personById, STUCK_BASELINE, USER_COLOR, type TrailNote } from "@/lib/data";
import { firstName, initialsOf } from "@/lib/user";
import type { Progress } from "@/lib/progress";

export type UserNote = Progress["notes"][number];

function timeAgo(days: number) {
  if (days < 1) return "just now";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.round(days / 7)} week${days >= 14 ? "s" : ""} ago`;
  if (days < 365) return `${Math.round(days / 30)} month${days >= 60 ? "s" : ""} ago`;
  return `${Math.round(days / 365)} year${days >= 730 ? "s" : ""} ago`;
}

type Row = { id: string; text: string; daysAgo: number; helped: number; tag?: TrailNote["tag"]; by?: string; mine: boolean };

export default function NotesSidebar({
  stopId,
  canPost,
  progress,
  userName,
  onPost,
  onHelp,
  onClose,
}: {
  stopId: string;
  canPost: boolean;
  progress: Progress;
  userName: string;
  onPost: (text: string) => void;
  onHelp: (noteId: string) => void;
  onClose?: () => void;
}) {
  const [draft, setDraft] = useState("");
  const mine: Row[] = progress.notes
    .filter((n) => n.stopId === stopId)
    // Own notes are all from this week, so "just now" is honest enough and keeps render pure.
    .map((n) => ({ id: n.id, text: n.text, daysAgo: 0, helped: 0, mine: true }));
  const bundled: Row[] = notesForStop(stopId).map((n) => ({ ...n, mine: false }));
  const rows = [...bundled, ...mine]
    .map((r) => ({ ...r, helped: r.helped + (progress.helped.includes(r.id) ? 1 : 0) }))
    .sort((a, b) => Number(b.tag === "buddy") - Number(a.tag === "buddy") || b.helped - a.helped);
  const stuck = (STUCK_BASELINE[stopId] ?? 0) + (progress.wrong[stopId] ?? 0);

  function post() {
    const t = draft.trim();
    if (!t || !canPost) return;
    onPost(t);
    setDraft("");
  }

  return (
    <aside className="flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b-2 border-slate-200 px-4 py-3">
        <b className="text-sm text-slate-800">💬 Notes from the trail</b>
        <span className="flex items-center gap-2">
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-extrabold text-sky-700">{rows.length}</span>
          {onClose && (
            <button type="button" onClick={onClose} aria-label="Close notes" className="text-slate-400 hover:text-slate-600">
              ✕
            </button>
          )}
        </span>
      </div>
      {stuck > 0 && (
        <div className="note-in border-b-2 border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold text-orange-800">
          🪤 {stuck} {stuck === 1 ? "person" : "people"} got stuck here. You are not alone.
        </div>
      )}
      <ul key={stopId} className="flex-1 overflow-y-auto py-1">
        {rows.map((r, i) => {
          const p = r.by ? personById(r.by) : undefined;
          const helpedByMe = progress.helped.includes(r.id);
          return (
            <li
              key={r.id}
              style={{ animationDelay: `${Math.min(i * 60, 300)}ms` }}
              className={`note-in flex gap-2.5 px-4 py-2.5 ${r.tag === "buddy" ? "bg-yellow-50" : ""}`}
            >
              <Avatar person={p ?? { name: userName, initials: initialsOf(userName), color: USER_COLOR }} size={30} />
              <div className="min-w-0">
                <div className="text-[13px] font-extrabold text-slate-800">
                  {p?.name ?? `${firstName(userName)} (you)`}
                  {r.tag === "buddy" && <span className="ml-1 rounded bg-sky-100 px-1 text-[10px] text-sky-700">📌 buddy</span>}
                  {r.tag === "owner" && <span className="ml-1 rounded bg-amber-100 px-1 text-[10px] text-amber-800">owner</span>}
                </div>
                <div className="text-[11px] text-slate-400">
                  {p ? `${p.location}${p.remote ? " · remote" : ""} · ` : ""}
                  {timeAgo(r.daysAgo)}
                </div>
                <div className="mt-0.5 text-[13px] text-slate-600">{r.text}</div>
                <button
                  type="button"
                  disabled={r.mine}
                  onClick={() => onHelp(r.id)}
                  className={[
                    "mt-1.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-extrabold transition-colors duration-150",
                    helpedByMe ? "helped-pop border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                    r.mine && "cursor-default opacity-60",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  🙌 Helped me · {r.helped}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="border-t-2 border-slate-200 bg-slate-50 p-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={!canPost}
          rows={2}
          placeholder={canPost ? "Leave a note for the next new hire…" : "Finish this stop to leave a note."}
          className="w-full rounded-xl border-2 border-slate-200 bg-white p-2.5 text-[13px] outline-none focus:border-sky-400 disabled:bg-slate-100 disabled:text-slate-400"
        />
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>Shows on this stop and the team board.</span>
          <button
            type="button"
            onClick={post}
            disabled={!canPost || !draft.trim()}
            className="rounded-xl bg-sky-500 px-3.5 py-1.5 text-[13px] font-extrabold text-white shadow-[0_3px_0_#0284c7] disabled:bg-slate-300 disabled:shadow-none"
          >
            Post
          </button>
        </div>
      </div>
    </aside>
  );
}
