import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const safeCallback = callbackUrl?.startsWith("/") ? callbackUrl : undefined;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4">
      <div className="rounded-xl border border-border bg-white p-8 shadow-card">
        <h1 className="text-2xl font-semibold text-foreground">Sign In</h1>
        <p className="mt-1 text-sm text-muted">
          Access your ward sacrament meeting planner.
        </p>
        <div className="mt-6">
          <LoginForm callbackUrl={safeCallback} />
        </div>
      </div>
    </div>
  );
}
