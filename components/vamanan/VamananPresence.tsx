import { VamananAvatar, type VamananState } from "./VamananAvatar";

/**
 * VamananPresence — the character alongside a status line.
 * Subtle breathing motion keeps him alive without dominating the UI.
 */
export function VamananPresence({
  state = "idle",
  status,
  size = 200,
  className = "",
}: {
  state?: VamananState;
  status?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="animate-breathe">
        <VamananAvatar state={state} size={size} />
      </div>
      {status && (
        <p className="text-sm text-ink-muted flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              state === "thinking" ? "bg-marigold" : "bg-forest"
            }`}
          />
          {status}
        </p>
      )}
    </div>
  );
}
