import Link from "next/link";
import React from "react";
import { getUser } from "@/utils/user";
import { LogoutAction } from "@/app/(auth)/_actions/auth.action";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import ThemeBtn from "./theemBtn";
import MobileMenu from "./MobileMenu";

export const Header = async () => {
  const user = await getUser();

  const dashboardHref = user
    ? user.role === "PROVIDER"
      ? "/providerDashboard"
      : "/bookings"
    : null;

  return (
    <header className="sticky top-5 z-40 mt-3 w-[92%] max-w-6xl mx-auto rounded-2xl glass animate-slide-down">
      <div className="mx-auto flex h-14 items-center justify-between gap-6 px-6">
        {/* Left: Brand + Primary nav */}
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href="/"
            className="shrink-0 text-xl font-bold text-foreground hover:opacity-80 transition-colors duration-300"
          >
            Ehgezly
          </Link>
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="rounded-xl px-4 py-2.5 text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-all duration-300 hover:scale-105 font-medium"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="rounded-xl px-4 py-2.5 text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-all duration-300 hover:scale-105 font-medium"
            >
              Services
            </Link>
            <Link
              href="/profile"
              className="rounded-xl px-4 py-2.5 text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-all duration-300 hover:scale-105 font-medium"
            >
              Profile
            </Link>
            {dashboardHref && user?.role === "CUSTOMER" ? (
              <Link
                href={dashboardHref}
                className="rounded-xl px-4 py-2.5 text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-all duration-300 hover:scale-105 font-medium"
              >
                My Bookings
              </Link>
            ) : (
              <Link
                href={"/providerDashboard"}
                className="rounded-xl px-4 py-2.5 text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-all duration-300 hover:scale-105 font-medium"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Auth + actions */}
        <div className="flex items-center gap-3">
          <ThemeBtn />

          {user ? (
            <form action={LogoutAction}>
              <Button
                type="submit"
                variant="outline"
                className="gap-2 text-foreground bg-transparent border-foreground/20 hover:bg-foreground/10 hover:border-foreground/30 transition-all duration-300 hover:scale-105 font-medium rounded-xl"
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-foreground hover:bg-foreground/10 transition-all duration-300 hover:scale-105 font-medium rounded-xl"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="glass text-foreground transition-all duration-300 hover:scale-105 font-medium rounded-xl border border-foreground/10">
                  Register
                </Button>
              </Link>
            </div>
          )}

          <MobileMenu dashboardHref={dashboardHref} />
        </div>
      </div>
    </header>
  );
};
