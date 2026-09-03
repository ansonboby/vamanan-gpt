/**
 * Chat UI pieces for the video — styled to match ChatMessage.tsx
 * bubbles exactly (forest user bubble, surface vamanan bubble with
 * LogoMark avatar), driven by frame-based typing.
 */
import { useState, useEffect } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { C, FONT_SANS, FONT_DISPLAY, EASE } from "../tokens";
import { LogoMark } from "./LogoMark";

/** Typewriter that reveals text over `frames` frames, starting at `start`. */
export function useTypedText(text: string, start: number, cps = 28): string {
  const frame = useCurrentFrame();
  const total = Math.max(1, (text.length / cps) * 30);
  const chars = interpolate(frame, [start, start + total], [0, text.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return text.slice(0, Math.floor(chars));
}

export function UserBubble({ text, start = 0 }: { text: string; start?: number }) {
  const typed = useTypedText(text, start, 30);
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div
        style={{
          maxWidth: "78%",
          background: C.forest,
          color: C.paperOnForest,
          padding: "14px 20px",
          borderRadius: "12px 12px 4px 12px",
          fontFamily: FONT_SANS,
          fontSize: 17,
          lineHeight: 1.55,
          overflowWrap: "anywhere",
          boxShadow: "0 10px 30px rgba(22,22,22,0.06)",
        }}
      >
        {typed}
        <span style={{ opacity: typed.length < text.length ? 1 : 0 }}>▍</span>
      </div>
    </div>
  );
}

export function VamananBubble({
  text,
  start,
  badge,
}: {
  text: string;
  start: number;
  badge?: string;
}) {
  const frame = useCurrentFrame();
  const typed = useTypedText(text, start, 26);
  const shown = typed.length > 0;
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ marginTop: 2, flexShrink: 0 }}>
        <LogoMark size={36} />
      </div>
      <div style={{ minWidth: 0, maxWidth: "82%" }}>
        <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500, color: C.inkMuted, fontFamily: FONT_SANS }}>
          Vamanan
        </p>
        {shown ? (
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.line}`,
              color: C.ink,
              padding: "14px 20px",
              borderRadius: "12px 12px 12px 4px",
              fontFamily: FONT_SANS,
              fontSize: 17,
              lineHeight: 1.55,
              overflowWrap: "anywhere",
              boxShadow: "0 10px 30px rgba(22,22,22,0.06)",
            }}
          >
            {typed}
            <span style={{ opacity: typed.length < text.length ? 1 : 0 }}>▍</span>
          </div>
        ) : (
          <ThinkingDots />
        )}
        {badge && typed.length >= text.length - 2 ? (
          <div
            style={{
              marginTop: 8,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: C.marigoldSoft,
              border: `1px solid ${C.marigold}`,
              borderRadius: 999,
              padding: "4px 12px",
              fontSize: 13,
              fontWeight: 600,
              color: C.forest,
              fontFamily: FONT_SANS,
              opacity: interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            ✓ {badge}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ThinkingDots() {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: C.surface,
        border: `1px solid ${C.line}`,
        borderRadius: "12px 12px 12px 4px",
        padding: "14px 18px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            background: C.inkMuted,
            transform: `translateY(${Math.sin((frame / 8) * Math.PI + i) * -4}px)`,
            opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame / 8) * Math.PI + i)),
          }}
        />
      ))}
    </div>
  );
}

/** The chat "window" chrome: header + conversation area. */
export function ChatWindow({
  children,
  title = "Vamanan",
  subtitle = "a storyteller of Kerala",
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 900,
        height: 560,
        borderRadius: 18,
        border: `1px solid ${C.line}`,
        background: "rgba(255,253,248,0.75)",
        boxShadow: "0 10px 30px rgba(22,22,22,0.08)",
        overflow: "hidden",
        fontFamily: FONT_SANS,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: `1px solid ${C.line}`,
              background: C.surface,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.inkMuted,
              fontSize: 16,
            }}
          >
            ‹
          </div>
          <h1 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 600, color: C.ink }}>
            {title}
          </h1>
          <p style={{ margin: 0, fontSize: 12.5, color: C.inkMuted }}>{subtitle}</p>
        </div>
      </header>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "22px 24px", flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
