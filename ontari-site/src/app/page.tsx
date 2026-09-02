import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { MemeSection } from "@/components/sections/MemeSection";
import { CastStoneSection } from "@/components/cast-stone/CastStoneSection";
import { ShareOntarioSection } from "@/components/anecdotes/ShareOntarioSection";
import { TokenSection } from "@/components/sections/TokenSection";
import { SocialSection } from "@/components/sections/SocialSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Story />
      <MemeSection />
      <CastStoneSection />
      <ShareOntarioSection />
      <TokenSection />
      <SocialSection />
      <Footer />
    </main>
  );
}