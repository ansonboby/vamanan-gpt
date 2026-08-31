"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { ChatMessage, LanguageMode } from "@/lib/types";
import {
  useSessionMemory,
  updateMemory,
  recordTopic,
  maybeExtractName,
} from "@/lib/memory/sessionMemory";
import { VamananPresence } from "@/components/vamanan/VamananPresence";
import { ChatMessageBubble, ThinkingBubble } from "./ChatMessage";
import { PromptChips } from "./PromptChips";
import { ChatInput } from "./ChatInput";

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function ChatWindow() {
  // live session memory (localStorage via external store)
  const memory = useSessionMemory();

  // conversation after the greeting — greeting is derived from memory
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [lastUserMsg, setLastUserMsg] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const greeting: ChatMessage = useMemo(
    () => ({
      id: "greeting",
      role: "vamanan",
      text: memory.name
        ? `Namaskaram, ${memory.name}! Welcome back to my little corner of Kerala. The kettle is on, the stories are in order. Where shall we wander today?`
        : "Namaskaram, traveller! I am Vamanan — a small storyteller from the Onam tradition of Kerala. I did not expect company today. What shall I call you?",
    }),
    [memory.name]
  );
  const allMessages = useMemo(() => [greeting, ...messages], [greeting, messages]);

  // scroll to newest message
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, thinking]);

  const send = useCallback(
    async (text: string) => {
      if (thinking) return;
      const clean = text.trim();
      if (!clean) return;

      // Name capture on first message when none is known.
      // updateMemory returns the next memory — keep chaining from it so
      // later writes don't overwrite the name with a stale object.
      let mem = memory;
      if (!mem.name) {
        const name = maybeExtractName(clean);
        if (name) mem = updateMemory(mem, { name });
      }

      let mode: string = "chat";
      if (mem.language !== "english") mode = "malayalam";
      if (/quiz|challenge/i.test(clean)) mode = "quiz";
      if (/story|mahabali/i.test(clean)) mode = "story";

      recordTopic(mem, clean);

      const history = allMessages.map((m) => ({ role: m.role, text: m.text }));
      setMessages((prev) => [...prev, { id: uid(), role: "user", text: clean }]);
      setLastUserMsg(clean);
      setThinking(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: clean,
            history,
            memory: {
              name: mem.name,
              language: mem.language,
              previousTopics: mem.previousTopics,
              quizScore: mem.quizScore,
            },
            mode,
          }),
        });
        const data = (await res.json().catch(() => null)) as {
          reply?: string;
          annotation?: { label: string; text: string };
        } | null;
        const reply =
          (data && typeof data.reply === "string" && data.reply.trim()) ||
          "The winds are a little restless. Try that again.";
        const annotation =
          data && data.annotation &&
          typeof data.annotation.label === "string" &&
          typeof data.annotation.text === "string"
            ? data.annotation
            : undefined;
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "vamanan", text: reply, annotation },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "vamanan",
            text: "The winds are a little restless. Try that again.",
            failed: true,
          },
        ]);
      } finally {
        setThinking(false);
      }
    },
    [thinking, memory, allMessages]
  );

  const retry = useCallback(() => {
    if (!lastUserMsg) return;
    setMessages((prev) => prev.filter((m) => !m.failed));
    send(lastUserMsg);
  }, [lastUserMsg, send]);

  const switchLanguage = useCallback(
    (lang: LanguageMode) => {
      updateMemory(memory, { language: lang });
      const note: Record<LanguageMode, string> = {
        english:
          "(Switching to English — I'll keep my Malayalam in my pocket unless you ask for it.)",
        malayalam:
          "അല്ലേ? From here on, Malayalam it is — namaskaram! Ask me anything about Onam, and I'll answer as a Malayali would.",
        mixed:
          "Perfect — we'll speak a little of both, anglo-malayali style. English for sense, Malayalam for soul. Onam ashamsakal!",
      };
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "vamanan", text: note[lang] },
      ]);
    },
    [memory]
  );

  const showEmptyChips = messages.length === 0 && !thinking;
  const showCompactChips = messages.length > 0 && !thinking;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-6 pt-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:gap-8 lg:pt-10">
      {/* ── Left rail: Vamanan presence (desktop) ── */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 flex flex-col items-center gap-5 rounded-lg border border-line bg-surface p-6 shadow-soft">
          <VamananPresence
            state={thinking ? "thinking" : memory.name ? "celebrating" : "idle"}
            status={
              thinking ? "Thinking…" : memory.name ? "Ready to talk" : "Waiting to meet you"
            }
            size={150}
          />
          <div className="text-center">
            <p className="font-display text-lg font-semibold text-ink">Vamanan</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
              Storyteller of the Onam tradition. Ask him anything about Kerala,
              or just say hello.
            </p>
          </div>

          {/* language control */}
          <div className="w-full">
            <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Language
            </p>
            <div className="flex justify-center gap-1.5 rounded-full border border-line bg-surface-muted p-1">
              {(
                [
                  ["english", "English"],
                  ["malayalam", "മലയാളം"],
                  ["mixed", "Mixed"],
                ] as [LanguageMode, string][]
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => switchLanguage(mode)}
                  aria-pressed={memory.language === mode}
                  className={`rounded-full px-3 py-1.5 text-[13px] transition-all ${
                    memory.language === mode
                      ? "bg-forest text-[#F6F1E7]"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* quick journeys */}
          <div className="grid w-full gap-2">
            <Link
              href="/story"
              className="flex h-11 items-center justify-center rounded-md border border-forest/50 text-sm font-medium text-forest transition-all hover:bg-forest hover:text-[#F6F1E7]"
            >
              Begin the story
            </Link>
            <Link
              href="/quiz"
              className="flex h-11 items-center justify-center rounded-md border border-forest/50 text-sm font-medium text-forest transition-all hover:bg-forest hover:text-[#F6F1E7]"
            >
              Quiz me
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Conversation ── */}
      <section className="flex min-h-[70vh] min-w-0 flex-col rounded-xl border border-line bg-surface/60 shadow-soft lg:min-h-[calc(100vh-9rem)]">
        {/* header */}
        <header className="flex items-center justify-between border-b border-line/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="Back to home"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-ink-muted transition-colors hover:text-forest"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div>
              <h1 className="font-display text-lg font-semibold leading-tight text-ink">Vamanan</h1>
              <p className="text-[12px] text-ink-muted">
                {thinking
                  ? "composing a reply…"
                  : memory.name
                    ? `in conversation with ${memory.name}`
                    : "a storyteller of Kerala"}
              </p>
            </div>
          </div>
          {/* mobile language control */}
          <div className="flex gap-1 rounded-full border border-line bg-surface-muted p-1 lg:hidden">
            {(
              [
                ["english", "EN"],
                ["malayalam", "മല"],
                ["mixed", "EN+മല"],
              ] as [LanguageMode, string][]
            ).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => switchLanguage(mode)}
                aria-pressed={memory.language === mode}
                aria-label={`${mode} language`}
                className={`rounded-full px-2.5 py-1 text-[12px] transition-all ${
                  memory.language === mode ? "bg-forest text-[#F6F1E7]" : "text-ink-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        {/* messages */}
        <div
          ref={scrollRef}
          className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-6"
          role="log"
          aria-label="Conversation with Vamanan"
          aria-live="polite"
        >
          {allMessages.map((m, i) => (
            <ChatMessageBubble
              key={m.id}
              message={m}
              onRetry={i === allMessages.length - 1 ? retry : undefined}
            />
          ))}
          {thinking && <ThinkingBubble />}
          {showEmptyChips && (
            <div className="mt-2 flex flex-col gap-4 rounded-lg border border-marigold/40 bg-marigold-soft/40 px-5 py-5 animate-fade-up">
              <p className="font-display text-lg italic text-forest">
                The story begins with a question.
              </p>
              <PromptChips onPick={send} />
            </div>
          )}
          {showCompactChips && (
            <div className="mt-1">
              <PromptChips onPick={send} compact />
            </div>
          )}
        </div>

        {/* input — sticky on mobile, inline on desktop */}
        <div className="sticky bottom-0 border-t border-line/80 bg-surface/95 px-4 py-3.5 backdrop-blur-sm sm:px-5">
          <ChatInput onSend={send} disabled={thinking} autoFocus />
          <p className="mt-2 hidden text-center text-[12px] text-ink-muted sm:block">
            Vamanan is a character — he tells Kerala&rsquo;s stories with care, and admits what he doesn&rsquo;t know.
          </p>
        </div>
      </section>
    </div>
  );
}
