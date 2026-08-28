import { siteConfig } from "@/config/site";
import { CopyButton } from "@/components/CopyButton";
import { LinkButton } from "@/components/LinkButton";
import { ScrollReveal } from "@/components/ScrollReveal";

export function TokenSection() {
  return (
    <section id="token" className="scroll-mt-8 bg-[var(--color-ivory)] px-6 py-32 sm:py-44">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-12 text-center">
        <ScrollReveal>
          <h2 className="font-display text-4xl sm:text-5xl">{siteConfig.tickerSymbol}</h2>
        </ScrollReveal>

        <ScrollReveal delayMs={80} className="w-full">
          <div className="flex w-full flex-col gap-3 rounded-sm border border-[var(--color-ink)]/15 bg-[var(--color-ivory-dim)]/40 p-5 text-left sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="eyebrow mb-1 text-[10px] text-[var(--color-ink)]/50">
                Contract Address
              </p>
              <p className="truncate font-[var(--font-mono)] text-sm text-[var(--color-ink)]/85 sm:text-base">
                {siteConfig.tokenContractAddress}
              </p>
            </div>
            <CopyButton value={siteConfig.tokenContractAddress} />
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={140}>
          <p className="font-display text-2xl italic text-[var(--color-ink)]/85 sm:text-3xl">
            The meme is the utility.
          </p>
        </ScrollReveal>

        <ScrollReveal delayMs={200} className="flex flex-col gap-4 sm:flex-row">
          <LinkButton href={siteConfig.links.buy} variant="solid-ink">
            Buy {siteConfig.tickerSymbol}
          </LinkButton>
          <LinkButton href={siteConfig.links.dexscreener} variant="outline-ink">
            DEXScreener
          </LinkButton>
          <LinkButton href={siteConfig.links.twitter} variant="outline-ink">
            X
          </LinkButton>
        </ScrollReveal>

        <ScrollReveal delayMs={260}>
          <p className="max-w-md text-xs leading-relaxed text-[var(--color-ink)]/55">
            {siteConfig.disclaimer}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
