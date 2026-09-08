import type { Person } from "@/lib/data";

type Look = Pick<Person, "name" | "initials" | "color"> & { role?: string };

/** Round initials badge. Accepts a full Person or just { name, initials, color } for the signed-in user. */
export default function Avatar({ person, size = 32 }: { person: Look; size?: number }) {
  return (
    <span
      title={person.role ? `${person.name} · ${person.role}` : person.name}
      className="inline-flex items-center justify-center rounded-full font-bold text-white shrink-0 ring-2 ring-white"
      style={{ width: size, height: size, background: person.color, fontSize: size * 0.38 }}
    >
      {person.initials}
    </span>
  );
}
