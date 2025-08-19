import React from "react";
import { getUser } from "@/utils/user";
import Link from "next/link";
import ServiceCard from "./_components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Briefcase, CalendarClock } from "lucide-react";

const ProviderDashboardPage = async () => {
  const user = await getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="overflow-hidden rounded-2xl border bg-card/50 shadow-sm">
          <div className="border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-4 py-6">
            <h1 className="text-2xl font-semibold tracking-tight">Provider Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Please sign in to view your dashboard.</p>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="secondary">
                <Link href="/login">Go to login</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      <header className="overflow-hidden rounded-2xl border bg-card/50 shadow-sm">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-4 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">Hi {user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back to your provider dashboard</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/providerDashboard/addService">Add Service</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/providerDashboard/bookings">View Bookings</Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 border-t bg-background/60 p-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="size-5 text-primary" />
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Services</div>
              <div className="text-lg font-semibold">{user.services?.length ?? 0}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <CalendarClock className="size-5 text-primary" />
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Bookings</div>
              <div className="text-lg font-semibold">{user.bookings?.length ?? 0}</div>
            </div>
          </div>
        </div>
      </header>

      <section>
        <div className="rounded-2xl border bg-card/50 shadow-sm">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-medium">Your services</h2>
            {user.services && user.services.length > 0 ? (
              <Button asChild size="sm" variant="ghost">
                <Link href="/providerDashboard/addService">Add new</Link>
              </Button>
            ) : null}
          </div>
          <div className="p-4 space-y-4">
            {user.services && user.services.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {user.services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-background/70 p-8 text-center">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">No services yet</div>
                <p className="max-w-sm text-sm text-muted-foreground">Start by creating your first service to accept bookings.</p>
                <Button asChild className="mt-2">
                  <Link href="/providerDashboard/addService">Create a service</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="rounded-2xl border bg-card/50 shadow-sm">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-medium">Your last 5 bookings</h2>
            {user.bookings && user.bookings.length > 0 ? (
              <Button asChild size="sm" variant="ghost">
                <Link href="/providerDashboard/bookings">View all</Link>
              </Button>
            ) : null}
          </div>
          <div className="p-4">
            {user.bookings && user.bookings.length > 0 ? (
              <ul className="divide-y rounded-xl border bg-card shadow-sm">
                {user.bookings.slice(0, 5).map((booking) => (
                  <li key={booking.id} className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-md border bg-background">
                          <CalendarClock className="size-4 opacity-70" />
                        </div>
                        <div>
                          <div className="font-medium">Booking #{booking.id}</div>
                          <div className="text-xs text-muted-foreground">Service: {booking.serviceId}</div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-background/70 p-8 text-center">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">No bookings yet</div>
                <p className="max-w-sm text-sm text-muted-foreground">Your recent bookings will appear here once customers start booking your services.</p>
                <div className="mt-2">
                  <Button asChild variant="outline">
                    <Link href="/providerDashboard/addService">Create a service</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProviderDashboardPage;
