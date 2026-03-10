import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("tenant_refresh_token")?.value;

  const { pathname } = request.nextUrl;

  const publicRoutes = [
    "/signin",
    "/signup",
    "/forget-password",
    "/api",
    "/_next",
    "/favicon.ico",
    "/images",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isPublicRoute && !refreshToken && pathname !== "/") {
    const url = new URL("/signin", request.url);
    return NextResponse.redirect(url);
  }

  if (pathname === "/" && !refreshToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (refreshToken && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
