"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/meetings", label: "Meetings" },
  // { href: '/members', label: 'Members' },
  // { href: '/settings', label: 'Settings' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary/20"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
