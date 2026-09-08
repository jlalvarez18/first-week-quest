/**
 * Clay: the onboarding mascot. A soft eight-lobed spark in warm terracotta with a face.
 * Original character, not a logo. `mood` changes the eyes and mouth.
 */
export default function Mascot({ mood = "happy", size = 72 }: { mood?: "happy" | "think" | "party"; size?: number }) {
  const eyes =
    mood === "party" ? (
      <>
        <path d="M22 33 q5 -6 10 0" stroke="#3b1f14" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M40 33 q5 -6 10 0" stroke="#3b1f14" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    ) : mood === "think" ? (
      <>
        <ellipse cx="27" cy="33" rx="4.5" ry="5" fill="#fff" />
        <ellipse cx="45" cy="33" rx="4.5" ry="5" fill="#fff" />
        <circle cx="28.5" cy="34" r="2.4" fill="#3b1f14" />
        <circle cx="46.5" cy="34" r="2.4" fill="#3b1f14" />
        <path d="M22 25 l9 -2.5" stroke="#3b1f14" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ) : (
      <>
        <ellipse cx="27" cy="33" rx="4.5" ry="5.5" fill="#fff" />
        <ellipse cx="45" cy="33" rx="4.5" ry="5.5" fill="#fff" />
        <circle cx="28" cy="34" r="2.6" fill="#3b1f14" />
        <circle cx="46" cy="34" r="2.6" fill="#3b1f14" />
        <circle cx="29" cy="33" r="0.9" fill="#fff" />
        <circle cx="47" cy="33" r="0.9" fill="#fff" />
      </>
    );
  const mouth =
    mood === "think" ? (
      <path d="M31 45 h10" stroke="#3b1f14" strokeWidth="2.5" strokeLinecap="round" />
    ) : mood === "party" ? (
      <path d="M28 43 q8 10 16 0 z" fill="#3b1f14" />
    ) : (
      <path d="M29 43 q7 7 14 0" stroke="#3b1f14" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    );
  // Eight soft lobes around a core, drawn as rotated rounded rects so the silhouette reads as a spark.
  const lobes = Array.from({ length: 8 }, (_, i) => (
    <rect key={i} x="30" y="4" width="12" height="30" rx="6" fill="#d97757" transform={`rotate(${i * 45} 36 36)`} />
  ));
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" aria-label="Clay the mascot" role="img">
      <g>{lobes}</g>
      <circle cx="36" cy="36" r="22" fill="#e08a6c" />
      <circle cx="36" cy="36" r="22" fill="none" stroke="#c4623f" strokeWidth="1.5" opacity="0.5" />
      <ellipse cx="21" cy="41" rx="4" ry="2.4" fill="#f4b8a6" />
      <ellipse cx="51" cy="41" rx="4" ry="2.4" fill="#f4b8a6" />
      {eyes}
      {mouth}
    </svg>
  );
}
