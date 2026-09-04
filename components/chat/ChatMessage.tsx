import { useEffect, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { LogoMark } from "@/components/ui/LogoMark";

/**
 * Speech playback for Vamanan's replies — Web Speech API, zero deps.
 * Opt-in (never auto-speaks), hidden when the browser lacks support,
 * and strips markdown/Malayalam glyphs so the spoken line stays clean.
 */
function useSpeakButton(text: string) {
  const [speaking, setSpeaking] = useState(false);
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Stop any in-flight speech when the message unmounts (chat navigation).
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  const toggle = () => {
    if (!supported) return;
    if (speaking || window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(
      text
        .replace(/[*_`#>|]/g, "")
        .replace(/[\u0D00-\u0D7F]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    );
    utter.rate = 1;
    utter.pitch = 1.05;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  return { supported, speaking, toggle };
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
  const { supported, speaking, toggle } = useSpeakButton(message.text);

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
        <p className="mb-1 flex items-center gap-1.5 text-[13px] font-medium text-ink-muted">
          Vamanan{failed ? "" : ""}
          {!failed && supported && (
            <button
              type="button"
              onClick={toggle}
              aria-label={speaking ? "Stop Vamanan speaking" : "Listen to Vamanan's reply"}
              title={speaking ? "Stop speaking" : "Listen to this reply"}
              className="ml-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-forest/10 hover:text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
            >
              {speaking ? (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="2.5" y="2.5" width="11" height="11" rx="2.5" fill="currentColor" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8.5 2.8 4.6 6H2.2a.7.7 0 0 0-.7.7v2.6c0 .39.31.7.7.7h2.4l3.9 3.2c.46.38 1.1.05 1.1-.55V3.35c0-.6-.64-.93-1.1-.55Z"
                    fill="currentColor"
                  />
                  <path
                    d="M11.6 5.4a3.4 3.4 0 0 1 0 5.2M13.4 3.6a5.9 5.9 0 0 1 0 8.8"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          )}
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

/** The three-dot thinking indicator shown while Vamanan "thinks". */
const THINKING_LINES = [
  "Vamanan is consulting his umbrella…",
  "Vamanan is choosing the right words…",
  "Vamanan is patting the flowers into place…",
  "Vamanan is thinking three small thoughts…",
];

export function ThinkingBubble() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % THINKING_LINES.length), 4000);
    return () => clearInterval(t);
  }, []);
  const line = THINKING_LINES[i];
  return (
    <div className="flex gap-3 animate-fade-in" aria-live="polite">
      <LogoMark size={36} className="mt-1 shrink-0" />
      <div className="rounded-lg rounded-tl-sm border border-line bg-surface px-5 py-4 shadow-soft">
        <span className="sr-only">Vamanan is thinking</span>
        <div className="flex items-center gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-forest"
              style={{ animation: `think-dot 1.4s ease-in-out ${i * 0.18}s infinite` }}
            />
          ))}
          <span className="text-[13px] italic text-ink-muted">{line}</span>
        </div>
      </div>
    </div>
  );
}
