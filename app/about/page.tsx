import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { VamananAvatar } from "@/components/vamanan/VamananAvatar";

export const metadata: Metadata = {
  title: "About — Vamanan GPT",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="paper-texture relative flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-start">
            <div className="animate-breathe shrink-0">
              <VamananAvatar state="storytelling" size={140} />
            </div>
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
                About Vamanan&nbsp;GPT
              </h1>
              <p className="mt-4 text-[16.5px] leading-relaxed text-ink-muted">
                Vamanan GPT is an interactive AI experience built around one of
                Kerala&rsquo;s most beloved traditions: the Onam legend of
                King Mahabali and the small boy who came asking for three
                paces of land. The character &ldquo;Vamanan&rdquo; is a
                friendly storyteller inspired by that tradition — a digital
                guide with a coconut-shell umbrella and a love of good
                questions.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <section className="rounded-lg border border-line bg-surface p-6 shadow-soft">
              <h2 className="font-display text-xl font-semibold text-ink">
                How it works
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                Vamanan talks through a large language model (GLM 5.3,
                with a Gemini fallback chain), guided by a carefully
                layered character prompt and a curated knowledge base of
                Onam traditions. The story and quiz modes run on
                hand-written, verified content — so they work even when
                the network does not.
              </p>
            </section>
            <section className="rounded-lg border border-line bg-surface p-6 shadow-soft">
              <h2 className="font-display text-xl font-semibold text-ink">
                Cultural care
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                The Mahabali legend is told here as tradition, not verified
                history — and Vamanan is instructed to say so when it matters.
                He avoids inventing rituals, quotations or dates, and treats
                Kerala&rsquo;s culture with the respect it deserves. If
                something here feels wrong to you, it should not — tell us.
              </p>
            </section>
          </div>

          <div className="mt-10 rounded-lg border border-marigold/50 bg-marigold-soft/40 p-7">
            <h2 className="font-display text-xl font-semibold text-ink">
              A note from the character himself
            </h2>
            <p className="mt-3 max-w-2xl text-[15.5px] italic leading-relaxed text-ink">
              &ldquo;I once asked a king for three paces of land and it went
              to his head — literally. These days I ask for smaller things:
              your curiosity, your patience, an occasional question about
              flowers. It is a better trade.&rdquo;
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-3.5">
            <Link
              href="/chat"
              className="inline-flex h-12 items-center rounded-pill bg-forest px-7 text-[15px] font-medium text-[#F6F1E7] shadow-soft transition-all hover:bg-[#1C4A3E] active:scale-[0.98]"
            >
              Meet Vamanan
            </Link>
            <Link
              href="/story"
              className="inline-flex h-12 items-center rounded-pill border border-forest/60 px-7 text-[15px] font-medium text-forest transition-all hover:bg-forest hover:text-[#F6F1E7] active:scale-[0.98]"
            >
              Read the story
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
