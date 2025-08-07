import { auth, auth as middleware } from "@/auth"
import { NextResponse } from "next/server";

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
