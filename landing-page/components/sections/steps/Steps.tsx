"use client";

import { useTranslation } from "react-i18next";
import StepCard from "./StepCard";
import { Link2, Layers, BarChart3 } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpVariant } from "@/utils/animations";
import noiseTexture from "@/assets/images/texture.png"; 
// import { Noise } from "@react-three/postprocessing";
import NoiseOverlay from "@/components/NoiseOverlay";
import Container from "@/components/common/container/Container";


interface StepData {
  title: string;
  desc: string;
}

export const HoverContext = createContext<{
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}>({ hoveredId: null, setHoveredId: () => {} });

export default function Steps() {
  const { t } = useTranslation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const stepsData = t("gettingStarted.stepsList", { returnObjects: true }) as StepData[];
  const stepPrefix = t("gettingStarted.stepbadge");

  return (
    <HoverContext.Provider value={{ hoveredId, setHoveredId }}>
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="w-full  relative bg-transparent overflow-x-clip overflow-y-visible"
      >
        
      <NoiseOverlay/>
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-x-12 lg:gap-y-0 items-start">

            {/* ── HEADING ── */}
            <motion.div variants={fadeUpVariant} className="lg:col-start-2 lg:row-start-1 flex flex-col items-center text-center lg:pt-14 mb-8 lg:mb-0 order-1">
              <div className="inline-flex items-center justify-center px-4 py-1.5  mb-3 backdrop-blur-md">
                <span className="text-[15px] font-mono tracking-widest uppercase text-vivid-cyan">
                  {t("gettingStarted.title")}
                </span>
              </div>
              <h2
                className="head-size font-medium leading-tight md:leading-[1.1] text-white mb-2 lg:max-w-md font-hoves"
              >
                {t("gettingStarted.heading")}
              </h2>
              <p
                className="desc-size text-[#c7ccd2] leading-snug max-w-[320px] font-hoves"
              >
                {t("gettingStarted.description")}
              </p>
            </motion.div>

            {/* STEP 01 */}
            {stepsData[0] && (
              <motion.div variants={fadeUpVariant} className="lg:col-start-1 lg:row-start-1 flex justify-center lg:justify-start order-2 lg:order-1 lg:pt-4">
                <StepCard
                  id="step-01"
                  step={`${stepPrefix} 01`}
                  Icon={Link2}
                  title={stepsData[0].title}
                  description={stepsData[0].desc}
                />
              </motion.div>
            )}

            {/* STEP 03 */}
            {stepsData[2] && (
              <motion.div variants={fadeUpVariant} className="lg:col-start-3 lg:row-start-1 flex justify-center lg:justify-end order-4 lg:order-3 lg:pt-4">
                <StepCard
                  id="step-03"
                  step={`${stepPrefix} 03`}
                  Icon={BarChart3}
                  title={stepsData[2].title}
                  description={stepsData[2].desc}
                />
              </motion.div>
            )}

            {/* STEP 02 */}
            {stepsData[1] && (
              <motion.div variants={fadeUpVariant} className="lg:col-start-2 lg:row-start-2 flex justify-center  order-3 lg:order-4 lg:-translate-y-7">
                <StepCard
                  id="step-02"
                  step={`${stepPrefix} 02`}
                  Icon={Layers}
                  title={stepsData[1].title}
                  description={stepsData[1].desc}
                />
              </motion.div>
            )}

          </div>
        </Container>
      </motion.section>
    </HoverContext.Provider>
  );
}