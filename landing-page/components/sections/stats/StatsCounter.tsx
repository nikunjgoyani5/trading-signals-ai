"use client";

import { memo, useEffect, useState } from "react";

interface StatConfig {
  prefix?: string;
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  delay: number;
}

interface StatsCounterProps {
  stats: StatConfig[];
  start: boolean;
}

const COUNTER_DURATION_MS = 1200;

const formatValue = (stat: StatConfig, rawValue: number): string => {
  let formattedValue: string;

  if (typeof stat.decimals === "number") {
    // Keep decimal width stable (e.g. 0.0 -> 4.5)
    formattedValue = rawValue.toFixed(stat.decimals);
  } else {
    const targetInteger = Math.floor(stat.value);
    const currentInteger = Math.floor(rawValue);
    const targetDigits = String(targetInteger).length;
    const isFinished = currentInteger >= targetInteger;

    // Keep integer width stable while animating (e.g. 00 -> 12)
    formattedValue = isFinished
      ? targetInteger.toLocaleString()
      : String(Math.max(0, currentInteger)).padStart(targetDigits, "0");
  }

  return `${stat.prefix ?? ""}${formattedValue}${stat.suffix ?? ""}`;
};

function AnimatedStatValue({
  stat,
  start,
}: {
  stat: StatConfig;
  start: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const { value, delay } = stat;

  useEffect(() => {
    if (!start) return;

    let frameId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const startedAt = performance.now();
    const delayMs = delay * 1000;

    const animate = (now: number) => {
      const elapsed = now - startedAt;
      const elapsedAfterDelay = Math.max(0, elapsed - delayMs);
      const progress = Math.min(1, elapsedAfterDelay / COUNTER_DURATION_MS);
      const nextValue = value * progress;

      setDisplayValue(nextValue);
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    timeoutId = setTimeout(() => {
      frameId = requestAnimationFrame(animate);
    }, delayMs);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [start, value, delay]);

  return <>{formatValue(stat, start ? displayValue : 0)}</>;
}

function StatsCounter({ stats, start }: StatsCounterProps) {
  return (
    <>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="flex flex-col md:flex-row items-center relative z-1 justify-center"
        >
          {/* {i > 0 && (
            <div className="w-16 h-px md:w-px md:h-[44px] my-6 md:my-0 md:mx-[60px] shrink-0 bg-white/20" />
          )} */}

          <div className="flex flex-col items-center text-center">
            <span
              className="text-4xl md:text-5xl lg:text-6xl 3xl:text-7xl text-white tracking-[-0.5px] leading-[1.1] font-light"
              style={{ fontFamily: "var(--font-hoves)" }}
            >
              <AnimatedStatValue stat={stat} start={start} />
            </span>

            <span
              className="text-xs md:text-[14px] 3xl:text-lg text-white/70 mt-2 md:mt-[10px] whitespace-nowrap"
              style={{ fontFamily: "var(--font-hoves)" }}
            >
              {stat.label}
            </span>
          </div>
        </div>
      ))}

      <div
        className="absolute inset-0 pointer-events-none w-100 sm:w-130 xl:w-150 h-100 sm:h-130 xl:h-150 top-1/2 -translate-1/2 left-1/2"
        style={{
          zIndex: 0,
          background: `radial-gradient(
            ellipse 80% 60% at 50% 50%,
            rgba(0, 18, 184, 0.50) 0%,
            rgba(0, 18, 184, 0.25) 30%,
            rgba(0, 18, 184, 0.08) 55%,
            transparent 70%
          )`,
        }}
      />
    </>
  );
}

export default memo(StatsCounter);
