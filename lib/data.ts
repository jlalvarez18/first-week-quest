import company from "@/data/company.json";
import stops from "@/data/stops.json";
import people from "@/data/people.json";
import notes from "@/data/notes.json";
import persona from "@/data/persona.json";

export type Doc = { id: string; title: string; body: string };
export type Stop = {
  id: string;
  order: number;
  title: string;
  emoji: string;
  xp: number;
  docId: string;
  /** One line from Bean on why this stop matters. */
  why: string;
  /** Exactly three facts from the wiki page. They are everything the task needs. */
  facts: string[];
  scenario: string;
  /** The ask, phrased as something to do, not recall. */
  task: string;
  rubric: string;
  keywords: string[][];
  hints: string[];
  reveal: string;
};
export type Person = {
  id: string;
  name: string;
  role: string;
  team: string;
  initials: string;
  color: string;
  remote: boolean;
  location: string;
  cheers: string[];
};

export const COMPANY = company as { name: string; tagline: string; docs: Doc[] };
export const STOPS = (stops as Stop[]).slice().sort((a, b) => a.order - b.order);
export const PEOPLE = people as Person[];

export type TrailNote = {
  id: string;
  stopId: string;
  by: string;
  text: string;
  daysAgo: number;
  helped: number;
  tag?: "buddy" | "owner";
};
export const NOTES = notes as TrailNote[];

/** The fixed role the demo onboards into. The name comes from the sign-in screen, not here. */
export type Persona = { role: string; team: string; teamChannel: string; leadId: string; buddyId: string; teammateIds: string[] };
export const PERSONA = persona as Persona;
/** Color for the signed-in user's avatar everywhere. */
export const USER_COLOR = "#0ea5e9";
export const notesForStop = (stopId: string) => NOTES.filter((n) => n.stopId === stopId);

/** Bundled "last cohort" wrong-answer counts per stop. Per stop only, never per person. */
export const STUCK_BASELINE: Record<string, number> = {
  "find-your-people": 3,
  "get-your-gear": 5,
  "learn-the-lingo": 9,
  "ship-something-tiny": 4,
  "get-heard": 2,
  "book-a-coffee": 1,
  "beacon-goes-off": 11,
  "pay-it-forward": 0,
};

export const docById = (id: string) => COMPANY.docs.find((d) => d.id === id);
export const stopById = (id: string) => STOPS.find((s) => s.id === id);
export const personById = (id: string) => PEOPLE.find((p) => p.id === id);
