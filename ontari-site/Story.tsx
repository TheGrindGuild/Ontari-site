import { ContourLines } from "@/components/ContourLines";
import { ScrollReveal } from "@/components/ScrollReveal";

export function Story() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-ivory)] px-6 py-32 sm:py-44">
      <ContourLines
        variant="light"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col gap-14">
        <ScrollReveal>
          <span className="eyebrow text-xs text-[var(--color-lake)]/60 sm:text-sm">
            The Story
          </span>
        </ScrollReveal>

        <ScrollReveal delayMs={80}>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">Ontari&rsquo;io</h2>
        </ScrollReveal>

        <div className="flex flex-col gap-10 font-display text-2xl leading-relaxed text-[var(--color-ink)]/90 sm:text-3xl">
          <ScrollReveal delayMs={140}>
            <p>
              The name Ontario comes from the Wendat word Ontari&rsquo;io &mdash; meaning,
              appropriately, &ldquo;the lake is beautiful, the lake is big.&rdquo;
            </p>
          </ScrollReveal>

          <ScrollReveal delayMs={200}>
            <p>More than 400 years later, the name is still here.</p>
          </ScrollReveal>

          <ScrollReveal delayMs={260}>
            <p>Someone tried to change it.</p>
          </ScrollReveal>
        </div>

        <ScrollReveal delayMs={340}>
          <p className="font-display text-5xl font-medium tracking-tight text-[var(--color-red)] sm:text-6xl">
            So we made the meme.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
