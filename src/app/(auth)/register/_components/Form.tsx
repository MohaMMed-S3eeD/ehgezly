"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RegisterSchema } from "@/validation/auth/auth";
import { RegisterAction } from "../../_actions/auth.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const Form = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const handleRegister = async () => {
    const data = {
      name,
      email,
      password,
      role,
    };
    const validation = RegisterSchema.safeParse(data);
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
    const response = await RegisterAction(data);
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
      toast.success("Register successful", {
        position: "top-center",
        duration: 3000,
        style: {
          background: "green",
          color: "#fff",
        },
      });
      router.push("/login");
    }
  };
  return (
    <div  className="max-w-md mx-auto w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/60 backdrop-blur-md shadow-xl">
      <div className="p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-foreground">Register</h1>
        <p className="text-center text-sm text-muted-foreground mb-6">Create your account to get started</p>
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80">Name</label>
            <Input
              type="text"
              placeholder="Your name"
              className="w-full h-11"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80">Role</label>
            <Select value={role} onValueChange={(value) => setRole(value)}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="PROVIDER">Provider</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            className="w-full h-11 rounded-xl"
            onClick={() => {
              handleRegister();
            }}
            variant="default"
          >
            Register
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <span>Already have an account? </span>
          <Link className="font-medium text-primary hover:underline" href="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Form;
