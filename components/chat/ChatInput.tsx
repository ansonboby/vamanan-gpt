"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

/**
 * ChatInput — the large, thumb-friendly message composer.
 */
export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Ask Vamanan…",
  autoFocus = false,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    setValue("");
    onSend(text);
  }

  return (
    <div className="flex items-end gap-2.5 rounded-xl border border-line bg-surface p-2.5 shadow-soft transition-colors focus-within:border-forest/50">
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          // autosize up to ~5 rows
          const el = e.target;
          el.style.height = "auto";
          el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Message to Vamanan"
        disabled={disabled}
        maxLength={2000}
        className="max-h-[132px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] leading-relaxed text-ink placeholder:text-ink-muted/70 focus:outline-none disabled:opacity-60"
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-forest text-[#F6F1E7] transition-all hover:bg-[#1C4A3E] active:scale-95 disabled:opacity-40"
      >
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
          <path d="M2 9.5h13M10 4l5.5 5.5L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
