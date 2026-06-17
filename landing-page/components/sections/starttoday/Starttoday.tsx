"use client";

import startTodayBack from "@/assets/images/start-today-back.png";
import LuxuryGlowButton from "@/components/common/LuxuryGlowButton";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpVariant } from "@/utils/animations";
import PremiumGlowButton from "@/components/common/LuxuryGlowButton";
import ShineText from "@/components/common/ShineText";
import ShineButton from "@/components/common/ShineButton";
import React from 'react';
import NoiseOverlay from "@/components/NoiseOverlay";
import noiseTexture from "@/assets/images/texture.png"; 
import Link from "next/link";
import Container from "@/components/common/container/Container";

export default function StartToday() {
    const { t } = useTranslation();




// export default AnimatedLoginButton;

    return (
        <motion.section 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className=" section-pb"
        >
            {/* <Faltu/> */}
            <Container className="relative z-10 max-w-360!">
                <div
                    className="relative rounded-2xl overflow-hidden px-8 py-10 text-center min-h-[300px]"
                    style={{
                        backgroundImage: `url(${startTodayBack.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    {/* Dark base layer so text stays readable */}
                    <div
                        className="absolute inset-0 -z-10 rounded-2xl"
                        style={{ background: "#060d1f" }}
                    />

                    {/* Noise Texture Overlay */}
                    <div 
                        className="absolute inset-0 z-0 pointer-events-none opacity-50"
                        style={{ 
                            backgroundImage: `url(${noiseTexture.src})`,
                            backgroundRepeat: 'repeat',
                            backgroundSize: '900px 900px' 
                        }}
                    />

                    <div className="relative flex flex-col items-center gap-2.5 z-10">
                        {/* Badge */}
                        <motion.span variants={fadeUpVariant} className="inline-flex items-center px-5 py-1.5 rounded-full border border-white/25 text-white/80 text-xs xl:text-sm font-medium tracking-widest uppercase"
                            style={{ fontFamily: "var(--font-mono)" }}>
                            {t("starttoday.badge")}
                        </motion.span>

                        <motion.div variants={fadeUpVariant}>
                            <ShineText
                                as="h2"
                                className="head-size font-hoves"
                            >
                                {t("starttoday.heading")}
                            </ShineText>
                        </motion.div>

                        <motion.p variants={fadeUpVariant} className="desc-size max-w-sm xl:max-w-md 2xl:max-w-xl">
                            {t("starttoday.description")}
                        </motion.p>

                        <motion.div variants={fadeUpVariant} className="mt-4">
                            <Link href="https://crypto.tradingsignals.ai/login">
                            <ShineButton onClick={() => { }}>
                                {t("starttoday.cta")}
                            </ShineButton>
                            </Link>
                        </motion.div>

                        {/* <AnimatedLoginButton/> */}

                    </div>
                </div>
            </Container>
        </motion.section>
    );
}