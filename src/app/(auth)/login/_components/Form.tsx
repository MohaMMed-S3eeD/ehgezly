"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoginSchema } from "@/validation/auth/auth";
import { toast } from "sonner";
import { LoginAction } from "../../_actions/auth.action";
import { redirect } from "next/navigation";

const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    const data = {
      email,
      password,
    };
    const validation = LoginSchema.safeParse(data);
    if (!validation.success) {
      validation.error.issues.forEach((issue: { message: string }) => {
        toast.error(issue.message, {
          position: "top-center",
          duration: 3000,
          style: {
            background: "red",
            color: "#fff",
          },
        });
      });
      return;
    }
    const response = await LoginAction(data);

    if (response.error) {
      toast.error(response.error, {
        position: "top-center",
        duration: 3000,
        style: {
          background: "red",
          color: "#fff",
        },
      });
      return;
    } else {
      toast.success("Login successful", {
        position: "top-center",
        duration: 3000,
        style: {
          background: "green",
          color: "#fff",
        },
      });
    }
    redirect("/profile");
  };
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md w-full">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Login
      </h1>
      <form className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          className="w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          className="w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          onClick={() => {
            handleLogin();
          }}
        >
          Login
        </Button>
        <Link href="/register">Register</Link>
      </form>
    </div>
  );
};

export default Form;
