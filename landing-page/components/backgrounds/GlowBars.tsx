"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import glowBar from "@/assets/images/glowBars.png";
import { RefObject } from "react";

interface GlowBarsProps {
  targetRef: RefObject<HTMLDivElement | null>;
}

export default function GlowBars({ targetRef }: GlowBarsProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  // Calculate dynamic movement based on screen width
  const yMove = useTransform(scrollYProgress, (value) => {
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    
    // Default range (Desktop)
    let range = [-350, -100];
    
    if (isMobile) {
      range = [0, 900];
    } else if (isTablet) {
      range = [-650, 400];
    }
    
    return value * (range[1] - range[0]) + range[0];
  });

  const smoothY = useSpring(yMove, {
    stiffness: 70,
    damping: 25,
    mass: 0.5,
  });

  return (
    <motion.div
      className="absolute inset-x-0 top-0 mx-auto h-[230vh] w-full max-w-[1400px] pointer-events-none z-[8]"
      style={{ y: smoothY }}
    >
      <Image
        src={glowBar}
        alt=""
        fill
        priority
        sizes="(max-width: 1400px) 100vw, 1400px"
        className="object-contain"
        style={{ mixBlendMode: "screen" }}
      />
    </motion.div>
  );
}
