"use client";
import Avatar from "./Avatar";
import type { Person } from "@/lib/data";

export type Cheer = { id: number; person: Person; text: string };

export default function CheerToast({ cheers }: { cheers: Cheer[] }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
      {cheers.map((c) => (
        <div key={c.id} className="cheer flex items-start gap-3 rounded-2xl border-2 border-emerald-200 bg-white p-3 shadow-lg">
          <Avatar person={c.person} />
          <div className="text-sm">
            <div className="font-bold text-slate-800">
              {c.person.name}
              {c.person.remote && <span className="ml-1 text-xs font-normal text-slate-400">· {c.person.location}</span>}
            </div>
            <div className="text-slate-600">{c.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
