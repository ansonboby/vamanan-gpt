import Link from "next/link";
import type { ReactNode, MouseEventHandler } from "react";

type Variant = "primary" | "secondary" | "accent";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-forest text-[#F6F1E7] hover:bg-[#1C4A3E] active:scale-[0.98] shadow-soft",
  secondary:
    "bg-transparent text-forest border border-forest/60 hover:bg-forest hover:text-[#F6F1E7] active:scale-[0.98]",
  accent:
    "bg-marigold text-ink hover:bg-[#EDC461] active:scale-[0.98] shadow-soft",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-[15px] rounded-md",
  lg: "h-13 px-8 text-base rounded-pill",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  onClick,
  ...rest
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler;
} & Omit<React.ComponentProps<typeof Link>, "href" | "onClick" | "className" | "children">) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Chip({
  className = "",
  children,
  ...props
}: { children: ReactNode; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface px-4 py-2 text-sm text-ink transition-all duration-200 hover:border-forest/50 hover:bg-forest-soft active:scale-[0.97] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ChipLink({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface px-4 py-2 text-sm text-ink transition-all duration-200 hover:border-forest/50 hover:bg-forest-soft active:scale-[0.97] ${className}`}
    >
      {children}
    </Link>
  );
}
