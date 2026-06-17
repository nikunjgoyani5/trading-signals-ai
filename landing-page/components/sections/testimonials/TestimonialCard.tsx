"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import type Player from "@vimeo/player";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const FULLSCREEN_CHROME_IDLE_MS = 2800;

function vimeoEmbedSrc(videoId: string) {
  const q = new URLSearchParams({
    badge: "0",
    autopause: "1",
    playsinline: "1",
    controls: "0",
    title: "0",
    byline: "0",
    portrait: "0",
  });
  return `https://player.vimeo.com/video/${videoId}?${q.toString()}`;
}

interface TestimonialCardProps {
  vimeoVideoId: string;
  quote: string;
  playbackId: string;
  activePlaybackId: string | null;
  onVideoPlay: (playbackId: string) => void;
}

function PlayIcon() {
  return (
    <svg
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="translate-x-px"
      aria-hidden
    >
      <path d="M1 1L15 9L1 17V1Z" fill="white" fillOpacity="0.95" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="1" y="1" width="4" height="14" rx="1" fill="white" fillOpacity="0.95" />
      <rect x="9" y="1" width="4" height="14" rx="1" fill="white" fillOpacity="0.95" />
    </svg>
  );
}

export default function TestimonialCard({
  vimeoVideoId,
  quote,
  playbackId,
  activePlaybackId,
  onVideoPlay,
}: TestimonialCardProps) {
  const { t } = useTranslation();
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenChromeVisible, setFullscreenChromeVisible] = useState(true);
  const fullscreenIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFullscreenIdleTimer = useCallback(() => {
    if (fullscreenIdleTimerRef.current !== null) {
      clearTimeout(fullscreenIdleTimerRef.current);
      fullscreenIdleTimerRef.current = null;
    }
  }, []);

  const scheduleFullscreenChromeHide = useCallback(() => {
    clearFullscreenIdleTimer();
    fullscreenIdleTimerRef.current = setTimeout(() => {
      fullscreenIdleTimerRef.current = null;
      setFullscreenChromeVisible(false);
    }, FULLSCREEN_CHROME_IDLE_MS);
  }, [clearFullscreenIdleTimer]);

  const wakeFullscreenChrome = useCallback(() => {
    setFullscreenChromeVisible(true);
    scheduleFullscreenChromeHide();
  }, [scheduleFullscreenChromeHide]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let cancelled = false;
    let player: Player | null = null;

    void (async () => {
      try {
        const { default: PlayerCtor } = await import("@vimeo/player");
        if (cancelled || !iframeRef.current) return;
        player = new PlayerCtor(iframeRef.current);
        await player.ready();
        if (cancelled) {
          void player.destroy();
          return;
        }
        playerRef.current = player;
        player.on("play", () => setPlaying(true));
        player.on("pause", () => setPlaying(false));
        player.on("ended", () => setPlaying(false));
        if (!cancelled) setPlayerReady(true);
      } catch {
        setPlayerReady(false);
      }
    })();

    return () => {
      cancelled = true;
      setPlayerReady(false);
      void player?.destroy();
      playerRef.current = null;
    };
  }, [vimeoVideoId]);

  useEffect(() => {
    const p = playerRef.current;
    if (!p || !playerReady) return;
    if (activePlaybackId !== playbackId) {
      void p.pause();
    }
  }, [activePlaybackId, playbackId, playerReady]);

  useEffect(() => {
    const sync = () => {
      const fs =
        document.fullscreenElement ??
        (document as Document & { webkitFullscreenElement?: Element | null })
          .webkitFullscreenElement;
      setIsFullscreen(fs === stageRef.current);
    };
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      clearFullscreenIdleTimer();
      setFullscreenChromeVisible(true);
      return;
    }
    wakeFullscreenChrome();
    return () => {
      clearFullscreenIdleTimer();
    };
  }, [isFullscreen, clearFullscreenIdleTimer, wakeFullscreenChrome]);

  const toggleFullscreen = useCallback(async () => {
    const stage = stageRef.current;
    if (!stage) return;

    try {
      const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
        webkitExitFullscreen?: () => void;
      };
      const stageEl = stage as HTMLElement & {
        webkitRequestFullscreen?: () => void;
      };

      if (document.fullscreenElement === stage) {
        await document.exitFullscreen();
        return;
      }
      if (doc.webkitFullscreenElement === stage) {
        doc.webkitExitFullscreen?.();
        return;
      }
      if (stageEl.requestFullscreen) {
        await stageEl.requestFullscreen();
      } else if (stageEl.webkitRequestFullscreen) {
        stageEl.webkitRequestFullscreen();
      }
    } catch {
      const p = playerRef.current;
      if (p) void p.requestFullscreen().catch(() => {});
    }
  }, []);

  const handleToggle = () => {
    if (isFullscreen) wakeFullscreenChrome();
    const p = playerRef.current;
    if (!p || !playerReady) return;

    void (async () => {
      try {
        const paused = await p.getPaused();
        if (paused) {
          onVideoPlay(playbackId);
          void p.setMuted(false);
          await p.play();
        } else {
          await p.pause();
        }
      } catch {
        /* ignore */
      }
    })();
  };

  const chromeHiddenInFs = isFullscreen && !fullscreenChromeVisible;

  return (
    <div className="flex w-full max-w-[440px] shrink-0 flex-col gap-5 rounded-[15px] border border-white/10 bg-white/5 p-5 box-border backdrop-blur-sm transition-all duration-300 hover:border-white/20">

      <div
        ref={stageRef}
        className="group relative h-[200px] w-full shrink-0 overflow-hidden rounded-[15px] bg-black @container-[size]"
        onMouseMove={() => {
          if (isFullscreen) wakeFullscreenChrome();
        }}
        onTouchStart={() => {
          if (isFullscreen) wakeFullscreenChrome();
        }}
      >
        <iframe
          ref={iframeRef}
          key={vimeoVideoId}
          src={vimeoEmbedSrc(vimeoVideoId)}
          title="Testimonial video"
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 border-0"
          style={{
            display: "block",
            overflow: "hidden",
            width: "max(100cqw, calc(100cqh * 16 / 9))",
            height: "max(100cqh, calc(100cqw * 9 / 16))",
          }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />

        <div
          className={`pointer-events-none absolute inset-0 z-1 bg-linear-to-t from-black/50 via-black/15 to-transparent transition-opacity duration-200 ${
            chromeHiddenInFs
              ? "opacity-0"
              : playing
                ? "opacity-0 group-hover:opacity-100"
                : "opacity-100"
          }`}
          aria-hidden
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            void toggleFullscreen();
          }}
          className={`absolute bottom-2 right-2 z-20 flex cursor-pointer items-center gap-1.5 rounded-md border border-white/15 bg-black/55 px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-black/70 hover:text-white font-mono ${
            chromeHiddenInFs ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
          }`}
          aria-label={
            isFullscreen ? t("testimonials.exitFullScreenAria") : t("testimonials.enterFullScreenAria")
          }
        >
          {isFullscreen ? (
            <Minimize2 className="size-3.5 shrink-0 opacity-90" aria-hidden />
          ) : (
            <Maximize2 className="size-3.5 shrink-0 opacity-90" aria-hidden />
          )}
          <span>{isFullscreen ? t("testimonials.exitFullScreen") : t("testimonials.fullScreen")}</span>
        </button>

        <button
          type="button"
          onClick={handleToggle}
          disabled={!playerReady}
          className={`absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-transparent outline-none transition-opacity duration-200 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/30 disabled:cursor-wait disabled:opacity-60 ${
            chromeHiddenInFs
              ? "pointer-events-none opacity-0"
              : isFullscreen
                ? "pointer-events-auto opacity-100"
                : playing
                  ? "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
                  : "opacity-100"
          }`}
          aria-label={playing ? t("testimonials.pauseVideoAria") : t("testimonials.playVideoAria")}
        >
          <span className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/25 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
            {playing ? <PauseIcon /> : <PlayIcon />}
          </span>
        </button>
      </div>

      <div className="min-w-0">
        <p className="card-desc-size2 m-0 font-hoves line-clamp-3 lg:line-clamp-4">
          {quote}
        </p>
      </div>
    </div>
  );
}
