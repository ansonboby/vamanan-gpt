"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { STORY_SCENES } from "@/lib/content/story";
import { VamananAvatar } from "@/components/vamanan/VamananAvatar";

/**
 * Story mode — the Mahabali legend as a digital storybook.
 * Editorial, calm, scene-by-scene. Vamanan appears as narrator.
 */
export function StoryMode() {
  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState<number[]>([0]);
  const scene = STORY_SCENES[index];
  const total = STORY_SCENES.length;
  const done = index === total - 1;

  function go(next: number) {
    const clamped = Math.max(0, Math.min(total - 1, next));
    setIndex(clamped);
    setSeen((s) => (s.includes(clamped) ? s : [...s, clamped]));
  }

  // keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-5 py-8 sm:px-8">
      {/* header */}
      <header className="flex items-center justify-between">
        <Link
          href="/chat"
          className="inline-flex min-h-11 items-center gap-2 rounded-pill px-3 text-sm font-medium text-ink-muted transition-colors hover:text-forest"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Vamanan
        </Link>
        <p className="text-sm font-medium tabular-nums text-ink-muted" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </header>

      {/* scene */}
      <article
        key={scene.id}
        className="relative mt-6 flex flex-col items-center animate-fade-up"
      >
        {/* scene number badge */}
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
          Scene {scene.number}
        </p>
        <h1 className="mt-3 text-center font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {scene.title}
        </h1>

        {/* artwork */}
        <div className="relative mt-10 flex items-center justify-center">
          <svg
            viewBox="0 0 320 200"
            className="h-44 w-full max-w-md"
            fill="none"
            aria-hidden="true"
          >
            {/* soft scene backdrop varies by scene */}
            {index === 0 && (
              <>
                {/* Kerala fields — golden age */}
                <circle cx="160" cy="86" r="54" fill="#E1ECE7" />
                <path d="M20 140 C80 108 240 108 300 140" stroke="#163B32" strokeWidth="2" opacity="0.5" />
                <path d="M0 150 C90 118 230 118 320 150 L320 200 L0 200 Z" fill="#F7EAC2" />
                <circle cx="60" cy="52" r="14" fill="#E8B84B" opacity="0.85" />
                <circle cx="268" cy="40" r="10" fill="#E8B84B" opacity="0.7" />
                {/* palm trees */}
                <path d="M56 138 C58 110 54 96 44 84 M44 84 C30 78 24 86 28 94 M44 84 C58 74 68 80 64 90 M44 84 C46 70 40 64 34 68" stroke="#163B32" strokeWidth="4" strokeLinecap="round" />
                <path d="M264 138 C266 114 262 102 252 92 M252 92 C240 88 234 94 238 102 M252 92 C264 84 272 90 268 98" stroke="#163B32" strokeWidth="4" strokeLinecap="round" />
                {/* rice stalks */}
                <path d="M110 148 C108 132 112 122 108 112 M108 112 C104 106 98 106 96 112 M108 112 C112 104 120 106 118 112" stroke="#6E695F" strokeWidth="3" strokeLinecap="round" />
                <path d="M200 150 C198 136 202 126 198 118 M198 118 C194 112 188 112 186 118 M198 118 C202 110 210 112 208 118" stroke="#6E695F" strokeWidth="3" strokeLinecap="round" />
              </>
            )}
            {index === 1 && (
              <>
                {/* The small visitor with umbrella */}
                <ellipse cx="160" cy="168" rx="100" ry="14" fill="#163B32" opacity="0.06" />
                <path d="M96 44 C96 20 224 20 224 44" stroke="#E8B84B" strokeWidth="16" strokeLinecap="round" />
                <path d="M160 44 L160 46 C160 74 186 84 190 108" stroke="#6E4A2B" strokeWidth="6" strokeLinecap="round" />
                <circle cx="160" cy="106" r="26" fill="#C98A54" />
                <path d="M138 100 C144 88 176 88 182 100" stroke="#161616" strokeWidth="7" strokeLinecap="round" />
                <circle cx="152" cy="106" r="2.5" fill="#161616" />
                <circle cx="168" cy="106" r="2.5" fill="#161616" />
                <path d="M154 118 C157 121 163 121 166 118" stroke="#161616" strokeWidth="2.4" strokeLinecap="round" />
                {/* tiny dwarf body */}
                <path d="M144 128 C144 122 176 122 176 128 L184 168 L136 168 Z" fill="#163B32" />
                <path d="M138 164 L182 164 L183 172 C183 174 137 174 137 172 Z" fill="#E8B84B" />
              </>
            )}
            {index === 2 && (
              <>
                {/* The cosmic stride — two giant footprints */}
                <ellipse cx="160" cy="160" rx="110" ry="16" fill="#163B32" opacity="0.05" />
                {/* giant footprint 1 (earth) */}
                <ellipse cx="88" cy="112" rx="34" ry="20" fill="#E1ECE7" stroke="#163B32" strokeWidth="2.5" />
                <path d="M70 112 q9 -10 18 0 q9 -10 18 0" stroke="#163B32" strokeWidth="2" fill="none" opacity="0.5" />
                {/* giant footprint 2 (sky) */}
                <ellipse cx="236" cy="112" rx="34" ry="20" fill="#F7EAC2" stroke="#E8B84B" strokeWidth="2.5" />
                <path d="M218 112 q9 -10 18 0 q9 -10 18 0" stroke="#E8B84B" strokeWidth="2" fill="none" opacity="0.8" />
                {/* stars around footprint 2 */}
                <circle cx="200" cy="52" r="3" fill="#163B32" opacity="0.5" />
                <circle cx="260" cy="44" r="2.5" fill="#163B32" opacity="0.4" />
                <circle cx="230" cy="30" r="2" fill="#163B32" opacity="0.6" />
                {/* the third step offered */}
                <circle cx="160" cy="148" r="10" fill="#D85D4E" opacity="0.85" />
                <path d="M150 148 h20 M160 138 v20" stroke="#FFFDF8" strokeWidth="2.4" strokeLinecap="round" />
                <text x="160" y="188" textAnchor="middle" fontSize="11" fill="#6E695F" fontFamily="Georgia, serif" fontStyle="italic">{"\u201CPlace it on my head.\u201D"}</text>
              </>
            )}
            {index === 3 && (
              <>
                {/* The blessing — foot resting gently, petals drifting */}
                <ellipse cx="160" cy="150" rx="90" ry="12" fill="#163B32" opacity="0.05" />
                {/* radiating warmth */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <g key={deg} transform={`rotate(${deg} 160 96)`}>
                    <path d="M160 96 L160 40" stroke="#E8B84B" strokeWidth="1.6" opacity="0.35" strokeLinecap="round" />
                  </g>
                ))}
                <circle cx="160" cy="96" r="40" fill="#F7EAC2" />
                <circle cx="160" cy="96" r="40" stroke="#E8B84B" strokeWidth="2.5" fill="none" />
                <circle cx="160" cy="96" r="14" fill="#FFFDF8" stroke="#D85D4E" strokeWidth="2.5" />
                {/* drifting petals */}
                <circle cx="96" cy="160" r="4" fill="#E8B84B" />
                <circle cx="116" cy="176" r="3" fill="#D85D4E" />
                <circle cx="212" cy="162" r="4" fill="#E8B84B" />
                <circle cx="196" cy="180" r="3" fill="#D85D4E" />
                <circle cx="160" cy="186" r="3.5" fill="#E8B84B" opacity="0.7" />
              </>
            )}
            {index === 4 && (
              <>
                {/* What Onam remembers — pookalam rings */}
                {[0, 1, 2, 3, 4].map((r) => (
                  <circle
                    key={r}
                    cx="160"
                    cy="100"
                    r={18 + r * 16}
                    fill={r % 2 === 0 ? "#F7EAC2" : "#E1ECE7"}
                    stroke={r % 2 === 0 ? "#E8B84B" : "#163B32"}
                    strokeWidth="2"
                    opacity={1 - r * 0.12}
                  />
                ))}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <g key={deg} transform={`rotate(${deg} 160 100)`}>
                    <path d="M160 20 C168 30 168 40 160 46 C152 40 152 30 160 20 Z" fill="#D85D4E" opacity="0.8" />
                  </g>
                ))}
                <circle cx="160" cy="100" r="10" fill="#163B32" />
                <circle cx="160" cy="100" r="5" fill="#FFFDF8" />
              </>
            )}
          </svg>
        </div>

        {scene.caption && (
          <p className="mt-3 text-[13px] italic text-ink-muted">{scene.caption}</p>
        )}

        {/* story text */}
        <div className="mt-10 w-full max-w-xl">
          <p className="text-[17px] leading-[1.85] text-ink sm:text-lg">
            {scene.text}
          </p>
        </div>

        {/* progress dots */}
        <div className="mt-12 flex items-center gap-2.5" role="tablist" aria-label="Story progress">
          {STORY_SCENES.map((s, i) => (
            <span key={s.id} className="grid place-items-center">
              <span
                title={`Scene ${i + 1}: ${s.title}`}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "scale-125 bg-coral"
                    : i < index || seen.includes(i)
                      ? "bg-marigold"
                      : "bg-line"
                }`}
              />
            </span>
          ))}
        </div>

        {/* nav buttons */}
        <div className="mt-8 flex w-full max-w-xl items-center justify-between gap-4">
          <button
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="inline-flex h-12 items-center gap-2 rounded-pill border border-forest/60 px-6 text-[15px] font-medium text-forest transition-all hover:bg-forest hover:text-[#F6F1E7] disabled:opacity-30 active:scale-[0.98]"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>
          <button
            onClick={() => go(index + 1)}
            disabled={done}
            className="inline-flex h-12 items-center gap-2 rounded-pill bg-forest px-6 text-[15px] font-medium text-[#F6F1E7] shadow-soft transition-all hover:bg-[#1C4A3E] disabled:opacity-30 active:scale-[0.98]"
          >
            Next
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3l5 5-5 5" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </article>

      {/* completion card */}
      {done && (
        <div className="mt-10 flex flex-col items-center gap-5 rounded-lg border border-marigold/50 bg-marigold-soft/40 px-8 py-9 text-center animate-fade-up">
          <div className="animate-breathe">
            <VamananAvatar state="celebrating" size={110} />
          </div>
          <div>
            <p className="font-display text-2xl font-semibold text-ink">
              And that is the story of Onam.
            </p>
            <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-ink-muted">
              You have walked all five scenes — from a golden age to the
              flowers that remember it. Now that you know the story, shall we
              see how much of it stays with you?
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/quiz"
              className="inline-flex h-12 items-center rounded-pill bg-forest px-7 text-[15px] font-medium text-[#F6F1E7] shadow-soft transition-all hover:bg-[#1C4A3E] active:scale-[0.98]"
            >
              Take the challenge
            </Link>
            <Link
              href="/chat"
              className="inline-flex h-12 items-center rounded-pill border border-forest/60 px-7 text-[15px] font-medium text-forest transition-all hover:bg-forest hover:text-[#F6F1E7] active:scale-[0.98]"
            >
              Ask Vamanan something
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
