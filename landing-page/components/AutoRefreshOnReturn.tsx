"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefreshOnReturn() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const mounted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      mounted.current = true;
    }, 1000);

    const refreshPage = () => {
      if (mounted.current && !isPending) {
        startTransition(() => {
          router.refresh();
        });
      }
    };

    const handleVisibility = () => {
      if (
        mounted.current &&
        document.visibilityState === "visible" &&
        !isPending
      ) {
        startTransition(() => {
          router.refresh();
        });
      }
    };

    // window.addEventListener("focus", refreshPage);
    // document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearTimeout(timer);
      // window.removeEventListener("focus", refreshPage);
      // document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [router, isPending]);

  return null;
}