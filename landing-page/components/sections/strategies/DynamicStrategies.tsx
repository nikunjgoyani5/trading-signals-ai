"use client";
import dynamic from "next/dynamic";
export const Strategies = dynamic(() => import("./Strategies"), { ssr: false });
