import { LogoutAction } from "@/app/(auth)/_actions/auth.action";
import { getUser } from "@/utils/user";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const authBtn = async () => {
  const user = await getUser();
  return (
    <div className="flex gap-4">
      {user ? (
        <form action={LogoutAction}>
          <Button type="submit" variant="destructive" className="px-6">
            Logout
          </Button>
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
