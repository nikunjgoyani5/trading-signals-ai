import Navbar from "@/components/common/navbar/Navbar";
import NoiseOverlay from "@/components/NoiseOverlay";
import Categories from "@/components/sections/categories/Categories";
import CTA from "@/components/sections/cta/CTA";
import Features from "@/components/sections/features/Features";
import Hero from "@/components/sections/hero/Hero";
import { Strategies } from "@/components/sections/strategies/DynamicStrategies";
import TrustedLogos from "@/components/sections/trusted/TrustedLogos";
import { StartToday } from "@/components/sections/starttoday/DynamicStartToday";
import AmbientTradingSection from "@/components/ui/Ambienttradingsection";
import AmbientStatsStepsSection from "@/components/ui/AmbientStatsStepsSection";
import { AmbientTestimonialsSection } from "@/components/ui/DynamicAmbientTestimonials";
import AmbientFAQCTASection from "@/components/ui/AmbientFAQCTASection";
import Container from "@/components/common/container/Container";
import noiseTexture from "@/assets/images/texture.png";
import AutoRefreshOnReturn from "@/components/AutoRefreshOnReturn";
import Stats from "@/components/sections/stats/Stats";


export default function Home() {
  return (
    <main className="relative w-full min-w-0">
      <AutoRefreshOnReturn />
      <div
        className="absolute inset-0 z-[999] pointer-events-none opacity-50"
        style={{
          backgroundImage: `url(${noiseTexture.src})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '900px 900px'
        }}
      />
      <Hero />
      <TrustedLogos />

      <section
        id="features"
        className="scroll-mt-18 sm:scroll-mt-6 md:scroll-mt-18 lg:scroll-mt-18"
      >
        <Features />
      </section>

      <section
        id="strategies"
        className="scroll-mt-14 sm:scroll-mt-14 md:scroll-mt-24 lg:scroll-mt-29"
      >
        <Strategies />
      </section>
      <Stats />
      {/* <AmbientStatsStepsSection /> */}
      <AmbientTradingSection />

      <section>
        <AmbientTestimonialsSection />
      </section>
      <AmbientFAQCTASection />
      <StartToday />
    </main>
  );
}