import Link from "next/link";
import { VamananAvatar } from "@/components/vamanan/VamananAvatar";

export default function NotFound() {
  return (
    <div className="paper-texture flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <VamananAvatar state="thinking" size={170} />
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
        A wrong turn
      </p>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
        Even I took three steps and lost the whole kingdom.
      </h1>
      <p className="max-w-md text-[15.5px] leading-relaxed text-ink-muted">
        This page does not exist — but every story has a first step, and
        yours is one click away.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-12 items-center rounded-pill bg-forest px-7 text-[15px] font-medium text-[#F6F1E7] shadow-soft transition-all hover:bg-[#1C4A3E] active:scale-[0.98]"
        >
          Back home
        </Link>
        <Link
          href="/chat"
          className="inline-flex h-12 items-center rounded-pill border border-forest/60 px-7 text-[15px] font-medium text-forest transition-all hover:bg-forest hover:text-[#F6F1E7] active:scale-[0.98]"
        >
          Talk to Vamanan
        </Link>
      </div>
    </div>
  );
}
