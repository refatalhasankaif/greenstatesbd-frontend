import { NextRequest, NextResponse } from "next/server";
import {
    isPublicRoute,
    isAuthRoute,
    isUserRoute,
    isDashboardRoute,
    canAccessRoute,
    isAdminRole,
    getDefaultRedirectPath,
    type UserRole,
} from "@/lib/proxy";

async function getAuthUser(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value;
        if (!token) {
            return null;
        }


        const cacheKey = `auth_${token.substring(0, 20)}`;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },

                next: { revalidate: 60 },
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.data?.user || data.data || null;
    } catch (error) {
        console.error("Auth verification error:", error);
        return null;
    }
}

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;


    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }


    const user = await getAuthUser(request);


    if (!user) {

        if (isAuthRoute(pathname)) {
            return NextResponse.next();
        }


        if (isUserRoute(pathname) || pathname.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/login", request.url));
        }


        return NextResponse.redirect(new URL("/login", request.url));
    }


    if (isAuthRoute(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }


    if (!canAccessRoute(pathname, user.role as UserRole)) {

        if (isDashboardRoute(pathname) && !isAdminRole(user.role as UserRole)) {
            return NextResponse.redirect(new URL("/", request.url));
        }


        if (isAdminRole(user.role as UserRole)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        const redirectPath = getDefaultRedirectPath(user.role as UserRole);
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|logo.png|bd-gov.png|video.mp4|hero/).*)",
    ],
};
