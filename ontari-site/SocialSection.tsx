import { siteConfig } from "@/config/site";
import { ContourLines } from "@/components/ContourLines";
import { LinkButton } from "@/components/LinkButton";
import { ScrollReveal } from "@/components/ScrollReveal";

export function SocialSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-lake)] px-6 py-32 text-[var(--color-ivory)] sm:py-44">
      <div className="grain" />
      <ContourLines
        variant="dark"
        className="animate-drift absolute inset-0 h-full w-[130%] opacity-30"
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-10 text-center">
        <ScrollReveal>
          <h2 className="font-display text-4xl leading-tight sm:text-6xl">
            The lake isn&rsquo;t going anywhere.
          </h2>
        </ScrollReveal>
        <ScrollReveal delayMs={100}>
          <p className="font-display text-xl italic text-[var(--color-ivory)]/80 sm:text-2xl">
            Neither is the meme.
          </p>
        </ScrollReveal>
        <ScrollReveal delayMs={180}>
          <LinkButton href={siteConfig.links.twitter} variant="outline-ivory">
            Follow on X
          </LinkButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
