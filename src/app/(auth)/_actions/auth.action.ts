"use server";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/prisma";
import { LoginSchema, RegisterSchema } from "@/validation/auth/auth";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath, revalidateTag } from "next/cache";

type LoginType = {
    email: string;
    password: string;
}
type RegisterType = {
    name: string;
    email: string;
    password: string;
    role: string;
}

export const LoginAction = async (formData: LoginType) => {
    const { email, password } = formData;
    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success) {
        return { error: validation.error.message };
    }

    try {
        const user = await db.user.findUnique({
            where: {
                email: email,
            }
        });
        if (!user) {
            return { error: "User not found" };
        }
        const isPasswordValid = await bcrypt.compare(password, user.password as string);
        if (!isPasswordValid) {
            return { error: "Invalid password" };
        }
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        revalidatePath("/profile");
        revalidatePath("/providerDashboard");
        revalidatePath("/customerDashboard");
        revalidateTag("header");
    } catch (error) {
        console.log(error);
        return { error: "Login failed" };
    }
    return { success: "Login successful" };

}
export const RegisterAction = async (formData: RegisterType) => {
    const { name, email, password, role } = formData;
    const validation = RegisterSchema.safeParse({ name, email, password, role });
    if (!validation.success) {
        return { error: validation.error.message };
    }
    try {
        const existingUser = await db.user.findUnique({
            where: {
                email: email,
            },
        });
        if (existingUser) {
            return { error: "User already exists" };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                role: role as Role,
            },
        });
        return { success: "Register successful", user };
    } catch (error) {
        console.log(error);
        return { error: "Register failed" };
    }
}
export const LogoutAction = async () => {
    await signOut({ redirectTo: "/login" });
}