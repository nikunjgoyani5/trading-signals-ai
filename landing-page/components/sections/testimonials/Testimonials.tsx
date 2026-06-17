"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import { staggerContainer, fadeUpVariant } from "@/utils/animations";
import TestimonialCard from "./TestimonialCard";

import gradientBg from "@/assets/images/Gradient.png";
import Container from "@/components/common/container/Container";

/** Vimeo IDs from share links (player.vimeo.com/video/{id}) */
const TESTIMONIAL_VIMEO = {
  left1: "1192474551",
  left2: "1192474553",
  right1: "1192474554",
  right2: "1192474552",
} as const;

export default function Testimonials() {
  const { t } = useTranslation();
  const [activePlaybackId, setActivePlaybackId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isSectionInView = useInView(sectionRef, {
    amount: 0.08,
    margin: "0px 0px -48px 0px",
  });

  const effectiveActivePlaybackId = isSectionInView ? activePlaybackId : null;

  const quotes = t("testimonials.quotes", {
    returnObjects: true,
  }) as string[];

  const leftCards = [
    { vimeoVideoId: TESTIMONIAL_VIMEO.left1, quote: quotes[0] },
    { vimeoVideoId: TESTIMONIAL_VIMEO.left2, quote: quotes[2] },
  ];

  const rightCards = [
    { vimeoVideoId: TESTIMONIAL_VIMEO.right1, quote: quotes[1] },
    { vimeoVideoId: TESTIMONIAL_VIMEO.right2, quote: quotes[3] },
  ];

  return (
    <motion.section
      ref={sectionRef}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="relative w-full bg-transparent"
    >
      <div className="absolute inset-x-0 top-0 bottom-0 z-0 pointer-events-none overflow-hidden select-none">
        <Image
          src={gradientBg}
          alt=""
          fill
          priority
          className="object-cover opacity-100 scale-150 translate-y-0 brightness-125 contrast-125 saturate-150 blur-0"
        />
      </div>

      <Container className="section-py relative z-10 w-full ">
        <div
          id="testimonials"
          className="grid grid-cols-1 gap-4 scroll-mt-24 sm:scroll-mt-24 md:scroll-mt-22 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:scroll-mt-30 xl:gap-10 3xl:gap-12"
        >
          <div className="flex flex-col items-center gap-4 xl:gap-10 3xl:gap-12 order-2 lg:order-1 w-full">
            {leftCards.map((card, i) => {
              const id = `left-${i}`;
              return (
                <motion.div key={id} variants={fadeUpVariant} className="w-full flex justify-center">
                  <TestimonialCard
                    {...card}
                    playbackId={id}
                    activePlaybackId={effectiveActivePlaybackId}
                    onVideoPlay={setActivePlaybackId}
                  />
                </motion.div>
              );
            })}
          </div>

          <motion.div
            variants={fadeUpVariant}
            className="flex flex-col items-center justify-center text-center gap-1 md:gap-3 order-1 lg:order-2 md:col-span-2 lg:col-span-1 w-full mx-auto"
          >
            <div className="inline-flex items-center px-4 py-1.5 shadow-inner">
              <span className="text-[15px] font-mono tracking-widest uppercase text-vivid-cyan">
                {t("testimonials.title")}
              </span>
            </div>

            <h2 className="head-size font-medium leading-snug text-white font-hoves">
              {t("testimonials.heading")}
            </h2>

            <p className="desc-size text-white/65 leading-snug max-w-[400px] font-hoves">
              {t("testimonials.description")}
            </p>

            {/* Middle testimonial — optional
            <div className="w-full flex justify-center mt-6 flex-1 text-start">
              <TestimonialCard
                vimeoVideoId="…"
                quote={quotes[2]}
                playbackId="center"
                activePlaybackId={effectiveActivePlaybackId}
                onVideoPlay={setActivePlaybackId}
              />
            </div>
            */}
          </motion.div>

          <div className="flex flex-col items-center gap-4 xl:gap-10 3xl:gap-12 order-3 w-full">
            {rightCards.map((card, i) => {
              const id = `right-${i}`;
              return (
                <motion.div key={id} variants={fadeUpVariant} className="w-full flex justify-center">
                  <TestimonialCard
                    {...card}
                    playbackId={id}
                    activePlaybackId={effectiveActivePlaybackId}
                    onVideoPlay={setActivePlaybackId}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </motion.section>
  );
}
