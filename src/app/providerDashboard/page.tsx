import React from "react";
import { getUser } from "@/utils/user";
import Link from "next/link";
import ServiceCard from "./_components/ServiceCard";
import { Button } from "@/components/ui/button";

const ProviderDashboardPage = async () => {
  const user = await getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Provider Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Please sign in to view your dashboard.
        </p>
        <div className="mt-4">
          <Button asChild>
            <Link href="/login">Go to login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      <header className="rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Hi {user.name}</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back to your provider dashboard
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Your services</h2>
        {user.services && user.services.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {user.services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground">You have no services yet.</p>
            <div className="mt-3">
              <Button asChild>
                <Link href="/providerDashboard/addService">Add your first service</Link>
              </Button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild>
            <Link href="/providerDashboard/addService">Add Service</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/providerDashboard/bookings">Bookings</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Your last 5 bookings</h2>
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
      </section>
    </div>
  );
};

export default ProviderDashboardPage;
