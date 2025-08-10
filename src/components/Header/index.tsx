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
      : "/customerDashboard"
    : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Left: Brand + Primary nav */}
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="shrink-0 text-base font-semibold">
            Ehgezly
          </Link>
          <nav className="hidden md:flex items-center gap-1.5 text-sm">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              Services
            </Link>
            <Link
              href="/profile"
              className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              Profile
            </Link>
            {dashboardHref ? (
              <Link
                href={dashboardHref}
                className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                Dashboard
              </Link>
            ) : null}
          </nav>
        </div>

        {/* Right: Auth + actions */}
        <div className="flex items-center gap-2">
          <ThemeBtn />

          {user ? (
            <form action={LogoutAction}>
              <Button type="submit" variant="outline" className="gap-1.5">
                <LogOut className="size-4" />
                Logout
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}

          <MobileMenu dashboardHref={dashboardHref} />
        </div>
      </div>
    </header>
  );
};
