import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { ShareOntarioSection } from "@/components/anecdotes/ShareOntarioSection";
import { MemeSection } from "@/components/sections/MemeSection";
import { CastStoneSection } from "@/components/cast-stone/CastStoneSection";
import { SocialSection } from "@/components/sections/SocialSection";
import { TokenSection } from "@/components/sections/TokenSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Story />
      <ShareOntarioSection />
      <MemeSection />
      <CastStoneSection />
      <SocialSection />
      <TokenSection />
      <Footer />
    </main>
  );
}