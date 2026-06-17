// MobileMenu.tsx

"use client";

import { useState } from "react";
import { NAV_LINKS } from "./navbar.config";
import Link from "next/link";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden text-white"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {open && (
        <div className="absolute top-16 left-0 w-full bg-black/90 backdrop-blur-lg p-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}