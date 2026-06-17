// components/GetAccessButton.tsx
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  children: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
}

export default function GetAccessButton({
  children, href, onClick, icon, className = "",
}: Props) {
  const inner = (
    <>
      <div className="get-access-glow outter" />
      <div className="get-access-glow inner" />
      <div className="get-access-btn-bg" />

      <p
        className="relative z-10 m-0 text-white font-semibold
                   text-[15px] tracking-[-0.01em] whitespace-nowrap"
        style={{ fontFamily: "var(--font-hoves)" }}
      >
        {children}
      </p>

      {icon && (
        <div className="relative z-10 text-white inline-flex items-center">
          {icon}
        </div>
      )}
    </>
  );

  const base = [
    "get-access-btn",                          // carries all the CSS above
    "relative flex items-center justify-center",
    "gap-2 rounded-[99px] px-7 py-5",
    "cursor-pointer no-underline",
    "outline-none focus:outline-none",         // matches a:active, a:hover { outline: 0 }
    className,
  ].join(" ");

  const style = { backgroundColor: "#ffffff0d" } as const;

  return href ? (
    <Link href={href} className={base} style={style}>{inner}</Link>
  ) : (
    <button onClick={onClick} className={base} style={style}>{inner}</button>
  );
}