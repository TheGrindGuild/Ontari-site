import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { MemeSection } from "@/components/sections/MemeSection";
import { TokenSection } from "@/components/sections/TokenSection";
import { SocialSection } from "@/components/sections/SocialSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Story />
      <MemeSection />
      <TokenSection />
      <SocialSection />
      <Footer />
    </main>
  );
}
