"use client";

/**
 * The signed-in name from the demo sign-in screen. Kept under its own key, separate from
 * progress, so "Reset progress" keeps you signed in and "Sign out" keeps your progress.
 * Nothing is sent anywhere.
 */
const KEY = "first-week-quest:user";

export function getName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(KEY)?.trim() || null;
  } catch {
    return null;
  }
}

export function setName(name: string) {
  try {
    localStorage.setItem(KEY, name.trim());
  } catch {}
}

export function clearName() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

export const firstName = (name: string) => name.trim().split(/\s+/)[0];

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0]?.slice(0, 2) ?? "?").toUpperCase();
}
