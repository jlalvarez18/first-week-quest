import company from "@/data/company.json";
import stops from "@/data/stops.json";
import people from "@/data/people.json";

export type Doc = { id: string; title: string; body: string };
export type Stop = {
  id: string;
  order: number;
  title: string;
  emoji: string;
  xp: number;
  docId: string;
  prompt: string;
  rubric: string;
  keywords: string[][];
  hints: string[];
  reveal: string;
  noteBy: string;
  note: string;
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

export const docById = (id: string) => COMPANY.docs.find((d) => d.id === id);
export const stopById = (id: string) => STOPS.find((s) => s.id === id);
export const personById = (id: string) => PEOPLE.find((p) => p.id === id);
