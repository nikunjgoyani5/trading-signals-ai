"use client";

import FAQ from "../sections/faq/FAQ";

export default function AmbientFAQCTASection() {
  return (
    <div className="relative overflow-hidden bg-[#010B24] w-full">
      {/* ── AMBIENT BACKGROUND LAYERS (LEFT SIDE ONLY) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
        {/* Cyan Top Transition Glow (Bleed from Testimonials) */}
        {/* <motion.div
          animate={{
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[60%] -top-[15%] w-[50%] h-[30%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,240,255,0.25) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        /> */}

{/* side glow */}
        {/* Main Left Deep Blue Glow */}
        {/* <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
            opacity: [0.38, 0.62, 0.38],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-[35%] top-[8%] w-[65%] h-[50%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,18,184,1) 0%, transparent 72%)",
            filter: "blur(100px)",
          }}
        /> */}

        {/* Secondary Left Bloom */}
        {/* <motion.div
          animate={{
            scale: [1, 1.08, 1],
            y: [0, 20, 0],
            opacity: [0.26, 0.46, 0.26],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -right-[40%] bottom-[5%] w-[65%] h-[55%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,18,184,0.72) 0%, transparent 75%)",
            filter: "blur(90px)",
          }}
        /> */}

        {/* Cyan Accent Left */}
        {/* <motion.div
          animate={{
            opacity: [0.18, 0.34, 0.18],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[8%] top-[42%] w-[42%] h-[30%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,240,255,0.38) 0%, transparent 62%)",
            filter: "blur(70px)",
          }}
        /> */}
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10">

        <div
       
          className=""
        >
          <FAQ />   
        </div>

        {/* <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" /> */}

          
      </div>
    </div>
  );
}