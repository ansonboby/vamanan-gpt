"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/buttons";
import { VamananAvatar } from "@/components/vamanan/VamananAvatar";

/**
 * PookalamBuilder — lay a flower carpet ring by ring.
 *
 * Mirrors the tradition: a pookalam begins small on Atham day and grows
 * one ring each day until Thiruvonam, the main day of Onam. Each tap
 * lays the next day's ring in the chosen flower.
 */

const DAYS = [
  "Atham",
  "Chithira",
  "Chothi",
  "Vishakam",
  "Anizham",
  "Thriketta",
  "Moolam",
  "Pooradam",
  "Uthradam",
  "Thiruvonam",
] as const;

type Flower = { name: string; color: string; edge?: string };

const FLOWERS: Flower[] = [
  { name: "Marigold", color: "#E8B84B" },
  { name: "Thumba white", color: "#FFFDF8", edge: "#DDD5C6" },
  { name: "Red", color: "#D85D4E" },
  { name: "Forest", color: "#163B32" },
  { name: "Moss", color: "#E1ECE7", edge: "#DDD5C6" },
];

type Ring = { color: string; edge?: string };

/* geometry — centre circle r=26, each day's ring 11px further out */
function ringRadius(i: number): number {
  return 26 + (i + 1) * 11;
}

function RingPetals({ index, color, edge }: Ring & { index: number }) {
  const r = ringRadius(index);
  const petals = Math.max(10, Math.round((2 * Math.PI * r) / 12));
  return (
    <g className="animate-ring-in">
      {Array.from({ length: petals }, (_, j) => {
        const angle = (360 / petals) * j;
        return (
          <ellipse
            key={j}
            cx={160 + r - 6}
            cy={160}
            rx={7}
            ry={4.8}
            fill={color}
            stroke={edge}
            strokeWidth={edge ? 0.6 : 0}
            opacity={j % 2 ? 1 : 0.88}
            transform={`rotate(${angle} 160 160)`}
          />
        );
      })}
    </g>
  );
}

export function PookalamBuilder() {
  const [rings, setRings] = useState<Ring[]>([]);
  const [flower, setFlower] = useState<Flower>(FLOWERS[0]);

  const laid = rings.length;
  const complete = laid >= DAYS.length;
  const nextDay = complete ? undefined : DAYS[laid];

  const status = complete
    ? "Thiruvonam — the pookalam is complete. Ten rings, ten days."
    : laid === 0
      ? "The courtyard is swept and waiting."
      : `Day ${laid} of 10 — ${DAYS[laid - 1]}'s ring is laid.`;

  function layRing() {
    if (complete) return;
    setRings((prev) => [...prev, { color: flower.color, edge: flower.edge }]);
  }

  function sweepClean() {
    setRings([]);
  }

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
      {/* ── the pookalam ── */}
      <div className="mx-auto w-full max-w-[340px]">
        <svg
          viewBox="0 0 320 320"
          className="h-auto w-full"
          role="img"
          aria-label={
            complete
              ? "A complete ten-ring pookalam for Thiruvonam"
              : `A pookalam in progress — ${laid} of 10 rings laid`
          }
        >
          {/* courtyard frame */}
          <circle cx="160" cy="160" r="152" fill="#FFFDF8" stroke="#DDD5C6" strokeWidth="1" strokeDasharray="2 6" />
          <circle cx="160" cy="160" r="26" fill="#FFFDF8" stroke="#163B32" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 4" />
          <circle cx="160" cy="160" r="5" fill="#D85D4E" />

          {rings.map((ring, i) => (
            <RingPetals key={i} index={i} color={ring.color} edge={ring.edge} />
          ))}
        </svg>
      </div>

      {/* ── controls ── */}
      <div className="flex flex-col gap-7">
        {/* the ten days */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            The ten days of Onam
          </p>
          <ol className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Progress from Atham to Thiruvonam">
            {DAYS.map((day, i) => {
              const isLaid = i < laid;
              const isNext = i === laid && !complete;
              return (
                <li
                  key={day}
                  className={`rounded-pill px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                    isLaid
                      ? "bg-forest text-[#F6F1E7]"
                      : isNext
                        ? "border border-coral text-coral"
                        : "border border-line bg-surface text-ink-muted"
                  }`}
                >
                  {day}
                </li>
              );
            })}
          </ol>
        </div>

        {/* flowers + actions, or the completion note */}
        {complete ? (
          <div className="flex items-start gap-5 rounded-lg border border-marigold/50 bg-marigold-soft/50 p-6">
            <div className="animate-breathe shrink-0">
              <VamananAvatar state="celebrating" size={96} />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl font-semibold text-forest">
                Onam ashamsakal!
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                Ten rings, from Atham to Thiruvonam — a doorway fit for a
                homecoming king. And tomorrow, of course, we sweep it clean
                and begin again. That is the tradition: the welcome is the work.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={sweepClean}>
                  Sweep it clean
                </Button>
                <Link
                  href="/story"
                  className="inline-flex h-13 items-center rounded-pill bg-forest px-8 text-base font-medium text-[#F6F1E7] shadow-soft transition-all hover:bg-[#1C4A3E] active:scale-[0.98]"
                >
                  Now, hear the story
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Choose a flower
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {FLOWERS.map((f) => {
                  const active = f.name === flower.name;
                  return (
                    <button
                      key={f.name}
                      onClick={() => setFlower(f)}
                      aria-pressed={active}
                      aria-label={`${f.name} flower`}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border border-line transition-transform hover:scale-110 active:scale-95 ${
                        active ? "outline outline-2 outline-offset-2 outline-coral" : ""
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="h-7 w-7 rounded-full"
                        style={{ backgroundColor: f.color, boxShadow: f.edge ? `inset 0 0 0 1px ${f.edge}` : undefined }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3.5">
              <Button size="lg" onClick={layRing}>
                Lay {nextDay}&rsquo;s ring
              </Button>
              {laid > 0 && (
                <Button variant="secondary" size="lg" onClick={sweepClean}>
                  Sweep it clean
                </Button>
              )}
            </div>

            <p
              role="status"
              aria-live="polite"
              className="text-sm leading-relaxed text-ink-muted"
            >
              {status}
            </p>
          </>
        )}
        {complete && (
          <p role="status" aria-live="polite" className="text-sm leading-relaxed text-ink-muted">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
