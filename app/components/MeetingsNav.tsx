"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function MeetingsNav() {
  const pathname = usePathname();

  const isAll = pathname === "/meetings";
  const isUpcoming = pathname === "/meetings/upcoming";
  const isPast = pathname === "/meetings/past";
  const isCurrent = pathname === "/meetings/current";

  const base = "px-3 py-1.5 rounded-md text-sm transition-colors";
  const active = "bg-primary/10 text-primary border border-primary/20";
  const inactive = "border border-border text-muted hover:bg-secondary/20";

  return (
    <nav className="flex flex-wrap gap-2 text-sm" aria-label="Meeting sections">
      <Link href="/meetings/current" className={`${base} ${isCurrent ? active : inactive}`}>
        Current
      </Link>
      <Link href="/meetings" className={`${base} ${isAll ? active : inactive}`}>
        All
      </Link>
      <Link href="/meetings/upcoming" className={`${base} ${isUpcoming ? active : inactive}`}>
        Upcoming
      </Link>
      <Link href="/meetings/past" className={`${base} ${isPast ? active : inactive}`}>
        Past
      </Link>
    </nav>
  );
}
