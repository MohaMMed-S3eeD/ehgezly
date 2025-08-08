"use server";

import { db } from "@/lib/prisma";
import { getUser } from "@/utils/user";
import addServiceValid from "@/validation/ProviderDash/addServiceValid";

export const addService = async (
    _prevState: unknown,
    formData: FormData
) => {
    const title = formData.get("title");
    const description = formData.get("description");
    const price = formData.get("price");
    const duration = formData.get("duration");
    const user = await getUser();
    const result = addServiceValid.safeParse({
        title: title as string,
        description: description as string,
        price: Number(price),
        duration: Number(duration),
    });
    console.log(result.error?.flatten().fieldErrors)
    if (!result.success) {
        return { success: false, message: result.error.flatten().fieldErrors as { title?: string[], description?: string[], price?: string[], duration?: string[] } } as const;
    }

    if (!user) {
        return { success: false, message: ["User not found"] } as const;
    }
    try {
        const service = await db.service.create({
            data: {
                title: title as string,
                description: description as string,
                price: Number(price),
                providerId: user.id,
                duration: Number(duration),
            },
        });
        console.log("server", service);

        return { success: true, message: ["Service added successfully"] } as const;
    } catch (error) {
        console.log(error);
        return { success: false, message: ["Failed to add service"] } as const;
    }
};