"use server";

import { db } from "@/lib/prisma";
import { getUser } from "@/utils/user";
import addSlotValid from "@/validation/ProviderDash/addSlotValid";
import { revalidatePath } from "next/cache";


export const addSlot = async (
    _prevState: unknown,
    formData: FormData
) => {
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    const date = formData.get("date");
    const tzOffsetStr = formData.get("tzOffset"); // fallback
    const tzOffsetStartStr = formData.get("tzOffsetStart");
    const tzOffsetEndStr = formData.get("tzOffsetEnd");
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
        // Parse local date (YYYY-MM-DD) and local times, then convert to UTC using tzOffset
        const parseDateYMD = (dateStr: string) => {
            const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
            if (!m) return null;
            const year = Number(m[1]);
            const month = Number(m[2]);
            const day = Number(m[3]);
            if (
                Number.isNaN(year) ||
                Number.isNaN(month) ||
                Number.isNaN(day) ||
                month < 1 ||
                month > 12 ||
                day < 1 ||
                day > 31
            )
                return null;
            return { year, month, day } as const;
        };

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
        const ymd = parseDateYMD(result.data.date);
        if (!startParts || !endParts || !ymd) {
            return { success: false, message: ["Invalid date or time format"] } as const;
        }

        const tzOffsetStartMinutes = (() => {
            const n = Number(tzOffsetStartStr);
            if (Number.isFinite(n)) return n;
            const fb = Number(tzOffsetStr);
            return Number.isFinite(fb) ? fb : 0;
        })();
        const tzOffsetEndMinutes = (() => {
            const n = Number(tzOffsetEndStr);
            if (Number.isFinite(n)) return n;
            const fb = Number(tzOffsetStr);
            return Number.isFinite(fb) ? fb : 0;
        })();

        // Build UTC instants from local Y-M-D and local time components by adding tzOffset minutes
        const startMsUTC = Date.UTC(
            ymd.year,
            ymd.month - 1,
            ymd.day,
            startParts.hours,
            startParts.minutes,
            0,
            0,
        ) + tzOffsetStartMinutes * 60_000;
        const endMsUTC = Date.UTC(
            ymd.year,
            ymd.month - 1,
            ymd.day,
            endParts.hours,
            endParts.minutes,
            0,
            0,
        ) + tzOffsetEndMinutes * 60_000;

        const startAt = new Date(startMsUTC);
        const endAt = new Date(endMsUTC);

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
        // إعادة التحقق من المسارات التي قد تعرض slots
        revalidatePath(`/providerDashboard/addSlot/${result.data.idService}`);
        revalidatePath('/providerDashboard');
        revalidatePath('/providerDashboard/bookings');
        return { success: true, message: ["Slot added successfully"] } as const;
    } catch (error) {
        console.log(error);
        return { success: false, message: ["Failed to add slot"] } as const;
    }
};

export const getSlots = async () => {
    const user = await getUser();
    if (!user) {
        return { success: false, message: ["User not found"] } as const;
    }
    const slots = await db.slot.findMany({
        where: { service: { providerId: user.id } },
    });
    return { success: true, data: slots } as const;
};

