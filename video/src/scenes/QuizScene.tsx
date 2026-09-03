/** Act 5 — the quiz: question card, answer picks itself, verdict. */
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, FONT_DISPLAY, FONT_SANS, EASE, s } from "../tokens";
import { VamananAvatar } from "../components/VamananAvatar";
import { QUIZ_BEAT } from "../script";

export const QuizScene = () => {
  const frame = useCurrentFrame();
  const cardIn = interpolate(frame, [0, 10], [24, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE),
  });
  const pickedAt = s(2.4);
  const picked = frame >= pickedAt;
  const verdictAt = s(3.2);
  const showVerdict = frame >= verdictAt;

  return (
    <AbsoluteFill
      style={{
        background: C.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 90,
      }}
    >
      <div
        style={{
          width: 640,
          background: C.surface,
          border: `1px solid ${C.line}`,
          borderRadius: 18,
          padding: "34px 38px",
          boxShadow: "0 10px 30px rgba(22,22,22,0.08)",
          transform: `translateY(${cardIn}px)`,
        }}
      >
        <p style={{ margin: 0, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: C.coral, fontWeight: 600, fontFamily: FONT_SANS }}>
          01 / 10
        </p>
        <h3 style={{ margin: "12px 0 22px", fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 600, color: C.ink }}>
          {QUIZ_BEAT.question}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {QUIZ_BEAT.options.map((opt, i) => {
            const isCorrect = i === QUIZ_BEAT.correct;
            const isPicked = picked && i === QUIZ_BEAT.correct;
            return (
              <div
                key={opt}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 22px",
                  borderRadius: 12,
                  border: isPicked
                    ? `2px solid ${C.forest}`
                    : `1px solid ${C.line}`,
                  background: isPicked ? C.forestSoft : C.surface,
                  opacity: picked && !isPicked && !isCorrect ? 0.55 : 1,
                  transform: isPicked
                    ? `scale(${interpolate(frame, [pickedAt, pickedAt + 6], [0.98, 1], { extrapolateRight: "clamp" })})`
                    : undefined,
                }}
              >
                <span style={{ fontFamily: FONT_SANS, fontSize: 19, color: C.ink }}>{opt}</span>
                {picked && isCorrect && (
                  <span style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", color: C.forest, fontFamily: FONT_SANS }}>
                    ✓ correct
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Vamanan's verdict */}
      <div style={{ maxWidth: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <VamananAvatar state={showVerdict ? "celebrating" : "thinking"} size={200} />
        {showVerdict && (
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              padding: "18px 22px",
              fontFamily: FONT_SANS,
              fontSize: 18,
              lineHeight: 1.5,
              color: C.ink,
              textAlign: "center",
              opacity: interpolate(frame, [verdictAt, verdictAt + 8], [0, 1], { extrapolateLeft: "clamp" }),
            }}
          >
            {QUIZ_BEAT.verdict}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
