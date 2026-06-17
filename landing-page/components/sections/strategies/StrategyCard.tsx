"use client";

import Image, { StaticImageData } from "next/image";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface StrategyCardProps {
  icon: StaticImageData | string;
  name: string;
  description: string;
  roi: string;
  price: string;
}

export default function StrategyCard({
  icon,
  name,
  description,
  roi,
  price,
}: StrategyCardProps) {
  const { t } = useTranslation();

  return (
    /*
      - w-full: fills the grid column completely
      - min-w-[220px]: never shrinks below 220px (matches minmax in parent)
      - h-full: stretches to fill the equal-height grid row (gridAutoRows: 1fr)
      - flex flex-col: so inner content can flex-grow properly
    */
    <div className="group relative isolate p-[2px] rounded-xl w-full min-w-[220px] h-full flex flex-col overflow-hidden">

      {/* Outer Bloom */}
      <div className="absolute inset-[-10px] rounded-xl bg-blue-600/0 group-hover:bg-blue-600/25 blur-[50px] transition-all duration-700 z-0 pointer-events-none" />

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 rounded-xl bg-white/5 transition-opacity duration-500 group-hover:opacity-0" />
        <div className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[conic-gradient(from_0deg_at_50%_50%,#2563EB_0%,#06B6D4_25%,#8B5CF6_50%,#06B6D4_75%,#2563EB_100%)]" />
        <div
          className="absolute pointer-events-none bg-[#010b24]"
          style={{ inset: "2px", borderRadius: "13px" }}
        />
      </div>

      {/* Inner Card */}
      <div className="relative flex flex-col w-full flex-1 p-4 3xl:p-6 gap-3 3xl:gap-4 rounded-[10px] bg-white/5 z-10 overflow-hidden backdrop-blur-sm">

        {/* Internal Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Icon */}
        <div className="w-14 h-14 3xl:w-17.5 3xl:h-17.5 rounded-full overflow-hidden flex-shrink-0 border border-white/10 relative z-10 shadow-inner">
          <Image
            src={icon}
            alt={name}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text — flex-grow so footer is always pushed to bottom */}
        <div className="flex flex-col gap-2 relative z-10 flex-grow pt-2">
          <h3
            className="text-white card-title-size1 font-medium leading-snug font-hoves"
          >
            {name}
          </h3>
          {/* min-h reserves 3 lines so all cards align the footer at the same Y */}
          <p
            className="card-desc-size1 text-slate-300 leading-relaxed line-clamp-3 group-hover:text-white/70 transition-colors min-h-[3.9em] font-hoves"
          >
            {description}
          </p>
        </div>

        {/* Footer — mt-auto pins it to the bottom */}
        <div className="flex flex-col gap-5 relative z-10 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span
                className="text-[25px] 3xl:text-3xl text-[#43C251] leading-tight tracking-tight font-hoves"
              >
                {roi}
              </span>
              <span
                className="text-[11px] text-white/70 tracking-wider font-hoves"
              >
                {t("strategy.monthlyAvg")}
              </span>
            </div>
            <span
              className="text-white font-medium text-[19px] 3xl:text-xl font-hoves"
            >
              {price}
            </span>
          </div>

          <Link
            href="https://crypto.tradingsignals.ai/login"
            className="w-full h-11 3xl:h-12.5 rounded-full flex items-center justify-center text-sm 3xl:text-base font-medium transition-all duration-300 bg-[#010B24] text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-sky-500 font-hoves border border-cyan-blue/12"
          >
            {t("strategy.card_cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}