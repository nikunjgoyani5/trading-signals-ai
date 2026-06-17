"use client";

import React from "react";
import noiseTexture from "@/assets/images/texture.png"; 

export default function NoiseOverlay() {
  return (
    <div 
      className="fixed inset-0 w-full h-full z-[9999] pointer-events-none opacity-20"
      style={{ 
        backgroundImage: `url(${noiseTexture.src})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '900px 900px' 
      }}
    />
  );
}