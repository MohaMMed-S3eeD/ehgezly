import Link from "next/link";
import React from "react";
import AuthBtn from "./authBtn";
import { getUser } from "@/utils/user";

export const Header = async () => {
  const user = await getUser();
  return (
    <div className="flex justify-around items-center p-4 bg-gray-100  border-b border-gray-200 ">
      <nav className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/profile">Profile</Link>

        {user?.role === "PROVIDER" ? (
          <Link href="/providerDashboard">Provider Dashboard</Link>
        ) : (
          <Link href="/customerDashboard">Customer Dashboard</Link>
        )}
      </nav>
      <div>
        <AuthBtn />
      </div>
    </div>
  );
};
