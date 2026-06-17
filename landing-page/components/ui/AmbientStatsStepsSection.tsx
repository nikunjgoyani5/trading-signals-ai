"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Steps from "../sections/steps/Steps";
import Stats from "../sections/stats/Stats";
import GlowBars from "../backgrounds/GlowBars";

export default function AmbientStatsStepsSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapperRef}
      className="relative overflow-visible bg-[#010B24] w-full"
    >
      {/* ── EXISTING AMBIENT BACKGROUND LAYERS (UNCHANGED) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
        
        {/* Primary Cyan Glow (Main Atmosphere) */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 40, 0],
            y: [0, -20, 0],
            opacity: [0.28, 0.46, 0.28],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-[40%] top-[30%] w-[80%] h-[60%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, #00F0FF 0%, transparent 70%)",
            filter: "blur(110px)",
          }}
        />

        {/* Secondary Cyan Drift (Mid-Section Blend) */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, 40, 0],
            opacity: [0.22, 0.36, 0.22],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -right-[15%] top-[40%] w-[70%] h-[50%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0, 240, 255, 0.1) 0%, transparent 65%)",
            filter: "blur(130px)",
          }}
        />

        {/* Deep Blue Complementary Glow */}
        <motion.div
          animate={{
            opacity: [0.16, 0.28, 0.16],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[30%] top-[10%] w-[60%] h-[40%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, #0012B8 0%, transparent 70%)",
            filter: "blur(140px)",
          }}
        />

        {/* Vivid Cyan Core Pulse */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.2, 0.34, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute left-[5%] bottom-[10%] w-[40%] h-[30%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0, 240, 255, 0.2) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* ── NEW SHARED GLOWBARS LAYER ── */}
      <GlowBars targetRef={wrapperRef} />

      {/* ── CONTENT SECTIONS ── */}
      <div className="relative z-10">
        <Steps />
        <Stats />
      </div>
    </div>
  );
}