"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useVideoAutoplayCoordinator } from "./VideoAutoplayContext";

export type UseAutoplayVideoOptions = {
  /** Unique id for coordination (only one registered video should play at a time). */
  videoId: string;
  /**
   * Minimum visible ratio before autoplay is allowed (0–1).
   * Browsers fire IntersectionObserver with discrete steps; we include `threshold` in the
   * observer list so callbacks run when crossing this visibility.
   */
  threshold?: number;
  rootMargin?: string;
  /**
   * Runs right before a visibility-driven `play()` attempt. Defaults to forcing
   * `video.muted = true` so autoplay succeeds on mobile/desktop. Override when the host
   * UI keeps its own mute state in React (see `HeroChart`).
   */
  beforeVisibilityPlay?: (video: HTMLVideoElement) => void;
};

export type UseAutoplayVideoResult = {
  containerRef: RefObject<HTMLDivElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  /**
   * True after the user pauses via native controls (or any non-programmatic pause).
   * While true, visibility alone will not restart playback.
   */
  userDismissedAutoplay: boolean;
  /**
   * Call immediately before a deliberate user play (custom button, video click, etc.)
   * so other landing videos pause first.
   */
  beforeManualPlay: () => void;
};

/**
 * Core autoplay behavior: IntersectionObserver (~50% visible), muted-friendly play,
 * programmatic pause when off-screen, coordination with other videos, and “sticky”
 * user opt-out until they press play again.
 */
export function useAutoplayVideo(
  options: UseAutoplayVideoOptions
): UseAutoplayVideoResult {
  const {
    videoId,
    threshold = 0.5,
    rootMargin = "0px",
    beforeVisibilityPlay,
  } = options;
  const { register, pauseOthers } = useVideoAutoplayCoordinator();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /** Guards for the next media events triggered by our own pause/play calls. */
  const ignoreNextPauseEventRef = useRef(0);
  const ignoreNextPlayEventRef = useRef(0);
  const pauseResetTimerRef = useRef<number | null>(null);
  const playResetTimerRef = useRef<number | null>(null);

  const userDismissedRef = useRef(false);
  const [userDismissedAutoplay, setUserDismissedAutoplay] = useState(false);

  const safePause = useCallback((video: HTMLVideoElement) => {
    ignoreNextPauseEventRef.current += 1;
    if (pauseResetTimerRef.current !== null) {
      window.clearTimeout(pauseResetTimerRef.current);
    }
    // Fallback reset in case browser does not fire `pause`.
    pauseResetTimerRef.current = window.setTimeout(() => {
      ignoreNextPauseEventRef.current = 0;
      pauseResetTimerRef.current = null;
    }, 300);
    video.pause();
  }, []);

  const safePlay = useCallback(async (video: HTMLVideoElement) => {
    ignoreNextPlayEventRef.current += 1;
    if (playResetTimerRef.current !== null) {
      window.clearTimeout(playResetTimerRef.current);
    }
    // Fallback reset in case browser blocks `play` event.
    playResetTimerRef.current = window.setTimeout(() => {
      ignoreNextPlayEventRef.current = 0;
      playResetTimerRef.current = null;
    }, 500);
    try {
      await video.play();
    } catch {
      /* Autoplay or decode failures are ignored; user can still tap play. */
    }
  }, []);

  const beforeManualPlay = useCallback(() => {
    // Always reset opt-out on an explicit user play gesture, not only when `play` fires.
    // Otherwise a race with `programmaticActionRef` (after safePlay/safePause) can leave
    // `userDismissedRef` stuck true so scroll autoplay never resumes after “pause → play”.
    userDismissedRef.current = false;
    setUserDismissedAutoplay(false);
    pauseOthers(videoId);
  }, [pauseOthers, videoId]);

  /** Register this instance’s pause handler so other clips can pause us safely. */
  useEffect(() => {
    const unregister = register(videoId, () => {
      const el = videoRef.current;
      if (el && !el.paused) {
        safePause(el);
      }
    });
    return unregister;
  }, [register, safePause, videoId]);

  /** User pause/play semantics: only non-programmatic events change dismissal state. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPause = () => {
      if (ignoreNextPauseEventRef.current > 0) {
        ignoreNextPauseEventRef.current -= 1;
        return;
      }
      userDismissedRef.current = true;
      setUserDismissedAutoplay(true);
    };

    const onPlay = () => {
      if (ignoreNextPlayEventRef.current > 0) {
        ignoreNextPlayEventRef.current -= 1;
        return;
      }
      userDismissedRef.current = false;
      setUserDismissedAutoplay(false);
    };

    video.addEventListener("pause", onPause);
    video.addEventListener("play", onPlay);
    return () => {
      video.removeEventListener("pause", onPause);
      video.removeEventListener("play", onPlay);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pauseResetTimerRef.current !== null) {
        window.clearTimeout(pauseResetTimerRef.current);
      }
      if (playResetTimerRef.current !== null) {
        window.clearTimeout(playResetTimerRef.current);
      }
    };
  }, []);

  /** Visibility-driven autoplay / pause */
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const video = videoRef.current;
        // Require ~50% visibility so brief peeks don’t start audio-heavy work.
        const shouldPlay =
          entry.isIntersecting && entry.intersectionRatio >= threshold;

        if (shouldPlay) {
          pauseOthers(videoId);
          // Respect manual pause: `userDismissedRef` flips on non-programmatic `pause` events.
          if (!userDismissedRef.current && video) {
            if (beforeVisibilityPlay) {
              beforeVisibilityPlay(video);
            } else {
              video.muted = true;
            }
            void safePlay(video);
          }
        } else if (video) {
          // Reset manual-pause lock once visibility is meaningfully low, so re-visit
          // always autoplays when the section becomes visible again.
          // Using a ratio check is more reliable than `!isIntersecting` on tall sections.
          if (!entry.isIntersecting || entry.intersectionRatio < 0.15) {
            userDismissedRef.current = false;
            setUserDismissedAutoplay(false);
          }
          // Leaving view: always pause, but use the safe path so we don’t look like a user opt-out.
          safePause(video);
        }
      },
      {
        root: null,
        rootMargin,
        /**
         * Include 0 so we reliably get updates when leaving the viewport, and include
         * `threshold` so we detect crossing the “half visible” requirement.
         */
        threshold: [0, threshold],
      }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [
    beforeVisibilityPlay,
    pauseOthers,
    safePause,
    safePlay,
    threshold,
    rootMargin,
    videoId,
  ]);

  return {
    containerRef,
    videoRef,
    userDismissedAutoplay,
    beforeManualPlay,
  };
}
