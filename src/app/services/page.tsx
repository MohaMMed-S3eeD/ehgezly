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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Our Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover available services and book the best time for you
          </p>
          {servicesRes.data && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm font-medium text-primary">
                {servicesRes.data.length} services available
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {servicesRes.data?.map((service, index) => {
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

            const availableCount = service.slots.filter(
              (s) => !s.isBooked && new Date(s.endTime) > now
            ).length;

            return (
              <Link
                key={service.id}
                className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-primary/30"
                href={`/services/${service.id}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500"></div>
                </div>

                {/* Available count badge */}
                <div className="absolute right-4 top-4 z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    {availableCount} available
                  </span>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-bold shadow-lg">
                        {initials}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <User2 className="size-3.5" />
                        <span className="truncate font-medium">{providerName}</span>
                      </div>
                      <h3 className="truncate text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {service.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                      {service.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary">
                      <DollarSign className="size-4" />
                      {formatPriceEGP(Number(service.price))}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-sm font-semibold">
                      <Clock className="size-4 text-accent-foreground" />
                      <span className="text-accent-foreground">{service.duration} min</span>
                    </span>
                  </div>

                  <div className="border-t border-border/50 pt-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <CalendarDays className="size-4 text-primary" />
                      <span>Upcoming Slots</span>
                    </div>

                    {upcomingSlots.length > 0 ? (
                      <ul className="space-y-2">
                        {upcomingSlots.map((slot) => (
                          <li
                            key={slot.id}
                            className="flex items-center justify-between rounded-xl border border-border/30 bg-muted/30 px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
                          >
                            <span className="truncate font-medium">
                              {formatTimeRange(
                                new Date(slot.startTime),
                                new Date(slot.endTime)
                              )}
                            </span>
                            <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400">
                              Available
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="rounded-xl border-2 border-dashed border-border/40 px-4 py-8 text-center">
                        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                          <CalendarDays className="size-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          No slots available
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          Check back later for updates
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/30">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium">
                        Added {new Date(service.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span className="text-primary font-semibold">View Details</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {(!servicesRes.data || servicesRes.data.length === 0) && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <CalendarDays className="size-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Services Available</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are currently no services to display. Please check back later or contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
