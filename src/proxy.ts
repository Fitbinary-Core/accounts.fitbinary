import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ["/signin", "/signup"];

  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (!refreshToken) {
    if (publicPaths.includes(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (refreshToken && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
