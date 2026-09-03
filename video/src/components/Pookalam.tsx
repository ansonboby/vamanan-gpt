/**
 * Pookalam for video — same ring geometry as the app's
 * PookalamBuilder (centre r=26, ring i at 26+(i+1)*11), rendered
 * frame-by-frame so rings lay themselves over time.
 */
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { C, EASE } from "../tokens";

const DAYS = [
  "Atham", "Chithira", "Chothi", "Vishakam", "Anizham",
  "Thriketta", "Moolam", "Pooradam", "Uthradam", "Thiruvonam",
];

const RING_COLORS = ["#E8B84B", "#D85D4E", "#163B32", "#FFFDF8", "#E1ECE7"];

export function ringRadius(i: number): number {
  return 26 + (i + 1) * 11;
}

export function RingPetals({
  index,
  color,
  appearAt,
}: {
  index: number;
  color: string;
  appearAt: number; // frame at which this ring starts appearing
}) {
  const frame = useCurrentFrame();
  const r = ringRadius(index);
  const petals = Math.max(10, Math.round((2 * Math.PI * r) / 12));
  const scale = interpolate(frame, [appearAt, appearAt + 10], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE),
  });
  const opacity = interpolate(frame, [appearAt, appearAt + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <g
      style={{
        transformOrigin: "160px 160px",
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {Array.from({ length: petals }, (_, j) => {
        const angle = (360 / petals) * j;
        return (
          <ellipse
            key={j}
            cx={160 + r - 6}
            cy={160}
            rx={7}
            ry={4.8}
            fill={color}
            stroke={color === "#FFFDF8" || color === "#E1ECE7" ? "#DDD5C6" : undefined}
            strokeWidth={color === "#FFFDF8" || color === "#E1ECE7" ? 0.6 : 0}
            opacity={j % 2 ? 1 : 0.88}
            transform={`rotate(${angle} 160 160)`}
          />
        );
      })}
    </g>
  );
}

export function Pookalam({
  rings,           // how many rings are laid
  frameStart = 0,   // frame at which ring 0 appears; ring i at frameStart + i*4
  size = 320,
}: {
  rings: number;
  frameStart?: number;
  size?: number;
}) {
  return (
    <svg viewBox="0 0 320 320" width={size} height={size}>
      <circle cx="160" cy="160" r="152" fill="#FFFDF8" stroke="#DDD5C6" strokeWidth="1" strokeDasharray="2 6" />
      <circle cx="160" cy="160" r="26" fill="#FFFDF8" stroke="#163B32" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 4" />
      <circle cx="160" cy="160" r="5" fill="#D85D4E" />
      {Array.from({ length: rings }, (_, i) => (
        <RingPetals
          key={i}
          index={i}
          color={RING_COLORS[i % RING_COLORS.length]}
          appearAt={frameStart + i * 4}
        />
      ))}
    </svg>
  );
}

/** Day chips (Atham → Thiruvonam) lighting up as rings are laid. */
export function DayChips({ active }: { active: number }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {DAYS.map((day, i) => (
        <span
          key={day}
          style={{
            fontSize: 15,
            fontWeight: 500,
            padding: "5px 12px",
            borderRadius: 999,
            fontFamily: "Inter, system-ui, sans-serif",
            ...(i < active
              ? { background: C.forest, color: C.paperOnForest }
              : { border: `1px solid ${C.line}`, color: C.inkMuted, background: C.surface }),
          }}
        >
          {day}
        </span>
      ))}
    </div>
  );
}
