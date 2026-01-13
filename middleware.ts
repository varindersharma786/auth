import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "better-auth/types";

export default async function middleware(request: NextRequest) {
    try {
        const { data } = await betterFetch<{ session: Session; user: { role: string } }>(
            "/api/auth/get-session",
            {
                baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000",
                headers: {
                    //get the cookie from the request
                    cookie: request.headers.get("cookie") || "",
                },
            }
        );

        if (!data?.session) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }

        const user = data.user;

        // RBAC for admin routes
        if (request.nextUrl.pathname.startsWith("/admin")) {
            // Checking for 'admin' or 'ADMIN' depending on your backend role casing
            if (user.role?.toLowerCase() !== "admin") {
                return NextResponse.redirect(new URL("/unauthorized", request.url));
            }
        }
    } catch (error) {
        console.error("Middleware Auth Error:", error);
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*"],
};
