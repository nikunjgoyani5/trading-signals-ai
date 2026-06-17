"use client";

import { Brain, Link2, SlidersHorizontal, LineChart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import FeatureCard from "./FeatureCard";
import Container from "@/components/common/container/Container";

const EASE = [0.22, 1, 0.36, 1] as const;

const headingVariant = {
  hidden: { opacity: 0, y: 25, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

const paraVariant = {
  hidden: { opacity: 0, x: 18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: EASE,
      delay,
    },
  }),
};

const cardVariantReduced = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.45, delay },
  }),
};

export default function Features() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.12 });

  const features = [
    {
      icon: Brain,
      title: t("features.cards.aiSignals.title"),
      description: t("features.cards.aiSignals.desc"),
      gradient: "/images/grad_3.png",
    },
    {
      icon: Link2,
      title: t("features.cards.multiExchange.title"),
      description: t("features.cards.multiExchange.desc"),
      gradient: "/images/gradient_4_.png",
    },
    {
      icon: SlidersHorizontal,
      title: t("features.cards.automation.title"),
      description: t("features.cards.automation.desc"),
      gradient: "/images/gradient_5_.png",
    },
    {
      icon: LineChart,
      title: t("features.cards.analytics.title"),
      description: t("features.cards.analytics.desc"),
      gradient: "/images/gradient_6_.png",
    },
  ];

  const stagger = (i: number) => i * 0.08;
  const cv = shouldReduceMotion ? cardVariantReduced : cardVariant;

  return (
    <section
    ref={sectionRef}
    style={{
      overflowBlock:"hidden"
      }}
      className="bg-[#010B24] section-pt section-pb relative"
    >
      <Container>
      <div className="w-full relative z-10">
            <div className="inline-flex items-center mb-2.5 md:mb-3  shadow-inner">
              <span className="text-[15px] font-mono font-medium tracking-widest uppercase text-vivid-cyan">
                {t("features.title")}
              </span>
            </div>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-1.5 md:gap-4 lg:gap-20 mb-10 sm:mb-12 md:mb-16">
          <motion.div
            className="flex flex-col items-start gap-2.5 md:gap-3"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={headingVariant}
          >

            <h2 className="head-size text-white leading-tight md:leading-[1.15] font-hoves max-w-[520px]">
              {t("features.heading")}
            </h2>
          </motion.div>

          <motion.div
            className="lg:max-w-120 lg:mb-2 flex-shrink-0"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={paraVariant}
          >
            <p className="desc-size text-white/50 leading-relaxed font-hoves">
              {t("features.description")}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={
                i === 0 || i === 3
                  ? "md:col-span-5 h-full"
                  : "md:col-span-7 h-full"
              }
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cv}
              custom={stagger(i)}
            >
              <FeatureCard {...features[i]} />
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
    </section>
  );
}