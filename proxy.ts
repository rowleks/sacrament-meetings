import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";
import { auth } from "@/lib/auth";

function isProtectedRoute(pathname: string): boolean {
  if (pathname === "/meetings/new") return true;
  return /^\/meetings\/.+\/edit$/.test(pathname);
}

export default auth((req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  if (isProtectedRoute(pathname) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/meetings", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/meetings/new", "/meetings/:id/edit"],
};
