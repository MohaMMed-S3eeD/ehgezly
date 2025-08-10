import React from "react";
import { getUser } from "@/utils/user";

const page = async () => {
  const user = await getUser();
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      <div className="rounded-xl border bg-card/50 shadow-sm">
        <div className="border-b px-4 py-3">
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal information
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center text-xl font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="text-lg font-semibold">{user?.name || "User"}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border bg-background/60 p-4">
              <div className="text-xs text-muted-foreground mb-1">Name</div>
              <div className="text-sm font-medium">{user?.name || "Not available"}</div>
            </div>
            <div className="rounded-lg border bg-background/60 p-4">
              <div className="text-xs text-muted-foreground mb-1">Email</div>
              <div className="text-sm font-medium">{user?.email || "Not available"}</div>
            </div>
            <div className="rounded-lg border bg-background/60 p-4">
              <div className="text-xs text-muted-foreground mb-1">Role</div>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  user?.role === "ADMIN"
                    ? "bg-red-100 text-red-700"
                    : user?.role === "PROVIDER"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {user?.role === "ADMIN"
                  ? "Admin"
                  : user?.role === "PROVIDER"
                  ? "Provider"
                  : "Customer"}
              </span>
            </div>
            <div className="rounded-lg border bg-background/60 p-4">
              <div className="text-xs text-muted-foreground mb-1">Member Since</div>
              <div className="text-sm font-medium">
                {user?.createdAt?.toLocaleDateString() || "Not available"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card/50 shadow-sm">
          <div className="border-b px-4 py-3">
            <h2 className="text-sm font-medium">Bookings</h2>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold">{user?.bookings?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Total bookings</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card/50 shadow-sm">
          <div className="border-b px-4 py-3">
            <h2 className="text-sm font-medium">Services</h2>
          </div>
          <div className="p-6 space-y-3">
            <div className="text-3xl font-bold">{user?.services?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Available services</p>
            {user?.services && user.services.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {user.services.map((service) => (
                  <span key={service.id} className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs">
                    {service.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
