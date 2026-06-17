"use client";
import dynamic from "next/dynamic";
export const StartToday = dynamic(() => import("./Starttoday"), { ssr: false });
