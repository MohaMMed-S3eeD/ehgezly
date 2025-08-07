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
})

export const config = {
    matcher: ["/login", "/register", "/profile"],
}
