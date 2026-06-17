// NavLinks.tsx

import Link from "next/link";
import { NAV_LINKS } from "./navbar.config";

export default function NavLinks() {
  return (
    <nav className="flex items-center gap-8">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="text-sm text-white/70 hover:text-white transition"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}