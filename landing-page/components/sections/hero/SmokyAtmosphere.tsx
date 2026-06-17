"use client";
import { useEffect, useRef, useState } from "react";

const COLORS: [number, number, number][] = [
  [0, 18, 184],   // #0012B8 deep blue
  [0, 240, 255],  // #00F0FF vivid cyan
  [0, 80, 220],   // mid blue
  [40, 10, 210],  // blue-violet haze
  [0, 180, 255],  // sky cyan
];

function rand(a: number, b: number) { return a + Math.random() * (b - a); }

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function opacityCurve(t: number) {
  if (t < 0.2) return t / 0.2; // Fade in
  if (t > 0.8) return 1 - (t - 0.8) / 0.2; // Fade out
  return 1;
}

interface BlobState {
  el: HTMLDivElement;
  startX: number; startY: number;
  endX: number;   endY: number;
  startScale: number; endScale: number;
  rotation: number; rotEnd: number;
  startMs: number;
  duration: number;
}

function createBlobEl(container: HTMLElement, W: number, H: number, initial: boolean): BlobState {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const [r, g, b] = color;

  const bw = rand(W * 0.4, W * 0.7); // Very large width
  const bh = rand(H * 0.3, H * 0.5); // Large height
  const opacity = rand(0.15, 0.35);  // Subtle but visible
  const blur = rand(120, 200);      // High blur for "smoke" look

  // Start anywhere, even off-screen
  const startX = rand(-bw, W);
  const startY = rand(-bh, H);

  // Travel significantly across the section
  const travelDistX = rand(W * 0.4, W * 0.8) * (Math.random() > 0.5 ? 1 : -1);
  const travelDistY = rand(H * 0.3, H * 0.6) * (Math.random() > 0.5 ? 1 : -1);
  const endX = startX + travelDistX;
  const endY = startY + travelDistY;

  const duration = rand(18000, 35000);
  const startScale = rand(0.8, 1.2);
  const endScale = rand(1.3, 2.2);
  const rotation = rand(0, 360);
  const rotEnd = rotation + rand(-60, 60);

  const startMs = performance.now() + (initial ? -rand(0, duration) : 0);

  const el = document.createElement("div");
  el.style.cssText = `
    position: absolute;
    border-radius: 50%;
    width: ${bw}px;
    height: ${bh}px;
    background: radial-gradient(ellipse at center, rgba(${r},${g},${b},${opacity}) 0%, transparent 75%);
    filter: blur(${blur}px);
    mix-blend-mode: screen;
    opacity: 0;
    pointer-events: none;
    will-change: transform, opacity;
  `;
  container.appendChild(el);

  return { el, startX, startY, endX, endY, startScale, endScale, rotation, rotEnd, startMs, duration };
}

export default function SmokyAtmosphere() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let W = wrap.offsetWidth;
    let H = wrap.offsetHeight;

    let blobs: BlobState[] = Array.from({ length: 9 }, () => createBlobEl(wrap, W, H, true));

    const frame = (now: number) => {
      blobs = blobs.map(blob => {
        const raw = (now - blob.startMs) / blob.duration;
        if (raw >= 1) {
          blob.el.remove();
          return createBlobEl(wrap, W, H, false);
        }

        const t = Math.max(0, Math.min(1, raw));
        const et = easeInOutCubic(t);
        const x = blob.startX + (blob.endX - blob.startX) * et;
        const y = blob.startY + (blob.endY - blob.startY) * et;
        const sc = blob.startScale + (blob.endScale - blob.startScale) * et;
        const rot = blob.rotation + (blob.rotEnd - blob.rotation) * et;
        
        blob.el.style.transform = `translate(${x}px, ${y}px) scale(${sc}) rotate(${rot}deg)`;
        blob.el.style.opacity = String(opacityCurve(t));
        
        return blob;
      });
      requestAnimationFrame(frame);
    };

    const handleResize = () => {
      W = wrap.offsetWidth;
      H = wrap.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    const raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      blobs.forEach(b => b.el.remove());
    };
  }, []);

  return <div ref={wrapRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden" />;
}