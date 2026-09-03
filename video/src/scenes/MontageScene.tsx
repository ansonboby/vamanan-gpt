/** Act 7 — montage: fast cuts of hero/pookalam/story/quiz, ring wipes. */
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, FONT_DISPLAY, FONT_SANS, EASE, s } from "../tokens";
import { LogoMark } from "../components/LogoMark";
import { Pookalam } from "../components/Pookalam";
import { VamananAvatar } from "../components/VamananAvatar";

const CUTS = [
  { label: "Meet Vamanan", type: "hero" },
  { label: "Lay a pookalam", type: "pookalam" },
  { label: "Hear the story", type: "story" },
  { label: "Take the challenge", type: "quiz" },
] as const;

const CUT_FRAMES = 18; // 0.6s per cut

export const MontageScene = () => {
  const frame = useCurrentFrame();
  const cutIndex = Math.min(CUTS.length - 1, Math.floor(frame / CUT_FRAMES));
  const cutLocal = frame - cutIndex * CUT_FRAMES;
  const cut = CUTS[cutIndex];
  const cutIn = interpolate(cutLocal, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  const labelIn = interpolate(cutLocal, [2, 8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: C.background }}>
      {/* pookalam ring wipes between cuts */}
      {cutLocal < 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              width: interpolate(cutLocal, [0, 4], [0, 1400], { extrapolateRight: "clamp" }),
              height: interpolate(cutLocal, [0, 4], [0, 1400], { extrapolateRight: "clamp" }),
              borderRadius: 9999,
              background: cutIndex % 2 === 0 ? C.marigoldSoft : C.forestSoft,
              opacity: interpolate(cutLocal, [2, 4], [0.9, 0], { extrapolateRight: "clamp" }),
            }}
          />
        </AbsoluteFill>
      )}

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 36,
          opacity: cutIn,
        }}
      >
        {cut.type === "hero" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <LogoMark size={84} />
              <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 64, fontWeight: 600, color: C.ink }}>
                Meet Vamanan.
              </h2>
            </div>
            <VamananAvatar state="idle" size={230} />
          </>
        )}
        {cut.type === "pookalam" && (
          <>
            <Pookalam rings={10} frameStart={-999} size={330} />
            <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 54, fontWeight: 600, color: C.ink }}>
              Lay a pookalam
            </h2>
          </>
        )}
        {cut.type === "story" && (
          <>
            <VamananAvatar state="storytelling" size={240} />
            <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 54, fontWeight: 600, color: C.forest }}>
              The Story of Mahabali
            </h2>
          </>
        )}
        {cut.type === "quiz" && (
          <>
            <div
              style={{
                background: C.forest,
                color: C.paperOnForest,
                fontFamily: FONT_DISPLAY,
                fontSize: 64,
                fontWeight: 600,
                padding: "20px 64px",
                borderRadius: 18,
              }}
            >
              10 / 10
            </div>
            <VamananAvatar state="celebrating" size={230} />
          </>
        )}
      </AbsoluteFill>

      {/* caption */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: labelIn,
        }}
      >
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 20,
            fontWeight: 600,
            color: C.forest,
            background: C.marigoldSoft,
            padding: "8px 22px",
            borderRadius: 999,
            letterSpacing: "0.04em",
          }}
        >
          {cut.label}
        </span>
      </div>
    </AbsoluteFill>
  );
};
