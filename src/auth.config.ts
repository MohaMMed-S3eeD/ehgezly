import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { db } from "./lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

export default {
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
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const dbUser = await db.user.findUnique({
                    where: { id: user.id },
                    select: { role: true }
                });
                token.role = dbUser?.role || "CUSTOMER";
                token.sub = user.id; // تأكد من وجود user id
            }
            return token;
        },
        async session({ session, token }) {
            if (token.role && session.user) {
                session.user.role = token.role as Role;
                session.user.id = token.sub as string;
            }
            return session;
        },
    },
} satisfies NextAuthConfig