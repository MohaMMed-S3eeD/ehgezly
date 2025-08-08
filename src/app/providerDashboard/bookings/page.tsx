import React from "react";
import { getUser } from "@/utils/user";

const page = async () => {
  const user = await getUser();
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Bookings</h1>
      <p className="mt-1 text-muted-foreground">All your recent bookings.</p>

      {user?.bookings && user.bookings.length > 0 ? (
        <ul className="mt-6 divide-y rounded-lg border bg-card shadow-sm">
          {user.bookings.map((booking) => (
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
        <p className="mt-6 text-muted-foreground">No bookings yet.</p>
      )}
    </div>
  );
};

export default page;
