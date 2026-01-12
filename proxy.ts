import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "better-auth/types";

export default async function proxy(request: NextRequest) {
    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin,
            headers: {
                //get the cookie from the request
                cookie: request.headers.get("cookie") || "",
            },
        }
    );

    if (!session) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const user = (session as unknown as { user: { role: string } }).user;

    // RBAC for admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
        // Checking for 'admin' or 'ADMIN' depending on your backend role casing
        if (user.role?.toLowerCase() !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*"],
};
