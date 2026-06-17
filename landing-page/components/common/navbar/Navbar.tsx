"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Container from "@/components/common/container/Container";
import { AnimatePresence, motion } from "framer-motion";
import MagneticLoginButton from "@/components/common/Magneticloginbutton"; // ← adjust path as needed

const languages = [
  { code: "en", name: "EN", full: "English", flag: "https://flagcdn.com/us.svg" },
  { code: "th", name: "TH", full: "ภาษาไทย", flag: "https://flagcdn.com/th.svg" },
  { code: "pl", name: "PL", full: "Polski", flag: "https://flagcdn.com/pl.svg" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    const syncScrolled = () => {
      setScrolled(window.scrollY > 20);
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        syncScrolled();
        ticking.current = false;
      });
    };

    syncScrolled();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", syncScrolled);
    window.addEventListener("pageshow", syncScrolled);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", syncScrolled);
      window.removeEventListener("pageshow", syncScrolled);
    };
  }, []);

  const navLinks = [
    { label: t("navbar.features"), href: "/#features" },
    { label: t("navbar.strategies"), href: "/#strategies" },
    { label: t("navbar.testimonials"), href: "/#testimonials" },
    { label: t("navbar.faq"), href: "/#faq" },
    { label: t("navbar.blog"), href: "/blogs" },
  ];

  return (
    <nav
      className={[
        "fixed top-0 left-0 w-full z-[9999] isolate transition-all duration-500 ease-in-out",
        !scrolled && "bg-transparent py-5 border-b border-transparent",
        scrolled && "bg-transparent/70 backdrop-blur-xl py-3 border-b border-white/10",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Container className="h-16 flex items-center ">

        {/* Logo */}
        <div className="flex-none">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logofi.svg"
              alt="Trading Signals AI"
              width={120}
              height={120}
              className="w-35 md:w-36 lg:w-40 xl:w-48"
              priority
            />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex flex-1 items-center justify-center gap-3 xl:gap-8 2xl:gap-10">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm font-medium text-white font-medium hover:text-white transition-colors font-hoves"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center flex-none gap-4">

          {/* ── Upgraded Login Button ── */}
          <MagneticLoginButton href="https://crypto.tradingsignals.ai/login" />

          {/* Language Selector Desktop */}
          <div className="relative flex items-center" ref={langRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm"
              aria-label="Select Language"
            >
              <img
                src={languages.find(l => l.code === (i18n.language?.split("-")[0] || "en"))?.flag || "https://flagcdn.com/us.svg"}
                alt="flag"
                className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm"
              />
              <span className="text-sm font-medium text-white uppercase">
                {languages.find(l => l.code === (i18n.language?.split("-")[0] || "en"))?.code || "en"}
              </span>
              <svg
                className={`w-3 h-3 text-white/70 transition-transform duration-200 ${langMenuOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 right-0 bg-[#0A1129]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col min-w-[70px] z-[60]"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`px-5 py-3 hover:bg-white/10 transition-colors flex items-center gap-3 cursor-pointer ${
                        (i18n.language?.split("-")[0] || "en") === lang.code ? "bg-white/5" : ""
                      }`}
                    >
                      <img src={lang.flag} alt={lang.code} className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm" />
                      <span className="text-sm font-medium text-gray-200 whitespace-nowrap">{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden ml-auto">
          <button
            className="text-white p-2 hover:bg-white/5 rounded-full transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {mobileOpen ? (
                <path d="M6 18L18 6M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 6H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 18H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile Menu — static login link, no motion effects on touch ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 lg:hidden bg-[#010B24]/98 backdrop-blur-2xl z-40 flex flex-col h-[calc(100vh)] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <Link href="/" className="flex items-center gap-2 py-3" onClick={() => setMobileOpen(false)}>
                <Image
                  src="/logofi.svg"
                  alt="Trading Signals AI"
                  width={120}
                  height={120}
                  className="w-35"
                />
              </Link>
              <button
                className="text-white p-2 hover:bg-white/5 rounded-full transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col pb-0 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-300 hover:text-white text-lg font-medium py-3 border-b border-white/5 font-hoves"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto p-6 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="https://crypto.tradingsignals.ai/login"
                  className="w-full text-center px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all font-hoves"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("navbar.login")}
                </Link>
                <Link
                  href="/"
                  className="w-full text-center px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all font-hoves"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("navbar.signup")}
                </Link>
              </div>

              {/* Mobile Language Selector */}
              <div className="flex justify-center gap-4 py-6 border-t border-white/10">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setMobileOpen(false);
                    }}
                    className={`flex flex-col items-center gap-2 transition-all duration-300 active:scale-[0.95] p-3 rounded-xl min-w-[80px] ${
                      (i18n.language?.split("-")[0] || "en") === lang.code
                        ? "bg-white/10 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={lang.flag}
                      alt={lang.code}
                      className={`w-10 h-7 object-cover rounded-[3px] shadow-sm ${
                        (i18n.language?.split("-")[0] || "en") === lang.code ? "" : "grayscale hover:grayscale-0"
                      }`}
                    />
                    <span className="text-sm font-medium text-white">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}