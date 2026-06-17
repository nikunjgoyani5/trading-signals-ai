"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface TraderFeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index?: number;
}

export default function TraderFeatureCard({
  icon,
  title,
  description,
  index = 0,
}: TraderFeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col gap-6 p-6 min-h-[220px] rounded-xl bg-white/5 border border-white/10"
    >
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-dark-blue to-vivid-cyan flex items-center justify-center text-white">
        {icon}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="card-title-size1 font-medium text-white m-0">
          {title}
        </h3>
        <p className="card-desc-size1 font-light leading-snug text-[#c7ccd2]">
          {description}
        </p>
      </div>
    </motion.div>
  );
}