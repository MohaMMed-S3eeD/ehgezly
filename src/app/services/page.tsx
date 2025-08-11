import React from "react";
import { getServices } from "../providerDashboard/_actions/Service.action";
import { CalendarDays, Clock, DollarSign, User2 } from "lucide-react";
import Link from "next/link";

function formatPriceEGP(value: number) {
  try {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value} EGP`;
  }
}

function formatTimeRange(start: Date, end: Date) {
  try {
    const startStr = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(start);
    const endStr = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(end);
    const dayStr = new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      month: "short",
      day: "2-digit",
    }).format(start);
    return `${dayStr} • ${startStr} - ${endStr}`;
  } catch {
    return `${start.toLocaleString()} - ${end.toLocaleString()}`;
  }
}

export default async function Page() {
  const servicesRes = await getServices();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover available services and book the best time for you
          </p>
        </div>
        {servicesRes.data ? (
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {servicesRes.data.length} services
          </span>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {servicesRes.data?.map((service) => {
          const now = new Date();
          const upcomingSlots = service.slots
            .filter((s) => !s.isBooked && new Date(s.endTime) > now)
            .sort(
              (a, b) =>
                new Date(a.startTime).getTime() -
                new Date(b.startTime).getTime()
            )
            .slice(0, 3);

          const providerName =
            service.provider?.name || service.provider?.email || "Provider";
          const initials = providerName
            .split(" ")
            .map((w) => w.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <Link
              key={service.id}
              className="group relative overflow-hidden rounded-2xl border bg-card/60 p-5 shadow-sm ring-1 ring-transparent transition-all hover:shadow-lg"
              href={`/services/${service.id}`}
            >
              <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              {/* available count badge */}
              {(() => {
                const count = service.slots.filter(
                  (s) => !s.isBooked && new Date(s.endTime) > now
                ).length;
                return (
                  <span className="absolute right-4 top-4 rounded-full border bg-background/80 px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    {count} available
                  </span>
                );
              })()}

              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User2 className="size-3.5" />
                    <span className="truncate">{providerName}</span>
                  </div>
                  <h3 className="truncate text-base font-semibold tracking-tight">
                    {service.title}
                  </h3>
                </div>
              </div>

              {service.description ? (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {service.description}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1">
                  <DollarSign className="size-3.5 opacity-70" />
                  <span className="font-medium">
                    {formatPriceEGP(Number(service.price))}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1">
                  <Clock className="size-3.5 opacity-70" />
                  <span className="font-medium">{service.duration} min</span>
                </span>
              </div>

              <div className="mt-5 border-t pt-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CalendarDays className="size-4" />
                  <span>Upcoming slots</span>
                </div>

                {upcomingSlots.length > 0 ? (
                  <ul className="space-y-2">
                    {upcomingSlots.map((slot) => (
                      <li
                        key={slot.id}
                        className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                      >
                        <span className="truncate">
                          {formatTimeRange(
                            new Date(slot.startTime),
                            new Date(slot.endTime)
                          )}
                        </span>
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          Available
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
                    No slots available at the moment
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Added on{" "}
                  {new Date(service.createdAt).toLocaleDateString("en-GB")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
