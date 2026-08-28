import { siteConfig } from "@/config/site";
import { ContourLines } from "@/components/ContourLines";
import { LinkButton } from "@/components/LinkButton";

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[var(--color-lake)] px-6 text-[var(--color-ivory)]">
      <div className="grain" />
      <ContourLines
        variant="dark"
        className="animate-drift absolute inset-0 h-full w-[130%] opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-lake-deep)]/60 via-transparent to-[var(--color-lake-deep)]/80" />

      <div className="relative flex flex-col items-center gap-8 text-center">
        <h1 className="font-display text-[15vw] font-medium leading-[0.9] tracking-tight sm:text-[7rem] md:text-[8rem]">
          {siteConfig.name}
        </h1>

        <p className="eyebrow text-sm text-[var(--color-ivory)]/80 sm:text-base">
          {siteConfig.tagline}
        </p>

        <p className="font-display text-xl italic leading-snug text-[var(--color-ivory)]/95 sm:text-2xl">
          {siteConfig.proclamation.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <LinkButton href={siteConfig.links.buy} variant="solid-ivory">
            Buy {siteConfig.tickerSymbol}
          </LinkButton>
          <LinkButton href={siteConfig.links.twitter} variant="outline-ivory">
            X / Twitter
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
