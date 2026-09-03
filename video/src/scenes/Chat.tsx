/** Act 2 — the chat demo: name moment + real Gemini reply. */
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C, FONT_SANS } from "../tokens";
import { ChatWindow, UserBubble, VamananBubble } from "../components/Chat";
import { VamananAvatar } from "../components/VamananAvatar";
import { REAL_REPLIES } from "../script";
import { s } from "../tokens";

export const ChatScene = () => {
  const frame = useCurrentFrame();
  const local = frame; // this scene starts at 0 in its own timeline
  const presence = interpolate(local, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: C.background, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: C.background }} />
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 130,
          opacity: presence,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <VamananAvatar state={local < s(2) ? "thinking" : "speaking"} size={190} />
        <div
          style={{
            padding: "10px 18px",
            borderRadius: 12,
            border: `1px solid ${C.line}`,
            background: C.surface,
            fontFamily: FONT_SANS,
            fontSize: 14,
            color: C.inkMuted,
          }}
        >
          {local < s(2) ? "Thinking…" : "Ready to talk"}
        </div>
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(local, [0, 12], [30, 0], { extrapolateRight: "clamp" })}px)`,
          opacity: presence,
        }}
      >
        <ChatWindow subtitle="in conversation with Anson">
          <VamananBubble
            text="Namaskaram, traveller! I am Vamanan — a small storyteller from the Onam tradition of Kerala. What shall I call you?"
            start={s(0.3)}
          />
          <UserBubble text="I'm Anson. Why is Onam celebrated?" start={s(5.2)} />
          <VamananBubble
            text={REAL_REPLIES.onamWhy}
            start={s(7)}
            badge="remembers your name"
          />
        </ChatWindow>
      </div>
    </AbsoluteFill>
  );
};
