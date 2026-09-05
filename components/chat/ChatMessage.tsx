import { useEffect, useMemo, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { LogoMark } from "@/components/ui/LogoMark";

/**
 * Claude-style thinking trace. While Vamanan composes, his reasoning
 * lines advance one by one; once the reply lands they collapse into a
 * "Thought for Ns" chip that expands again on demand.
 */
const THINK_STEPS = [
  "Recalling the old stories…",
  "Choosing the right words…",
  "Consulting the pookalam…",
  "Considering the question…",
  "Setting the scene…",
  "Checking the old records…",
  "Folding in a little Malayalam…",
];

export function makeThinkingSteps(): string[] {
  // two or three steps per reply, always in order but starting offset
  const start = Math.floor(Math.random() * (THINK_STEPS.length - 2));
  const count = 2 + (Math.random() < 0.4 ? 1 : 0);
  return THINK_STEPS.slice(start, start + count);
}

export function ThinkingTrace({
  steps,
  ms,
  live,
  expanded,
  onToggle,
}: {
  steps: string[];
  ms?: number;
  live?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const [visible, setVisible] = useState(() => (live ? 1 : 0));

  // while live, reveal further steps one at a time — slow enough to
  // span a long model round trip. Once all steps show, the last line's
  // pulsing dots carry the wait (no backwards cycling).
  useEffect(() => {
    if (!live || steps.length <= 1) return;
    const t = setInterval(() => {
      setVisible((v) => Math.min(v + 1, steps.length));
    }, 2000);
    return () => clearInterval(t);
  }, [live, steps.length]);

  if (live) {
    return (
      <div className="flex gap-3 animate-fade-in" aria-live="polite">
        <LogoMark size={36} className="mt-1 shrink-0" />
        <div className="rounded-lg rounded-tl-sm border border-line bg-surface px-5 py-3.5 shadow-soft">
          <span className="sr-only">Vamanan is thinking</span>
          <div className="flex flex-col gap-1.5" aria-hidden="true">
            {steps.slice(0, visible).map((s, i) => (
              <p key={s} className="flex items-center gap-2 text-[13px] italic text-ink-muted animate-fade-in">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-forest/70" />
                {s}
                {i === visible - 1 && (
                  <span className="inline-flex items-center gap-1">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="h-1 w-1 rounded-full bg-forest/60"
                        style={{ animation: `think-dot 1.4s ease-in-out ${d * 0.18}s infinite` }}
                      />
                    ))}
                  </span>
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // collapsed "Thought for Ns" — expandable
  const secs = ms ? Math.max(1, Math.round(ms / 1000)) : null;
  return (
    <button
      type="button"
      onClick={() => onToggle?.()}
      aria-expanded={!!expanded}
      className="mb-1.5 inline-flex min-h-9 items-center gap-1.5 rounded-full px-2.5 text-[13px] italic text-ink-muted transition-colors hover:bg-forest/5 hover:text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
    >
      <svg
        width="12" height="12"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className={`transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
      >
        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Thought{secs ? ` for ${secs}s` : ""}
    </button>
  );
}

/**
 * ChatMessage — a single message in the conversation.
 * Vamanan's messages carry more personality: avatar, name, optional
 * cultural annotation card. User messages stay simpler.
 */
export function ChatMessageBubble({
  message,
  onRetry,
}: {
  message: ChatMessage;
  onRetry?: () => void;
}) {
  const [traceOpen, setTraceOpen] = useState(false);

  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-fade-up">
        <div className="max-w-[85%] rounded-lg rounded-br-sm bg-forest px-5 py-3.5 text-[15px] leading-relaxed break-words text-[#F6F1E7] shadow-soft sm:max-w-[75%] [overflow-wrap:anywhere]">
          {message.text}
        </div>
      </div>
    );
  }

  const failed = message.failed;

  return (
    <div className="flex gap-3 animate-fade-up">
      <LogoMark size={36} className="mt-1 shrink-0" />
      <div className="min-w-0 max-w-[85%] sm:max-w-[80%]">
        {message.thinking && message.thinking.length > 0 && (
          <>
            <ThinkingTrace
              steps={message.thinking}
              ms={message.thinkingMs}
              expanded={traceOpen}
              onToggle={() => setTraceOpen(!traceOpen)}
            />
            {traceOpen && (
              <div className="mb-2 ml-1 flex flex-col gap-1 rounded-md border border-line/70 bg-surface-muted/60 px-3.5 py-2.5 animate-fade-in">
                {message.thinking.map((s) => (
                  <p key={s} className="text-[12.5px] italic leading-relaxed text-ink-muted">
                    {s}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
        <p className="mb-1 flex items-center gap-1.5 text-[13px] font-medium text-ink-muted">
          Vamanan
        </p>
        <div
          className={`rounded-lg rounded-tl-sm px-5 py-3.5 text-[15px] leading-relaxed break-words [overflow-wrap:anywhere] ${
            failed
              ? "border border-coral/40 bg-coral-soft/50 text-ink"
              : "border border-line bg-surface text-ink shadow-soft"
          }`}
        >
          {message.text}
        </div>

        {message.annotation && (
          <div className="mt-2.5 max-w-md rounded-md border border-marigold/50 bg-marigold-soft/40 px-4 py-3">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-forest">
              {message.annotation.label}
            </p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">
              {message.annotation.text}
            </p>
          </div>
        )}

        {failed && onRetry && (
          <button
            onClick={onRetry}
            className="mt-2.5 inline-flex min-h-11 items-center rounded-pill border border-forest/60 px-4 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-[#F6F1E7]"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

/** The live thinking indicator — steps advancing while Vamanan composes. */
export function ThinkingBubble() {
  const steps = useMemo(() => makeThinkingSteps(), []);
  return <ThinkingTrace steps={steps} live />;
}
