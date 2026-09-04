/** Bean: a coffee bean in a hard hat. Mood changes the eyes. */
export default function Mascot({ mood = "happy", size = 72 }: { mood?: "happy" | "think" | "party"; size?: number }) {
  const eyes =
    mood === "party" ? (
      <>
        <path d="M22 30 l5 -4 l5 4" stroke="#3b2417" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M40 30 l5 -4 l5 4" stroke="#3b2417" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>
    ) : mood === "think" ? (
      <>
        <circle cx="27" cy="30" r="2.5" fill="#3b2417" />
        <circle cx="45" cy="30" r="2.5" fill="#3b2417" />
        <path d="M23 24 l8 -3" stroke="#3b2417" strokeWidth="2" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="27" cy="30" r="3" fill="#3b2417" />
        <circle cx="45" cy="30" r="3" fill="#3b2417" />
        <circle cx="28" cy="29" r="1" fill="#fff" />
        <circle cx="46" cy="29" r="1" fill="#fff" />
      </>
    );
  const mouth =
    mood === "think" ? (
      <path d="M31 42 h10" stroke="#3b2417" strokeWidth="2.5" strokeLinecap="round" />
    ) : (
      <path d="M29 40 q7 7 14 0" stroke="#3b2417" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    );
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" aria-label="Bean the mascot" role="img">
      <ellipse cx="36" cy="40" rx="24" ry="28" fill="#8b5a2b" />
      <path d="M36 14 q-6 26 0 52" stroke="#5c3a1a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="36" cy="40" rx="24" ry="28" fill="none" stroke="#5c3a1a" strokeWidth="2" />
      {eyes}
      {mouth}
      <path d="M14 20 q22 -18 44 0 v4 h-44z" fill="#fbbf24" />
      <rect x="12" y="20" width="48" height="6" rx="3" fill="#f59e0b" />
      <rect x="32" y="8" width="8" height="10" rx="2" fill="#fbbf24" />
    </svg>
  );
}
