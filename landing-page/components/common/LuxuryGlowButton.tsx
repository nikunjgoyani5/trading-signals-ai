import React from 'react';
import { motion } from 'framer-motion';

const PremiumGlowButton = () => {
  // Outer Container: 
  // The p-[1px] creates the physical space for the border to show through.
  // The overflow-hidden here strictly clips the rotating gradient to the pill shape.
  return (
    <button className="relative overflow-hidden rounded-full p-[1px] group outline-none active:scale-95 transition-transform duration-200">
      
      {/* 1. The Moving Border Glow (Comet Effect) 
        A massive square that spins continuously behind the inner dark container.
        The conic-gradient leaves 75% transparent, creating a localized "comet" tail.
      */}
      <motion.div
        className="absolute top-1/2 left-1/2 aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, transparent 75%, rgba(255,255,255,0.8) 100%)',
        }}
        animate={{ rotate: 360 }}
        transition={{ ease: "linear", duration: 3, repeat: Infinity }}
      />

      {/* Inner Dark Container (The "Mask"): 
        This sits on top of the spinning gradient, blocking the center and 
        only allowing the 1px padding of the parent to reveal the light.
      */}
      <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-gray-950 px-8 py-3 overflow-hidden">

        {/* 2. The Background Text Sweep (Spotlight Effect) 
          Placed inside the inner container so it doesn't spill over the border.
          Uses a soft gradient and strong blur, sweeping horizontally.
        */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-2xl pointer-events-none z-0"
          animate={{ x: ['-200%', '300%'] }}
          transition={{ 
            ease: "linear", 
            duration: 2.5, 
            repeat: Infinity, 
            repeatDelay: 0.5 
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex items-center gap-3">
          
          {/* Signal Icon */}
          <div className="flex items-end gap-[3px]">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className="w-[3px] bg-gray-500 group-hover:bg-gray-200 transition-colors duration-300"
                style={{ height: `${5 + bar * 3}px` }}
              />
            ))}
          </div>

          {/* Button Text */}
          <span className="text-sm sm:text-base font-medium tracking-wide text-[#e0e0e0] group-hover:text-white transition-colors duration-300 font-hoves">
            Get Lifetime Now
          </span>
          
        </div>
      </div>
    </button>
  );
};

export default PremiumGlowButton;