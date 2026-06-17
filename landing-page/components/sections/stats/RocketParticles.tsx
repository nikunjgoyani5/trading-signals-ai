"use client";

import { motion } from "framer-motion";
import { RefObject, useEffect, useRef, useState } from "react";

interface Props {
  anchorRef: RefObject<HTMLElement | null>;
}

interface Particle {
  id: number;
  startX: number;
  startY: number;
  size: number;
  duration: number;
  fallY: number;
  spreadFactor: number;
}

export default function RocketParticles({ anchorRef }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<Set<number>>(new Set());
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const spawnParticle = () => {
      const anchorEl = anchorRef.current;
      const hostEl = hostRef.current;
      if (!anchorEl || !hostEl) return;

      const anchorRect = anchorEl.getBoundingClientRect();
      const hostRect = hostEl.getBoundingClientRect();

      const startX = anchorRect.left - hostRect.left + anchorRect.width / 2;

      const startY = anchorRect.top - hostRect.top + anchorRect.height / 2;

      // ✅ keep your original speed
      const duration = 2.4 + Math.random() * 1.6;
      const fallY = Math.random() * 230 + 260;

      const particle: Particle = {
        id: Date.now() + Math.random(),
        startX,
        startY,
        size: Math.random() * 4 + 2,
        duration,
        fallY,

        // controls horizontal position inside triangle
        spreadFactor: Math.random() * 2 - 1, // -1 to 1
      };

      setParticles((prev) => [...prev.slice(-30), particle]);

      const timeoutId = window.setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== particle.id));
        timersRef.current.delete(timeoutId);
      }, duration * 1000 + 120);

      timersRef.current.add(timeoutId);
    };

    const intervalId = window.setInterval(spawnParticle, 200);

    return () => {
      window.clearInterval(intervalId);
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current.clear();
    };
  }, [anchorRef]);

  return (
    <div ref={hostRef} className="absolute inset-0 pointer-events-none z-0">
      {particles.map((p) => {
        const maxWidth = 180; // width of triangle bottom

        return (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background:
                "radial-gradient(circle, #ffffff 0%, #c084fc 30%, #9f53f7 60%, transparent 100%)",
              filter: "blur(1.5px)",
            }}
            initial={{
              x: p.startX,
              y: p.startY,
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              // ✅ same vertical motion as before
              y: p.startY + p.fallY,

              // ✅ triangle widening (no speed change)
              x: p.startX + p.spreadFactor * maxWidth,

              opacity: [0, 1, 0],
              scale: [0.8, 1, 0.6],
            }}
            transition={{
              duration: p.duration, // unchanged
              ease: "easeOut", // unchanged
            }}
          />
        );
      })}
    </div>
  );
}