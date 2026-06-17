"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpVariant } from "@/utils/animations";
import StrategyCard from "./StrategyCard";
import StrategyTabs from "./StrategyTabs";
import StrategyFilters from "./StrategyFilters";
import primeIcon from "@/assets/icons/tsai-prime.png";
import momentumIcon from "@/assets/icons/tsai-momentum.png";
import coreIcon from "@/assets/icons/tsai-core.png";
import altsIcon from "@/assets/icons/tsai-alts.png";
import flashIcon from "@/assets/icons/tsai-flash.png";
import systemIcon from "@/assets/icons/tsai-system.png";
import structIcon from "@/assets/icons/tsai-struct.png";
import assistIcon from "@/assets/icons/tsai-assist.png";
import volIcon from "@/assets/icons/tsai-vol.png";
import hybridIcon from "@/assets/icons/tsai-hybrid.png";
import noiseTexture from "@/assets/images/texture.png"; 
import NoiseOverlay from "@/components/NoiseOverlay";
import Container from "@/components/common/container/Container";


export default function Strategies() {
  const { t } = useTranslation();

  const strategies = [
    {
      icon: primeIcon,
      name: t("strategy.cards.prime.title"),
      description: t("strategy.cards.prime.desc"),
      roi: t("strategy.cards.prime.roi"),
      price: t("strategy.cards.prime.price"),
    },
    {
      icon: momentumIcon,
      name: t("strategy.cards.momentum.title"),
      description: t("strategy.cards.momentum.desc"),
      roi: t("strategy.cards.momentum.roi"),
      price: t("strategy.cards.momentum.price"),
    },
    {
      icon: coreIcon,
      name: t("strategy.cards.core.title"),
      description: t("strategy.cards.core.desc"),
      roi: t("strategy.cards.core.roi"),
      price: t("strategy.cards.core.price"),
    },
    {
      icon: altsIcon,
      name: t("strategy.cards.alts.title"),
      description: t("strategy.cards.alts.desc"),
      roi: t("strategy.cards.alts.roi"),
      price: t("strategy.cards.alts.price"),
    },
    {
      icon: flashIcon,
      name: t("strategy.cards.flash.title"),
      description: t("strategy.cards.flash.desc"),
      roi: t("strategy.cards.flash.roi"),
      price: t("strategy.cards.flash.price"),
    },
    {
      icon: systemIcon,
      name: t("strategy.cards.system.title"),
      description: t("strategy.cards.system.desc"),
      roi: t("strategy.cards.system.roi"),
      price: t("strategy.cards.system.price"),
    },
    {
      icon: structIcon,
      name: t("strategy.cards.struct.title"),
      description: t("strategy.cards.struct.desc"),
      roi: t("strategy.cards.struct.roi"),
      price: t("strategy.cards.struct.price"),
    },
    {
      icon: assistIcon,
      name: t("strategy.cards.assist.title"),
      description: t("strategy.cards.assist.desc"),
      roi: t("strategy.cards.assist.roi"),
      price: t("strategy.cards.assist.price"),
    },
    {
      icon: volIcon,
      name: t("strategy.cards.vol.title"),
      description: t("strategy.cards.vol.desc"),
      roi: t("strategy.cards.vol.roi"),
      price: t("strategy.cards.vol.price"),
    },
    {
      icon: hybridIcon,
      name: t("strategy.cards.hybrid.title"),
      description: t("strategy.cards.hybrid.desc"),
      roi: t("strategy.cards.hybrid.roi"),
      price: t("strategy.cards.hybrid.price"),
    },
  ];

  return (
    <section
    className="w-full section-pb relative z-10 overflow-hidden"
    style={{
      background: "linear-gradient(180deg, #010B24 0%, #010B24 75%, #02164b 100%)",
    }}
    >
      <Container>
      {/* <div
        className="absolute inset-0 z-[999] pointer-events-none opacity-50"
        style={{
          backgroundImage: `url(${noiseTexture.src})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '900px 900px'
        }}
      /> */}
      <NoiseOverlay/>
      
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className=" mx-auto relative z-10"
      >

        {/* Header Section */}
        <motion.div variants={fadeUpVariant} className="flex flex-col items-center text-center max-w-[740px] mx-auto mb-8 md:mb-12 gap-1 md:gap-3">
          <div className="inline-flex items-center  shadow-inner">
            <span className="text-[15px] font-mono font-medium tracking-widest uppercase text-vivid-cyan">
              {t("strategy.strategybadge")}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <h2
              className="text-white font-hoves font-medium head-size leading-tight"
            >
              {t("strategy.title")}
            </h2>
            <p
              className="font-hoves desc-size text-[#C7CCD2] leading-snug max-w-3xl opacity-80"
            >
              {t("strategy.description")}
            </p>
          </div>
        </motion.div>

        {/* Filters and Tabs */}
        {/* <div className="flex flex-col gap-4">
          <StrategyTabs />
          <StrategyFilters />
        </div> */}

        {/* 
          KEY FIXES:
          - grid-cols-1 on mobile, 2 on sm, 4 on lg
          - auto-rows-fr makes ALL rows equal height
          - The wrapper div is removed — StrategyCard itself is the grid item
        */}
        <motion.div
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 3xl:gap-5 mt-8 auto-rows-fr"
>
  {strategies.map((s) => (
    <motion.div
      key={s.name}
      variants={fadeUpVariant}
      className="h-full"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <StrategyCard {...s} />
    </motion.div>
  ))}
</motion.div>
      </motion.div>

      {/* Background Glow */}
      {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none" /> */}
    </Container>
    </section>
  );
}