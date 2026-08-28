import { siteConfig } from "@/config/site";
import { MemeMorph } from "@/components/MemeMorph";
import { ScrollReveal } from "@/components/ScrollReveal";

export function MemeSection() {
  return (
    <section className="relative bg-[var(--color-lake-deep)] px-6 py-32 text-[var(--color-ivory)] sm:py-44">
      <div className="grain" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-16 text-center">
        <ScrollReveal>
          <div className="border-y border-[var(--color-ivory)]/25 px-8 py-8 sm:px-16">
            <p className="eyebrow mb-3 text-[10px] text-[var(--color-ivory)]/50 sm:text-xs">
              An Official Proclamation
            </p>
            <p className="font-display text-2xl leading-snug sm:text-4xl">
              {siteConfig.proclamation.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={100}>
          <p className="eyebrow text-xs text-[var(--color-ivory)]/60 sm:text-sm">
            {siteConfig.tagline}
          </p>
        </ScrollReveal>

        <ScrollReveal delayMs={180}>
          <MemeMorph />
        </ScrollReveal>
      </div>
    </section>
  );
}
