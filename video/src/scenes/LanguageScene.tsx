/** Act 6 — language + memory: Malayalam switch, then "welcome back". */
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, FONT_DISPLAY, FONT_SANS, EASE, s } from "../tokens";
import { ChatWindow, UserBubble, VamananBubble, ThinkingDots } from "../components/Chat";
import { REAL_REPLIES } from "../script";

const MAL_LANG_NOTE = "അല്ലേ? From here on, Malayalam it is — namaskaram!";
const MAL_REPLY = "നമസ്കാരം, Anson! ഓണം ആശംസകൾ — ചോദിക്കൂ, പറയാം!";

export const LanguageScene = () => {
  const frame = useCurrentFrame();
  const phase = frame < s(6.5) ? "switch" : "back";

  return (
    <AbsoluteFill
      style={{
        background: C.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {phase === "switch" ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          {/* language pills */}
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: 6,
              borderRadius: 999,
              border: `1px solid ${C.line}`,
              background: C.surfaceMuted,
            }}
          >
            {["English", "മലയാളം", "Mixed"].map((label) => {
              const active = label === "മലയാളം";
              const settleAt = s(0.6);
              return (
                <div
                  key={label}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 999,
                    fontFamily: FONT_SANS,
                    fontSize: 18,
                    ...(active && frame >= settleAt
                      ? { background: C.forest, color: C.paperOnForest, transform: "scale(1.05)" }
                      : { color: C.inkMuted }),
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
          <ChatWindow title="Vamanan" subtitle="malayalam mode">
            <VamananBubble text={MAL_LANG_NOTE} start={s(1)} />
            <UserBubble text="sugamano? onam edukane und?" start={s(2.6)} />
            <VamananBubble text={MAL_REPLY} start={s(3.4)} badge="speaks മലയാളം" />
          </ChatWindow>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <p
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 34,
              fontStyle: "italic",
              color: C.inkMuted,
              margin: 0,
              opacity: interpolate(frame, [s(6.5), s(7.2)], [0, 1], { extrapolateLeft: "clamp" }),
            }}
          >
            …later, on another visit —
          </p>
          <ChatWindow subtitle="welcome back">
            <VamananBubble text={REAL_REPLIES.welcomeBack} start={s(7.5)} badge="remembers you" />
          </ChatWindow>
        </div>
      )}
    </AbsoluteFill>
  );
};
