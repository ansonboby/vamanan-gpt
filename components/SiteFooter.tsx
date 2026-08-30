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
        <div className="flex items-center gap-5 text-sm">
          <Link href="/story" className="text-ink-muted transition-colors hover:text-forest">
            The Story
          </Link>
          <Link href="/quiz" className="text-ink-muted transition-colors hover:text-forest">
            The Quiz
          </Link>
          <Link href="/about" className="text-ink-muted transition-colors hover:text-forest">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
