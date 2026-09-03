/** Act 8 — end card: brand, domain, repo, tagline. */
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, FONT_DISPLAY, FONT_SANS, EASE, s } from "../tokens";
import { LogoMark } from "../components/LogoMark";
import { VamananAvatar } from "../components/VamananAvatar";

export const EndScene = () => {
  const frame = useCurrentFrame();
  const fadeIn = (d: number) =>
    interpolate(frame, [d, d + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = (d: number) =>
    interpolate(frame, [d, d + 10], [14, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...EASE),
    });

  return (
    <AbsoluteFill
      style={{
        background: C.forest,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
      }}
    >
      {/* faint pookalam backdrop */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: 0.08 }}>
        <Pookalam rings={10} frameStart={-999} size={1100} />
      </AbsoluteFill>

      <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: fadeIn(4), transform: `translateY(${rise(4)}px)` }}>
        <LogoMark size={72} />
        <h1 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 56, fontWeight: 600, color: C.paperOnForest }}>
          Vamanan&nbsp;GPT
        </h1>
      </div>

      <p
        style={{
          margin: 0,
          fontFamily: FONT_DISPLAY,
          fontSize: 30,
          fontStyle: "italic",
          color: C.marigold,
          opacity: fadeIn(14),
        }}
      >
        vamanan.is-a.dev
      </p>

      <div style={{ display: "flex", gap: 14, opacity: fadeIn(22) }}>
        <VamananAvatar state="celebrating" size={130} />
      </div>

      <p style={{ margin: 0, fontFamily: FONT_SANS, fontSize: 18, color: "rgba(246,241,231,0.72)", opacity: fadeIn(28) }}>
        Built with Next.js · Gemini · three paces of code —
        <span style={{ color: C.marigold }}> Onam ashamsakal! 🌾</span>
      </p>
      <p style={{ margin: 0, fontFamily: FONT_SANS, fontSize: 15, color: "rgba(246,241,231,0.5)", opacity: fadeIn(34) }}>
        github.com/ansonboby/vamanan-gpt
      </p>
    </AbsoluteFill>
  );
};

import { Pookalam } from "../components/Pookalam";
