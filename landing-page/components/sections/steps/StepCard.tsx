"use client";

import { LucideIcon } from "lucide-react";
import { useRef, useCallback, useContext } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { HoverContext } from "./Steps";

interface StepCardProps {
  id: string;
  step: string;
  title: string;
  description: string;
  Icon: LucideIcon;
}

const TILT_SPRING = { stiffness: 200, damping: 28, mass: 0.6 };
const LIFT_SPRING = { stiffness: 180, damping: 24, mass: 0.7 };
const GLOW_SPRING = { stiffness: 100, damping: 22 };

const PATTERN_OFFSETS: Record<string, { left: number; bottom: number }> = {
  "step-01": { left: -32, bottom: -30 },
  "step-02": { left: -28, bottom: -38 },
  "step-03": { left: -30, bottom: -32 },
};

export default function StepCard({
  id,
  step,
  title,
  description,
  Icon,
}: StepCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { hoveredId, setHoveredId } = useContext(HoverContext);
  const isHovered = hoveredId === id;
  const isDimmed = hoveredId !== null && !isHovered;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]), TILT_SPRING);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), TILT_SPRING);

  const cardY = useSpring(useMotionValue(0), LIFT_SPRING);
  const cardScale = useSpring(useMotionValue(1), LIFT_SPRING);
  const glowOpacity = useSpring(useMotionValue(0), GLOW_SPRING);
  const borderOpacity = useSpring(useMotionValue(0), GLOW_SPRING);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    rawX.set((e.clientX - left) / width - 0.5);
    rawY.set((e.clientY - top) / height - 0.5);
  }, [rawX, rawY]);

  const handleMouseEnter = useCallback(() => {
    cardY.set(-10);
    cardScale.set(1.03);
    glowOpacity.set(1);
    borderOpacity.set(1);
    setHoveredId(id);
  }, [cardY, cardScale, glowOpacity, borderOpacity, id, setHoveredId]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0); rawY.set(0);
    cardY.set(0); cardScale.set(1);
    glowOpacity.set(0); borderOpacity.set(0);
    setHoveredId(null);
  }, [rawX, rawY, cardY, cardScale, glowOpacity, borderOpacity, setHoveredId]);

  const patternOffset = PATTERN_OFFSETS[id] || { left: -28, bottom: -22 };

  return (
    <motion.div
      className="relative w-full max-w-[340px] md:max-w-[320px] lg:max-w-[330px] 3xl:max-w-[420px] isolate"
      style={{ 
        opacity: isDimmed ? 0.6 : 1, 
        scale: isDimmed ? 0.98 : 1,
        transition: "all 0.4s ease" 
      }}
    >
      {/* ── Diagonal pattern accent ── */}
      <div 
        className="absolute w-7 h-7 md:w-8 md:h-8 opacity-[0.45] pointer-events-none z-[-1]"
        style={{
          left: patternOffset.left,
          bottom: patternOffset.bottom,
          background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 4px)',
        }}
      />
      {/* ── Background Glow ── */}
      <motion.div
        className="absolute inset-[-20px] rounded-2xl blur-[40px] pointer-events-none z-0"
        style={{ opacity: glowOpacity }}
      />

      <motion.div
        ref={cardRef}
        className="relative w-full"
        style={{
          y: cardY,
          scale: cardScale,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* ── Step Badge: Forced to top with high Z-index ── */}
        <motion.div
          className="absolute -top-3 -right-2 px-5 py-2 rounded-full bg-[#0012B8] text-white text-[15px]  z-50 shadow-[0_4px_12px_rgba(0,0,0,0.5)]  tracking-widest pointer-events-none"
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? [0, -5, 5, 0] : 0 
          }}
          transition={{ duration: 0.4 }}
        >
          {step}
        </motion.div>

        {/* ── Card body ── */}
        <div className="relative flex flex-col h-full min-h-[260px] p-8 3xl:p-10 gap-8 3xl:gap-15 rounded-sm bg-white/5  shadow-2xl overflow-hidden z-10">
          
          {/* Internal Highlight on Hover */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: borderOpacity }}
          />

          {/* Icon */}
          <motion.div
            className="flex items-center justify-center w-14 h-14 3xl:w-17.5 3xl:h-17.5  bg-black/40  shadow-inner relative z-20 rounded-sm"
            animate={{ scale: isHovered ? 1.1 : 1 }}
          >
            <Icon size={26} className="text-white 3xl:h-8.5 3xl:w-8.5" />
          </motion.div>

          {/* Text content */}
          <div className="flex flex-col gap-2 relative z-20">
            <h3 className="text-white card-title-size2 font leading-tight font-hoves">
              {title}
            </h3>
            <p className="card-desc-size2 font-light text-white/70 leading-snug font-hoves">
              {description}
            </p>
          </div>
        </div>

        {/* Outer Border Glow */}
        <motion.div
          className="absolute inset-0  pointer-events-none z-30"
          style={{
            opacity: borderOpacity,
            boxShadow: "inset 0 0 0 1px rgba(99,160,255,0.5), 0 0 30px rgba(59,130,246,0.3)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}