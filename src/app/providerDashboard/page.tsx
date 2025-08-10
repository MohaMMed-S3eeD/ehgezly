import React from "react";
import { getUser } from "@/utils/user";
import Link from "next/link";
import ServiceCard from "./_components/ServiceCard";
import { Button } from "@/components/ui/button";

const ProviderDashboardPage = async () => {
  const user = await getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-xl border bg-card/50 shadow-sm">
          <div className="border-b px-4 py-3">
            <h1 className="text-2xl font-semibold tracking-tight">Provider Dashboard</h1>
          </div>
          <div className="p-4">
            <p className="mt-1 text-sm text-muted-foreground">
              Please sign in to view your dashboard.
            </p>
            <div className="mt-4">
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
      <header className="rounded-xl border bg-card/50 shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">Hi {user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back to your provider dashboard
          </p>
        </div>
      </header>

      <section>
        <div className="rounded-xl border bg-card/50 shadow-sm">
          <div className="border-b px-4 py-3">
            <h2 className="text-sm font-medium">Your services</h2>
          </div>
          <div className="p-4 space-y-4">
            {user.services && user.services.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {user.services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">You have no services yet.</p>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="secondary">
                <Link href="/providerDashboard/addService">Add Service</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/providerDashboard/bookings">Bookings</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="rounded-xl border bg-card/50 shadow-sm">
          <div className="border-b px-4 py-3">
            <h2 className="text-sm font-medium">Your last 5 bookings</h2>
          </div>
          <div className="p-4">
            {user.bookings && user.bookings.length > 0 ? (
              <ul className="divide-y rounded-lg border bg-card shadow-sm">
                {user.bookings.slice(0, 5).map((booking) => (
                  <li key={booking.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Booking #{booking.id}</span>
                      <span className="text-sm text-muted-foreground">
                        Service: {booking.serviceId}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No bookings yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProviderDashboardPage;
