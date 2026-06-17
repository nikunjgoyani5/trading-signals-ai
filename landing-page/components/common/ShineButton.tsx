// components/ShineButton.tsx
import Link from "next/link";
import { ReactNode } from "react";

interface ShineButtonProps {
  children: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
}

function ShineTextStack({ text }: { text: string }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center w-min h-min z-[3]"
      style={{
        color: "#adb1b8",
        fontWeight: 500,
        lineHeight: "1.7em",
        fontFamily: "inherit",
      }}
    >
      {/* Layer 1 — dim base, always visible */}
      <div className="select-none">
        <p className="whitespace-nowrap text-[#adb1b8]" style={{ margin: 0 }}>
          {text}
        </p>
      </div>

      {/* Layer 2 — blur 3px + shine, white */}
      <div
        className="shine absolute select-none rounded-full"
        style={{
          zIndex: 1,
          filter: "blur(3px)",
          top: "51%", left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <p className="whitespace-nowrap text-white" style={{ margin: 0 }}>
          {text}
        </p>
      </div>

      {/* Layer 3 — blur 6px + shine, white */}
      <div
        className="shine absolute select-none rounded-full"
        style={{
          zIndex: 1,
          filter: "blur(5px)",
          top: "51%", left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <p className="whitespace-nowrap text-white" style={{ margin: 0 }}>
          {text}
        </p>
      </div>

      {/* Layer 4 — no blur + shine, #c7c7c7 — crisp top layer */}
      <div
        className="shine absolute select-none"
        style={{
          zIndex: 2,
          top: "51%", left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <p className="whitespace-nowrap" style={{ color: "#c7c7c7", margin: 0 }}>
          {text}
        </p>
      </div>
    </div>
  );
}

export default function ShineButton({
  children,
  href,
  onClick,
  icon,
  className = "",
}: ShineButtonProps) {
  const inner = (
    <>
      {/* BG Layer 1 — dark gray base fill */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ backgroundColor: "#3c3f44" }}
      />

      {/* BG Layer 2 — lighter gray with shine sweep = the glowing border */}
      <div
        className="shine absolute inset-0 overflow-hidden"
        style={{ backgroundColor: "#9b9999" }}
      />

      {/* BG Layer 3 — near-black inner pill, 1px inset → exposes 1px border */}
      <div
        className="absolute overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: "#010203",
          borderRadius: "99px",
          inset: "1px",
        }}
      />

      {/* Icon */}
      {icon && (
        <div
          className="relative z-[3] flex-shrink-0"
          style={{ color: "#b6b6b9" }}
        >
          {icon}
        </div>
      )}

      {/* 4-layer shine text */}
      <ShineTextStack text={children} />
    </>
  );

    const sharedClass = [
    "relative flex items-center justify-center overflow-hidden font-hoves",
    "rounded-full transition-all duration-200",
    "px-6 py-3.5 md:px-8 md:py-4.5",
    "cursor-pointer no-underline",
    "hover:scale-[1.03] active:scale-[0.98]",
    className,
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={sharedClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={sharedClass}>
      {inner}
    </button>
  );
}