"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeUpVariant } from "@/utils/animations";

export default function ContactHero() {
  const { t } = useTranslation("translation", {
    keyPrefix: "contactPage",
  });

  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="px-3.5 py-0.5 backdrop-blur-md">
          <span className="text-[15px] font-mono tracking-widest uppercase text-vivid-cyan">
            {t("badge")}
          </span>
        </div>

        <h1 className="head-size text-white">{t("title")}</h1>
        <p className="desc-size max-w-[560px]">{t("description")}</p>
      </div>
    </motion.div>
  );
}
