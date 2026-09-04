import type { ChatMessage } from "@/lib/types";
import { LogoMark } from "@/components/ui/LogoMark";

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
        <p className="mb-1 text-[13px] font-medium text-ink-muted">
          Vamanan{failed ? "" : ""}
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
  const line = THINKING_LINES[Math.floor(Date.now() / 4000) % THINKING_LINES.length];
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
