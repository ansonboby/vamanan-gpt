import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line/70 bg-surface/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-10 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left">
        <div>
          <p className="font-display text-base text-ink">
            Vamanan&nbsp;GPT — a story from Kerala, reimagined with AI
          </p>
          <p className="mt-1.5 text-sm text-ink-muted">
            Built with respect for the Onam tradition. Onam ashamsakal!
          </p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-end" aria-label="Footer">
          <Link
            href="/story"
            className="inline-flex h-11 items-center rounded-md px-3 text-sm text-ink-muted transition-colors hover:text-forest"
          >
            The Story
          </Link>
          <Link
            href="/quiz"
            className="inline-flex h-11 items-center rounded-md px-3 text-sm text-ink-muted transition-colors hover:text-forest"
          >
            The Quiz
          </Link>
          <Link
            href="/about"
            className="inline-flex h-11 items-center rounded-md px-3 text-sm text-ink-muted transition-colors hover:text-forest"
          >
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
}
