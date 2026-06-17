"use client";

import { motion } from "framer-motion";
import Categories from "../sections/categories/Categories";
import Traders from "../sections/traders/Traders";

export default function AmbientTradingSection() {
  return (
    <div className="relative overflow-hidden bg-transparent w-full z-20 ">
      <div className="absolute inset-0 pointer-events-none overflow-visible h-full w-full">

        {/* Primary Glow */}
        <motion.div
          // animate={{
          //   scale: [1, 1.1, 1],
          //   x: [0, -20, 0],
          //   y: [0, 30, 0],
          //   opacity: [0.34, 0.56, 0.34],
          // }}
          // transition={{
          //   duration: 15,
          //   repeat: Infinity,
          //   ease: "easeInOut",
          // }}
          className="absolute -right-[50%] xl:-right-[30%] bottom-[24%] w-200 h-140 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,18,184,0.95) 0%, transparent 72%)",
            filter: "blur(130px)",
          }}
        />

        {/* Secondary Cyan Glow */}
        {/* <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
            opacity: [0.26, 0.46, 0.26],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -right-[30%] top-[30%] w-[50%] h-[40%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,240,255,0.46) 0%, transparent 62%)",
            filter: "blur(70px)",
          }}
        /> */}

        {/* Third Glow */}
        {/* <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            opacity: [0.20, 0.36, 0.20],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute right-0 top-[50%] w-[90%] h-[50%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,18,184,0.72) 0%, transparent 75%)",
            filter: "blur(115px)",
          }}
        /> */}

        {/* Accent Left Glow */}
        {/* <div
          className="absolute -left-[20%] top-[40%] w-[50%] h-[50%]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,18,184,0.22) 0%, transparent 72%)",
            filter: "blur(100px)",
          }}
        /> */}
      </div>

      <div className="relative z-20">
        <Categories />
        {/* <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" /> */}
        <Traders />
      </div>
    </div>
  );
}