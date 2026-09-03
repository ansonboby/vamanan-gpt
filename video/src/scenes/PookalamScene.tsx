/** Act 3 — lay a pookalam: rings lay themselves, days light up, complete. */
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, FONT_DISPLAY, FONT_SANS, EASE, s } from "../tokens";
import { Pookalam, DayChips } from "../components/Pookalam";
import { VamananAvatar } from "../components/VamananAvatar";

export const PookalamScene = () => {
  const frame = useCurrentFrame();
  // one ring every 12 frames → 10 rings in 4s, then hold
  const laid = Math.min(10, Math.max(0, Math.floor((frame - s(0.8)) / 12) + 1));
  const complete = laid >= 10;
  const doneAt = s(0.8) + 9 * 12 + 10;
  const burst = interpolate(frame, [doneAt, doneAt + 12], [0.9, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE),
  });
  const titleIn = interpolate(frame, [0, 12], [16, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE),
  });

  return (
    <AbsoluteFill
      style={{
        background: C.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 110,
      }}
    >
      <div style={{ maxWidth: 620 }}>
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 54,
            fontWeight: 600,
            color: C.ink,
            margin: 0,
            transform: `translateY(${titleIn}px)`,
          }}
        >
          Lay a pookalam
        </h2>
        <p style={{ fontFamily: FONT_SANS, fontSize: 20, color: C.inkMuted, lineHeight: 1.55, marginTop: 14 }}>
          The flower carpet begins small on <strong>Atham</strong> and grows one
          ring each day until <strong>Thiruvonam</strong> — swept and begun
          again, a welcome remade daily for a king&apos;s homecoming.
        </p>
        <div style={{ marginTop: 26 }}>
          <DayChips active={laid} />
        </div>
        {complete && (
          <div
            style={{
              marginTop: 26,
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: C.marigoldSoft,
              border: `1px solid ${C.marigold}`,
              borderRadius: 14,
              padding: "14px 20px",
              opacity: interpolate(frame, [doneAt, doneAt + 8], [0, 1], { extrapolateLeft: "clamp" }),
            }}
          >
            <VamananAvatar state="celebrating" size={72} />
            <p style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 600, color: C.forest }}>
              Onam ashamsakal! Ten rings, ten days.
            </p>
          </div>
        )}
      </div>
      <div style={{ transform: `scale(${burst})` }}>
        <Pookalam rings={laid} frameStart={s(0.8)} size={430} />
      </div>
    </AbsoluteFill>
  );
};
