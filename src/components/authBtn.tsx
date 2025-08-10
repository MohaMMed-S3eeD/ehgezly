import { LogoutAction } from "@/app/(auth)/_actions/auth.action";
import { getUser } from "@/utils/user";
import Link from "next/link";
import React from "react";

const authBtn = async () => {
  const user = await getUser();
  return (
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
  );
};

export default authBtn;
