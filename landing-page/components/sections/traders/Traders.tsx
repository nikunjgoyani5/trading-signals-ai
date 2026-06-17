"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpVariant } from "@/utils/animations";
import TraderFeatureCard from "./TraderFeatureCard";
import { useCarousel } from "./useCarousel";
import Container from "@/components/common/container/Container";

/* ─── SVG icons (unchanged) ──────────────────────────────────── */
const ShieldIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const EyeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
const ChartIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6"  y1="20" x2="6"  y2="14" /></svg>;
const ZapIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
const ChevronLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>;
const ChevronRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;

export default function Traders() {
  const { t } = useTranslation();
  const items = t("whyUs.items", { returnObjects: true }) as any[];

  const cards = [
    { icon: <ShieldIcon />, title: items[0]?.title ?? "Security", description: items[0]?.desc ?? "" },
    { icon: <EyeIcon />, title: items[1]?.title ?? "Transparency", description: items[1]?.desc ?? "" },
    { icon: <ChartIcon />, title: items[2]?.title ?? "Analytics", description: items[2]?.desc ?? "" },
    { icon: <ZapIcon />, title: items[3]?.title ?? "Execution", description: items[3]?.desc ?? "" },
    // Adding more for demonstration of the loop/scroll
    { icon: <ShieldIcon />, title: items[0]?.title ?? "Security", description: items[0]?.desc ?? "" },
    { icon: <EyeIcon />, title: items[1]?.title ?? "Transparency", description: items[1]?.desc ?? "" },
  ];

 const {
  emblaRef,
  selectedIndex,
  scrollPrev,
  scrollNext,
  scrollTo,
} = useCarousel({
  loop: true,
  autoplay: true,
  autoplayDelay: 4000,
});

  return (
    <section className="w-full section-pb bg-transparent">
      <Container>
        
        {/* Header Logic */}
        <div className="text-center mb-12">
           <h2 className="head-size text-white font-medium mb-4">{t("whyUs.heading")}</h2>
           <p className="desc-size text-[#c7ccd2] leading-snug">{t("whyUs.description")}</p>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4 lg:-ml-5"> 
            {cards.map((card, i) => (
              <div 
                key={i} 
                className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33%] xl:flex-[0_0_25%] pl-4 lg:pl-5"
              >
                <TraderFeatureCard {...card} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-6 mt-10">
          <button onClick={scrollPrev} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
            <ChevronLeft />
          </button>

          <div className="flex gap-2">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? "w-8 bg-vivid-cyan" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>

          <button onClick={scrollNext} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
            <ChevronRight />
          </button>
        </div>
      </Container>
    </section>
  );
}