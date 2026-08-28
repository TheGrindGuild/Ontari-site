import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] px-6 py-16 text-[var(--color-ivory)]/70">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <div>
          <p className="font-display text-lg text-[var(--color-ivory)]">{siteConfig.name}</p>
          <p className="eyebrow mt-1 text-[10px] text-[var(--color-ivory)]/50">
            {siteConfig.tagline}
          </p>
        </div>

        <p className="text-xs italic text-[var(--color-ivory)]/50">
          {siteConfig.proclamation.join(" ")}
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
          <a href={siteConfig.links.twitter} className="hover:text-[var(--color-ivory)]">
            X
          </a>
          <a href={siteConfig.links.buy} className="hover:text-[var(--color-ivory)]">
            Buy {siteConfig.tickerSymbol}
          </a>
          <a href={siteConfig.links.dexscreener} className="hover:text-[var(--color-ivory)]">
            DEXScreener
          </a>
          <a href="#token" className="hover:text-[var(--color-ivory)]">
            Contract
          </a>
        </nav>

        <p className="text-[11px] text-[var(--color-ivory)]/35">© {siteConfig.year} {siteConfig.name}</p>
      </div>
    </footer>
  );
}
