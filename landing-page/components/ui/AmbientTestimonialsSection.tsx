"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Testimonials from "../sections/testimonials/Testimonials";
import ExchangePartners from "../sections/crypto/Exchangepartners";
import CTA from "../sections/cta/CTA";

export default function AmbientTestimonialsSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.1 });

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-[#010B24] w-full z-20">
      {/* ── AMBIENT BACKGROUND LAYERS (Cyan Theme) ── */}
      {isInView && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">

        {/* Primary Cyan Glow (Matched Strength) */}
        <motion.div
          // animate={{
          //   scale: [1, 1.2, 1],
          //   x: [0, -30, 0],
          //   y: [0, 40, 0],
          //   opacity: [0.28, 0.46, 0.28],
          // }}
          // transition={{
          //   duration: 14,
          //   repeat: Infinity,
          //   ease: "easeInOut",
          // }}
          className="absolute -left-250 top-[30%] w-300 h-300 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, #00F0FF 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />

        {/* Secondary Cyan Bloom (Matched Strength) */}
        {/* <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.22, 0.36, 0.22],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -left-[15%] top-[30%] w-[75%] h-[60%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,240,255,0.1) 0%, transparent 75%)",
            filter: "blur(140px)",
          }}
        /> */}

        {/* Deep Blue Complementary Glow */}
        {/* <motion.div
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
              "radial-gradient(ellipse at center, #0012B8 0%, transparent 70%)",
            filter: "blur(140px)",
          }}
        /> */}

        {/* Vivid Cyan Core Pulse */}
        {/* <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.20, 0.34, 0.20],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute left-[8%] bottom-[12%] w-[38%] h-[28%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,240,255,0.2) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        /> */}
      </div>
      )}

      {/* ── CONTENT ── */}
      <div className="relative flex flex-col items-center z-10">
        {/* <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-titan-white mb-4">
            What Our Users Are Saying
          </h2>
          <p className="text-seashell-blue text-lg md:text-xl max-w-2xl mx-auto">
            Real feedback from traders who have transformed their strategies with our AI signals.
          </p>
        </div> */}
        <ExchangePartners />
        <Testimonials />
         <CTA />
      </div>
    </div>
  );
}