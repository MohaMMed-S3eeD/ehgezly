"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginSchema } from "@/validation/auth/auth";
import { toast } from "sonner";
import { LoginAction } from "../../_actions/auth.action";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
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

    try {
      setIsLoading(true);
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
      }
      if (response.success) {
        toast.success("Login successful", {
          position: "top-center",
          duration: 3000,
          style: {
            background: "green",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Login failed", {
        position: "top-center",
        duration: 3000,
        style: {
          background: "red",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }

    router.replace("/profile");
    router.refresh();
  };
  return (
    <div className="max-w-md mx-auto w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/60 backdrop-blur-md shadow-xl">
      <div className="p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-foreground">Login</h1>
        <p className="text-center text-sm text-muted-foreground mb-6">Welcome back! Please sign in</p>
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80">Email</label>
            <Input
              dir="ltr"
              type="email"
              placeholder="you@example.com"
              className="w-full h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80">Password</label>
            <Input
              dir="ltr"
              type="password"
              placeholder="••••••••"
              className="w-full h-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="button"
            className="w-full h-11 rounded-xl"
            onClick={() => {
              handleLogin();
            }}
            variant="default"
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <span>Don\'t have an account? </span>
          <Link className="font-medium text-primary hover:underline" href="/register">Create one</Link>
        </div>
       
      </div>
    </div>
  );
};

export default Form;
