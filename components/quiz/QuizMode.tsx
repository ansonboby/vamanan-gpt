"use client";

import { useState } from "react";
import Link from "next/link";
import { QUIZ_QUESTIONS } from "@/lib/content/quiz";
import { VamananAvatar } from "@/components/vamanan/VamananAvatar";
import { loadMemory, updateMemory } from "@/lib/memory/sessionMemory";

/** Share your verdict — navigator.share with clipboard fallback. */
function ShareVerdict({ score, total }: { score: number; total: number }) {
  const [state, setState] = useState<"idle" | "copied" | "unsupported">("idle");

  const share = async () => {
    const text = `I scored ${score}/${total} on Vamanan's Challenge — the Onam storytelling AI. Can you beat it? https://vamanan-gpt.vercel.app`;
    const nav = navigator as Navigator & { share?: (d: { text: string }) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ text });
        return; // user shared — no toast needed
      } catch {
        return; // user dismissed the sheet
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      setTimeout(() => setState("idle"), 2400);
    } catch {
      setState("unsupported");
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex h-12 items-center gap-2 rounded-pill border border-marigold-dark/50 bg-marigold-soft/40 px-7 text-[15px] font-medium text-ink transition-all hover:bg-marigold-soft/70 active:scale-[0.98]"
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M10.5 2.2 5 7.7m0 0L10.5 13.2M5 7.7H2a.9.9 0 0 0-.9.9v3.5c0 .5.4.9.9.9h3m6.5-10.8 3 3a.9.9 0 0 1 0 1.3l-3 3"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {state === "copied" ? "Copied to clipboard" : state === "unsupported" ? "Copy failed" : "Share my verdict"}
    </button>
  );
}

type Phase = "intro" | "question" | "answered" | "done";

const CORRECT_REACTIONS = [
  "Ha! You have been paying attention.",
  "Correct — the story lives in you.",
  "Right answer. Mahabali would be pleased.",
  "Yes! Someone has done their homework.",
  "Well answered — that one was not easy.",
];

const WRONG_REACTIONS = [
  "Not quite — but you learn like a true traveller.",
  "Ah, close. The story forgives, and so do I.",
  "Wrong step — even Vamana needed two tries.",
  "Not this time. But persistence is also a tradition.",
  "No — but imagine how sweet the comeback will be.",
];

/* random reaction pick — module-level helper keeps impure code out
 * of the component body (react-compiler lint) */
function pickReaction(correct: boolean): string {
  const pool = correct ? CORRECT_REACTIONS : WRONG_REACTIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function reaction(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1) return "Perfect! Ellam nalla — you know Kerala like a Malayali. Mahabali himself would ask YOU for tips.";
  if (pct >= 0.8) return "Ah, not bad at all. You have been paying attention. A few flowers short of a full pookalam, but a fine one.";
  if (pct >= 0.6) return "A solid showing! The story has clearly taken root. Come back after another read and we shall complete the rings.";
  if (pct >= 0.4) return "You walked the story, and some of it stayed. That is how every tradition begins — a little at a time.";
  return "Well — we shall call this a first step. And as I know personally, first steps can be enormous.";
}

export function QuizMode() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [shuffled, setShuffled] = useState(QUIZ_QUESTIONS);

  const total = shuffled.length;
  const q = shuffled[index];

  function begin() {
    // light shuffle of question order each run
    const arr = [...QUIZ_QUESTIONS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
    setScore(0);
    setIndex(0);
    setPicked(null);
    setPhase("question");
  }

  function answer(i: number) {
    if (phase !== "question") return;
    setPicked(i);
    const hit = i === q.answerIndex;
    if (hit) setScore((s) => s + 1);
    // pick the reaction in the event handler (not render) so a re-render
    // never re-rolls it
    setFeedback(pickReaction(hit));
    setPhase("answered");
  }

  function next() {
    if (index + 1 >= total) {
      // record score in session memory
      try {
        const mem = loadMemory();
        updateMemory(mem, { quizScore: score });
      } catch {
        /* non-fatal */
      }
      setPhase("done");
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
      setPhase("question");
    }
  }

  /* ── Intro ── */
  if (phase === "intro") {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-5 py-16 text-center sm:py-24">
        <div className="animate-breathe">
          <VamananAvatar state="idle" size={170} />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
          Vamanan&rsquo;s Challenge
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Ten questions of Kerala.
        </h1>
        <p className="max-w-md text-[16px] leading-relaxed text-ink-muted">
          Onam, Mahabali, flowers and feasts — let us see how much of Kerala
          you remember. I&rsquo;ll be honest, but I&rsquo;ll be gentle.
          Mostly.
        </p>
        <button
          onClick={begin}
          className="mt-2 inline-flex h-13 items-center rounded-pill bg-forest px-8 text-base font-medium text-[#F6F1E7] shadow-soft transition-all hover:bg-[#1C4A3E] active:scale-[0.98]"
        >
          Begin the challenge
        </button>
      </div>
    );
  }

  /* ── Done ── */
  if (phase === "done") {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-5 py-14 text-center sm:py-20">
        <div className="animate-breathe">
          <VamananAvatar state={score / total >= 0.6 ? "celebrating" : "storytelling"} size={170} />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
          The verdict
        </p>
        <p className="font-display text-6xl font-semibold tabular-nums text-forest">
          {score}&nbsp;/&nbsp;{total}
        </p>
        <p className="max-w-md text-[16px] leading-relaxed text-ink">
          {reaction(score, total)}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={begin}
            className="inline-flex h-12 items-center rounded-pill border border-forest/60 px-7 text-[15px] font-medium text-forest transition-all hover:bg-forest hover:text-[#F6F1E7] active:scale-[0.98]"
          >
            Play again
          </button>
          <Link
            href="/chat"
            className="inline-flex h-12 items-center rounded-pill bg-forest px-7 text-[15px] font-medium text-[#F6F1E7] shadow-soft transition-all hover:bg-[#1C4A3E] active:scale-[0.98]"
          >
            Talk to Vamanan
          </Link>
          <Link
            href="/story"
            className="inline-flex h-12 items-center rounded-pill border border-forest/60 px-7 text-[15px] font-medium text-forest transition-all hover:bg-forest hover:text-[#F6F1E7] active:scale-[0.98]"
          >
            Hear the story
          </Link>
          <ShareVerdict score={score} total={total} />
        </div>
      </div>
    );
  }

  /* ── Question ── */
  return (
    <div className="mx-auto max-w-2xl px-5 py-8 sm:px-6">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-pill px-3 text-sm font-medium text-ink-muted transition-colors hover:text-forest"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to the courtyard
        </Link>
        <p className="text-sm font-medium tabular-nums text-ink-muted" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </header>

      {/* progress bar */}
      <div
        className="mt-4 h-1.5 overflow-hidden rounded-pill bg-surface-muted"
        role="progressbar"
        aria-valuenow={index + (phase === "answered" ? 1 : 0)}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-pill bg-marigold transition-all duration-500"
          style={{ width: `${((index + (phase === "answered" ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
        {q.question}
      </h2>

      <div className="mt-7 grid gap-3" role="group" aria-label="Answer choices">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answerIndex;
          const isPicked = picked === i;
          let style =
            "border-line bg-surface text-ink hover:border-forest/50 hover:bg-forest-soft";
          let label = "";
          if (phase === "answered") {
            if (isCorrect) {
              style = "border-forest bg-forest text-[#F6F1E7]";
              label = "✓ correct";
            } else if (isPicked) {
              style = "border-coral bg-coral-soft/60 text-ink";
              label = "✗ not this one";
            } else {
              style = "border-line/60 bg-surface text-ink opacity-60";
            }
          }
          return (
            <button
              key={opt}
              onClick={() => answer(i)}
              disabled={phase === "answered"}
              className={`group flex min-h-[58px] items-center justify-between gap-3 rounded-lg border px-5 py-4 text-left text-[15.5px] transition-all duration-200 ${style} ${
                phase === "question" ? "active:scale-[0.99]" : ""
              }`}
            >
              <span>{opt}</span>
              {label && (
                <span
                  className={`text-[12px] font-semibold uppercase tracking-wide ${
                    isCorrect ? "text-[#A3E3B9]" : "text-coral"
                  }`}
                >
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* feedback */}
      {phase === "answered" && (
        <div className="mt-6 animate-fade-up rounded-lg border border-line bg-surface p-5 shadow-soft">
          <p className="font-medium text-ink">
            {feedback}
          </p>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-muted">
            {q.explanation}
          </p>
          <button
            onClick={next}
            autoFocus
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-forest px-6 text-base font-medium text-[#F6F1E7] transition-all hover:bg-[#1C4A3E] active:scale-[0.98]"
          >
            {index + 1 >= total ? "See my verdict" : "Continue"}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
