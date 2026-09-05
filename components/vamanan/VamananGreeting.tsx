import { VamananAvatar } from "./VamananAvatar";

/**
 * VamananGreeting — used on the landing hero.
 */
export function VamananGreeting() {
  return (
    <div className="relative flex flex-col items-center">
      {/* rising sun behind Vamanan's umbrella — upper left, so the
          avatar's face (right of frame) stays clear of the glow */}
      <div
        aria-hidden="true"
        className="absolute -top-12 -left-14 h-44 w-44 rounded-full border border-line bg-marigold-soft/40 animate-spin-slow hidden sm:block"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      />
      <div className="animate-breathe">
        <VamananAvatar state="idle" size={260} />
      </div>
      <div
        aria-hidden="true"
        className="mt-4 flex items-center gap-1.5"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-marigold"
            style={{ animation: `think-dot 1.8s ease-in-out ${i * 0.15}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
