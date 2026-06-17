// components/ShineText.tsx
import React from "react";

type ShineTextAs = "h1" | "h2" | "h3" | "h4" | "p" | "div";

interface ShineTextProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  /** Semantic tag for the primary (visible) text layer. Decorative layers are aria-hidden. */
  as?: ShineTextAs;
}

export default function ShineText({
  children,
  className = "",
  style,
  as = "div",
}: ShineTextProps) {
  const Tag = as;

  const baseStyle: React.CSSProperties = {
    fontFamily: "var(--font-hoves)",
    lineHeight: "1.3",
    textAlign: "center",
    margin: 0,
    ...style,
  };

  return (
    <div
      className={`grid grid-cols-1 grid-rows-1 place-items-center w-full font-medium ${className}`}
      style={{ color: "#adb1b8" }}
    >
      {/* Layer 1 — base text, exposed to assistive tech */}
      <div className="select-none" style={{ gridArea: "1/1" }}>
        <Tag style={{ ...baseStyle, color: "#f9f9f9" }}>{children}</Tag>
      </div>

      {/* Layers 2–4 — visual-only duplicates */}
      <div
        className="select-none pointer-events-none"
        aria-hidden
        style={{
          gridArea: "1/1",
          zIndex: 1,
          filter: "blur(4px)",
        }}
      >
        <p className="shine m-0" style={{ ...baseStyle, color: "#f9f9f9" }}>
          {children}
        </p>
      </div>

      <div
        className="select-none pointer-events-none"
        aria-hidden
        style={{
          gridArea: "1/1",
          zIndex: 1,
          filter: "blur(8px)",
        }}
      >
        <p className="shine m-0" style={{ ...baseStyle, color: "#c7c7c7" }}>
          {children}
        </p>
      </div>

      <div
        className="select-none pointer-events-none"
        aria-hidden
        style={{
          gridArea: "1/1",
          zIndex: 2,
        }}
      >
        <p className="shine m-0" style={{ ...baseStyle, color: "#c7c7c7" }}>
          {children}
        </p>
      </div>
    </div>
  );
}
