import { auth } from "@/auth"
import { NextResponse } from "next/server";

export default auth(async (req) => {
    const { nextUrl } = req;
    const path = nextUrl.pathname;
    const isPublic = path === "/login" || path === "/register";

    if (!req.auth && !isPublic) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (req.auth && isPublic) {
        return NextResponse.redirect(new URL("/profile", req.url));
    }
    if (req.auth && path === "/providerDashboard" && req.auth.user?.role !== "PROVIDER") {
        return NextResponse.redirect(new URL("/profile", req.url));
    }
    if (req.auth && path === "/customerDashboard" && req.auth.user?.role !== "CUSTOMER") {
        if (req.auth.user?.role === "PROVIDER") {
            return NextResponse.redirect(new URL("/providerDashboard", req.url));
        }
        return NextResponse.redirect(new URL("/profile", req.url));
    }
    if (req.auth && path === "/profile" && req.auth.user?.role !== "CUSTOMER" && req.auth.user?.role !== "PROVIDER") {
        return NextResponse.redirect(new URL("/login", req.url));
    }
})

export const config = {
    matcher: ["/login", "/register", "/profile", "/providerDashboard", "/customerDashboard"],
}
