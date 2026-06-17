"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Container from "@/components/common/container/Container";

const productLinks = [
  { key: "features", href: "/#features" },
  { key: "strategies", href: "/#strategies" },
  { key: "testimonials", href: "/#testimonials" },
  { key: "faq", href: "/#faq" },
  { key: "contact", href: "/#contact" },
];

const legalLinks = [
  { key: "privacy", href: "/privacy-policy" },
  { key: "terms", href: "/terms-of-service" },
  { key: "risk", href: "/risk" },
  { key: "cookie", href: "/cookies" },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full">
      {/* Animated Glow: Positioned at the top to create a lush, breathing effect */}
      <motion.div
        initial={{ opacity: 0.3, scale: 0.8 }}
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [0.8, 1.1, 0.8],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-1/8 w-3/4 max-w-4xl xl:max-w-5xl 2xl:max-w-6xl h-40 bg-dark-blue blur-[120px] rounded-full z-0 pointer-events-none"
      />

      <footer className="bg-[#010B24] border-t border-white/5 relative overflow-hidden ">
        {/* Main Content: 
        Needs 'relative z-10' to ensure it renders on top of the z-0 glow. 
      */}
        <Container className="max-h-fit relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row lg:justify-between gap-12 lg:gap-10 section-py">
            {/* Brand Column */}
            <div className="flex flex-col gap-6 max-w-sm sm:mx-0 mx-auto items-center sm:items-start">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <Image
                  src="/logofi.svg"
                  alt="Trading Signals AI"
                  width={130}
                  height={130}
                  className="shrink-0  w-43"
                  priority
                />
              </Link>

              {/* Description */}
              <p className="card-desc-size2 text-start">
                {t("footer.description")}
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-4">
                {/* Telegram */}
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-11 h-11 rounded-[10px] bg-[#0A1435] border border-white/10 text-cyan-blue hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-300"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="xl:w-6 xl:h-6">
                     <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
                  </svg>
                </a>
                
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-11 h-11 rounded-[10px] bg-[#0A1435] border border-white/10 text-cyan-blue hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-300"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="xl:w-5.5 xl:h-5.5">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="flex gap-16 md:gap-24 lg:gap-24 lg:justify-start justify-center">
              {/* Product */}
              <div className="flex flex-col gap-5">
                <h4 className="text-white text-[11px] xl:text-xs 2xl:text-sm font-normal tracking-[0.2em] uppercase opacity-90 font-hoves">
                  {t("footer.sections.product")}
                </h4>
                <ul className="flex flex-col gap-3.5">
                  {productLinks.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-[#C7CCD2] text-[13.5px] xl:text-base  hover:text-white transition-all duration-200 font-hoves"
                      >
                        {t(`footer.links.${link.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div className="flex flex-col gap-5">
                <h4 className="text-white text-[11px] xl:text-xs 2xl:text-sm font-normal tracking-[0.2em] uppercase opacity-90 font-hoves">
                  {t("footer.sections.legal")}
                </h4>
                <ul className="flex flex-col gap-3.5">
                  {legalLinks.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-[#C7CCD2] text-[13.5px] xl:text-base hover:text-white transition-all duration-200 font-hoves"
                      >
                        {t(`footer.links.${link.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
       

        {/* Bottom Bar */}
        <div className="border-t pb-7 mx-auto border-[#343445] border-dashed relative z-10 ">
          <div className=" mx-auto  py-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-[#C7CCD2] text-xs xl:text-sm 2xl:text-base font-hoves">
              {t("footer.copyright")}
            </p>
            <p className="text-[#C7CCD2] max-w-150 xl:max-w-160 3xl:max-w-180 card-desc-size2 sm:text-right">
              {t("footer.disclaimer")}
            </p>
          </div>
        </div>
      </Container>
      </footer>
    </div>
  );
}