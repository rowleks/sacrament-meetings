import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/auth-actions";
import NavLinks from "./NavLinks";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-soft no-print">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
            Sacrament Planner
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <NavLinks />
          {session?.user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted sm:inline">{session.user.name}</span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/20"
                >
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
