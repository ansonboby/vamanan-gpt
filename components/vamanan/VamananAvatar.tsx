/**
 * Vamanan — hand-drawn SVG character.
 * A small dwarf storyteller with a coconut-shell umbrella, inspired by
 * the Vamana tradition: warm, clever, gently mischievous.
 */

export type VamananState = "idle" | "thinking" | "speaking" | "celebrating" | "storytelling";

export function VamananAvatar({
  state = "idle",
  size = 200,
  className = "",
  decorative = true,
}: {
  state?: VamananState;
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 200 260"
      width={size}
      height={(size * 260) / 200}
      className={className}
      role={decorative ? "presentation" : undefined}
      aria-hidden={decorative ? true : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ground shadow */}
      <ellipse cx="100" cy="248" rx="52" ry="8" fill="#163B32" opacity="0.08" />

      {/* ── umbrella ── */}
      <g>
        {/* canopy */}
        <path
          d="M52 52 C52 22 148 22 148 52 L140 56 C137 50 130 50 128 55 C125 49 116 49 114 55 C111 49 102 49 100 55 C97 49 88 49 86 55 C83 49 74 49 72 55 C70 50 63 50 60 56 Z"
          fill="#E8B84B"
        />
        {/* ribs */}
        <path d="M100 26 L100 56 M68 38 L74 58 M132 38 L126 58" stroke="#163B32" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
        {/* tip + rim */}
        <circle cx="100" cy="22" r="3.4" fill="#D85D4E" />
        <path d="M52 52 C52 46 148 46 148 52" stroke="#163B32" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        {/* pole */}
        <path d="M100 56 L100 58 C100 80 118 92 122 108" stroke="#6E4A2B" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>

      {/* ── head ── */}
      {/* topknot */}
      <circle cx="100" cy="58" r="8" fill="#161616" />
      <path d="M92 66 C92 58 108 58 108 66" fill="#161616" />
      {/* face */}
      <circle cx="100" cy="88" r="30" fill="#C98A54" />
      {/* ears */}
      <circle cx="70" cy="90" r="5" fill="#C98A54" />
      <circle cx="130" cy="90" r="5" fill="#C98A54" />
      {/* earrings — small marigold studs */}
      <circle cx="70" cy="98" r="2.6" fill="#E8B84B" />
      <circle cx="130" cy="98" r="2.6" fill="#E8B84B" />
      {/* hairline */}
      <path d="M76 74 C82 62 118 62 124 74 C116 70 84 70 76 74 Z" fill="#161616" />
      {/* tilak */}
      <path d="M100 72 L100 80" stroke="#D85D4E" strokeWidth="2.2" strokeLinecap="round" />

      {/* ── expressions ── */}
      {state === "idle" && (
        <>
          <circle cx="92" cy="88" r="2.8" fill="#161616" />
          <circle cx="108" cy="88" r="2.8" fill="#161616" />
          <path d="M94 101 C97 104 103 104 106 101" stroke="#161616" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="86" cy="97" r="3" fill="#D85D4E" opacity="0.35" />
          <circle cx="114" cy="97" r="3" fill="#D85D4E" opacity="0.35" />
        </>
      )}
      {state === "thinking" && (
        <>
          {/* eyes glancing up */}
          <circle cx="92" cy="86" r="2.8" fill="#161616" />
          <circle cx="108" cy="86" r="2.8" fill="#161616" />
          <path d="M94 102 C96 100.5 104 100.5 106 102" stroke="#161616" strokeWidth="2" strokeLinecap="round" />
          {/* thought puff */}
          <circle cx="142" cy="64" r="4" fill="#E1ECE7" />
          <circle cx="152" cy="54" r="6" fill="#E1ECE7" />
          <circle cx="166" cy="42" r="8.5" fill="#E1ECE7" />
        </>
      )}
      {state === "speaking" && (
        <>
          <circle cx="92" cy="88" r="2.8" fill="#161616" />
          <circle cx="108" cy="88" r="2.8" fill="#161616" />
          <ellipse cx="100" cy="102" rx="5" ry="6" fill="#8C3B30" />
        </>
      )}
      {state === "celebrating" && (
        <>
          {/* closed happy eyes */}
          <path d="M88 88 C90 84 96 84 98 88" stroke="#161616" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M102 88 C104 84 110 84 112 88" stroke="#161616" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M93 101 C96 105 104 105 107 101" stroke="#161616" strokeWidth="2.4" strokeLinecap="round" />
          {/* confetti petals */}
          <circle cx="148" cy="30" r="3" fill="#D85D4E" />
          <circle cx="158" cy="44" r="2.4" fill="#E8B84B" />
          <circle cx="44" cy="34" r="3" fill="#E8B84B" />
          <circle cx="36" cy="52" r="2.4" fill="#D85D4E" />
        </>
      )}
      {state === "storytelling" && (
        <>
          <path d="M88 89 C90 85 96 85 98 89" stroke="#161616" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="108" cy="88" r="2.8" fill="#161616" />
          <path d="M94 102 C97 105.5 103 105.5 106 102" stroke="#161616" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}

      {/* ── body ── */}
      {/* torso + dhoti */}
      <path
        d="M84 114 C84 108 116 108 116 114 L124 130 L120 210 C120 216 80 216 80 210 L76 130 Z"
        fill="#163B32"
      />
      {/* dhoti fold */}
      <path d="M100 114 L100 213" stroke="#0F2B24" strokeWidth="2" opacity="0.6" />
      {/* marigold hem */}
      <path d="M80.5 206 L119.5 206 L120 214 C120 216.5 80 216.5 80 214 Z" fill="#E8B84B" />
      <path d="M80.8 210 C94 213 106 213 119.2 210" stroke="#163B32" strokeWidth="1.6" opacity="0.35" strokeLinecap="round" />
      {/* sacred thread */}
      <path d="M88 116 C94 126 106 126 112 116" stroke="#FFFDF8" strokeWidth="2.4" fill="none" opacity="0.85" />
      {/* garland */}
      <g fill="#E8B84B">
        <circle cx="90" cy="121" r="3.2" />
        <circle cx="95" cy="125" r="3.2" />
        <circle cx="100" cy="127" r="3.2" />
        <circle cx="105" cy="125" r="3.2" />
        <circle cx="110" cy="121" r="3.2" />
      </g>

      {/* arms */}
      {/* left arm resting */}
      <path d="M78 122 C70 130 68 142 74 150" stroke="#C98A54" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* right arm up to umbrella */}
      <path d="M122 122 C130 124 126 96 122 92" stroke="#C98A54" strokeWidth="9" strokeLinecap="round" fill="none" />
      <circle cx="122" cy="108" r="5.5" fill="#C98A54" />

      {/* feet */}
      <path d="M90 214 L90 224 M110 214 L110 224" stroke="#B07942" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}
