
"use server";

import { db } from "@/lib/prisma";
import { getUser } from "@/utils/user";
import addServiceValid from "@/validation/ProviderDash/addServiceValid";
import { revalidatePath } from "next/cache";

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
        revalidatePath("/providerDashboard");
        return { success: true, message: ["Service added successfully"] } as const;
    } catch (error) {
        console.log(error);
        return { success: false, message: ["Failed to add service"] } as const;
    }
};


export const editService = async (
    _prevState: unknown,
    formData: FormData
) => {
    const id = formData.get("id");
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
        const service = await db.service.update({
            where: { id: id as string },
            data: {
                title: title as string,
                description: description as string,
                price: Number(price),
                duration: Number(duration),
            },
        });
        console.log("server", service);
        revalidatePath("/providerDashboard");
        return { success: true, message: ["Service updated successfully"] } as const;
    } catch (error) {
        console.log(error);
        return { success: false, message: ["Failed to update service"] } as const;
    }
};

export const deleteService = async (
    _prevState: unknown,
    formData: FormData
) => {
    const id = formData.get("id");
    const user = await getUser();
    if (!user) {
        return { success: false, message: ["User not found"] } as const;
    }
    try {
        const service = await db.service.delete({
            where: { id: id as string },
        });
        console.log("server", service);
        revalidatePath("/providerDashboard");
        return { success: true, message: ["Service deleted successfully"] } as const;
    } catch (error) {
        console.log(error);
        return { success: false, message: ["Failed to delete service"] } as const;
    }
};

export const getServicesToProvider = async () => {
    const user = await getUser();
    if (!user) {
        return { success: false, message: ["User not found"] } as const;
    }
    try {
        const services = await db.service.findMany({
            where: { providerId: user.id },
            include: {
                slots: true,
            },
        });
        return { success: true, data: services } as const;
    } catch (error) {
        console.log(error);
        return { success: false, message: ["Failed to fetch services"] } as const;
    }
};
export const getServiceById = async (id: string) => {

    try {
        const service = await db.service.findUnique({
            where: { id },
            include: {
                slots: true,
            },
        });
        return { success: true, data: service } as const;
    } catch (error) {
        console.log(error);
        return { success: false, message: ["Failed to fetch service"] } as const;
    }
};

export const getServices = async () => {
    const user = await getUser();
    if (!user) {
        return { success: false, message: ["User not found"] } as const;
    }
    try {
        const services = await db.service.findMany({
            include: {
                slots: true,
                provider: true,
            },
        });
        return { success: true, data: services } as const;
    } catch (error) {
        console.log(error);
        return { success: false, message: ["Failed to fetch services"] } as const;
    }
};