import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const proxy = async (request: NextRequest) => {
    // const cookieStore = await cookies();
    // const refresh_token = cookieStore.get("refresh_token")?.value;
    // const { pathname } = request.nextUrl;

    // if (!refresh_token) {
    //     if (pathname === "/login") {
    //         return NextResponse.next();
    //     }

    //     return NextResponse.redirect(new URL("/login", request.url));
    // }

    // if (pathname === "/login") {
    //     return NextResponse.redirect(new URL("/admin", request.url));
    // }

    // return NextResponse.next();
};

export const config = {
    matcher: ["/login", "/admin/:path*"],
};
