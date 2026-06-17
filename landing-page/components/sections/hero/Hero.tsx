"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Container from "@/components/common/container/Container";
import HeroChart from "./HeroChart";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpVariant } from "@/utils/animations";
import Aurora from "@/components/backgrounds/Aurora";

import userslabel from "@/assets/images/avatars.png";
import ShineText from "@/components/common/ShineText";
import GetAccessButton from "@/components/common/GetAccessButton";

const PARTICLES = Array.from({ length: 111 }).map((_, i) => ({
  id: i,
  side: i % 2 === 0 ? "left" : "right",
  left: i % 2 === 0 ? -10 + Math.random() * 20 : undefined,
  right: i % 2 !== 0 ? 400 + Math.random() * 150 : undefined,
  y: -15 + Math.random() * 1,
  s: 1.5 + Math.random() * 3,
  o: 0.3 + Math.random() * 0.4,
  dur: 7 + Math.random() * 50,
  del: -(Math.random() * 8),
}));

export default function Hero() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full  pt-30 md:pt-32  overflow-hidden bg-[#010B24]">
      <style>{`
        @keyframes particle-fall-left {
          0% { transform: translate3d(0,0,0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate3d(40px,110vh,0); opacity: 0; }
        }

        @keyframes particle-fall-right {
          0% { transform: translate3d(0,0,0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate3d(-40px,110vh,0); opacity: 0; }
        }
      `}</style>

      {/* PURE OGL AURORA BACKGROUND */}
      <div className="absolute inset-x-0 -top-40 h-[140%] z-0 pointer-events-none">
        <Aurora
          // colorStops={["#000C8A", "#00A8B8", "#0016C4"]}
          colorStops={["#0012B8", "#00c8ff", "#0020FF"]}
          speed={0.45}
          amplitude={1.25}
        />
      </div>

      {/* Soft Dark Overlay */}
      <div className="absolute inset-0 z-[1] bg-[#010B24]/30 pointer-events-none" />

      {/* Extra Glow Layer - Optimized with elliptical gradients to prevent sharp edge clipping */}
      <div className="absolute inset-0 z-[2] pointer-events-none transform-gpu">
        <div className="absolute -top-[10%] left-[10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.12)_0%,transparent_75%)]" />
        <div className="absolute top-[20%] right-[0%] w-[45%] h-[45%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,18,184,0.22)_0%,transparent_75%)]" />
        <div className="absolute bottom-[0%] left-[20%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.06)_0%,transparent_75%)]" />
      </div>

      {/* PARTICLES */}
      {/* <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {mounted &&
          PARTICLES.map((p) => {
            const animName =
              p.side === "left"
                ? "particle-fall-left"
                : "particle-fall-right";

            return (
              <div
                key={p.id}
                className="absolute rounded-full opacity-0"
                style={{
                  left: p.left !== undefined ? `${p.left}%` : undefined,
                  right: p.right !== undefined ? `${p.right}px` : undefined,
                  top: `${p.y}%`,
                  width: `${p.s}px`,
                  height: `${p.s}px`,
                  backgroundColor: `rgba(255,255,255,${p.o})`,
                  animationName: animName,
                  animationDuration: `${p.dur}s`,
                  animationTimingFunction: "linear",
                  animationDelay: `${p.del}s`,
                  animationIterationCount: "infinite",
                }}
              />
            );
          })}
      </div> */}

      {/* CONTENT */}
      <Container className="relative z-20 flex flex-col items-center text-center transform-gpu">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col items-center gap-1 md:gap-1 w-full"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUpVariant}
            className="flex items-center gap-2 md:gap-2.5 px-3 py-1 md:px-5 md:py-2.5 uppercase mb-2 sm:mb-2 max-w-[90vw]"
          >
            <Image
              src={userslabel}
              alt="Users"
              width={100}
              height={28}
              className="h-4 md:h-6 w-auto shrink-0"
            />

            <span className="text-[17px] text-white leading-0.5 font-hoves">
              {t("hero.users")}
            </span>
          </motion.div>

          {/* Title */}
          <motion.div
            variants={fadeUpVariant}
            className="w-full flex justify-center"
          >
            <ShineText
              as="h1"
              className="text-2xl sm:text-3xl md:text-5xl lg:text-[50px] max-w-[650px] font-hoves"
            >
              {t("hero.title")}
            </ShineText>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUpVariant}
            className="text-white sm:text-sm text-xs md:text-lg leading-relaxed max-w-[640px] px-2 md:px-0 py-4 font-hoves"
          >
            {t("hero.description")}
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUpVariant}>
            <GetAccessButton
              onClick={() => {
                window.location.href = "https://crypto.tradingsignals.ai/login";
              }}
            >
              {t("hero.cta")}
            </GetAccessButton>
          </motion.div>

          {/* Chart */}
          <motion.div
            variants={fadeUpVariant}
            className="w-full mt-10 md:mt-12 flex justify-center"
          >
            <HeroChart videoId="landing-hero-main" />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}