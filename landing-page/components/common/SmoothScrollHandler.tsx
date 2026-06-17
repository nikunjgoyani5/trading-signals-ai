"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function SmoothScrollHandler() {
  const pathname = usePathname();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "auto";
    }

    // Initial page load / refresh
    if (isFirstMount.current) {
      // window.scrollTo(0, 0);
      isFirstMount.current = false;

      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }

      return;
    }

    // Route navigation with hash
    const hash = window.location.hash;

    if (hash) {
      const id = hash.replace("#", "");

      const timeoutId = setTimeout(() => {
        const el = document.getElementById(id);

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    } else {
      // Normal route navigation (like /blogs)
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor &&
        anchor.hash &&
        anchor.origin === window.location.origin &&
        anchor.pathname === window.location.pathname
      ) {
        const id = anchor.hash.replace("#", "");
        const el = document.getElementById(id);

        if (el) {
          e.preventDefault();

          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          window.history.pushState(null, "", anchor.hash);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return null;
}