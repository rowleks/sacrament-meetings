import Link from "next/link";
import NavLinks from "./NavLinks";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-soft no-print">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
            Sacrament Planner
          </span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
