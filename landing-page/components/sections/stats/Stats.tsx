"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  AnimatePresence,
} from "framer-motion";

import glowBar1 from "@/assets/images/glowBar1.png";
import glowBar2 from "@/assets/images/glowBar2.png";
import NoiseOverlay from "@/components/NoiseOverlay";
import Steps from "../steps/Steps";
import RocketParticles from "./RocketParticles";
import StatsCounter from "./StatsCounter";

// Animation constants
const ANIMATION_DURATION = 1;

export interface StatConfig {
  prefix?: string;
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  delay: number;
}

export default function Stats() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const leftRocketEmitterOneRef = useRef<HTMLDivElement>(null);
  const leftRocketEmitterTwoRef = useRef<HTMLDivElement>(null);
  const rightRocketEmitterOneRef = useRef<HTMLDivElement>(null);
  const rightRocketEmitterTwoRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(statsRef, { once: true, amount: 0.5 });

  const [leftRocketPhase, setLeftRocketPhase] = useState<
    "launch" | "return" | "idle"
  >("launch");
  const [rightRocketPhase, setRightRocketPhase] = useState<
    "launch" | "return" | "idle"
  >("launch");
  const [showParticles, setShowParticles] = useState(true);
  const [isFadingParticles, setIsFadingParticles] = useState(false);

  // Scroll-based parallax calculation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const mouseTranslateY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position (-0.5 to 0.5)
      const relativeY = e.clientY / window.innerHeight - 0.5;
      // Map to a Â±60px range of vertical influence
      mouseTranslateY.set(relativeY * 120);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseTranslateY]);

  // Transform scroll progress to vertical offset (-120px to 120px)
  const scrollTranslateY = useTransform(scrollYProgress, [0, 1], [-120, 120]);

  // Combine scroll and mouse movement into one value
  const combinedY = useTransform(
    [scrollTranslateY, mouseTranslateY],
    ([scroll, mouse]) => (scroll as number) + (mouse as number)
  );

  // Apply spring smoothing for a premium feel
  const smoothY = useSpring(combinedY, {
    stiffness: 40,
    damping: 25,
    mass: 0.5,
  });

  // Stat definitions with proper formatting
  const stats: StatConfig[] = useMemo(
    () => [
      {
        value: 1250,
        suffix: "+",
        label: t("stats.registeredUsers"),
        delay: 0,
      },
      {
        prefix: "$",
        value: 4.5,
        suffix: "M",
        decimals: 1,
        label: t("stats.aum"),
        delay: ANIMATION_DURATION * 0.1,
      },
      {
        prefix: "$",
        value: 12,
        suffix: "M",
        label: t("stats.totalPnl"),
        delay: ANIMATION_DURATION * 0.2,
      },
    ],
    [t]
  );

  return (
    <section
      ref={sectionRef}
      className="w-full relative section-pt overflow-hidden"
    >
      <Steps />
      <NoiseOverlay />

      {/* Rockets + Particles with Interactive Motion */}
      <motion.div
        className="absolute top-0 inset-0 mx-auto pointer-events-none lg:max-w-300 max-w-200 3xl:min-w-328"
        style={{
          zIndex: 1,
          y: smoothY,
        }}
      >
        <div className="relative h-full">
          {/* LEFT ROCKET */}
          <motion.div
            className="absolute bottom-0 left-0 w-full h-full max-w-24 sm:max-w-35 lg:max-w-40 xl:max-w-50 z-10 flex items-end"
            animate={
              isInView && leftRocketPhase === "launch"
                ? {
                    x: [0, -1, 1, -1, 1, 0],
                    y: ["0%", "-150%"],
                  }
                : leftRocketPhase === "return"
                ? {
                    x: [0, -0.5, 0.5, -0.5, 0.5, 0],
                    y: ["150%", "0%"],
                    filter: ["blur(8px)", "blur(0px)"],
                  }
                : {}
            }
            transition={
              leftRocketPhase === "launch"
                ? {
                    x: {
                      duration: 0.4,
                      ease: "easeInOut",
                      repeat: 3,
                      repeatType: "reverse",
                    },
                    y: {
                      duration: 5,
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: 1.2,
                    },
                  }
                : leftRocketPhase === "return"
                ? {
                    x: {
                      duration: 0.4,
                      ease: "easeInOut",
                      repeat: 3,
                      repeatType: "reverse",
                    },
                    y: {
                      duration: 4,
                      ease: [0.25, 0.1, 0.25, 1],
                    },
                    filter: {
                      duration: 4,
                      ease: "easeOut",
                    },
                  }
                : {}
            }
            onAnimationComplete={() => {
              if (leftRocketPhase === "launch") {
                setLeftRocketPhase("return");
              } else if (leftRocketPhase === "return") {
                setLeftRocketPhase("idle");
                if (rightRocketPhase === "idle") {
                  setIsFadingParticles(true);
                  setTimeout(() => {
                    setShowParticles(false);
                  }, 2000);
                }
              }
            }}
          >
            <div className="max-h-65 sm:max-h-75 lg:max-h-120 xl:max-h-150 mb-28 md:mb-75 lg:mb-50 relative w-full h-full">
              <div
                ref={leftRocketEmitterOneRef}
                className="absolute top-80 w-2 h-2 left-16"
              />
              <div
                ref={leftRocketEmitterTwoRef}
                className="absolute top-90 w-2 h-2 right-15"
              />
              <Image
                src={glowBar1}
                alt=""
                fill
                sizes="(max-width: 640px) 96px, (max-width: 768px) 140px, (max-width: 1280px) 180px, 200px"
                className="max-h-150"
                style={{ mixBlendMode: "screen" }}
                priority
              />
            </div>
          </motion.div>

          {/* RIGHT ROCKET */}
          <motion.div
            className="absolute right-0 w-full h-full max-w-24 sm:max-w-35 lg:max-w-40 xl:max-w-50 z-10 flex items-end"
            animate={
              isInView && rightRocketPhase === "launch"
                ? {
                    x: [0, 1, -1, 1, -1, 0],
                    y: ["0%", "-140%"],
                  }
                : rightRocketPhase === "return"
                ? {
                    x: [0, 0.5, -0.5, 0.5, -0.5, 0],
                    y: ["140%", "0%"],
                    filter: ["blur(8px)", "blur(0px)"],
                  }
                : {}
            }
            transition={
              rightRocketPhase === "launch"
                ? {
                    x: {
                      duration: 0.4,
                      ease: "easeInOut",
                      repeat: 3,
                      repeatType: "reverse",
                      delay: 0.1,
                    },
                    y: {
                      duration: 5,
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: 1.3,
                    },
                  }
                : rightRocketPhase === "return"
                ? {
                    x: {
                      duration: 0.4,
                      ease: "easeInOut",
                      repeat: 3,
                      repeatType: "reverse",
                      delay: 0.1,
                    },
                    y: {
                      duration: 4,
                      ease: [0.25, 0.1, 0.25, 1],
                    },
                    filter: {
                      duration: 4,
                      ease: "easeOut",
                    },
                  }
                : {}
            }
            onAnimationComplete={() => {
              if (rightRocketPhase === "launch") {
                setRightRocketPhase("return");
              } else if (rightRocketPhase === "return") {
                setRightRocketPhase("idle");
                if (leftRocketPhase === "idle") {
                  setIsFadingParticles(true);
                  setTimeout(() => {
                    setShowParticles(false);
                  }, 2000);
                }
              }
            }}
          >
            <div className="max-h-65 sm:max-h-75 lg:max-h-120 xl:max-h-150 mb-18 md:mb-60 lg:mb-18 relative w-full h-full">
              <div
                ref={rightRocketEmitterOneRef}
                className="absolute top-80 w-2 h-2 right-25"
              />
              <div
                ref={rightRocketEmitterTwoRef}
                className="absolute top-90 w-2 h-2 left-16"
              />
              <Image
                src={glowBar2}
                alt=""
                fill
                sizes="(max-width: 640px) 96px, (max-width: 768px) 140px, (max-width: 1280px) 180px, 200px"
                className="max-h-150"
                style={{ mixBlendMode: "screen" }}
                priority
              />
            </div>
          </motion.div>

          <AnimatePresence>
            {showParticles && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isFadingParticles ? 0 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                <RocketParticles anchorRef={leftRocketEmitterOneRef} />
                <RocketParticles anchorRef={leftRocketEmitterTwoRef} />
                <RocketParticles anchorRef={rightRocketEmitterOneRef} />
                <RocketParticles anchorRef={rightRocketEmitterTwoRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Stats Content */}
      <div
        ref={statsRef}
        className="grid md:grid-cols-3 items-center justify-center py-20 md:py-40 xl:py-50 relative sm:mt-10 max-w-2xl lg:max-w-3xl 3xl:max-w-4xl mx-auto  gap-12 3xl:gap-30"
        style={{ zIndex: 2 }}
      >
        <StatsCounter stats={stats} start={isInView} />
      </div>
    </section>
  );
}