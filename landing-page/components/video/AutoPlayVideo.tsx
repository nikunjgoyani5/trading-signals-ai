"use client";

import { useAutoplayVideo } from "./useAutoplayVideo";

export type AutoPlayVideoProps = {
  /** Must be unique across all coordinated videos on the page. */
  videoId: string;
  src: string;
  /** Optional second source (e.g. WebM) for better compression. */
  srcSecondary?: string;
  type?: string;
  typeSecondary?: string;
  poster?: string;
  className?: string;
  /** Applied to the IntersectionObserver root (the “section” whose visibility drives autoplay). */
  containerClassName?: string;
  threshold?: number;
  rootMargin?: string;
  loop?: boolean;
  /** Native controls (accessibility); default off for hero-style clips. */
  controls?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
};

/**
 * Self-contained muted autoplay block: observes its container, coordinates with other
 * `AutoPlayVideo` / `useAutoplayVideo` instances, and respects manual pause until the
 * user explicitly plays again.
 */
export function AutoPlayVideo({
  videoId,
  src,
  srcSecondary,
  type = "video/mp4",
  typeSecondary = "video/webm",
  poster,
  className,
  containerClassName,
  threshold = 0.5,
  rootMargin,
  loop = true,
  controls = false,
  playsInline = true,
  preload = "metadata",
}: AutoPlayVideoProps) {
  const { containerRef, videoRef } = useAutoplayVideo({
    videoId,
    threshold,
    rootMargin,
  });

  return (
    <div ref={containerRef} className={containerClassName}>
      {/*
        Default muted: required for reliable autoplay across Chrome/Safari/mobile.
        The hook re-applies muted=true on visibility-driven play so policy stays satisfied.
      */}
      <video
        ref={videoRef}
        className={className}
        muted
        loop={loop}
        playsInline={playsInline}
        controls={controls}
        preload={preload}
        poster={poster || undefined}
      >
        <source src={src} type={type} />
        {srcSecondary ? (
          <source src={srcSecondary} type={typeSecondary} />
        ) : null}
      </video>
    </div>
  );
}
