"use server";

import { db } from "@/lib/prisma";
import { getUser } from "@/utils/user";
import addSlotValid from "@/validation/ProviderDash/addSlotValid";


export const addSlot = async (
    _prevState: unknown,
    formData: FormData
) => {
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    const date = formData.get("date");
    const idService = formData.get("idService");
    const user = await getUser();
    const result = addSlotValid.safeParse({
        startTime: startTime as string,
        endTime: endTime as string,
        date: date as string,
        idService: idService as string,
    });
    console.log("error", result.error?.flatten().fieldErrors)
    if (!result.success) {
        return { success: false, message: result.error.flatten().fieldErrors as { title?: string[], description?: string[], price?: string[], duration?: string[] } } as const;
    }

    if (!user) {
        return { success: false, message: ["User not found"] } as const;
    }
    try {
        const selectedDate = new Date(result.data.date);

        const parseTime = (timeStr: string) => {
            const match = /^(\d{1,2}):(\d{2})$/.exec(timeStr);
            if (!match) return null;
            const hours = Number(match[1]);
            const minutes = Number(match[2]);
            if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
            if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
            return { hours, minutes } as const;
        };

        const startParts = parseTime(result.data.startTime);
        const endParts = parseTime(result.data.endTime);
        if (!startParts || !endParts || Number.isNaN(selectedDate.getTime())) {
            return { success: false, message: ["Invalid date or time format"] } as const;
        }

        const startAt = new Date(Date.UTC(
            selectedDate.getUTCFullYear(),
            selectedDate.getUTCMonth(),
            selectedDate.getUTCDate(),
            startParts.hours,
            startParts.minutes,
            0,
            0,
        ));
        const endAt = new Date(Date.UTC(
            selectedDate.getUTCFullYear(),
            selectedDate.getUTCMonth(),
            selectedDate.getUTCDate(),
            endParts.hours,
            endParts.minutes,
            0,
            0,
        ));

        if (endAt <= startAt) {
            return { success: false, message: ["End time must be after start time"] } as const;
        }

        const ownService = await db.service.findUnique({
            where: { id: result.data.idService, providerId: user.id },
            select: { id: true },
        });
        if (!ownService) {
            return {
                success: false,
                message: ["Not allowed: The service does not belong to this provider"],
            } as const;
        }

        const overlapping = await db.slot.findFirst({
            where: {
                service: { providerId: user.id },
                startTime: { lt: endAt },
                endTime: { gt: startAt },
            },
        });

        if (overlapping) {
            return {
                success: false,
                message: ["Time conflicts with another slot for the same provider"],
            } as const;
        }

        const service = await db.slot.create({
            data: {
                startTime: startAt,
                endTime: endAt,
                serviceId: result.data.idService,
                isBooked: false,
            }
        });
        console.log("server", service);
        return { success: true, message: ["Slot added successfully"] } as const;
    } catch (error) {
        console.log(error);
        return { success: false, message: ["Failed to add slot"] } as const;
    }
};


