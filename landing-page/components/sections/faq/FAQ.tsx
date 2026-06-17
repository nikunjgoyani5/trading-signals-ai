"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { staggerContainer, fadeUpVariant } from "@/utils/animations";
import FAQItem from "./FAQItem";
import Container from "@/components/common/container/Container";
import HeroChart from "../hero/HeroChart";

interface FAQData {
  q: string;
  a: string;
}

export default function FAQ() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const questions = t("faq.questions", { returnObjects: true }) as FAQData[];

  const filteredQuestions = questions.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      style={{
        background: "linear-gradient(0deg, #010B24 0%, #010B24 75%, #02164b 100%)",

      }}
      className="w-full bg-transparent section-py relative overflow-hidden">
      {/* Outer container — responsive horizontal padding */}
      <Container className="relative z-20 flex flex-col items-center text-center transform-gpu mb-16 md:mb-24 ">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUpVariant}
          className="w-full flex justify-center"
        >
          <HeroChart
            videoId="landing-faq-preview"
            videoSrc="/videos/Trading Signal AI Video 2 (1).mp4"
          />
        </motion.div>
      </Container>
      <Container className="relative z-10">
        <div    id="faq" className="flex flex-col items-center gap-9 scroll-mt-18 sm:scroll-mt-18 md:scroll-mt-16 lg:scroll-mt-25">
          {/* ── Header Block — Localized ── */}
          <motion.div
            variants={fadeUpVariant}
            className="flex flex-col items-center text-center gap-3 max-w-[619px]"
          >
            {/* Badge */}
            <div className="px-3.5 py-0.5 flex justify-center  backdrop-blur-md">
              <span className="text-[15px] font-mono tracking-widest uppercase text-vivid-cyan">
                {t("faq.badge")}
              </span>
            </div>

            <h2 className="head-size text-white">
              {t("faq.title")}
            </h2>

            <p className="desc-size max-w-[500px]">
              {t("faq.description")}
            </p>
          </motion.div>

          {/* ── Search Bar ── */}
          <motion.div
            variants={fadeUpVariant}
            className="w-full max-w-md relative group"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <Search className="w-5 h-5 text-[#999999] group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              placeholder={t("faq.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-full py-3 pl-12 pr-12 text-white text-lg placeholder:text-[#999999] focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-300 backdrop-blur-md"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute cursor-pointer inset-y-0 right-4 flex items-center text-[#C7CCD2] hover:text-white transition-colors z-10"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          {/* ── Questions List ── */}
          <div className="w-full max-w-3xl flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((faq) => (
                  <motion.div
                    key={faq.q}
                    layout
                    variants={fadeUpVariant}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <FAQItem question={faq.q} answer={faq.a} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  key="no-results"
                  layout
                  variants={fadeUpVariant}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="text-center py-10"
                >
                  <p className="text-[#C7CCD2] card-title-size1 font-hoves">
                    {t("faq.noResults", { query: searchTerm })}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </motion.section>
  );
}
