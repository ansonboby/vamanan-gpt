import Link from "next/link";

export function PromptChips({
  onPick,
  compact = false,
}: {
  onPick: (text: string) => void;
  compact?: boolean;
}) {
  // chips that are journeys, not chat prompts — navigate straight there
  const links: Record<string, string> = {
    "Quiz me": "/quiz",
    "Tell me the Mahabali story": "/story",
  };
  const prompts = compact
    ? [
        "Quiz me",
        "Speak Malayalam with me",
        "Surprise me",
      ]
    : [
        "Tell me the Mahabali story",
        "Why do people celebrate Onam?",
        "What is a pookalam?",
        "Teach me a Malayalam word",
        "What's in a sadya?",
        "Surprise me",
      ];

  return (
    <div className={`flex flex-wrap gap-2.5 ${compact ? "" : "max-w-lg"}`}>
      {prompts.map((p) =>
        links[p] ? (
          <Link
            key={p}
            href={links[p]}
            className="inline-flex min-h-11 items-center rounded-pill border border-line bg-surface px-4 py-2 text-sm text-ink transition-all duration-200 hover:border-forest/50 hover:bg-forest-soft active:scale-[0.97]"
          >
            {p}
          </Link>
        ) : (
          <button
            key={p}
            onClick={() => onPick(p)}
            className="min-h-11 rounded-pill border border-line bg-surface px-4 py-2 text-sm text-ink transition-all duration-200 hover:border-forest/50 hover:bg-forest-soft active:scale-[0.97]"
          >
            {p}
          </button>
        )
      )}
    </div>
  );
}
