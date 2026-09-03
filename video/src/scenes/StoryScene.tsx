/** Act 4 — the story: five scene cards cascade, scene 3 text fades up. */
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, FONT_DISPLAY, FONT_SANS, EASE, s } from "../tokens";
import { VamananAvatar } from "../components/VamananAvatar";
import { STORY_BEAT } from "../script";

const SCENE_TITLES = ["The King", "The Promise", "The Three Steps", "The Moment", "What Onam Remembers"];
const SCENE_NUMBERS = ["01", "02", "03", "04", "05"];

export const StoryScene = () => {
  const frame = useCurrentFrame();
  const avatarIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const textIn = interpolate(frame, [s(2.6), s(3.6)], [0, 1], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: C.forest,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 100,
      }}
    >
      {/* scene cards cascade */}
      <div style={{ display: "flex", flexDirection: "column", gap: 22, opacity: avatarIn }}>
        {SCENE_TITLES.map((title, i) => {
          const delay = i * 5;
          const op = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateRight: "clamp" });
          const y = interpolate(frame, [delay, delay + 8], [20, 0], {
            extrapolateRight: "clamp",
            easing: Easing.bezier(...EASE),
          });
          const active = frame >= s(2.6);
          const isActive = active && i === 2;
          return (
            <div
              key={title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                opacity: op,
                transform: `translateY(${y}px)`,
                padding: "14px 22px",
                borderRadius: 12,
                border: isActive ? `2px solid ${C.marigold}` : `1px solid rgba(246,241,231,0.18)`,
                background: isActive ? "rgba(232,184,75,0.12)" : "rgba(246,241,231,0.04)",
              }}
            >
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: C.marigold, opacity: 0.85 }}>
                {SCENE_NUMBERS[i]}
              </span>
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 21,
                  fontWeight: isActive ? 600 : 400,
                  color: C.paperOnForest,
                }}
              >
                {title}
              </span>
              {isActive && (
                <span style={{ marginLeft: 10, fontSize: 13, color: C.marigold, fontFamily: FONT_SANS }}>
                  ● now playing
                </span>
              )}
              {/* progress dots */}
              <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
                {SCENE_TITLES.map((_, j) => (
                  <span
                    key={j}
                    style={{
                      width: j === 2 && active ? 9 : 6,
                      height: 6,
                      borderRadius: 999,
                      background: j === 2 && active ? C.marigold : "rgba(246,241,231,0.25)",
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* the scene itself */}
      <div
        style={{
          maxWidth: 560,
          opacity: textIn,
          transform: `translateY(${interpolate(frame, [s(2.6), s(3.6)], [18, 0], { extrapolateLeft: "clamp" })}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <VamananAvatar state="storytelling" size={120} />
          <div>
            <p style={{ margin: 0, fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", color: C.marigold, fontFamily: FONT_SANS, fontWeight: 600 }}>
              Scene {STORY_BEAT.number}
            </p>
            <h3 style={{ margin: "6px 0 0", fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 600, color: C.paperOnForest }}>
              {STORY_BEAT.title}
            </h3>
          </div>
        </div>
        <p style={{ marginTop: 22, fontFamily: FONT_SANS, fontSize: 21, lineHeight: 1.65, color: "rgba(246,241,231,0.88)" }}>
          {STORY_BEAT.text}
        </p>
      </div>
    </AbsoluteFill>
  );
};
