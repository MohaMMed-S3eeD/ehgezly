"use client";
import { LogoutAction } from "@/app/(auth)/_actions/auth.action";
import { getUser } from "@/utils/user";
import Link from "next/link";
import React from "react";

export const Navbar = async () => {
  const user = await getUser();
  console.log(user);
  return (
    <div className="flex justify-around items-center p-4 bg-gray-100  border-b border-gray-200 ">
      <nav className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/profile">Profile</Link>

        <Link href="/providerDashboard">Provider Dashboard</Link>
      </nav>
      <div className="flex gap-4">
        {user ? (
          <form action={LogoutAction}>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </form>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
};
