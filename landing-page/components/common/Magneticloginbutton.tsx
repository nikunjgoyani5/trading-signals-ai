"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useTranslation } from "react-i18next";

export default function MagneticLoginButton({ href }: { href: string }) {
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // ── Snappier Spring for the "Flip" feel ──
  const springConfig = { stiffness: 60, damping: 20, mass: 1 };
  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);

  // ── The "Flip" Logic ──
  // rotateY creates the horizontal flipping effect (limited to 12 degrees)
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  // rotateX creates a very slight vertical tilt
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  
  // Minimal sliding movement
  const translateX = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(nx);
    rawY.set(ny);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        x: translateX,
        rotateY,
        rotateX,
        perspective: 800, // Necessary for the 3D "flip" depth
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="relative inline-flex items-center justify-center"
    >
      <Link
        href={href}
        className="relative inline-flex items-center justify-center px-6 py-2.5 rounded-full group overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10"
      >
        {/* ── THE SHARP BEAM ── */}
        <motion.div
          initial={{ x: "-180%", skewX: -25 }}
          animate={{ x: "180%" }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
            repeatDelay: 1.5,
          }}
          className="absolute inset-y-0 w-12 pointer-events-none z-10"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
            boxShadow: "0 0 25px rgba(255,255,255,0.3)",
          }}
        />

        {/* ── Text with "Zero" magnetism (it stays fixed to the button face) ── */}
        <span className="relative z-20 text-sm font-medium tracking-wide text-white font-hoves whitespace-nowrap">
          {t("navbar.login")}
        </span>

        {/* ── Internal Glow ── */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </Link>
    </motion.div>
  );
}