import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ChatMessage } from "@/lib/types";
import { LogoMark } from "@/components/ui/LogoMark";

/**
 * Voice playback for Vamanan's replies.
 *
 * Tries the app's Gemini TTS route first (/api/voice — a warm, directed
 * storyteller voice); if that's unavailable (no key, quota, offline),
 * falls back to the browser's built-in speechSynthesis. The button is
 * hidden only when neither path can work.
 */
function useSpeakButton(text: string) {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const browserVoice =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // mounted after hydration — reveals the button without mismatching SSR
  // (useSyncExternalStore: server snapshot false, client true, no effect-setState)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // stop any in-flight speech on unmount (chat navigation)
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // replay cache — clicking the same reply twice costs no extra TTS call
  const audioUrlRef = useRef<string | null>(null);
  const audioTextRef = useRef<string>("");

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  const speakWithBrowser = useCallback(() => {
    const synth = window.speechSynthesis;
    const clean = text
      .replace(/[*_`#>|]/g, "")
      .replace(/[\u0D00-\u0D7F]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const utter = new SpeechSynthesisUtterance(clean);
    const voices = synth.getVoices();
    const pick =
      voices.find((v) => /en[-_]IN/i.test(v.lang)) ??
      voices.find((v) => /^en/i.test(v.lang)) ??
      null;
    if (pick) utter.voice = pick;
    utter.rate = 1;
    utter.pitch = 1.05;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter; // keep alive — GC mid-speech kills playback in Chrome
    synth.cancel(); // clear any zombie queue, then speak fresh
    synth.speak(utter);
    setSpeaking(true);
  }, [text]);

  const toggle = useCallback(async () => {
    if (speaking) {
      stop();
      return;
    }
    const clean = text
      .replace(/[*_`#>|]/g, "")
      .replace(/[\u0D00-\u0D7F]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    // cached replay: same reply, no new request
    if (audioUrlRef.current && audioTextRef.current === clean) {
      const audio = new Audio(audioUrlRef.current);
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => setSpeaking(false);
      audioRef.current = audio;
      audio.play().catch(() => setSpeaking(false));
      setSpeaking(true);
      return;
    }
    // very long text can't pass the API cap — go straight to browser voice
    if (clean.length > 700) {
      if (browserVoice) speakWithBrowser();
      return;
    }
    setSpeaking(true); // optimistic — the wait for /api/voice IS the delivery
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean }),
      });
      const ct = res.headers.get("content-type") ?? "";
      if (res.ok && ct.startsWith("audio/")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        audioTextRef.current = clean;
        const audio = new Audio(url);
        audio.onended = () => setSpeaking(false);
        audio.onerror = () => {
          setSpeaking(false);
        };
        audioRef.current = audio;
        await audio.play();
        return;
      }
      // API said no → browser speech if available
      throw new Error("tts unavailable");
    } catch {
      setSpeaking(false);
      if (browserVoice) {
        speakWithBrowser();
      } else {
        setSpeaking(false);
      }
    }
  }, [speaking, stop, text, browserVoice, speakWithBrowser]);

  return { supported: mounted, speaking, toggle };
}

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

  // while live, reveal further steps one at a time
  useEffect(() => {
    if (!live || steps.length <= 1) return;
    const t = setInterval(() => {
      setVisible((v) => Math.min(v + 1, steps.length));
    }, 1300);
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
  const { supported, speaking, toggle } = useSpeakButton(message.text);
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

/** The live thinking indicator — steps advancing while Vamanan composes. */
export function ThinkingBubble() {
  const steps = useMemo(() => makeThinkingSteps(), []);
  return <ThinkingTrace steps={steps} live />;
}
