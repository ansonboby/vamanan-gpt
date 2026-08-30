import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { VamananGreeting } from "@/components/vamanan/VamananGreeting";
import { ButtonLink, ChipLink } from "@/components/ui/buttons";

export const metadata: Metadata = {
  title: "Vamanan GPT — Meet the storyteller of Onam",
};

/* Pookalam-inspired ring geometry for section decoration */
function PookalamRing({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={`animate-spin-slow ${className}`}
      fill="none"
    >
      <circle cx="100" cy="100" r="96" stroke="#DDD5C6" strokeWidth="1" strokeDasharray="2 6" />
      <circle cx="100" cy="100" r="78" stroke="#E8B84B" strokeWidth="1" opacity="0.6" strokeDasharray="1 9" />
      <circle cx="100" cy="100" r="58" stroke="#163B32" strokeWidth="1" opacity="0.25" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 100 100)`}>
          <path d="M100 2 C106 10 106 18 100 24 C94 18 94 10 100 2 Z" fill="#E8B84B" opacity="0.7" />
        </g>
      ))}
      <circle cx="100" cy="100" r="8" fill="#D85D4E" opacity="0.8" />
      <circle cx="100" cy="100" r="4" fill="#FFFDF8" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />

      <main className="paper-texture relative flex-1">
        {/* ── Hero ── */}
        <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:pb-24 lg:pt-20">
          <div className="animate-fade-up">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-coral">
              A story from Kerala, reimagined with AI
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Meet Vamanan.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted">
              Ask. Listen. Explore. A small storyteller from the Onam tradition
              is waiting — with the story of a king, a feast of culture, and
              three small questions.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <ButtonLink href="/chat" size="lg">
                Meet Vamanan
              </ButtonLink>
              <ButtonLink href="/story" variant="secondary" size="lg">
                Explore Onam
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-ink-muted">
              No account needed — every journey starts with a question.
            </p>
          </div>

          <div className="relative mx-auto lg:justify-self-end">
            <PookalamRing className="absolute -left-24 -top-24 h-72 w-72 opacity-70" />
            <PookalamRing className="absolute -bottom-20 -right-16 h-56 w-56 opacity-50" />
            <VamananGreeting />
          </div>
        </section>

        {/* ── Choose your path ── */}
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Choose your path
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {[
              {
                href: "/chat",
                glyph: "ഉ",
                title: "Talk to Vamanan",
                desc: "Ask anything about Onam, Mahabali, or Kerala. He remembers your name and speaks Malayalam too.",
              },
              {
                href: "/story",
                glyph: "③",
                title: "Hear the Story",
                desc: "The legend of Mahabali in five scenes — from the golden age to the flowers that remember it.",
              },
              {
                href: "/quiz",
                glyph: "✻",
                title: "Take the Challenge",
                desc: "Ten questions on Kerala and Onam. Immediate verdicts, gentle mockery, a final score.",
              },
            ].map(({ href, glyph, title, desc }) => (
              <Link
                key={href}
                href={href}
                className="group relative overflow-hidden rounded-lg border border-line bg-surface p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-marigold-soft font-display text-xl text-forest"
                >
                  {glyph}
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-muted">{desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-forest transition-transform duration-300 group-hover:translate-x-1">
                  Begin
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Cultural threads ── */}
        <section className="mx-auto max-w-6xl px-5 py-14 pb-20 sm:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Threads of Kerala
          </h2>
          <p className="mt-2.5 max-w-xl text-[15px] text-ink-muted">
            A few of the traditions woven into the experience — ask Vamanan
            about any of them.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {[
              ["Pookalam", "the flower carpet"],
              ["Sadya", "the banana-leaf feast"],
              ["Vallam Kali", "the snake-boat races"],
              ["Puli Kali", "the tiger dance"],
              ["Malayalam", "the language"],
              ["Mahabali", "the beloved king"],
            ].map(([name, gloss]) => (
              <ChipLink key={name} href="/chat">
                <span className="font-medium text-forest">{name}</span>
                <span className="text-ink-muted"> — {gloss}</span>
              </ChipLink>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
