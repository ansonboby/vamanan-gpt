/**
 * LogoMark for video — the app's own chatra-umbrella brand mark,
 * copied verbatim from components/ui/LogoMark.tsx.
 */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="15" fill="#163B32" />
      <path d="M32 33v18" stroke="#F6F1E7" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path
        d="M10 34Q15.5 27 21 34Q26.5 27 32 34Q37.5 27 43 34Q48.5 27 54 34C54 17 44 8 32 8C20 8 10 17 10 34Z"
        fill="#E8B84B"
      />
      <path
        d="M32 8C25 10 18 16 12 30M32 8C39 10 46 16 52 30"
        stroke="#163B32"
        strokeWidth="1.6"
        strokeOpacity="0.28"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="32" cy="6.5" r="3.4" fill="#D85D4E" />
    </svg>
  );
}
