import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/moderator");

  if (isProtected) {
    // next-auth v5 session cookie name
    const sessionCookie =
      request.cookies.get("authjs.session-token") ||
      request.cookies.get("__Secure-authjs.session-token") ||
      request.cookies.get("next-auth.session-token") ||
      request.cookies.get("__Secure-next-auth.session-token");

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/moderator/:path*"],
};
