import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-ivory)]/10 bg-[var(--color-lake-deep)]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-display text-sm tracking-wide text-[var(--color-ivory)] sm:text-base">
          {siteConfig.name}
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/cancon-calculator" className="eyebrow text-xs text-[var(--color-ivory)]/70 transition-colors hover:text-[var(--color-ivory)] sm:text-sm">
            CanCon Calculator
          </Link>
          <a href={siteConfig.links.buy} target="_blank" rel="noopener noreferrer" className="eyebrow bg-[var(--color-red)] px-4 py-2 text-xs text-[var(--color-ivory)] transition-opacity hover:opacity-90 sm:text-sm">
            Contribute
          </a>
        </div>
      </nav>
    </header>
  );
}