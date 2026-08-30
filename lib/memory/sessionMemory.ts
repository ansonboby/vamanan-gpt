"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { SessionMemory } from "@/lib/types";
import { defaultMemory } from "@/lib/types";

const KEY = "vamanan.memory.v1";
const MAX_TOPICS = 8;
const MAX_INTERESTS = 6;

function isMemory(value: unknown): value is SessionMemory {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.name === undefined || typeof v.name === "string") &&
    (v.language === "english" || v.language === "malayalam" || v.language === "mixed") &&
    Array.isArray(v.interests) &&
    Array.isArray(v.previousTopics) &&
    (v.quizScore === undefined || typeof v.quizScore === "number")
  );
}

export function loadMemory(): SessionMemory {
  if (typeof window === "undefined") return defaultMemory();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultMemory();
    const parsed = JSON.parse(raw);
    if (!isMemory(parsed)) return defaultMemory();
    return {
      ...defaultMemory(),
      ...parsed,
      interests: parsed.interests.slice(0, MAX_INTERESTS),
      previousTopics: parsed.previousTopics.slice(0, MAX_TOPICS),
    };
  } catch {
    return defaultMemory();
  }
}

export function saveMemory(memory: SessionMemory): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(memory));
    // re-read subscribed components in this tab (the native storage
    // event only fires in other tabs)
    window.dispatchEvent(new Event("storage"));
  } catch {
    /* storage unavailable — memory stays session-only */
  }
}

export function updateMemory(
  memory: SessionMemory,
  patch: Partial<SessionMemory>
): SessionMemory {
  const next: SessionMemory = {
    ...memory,
    ...patch,
    interests: (patch.interests ?? memory.interests).slice(0, MAX_INTERESTS),
    previousTopics: (patch.previousTopics ?? memory.previousTopics).slice(0, MAX_TOPICS),
  };
  saveMemory(next);
  return next;
}

/** Record the gist of what the user just asked about, for continuity. */
export function recordTopic(memory: SessionMemory, topic: string): SessionMemory {
  const t = topic.trim().toLowerCase();
  if (!t || t.length > 60) return memory;
  if (memory.previousTopics.includes(t)) return memory;
  return updateMemory(memory, { previousTopics: [...memory.previousTopics, t] });
}

/** Extract a display name from the user's first message if present. */
export function maybeExtractName(message: string): string | undefined {
  const m = message.trim();
  // "I'm Anson" / "I am Anson" / "this is Anson"
  const iam = m.match(
    /\b(?:i'?m|i am|this is|it'?s)\s+([A-Za-z][A-Za-z'’-]{1,24})\b/i
  );
  if (iam) return titleCase(iam[1]);
  const named = m.match(
    /\b(?:my name(?:'s| is)|call me)\s+([A-Za-z][A-Za-z'’-]{1,24})\b/i
  );
  if (named) return titleCase(named[1]);
  return undefined;
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ── React binding: localStorage as an external store ─────────── */

function subscribe(cb: () => void): () => void {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

/**
 * Live session memory, hydrated safely on the client.
 * Server snapshot is the default (no name) — after hydration the
 * real value streams in, so there is never a hydration mismatch.
 */
export function useSessionMemory(): SessionMemory {
  const raw = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(KEY),
    () => null
  );
  return useMemo(() => {
    if (!raw) return defaultMemory();
    try {
      const parsed = JSON.parse(raw);
      if (!isMemory(parsed)) return defaultMemory();
      return parsed;
    } catch {
      return defaultMemory();
    }
  }, [raw]);
}

/** Update memory from within React with live re-render. */
export function useMemoryWriter() {
  const memory = useSessionMemory();
  return useCallback(
    (patch: Partial<SessionMemory>) => updateMemory(memory, patch),
    [memory]
  );
}
