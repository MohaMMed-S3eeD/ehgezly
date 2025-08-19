import React from "react";
import { getServices } from "../providerDashboard/_actions/Service.action";
import { CalendarDays, Clock, DollarSign, User2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

export default async function Page() {
  const servicesRes = await getServices();

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Our Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover available services and book the best time that suits you
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

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4">
          {servicesRes.data?.map((service, index) => {
            const now = new Date();
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
                className=" group relative overflow-hidden rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm p-0 aspect-[4/5] shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-primary/30"
                href={`/services/${service.id}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Background image */}
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    priority={index < 3}
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted" />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/30 to-transparent transition-opacity duration-500 dark:from-background/90 dark:via-background/30" />

                {/* Optional accents */}
                <div className="absolute inset-0 pointer-events-none" />

                {/* Available count badge */}
                <div className="absolute right-4 top-4 z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/95 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    {availableCount} available
                  </span>
                </div>

                <div className="relative z-10 h-full flex items-end ">
                  <div className="w-full p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-2 text-foreground drop-shadow">
                      <div className="flex size-10 items-center justify-center rounded-full bg-black/50 text-white text-xs font-bold backdrop-blur dark:bg-black/40">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-foreground/70 mb-0.5">
                          <User2 className="size-3.5" />
                          <span className="truncate font-medium">
                            {providerName}
                          </span>
                        </div>
                        <h3 className="truncate text-lg font-bold tracking-tight">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    {service.description && (
                      <p className="text-xs sm:text-sm text-foreground/70 line-clamp-2 mb-3 drop-shadow">
                        {service.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 ">
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-primary backdrop-blur">
                        <DollarSign className="size-4" />
                        {formatPriceEGP(Number(service.price))}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-foreground backdrop-blur dark:bg-white/10 dark:text-white/90">
                        <Clock className="size-4" />
                        <span>{service.duration} minutes</span>
                      </span>
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
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No services available
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are no services to display at the moment. Please try again later or contact technical support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
