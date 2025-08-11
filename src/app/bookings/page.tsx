import React from "react";
import { getUser } from "@/utils/user";
import { db } from "@/lib/prisma";

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
  const user = await getUser();
  if (!user) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">My Bookings</h1>
        <p className="mt-2 text-muted-foreground">Please sign in to view your bookings.</p>
      </div>
    );
  }

  const bookings = await db.booking.findMany({
    where: { customerId: user.id },
    include: {
      service: {
        select: {
          id: true,
          title: true,
          provider: { select: { id: true, name: true, email: true } },
        },
      },
      slot: { select: { id: true, startTime: true, endTime: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // تجميع حسب يوم الموعد
  const groups = bookings.reduce<Record<string, typeof bookings>>((acc, b) => {
    const d = new Date(b.slot.startTime);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
    if (!acc[key]) acc[key] = [] as unknown as typeof bookings;
    (acc[key] as unknown as typeof bookings).push(b);
    return acc;
  }, {} as Record<string, typeof bookings>);
  const dayKeys = Object.keys(groups).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">My Bookings</h1>
      <p className="mt-1 text-muted-foreground">Your upcoming and past appointments.</p>

      <div className="mt-6 space-y-6">
        {bookings.length === 0 ? (
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
                {groups[key].map((b) => {
                  const status = b.status;
                  const { label, cls } = (() => {
                    if (status === "PENDING")
                      return { label: "Pending", cls: "bg-amber-100 text-amber-700" } as const;
                    if (status === "CONFIRMED")
                      return { label: "Confirmed", cls: "bg-emerald-100 text-emerald-700" } as const;
                    if (status === "CANCELLED")
                      return { label: "Cancelled", cls: "bg-rose-100 text-rose-700" } as const;
                    return { label: status, cls: "bg-slate-100 text-slate-700" } as const;
                  })();
                  return (
                    <li
                      key={b.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${cls}`}
                        >
                          {label}
                        </span>
                        <div className="text-sm">
                          {formatTime(b.slot.startTime)} - {formatTime(b.slot.endTime)}
                          <span className="ml-2 text-muted-foreground">• {b.service.title}</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        Provider: {b.service.provider?.name || b.service.provider?.email || "Unknown"}
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
