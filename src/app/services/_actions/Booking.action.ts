"use server";

import { db } from "@/lib/prisma";
import { getUser } from "@/utils/user";
import { revalidatePath } from "next/cache";

export type BookSlotState =
  | { success: true; message: string[] }
  | { success: false; message: string[] };

export const bookSlot = async (
  _prevState: unknown,
  formData: FormData
): Promise<BookSlotState> => {
  const serviceId = String(formData.get("serviceId") || "").trim();
  const slotId = String(formData.get("slotId") || "").trim();

  const user = await getUser();
  if (!user) {
    return { success: false, message: ["Please sign in first"] } as const;
  }
  if (!serviceId || !slotId) {
    return { success: false, message: ["Missing booking data"] } as const;
  }

  try {
    await db.$transaction(async (tx) => {
      const slot = await tx.slot.findUnique({
        where: { id: slotId },
        select: { id: true, isBooked: true, serviceId: true },
      });

      if (!slot) {
        throw new Error("Slot not found");
      }
      if (slot.serviceId !== serviceId) {
        throw new Error("Slot doesn't belong to this service");
      }
      if (slot.isBooked) {
        throw new Error("Slot already booked");
      }

      await tx.booking.create({
        data: {
          customerId: user.id,
          serviceId,
          slotId,
          status: "PENDING",
        },
      });

      await tx.slot.update({ where: { id: slotId }, data: { isBooked: true } });
    });

    revalidatePath(`/services/${serviceId}`);
    revalidatePath("/services");
    revalidatePath("/profile");

    return { success: true, message: ["Booked successfully"] } as const;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create booking";
    return { success: false, message: [msg] } as const;
  }
};


