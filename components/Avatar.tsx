import type { Person } from "@/lib/data";

export default function Avatar({ person, size = 32 }: { person: Person; size?: number }) {
  return (
    <span
      title={`${person.name} · ${person.role}`}
      className="inline-flex items-center justify-center rounded-full font-bold text-white shrink-0 ring-2 ring-white"
      style={{ width: size, height: size, background: person.color, fontSize: size * 0.38 }}
    >
      {person.initials}
    </span>
  );
}
