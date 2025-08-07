import { auth } from "@/auth";
import React from "react";

const page = async () => {
  const session = await auth();
  console.log( "session", session);
  return (
    <div>
      <h1>Profile</h1>
      <p>{session?.user?.name}</p>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.image}</p>
      <p>{session?.user?.id}</p>
    </div>
  );
};

export default page;
