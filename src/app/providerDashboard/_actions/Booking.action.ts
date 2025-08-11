"use server";

import { db } from "@/lib/prisma";
import { getUser } from "@/utils/user";
import { revalidatePath } from "next/cache";

export const confirmBooking = async (
  formData: FormData
): Promise<void> => {
  const bookingId = String(formData.get("bookingId") || "").trim();
  if (!bookingId) return;

  const user = await getUser();
  if (!user) return;

  try {
    await db.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        select: { id: true, status: true, slotId: true, service: { select: { providerId: true } } },
      });
      if (!booking) throw new Error("Booking not found");
      if (booking.service.providerId !== user.id) throw new Error("Not allowed");
      if (booking.status === "CANCELLED") throw new Error("Booking already cancelled");

      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "CONFIRMED" },
      });
      await tx.slot.update({ where: { id: booking.slotId }, data: { isBooked: true } });
    });

    revalidatePath("/providerDashboard/bookings");
    revalidatePath("/providerDashboard");
  } catch (err) {
    console.error(err);
  }
};

export const cancelBooking = async (
  formData: FormData
): Promise<void> => {
  const bookingId = String(formData.get("bookingId") || "").trim();
  if (!bookingId) return;

  const user = await getUser();
  if (!user) return;

  try {
    await db.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        select: { id: true, status: true, slotId: true, service: { select: { providerId: true } } },
      });
      if (!booking) throw new Error("Booking not found");
      if (booking.service.providerId !== user.id) throw new Error("Not allowed");

      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED" },
      });
      await tx.slot.update({ where: { id: booking.slotId }, data: { isBooked: false } });
    });

    revalidatePath("/providerDashboard/bookings");
    revalidatePath("/providerDashboard");
  } catch (err) {
    console.error(err);
  }
};


