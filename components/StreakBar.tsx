export default function StreakBar({ xp, streak, done, total }: { xp: number; streak: number; done: number; total: number }) {
  return (
    <div className="flex items-center gap-3 text-sm font-bold">
      <span className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-orange-700" title="Streak">
        🔥 {streak}
      </span>
      <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-yellow-700" title="XP">
        ⚡ {xp} XP
      </span>
      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700" title="Stops done">
        ✅ {done}/{total}
      </span>
    </div>
  );
}
