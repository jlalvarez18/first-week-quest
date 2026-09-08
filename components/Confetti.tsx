/**
 * Confetti. `burst` is a one-shot full-screen shower for a correct answer; without it the
 * pieces loop inside the parent (the finish screen). Pointer-events off so nothing is blocked.
 */
export default function Confetti({ burst = false, count = 40 }: { burst?: boolean; count?: number }) {
  const colors = ["#f59e0b", "#10b981", "#0ea5e9", "#ec4899", "#8b5cf6", "#d97757"];
  return (
    <div className={`pointer-events-none overflow-hidden ${burst ? "fixed inset-0 z-30" : "absolute inset-0"}`} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`absolute block h-2.5 w-2.5 rounded-sm ${burst ? "confetti-burst" : "confetti"}`}
          style={{
            left: `${(i * 37) % 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${(i % 10) * (burst ? 0.05 : 0.15)}s`,
            animationDuration: `${(burst ? 1.4 : 2.5) + (i % 5) * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}
