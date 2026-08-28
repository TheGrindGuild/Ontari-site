import type { ReactNode } from "react";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid-ivory" | "outline-ivory" | "solid-ink" | "outline-ink";
};

const variantClasses: Record<NonNullable<LinkButtonProps["variant"]>, string> = {
  "solid-ivory":
    "bg-[var(--color-ivory)] text-[var(--color-lake-deep)] hover:bg-[var(--color-ivory-dim)]",
  "outline-ivory":
    "border border-[var(--color-ivory)]/50 text-[var(--color-ivory)] hover:border-[var(--color-ivory)] hover:bg-[var(--color-ivory)]/10",
  "solid-ink": "bg-[var(--color-ink)] text-[var(--color-ivory)] hover:bg-[var(--color-lake-deep)]",
  "outline-ink":
    "border border-[var(--color-ink)]/30 text-[var(--color-ink)] hover:border-[var(--color-ink)] hover:bg-[var(--color-ink)]/5",
};

export function LinkButton({ href, children, variant = "solid-ivory" }: LinkButtonProps) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`eyebrow inline-flex items-center justify-center px-7 py-3.5 text-xs transition-colors duration-300 sm:text-sm ${variantClasses[variant]}`}
    >
      {children}
    </a>
  );
}
