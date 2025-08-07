import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        signOut: "/login",
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl + "/login"
        },
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const { email, password } = credentials as { email: string, password: string }
                try {
                    const user = await db.user.findUnique({
                        where: {
                            email: email,
                        },

                    });
                    if (!user) {
                        return null;
                    }
                    const isPasswordValid = await bcrypt.compare(password, user.password as string);
                    if (!isPasswordValid) {
                        return null;
                    }
                    return user;
                } catch (error) {
                    console.log(error);
                    return null;
                }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],

})