"use client";

import { useRef, useState, useMemo, useCallback, useId, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useAutoplayVideo } from "@/components/video/useAutoplayVideo";

interface HeroChartProps {
  videoSrc?: string;
  /** Unique per instance so only one coordinated clip plays at a time. */
  videoId?: string;
}

export default function HeroChart({
  videoSrc = "/videos/Trading Signals AI Video 1 Final (1) (1).mp4",
  videoId: videoIdProp,
}: HeroChartProps) {
  const generatedId = useId().replace(/:/g, "");
  const videoId = videoIdProp ?? `landing-video-${generatedId}`;

  const cardRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // Start muted for cross-browser autoplay reliability (Safari/iOS are strict).
  const [isMuted, setIsMuted] = useState(true);

  const beforeVisibilityPlay = useCallback((video: HTMLVideoElement) => {
    video.muted = true;
    setIsMuted(true);
  }, []);

  const { containerRef, videoRef, beforeManualPlay } = useAutoplayVideo({
    videoId,
    threshold: 0.5,
    beforeVisibilityPlay,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Helps stricter engines treat this media as muted-autoplay capable from first paint.
    video.defaultMuted = true;
    video.muted = true;
  }, [videoRef]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const springConfig = useMemo(() => ({ stiffness: 25, damping: 32, mass: 1.6 }), []);
  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  const videoX = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const videoY = useTransform(springY, [-0.5, 0.5], [-6, 6]);

  const playX = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const playY = useTransform(springY, [-0.5, 0.5], [-10, 10]);

  const barX = useTransform(springX, [-0.5, 0.5], [-3, 3]);

  const glowSpringConfig = useMemo(() => ({ stiffness: 30, damping: 35, mass: 2 }), []);
  const glowXSpring = useSpring(glowX, glowSpringConfig);
  const glowYSpring = useSpring(glowY, glowSpringConfig);

  // Optimized CSS variables for gradients to avoid string parsing on every frame
  const mouseXPercent = useTransform(glowXSpring, (v) => `${v}%`);
  const mouseYPercent = useTransform(glowYSpring, (v) => `${v}%`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    rawX.set(nx);
    rawY.set(ny);

    glowX.set(((e.clientX - rect.left) / rect.width) * 100);
    glowY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    glowX.set(50);
    glowY.set(50);
    setIsHovered(false);
  };

  const handlePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    beforeManualPlay();
    video.muted = isMuted;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        video.muted = true;
        setIsMuted(true);
        void video.play();
      });
    }
  };

  const handlePause = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    videoRef.current?.pause();
  };

  return (
    <section className="w-full relative z-10 mx-auto">
      
        <div className="relative w-full">
          {/* OUTER GLOW */}
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_50%_40%,_rgba(0,120,255,0.25)_0%,_rgba(0,60,180,0.1)_50%,_transparent_75%)] blur-[40px] pointer-events-none" />

          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              transformPerspective: 1200,
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          >
            {/* MAIN CARD */}
            <div
              className="relative w-full rounded-t-2xl md:rounded-t-3xl overflow-hidden  bg-[#00000033]  backdrop-blur-3xl  shadow-2xl"
              style={{
                isolation: "isolate",
                WebkitMaskImage: "-webkit-radial-gradient(white, black)",
              }}
            >
              {/* HOVER BLUE GLOW */}
              <motion.div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "1px",
                  borderRadius: "inherit",
                  pointerEvents: "none",
                  zIndex: 20,
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.8s ease",
                  // Using CSS variables for position to optimize performance
                  background: `radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(59,130,246,0.15) 0%, transparent 50%)`,
                  "--glow-x": mouseXPercent,
                  "--glow-y": mouseYPercent,
                } as any}
              />

              {/* WHITE SHEEN */}
              <motion.div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "1px",
                  borderRadius: "inherit",
                  pointerEvents: "none",
                  zIndex: 19,
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 1s ease",
                  // Using CSS variables for position to optimize performance
                  background: `radial-gradient(ellipse at var(--glow-x) var(--glow-y), rgba(255,255,255,0.06) 0%, transparent 45%)`,
                  "--glow-x": mouseXPercent,
                  "--glow-y": mouseYPercent,
                } as any}
              />

              {/* TOP BAR */}
              <motion.div
                style={{ x: barX }}
                className="w-full flex items-center gap-2 px-4 py-2 md:py-2 bg-[#00000033]  rounded-t-2xl md:rounded-t-3xl"
              >
                <div className="flex gap-1.5 flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] opacity-80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] opacity-80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] opacity-80" />
                </div>

                <div className="flex-grow flex justify-center">
                  <div className="h-[25px] min-w-[180px] md:min-w-[340px] px-4 rounded-[5px] border border-white/10 bg-[#FFFFFF0D] flex items-center justify-center text-white text-[11px] md:text-xs font-mono tracking-normal md:tracking-wider">
                    tradingsignals.ai
                  </div>
                </div>

                <div className="w-12 hidden md:block" />
              </motion.div>

              {/* VIDEO WRAPPER */}
              <div className="relative w-full  bg-[#00000033]  px-1.5 md:px-2 lg:px-3 pt-0">
                <div
                  ref={containerRef}
                  className="relative overflow-hidden rounded-2xl md:rounded-3xl rounded-t-none border border-white/[0.06] bg-[#00000033] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transform-gpu"
                >
                  <motion.div style={{ x: videoX, y: videoY, translateZ: 0 }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted={isMuted}
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full aspect-video block cursor-pointer"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                      onClick={isPlaying ? handlePause : handlePlay}
                    >
                      <source
                        src={videoSrc}
                        type="video/mp4"
                      />
                    </video>
                  </motion.div>

                  {/* INTERNAL FADE */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[70%] pointer-events-none bg-gradient-to-t from-[#02081e] via-[#02081e]/60 to-transparent"
                    style={{ x: videoX, y: videoY }}
                    animate={{ opacity: isPlaying ? 0 : 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />

                  {/* PLAY BUTTON */}
{!isPlaying && (
  <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8">
    <motion.div className="" style={{ x: playX, y: playY }}>
      <motion.button
        onClick={handlePlay}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
        }}
        className="
          inline-flex items-center gap-2 sm:gap-[10px]
          w-auto min-w-[145px] sm:min-w-[165px] md:min-w-[178px]
          h-[46px] sm:h-[50px] md:h-[56px]
          rounded-full
          px-3 sm:px-4 md:px-[20px]
          pl-1.5 sm:pl-2 md:pl-[8px]
          py-1.5 sm:py-2
          bg-white/90 backdrop-blur-md
          shadow-[0_8px_30px_rgba(0,0,0,0.18)]
        "
      >
        {/* Icon */}
        <div
          className="
            w-8 h-8
            sm:w-9 sm:h-9
            md:w-10 md:h-10
            rounded-full flex items-center justify-center
            bg-gradient-to-r from-[#123DFF] to-[#12D7F5]
            shrink-0
          "
        >
          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white ml-[1px]" />
        </div>

        {/* Text */}
        <div className="flex flex-col leading-none text-center mx-auto">
          <span className="text-[12px] sm:text-[14px] md:text-sm font-semibold text-black whitespace-nowrap">
            Watch 
          </span>
          {/* <span className="text-[9px] sm:text-[10px] md:text-[11px] text-[#5D5D5D] mt-0.5 sm:mt-1 whitespace-nowrap">
            1:00 min
          </span> */}
        </div>
      </motion.button>
    </motion.div>
  </div>
)}

                  {/* CONTROLS */}
                  {isPlaying && (
                    <div className="absolute bottom-6 right-6 flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(!isMuted);
                        }}
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-all duration-200"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 text-white" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <button
                        onClick={handlePause}
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-all duration-200"
                      >
                        <div className="flex gap-[3px]">
                          <div className="w-[3px] h-[12px] bg-white rounded-full" />
                          <div className="w-[3px] h-[12px] bg-white rounded-full" />
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* BOTTOM OUTER FADE */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#02081e] via-[#02081e]/80 to-transparent pointer-events-none rounded-b-3xl z-20"
            style={{ x: videoX, y: videoY, translateZ: 0 }}
            animate={{ opacity: isPlaying ? 0 : 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </div>
    </section>
  );
}