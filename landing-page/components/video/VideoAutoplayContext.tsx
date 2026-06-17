"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

/** Pause callback registered per video id (must use each instance’s “safe” programmatic pause). */
export type VideoAutoplayPauseFn = () => void;

type VideoAutoplayContextValue = {
  /**
   * Registers a video’s programmatic pause handler. Unregister on unmount to avoid leaks.
   */
  register: (id: string, pause: VideoAutoplayPauseFn) => () => void;
  /**
   * Pauses every registered video except `exceptId`. Call right before playing a clip
   * so only one video is ever audible/playing at a time.
   */
  pauseOthers: (exceptId: string) => void;
};

const VideoAutoplayContext = createContext<VideoAutoplayContextValue | null>(
  null
);

export function VideoAutoplayProvider({ children }: { children: ReactNode }) {
  const registryRef = useRef(new Map<string, VideoAutoplayPauseFn>());

  const register = useCallback((id: string, pause: VideoAutoplayPauseFn) => {
    registryRef.current.set(id, pause);
    return () => {
      registryRef.current.delete(id);
    };
  }, []);

  const pauseOthers = useCallback((exceptId: string) => {
    registryRef.current.forEach((pause, regId) => {
      if (regId !== exceptId) {
        pause();
      }
    });
  }, []);

  const value = useMemo(
    () => ({ register, pauseOthers }),
    [register, pauseOthers]
  );

  return (
    <VideoAutoplayContext.Provider value={value}>
      {children}
    </VideoAutoplayContext.Provider>
  );
}

export function useVideoAutoplayCoordinator() {
  const ctx = useContext(VideoAutoplayContext);
  if (!ctx) {
    throw new Error(
      "useVideoAutoplayCoordinator must be used within VideoAutoplayProvider"
    );
  }
  return ctx;
}
