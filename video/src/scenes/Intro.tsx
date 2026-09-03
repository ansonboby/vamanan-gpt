/** Act 1 — cold open: LogoMark draws in, "Meet Vamanan.", marigold underline. */
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, FONT_DISPLAY, FONT_SANS, EASE } from "../tokens";
import { LogoMark } from "../components/LogoMark";
import { VamananAvatar } from "../components/VamananAvatar";

export const IntroScene = () => {
  const frame = useCurrentFrame();
  const logoScale = interpolate(frame, [0, 15], [0.6, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE),
  });
  const logoOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [12, 26], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [12, 26], [16, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE),
  });
  const lineWidth = interpolate(frame, [24, 40], [0, 430], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE),
  });
  const subOpacity = interpolate(frame, [34, 48], [0, 1], { extrapolateRight: "clamp" });
  const breathe = 1 + 0.012 * Math.sin((frame / 45) * Math.PI);
  const fadeOut = interpolate(frame, [125, 150], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: C.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
        <div
          style={{
            transform: `scale(${logoScale * breathe})`,
            opacity: logoOpacity,
          }}
        >
          <LogoMark size={150} />
        </div>
        <div>
          <h1
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 92,
              fontWeight: 600,
              color: C.ink,
              margin: 0,
              letterSpacing: "-0.02em",
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
            }}
          >
            Meet Vamanan.
          </h1>
          <div
            style={{
              marginTop: 14,
              height: 5,
              width: lineWidth,
              background: C.marigold,
              borderRadius: 3,
            }}
          />
          <p
            style={{
              marginTop: 22,
              fontFamily: FONT_SANS,
              fontSize: 22,
              color: C.inkMuted,
              marginBlock: 0,
              opacity: subOpacity,
              letterSpacing: "0.02em",
            }}
          >
            A storyteller from Kerala&apos;s Onam tradition — powered by AI.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
