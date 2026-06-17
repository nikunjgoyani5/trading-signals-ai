"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/common/container/Container";

type LegalSection = {
  id: string;
  title: string;
  content: string[];
};

type LegalPageTemplateProps = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export default function LegalPageTemplate({
  title,
  subtitle,
  lastUpdated,
  sections,
}: LegalPageTemplateProps) {
  const [openSection, setOpenSection] = useState<string>(sections[0]?.id ?? "");

  const currentSection = useMemo(
    () => sections.find((section) => section.id === openSection),
    [openSection, sections]
  );

  return (
    <main className="relative overflow-hidden bg-[#010B24] min-h-screen lg:pt-28 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0.2, scale: 0.9 }}
        animate={{ opacity: [0.2, 0.45, 0.2], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 h-56 w-10/12 max-w-5xl rounded-full bg-cyan-blue/20 blur-[120px]"
      />

      <Container className="relative z-10">
        <section className="mb-4 lg:mb-7 rounded-3xl border border-white/10 bg-white/3 p-6 md:p-8 backdrop-blur-xl">
          <p className="mb-4 inline-flex rounded-full  bg-cyan-blue/10 px-3 py-1 text-xs tracking-[0.16em] uppercase text-cyan-blue">
            Legal
          </p>
          <h1 className="text-white text-3xl md:text-4xl xl:text-5xl font-medium font-hoves mb-4">
            {title}
          </h1>
          <p className="card-desc-size2 max-w-3xl mb-5">{subtitle}</p>
          <p className="text-sm text-[#8CA0BC] font-hoves">
            Last updated: {lastUpdated}
          </p>
        </section>

        <section className="grid gap-4 lg:gap-7 lg:grid-cols-[320px_1fr]">
          <aside className="h-fit rounded-3xl border border-white/10 bg-white/2 p-4 md:p-5 backdrop-blur-xl">
            <p className="mb-4 text-xs tracking-[0.16em] uppercase text-cyan-blue">
              Quick Navigation
            </p>
            <ul className="space-y-2">
              {sections.map((section, index) => {
                const isActive = section.id === openSection;
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => setOpenSection(section.id)}
                      className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "border-cyan-blue/40 bg-cyan-blue/12 text-white"
                          : "border-white/10 bg-transparent text-[#C7CCD2] hover:border-white/25 hover:bg-white/4"
                      }`}
                    >
                      <span className="mr-2 text-cyan-blue/80">{index + 1}.</span>
                      {section.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <article className="rounded-3xl border border-white/10 bg-white/3 p-6 md:p-8 backdrop-blur-xl">
            {currentSection ? (
              <motion.div
                key={currentSection.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <h2 className="text-2xl md:text-3xl text-white font-medium mb-5 font-hoves">
                  {currentSection.title}
                </h2>
                <div className="space-y-4">
                  {currentSection.content.map((paragraph) => (
                    <p key={paragraph} className="card-desc-size2 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </article>
        </section>
      </Container>
    </main>
  );
}
