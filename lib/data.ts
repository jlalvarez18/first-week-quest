import company from "@/data/company.json";
import stops from "@/data/stops.json";
import people from "@/data/people.json";
import notes from "@/data/notes.json";
import persona from "@/data/persona.json";

export type Doc = { id: string; title: string; body: string };
type StopBase = {
  id: string;
  order: number;
  title: string;
  emoji: string;
  xp: number;
  docId: string;
  /** One line from Clay on why this stop matters, addressed to the new hire. */
  why: string;
};
export type ChecklistItem = { id: string; label: string; /** Where to ask and what to include when this item is stuck. */ help: string };
/** Learn three facts, apply them to a scenario, get coached by Claude. */
export type PracticeStop = StopBase & {
  kind: "practice";
  facts: string[];
  scenario: string;
  task: string;
  rubric: string;
  keywords: string[][];
  hints: string[];
  reveal: string;
};
/** Install, get access, or do a real-world thing. Tick items, then "Setup complete"; "Having an issue" shows help. */
export type ChecklistStop = StopBase & {
  kind: "setup" | "action";
  checklist: ChecklistItem[];
  completeLabel: string;
  people?: string[];
  /** Require choosing one of `people` before completing (coffee chat). */
  pickOne?: boolean;
};
/** One text box, no grading. */
export type ReflectStop = StopBase & { kind: "reflect"; prompt: string };
export type Stop = PracticeStop | ChecklistStop | ReflectStop;
export const isPractice = (s: Stop): s is PracticeStop => s.kind === "practice";
export const isChecklist = (s: Stop): s is ChecklistStop => s.kind === "setup" || s.kind === "action";
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
  "find-your-people": 1,
  "get-your-gear": 6,
  "build-the-app": 12,
  "learn-the-lingo": 9,
  "ship-something-tiny": 4,
  "who-owns-what": 3,
  "get-heard": 2,
  "book-a-coffee": 1,
  "beacon-goes-off": 11,
  "pay-it-forward": 0,
};

export const docById = (id: string) => COMPANY.docs.find((d) => d.id === id);
export const stopById = (id: string) => STOPS.find((s) => s.id === id);
export const personById = (id: string) => PEOPLE.find((p) => p.id === id);
