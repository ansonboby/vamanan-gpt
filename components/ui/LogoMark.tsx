/**
 * LogoMark — Vamanan's ceremonial umbrella as the brand mark.
 * The scalloped hem echoes pookalam petals; the coral finial is the
 * festival accent. Reads cleanly from 16px favicon to nav badge.
 */
export function LogoMark({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="15" fill="#163B32" />
      {/* scalloped canopy — pookalam-petal hem, deeper dome */}
      <path
        d="M9 35Q15.5 26 22 35Q28.5 26 35 35Q41.5 26 48 35Q54.5 26 58 31.5C57 16 45.5 6.5 32 6.5C19 6.5 7.5 16 6.5 32Z"
        fill="#E8B84B"
      />
      {/* inner dome line for depth */}
      <path
        d="M14 33C16 21 23 14.5 32 14.5C41 14.5 48 21 50 33"
        stroke="#C79332"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      {/* rib detail */}
      <path
        d="M32 7C25 9 18.5 15 13 29M32 7C39 9 46 15 51 29"
        stroke="#163B32"
        strokeWidth="1.5"
        strokeOpacity="0.3"
        fill="none"
        strokeLinecap="round"
      />
      {/* straight chatra pole with slight taper feel */}
      <path
        d="M32 33v20"
        stroke="#F6F1E7"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* coral finial with tiny jewel glow */}
      <circle cx="32" cy="5.5" r="3.2" fill="#D85D4E" />
      <circle cx="32" cy="5.5" r="1.1" fill="#F6F1E7" opacity="0.85" />
    </svg>
  );
}
