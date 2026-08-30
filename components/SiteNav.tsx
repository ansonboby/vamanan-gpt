"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/ui/LogoMark";

const LINKS = [
  { href: "/chat", label: "Talk" },
  { href: "/story", label: "Story" },
  { href: "/quiz", label: "Quiz" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-background/85 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
        aria-label="Main"
      >
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={30} />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Vamanan&nbsp;GPT
          </span>
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3.5 py-2 text-[15px] transition-colors ${
                  active
                    ? "bg-forest-soft font-medium text-forest"
                    : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/chat"
            className="ml-3 inline-flex h-10 items-center rounded-pill bg-forest px-5 text-[15px] font-medium text-[#F6F1E7] transition-all hover:bg-[#1C4A3E] active:scale-[0.98]"
          >
            Meet Vamanan
          </Link>
        </div>

        {/* mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
            <path d="M1 1h16M1 7h16M1 13h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {/* mobile menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-line/70 bg-background px-5 pb-4 pt-2 md:hidden animate-fade-in">
          <div className="flex flex-col">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-3 text-[16px] ${
                  pathname.startsWith(href)
                    ? "bg-forest-soft font-medium text-forest"
                    : "text-ink"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/chat"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-12 items-center justify-center rounded-pill bg-forest px-5 text-[16px] font-medium text-[#F6F1E7]"
            >
              Meet Vamanan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
