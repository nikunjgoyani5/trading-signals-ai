"use client";
import dynamic from "next/dynamic";
export const AmbientTestimonialsSection = dynamic(() => import("./AmbientTestimonialsSection"), { ssr: false });
