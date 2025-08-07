import { auth } from "@/auth"
import { NextResponse } from "next/server";
import authConfig from "./auth.config"
import NextAuth from "next-auth";

export const { auth: middleware } = NextAuth(authConfig)
export default middleware(async (req) => {
    const { nextUrl } = req;
    const path = nextUrl.pathname;
    const isPublic = path === "/login" || path === "/register";
    const session = await auth();
    if (!session && !isPublic) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session && isPublic) {
        return NextResponse.redirect(new URL("/profile", req.url));
    }
})

export const config = {
    matcher: ["/login", "/register", "/profile"],
}
