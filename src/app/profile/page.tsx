import { auth } from "@/auth";
import React from "react";
import { LogoutAction } from "../(auth)/_actions/auth.action";

const page = async () => {
  const session = await auth();
  console.log("session", session);
  return (
    <div>
      <h1>Profile</h1>
      <p>{session?.user?.name}</p>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.image}</p>
      <p>{session?.user?.id}</p>
      <form action={LogoutAction}>
        <button type="submit" className="bg-red-500 text-white p-2 rounded-md">
          Logout
        </button>
      </form>
    </div>
  );
};

export default page;
