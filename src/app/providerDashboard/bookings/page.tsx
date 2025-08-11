import React from "react";
import { getSlots } from "../_actions/Slot.action";
import type { Slot, Booking } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { confirmBooking, cancelBooking } from "../_actions/Booking.action";

function formatDay(dateISO: string | Date) {
  const d = new Date(dateISO);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(d);
}

function formatTime(dateISO: string | Date) {
  const d = new Date(dateISO);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

const page = async () => {
  const slotsRes = await getSlots();
  if (!slotsRes.success) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <p className="mt-2 text-rose-600">Failed to load slots</p>
      </div>
    );
  }
  type SlotItem = Slot & {
    service?: { id: string; title: string } | null;
    booking?:
      | (Booking & {
          customer: { id: string; name: string | null; email: string | null };
        })
      | null;
  };
  const slots = slotsRes.data as unknown as SlotItem[];

  // نعرض فقط الحجوزات الفعلية (Pending أو Confirmed) ونستبعد الملغاة
  const bookedOnly = slots.filter(
    (s) => s.booking && s.booking.status !== "CANCELLED"
  );

  // تجميع حسب اليوم (بناءً على تاريخ البداية المحلي)
  const groups = bookedOnly.reduce<Record<string, SlotItem[]>>((acc, s) => {
    const d = new Date(s.startTime);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
    if (!acc[key]) acc[key] = [] as SlotItem[];
    acc[key].push(s);
    return acc;
  }, {});
  const dayKeys = Object.keys(groups).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Bookings</h1>
      <p className="mt-1 text-muted-foreground">
        All your appointments with their status.
      </p>

      <div className="mt-6 space-y-6">
        {dayKeys.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No bookings yet.
          </div>
        ) : (
          dayKeys.map((key) => (
            <div key={key} className="rounded-xl border bg-card/50 shadow-sm">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="text-sm font-medium">{formatDay(key)}</div>
                <div className="text-xs text-muted-foreground">
                  {groups[key].length} bookings
                </div>
              </div>
              <ul className="divide-y">
                {groups[key].map((s) => {
                  const booking = s.booking || undefined;
                  const service = s.service || undefined;
                  const status = booking?.status;
                  const { label, cls } = (() => {
                    if (status === "PENDING")
                      return { label: "Pending", cls: "bg-amber-100 text-amber-700" } as const;
                    if (status === "CONFIRMED")
                      return { label: "Confirmed", cls: "bg-emerald-100 text-emerald-700" } as const;
                    if (status === "CANCELLED")
                      return { label: "Cancelled", cls: "bg-rose-100 text-rose-700" } as const;
                    return { label: "Booked", cls: "bg-slate-100 text-slate-700" } as const;
                  })();
                  return (
                    <li
                      key={s.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            cls
                          }`}
                        >
                          {label}
                        </span>
                        <div className="text-sm">
                          {formatTime(s.startTime)} - {formatTime(s.endTime)}
                          {service?.title ? (
                            <span className="ml-2 text-muted-foreground">
                              • {service.title}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {booking?.customer ? (
                            <span>
                              Booked by: {booking.customer.name || booking.customer.email}
                            </span>
                          ) : null}
                        </div>
                        {status === "PENDING" ? (
                          <div className="flex items-center gap-2 sm:ml-auto">
                            <form action={cancelBooking}>
                              <input type="hidden" name="bookingId" value={booking!.id} />
                              <Button variant="outline" className="hover:bg-[#C9194D] hover:text-white">
                                Reject
                              </Button>
                            </form>
                            <form action={confirmBooking}>
                              <input type="hidden" name="bookingId" value={booking!.id} />
                              <Button variant="outline" className="hover:bg-[#007A55] hover:text-white">
                                Accept
                              </Button>
                            </form>
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default page;
