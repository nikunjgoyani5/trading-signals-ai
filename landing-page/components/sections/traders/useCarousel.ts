"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";

interface UseCarouselOptions {
  loop?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  duration?: number;
  dragFree?: boolean;
}

export function useCarousel({
  loop = true,
  autoplay = true,
  autoplayDelay = 4500,
  duration = 28,
  dragFree = false,
}: UseCarouselOptions = {}) {
  /**
   * Stable autoplay plugin ref — recreating this on render causes jitter
   * and breaks the stopOnMouseEnter / resume cycle.
   */
  const autoplayPlugin = useRef(
    Autoplay({
      delay: autoplayDelay,
      stopOnInteraction: false,   // don't kill autoplay on drag; resume after
      stopOnMouseEnter: true,     // pause on hover
      stopOnFocusIn: true,        // pause on keyboard focus
      playOnInit: true,
    })
  );

  const options: EmblaOptionsType = useMemo(
    () => ({
      loop,
      align: "start",
      duration,
      skipSnaps: false,
      dragFree,
      watchDrag: true,
      watchResize: true,
    }),
    [loop, duration, dragFree]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    options,
    autoplay ? [autoplayPlugin.current] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const updateSelected = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    updateSelected(emblaApi);
    emblaApi.on("select", updateSelected);
    emblaApi.on("reInit", updateSelected);

    return () => {
      emblaApi.off("select", updateSelected);
      emblaApi.off("reInit", updateSelected);
    };
  }, [emblaApi, updateSelected]);

  /**
   * After manual navigation, reset the autoplay timer so the card the user
   * just navigated to gets its full dwell time before advancing.
   */
  const restartAutoplay = useCallback(() => {
    if (!autoplay) return;
    autoplayPlugin.current?.reset();
  }, [autoplay]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    restartAutoplay();
  }, [emblaApi, restartAutoplay]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    restartAutoplay();
  }, [emblaApi, restartAutoplay]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
      restartAutoplay();
    },
    [emblaApi, restartAutoplay]
  );

  return {
    emblaRef,
    emblaApi,
    selectedIndex,
    scrollPrev,
    scrollNext,
    scrollTo,
  };
}